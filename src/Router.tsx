import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SubmitPage } from './pages/Submit/Submit.page';
import { AdminPanel } from './pages/Home/AdminPanel';

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminPanel />,
  },
  {
    path: '/',
    element: <SubmitPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
