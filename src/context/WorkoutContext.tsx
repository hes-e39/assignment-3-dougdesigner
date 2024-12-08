import { createContext, useContext, useEffect, useState } from 'react';

import { getTimersFromUrl, updateUrlWithTimers } from '../services/urlState';
import { WorkoutStateManager } from '../services/storageState';

// Timer configuration types
export interface TimerConfig {
    id: string;
    type: 'stopwatch' | 'countdown' | 'tabata' | 'xy';
    workTime: { minutes: number; seconds: number };
    restTime?: { minutes: number; seconds: number }; // Optional, for Tabata and XY
    totalRounds?: number; // Optional, for Tabata and XY
    timerMode?: 'work' | 'rest'; // Optional, for Tabata and XY
    state: 'not running' | 'running' | 'paused' | 'completed';
    skipped?: boolean; // Track if the timer was skipped
    description?: string; // Workout timer description
}

// Context State
interface WorkoutContextState {
    timers: TimerConfig[];
    currentTimerIndex: number | null; // Index of the active timer
    elapsedTime: number; // Elapsed time in milliseconds for active timer
    totalElapsedTime: number; // Total elapsed time for the workout
    totalWorkoutTime: number; // Total workout time in seconds
    remainingWorkoutTime: number; // Remaining workout time in seconds
    isWorkoutEditable: boolean; // Track if the workout is editable
    addTimer: (timer: TimerConfig) => void;
    removeTimer: (id: string) => void;
    updateTimer: (id: string, updatedTimer: TimerConfig) => void;
    updateTimers: (timers: TimerConfig[]) => void;
    startWorkout: () => void;
    nextTimer: (skip?: boolean) => void; // Optional skip parameter
    resetWorkout: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
}

// Create Context
const WorkoutContext = createContext<WorkoutContextState | undefined>(undefined);

// Context Provider
interface WorkoutProviderProps {
    children: React.ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
    // Load saved state first
    const savedState = WorkoutStateManager.loadState();

    const [timers, setTimers] = useState<TimerConfig[]>(() => {
        if (savedState?.timers) {
            console.log('Loading timers from saved state:', savedState.timers);
            // Explicitly preserve the timer states when loading
            return savedState.timers.map(timer => ({
                ...timer,
                state: timer.state // Ensure state is preserved
            }));
        }
        return getTimersFromUrl();
    });

    const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(() =>  
        savedState?.currentTimerIndex || null
    );

    const [elapsedTime, setElapsedTime] = useState<number>(() => 
        savedState?.elapsedTime || 0
    ); // Elapsed time for active timer in milliseconds

    const [totalElapsedTime, setTotalElapsedTime] = useState<number>(() => 
        savedState?.totalElapsedTime || 0
    ); // Total elapsed time for the workout

    const [totalWorkoutTime, setTotalWorkoutTime] = useState<number>(0); // Total workout time in seconds
    const [remainingWorkoutTime, setRemainingWorkoutTime] = useState<number>(0); // Remaining workout time in seconds
    const [isWorkoutEditable, setIsWorkoutEditable] = useState<boolean>(true); // Track if workout is editable
    const [isWorkoutCompleted, setIsWorkoutCompleted] = useState<boolean>(false); // Track if workout is completed

    // Automatically update `isWorkoutEditable` based on workout state
    useEffect(() => {
        const isEditable = timers.every(timer => timer.state === 'not running');
        setIsWorkoutEditable(isEditable);
    }, [timers]);

