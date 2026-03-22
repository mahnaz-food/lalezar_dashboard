import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { Toaster } from 'sonner';
import { MenuProvider } from 'contexts/MenuContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      {/* <RTLLayout> */}
      <Locales>
        <ScrollTop>
          <MenuProvider>
            <AuthProvider>
              <>
                <RouterProvider router={router} />
                <Toaster richColors position="bottom-right" duration={4000} />
              </>
            </AuthProvider>
          </MenuProvider>
        </ScrollTop>
      </Locales>
      {/* </RTLLayout> */}
    </ThemeCustomization>
  );
}
