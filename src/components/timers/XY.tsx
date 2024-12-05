import Button from '../generic/Button';
import DisplayRounds from '../generic/DisplayRounds';
import DisplayTime from '../generic/DisplayTime';
import Inputs from '../generic/Inputs';
import Panel from '../generic/Panel';

import { useEffect, useRef, useState } from 'react';
import { getHundredths, getMinutes, getSeconds } from '../../utils/helpers';

interface XYProps {
    onChange?: (config: {
        workTime: { minutes: number; seconds: number };
        totalRounds: number;
        isValid: boolean;
    }) => void;
    newTimer?: boolean; // Determines if this is a new timer being configured
    workoutTimer?: boolean; // Determines if this is a timer being controlled by the workout
    workTime?: { minutes: number; seconds: number }; // Work time configuration
    totalRounds?: number; // Number of rounds
    // currentRound?: number; // Current round
    elapsedTime?: number; // Elapsed time in milliseconds provided in workout context
    active?: boolean; // Determines if the currently active timer in a workout
    state?: 'not running' | 'running' | 'paused' | 'completed';
}

const XY: React.FC<XYProps> = ({
    onChange,
    newTimer = false,
    workoutTimer = false,
    workTime = { minutes: 0, seconds: 0 },
    elapsedTime = 0,
    totalRounds = 1,
    // currentRound = 1,
    active = false,
    state = 'not running',
}) => {
    const [inputMinutes, setInputMinutes] = useState(workTime.minutes);
    const [inputSeconds, setInputSeconds] = useState(workTime.seconds);
    const [rounds, setRounds] = useState(totalRounds);
    const [totalMilliseconds, setTotalMilliseconds] = useState(workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : 0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const currentRoundRef = useRef<number>(1);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : inputMinutes * 60000 + inputSeconds * 1000;

    // Countdown function
    const tick = () => {
        setTotalMilliseconds(prevMilliseconds => {
            if (prevMilliseconds > 0) {
                return prevMilliseconds - 10;
            } else {
                return 0; // Return 0 to stop the countdown
            }
        });
    };

    // Start timer function
    const startTimer = () => {
        currentRoundRef.current = 1;
        setTotalMilliseconds(targetMilliseconds);
        setIsRunning(true);
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        currentRoundRef.current = 1;
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
        currentRoundRef.current = rounds;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
    };

    // Input change for minutes, seconds, and rounds
    const handleMinutesChange = (minutes: number) => {
        setInputMinutes(minutes);
        if (!isRunning) {
            setTotalMilliseconds(minutes * 60000 + inputSeconds * 1000);
        }
    };

    const handleSecondsChange = (seconds: number) => {
        setInputSeconds(seconds);
        if (!isRunning) {
            setTotalMilliseconds(inputMinutes * 60000 + seconds * 1000);
        }
    };

    const handleRoundsChange = (rounds: number) => {
        setRounds(rounds);
    };

    // Check if input is valid
    const inputValid = () => {
        return targetMilliseconds > 0;
    };

    // Watch for when the timer reaches zero and handle round changes
    useEffect(() => {
        if (isRunning && totalMilliseconds === 0) {
            if (currentRoundRef.current < rounds) {
                // Move to the next round
                setTimeout(() => {
                    currentRoundRef.current += 1;
                    setTotalMilliseconds(targetMilliseconds); // Reset timer for the next round
                }, 100); // Delay to smooth the UI update
            } else {
                // If all rounds are complete, stop the timer
                fastForwardTimer();
            }
        }
    }, [totalMilliseconds, isRunning, rounds, targetMilliseconds]);

    // Notify parent of changes
    useEffect(() => {
        if (newTimer && onChange) {
            onChange({
                workTime: { minutes: inputMinutes, seconds: inputSeconds },
                totalRounds: rounds,
                isValid: inputValid(),
            });
        }
    }, [inputMinutes, inputSeconds, rounds, newTimer, onChange]);

    // Synchronize `totalMilliseconds` with `elapsedTime` in workout mode
    useEffect(() => {
        if (workoutTimer && active) {
            const elapsedForRound = elapsedTime % targetMilliseconds;
            setTotalMilliseconds(Math.max(targetMilliseconds - elapsedForRound, 0));
            currentRoundRef.current = Math.min(Math.floor(elapsedTime / targetMilliseconds) + 1, rounds);
        }
    }, [elapsedTime, workoutTimer, active, targetMilliseconds, rounds]);

    // Handle timer state changes
    useEffect(() => {
        if (workoutTimer) {
            if (state === 'not running') {
                resetTimer(); // Reset the timer for all states
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

    // Clear interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Panel
            title="XY"
            description="A timer that counts down from X time per round, for Y number of rounds (e.g. 1 minute for 10 rounds would count down from 1 minute to 0, then start another countdown, etc, 10 times)."
        >
            <div className="mb-8">
                {/* Timer Display */}
                {!newTimer && (
                    <div className="w-full flex justify-center">
                        <DisplayTime minutes={getMinutes(totalMilliseconds)} seconds={getSeconds(totalMilliseconds)} hundredths={getHundredths(totalMilliseconds)} />
                    </div>
                )}

                {!newTimer && (
                    <div className="mt-2 flex items-baseline gap-x-2 justify-center">
                        <p className="text-lg font-semibold tracking-tight text-white ">Round</p>
                        <DisplayRounds rounds={rounds} currentRound={currentRoundRef.current} />
                    </div>
                )}
            </div>

            <hr className="border-slate-700" />

            {/* Timer Inputs */}
            <div className="w-full flex justify-center">
                <Inputs
                    minutes={inputMinutes}
                    seconds={inputSeconds}
                    rounds={rounds}
                    onMinutesChange={handleMinutesChange}
                    onSecondsChange={handleSecondsChange}
                    onRoundsChange={handleRoundsChange}
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

export default XY;
