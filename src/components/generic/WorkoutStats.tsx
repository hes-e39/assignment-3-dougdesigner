import type React from 'react';
import DisplayRounds from '../generic/DisplayRounds';
import DisplayTime from '../generic/DisplayTime';
// import DisplayMode from "../generic/DisplayMode";

interface WorkoutStatsProps {
    totalWorkoutTime: number; // Total workout time in seconds
    elapsedTime: number; // Elapsed time in milliseconds
    currentTimer: number; // Current timer in the queue
    totalTimers: number; // Total timers in the queue
    isWorkPeriod: boolean; // True if it's a work period, false if it's a rest period
    currentRounds?: { current: number; total: number }; // Current and total rounds for the active timer
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({
    totalWorkoutTime,
    elapsedTime,
    currentTimer,
    totalTimers,
    isWorkPeriod,
    currentRounds = { current: 1, total: 1 }, // Default to { current: 1, total: 1 }
}) => {
    return (
        <div className="w-full overflow-hidden bg-gray-900 rounded-lg ring-1 ring-slate-900/10">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Workout Time */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-sm/6 font-medium text-gray-400">Total workout time</p>
                        <div className="mt-2 flex items-baseline gap-x-2">
                            <DisplayTime
                                minutes={Math.floor(totalWorkoutTime / 60)}
                                seconds={totalWorkoutTime % 60}
                                hundredths={0} // Hundredths not applicable for total workout time
                            />
                        </div>
                    </div>

                    {/* Total Elapsed Time */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-sm/6 font-medium text-gray-400">Total elapsed time</p>
                        <div className="mt-2 flex items-baseline gap-x-2">
                            <DisplayTime minutes={Math.floor(elapsedTime / 60000)} seconds={Math.floor((elapsedTime % 60000) / 1000)} hundredths={Math.floor((elapsedTime % 1000) / 10)} />
                        </div>
                    </div>

                    {/* Current Timer / Total Timers */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8 hidden">
                        <p className="text-sm/6 font-medium text-gray-400">Current timer</p>
                        <p className="mt-2 flex items-baseline gap-x-2">
                            <span className="text-4xl font-semibold tracking-tight text-white font-mono">{currentTimer}</span>
                            <span className="text-sm text-gray-400 font-mono">/ {totalTimers}</span>
                        </p>
                    </div>

                    {/* Work or Rest Period */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-sm/6 font-medium text-gray-400">Workout status</p>
                        <div className="mt-2 flex items-baseline gap-x-2">
                            <div className="text-lg font-semibold tracking-tight text-white">{isWorkPeriod ? 'Workouting out' : 'Not working out'}</div>
                        </div>
                    </div>

                    {/* Current Round */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-sm/6 font-medium text-gray-400">Current timer</p>
                        <div className="mt-2 flex items-baseline gap-x-2">
                            <DisplayRounds
                                currentRound={currentTimer} // Default to 1 if undefined
                                rounds={totalTimers} // Default to 1 if undefined
                            />
                        </div>
                    </div>

                    {/* Current Rounds */}
                    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8 hidden">
                        <p className="text-sm/6 font-medium text-gray-400">Current rounds</p>
                        <div className="mt-2 flex items-baseline gap-x-2">
                            <DisplayRounds
                                currentRound={currentRounds.current || 1} // Default to 1 if undefined
                                rounds={currentRounds.total || 1} // Default to 1 if undefined
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutStats;
