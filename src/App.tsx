// App.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
    return (
        <WorkoutProvider>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <span className="h-8 w-auto text-2xl">💪</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white'
                                                : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                    >
                                        Workout
                                    </NavLink>
                                    <NavLink
                                        to="/timers"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white'
                                                : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                    >
                                        Timers
                                    </NavLink>
                                    <NavLink
                                        to="/docs"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white'
                                                : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }
                                    >
                                        Documentation
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </WorkoutProvider>
    );
}

export default App;
