import { Router } from "express";
import { upload } from "../middleware/uploadFile.middleware.js";
import { csvProcessor } from "../controller/csvProcessor.controller.js";


const router = Router()

router.post('/upload-csv',upload.single('csvFile'),csvProcessor)

export default router