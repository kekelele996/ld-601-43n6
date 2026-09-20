import { seed } from "../seed";
import type { BarrierReport } from "../models/BarrierReport";

const rows: BarrierReport[] = seed.barrierReport.map((row) => ({ ...row }));

export const barrierReportRepository = {
  findAll: (): BarrierReport[] => rows,
  findById: (id: number): BarrierReport | undefined => rows.find((row) => row.id === id),
  save: (row: BarrierReport): BarrierReport => row,
  updateVerifyStatus: (id: number, verify_status: string): BarrierReport => {
    const row = rows.find((item) => item.id === id);
    if (!row) {
      throw new Error(`barrier report ${id} not found`);
    }
    row.verify_status = verify_status;
    return row;
  }
};
