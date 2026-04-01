import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';
import DashboardPage from 'pages/dashboard';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const BlogPage = Loadable(lazy(() => import('pages/blog/article/blog-page')));
const SingleArticlePage = Loadable(lazy(() => import('pages/blog/article/article-page')));
const ArticleCategoryPage = Loadable(lazy(() => import('pages/blog/article-categories/categories-page')));
const CreateArticlePage = Loadable(lazy(() => import('pages/blog/article/create-article-page')));
const ArticleTagsPage = Loadable(lazy(() => import('pages/blog/article-tags/tags-page')));
const UsersPage = Loadable(lazy(() => import('pages/users/users-page')));
const SingleUserPage = Loadable(lazy(() => import('pages/users/user-page')));
const AddUserPage = Loadable(lazy(() => import('pages/users/add-user-page')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <DashboardPage /> },
        {
          path: '/blog',
          element: <BlogPage />
        },
        {
          path: '/blog/:slug',
          element: <SingleArticlePage />
        },
        {
          path: '/blog/create-article',
          element: <CreateArticlePage />
        },
        {
          path: '/article-category/create-category',
          element: <CreateArticlePage />
        },
        {
          path: '/article-category',
          element: <ArticleCategoryPage />
        },
        {
          path: '/article-tag',
          element: <ArticleTagsPage />
        },
        {
          path: '/users',
          element: <UsersPage />
        },
        {
          path: '/users/add-user',
          element: <AddUserPage />
        },
        {
          path: '/users/:id',
          element: <SingleUserPage />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
