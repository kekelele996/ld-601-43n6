import type { BarrierVerifyStatus } from "../constants/BarrierVerifyStatus";

export interface BarrierReport {
  id: number;
  reporter_id: number;
  facility_id: number;
  barrier_type: string;
  description: string;
  photo_url: string;
  verify_status: BarrierVerifyStatus | string;
  priority: string;
}
