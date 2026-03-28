// types
import { NavItemType } from 'types/menu';
import blogSection from './blogSection';
import userSection from './userSection';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [blogSection, userSection]
};

export default menuItems;
