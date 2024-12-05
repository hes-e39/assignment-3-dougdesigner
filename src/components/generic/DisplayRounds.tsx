interface DisplayRoundsProps {
    rounds: number;
    currentRound: number;
}

const DisplayRounds: React.FC<DisplayRoundsProps> = ({ rounds, currentRound }) => {
    return (
        <div className="flex items-baseline gap-x-2">
            <div className="text-lg font-semibold tracking-tight text-white font-mono">{currentRound}</div>
            <div className="text-sm text-gray-400 font-mono">/ {rounds}</div>
        </div>
    );
};

export default DisplayRounds;
