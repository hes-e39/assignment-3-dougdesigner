interface EmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, buttonText, onButtonClick }) => {
    return (
        <div className="text-center">
            <svg className="mx-auto size-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-400">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-6">
                <button
                    type="button"
                    onClick={onButtonClick}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <svg className="-ml-0.5 mr-1.5 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default EmptyState;
