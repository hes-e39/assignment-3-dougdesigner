export interface BaseTimerProps {
    newTimer?: boolean; // Determines if this is a new timer being configured
    workoutTimer?: boolean; // Determines if this is a timer being controlled by the workout
    workTime?: { minutes: number; seconds: number }; // Work time configuration
    currentTimerElapsedtime?: number; // Elapsed time in milliseconds provided in workout context
    active?: boolean; // Determines if the currently active timer in a workout
    state?: 'not running' | 'running' | 'paused' | 'completed';
    description?: string; // Workout timer description
}
