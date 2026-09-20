export const MobilityType = ["BLIND", "LOW_VISION", "WHEELCHAIR", "ELDERLY", "TEMPORARY_INJURY"] as const;
export type MobilityType = (typeof MobilityType)[number];
export const MobilityTypeText: Record<MobilityType, string> = {
  BLIND: "视障",
  LOW_VISION: "低视力",
  WHEELCHAIR: "轮椅使用者",
  ELDERLY: "老年出行",
  TEMPORARY_INJURY: "临时受伤"
};
