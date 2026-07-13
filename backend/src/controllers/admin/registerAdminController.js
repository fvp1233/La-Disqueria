import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import adminModel from "../../models/admin/admin.js";
import { config } from "../../../config.js";

const registerAdminController = {};

registerAdminController.register = async (req, res) => {
    try {
        const {
            name, last_name, email, password
        } = req.body;

        // Validar que no exista ya un admin
        const adminCount = await adminModel.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ message: "An admin already exists in the system" });
        }

        const passwordHashed = await bcryptjs.hash(password, 10);

        const newAdmin = new adminModel({
            name,
            last_name,
            email,
            password: passwordHashed,
            is_active: true,
            loginAttempts: 0,
            timeOut: null,
        });

        await newAdmin.save();

        return res.status(201).json({ message: "Admin registered successfully" });

    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Verificar codigo
registerAdminController.verifyCode =
    async (req, res) => {

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
                is_active,
                loginAttempts,
                timeOut,
            } = decoded;

            //Validar que no exista un admin antes
            const adminCount = await adminModel.countDocuments();

            if (adminCount > 0) {
                //Se borra la imagen ya que no se completará el registro
                // await cloudinary.uploader.destroy(public_id);

                return res.status(400).json({ message: "An admin already exists in the system" });
            }

            // CREAR ADMIN
            const newAdmin =
                new adminModel({
                    name,
                    last_name,
                    email,
                    password,
                    is_active,
                    loginAttempts,
                    timeOut,
                });

            await newAdmin.save();

            res.clearCookie("registrationCookie");
            return res.status(200).json({ message: "Admin registered" });
        } catch (error) {
            console.log("error " + error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
export default registerAdminController