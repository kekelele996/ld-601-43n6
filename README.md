# 无障碍出行协助平台

面向视障、轮椅和行动不便人群的室内外无障碍路线协助系统，聚合站点、设施、路线、志愿协助与障碍上报流程。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

启动后：

- 前端：<http://localhost:20101>
- 后端健康检查：<http://localhost:21101/health>

## 障碍工单核实闭环

障碍工单（BarrierReport）默认按 `verify_status = PENDING（待核实）` 筛选，列表展示关联设施与受影响路线数。

- **核实通过**：前端调用 `POST /api/barrier-report/:id/verify`，请求体 `{"action":"approve"}`。服务端在**同一次请求**中原子完成三件事：
  1. 工单 `verify_status` 置为 `APPROVED`；
  2. 关联设施 `AccessibleFacility.status` 置为 `BLOCKED` 并刷新 `last_checked_at`；
  3. 所有 `facility_ids` 引用该设施的路线 `RoutePlan.risk_level` 置为 `HIGH`。
- **驳回**：`{"action":"reject","reason":"..."}`，仅更新工单为 `REJECTED`，设施与路线不变。
- **重复处理**：工单已不是 PENDING 时再次核实，服务端返回 `409 BARRIER_REPORT_ALREADY_VERIFIED`；前端直接提示，不回退本地假数据。
- **操作后刷新**：无论通过还是驳回，前端都用返回后重新拉取的工单、设施、路线列表刷新；无乐观更新，因此服务端失败时无需回滚。设施巡检页与路线规划页挂载/刷新时同样从接口读取最新状态。

```bash
# CLI 示例
curl -X POST http://localhost:21101/api/barrier-report/1/verify \
  -H "Content-Type: application/json" -d '{"action":"approve"}'
curl -X POST http://localhost:21101/api/barrier-report/2/verify \
  -H "Content-Type: application/json" -d '{"action":"reject","reason":"现场未发现障碍"}'
```

## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`（端口 20101）
- 后端：`cd backend && npm install && npm run dev`（端口 3000，接口统一挂在 `/api`）
- 前端仅通过相对路径 `/api` 请求后端（Nginx 反向代理到 `http://backend:3000/`），不硬编码 localhost。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Zustand（无 UI 新依赖，原生样式） |
| 后端 | Express + TypeScript（分层 routes/controllers/services/repositories） |
| 数据库 | PostgreSQL 15（本地种子数据，禁止第三方 API） |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `accessroute`
- `FRONTEND_PORT`: 前端端口，默认 `20101`
- `BACKEND_PORT`: 后端端口，默认 `21101`
- `DB_PORT`: 数据库宿主机端口，默认 `54320`
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据
- `JWT_SECRET`: 本地 JWT 密钥

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: accessroute`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-accessroute}` 前缀。
- 数据库使用命名卷 `db_data`，避免绑定中文路径；配置 healthcheck，后端 `depends_on: condition: service_healthy`。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- MobilityType: 前后端 `constants/MobilityType`、`types/MobilityType`、constructors、logTemplates、errorMessages、筛选器、展示组件均有引用。
- FacilityStatus（AVAILABLE/BLOCKED/MAINTENANCE/UNKNOWN）: 前后端 `constants/FacilityStatus`、模型类型、constructors、logTemplates（设施状态变更模板）、errorMessages、设施巡检页筛选器、`FacilityTag`/`StatusBadge` 展示组件、BarrierReportService 审核联动。
- AssistanceStatus: 前后端 `constants/AssistanceStatus`、`types/AssistanceStatus`、constructors、logTemplates、errorMessages、筛选器、展示组件均有引用。
- VerifyStatus（PENDING/APPROVED/REJECTED，新增）: 后端 `constants/VerifyStatus.ts`、`models/BarrierReport.ts`、BarrierReportService/Controller/Routes、DtoFactory；前端 `constants/VerifyStatus.ts`、`types/BarrierReport.ts`、BarrierReportConstructor、BarrierReportStore、ReportsPage 筛选器与 `StatusBadge`。
- RiskLevel（LOW/MEDIUM/HIGH，新增）: 后端 `constants/RiskLevel.ts`、`models/RoutePlan.ts`、RoutePlanService/Repository；前端 `constants/RiskLevel.ts`、`types/RoutePlan.ts`、`RouteRiskPanel`、RoutesPage、`formatRisk`。
- 错误码：`BARRIER_REPORT_NOT_FOUND`(404)、`BARRIER_REPORT_ALREADY_VERIFIED`(409)、`FACILITY_NOT_FOUND`(404) 集中于前后端 `constants/errorCodes.ts` 与 `errorMessages.ts`，由 service/controller 分别包装抛出。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；一次“核实通过”要同时改动 BarrierReport、AccessibleFacility、RoutePlan 三类实体，并同步后端 constants/service/repository、前端 api/store/constants/types/constructors/页面/README 与数据库种子。

## License

MIT
