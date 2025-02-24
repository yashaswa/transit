import type { Request, Response } from "express";
import LoginService from "../service/login-service";

const loginService = new LoginService(); 

export const create = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body; 
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: {},
                err: { field: "email", message: "Missing required field" }
            });
        }

        const user = await loginService.create(name, email); // Use the instance method
        return res.status(201).json({
            data: user,
            success: true,
            message: "Successfully created a user",
            err: {}
        });
    } catch (error: any) {
        console.error("Error creating user:", error);

        return res.status(500).json({
            data: {},
            success: false,
            message: error.message || "Not able to create a user",
            err: error
        });
    }
};
