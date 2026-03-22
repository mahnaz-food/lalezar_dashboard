import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MenuProps } from 'types/menu';

const initialState: MenuProps = {
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true
};

type MenuContextType = {
  menu: MenuProps;
  setDashboardDrawer: (value: boolean) => void;
  setComponentDrawer: (value: boolean) => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuProps>(() => {
    const saved = localStorage.getItem('menu');
    return saved ? JSON.parse(saved) : initialState;
  });

  // ✅ persist whenever menu changes
  useEffect(() => {
    localStorage.setItem('menu', JSON.stringify(menu));
  }, [menu]);

  const setDashboardDrawer = (value: boolean) => {
    setMenu((prev) => ({ ...prev, isDashboardDrawerOpened: value }));
  };

  const setComponentDrawer = (value: boolean) => {
    setMenu((prev) => ({ ...prev, isComponentDrawerOpened: value }));
  };

  return <MenuContext.Provider value={{ menu, setDashboardDrawer, setComponentDrawer }}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
