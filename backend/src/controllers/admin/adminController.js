import adminModel from "../../models/admin/admin.js";

const adminController = {};

adminController.getAdmins = async (req, res) => {
  try {
    const response = await adminModel.find();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

adminController.updateAdmin = async (req, res) => {
  try {
    const { name, last_name, email, password, is_active } = req.body;

    const response = await adminModel.findById(req.params.id);
    const payload = {
      name,
      last_name,
      email,
      password,
      is_active,
    };
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true },
    );
    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });
    return res
      .status(200)
      .json({ message: "Admin updated", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
    const response = await adminModel.findById(req.params.id);
    if (!response) return res.status(404).json({ message: "Admin not found" });
    await adminModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default adminController;
