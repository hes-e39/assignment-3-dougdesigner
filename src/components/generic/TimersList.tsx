import type React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TimerConfig } from '../../context/WorkoutContext';
import EmptyState from '../generic/EmptyState';
import TimerBadge from '../generic/TimerBadge';

interface TimersListProps {
    timers: TimerConfig[];
    currentTimerIndex?: number | null;
    onRemoveTimer?: (id: string) => void;
    disableRemove?: boolean; // Option to disable the remove button
}

// Add a dictionary to map the timer type to a human-readable string
const timerTypeMap: Record<string, string> = {
    stopwatch: 'Stopwatch',
    countdown: 'Countdown',
    tabata: 'Tabata',
    xy: 'XY',
};

const TimersList: React.FC<TimersListProps> = ({
    timers,
    currentTimerIndex = null,
    onRemoveTimer,
    disableRemove = false, // Default to false
}) => {
    const navigate = useNavigate();

    // Function to derive the status of a timer
    const getTimerStatus = (timer: TimerConfig, index: number): 'running' | 'paused' | 'completed' | 'skipped' | 'ready' => {
        if (index === currentTimerIndex && timer.state === 'running') return 'running';
        if (timer.state === 'paused') return 'paused';
        if (timer.state === 'completed') return 'completed';
        if (timer.state === 'not running' && index < (currentTimerIndex ?? timers.length)) return 'ready';
        return 'ready';
    };

    return (
        <div className="w-full max-w-lg mt-4 bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
            <p className="font-bold text-white truncate text-2xl tracking-tight">Timers</p>
            {timers.length === 0 ? (
                <EmptyState
                    title="No timers"
                    description="Get started by adding a new timer to your workout."
                    buttonText="Add timer"
                    onButtonClick={() => navigate('/add')} // Navigate to the Add Timer view
                />
            ) : (
                <ul className="divide-y divide-white/5">
                    {timers.map((timer, index) => (
                        <li key={timer.id} className="relative flex items-center space-x-4 py-4">
                            <div className="min-w-0 flex-auto">
                                <div className="flex items-center gap-x-3">
                                    {/* Timer Icon */}
                                    <div
                                        className={`flex-none rounded-full p-1 ${
                                            timer.state === 'running'
                                                ? 'bg-green-400/10 text-green-400'
                                                : timer.state === 'completed'
                                                  ? 'bg-blue-400/10 text-blue-400'
                                                  : timer.state === 'paused'
                                                    ? 'bg-orange-400/10 text-orange-400'
                                                    : 'bg-gray-100/10 text-gray-500'
                                        }`}
                                    >
                                        <div className="size-2 rounded-full bg-current" />
                                    </div>

                                    {/* Timer Type */}
                                    <h2 className="min-w-0 text-sm/6 font-semibold text-white">{timerTypeMap[timer.type]}</h2>
                                </div>

                                {/* Timer Details */}
                                <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                                    <p>
                                        <strong>Work</strong> {timer.workTime.minutes}m {timer.workTime.seconds}s
                                    </p>
                                    {timer.restTime && (
                                        <>
                                            <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                                                <title>Dot</title>
                                                <circle cx="1" cy="1" r="1" />
                                            </svg>
                                            <p>
                                                <strong>Rest</strong> {timer.restTime.minutes}m {timer.restTime.seconds}s
                                            </p>
                                        </>
                                    )}
                                    {timer.totalRounds && (
                                        <>
                                            <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                                                <title>Dot</title>
                                                <circle cx="1" cy="1" r="1" />
                                            </svg>
                                            <p>
                                                <strong>Rounds</strong> {timer.totalRounds}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Timer Badge and Remove Button */}
                            <div className="flex items-center space-x-2">
                                {/* Timer Status Badge */}
                                {disableRemove && <TimerBadge status={getTimerStatus(timer, index)} />}

                                {/* Remove Button */}
                                {!disableRemove && onRemoveTimer && (
                                    <button
                                        onClick={() => onRemoveTimer(timer.id)}
                                        className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TimersList;
