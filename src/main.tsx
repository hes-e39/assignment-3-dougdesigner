// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import AddTimerView from './views/AddTimerView';
import DocumentationView from './views/DocumentationView';
import TimersView from './views/TimersView';
import WorkoutView from './views/WorkoutView';

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <WorkoutView />,
            },
            {
                path: '/timers',
                element: <TimersView />,
            },
            {
                path: '/add',
                element: <AddTimerView />,
            },
            {
                path: '/docs',
                element: <DocumentationView />,
            },
        ],
    },
]);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
