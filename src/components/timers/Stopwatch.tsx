import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import Inputs from '../generic/Inputs';
import Panel from '../generic/Panel';

import { useEffect, useRef, useState } from 'react';
import { getHundredths, getMinutes, getSeconds } from '../../utils/helpers';

interface StopwatchProps {
    onChange?: (config: { workTime: { minutes: number; seconds: number }; isValid: boolean }) => void;
    newTimer?: boolean; // Determines if this is a new timer being configured
    workoutTimer?: boolean; // Determines if this is a timer being controlled by the workout
    workTime?: { minutes: number; seconds: number }; // Work time configuration
    elapsedTime?: number; // Elapsed time in milliseconds provided in workout context
    active?: boolean; // Determines if the currently active timer in a workout
    state?: 'not running' | 'running' | 'paused' | 'completed';
}

const Stopwatch: React.FC<StopwatchProps> = ({ onChange, newTimer = false, workoutTimer = false, elapsedTime = 0, active = false, state = 'not running', workTime = { minutes: 0, seconds: 0 } }) => {
    const [inputMinutes, setInputMinutes] = useState(workTime.minutes);
    const [inputSeconds, setInputSeconds] = useState(workTime.seconds);
    const [totalMilliseconds, setTotalMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : inputMinutes * 60000 + inputSeconds * 1000;

    // Stopwatch function
    const tick = () => {
        setTotalMilliseconds(prevMilliseconds => {
            if (prevMilliseconds < targetMilliseconds) {
                return prevMilliseconds + 10;
            } else {
                fastForwardTimer();
                return prevMilliseconds;
            }
        });
    };

    // Start timer function
    const startTimer = () => {
        setIsRunning(true);
        intervalRef.current = setInterval(tick, 10);
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        setTotalMilliseconds(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Pause timer function
    const pauseTimer = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Resume timer function
    const resumeTimer = () => {
        setIsPaused(false);
        intervalRef.current = setInterval(tick, 10);
    };

    // Fast forward timer function
    const fastForwardTimer = () => {
        setTotalMilliseconds(targetMilliseconds);
        setIsCompleted(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
    };

    // Input change functions
    const handleMinutesChange = (minutes: number) => {
        setInputMinutes(minutes);
    };

    const handleSecondsChange = (seconds: number) => {
        setInputSeconds(seconds);
    };

    // Check if input is valid
    const inputValid = () => {
        return targetMilliseconds > 0;
    };

    // Notify parent of changes
    useEffect(() => {
        if (newTimer && onChange) {
            onChange({
                workTime: { minutes: inputMinutes, seconds: inputSeconds },
                isValid: inputValid(),
            });
        }
    }, [inputMinutes, inputSeconds, onChange, newTimer]);

    // Synchronize `totalMilliseconds` with `elapsedTime` if in workout mode
    useEffect(() => {
        if (workoutTimer && active) {
            setTotalMilliseconds(elapsedTime);
        }
    }, [elapsedTime, workoutTimer, active]);

    // Handle timer state changes
    useEffect(() => {
        if (workoutTimer) {
            if (state === 'not running') {
                resetTimer(); // Always reset the timer
            } else if (state === 'completed') {
                fastForwardTimer(); // Mark as completed
            } else if (active) {
                switch (state) {
                    case 'running':
                        if (isPaused) {
                            resumeTimer();
                        } else {
                            startTimer();
                        }
                        break;
                    case 'paused':
                        pauseTimer();
                        break;
                }
            }
        }
    }, [state, active, workoutTimer]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Panel title="Stopwatch" description="A timer that counts up to X amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0)">
            {/* Timer Display */}
            {!newTimer && (
                <div className="w-full flex justify-center mb-8">
                    <DisplayTime minutes={getMinutes(totalMilliseconds)} seconds={getSeconds(totalMilliseconds)} hundredths={getHundredths(totalMilliseconds)} />
                </div>
            )}

            <hr className="border-slate-700" />

            {/* Timer Inputs */}
            <div className="w-full flex justify-center">
                <Inputs
                    minutes={inputMinutes}
                    seconds={inputSeconds}
                    onMinutesChange={handleMinutesChange}
                    onSecondsChange={handleSecondsChange}
                    disabled={isRunning || isPaused || isCompleted || workoutTimer}
                />
            </div>

            {/* Timer Buttons */}
            {!newTimer && !workoutTimer && (
                <div className="flex flex-col w-full space-y-4 mt-5 min-h-48">
                    {!isCompleted && (
                        <>
                            {isRunning ? (
                                isPaused ? (
                                    <Button type="resume" onClick={resumeTimer} />
                                ) : (
                                    <Button type="pause" onClick={pauseTimer} />
                                )
                            ) : (
                                inputValid() && <Button type="start" onClick={startTimer} />
                            )}
                        </>
                    )}

                    {(isRunning || isPaused || isCompleted) && <Button type="reset" onClick={resetTimer} />}

                    {isRunning && !isCompleted && <Button type="fastforward" onClick={fastForwardTimer} />}
                </div>
            )}
        </Panel>
    );
};

export default Stopwatch;
