// import Stopwatch from "../timers/Stopwatch";
// import Countdown from "../timers/Countdown";
// import Tabata from "../timers/Tabata";
// import XY from "../timers/XY";

// interface TimerConfig {
//   id: string;
//   type: "stopwatch" | "countdown" | "tabata" | "xy";
//   workTime: { minutes: number; seconds: number };
//   restTime?: { minutes: number; seconds: number };
//   rounds?: number;
//   currentRound?: number;
//   timerMode?: "work" | "rest";
//   state: "not running" | "running" | "paused" | "completed";
//   skipped: boolean;
// }

// interface WorkoutTimersProps {
//   timers: TimerConfig[];
//   currentTimerIndex: number | null;
//   elapsedTime: number; // Elapsed time in milliseconds for the active timer
// }

// const WorkoutTimers: React.FC<WorkoutTimersProps> = ({
//   timers,
//   currentTimerIndex,
//   elapsedTime,
// }) => {
//   return (
//     <div className="workout-timers space-y-4">
//       {timers.map((timer, index) => {
//         // Determine if this is the active timer
//         const isActive = currentTimerIndex === index;

//         switch (timer.type) {
//           case "stopwatch":
//             return (
//               <div key={timer.id} className="timer-container">
//                 <Stopwatch elapsedTime={isActive ? elapsedTime : 0} />
//               </div>
//             );

//           case "countdown":
//             return (
//               <div key={timer.id} className="timer-container">
//                 <Countdown
//                   workTime={timer.workTime}
//                   elapsedTime={isActive ? elapsedTime : 0}
//                 />
//               </div>
//             );

//           case "tabata":
//             return (
//               <div key={timer.id} className="timer-container">
//                 <Tabata
//                   workTime={timer.workTime}
//                   restTime={timer.restTime || { minutes: 0, seconds: 0 }}
//                   rounds={timer.rounds || 1}
//                   currentRound={timer.currentRound || 1}
//                   timerMode={timer.timerMode || "work"}
//                   elapsedTime={isActive ? elapsedTime : 0}
//                 />
//               </div>
//             );

//           case "xy":
//             return (
//               <div key={timer.id} className="timer-container">
//                 <XY
//                   workTime={timer.workTime}
//                   restTime={timer.restTime || { minutes: 0, seconds: 0 }}
//                   rounds={timer.rounds || 1}
//                   currentRound={timer.currentRound || 1}
//                   timerMode={timer.timerMode || "work"}
//                   elapsedTime={isActive ? elapsedTime : 0}
//                 />
//               </div>
//             );

//           default:
//             return null;
//         }
//       })}
//     </div>
//   );
// };

// export default WorkoutTimers;