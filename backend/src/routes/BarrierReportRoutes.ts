import { Router } from "express";
import { barrierReportController } from "../controllers/BarrierReportController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

// 审核员与设施管理员可执行障碍工单核实闭环；本地开发默认角色 admin 同样放行
const verifyRoles = ["admin", "AUDITOR", "FACILITY_MANAGER"];

router.get("/", barrierReportController.list);
router.post("/", barrierReportController.create);
router.patch("/:id/verify", rbacMiddleware(verifyRoles), barrierReportController.verify);

export default router;
