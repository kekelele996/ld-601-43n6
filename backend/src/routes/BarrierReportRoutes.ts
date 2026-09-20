import { Router } from "express";
import { barrierReportController } from "../controllers/BarrierReportController";

const router = Router();
router.get("/", barrierReportController.list);
router.post("/", barrierReportController.create);
router.post("/:id/verify", barrierReportController.verify);

export default router;
