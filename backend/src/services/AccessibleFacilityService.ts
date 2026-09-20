import { accessibleFacilityRepository } from "../repositories/AccessibleFacilityRepository";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { BusinessError } from "../utils/errors";
import type { AccessibleFacility } from "../models/AccessibleFacility";

const BLOCKED = "BLOCKED" as const;

export const accessibleFacilityService = {
  list: (): AccessibleFacility[] => accessibleFacilityRepository.findAll(),

  create: (row: unknown) => accessibleFacilityRepository.save(row),

  markBlocked: (facilityId: number): AccessibleFacility => {
    const facility = accessibleFacilityRepository.findById(facilityId);
    if (!facility) {
      throw new BusinessError(404, ERROR_CODES.FACILITY_NOT_FOUND, `${ERROR_MESSAGES.FACILITY_NOT_FOUND}: #${facilityId}`);
    }
    const updated = accessibleFacilityRepository.updateStatus(facilityId, BLOCKED, new Date().toISOString());
    console.info("audit", LOG_TEMPLATES.AccessibleFacility[2], `AccessibleFacility#${facilityId}`, { status: BLOCKED });
    return updated as AccessibleFacility;
  }
};
