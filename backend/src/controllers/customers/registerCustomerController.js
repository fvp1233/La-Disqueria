import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { config } from "../../../config.js";
import customerModel from "../../models/customers/customer.js";

const registerCustomerController = {};

const DUI_REGEX = /^\d{8}-\d$/;
const PHONE_REGEX = /^\d{4}-\d{4}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

// Deja el telefono en el formato ####-#### aunque llegue con el prefijo del pais.
const normalizePhone = (value = "") => value.replace(/^\+?503\s*/, "").trim();

registerCustomerController.registerCustomer = async (req, res) => {
  try {
    let { name, last_name, email, dui, password, phone, addresses } = req.body;

    name = name?.trim();
    last_name = last_name?.trim();
    email = email?.trim().toLowerCase();
    dui = dui?.trim();
    password = password?.trim();
    phone = normalizePhone(phone || "");

    if (Array.isArray(addresses) && addresses[0]) {
      addresses[0].street = addresses[0].street?.trim();
      addresses[0].city = addresses[0].city?.trim();
    }

    if (!name || !last_name || !email || !dui || !phone || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    if (name.length < 3 || name.length > 15) {
      return res.status(400).json({ message: "Please insert a valid name" });
    }

    if (last_name.length < 3 || last_name.length > 15) {
      return res.status(400).json({ message: "Please insert a valid last name" });
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
          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
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
    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        last_name,
        email,
        dui,
        password: passwordHashed,
        phone,
        addresses,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.password_email,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text: `Para verificar tu cuenta usa este código: ${randomCode}. Expira en 15 minutos.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

registerCustomerController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;
    const token = req.cookies.registrationCookie;

    if (!token) {
      return res.status(400).json({ message: "Expired registration" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomCode: storedCode,
      name,
      last_name,
      email,
      dui,
      password,
      phone,
      addresses,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const duplicate = await customerModel.findOne({
      $or: [{ email }, { dui }, { phone }],
    });

    if (duplicate) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const newCustomer = new customerModel({
      name,
      last_name,
      email,
      dui,
      password,
      phone,
      addresses,
      is_active: true,
      isVerified: true,
      loginAttemps: 0,
      timeOut: null,
    });
    await newCustomer.save();

    res.clearCookie("registrationCookie");

    return res.status(200).json({ message: "Customer registered" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerCustomerController;
