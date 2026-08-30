import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { config } from "../../../config.js";
import customerModel from "../../models/customers/customer.js";

const passwordRecoveryController = {};

const RECOVERY_COOKIE = "passwordRecoveryCookie";
const CODE_TTL_MINUTES = 15;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user_email,
      pass: config.email.password_email,
    },
  });

// Plantilla del correo que lleva el codigo de recuperacion con la identidad de la tienda.
const buildRecoveryEmailHtml = (code) => `
<div style="margin:0;background:#e7e3db;padding:40px 20px;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#f6f1ea;border:1px solid #e3dccf;border-radius:18px;overflow:hidden;">
    <div style="background:#4A5D5E;padding:24px 32px;">
      <span style="font-family:'Arial Narrow',Arial,sans-serif;font-weight:800;font-size:22px;color:#ffffff;letter-spacing:0.4px;">La disquería</span>
    </div>
    <div style="padding:34px 36px;">
      <h1 style="margin:0 0 14px;font-size:26px;color:#1c1917;">Restablece tu contraseña</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#5f574d;">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta. Ingresa el siguiente código en la aplicación para continuar.
      </p>
      <div style="background:#ffffff;border:1px dashed #d8b7a6;border-radius:14px;text-align:center;padding:22px 20px;margin:22px 0;">
        <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#a49a8d;">Código de recuperación</div>
        <div style="font-size:40px;font-weight:800;letter-spacing:10px;color:#E8602A;margin:8px 0 4px;">${code.toUpperCase()}</div>
        <div style="font-size:12px;color:#8c8377;">Este código expira en ${CODE_TTL_MINUTES} minutos</div>
      </div>
      <p style="margin:0;font-size:12.5px;line-height:1.6;color:#8c8377;">
        Si no solicitaste este cambio, ignora este correo y tu contraseña seguirá igual. Nunca compartas este código con nadie.
      </p>
    </div>
    <div style="text-align:center;padding:20px 32px;">
      <p style="margin:0;font-size:11.5px;color:#9a9184;">La disquería · San Salvador, El Salvador</p>
    </div>
  </div>
</div>
`;

passwordRecoveryController.requestCode = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const customer = await customerModel.findOne({ email });

    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const recoveryCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      { email, code: recoveryCode, stage: "request" },
      config.JWT.secret,
      { expiresIn: `${CODE_TTL_MINUTES}m` },
    );

    res.cookie(RECOVERY_COOKIE, token, { maxAge: CODE_TTL_MINUTES * 60 * 1000 });

    const transporter = createTransporter();

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Código para restablecer tu contraseña",
      html: buildRecoveryEmailHtml(recoveryCode),
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Code sent" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

passwordRecoveryController.verifyCode = async (req, res) => {
  try {
    const code = req.body.code?.trim();
    const token = req.cookies[RECOVERY_COOKIE];

    if (!token) {
      return res.status(400).json({ message: "Recovery session expired" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!code || code.toLowerCase() !== decoded.code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const verifiedToken = jsonwebtoken.sign(
      { email: decoded.email, code: decoded.code, stage: "verified" },
      config.JWT.secret,
      { expiresIn: `${CODE_TTL_MINUTES}m` },
    );

    res.cookie(RECOVERY_COOKIE, verifiedToken, {
      maxAge: CODE_TTL_MINUTES * 60 * 1000,
    });

    return res.status(200).json({ message: "Code verified" });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Recovery session expired" });
    }
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

passwordRecoveryController.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const token = req.cookies[RECOVERY_COOKIE];

    if (!token) {
      return res.status(400).json({ message: "Recovery session expired" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.stage !== "verified") {
      return res.status(400).json({ message: "Code not verified" });
    }

    const newPassword = password?.trim();

    if (!newPassword || newPassword !== confirmPassword?.trim()) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      return res.status(400).json({
        message: "The password must be between 8 and 20 characters long",
      });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          "The password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      });
    }

    const customer = await customerModel.findOne({ email: decoded.email });

    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const samePassword = await bcryptjs.compare(newPassword, customer.password);

    if (samePassword) {
      return res.status(400).json({
        message: "The new password must be different from the current one",
      });
    }

    customer.password = await bcryptjs.hash(newPassword, 10);
    customer.loginAttemps = 0;
    customer.timeOut = null;
    await customer.save();

    res.clearCookie(RECOVERY_COOKIE);

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Recovery session expired" });
    }
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default passwordRecoveryController;
