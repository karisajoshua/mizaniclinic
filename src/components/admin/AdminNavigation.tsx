import { createContext, useContext } from 'react';

export const AdminNavigationContext = createContext<(tab: string) => void>(() => {});
export const useAdminNavigation = () => useContext(AdminNavigationContext);
