import { createContext, useState, useEffect, useContext } from 'react';
import QuyenService from '../app/service/quyen.service';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem('permissions');
    return savedPermissions ? JSON.parse(savedPermissions) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && permissions.length === 0) {
        setLoading(true);
        try {
          const fetchedPermissions = await QuyenService.getPerOfUser();
          localStorage.setItem(
            'permissions',
            JSON.stringify(fetchedPermissions)
          );
          setPermissions(fetchedPermissions);
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('permissions');
          window.location.href = '/signin';
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPermissions();
  }, [permissions]);

  return (
    <PermissionContext.Provider
      value={{ permissions, setPermissions, loading }}
    >
      {loading ? <div>Loading...</div> : children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);
