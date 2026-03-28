// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Profile2User } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  users: Profile2User
};

// ==============================|| MENU ITEMS - USER SECTION ||============================== //

const userSection: NavItemType = {
  id: 'user-section',
  type: 'group',
  title: <FormattedMessage id="user-section" />,
  children: [
    {
      id: 'users',
      title: <FormattedMessage id="users" />,
      type: 'item',
      url: '/users',
      icon: icons.users
    }
  ]
};

export default userSection;
