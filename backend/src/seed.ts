export const seed = {
  "userProfile": [
    {
      "id": 1,
      "nickname": "林晓",
      "phone": "13800000001",
      "mobility_type": "LOW_VISION",
      "assistive_device": "盲杖",
      "emergency_contact": "林母 13900000001",
      "preferred_language": "zh-CN",
      "created_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "nickname": "周建国",
      "phone": "13800000002",
      "mobility_type": "WHEELCHAIR",
      "assistive_device": "手动轮椅",
      "emergency_contact": "周妻 13900000002",
      "preferred_language": "zh-CN",
      "created_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "nickname": "吴桂芳",
      "phone": "13800000003",
      "mobility_type": "ELDERLY",
      "assistive_device": "助行器",
      "emergency_contact": "吴子 13900000003",
      "preferred_language": "zh-CN",
      "created_at": "2026-06-13T09:00:00Z"
    }
  ],
  "accessibleFacility": [
    {
      "id": 1,
      "facility_type": "坡道",
      "name": "南门无障碍坡道",
      "location_code": "GATE-SOUTH-RAMP",
      "floor": "1F",
      "status": "AVAILABLE",
      "last_checked_at": "2026-09-15T09:00:00Z",
      "owner_department": "后勤保障部",
      "note": "连接南门广场与一楼大厅"
    },
    {
      "id": 2,
      "facility_type": "电梯",
      "name": "主楼无障碍电梯",
      "location_code": "MAIN-LIFT-01",
      "floor": "1F-3F",
      "status": "MAINTENANCE",
      "last_checked_at": "2026-09-10T09:00:00Z",
      "owner_department": "设备运维部",
      "note": "按钮面板检修中"
    },
    {
      "id": 3,
      "facility_type": "无障碍卫生间",
      "name": "二楼无障碍卫生间",
      "location_code": "F2-TOILET-A",
      "floor": "2F",
      "status": "AVAILABLE",
      "last_checked_at": "2026-09-16T09:00:00Z",
      "owner_department": "物业管理部",
      "note": "含紧急呼叫按钮"
    },
    {
      "id": 4,
      "facility_type": "盲道",
      "name": "北门连续盲道",
      "location_code": "GATE-NORTH-TACTILE",
      "floor": "室外",
      "status": "AVAILABLE",
      "last_checked_at": "2026-09-17T09:00:00Z",
      "owner_department": "市政对接组",
      "note": "北门至主楼约 120 米"
    }
  ],
  "routePlan": [
    {
      "id": 1,
      "user_id": 1,
      "origin_text": "南门公交站",
      "destination_text": "二楼服务大厅",
      "route_mode": "WHEELCHAIR",
      "risk_level": "LOW",
      "estimated_minutes": 12,
      "facility_ids": [
        1,
        3
      ],
      "created_at": "2026-09-18T09:00:00Z"
    },
    {
      "id": 2,
      "user_id": 2,
      "origin_text": "北门停车场",
      "destination_text": "一楼报告厅",
      "route_mode": "BLIND_GUIDE",
      "risk_level": "MEDIUM",
      "estimated_minutes": 8,
      "facility_ids": [
        1,
        4
      ],
      "created_at": "2026-09-18T10:00:00Z"
    },
    {
      "id": 3,
      "user_id": 3,
      "origin_text": "南门公交站",
      "destination_text": "三楼康复室",
      "route_mode": "WHEELCHAIR",
      "risk_level": "HIGH",
      "estimated_minutes": 20,
      "facility_ids": [
        2,
        3
      ],
      "created_at": "2026-09-19T09:00:00Z"
    }
  ],
  "assistanceRequest": [
    {
      "id": 1,
      "user_id": 1,
      "route_plan_id": 1,
      "helper_id": 1,
      "request_time": "2026-09-18T08:30:00Z",
      "status": "REQUESTED",
      "meet_point": "南门岗亭旁",
      "contact_note": "请提前 5 分钟到达"
    },
    {
      "id": 2,
      "user_id": 2,
      "route_plan_id": 2,
      "helper_id": 2,
      "request_time": "2026-09-18T09:30:00Z",
      "status": "ACCEPTED",
      "meet_point": "北门无障碍车位",
      "contact_note": "蓝色轮椅标识车辆"
    },
    {
      "id": 3,
      "user_id": 3,
      "route_plan_id": 3,
      "helper_id": 3,
      "request_time": "2026-09-19T08:00:00Z",
      "status": "COMPLETED",
      "meet_point": "南门坡道入口",
      "contact_note": "需要陪同上楼"
    }
  ],
  "barrierReport": [
    {
      "id": 1,
      "reporter_id": 1,
      "facility_id": 1,
      "barrier_type": "坡道堵塞",
      "description": "南门坡道顶端被外卖电动车占用，轮椅无法通行",
      "photo_url": "/mock/photo_url-1.png",
      "verify_status": "PENDING",
      "priority": "HIGH"
    },
    {
      "id": 2,
      "reporter_id": 2,
      "facility_id": 3,
      "barrier_type": "门锁损坏",
      "description": "二楼无障碍卫生间回弹门无法从内部打开",
      "photo_url": "/mock/photo_url-2.png",
      "verify_status": "PENDING",
      "priority": "MEDIUM"
    },
    {
      "id": 3,
      "reporter_id": 3,
      "facility_id": 2,
      "barrier_type": "电梯停梯",
      "description": "无障碍电梯已停梯两天，三层康复室无法到达",
      "photo_url": "/mock/photo_url-3.png",
      "verify_status": "APPROVED",
      "priority": "HIGH"
    },
    {
      "id": 4,
      "reporter_id": 1,
      "facility_id": 4,
      "barrier_type": "疑似盲道占用",
      "description": "现场复核为临时卸货，10 分钟内已驶离，不构成障碍",
      "photo_url": "/mock/photo_url-4.png",
      "verify_status": "REJECTED",
      "priority": "LOW"
    }
  ]
} as const;