    // Automatically update elapsed time and total elapsed time when the workout is running
    useEffect(() => {
        let interval: number | null = null;
        const currentTimer = currentTimerIndex !== null ? timers[currentTimerIndex] : null;

        // console.log('Timer state check:', {
        //     currentIndex: currentTimerIndex,
        //     timerState: currentTimer?.state,
        //     isRunning: currentTimer?.state === 'running'
        // });

        // Only run interval if timer is in running state (not paused)
        if (currentTimerIndex !== null && currentTimer?.state === 'running') {
            interval = window.setInterval(() => {
                setElapsedTime(prev => prev + 100);
                setTotalElapsedTime(prev => prev + 100);
                setRemainingWorkoutTime(prev => Math.max(prev - 100, 0));
            }, 100);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [currentTimerIndex, timers]);

    // Automatically advance the timer when the current one is complete
    useEffect(() => {
        if (currentTimerIndex === null) return;

        const currentTimer = timers[currentTimerIndex];

        if (currentTimer?.state! !== 'running') return;

        const workTime = currentTimer.workTime.minutes * 60 + currentTimer.workTime.seconds;
        const restTime = currentTimer.restTime ? currentTimer.restTime.minutes * 60 + currentTimer.restTime.seconds : 0;
        const timerRounds = currentTimer.totalRounds || 1;
        const totalDuration = (workTime + restTime) * timerRounds * 1000; // Convert to milliseconds

        if (elapsedTime >= totalDuration) {
            nextTimer(); // Move to the next timer
            setElapsedTime(0); // Reset elapsed time for the next timer
        }
    }, [elapsedTime, currentTimerIndex, timers]);

    // Helper function to calculate total workout time
    const calculateTotalWorkoutTime = (timers: TimerConfig[]) => {
        return timers.reduce((total, timer) => {
            const workTime = timer.workTime.minutes * 60 + timer.workTime.seconds;
            const restTime = timer.restTime ? timer.restTime.minutes * 60 + timer.restTime.seconds : 0;
            const totalTimePerRound = workTime + restTime;
            const totalTime = timer.totalRounds ? totalTimePerRound * timer.totalRounds : totalTimePerRound;
            return total + totalTime;
        }, 0);
    };

    // Add a new timer
    const addTimer = (timer: TimerConfig) => {
        setTimers(prevTimers => {
            const newTimers = [...prevTimers, { ...timer }];
            updateUrlWithTimers(newTimers);
            return newTimers;
        });
    };

    // Remove a timer
    const removeTimer = (id: string) => {
        setTimers(prevTimers => {
            const newTimers = prevTimers.filter(timer => timer.id !== id);
            updateUrlWithTimers(newTimers);
            return newTimers;
        });
    };

    // Update an existing timer
    const updateTimer = (id: string, updatedTimer: TimerConfig) => {
        setTimers(prevTimers => {
            const newTimers = prevTimers.map(timer =>
                timer.id === id ? { ...timer, ...updatedTimer } : timer
            );
            updateUrlWithTimers(newTimers); // Update URL to reflect the changes
            return newTimers;
        });
    };

    const updateTimers = (newTimers: TimerConfig[]) => {
        setTimers(() => {
            updateUrlWithTimers(newTimers); // Update URL
            return newTimers;
        });
    };

    // Start the workout from the beginning
    const startWorkout = () => {
        if (timers.length > 0) {
            setIsWorkoutCompleted(false);
            const totalWorkoutTime = calculateTotalWorkoutTime(timers);
            setIsWorkoutEditable(false); // Lock the workout from further edits
            setCurrentTimerIndex(0); // Set the first timer as the active timer
            setElapsedTime(0); // Reset elapsed time for the first timer
            setTotalElapsedTime(0); // Reset total elapsed time
            setRemainingWorkoutTime(totalWorkoutTime * 1000); // Reset remaining workout time
            setTimers(prevTimers =>
                prevTimers.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running',
                })),
            );
        }
    };

    // Resume a paused timer
    const resumeTimer = () => {
        if (currentTimerIndex !== null && timers[currentTimerIndex]?.state === 'paused') {
            setTimers(prevTimers =>
                prevTimers.map((timer, index) => ({
                    ...timer,
                    state: index === currentTimerIndex ? 'running' : timer.state,
                })),
            );
        }
    };

    // Pause the currently active timer
    const pauseTimer = () => {
        if (currentTimerIndex !== null) {
            setTimers(prevTimers => {
                const newTimers = prevTimers.map((timer, index) => ({
                    ...timer,
                    state: index === currentTimerIndex ? 'paused' : timer.state,
                }));
                
                // Save state immediately when pausing
                WorkoutStateManager.saveStateImmediate({
                    timers: newTimers,
                    currentTimerIndex,
                    elapsedTime,
                    totalElapsedTime,
                    lastUpdated: Date.now(),
                    isWorkoutEditable: false,
                    isWorkoutPaused: true
                });
                
                return newTimers;
            });
        }
    };

    // Move to the next timer
    const nextTimer = (skip = false) => {
        if (currentTimerIndex !== null) {
            const nextIndex = currentTimerIndex + 1;

            // Stabilize elapsedTime and totalElapsedTime references to minimize ms drift
            const stabilizedElapsedTime = elapsedTime;
            // const stabilizedTotalElapsedTime = totalElapsedTime;

            // Current timer and skipped time calculation
            const currentTimer = timers[currentTimerIndex];
            const workTime = currentTimer.workTime.minutes * 60 + currentTimer.workTime.seconds;
            const restTime = currentTimer.restTime
                ? currentTimer.restTime.minutes * 60 + currentTimer.restTime.seconds
                : 0;
            const rounds = currentTimer.totalRounds || 1;
            const currentTimerDuration = (workTime + restTime) * rounds * 1000; // Total duration in ms
            const skippedTime = skip ? currentTimerDuration - stabilizedElapsedTime : 0;

            // Calculate total elapsed time directly
            const updatedTotalElapsedTime = timers.reduce((total, timer, index) => {
                if (index < currentTimerIndex) {
                    // Add durations of fully completed timers
                    const timerWorkTime = timer.workTime.minutes * 60 + timer.workTime.seconds;
                    const timerRestTime = timer.restTime
                        ? timer.restTime.minutes * 60 + timer.restTime.seconds
                        : 0;
                    const timerRounds = timer.totalRounds || 1;
                    return total + (timerWorkTime + timerRestTime) * timerRounds * 1000;
                } else if (index === currentTimerIndex) {
                    // Add elapsed and skipped time of the current timer
                    return total + stabilizedElapsedTime + skippedTime;
                }
                return total;
            }, 0);

            // Update timers state
            setTimers(prevTimers =>
                prevTimers.map((timer, index) => {
                    if (index === currentTimerIndex) {
                        return {
                            ...timer,
                            state: 'completed', // Mark current timer as completed
                            skipped: skip ? true : timer.skipped, // Mark as skipped if applicable
                        };
                    }
                    if (index === nextIndex) {
                        return {
                            ...timer,
                            state: 'running', // Start the next timer
                        };
                    }
                    return timer; // Return other timers unchanged
                })
            );

            if (nextIndex < timers.length) {
                // Move to the next timer
                setCurrentTimerIndex(nextIndex); // Update to the next timer
                setElapsedTime(0); // Reset elapsed time for the new timer
                setTotalElapsedTime(updatedTotalElapsedTime); // Update total elapsed time
                setRemainingWorkoutTime(totalWorkoutTime - updatedTotalElapsedTime / 1000); // Update remaining workout time
            } else {
                // No more timers, end the workout
                setIsWorkoutCompleted(true);
                setCurrentTimerIndex(null);
                setElapsedTime(0); // Reset elapsed time for the last timer
                setTotalElapsedTime(updatedTotalElapsedTime); // Finalize total elapsed time
                setRemainingWorkoutTime(0); // No time left in the workout
            }

            // Save updated state
            WorkoutStateManager.saveStateImmediate({
                timers,
                currentTimerIndex: nextIndex < timers.length ? nextIndex : null,
                elapsedTime: 0,
                totalElapsedTime: updatedTotalElapsedTime,
                lastUpdated: Date.now(),
                isWorkoutEditable,
                isWorkoutPaused: currentTimer.state === 'paused',
            });
        }
    };

    // Reset the workout
    const resetWorkout = () => {
        setIsWorkoutCompleted(false);
        const totalWorkoutTime = calculateTotalWorkoutTime(timers);
        setElapsedTime(0); // Reset elapsed time
        setTotalElapsedTime(0); // Reset total elapsed time
        setRemainingWorkoutTime(totalWorkoutTime * 1000); // Reset remaining workout time
        setIsWorkoutEditable(true); // Re-enable editing after reset
        setCurrentTimerIndex(null);
        setTimers(prevTimers =>
            prevTimers.map(timer => ({
                ...timer,
                state: 'not running',
                skipped: false, // Reset skipped status
            })),
        );
    };

    // Update remaining time whenever total elapsed time changes
    useEffect(() => {
        const newRemainingWorkoutTime = Math.max(totalWorkoutTime * 1000 - totalElapsedTime, 0);
        setRemainingWorkoutTime(newRemainingWorkoutTime);
    }, [totalElapsedTime, totalWorkoutTime]);

    // Calculate total workout time
    useEffect(() => {
        const totalWorkoutTime = calculateTotalWorkoutTime(timers);
        setTotalWorkoutTime(totalWorkoutTime);
        // Only reset remaining time if workout is reset (not when completed)
        if (currentTimerIndex === null && !isWorkoutCompleted) {
            setRemainingWorkoutTime(totalWorkoutTime * 1000);
        }
    }, [timers, currentTimerIndex, isWorkoutCompleted]);

    // Save state when relevant values change
    useEffect(() => {
        if (currentTimerIndex !== null) {
            const currentTimer = timers[currentTimerIndex];
            console.log('Saving state - current timer state:', currentTimer.state);
            WorkoutStateManager.saveState({
                timers,
                currentTimerIndex,
                elapsedTime,
                totalElapsedTime,
                lastUpdated: Date.now(),
                isWorkoutEditable: false,
                isWorkoutPaused: currentTimer.state === 'paused',
            });
        }
    }, [timers, currentTimerIndex, elapsedTime, totalElapsedTime]);

    // Clear stored state when workout is reset or completed
    useEffect(() => {
        if (currentTimerIndex === null) {
            WorkoutStateManager.clearState();
        }
    }, [currentTimerIndex]);

    return (
        <WorkoutContext.Provider
            value={{
                timers,
                currentTimerIndex,
                elapsedTime,
                totalElapsedTime,
                totalWorkoutTime,
                remainingWorkoutTime,
                isWorkoutEditable,
                addTimer,
                removeTimer,
                startWorkout,
                nextTimer,
                resetWorkout,
                pauseTimer,
                resumeTimer,
                updateTimer,
                updateTimers,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};

// Custom Hook
export const useWorkout = (): WorkoutContextState => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};
