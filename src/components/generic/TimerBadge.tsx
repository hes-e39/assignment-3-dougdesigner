interface TimerBadgeProps {
    status: 'paused' | 'running' | 'completed' | 'skipped' | 'ready';
}

const TimerBadge: React.FC<TimerBadgeProps> = ({ status }) => {
    const badgeStyles = {
        paused: 'inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20',
        running: 'inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20',
        completed: 'inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30',
        skipped: 'inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20',
        ready: 'inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20',
    };

    const badgeText = {
        paused: 'Paused',
        running: 'Running',
        completed: 'Completed',
        skipped: 'Skipped',
        ready: 'Ready',
    };

    return <span className={badgeStyles[status]}>{badgeText[status]}</span>;
};

export default TimerBadge;
