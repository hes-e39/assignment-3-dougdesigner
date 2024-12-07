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
    
    return str;
  });

  return encoded.join(';');
};

// Decode URL string to timer configuration
export const decodeTimerConfig = (encoded: string): TimerConfig[] => {
  if (!encoded) return [];
  
  return encoded.split(';').map(timer => {
    const [type, work, rest, rounds] = timer.split('|');
    const [workMinutes, workSeconds] = work.split(',').map(Number);
    
    const config: TimerConfig = {
      id: uuidv4(),
      type: type as TimerConfig['type'],
      workTime: {
        minutes: workMinutes,
        seconds: workSeconds
      },
      state: 'not running'
    };

    if (rest && rest !== '') {
      const [restMinutes, restSeconds] = rest.split(',').map(Number);
      config.restTime = {
        minutes: restMinutes,
        seconds: restSeconds
      };
    }

    if (rounds && rounds !== '') {
      config.totalRounds = Number(rounds);
    }

    return config;
  });
};

// Update URL with new timer configuration
export const updateUrlWithTimers = (timers: TimerConfig[]) => {
  const encoded = encodeTimerConfig(timers);
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('config', encoded);
  window.history.pushState({}, '', newUrl);
};

// Get timer configuration from URL
export const getTimersFromUrl = (): TimerConfig[] => {
  const params = new URLSearchParams(window.location.search);
  const config = params.get('config');
  return config ? decodeTimerConfig(config) : [];
};