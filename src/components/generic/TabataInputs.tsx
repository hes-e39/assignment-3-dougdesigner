import Select from './Select';

const minuteOptions = Array.from({ length: 61 }, (_, i) => i);
const secondOptions = Array.from({ length: 60 }, (_, i) => i);
const roundOptions = Array.from({ length: 30 }, (_, i) => i + 1);

interface TabataInputProps {
    workMinutes: number;
    workSeconds: number;
    restMinutes: number;
    restSeconds: number;
    rounds: number;
    onWorkMinutesChange: (minutes: number) => void;
    onWorkSecondsChange: (seconds: number) => void;
    onRestMinutesChange: (minutes: number) => void;
    onRestSecondsChange: (seconds: number) => void;
    onRoundsChange: (rounds: number) => void;
    disabled?: boolean;
}

const TabataInput: React.FC<TabataInputProps> = ({
    workMinutes = 0,
    workSeconds = 0,
    restMinutes = 0,
    restSeconds = 0,
    rounds = 1,
    onWorkMinutesChange = () => {},
    onWorkSecondsChange = () => {},
    onRestMinutesChange = () => {},
    onRestSecondsChange = () => {},
    onRoundsChange = () => {},
    disabled = false,
}) => {
    return (
        <div className="flex flex-col space-y-4 items-center mt-8">
            <div className="flex space-x-4">
                <h1 className="text-lg font-semibold text-white self-center">Work:</h1>
                <Select id="workMinutes" label="Minutes" value={workMinutes} options={minuteOptions} onChange={onWorkMinutesChange} disabled={disabled} />
                <Select id="workSeconds" label="Seconds" value={workSeconds} options={secondOptions} onChange={onWorkSecondsChange} disabled={disabled} />
            </div>

            <div className="flex space-x-4">
                <h1 className="text-lg font-semibold text-white self-center">Rest:</h1>
                <Select id="restMinutes" label="Minutes" value={restMinutes} options={minuteOptions} onChange={onRestMinutesChange} disabled={disabled} />
                <Select id="restSeconds" label="Seconds" value={restSeconds} options={secondOptions} onChange={onRestSecondsChange} disabled={disabled} />
            </div>

            <div className="flex space-x-4">
                <div className="flex flex-row-reverse items-center">
                    <Select id="rounds" label="Rounds" value={rounds} options={roundOptions} onChange={onRoundsChange} disabled={disabled} />
                </div>
            </div>
        </div>
    );
};

export default TabataInput;
