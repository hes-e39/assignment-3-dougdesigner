import { useWorkout } from "../context/WorkoutContext";
import TimersListHistory from "../components/generic/TimersListHistory";
import HistoryEmptyState from "../components/generic/HistoryEmptyState";

const History = () => {
    const { history } = useWorkout();

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between py-8">
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-white truncate text-3xl tracking-tight">History</h2>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-lg bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
                        <p className="font-bold text-white truncate text-2xl tracking-tight">Workout History</p>
                        <HistoryEmptyState
                            title="No completed workouts"
                            description="Complete a workout to save it to your history."
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    {history.map(workout => (
                        <div key={workout.id} className="w-full max-w-lg bg-slate-900 px-4 py-6 sm:px-6 lg:px-8 rounded-lg">
                            <p className="font-semibold text-slate-500 truncate text-xl tracking-tight">
                                Completed on {new Date(workout.date).toLocaleDateString()} 
                            </p>
                            <TimersListHistory timers={workout.timers} disableRemove={true} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
