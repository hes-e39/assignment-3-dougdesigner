import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for timers
import TimersList from '../components/generic/TimersList';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import { useWorkout } from '../context/WorkoutContext';

const AddTimerView = () => {
    const { timers, addTimer, removeTimer } = useWorkout(); // Use the custom hook to access the context
    const [timerType, setTimerType] = useState<string | null>(null);
    const [timerConfig, setTimerConfig] = useState<any>(null); // Store the configuration for the current timer
    const [isTimerValid, setIsTimerValid] = useState(false); // Track if the timer is valid

    const navigate = useNavigate(); // Initialize navigate hook

    const handleSave = () => {
        if (timerType && timerConfig && isTimerValid) {
            const timer = {
                id: uuidv4(), // Generate a unique ID for the timer
                type: timerType,
                ...timerConfig,
                state: 'not running',
            };
            addTimer(timer);
            alert('Timer added successfully!');
            resetForm();
            navigate('/'); // Redirect to /work after saving
        } else {
            alert('Configure a valid timer before saving.');
        }
    };

    const resetForm = () => {
        setTimerType(null);
        setTimerConfig(null);
        setIsTimerValid(false);
    };

    const initializeTimerConfig = (type: string) => {
        switch (type) {
            case 'Stopwatch':
                return {
                    type: 'stopwatch',
                    workTime: { minutes: 0, seconds: 0 },
                    rounds: 1,
                    currentRound: 1,
                    timerMode: 'work',
                    state: 'not running',
                    skipped: false,
                };
            case 'Countdown':
                return {
                    type: 'countdown',
                    workTime: { minutes: 0, seconds: 0 },
                    rounds: 1,
                    currentRound: 1,
                    timerMode: 'work',
                    state: 'not running',
                    skipped: false,
                };
            case 'XY':
                return {
                    type: 'xy',
                    workTime: { minutes: 0, seconds: 0 },
                    rounds: 1,
                    currentRound: 1,
                    timerMode: 'work',
                    state: 'not running',
                    skipped: false,
                };
            case 'Tabata':
                return {
                    type: 'tabata',
                    workTime: { minutes: 0, seconds: 0 },
                    restTime: { minutes: 0, seconds: 0 },
                    rounds: 1,
                    currentRound: 1,
                    timerMode: 'work',
                    state: 'not running',
                    skipped: false,
                };
            default:
                return null;
        }
    };

    const handleTimerTypeChange = (type: string) => {
        setTimerType(type);
        setTimerConfig(initializeTimerConfig(type)); // Initialize default config
        setIsTimerValid(false); // Reset validity when timer type changes
    };

    const handleTimerChange = (config: any) => {
        // Avoid unnecessary updates
        setTimerConfig((prevConfig: any) => {
            const updatedConfig = { ...prevConfig, ...config };
            if (JSON.stringify(updatedConfig) !== JSON.stringify(prevConfig)) {
                setIsTimerValid(config.isValid); // Update validity only when needed
                return updatedConfig;
            }
            return prevConfig;
        });
    };

    const renderTimerInputs = () => {
        switch (timerType) {
            case 'Stopwatch':
                return <Stopwatch onChange={handleTimerChange} newTimer={true} />;
            case 'Countdown':
                return <Countdown onChange={handleTimerChange} newTimer={true} />;
            case 'XY':
                return <XY onChange={handleTimerChange} newTimer={true} />;
            case 'Tabata':
                return <Tabata onChange={handleTimerChange} newTimer={true} />;

            default:
                return <p className="text-slate-500 text-sm text-left mr-auto">Configure a valid timer and save it to add it to your workout.</p>;
        }
    };

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between py-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">Add timer</h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <NavLink
                        to="/"
                        className="inline-flex items-center rounded-full bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="-ml-0.5 mr-1.5 size-4">
                            <title>Back to workout</title>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        Back
                    </NavLink>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!timerType || !isTimerValid} // Use isTimerValid for button state
                        className={`ml-3 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            !timerType || !isTimerValid ? 'cursor-not-allowed bg-slate-800 focus-visible:outline-slate-800' : 'bg-indigo-600  hover:bg-indigo-500  focus-visible:outline-indigo-600'
                        }`}
                    >
                        Save timer
                    </button>
                </div>
            </div>

            {/* Timer configuration */}
            <div className="max-w-lg mt-6 bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg items-center justify-center mx-auto">
                <div className="mr-auto w-full max-w-xs">
                    <p className="font-bold text-white truncate text-2xl tracking-tight">Timer configuration</p>
                    <div className="py-6">
                        <label htmlFor="timerType" className="block text-lg font-semibold text-white">
                            Timer type
                        </label>
                        <select
                            id="timerType"
                            name="timerType"
                            className="mt-2 r-2 py-2 px-4 block w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                            onChange={e => handleTimerTypeChange(e.target.value)}
                            value={timerType || ''}
                        >
                            <option value="" disabled>
                                Select a timer
                            </option>
                            <option value="Stopwatch">Stopwatch</option>
                            <option value="Countdown">Countdown</option>
                            <option value="XY">XY</option>
                            <option value="Tabata">Tabata</option>
                        </select>
                    </div>
                </div>

                <div className="md:flex md:items-center md:justify-between">{renderTimerInputs()}</div>

                <div className="hidden mx-auto w-full max-w-sm">
                    <TimersList timers={timers} onRemoveTimer={removeTimer} />
                </div>
            </div>
        </div>
    );
};

export default AddTimerView;
