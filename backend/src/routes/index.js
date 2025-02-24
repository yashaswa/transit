import express from "express"
import { create } from "../controller/login-controller";


const router = express.Router();

router.create('/city',create);