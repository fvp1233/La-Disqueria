import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { config } from "../../../config.js";
import customerModel from "../../models/customers/customer.js";

const registerCustomerController = {};

registerCustomerController.registerCustomer = async (req, res) => {
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

    //Validaciones
    name = name?.trim();
    last_name = last_name?.trim();
    email = email?.trim();
    password = password?.trim();
    phone = phone?.trim();

    if (Array.isArray(adreesses) && adreesses[0]) {
      adreesses[0].street = adreesses[0].street?.trim();
      adreesses[0].city = adreesses[0].city?.trim();
    }

    if (!name || !last_name || !email || !phone || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    if (name.length < 3 || name.length > 15) {
      return res.status(400).json({ message: "Please insert a valid name" });
    }

    if (last_name.length < 3 || last_name.length > 15) {
      return res
        .status(400)
        .json({ message: "Please insert a valid last name" });
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        message: "The password must be between 8 and 20 characters long",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      });
    }

    const existCustomer = await customerModel.findOne({ email });
    if (existCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    //Si pasa todas las validaciones encripta la contraseña y sigue con su proceso

    const passwordHashed = await bcryptjs.hash(password, 10);

    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        last_name,
        email,
        password: passwordHashed,
        phone,
        adreesses,
        isActive,
        isVerified,
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
      text:
        "Para verificar tu cuenta, usa este código" +
        randomCode +
        "expira en 15 minutos",
    };

    transporter.sendMail(mailOptions, (error, info) => {
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

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    const {
      randomCode: storedCode,
      name,
      last_name,
      email,
      password,
      phone,
      adreesses,
      isActive,
      isVerified,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newCustomer = customerModel({
      name,
      last_name,
      email,
      password,
      phone,
      adreesses,
      isActive: true,
      isVerified: true,
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
