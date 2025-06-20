import { usePermission } from '../../context/PermissionContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function CheckPermissionRoute({
  children,
  requiredPermissions,
}) {
  const { permissions } = usePermission();
  const { logout } = useAuth();

  const hasPermission = permissions.some((p) =>
    requiredPermissions.includes(p)
  );

  if (!hasPermission) {
    localStorage.removeItem('permissions');
    logout();
    return <Navigate to="/signin" replace />;
  }

  return children;
}
