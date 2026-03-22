import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  const location = useLocation();
  const guestPages = ['/login', 'forget-password'];
  const isGuestPage = guestPages.includes(location.pathname);

  const { data: user } = useAuth({ enabled: !isGuestPage });
  const isLoggedIn = !!user;

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
        state: { from: '' },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
}
