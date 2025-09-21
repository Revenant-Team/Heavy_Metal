import { saveResults,fetchHmpiResults } from "../controller/resultOp.controller.js";
import { Router } from "express";
const router = Router()

router.post('/saveResults',saveResults)
router.get('/fetchResults',fetchHmpiResults)

export default router