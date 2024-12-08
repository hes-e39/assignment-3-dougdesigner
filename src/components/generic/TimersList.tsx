import { useNavigate, NavLink } from 'react-router-dom';
import type { TimerConfig } from '../../context/WorkoutContext';
import EmptyState from '../generic/EmptyState';
import TimerBadge from '../generic/TimerBadge';
import { useWorkout } from '../../context/WorkoutContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TimersListProps {
    disableRemove?: boolean;
}

const timerTypeMap = {
    stopwatch: 'Stopwatch',
    countdown: 'Countdown',
    tabata: 'Tabata',
    xy: 'XY',
} as const;

// SortableItem component
const SortableTimer = ({
    timer,
    index,
    disableRemove,
    // currentTimerIndex,
    removeTimer,
    getTimerStatus
}: {
    timer: TimerConfig;
    index: number;
    disableRemove: boolean;
    currentTimerIndex: number | null;
    removeTimer: (id: string) => void;
    getTimerStatus: (timer: TimerConfig, index: number) => 'running' | 'paused' | 'completed' | 'skipped' | 'ready';
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: timer.id, disabled: disableRemove });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Split the content and controls to handle events separately
    const TimerControls = () => (
        <div className="flex items-center space-x-2">
            {disableRemove ? (
                <TimerBadge status={getTimerStatus(timer, index)} />
            ) : (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTimer(timer.id);
                        }}
                        className="rounded-full bg-gray-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                        Remove
                    </button>
                    <NavLink
                        to={`/edit/${timer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Edit
                    </NavLink>
                </div>
            )}
        </div>
    );

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center space-x-4 pr-2 py-4 ${isDragging ? 'bg-slate-800 rounded-md' : ''}`}
        >
            <div 
                className={`flex flex-1 items-center ${!disableRemove ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                {...attributes}
                {...listeners}
            >
                {/* Drag Handle Icon */}
                {!disableRemove && (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth="1.5" 
                        stroke="currentColor" 
                        className="size-6 text-white/50 shrink-0 mr-2"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" 
                        />
                    </svg>
                )}
                <div className="min-w-0 flex-auto">
                    <div className="flex items-center gap-x-3">
                        <div
                            className={`flex-none rounded-full p-1 ${
                                timer.state === 'running' ? 'bg-green-400/10 text-green-400'
                                : timer.state === 'completed' ? 'bg-blue-400/10 text-blue-400'
                                : timer.state === 'paused' ? 'bg-orange-400/10 text-orange-400'
                                : 'bg-gray-100/10 text-gray-500'
                            }`}
                        >
                            <div className="size-2 rounded-full bg-current" />
                        </div>
                        <h2 className="min-w-0 text-sm/6 font-semibold text-white">
                            {timerTypeMap[timer.type]}
                        </h2>
                    </div>

                    <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                        <p>
                            <strong>Work</strong> {timer.workTime.minutes}m {timer.workTime.seconds}s
                        </p>
                        {timer.restTime && (
                            <>
                                <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
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
                                    <circle cx="1" cy="1" r="1" />
                                </svg>
                                <p>
                                    <strong>Rounds</strong> {timer.totalRounds}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls rendered separately from drag handle area */}
            <TimerControls />
        </li>
    );
};

const TimersList = ({ disableRemove = false }: TimersListProps) => {
    const { timers, updateTimers, currentTimerIndex, removeTimer } = useWorkout();
    const navigate = useNavigate();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px of movement required before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getTimerStatus = (timer: TimerConfig, index: number): 'running' | 'paused' | 'completed' | 'skipped' | 'ready' => {
        if (index === currentTimerIndex && timer.state === 'running') return 'running';
        if (timer.state === 'paused') return 'paused';
        if (timer.state === 'completed') return 'completed';
        if (timer.state === 'not running' && index < (currentTimerIndex ?? timers.length)) return 'ready';
        return 'ready';
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = timers.findIndex((timer) => timer.id === active.id);
            const newIndex = timers.findIndex((timer) => timer.id === over.id);
            
            const newTimers = arrayMove(timers, oldIndex, newIndex);
            updateTimers(newTimers);
        }
    };

    if (timers.length === 0) {
        return (
            <div className="w-full max-w-lg bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
                <p className="font-bold text-white truncate text-2xl tracking-tight">Workout Timers</p>
                <EmptyState
                    title="No timers"
                    description="Get started by adding a new timer to your workout."
                    buttonText="Add timer"
                    onButtonClick={() => navigate('/add')}
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
            <p className="font-bold text-white truncate text-xl tracking-tight">Workout Timers</p>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={timers.map(timer => timer.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="divide-y divide-white/5">
                        {timers.map((timer, index) => (
                            <SortableTimer
                                key={timer.id}
                                timer={timer}
                                index={index}
                                disableRemove={disableRemove}
                                currentTimerIndex={currentTimerIndex}
                                removeTimer={removeTimer}
                                getTimerStatus={getTimerStatus}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default TimersList;