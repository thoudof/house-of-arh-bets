import { Badge } from "@/components/ui/badge";
import { useUserRole, getUserRoleDisplay, getUserTierDisplay, UserRole, UserTier } from "@/hooks/api/useUserRoles";

interface UserRoleDisplayProps {
  userId?: string;
  showTier?: boolean;
  size?: "sm" | "default";
}

const UserRoleDisplay = ({ userId, showTier = false, size = "default" }: UserRoleDisplayProps) => {
  const { data: roleData, isLoading } = useUserRole(userId);

  if (isLoading) return null;
  if (!roleData) return null;

  const roleInfo = getUserRoleDisplay(roleData.role as UserRole);
  const tierInfo = roleData.tier ? getUserTierDisplay(roleData.tier as UserTier) : null;

  return (
    <div className="flex gap-1 items-center">
      <Badge 
        variant="outline" 
        className={`${roleInfo.color} border-current ${size === "sm" ? "text-xs" : ""}`}
      >
        {roleInfo.name}
      </Badge>
      {showTier && tierInfo && (
        <Badge 
          variant="secondary" 
          className={`${tierInfo.color} ${size === "sm" ? "text-xs" : ""}`}
        >
          {tierInfo.name}
        </Badge>
      )}
    </div>
  );
};

export default UserRoleDisplay;