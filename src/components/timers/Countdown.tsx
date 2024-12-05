import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import Inputs from '../generic/Inputs';
import Panel from '../generic/Panel';

import { useEffect, useRef, useState } from 'react';
import { getDisplayHundredths, getDisplayMinutes, getDisplaySeconds } from '../../utils/helpers';

interface CountdownProps {
    onChange?: (config: {
        workTime: { minutes: number; seconds: number };
        isValid: boolean;
    }) => void;
    newTimer?: boolean; // Determines if this is a new timer being configured
    workoutTimer?: boolean; // Determines if this is a timer being controlled by the workout
    workTime?: { minutes: number; seconds: number }; // Work time configuration
    elapsedTime?: number; // Elapsed time in milliseconds provided in workout context
    active?: boolean; // Determines if the currently active timer in a workout
    state?: 'not running' | 'running' | 'paused' | 'completed';
}

const Countdown: React.FC<CountdownProps> = ({ workTime = { minutes: 0, seconds: 0 }, elapsedTime = 0, onChange, newTimer = false, workoutTimer = false, active = false, state = 'not running' }) => {
    const [inputMinutes, setInputMinutes] = useState(workTime.minutes);
    const [inputSeconds, setInputSeconds] = useState(workTime.seconds);
    const [totalMilliseconds, setTotalMilliseconds] = useState(workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : 0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : inputMinutes * 60000 + inputSeconds * 1000;

    // Countdown function
    const tick = () => {
        setTotalMilliseconds(prevMilliseconds => {
            if (prevMilliseconds > 0) {
                return prevMilliseconds - 10;
            } else {
                fastForwardTimer();
                return 0;
            }
        });
    };

    // Start timer function
    const startTimer = () => {
        setIsRunning(true);
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        setTotalMilliseconds(targetMilliseconds);
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
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Fast forward timer function
    const fastForwardTimer = () => {
        setTotalMilliseconds(0);
        setIsCompleted(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
    };

    // Input change for minutes and seconds functions
    const handleMinutesChange = (minutes: number) => {
        setInputMinutes(minutes);
        setTotalMilliseconds(targetMilliseconds);
    };

    const handleSecondsChange = (seconds: number) => {
        setInputSeconds(seconds);
        setTotalMilliseconds(targetMilliseconds);
    };

    // Check if input is valid
    const inputValid = () => {
        return targetMilliseconds > 0;
    };

    // Notify parent of changes during new timer configuration
    useEffect(() => {
        if (newTimer && onChange) {
            onChange({
                workTime: { minutes: inputMinutes, seconds: inputSeconds },
                isValid: inputValid(),
            });
        }
    }, [inputMinutes, inputSeconds, newTimer, onChange]);

    // Synchronize `totalMilliseconds` with `elapsedTime`
    useEffect(() => {
        if (workoutTimer && active) {
            const remainingMilliseconds = targetMilliseconds - elapsedTime;
            setTotalMilliseconds(Math.max(remainingMilliseconds, 0));
        }
    }, [elapsedTime, targetMilliseconds, workoutTimer]);

    useEffect(() => {
        // Handle timer state changes, including reset
        if (workoutTimer) {
            if (state === 'not running') {
                resetTimer(); // Always reset the timer, regardless of `active`
            } else if (state === 'completed') {
                fastForwardTimer(); // Fast forward the timer if completed
            } else if (active) {
                // Handle only the active timer for running, pausing, and completing
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

    // Clear interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Panel title="Countdown" description="A timer that counts down from X amount of time (e.g. count down to 0, starting at 2 minutes and 30)">
            {/* Timer Display */}
            {!newTimer && (
                <div className="w-full flex justify-center mb-8">
                    <DisplayTime
                        minutes={getDisplayMinutes(totalMilliseconds, isRunning, inputMinutes)}
                        seconds={getDisplaySeconds(totalMilliseconds, isRunning, inputSeconds)}
                        hundredths={getDisplayHundredths(totalMilliseconds, isRunning)}
                        // noHundredths={workoutTimer ? true : false}
                    />
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
                        <>{isRunning ? <Button type={isPaused ? 'resume' : 'pause'} onClick={isPaused ? resumeTimer : pauseTimer} /> : inputValid() && <Button type="start" onClick={startTimer} />}</>
                    )}

                    {(isRunning || isPaused || isCompleted) && <Button type="reset" onClick={resetTimer} />}
                    {isRunning && !isCompleted && <Button type="fastforward" onClick={fastForwardTimer} />}
                </div>
            )}
        </Panel>
    );
};

export default Countdown;
