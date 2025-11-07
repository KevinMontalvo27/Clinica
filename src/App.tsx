import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRoutes />;
}