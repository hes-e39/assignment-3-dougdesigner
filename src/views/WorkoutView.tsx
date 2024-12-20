import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/generic/Button';
import TimersList from '../components/generic/TimersList';
import WorkoutStats from '../components/generic/WorkoutStats';
// import WorkoutTimers from "../components/generic/WorkoutTimers";
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import { useWorkout } from '../context/WorkoutContext';
import EmptyState from '../components/generic/EmptyState';


const WorkoutView = () => {
    const { timers, currentTimerIndex, startWorkout, nextTimer, resetWorkout, pauseTimer, resumeTimer, isWorkoutEditable, currentTimerElapsedtime, remainingWorkoutTime, totalWorkoutTime } = useWorkout();
    const isWorkoutPaused = currentTimerIndex !== null && timers[currentTimerIndex]?.state === 'paused';
    const isWorkoutRunning = currentTimerIndex !== null && timers[currentTimerIndex]?.state === 'running';
    const isWorkoutActive = isWorkoutPaused || isWorkoutRunning;
    const isWorkoutCompleted = timers.every(timer => timer.state === 'completed');
    const navigate = useNavigate();

    // Automatically transition to the next timer when the current one completes
    useEffect(() => {
        if (!isWorkoutRunning || currentTimerIndex === null) return;

        const currentTimer = timers[currentTimerIndex];
        const workTime = currentTimer.workTime.minutes * 60 + currentTimer.workTime.seconds;
        const restTime = currentTimer.restTime ? currentTimer.restTime.minutes * 60 + currentTimer.restTime.seconds : 0;

        const totalTimeForOneRound = workTime + restTime;
        const timerDuration = totalTimeForOneRound * 1000; // Total duration in milliseconds

        const timeout = setTimeout(() => {
            if (!isWorkoutPaused) {
                nextTimer(); // Move to the next timer only if not paused
            }
        }, timerDuration);

        return () => clearTimeout(timeout);
    }, [currentTimerIndex, isWorkoutRunning, isWorkoutPaused, timers, nextTimer]);

    // Handle workout start
    const handleStartWorkout = () => {
        startWorkout();
    };

    // Reset elapsed time when workout is reset
    const handleResetWorkout = () => {
        resetWorkout();
    };

    // Handle skipping a timer
    const handleSkipTimer = () => {
        if (currentTimerIndex !== null) {
            nextTimer(true); // Mark the current timer as skipped
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between py-8 px-2">
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-white truncate text-3xl tracking-tight">Workout</h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {/* Button to add a new timer */}
                    <NavLink
                        to="/add"
                        className={`ml-3 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            !isWorkoutEditable ? 'cursor-not-allowed bg-slate-800 focus-visible:outline-slate-800' : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                        }`}
                        aria-disabled={!isWorkoutEditable}
                        tabIndex={!isWorkoutEditable ? -1 : 0}
                        onClick={e => {
                            if (!isWorkoutEditable) {
                                e.preventDefault(); // Prevent navigation
                            }
                        }}
                    >
                        Add timer
                    </NavLink>
                </div>
            </div>

            {timers.length == 0 && (
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-lg bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
                        <p className="font-bold text-white truncate text-2xl tracking-tight">Workout Timers</p>
                        <EmptyState
                            title="No timers"
                            description="Get started by adding a new timer to your workout."
                            buttonText="Add timer"
                            onButtonClick={() => navigate('/add')}
                        />
                    </div>
                </div>
            )}

            {timers.length > 0 && (
            <div>
                {/* Workout Stats */}
                <WorkoutStats
                    totalWorkoutTime={totalWorkoutTime}
                    remainingTime={remainingWorkoutTime}
                    currentTimer={currentTimerIndex !== null ? currentTimerIndex + 1 : 0}
                    totalTimers={timers.length}
                    isWorkPeriod={isWorkoutActive}
                />

                {/* Workout Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 mb-5">
                    <Button type="reset" onClick={handleResetWorkout} />
                    {!isWorkoutActive && <Button type="start" onClick={handleStartWorkout} disabled={isWorkoutCompleted} />}
                    {isWorkoutRunning && <Button type="pause" onClick={pauseTimer} />}
                    {isWorkoutPaused && <Button type="resume" onClick={resumeTimer} />}
                    <Button type="fastforward" onClick={handleSkipTimer} disabled={isWorkoutCompleted || !isWorkoutActive} />
                </div>
            </div>
            )}

            {timers.length > 0 && (
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                
                    <div className="flex flex-col items-center w-full">
                        
                        {/* Workout Timers */}
                        <div className="workout-timers space-y-4 w-full">
                            {timers.map((timer, index) => {
                                // Determine if this is the active timer
                                const isActive = currentTimerIndex === index;

                                switch (timer.type) {
                                    case 'stopwatch':
                                        return (
                                            <div key={timer.id} className="timer-container">
                                                <Stopwatch workoutTimer workTime={timer.workTime} state={timer.state} active={isActive} currentTimerElapsedtime={isActive ? currentTimerElapsedtime : 0} description={timer.description} />
                                            </div>
                                        );

                                    case 'countdown':
                                        return (
                                            <div key={timer.id} className="timer-container">
                                                <Countdown workoutTimer workTime={timer.workTime} state={timer.state} active={isActive} currentTimerElapsedtime={isActive ? currentTimerElapsedtime : 0} description={timer.description} />
                                            </div>
                                        );

                                    case 'tabata':
                                        return (
                                            <div key={timer.id} className="timer-container">
                                                <Tabata
                                                    workoutTimer
                                                    workTime={timer.workTime}
                                                    restTime={timer.restTime}
                                                    totalRounds={timer.totalRounds}
                                                    state={timer.state}
                                                    active={isActive}
                                                    currentTimerElapsedtime={isActive ? currentTimerElapsedtime : 0}
                                                    description={timer.description}
                                                />
                                            </div>
                                        );

                                    case 'xy':
                                        return (
                                            <div key={timer.id} className="timer-container">
                                                <XY workoutTimer workTime={timer.workTime} totalRounds={timer.totalRounds} state={timer.state} active={isActive} currentTimerElapsedtime={isActive ? currentTimerElapsedtime : 0} description={timer.description}/>
                                            </div>
                                        );

                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <TimersList disableRemove={!isWorkoutEditable} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutView;
