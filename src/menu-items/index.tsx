// types
import { NavItemType } from 'types/menu';
import blogSection from './blogSection';
import userSection from './userSection';
import websiteSection from './websiteSection';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [blogSection, userSection, websiteSection]
};

export default menuItems;
