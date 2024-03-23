import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home/Home.page';
import { SubmitPage } from './pages/Submit/Submit.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/submit',
    element: <SubmitPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
