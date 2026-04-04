// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Slider, Category, Tag } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  slider: Slider,
  categories: Category,
  tags: Tag
};

// ==============================|| MENU ITEMS - WEBSITE SECTION ||============================== //

const websiteSection: NavItemType = {
  id: 'website-section',
  type: 'group',
  title: <FormattedMessage id="website-section" />,
  children: [
    {
      id: 'slider',
      title: <FormattedMessage id="slider" />,
      type: 'item',
      url: '/website/hero-sliders',
      icon: icons.slider
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

export default websiteSection;
