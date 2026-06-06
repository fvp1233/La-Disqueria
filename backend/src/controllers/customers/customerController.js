import customerModel from "../../models/customers/customer.js";

const customersController = {};

customersController.getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();

    return res.status(200).json(customers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

customersController.updateCustomers = async (req, res) => {
  try {
    let {
      name,
      last_name,
      email,
      password,
      phone,
      adreesses,
      isActive,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    const customerUpdated = await customerModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        last_name,
        email,
        password,
        phone,
        adreesses,
        isActive,
        isVerified,
      },
      {
        new: true,
      },
    );

    if (!customerUpdated) {
      return res.status(400).json({ message: "Customer not found" });
    }
    return res.status(200).json({ message: "Customer updated" });
  } catch (error) {}
  console.log("error" + error);
  return res.status(500).json({ message: "Internal server error" });
};

customersController.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await customerModel.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(400).json({ message: "Customer not found" });
    }
    return res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default customersController