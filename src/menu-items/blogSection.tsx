// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Blogger, Category, Tag } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  blog: Blogger,
  categories: Category,
  tags: Tag
};

// ==============================|| MENU ITEMS - BLOG SECTION ||============================== //

const blogSection: NavItemType = {
  id: 'blog-section',
  type: 'group',
  title: <FormattedMessage id="blog-section" />,
  children: [
    {
      id: 'blog',
      title: <FormattedMessage id="blog" />,
      type: 'item',
      url: '/blog',
      icon: icons.blog
    },
    {
      id: 'category',
      title: <FormattedMessage id="category" />,
      type: 'item',
      url: '/article-category',
      icon: icons.categories
    },
    {
      id: 'tag',
      title: <FormattedMessage id="tag" />,
      type: 'item',
      url: '/article-tag',
      icon: icons.tags
    }
  ]
};

export default blogSection;
