import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectPermissions, selectPermissionsLoading } from './selectors';
import { Loading } from '../../components/Loading';
import type { Permission } from './permissionsSlice';

interface PermissionsWrapperProps {
  permission: keyof Permission;
  children: React.ReactNode;
}

export const PermissionsWrapper: React.FC<PermissionsWrapperProps> = ({
  permission,
  children,
}) => {
  const permissions = useAppSelector(selectPermissions);
  const loading = useAppSelector(selectPermissionsLoading);

  if (loading) {
    return <Loading />;
  }

  if (!permissions.permissions[permission]) {
    return null;
  }

  return <>{children}</>;
};
