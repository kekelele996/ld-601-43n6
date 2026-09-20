import { seed } from "../seed";
import type { BarrierReport } from "../models/BarrierReport";
import type { VerifyStatus } from "../constants/VerifyStatus";

const rows: BarrierReport[] = (seed.barrierReport as unknown as BarrierReport[]).map((row) => ({ ...row }));

export const barrierReportRepository = {
  findAll: (): BarrierReport[] => rows,
  findById: (id: number): BarrierReport | undefined => rows.find((row) => row.id === id),
  save: (row: unknown): unknown => row,
  updateVerifyStatus: (id: number, verify_status: VerifyStatus): BarrierReport | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    target.verify_status = verify_status;
    return target;
  }
};
