import { usePermission } from '../../context/PermissionContext';
import { Navigate } from 'react-router-dom';
export default function CheckPermissionRoute({
  children,
  requiredPermissions,
}) {
  const { permissions } = usePermission();

  const hasPermission = permissions.some((p) =>
    requiredPermissions.includes(p)
  );

  if (!hasPermission) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
