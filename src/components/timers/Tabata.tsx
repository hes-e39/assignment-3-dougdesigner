import Button from '../generic/Button';
import DisplayMode from '../generic/DisplayMode';
import DisplayRounds from '../generic/DisplayRounds';
import DisplayTime from '../generic/DisplayTime';
import Panel from '../generic/Panel';
import TabataInputs from '../generic/TabataInputs';

import { useEffect, useRef, useState } from 'react';
import { getHundredths, getMinutes, getSeconds } from '../../utils/helpers';

interface TabataProps {
    onChange?: (config: {
        workTime: { minutes: number; seconds: number };
        restTime: { minutes: number; seconds: number };
        totalRounds: number;
        isValid: boolean;
    }) => void;
    newTimer?: boolean; // Determines if this is a new timer being configured
    workoutTimer?: boolean; // Determines if this is a timer being controlled by the workout
    workTime?: { minutes: number; seconds: number }; // Work time configuration
    restTime?: { minutes: number; seconds: number }; // Rest time configuration
    totalRounds?: number; // Number of rounds
    elapsedTime?: number; // Elapsed time in milliseconds provided in workout context
    active?: boolean; // Determines if the currently active timer in a workout
    state?: 'not running' | 'running' | 'paused' | 'completed';
}

const Tabata: React.FC<TabataProps> = ({
    onChange,
    newTimer = false,
    workoutTimer = false,
    workTime = { minutes: 0, seconds: 0 },
    restTime = { minutes: 0, seconds: 0 },
    elapsedTime = 0,
    totalRounds = 1,
    active = false,
    state = 'not running',
}) => {
    const [inputWorkMinutes, setInputWorkMinutes] = useState(workTime.minutes);
    const [inputWorkSeconds, setInputWorkSeconds] = useState(workTime.seconds);
    const [inputRestMinutes, setInputRestMinutes] = useState(restTime.minutes);
    const [inputRestSeconds, setInputRestSeconds] = useState(restTime.seconds);
    const [rounds, setRounds] = useState(totalRounds);
    const [totalMilliseconds, setTotalMilliseconds] = useState(workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : 0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const currentRoundRef = useRef<number>(1);
    const intervalRef = useRef<number | null>(null);
    const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');

    const workMilliseconds = workoutTimer ? workTime.minutes * 60000 + workTime.seconds * 1000 : inputWorkMinutes * 60000 + inputWorkSeconds * 1000;

    const restMilliseconds = workoutTimer ? restTime.minutes * 60000 + restTime.seconds * 1000 : inputRestMinutes * 60000 + inputRestSeconds * 1000;

    const targetMilliseconds = timerMode === 'work' ? workMilliseconds : restMilliseconds;

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
        setTimerMode('work');
        setTotalMilliseconds(workMilliseconds);
        setIsRunning(true);
        setIsPaused(false);
        setIsCompleted(false);
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        currentRoundRef.current = 1;
        setTimerMode('work');
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

    // Check if input is valid
    const inputValid = () => {
        return workMilliseconds > 0 && restMilliseconds > 0 && rounds > 0;
    };

    // Recalculate `totalMilliseconds` when inputs change
    useEffect(() => {
        if (!workoutTimer) {
            setTotalMilliseconds(targetMilliseconds);
        }
    }, [inputWorkMinutes, inputWorkSeconds]);

    // Watch for when the timer reaches zero and handle round changes
    useEffect(() => {
        if (isRunning && totalMilliseconds === 0) {
            if (timerMode === 'work') {
                setTimerMode('rest');
                setTotalMilliseconds(restMilliseconds);
            } else {
                if (currentRoundRef.current < rounds) {
                    currentRoundRef.current += 1;
                    setTimerMode('work');
                    setTotalMilliseconds(workMilliseconds); // Reset timer for the next round
                } else {
                    // If all rounds are complete, stop the timer
                    fastForwardTimer();
                }
            }
        }
    }, [totalMilliseconds, isRunning, rounds, workMilliseconds, restMilliseconds, timerMode]);

    // Notify parent of changes
    useEffect(() => {
        if (newTimer && onChange) {
            onChange({
                workTime: { minutes: inputWorkMinutes, seconds: inputWorkSeconds },
                restTime: { minutes: inputRestMinutes, seconds: inputRestSeconds },
                totalRounds: rounds,
                isValid: inputValid(),
            });
        }
    }, [inputWorkMinutes, inputWorkSeconds, inputRestMinutes, inputRestSeconds, rounds, newTimer, onChange]);

    // Synchronize `totalMilliseconds` with `elapsedTime` in workout mode
    useEffect(() => {
        if (workoutTimer && active) {
            const roundTime = workMilliseconds + restMilliseconds;
            const elapsedInRound = elapsedTime % roundTime;
            const elapsedRounds = Math.floor(elapsedTime / roundTime);

            currentRoundRef.current = Math.min(elapsedRounds + 1, rounds);

            if (elapsedInRound < workMilliseconds) {
                setTimerMode('work');
                setTotalMilliseconds(Math.max(workMilliseconds - elapsedInRound, 0));
            } else {
                setTimerMode('rest');
                setTotalMilliseconds(Math.max(roundTime - elapsedInRound, 0));
            }
        }
    }, [elapsedTime, workMilliseconds, restMilliseconds, rounds, workoutTimer, active]);

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
            title="Tabata"
            description="An interval timer with work/rest periods. Example: 20s/10s, 8 rounds, would count down from 20 seconds to 0, then count down from 10 seconds to 0, then from 20, then from 10, etc, for 8 rounds. A full round includes both the work and rest. In this case, 20+10=30 seconds per round."
        >
            {/* Timer Display */}
            {!newTimer && (
                <div className="w-full flex justify-center">
                    <DisplayTime minutes={getMinutes(totalMilliseconds)} seconds={getSeconds(totalMilliseconds)} hundredths={getHundredths(totalMilliseconds)} />
                </div>
            )}

            {!newTimer && (
                <div className="mt-2 flex items-baseline gap-x-2 justify-center mb-8">
                    <DisplayMode mode={timerMode} />
                    <p className="text-lg font-semibold tracking-tight text-white ">Round </p>
                    <DisplayRounds rounds={rounds} currentRound={currentRoundRef.current} />
                </div>
            )}

            <hr className="border-slate-700" />

            {/* Timer Inputs */}
            <div className="w-full flex justify-center">
                <TabataInputs
                    workMinutes={inputWorkMinutes}
                    workSeconds={inputWorkSeconds}
                    restMinutes={inputRestMinutes}
                    restSeconds={inputRestSeconds}
                    rounds={rounds}
                    onWorkMinutesChange={setInputWorkMinutes}
                    onWorkSecondsChange={setInputWorkSeconds}
                    onRestMinutesChange={setInputRestMinutes}
                    onRestSecondsChange={setInputRestSeconds}
                    onRoundsChange={setRounds}
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

export default Tabata;
