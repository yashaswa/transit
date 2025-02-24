
import express from "express";
import { create } from "../../controller/login-controller";

const router = express.Router();

router.post('/user', create);


export default router; 
