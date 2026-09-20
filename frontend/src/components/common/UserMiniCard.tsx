import { StatusBadge } from "./StatusBadge";
import type { UserProfile } from "../../types/UserProfile";
import { MobilityTypeText } from "../../constants/MobilityType";

interface UserMiniCardProps {
  user?: UserProfile | null;
  title?: string;
  value?: string;
}

export function UserMiniCard({ user, title, value }: UserMiniCardProps) {
  if (!user) {
    return (
      <div className="shared-widget user-mini">
        <strong>{title ?? "用户"}</strong>
        <StatusBadge value={value ?? "UNKNOWN"} />
      </div>
    );
  }
  return (
    <div className="shared-widget user-mini">
      <strong>{user.nickname}</strong>
      <span className="tag-meta">{user.phone}</span>
      <StatusBadge
        value={user.mobility_type}
        label={(MobilityTypeText as Record<string, string>)[user.mobility_type] ?? user.mobility_type}
      />
    </div>
  );
}
