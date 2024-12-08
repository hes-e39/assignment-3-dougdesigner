import { TimerConfig } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';

// Encode timer configuration to compact string
export const encodeTimerConfig = (timers: TimerConfig[]): string => {
  const encoded = timers.map(timer => {
    // Format: type|workMin,workSec|restMin,restSec|rounds
    let str = `${timer.type}|${timer.workTime.minutes},${timer.workTime.seconds}`;
    
    if (timer.restTime) {
      str += `|${timer.restTime.minutes},${timer.restTime.seconds}`;
    } else {
      str += '|';
    }
    
    str += `|${timer.totalRounds || ''}`;
    str += `|${timer.description || ''}`;
    
    return str;
  });

  return encoded.join(';');
};

export const decodeTimerConfig = (encoded: string): TimerConfig[] => {
  if (!encoded) return [];

  return encoded.split(';').map(timer => {
    const [type, work, rest, rounds, description] = timer.split('|');
    const [workMinutes, workSeconds] = work.split(',').map(Number);

    // Validate timer type
    if (!['stopwatch', 'countdown', 'tabata', 'xy'].includes(type)) {
      throw new Error(`Invalid timer type: ${type}`);
    }

    // Validate work time
    if (
      isNaN(workMinutes) ||
      isNaN(workSeconds) ||
      workMinutes < 0 ||
      workSeconds < 0 ||
      workSeconds >= 60
    ) {
      throw new Error(`Invalid work time: ${work}`);
    }

    const config: TimerConfig = {
      id: uuidv4(),
      type: type as TimerConfig['type'],
      workTime: {
        minutes: workMinutes,
        seconds: workSeconds,
      },
      state: 'not running',
      description: description ? description : undefined,
    };

    // Validate rest time
    if (rest && rest !== '') {
      const [restMinutes, restSeconds] = rest.split(',').map(Number);
      if (
        isNaN(restMinutes) ||
        isNaN(restSeconds) ||
        restMinutes < 0 ||
        restSeconds < 0 ||
        restSeconds >= 60
      ) {
        throw new Error(`Invalid rest time: ${rest}`);
      }
      config.restTime = {
        minutes: restMinutes,
        seconds: restSeconds,
      };
    }

    // Validate rounds
    if (rounds && rounds !== '' && (isNaN(Number(rounds)) || Number(rounds) <= 0)) {
      throw new Error(`Invalid rounds: ${rounds}`);
    }

    if (rounds && rounds !== '') {
      config.totalRounds = Number(rounds);
    }

    return config;
  });
};

// Update URL with new timer configuration
export const updateUrlWithTimers = (timers: TimerConfig[]) => {
  const newUrl = new URL(window.location.href);
    if (timers.length === 0) {
        newUrl.searchParams.delete('config'); // Remove the 'config' query parameter
    } else {
        const encoded = encodeTimerConfig(timers);
        newUrl.searchParams.set('config', encoded);
    }
  window.history.pushState({}, '', newUrl);
};

// Get timer configuration from URL
export const getTimersFromUrl = (): TimerConfig[] => {
  const params = new URLSearchParams(window.location.search);
  const config = params.get('config');
  return config ? decodeTimerConfig(config) : [];
};