import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Stopwatch from '../components/timers/Stopwatch';
import Countdown from '../components/timers/Countdown';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import { useWorkout } from '../context/WorkoutContext';

const EditTimerView = () => {
    const { id } = useParams(); // Get timer ID from the URL
    const { timers, updateTimer } = useWorkout();
    const navigate = useNavigate();

    const [timer, setTimer] = useState<any>(null);
    const [description, setDescription] = useState<string>('');
    const [isTimerValid, setIsTimerValid] = useState(false);

    // Fetch the timer configuration by ID
    useEffect(() => {
        const selectedTimer = timers.find(t => t.id === id);
        if (!selectedTimer) {
            navigate('/'); // Redirect if timer is not found
        } else {
            setTimer(selectedTimer);
            setDescription(selectedTimer.description || '');
        }
    }, [id, timers, navigate]);

    const handleTimerChange = (config: any) => {
        setTimer((prevTimer: any) => ({
            ...prevTimer,
            ...config,
        }));
        setIsTimerValid(config.isValid || false); // Update validity
    };

    const handleSave = () => {
        if (timer && isTimerValid) {
            updateTimer(id!, { ...timer, description }); // Update timer in context
            navigate('/'); // Redirect to workout view
        } else {
            alert('Please ensure the timer is valid before saving.');
        }
    };

    const renderTimerInputs = () => {
        if (!timer) return null;

        switch (timer.type) {
            case 'stopwatch':
                return <Stopwatch onChange={handleTimerChange} newTimer={true} workTime={timer.workTime} />;
            case 'countdown':
                return <Countdown onChange={handleTimerChange} newTimer={true} workTime={timer.workTime} />;
            case 'tabata':
                return (
                    <Tabata
                        onChange={handleTimerChange}
                        newTimer={true}
                        workTime={timer.workTime}
                        restTime={timer.restTime}
                        totalRounds={timer.totalRounds}
                    />
                );
            case 'xy':
                return (
                    <XY
                        onChange={handleTimerChange}
                        newTimer={true}
                        workTime={timer.workTime}
                        totalRounds={timer.totalRounds}
                    />
                );
            default:
                return <p className="text-slate-500">Invalid timer type.</p>;
        }
    };

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between py-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">Edit Timer</h2>
                </div>
                <div className="mt-4 flex md:ml-4">
                    <NavLink
                        to="/"
                        className="rounded-full bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
                    >
                        Cancel
                    </NavLink>
                </div>
            </div>

            <div className="max-w-lg mx-auto bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
                {timer && (
                    <>
                        {renderTimerInputs()}

                        <div className="mt-6">
                            <label htmlFor="description" className="block text-lg font-semibold text-white">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                placeholder="e.g., 50 push-ups"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="mt-2 block w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg py-2 px-4"
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditTimerView;