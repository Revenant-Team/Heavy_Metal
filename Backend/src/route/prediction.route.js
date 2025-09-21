import { predictPollutionSource } from "../controller/Prediction.controller.js";
import { Router } from "express";
const router = Router()

router.post('/pollutionSourceDetect',predictPollutionSource)

export default router