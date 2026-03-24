// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Blogger, Profile2User } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  blog: Blogger,
  users: Profile2User
};

// ==============================|| MENU ITEMS - LALEZAR WEBSITE ||============================== //

const website: NavItemType = {
  id: 'website',
  type: 'group',
  title: <FormattedMessage id="website" />,
  children: [
    {
      id: 'blog',
      title: <FormattedMessage id="blog" />,
      type: 'item',
      url: '/blog',
      icon: icons.blog
    },
    {
      id: 'users',
      title: <FormattedMessage id="users" />,
      type: 'item',
      url: '/users',
      icon: icons.users
    }
  ]
};

export default website;
