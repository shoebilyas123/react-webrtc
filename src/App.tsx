import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Local Imports
import Lobby from './components/lobby';
import Room from './components/room';
import { SocketProvider } from './context/socket';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />,
  },
  {
    path: '/room',
    element: <Room />,
  },
]);

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  );
}

export default App;
