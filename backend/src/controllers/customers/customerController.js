import customerModel from "../../models/customers/customer.js";
import bcryptjs from "bcryptjs";

const customersController = {};

const DUI_REGEX = /^\d{8}-\d$/;
const PHONE_REGEX = /^\d{4}-\d{4}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

const normalizePhone = (value = "") => value.replace(/^\+?503\s*/, "").trim();

customersController.getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();

    return res.status(200).json(customers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

customersController.createCustomer = async (req, res) => {
  try {
    let {
      name,
      last_name,
      email,
      dui,
      password,
      phone,
      addresses,
      is_active,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    // Validaciones
    name = name?.trim();
    last_name = last_name?.trim();
    email = email?.trim().toLowerCase();
    dui = dui?.trim();
    password = password?.trim();
    phone = normalizePhone(phone || "");

    if (Array.isArray(addresses)) {
      addresses = addresses.map((address) => ({
        street: address.street?.trim(),
        city: address.city?.trim(),
      }));
    }

    if (!name || !last_name || !email || !dui || !phone || !password) {
      return res.status(400).json({
        message: "Fields required",
      });
    }

    if (name.length < 3 || name.length > 15) {
      return res.status(400).json({
        message: "Please insert a valid name",
      });
    }

    if (last_name.length < 3 || last_name.length > 15) {
      return res.status(400).json({
        message: "Please insert a valid last name",
      });
    }

    if (!DUI_REGEX.test(dui)) {
      return res.status(400).json({ message: "Invalid DUI format" });
    }

    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        message: "The password must be between 8 and 20 characters long",
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const duplicate = await customerModel.findOne({
      $or: [{ email }, { dui }, { phone }],
    });

    if (duplicate) {
      if (duplicate.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (duplicate.dui === dui) {
        return res.status(400).json({ message: "DUI already registered" });
      }
      return res.status(400).json({ message: "Phone already registered" });
    }

    const passwordHashed = await bcryptjs.hash(password, 10);

    const newCustomer = new customerModel({
      name,
      last_name,
      email,
      dui,
      password: passwordHashed,
      phone,
      addresses,
      is_active: is_active ?? true,
      isVerified: isVerified ?? true,
      loginAttemps: loginAttemps ?? 0,
      timeOut: timeOut ?? null,
    });

    await newCustomer.save();

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

customersController.updateCustomers = async (req, res) => {
  try {
    let { name, last_name, email, dui, password, phone, addresses, is_active, isVerified } =
      req.body;

    email = email?.trim().toLowerCase();
    dui = dui?.trim();
    phone = phone ? normalizePhone(phone) : phone;

    if (dui && !DUI_REGEX.test(dui)) {
      return res.status(400).json({ message: "Invalid DUI format" });
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    const uniqueChecks = [email && { email }, dui && { dui }, phone && { phone }].filter(
      Boolean,
    );

    if (uniqueChecks.length > 0) {
      const duplicate = await customerModel.findOne({
        _id: { $ne: req.params.id },
        $or: uniqueChecks,
      });

      if (duplicate) {
        if (email && duplicate.email === email) {
          return res.status(400).json({ message: "Email already registered" });
        }
        if (dui && duplicate.dui === dui) {
          return res.status(400).json({ message: "DUI already registered" });
        }
        return res.status(400).json({ message: "Phone already registered" });
      }
    }

    const customerUpdated = await customerModel.findByIdAndUpdate(
      req.params.id,
      { name, last_name, email, dui, password, phone, addresses, is_active, isVerified },
      { new: true },
    );

    if (!customerUpdated) {
      return res.status(400).json({ message: "Customer not found" });
    }
    return res.status(200).json({ message: "Customer updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
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