import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from './404';
import AnalogClock from './pages/clock/_comp/analog-clock';
import EventDetailsPage from './pages/event-page/event-detail-page';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AppProvider>
      <AnalogClock />
      // </AppProvider>
    ),
    children: []
  },
  {
    path: '/event-details',
    element: <EventDetailsPage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);