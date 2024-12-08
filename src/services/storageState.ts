import { TimerConfig } from '../context/WorkoutContext';

interface WorkoutState {
  timers: TimerConfig[];
  currentTimerIndex: number | null;
  currentTimerElapsedtime: number;
  totalElapsedTime: number;
  lastUpdated: number;
  isWorkoutEditable: boolean;
  isWorkoutPaused: boolean;
}

// Enhanced throttle wrapper that allows immediate execution when needed
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: any, ...args: any[]) {
    // Extract immediate flag from args if present
    const immediate = args[args.length - 1]?.immediate === true;
    
    if (immediate) {
      // Remove immediate flag from args
      args.pop();
      // Execute immediately
      func.apply(this, args);
      return;
    }

    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

export class WorkoutStateManager {
  private static STORAGE_KEY = 'workout_state';
  private static WRITE_INTERVAL = 1000; // Write every second
  private static STATE_EXPIRY = 3600000; // 1 hour

  // Internal save function that does the actual saving
  private static _saveState(state: WorkoutState) {
    try {
      const stateToSave = {
        ...state,
        timers: state.timers.map((timer) => ({
          ...timer,
          state: timer.state
        })),
        lastUpdated: Date.now(),
        isWorkoutPaused: state.currentTimerIndex !== null && 
                        state.timers[state.currentTimerIndex].state === 'paused'
      };

      localStorage.setItem(
        WorkoutStateManager.STORAGE_KEY,
        JSON.stringify(stateToSave)
      );
    } catch (error) {
      console.error('Error saving workout state:', error);
    }
  }

  // Throttled save for regular updates
  static saveState = throttle(WorkoutStateManager._saveState, WorkoutStateManager.WRITE_INTERVAL);

  // Immediate save for critical state changes
  static saveStateImmediate(state: WorkoutState) {
    WorkoutStateManager.saveState(state, { immediate: true });
  }

  // Load workout state from localStorage
  static loadState = (): WorkoutState | null => {
    try {
      const saved = localStorage.getItem(WorkoutStateManager.STORAGE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved) as WorkoutState;
      const timeSinceLastUpdate = Date.now() - state.lastUpdated;

      if (timeSinceLastUpdate > WorkoutStateManager.STATE_EXPIRY) {
        WorkoutStateManager.clearState();
        return null;
      }

      const restoredTimers = state.timers.map((timer, index) => {
        if (index === state.currentTimerIndex) {
          return {
            ...timer,
            state: state.isWorkoutPaused ? 'paused' : timer.state
          };
        }
        return { ...timer };
      });

      return {
        ...state,
        timers: restoredTimers
      };
    } catch (error) {
      console.error('Error loading workout state:', error);
      return null;
    }
  };

  // Clear saved workout state
  static clearState = () => {
    localStorage.removeItem(WorkoutStateManager.STORAGE_KEY);
  };
}