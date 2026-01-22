import { UserProfileRole } from "@/types/user.d";

const roleHierarchy: Record<UserProfileRole, number> = {
  [UserProfileRole.User]: 1,
  [UserProfileRole.Partner]: 2,
  [UserProfileRole.Admin]: 3,
};

export const hasMinimumRole = (
  UserProfileRole: UserProfileRole | null | undefined,
  minRole: UserProfileRole | null
): boolean => {
  if (!minRole) return true;
  if (!UserProfileRole) return false;
  return roleHierarchy[UserProfileRole] >= roleHierarchy[minRole];
};
