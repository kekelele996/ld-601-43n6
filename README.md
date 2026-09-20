# 无障碍出行协助平台

面向视障、轮椅和行动不便人群的室内外无障碍路线协助系统，聚合站点、设施、路线、志愿协助与障碍上报流程。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20101>

后端健康检查：<http://localhost:21101/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | PostgreSQL 15 |
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
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: accessroute`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-accessroute}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- MobilityType: constants/MobilityType、types/MobilityType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- FacilityStatus: constants/FacilityStatus、types/FacilityStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AssistanceStatus: constants/AssistanceStatus、types/AssistanceStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- BarrierVerifyStatus（PENDING/APPROVED/REJECTED）：后端 constants/BarrierVerifyStatus、types/BarrierReportPayload、models/BarrierReport、services/BarrierReportService、repositories/BarrierReportRepository、constructors/BarrierReportDtoFactory；前端 constants/BarrierVerifyStatus、types/BarrierVerifyStatus、types/BarrierReport、types/VerifyDecision、types/BarrierVerifyResult、utils/formatters、constants/statusText、hooks/useBarrierVerifyFlow、pages/ReportsPage 均有引用。
- RouteRiskLevel（LOW/MEDIUM/HIGH）：后端 constants/RouteRiskLevel、models/RoutePlan、services/BarrierReportService、repositories/RoutePlanRepository；前端 constants/RouteRiskLevel、types/RouteRiskLevel、constants/statusText、utils/formatters、components/common/RouteRiskPanel、pages/RoutesPage 均有引用。

## 障碍工单核实闭环

- 接口：`PATCH /api/barrier-report/:id/verify`，请求体 `{"decision": "APPROVED" | "REJECTED"}`，受 `rbacMiddleware`（admin/AUDITOR/FACILITY_MANAGER）保护。
- 核实通过（APPROVED）：同一次请求内把关联设施状态置为 `BLOCKED`（并刷新 `last_checked_at`），再把所有 `facility_ids` 引用该设施的路线 `risk_level` 置为 `HIGH`，最后更新工单为 APPROVED；响应同时返回工单、设施、受影响路线及数量。
- 驳回（REJECTED）：只更新工单状态，不改动设施与路线。
- 重复处理非 `PENDING` 工单统一返回 `409 BARRIER_ALREADY_VERIFIED`；工单不存在 `404`，动作非法 `400`，关联设施缺失 `422`，越权 `403`。
- 前端障碍工单页默认筛选“待核实”，展示关联设施与受影响路线数；操作成功后经 `useBarrierVerifyFlow` 从接口重新拉取工单/设施/路线，设施巡检与路线规划页同步显示最新结果。服务端失败直接通过消息提示，接口层不做任何本地假数据回退。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
