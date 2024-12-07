import { NavLink } from 'react-router-dom';

function NotFoundView() {
    return (
        <div className="p-4 text-center mt-8">
            <h1 className="text-2xl font-bold text-slate-200">404 - Page Not Found</h1>
            <p className="text-slate-400">The page you are looking for does not exist.</p>
            <NavLink
                to="/"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
                Go to Homepage
            </NavLink>
        </div>
    );
}

export default NotFoundView;