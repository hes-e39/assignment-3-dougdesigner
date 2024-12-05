interface ButtonProps {
    type: 'start' | 'pause' | 'resume' | 'reset' | 'fastforward';
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, disabled = false }) => {
    const buttonConfig = {
        start: {
            label: 'Start ▶',
            style: 'bg-green-700 hover:bg-green-800 text-green-100 hover:text-green-200',
        },
        pause: {
            label: 'Pause ⏸',
            style: 'bg-yellow-600 hover:bg-yellow-700 text-yellow-50 hover:text-yellow-100',
        },
        resume: {
            label: 'Resume ▶',
            style: 'bg-green-700 hover:bg-green-800 text-green-100 hover:text-green-200',
        },
        reset: {
            label: 'Reset ↺',
            style: 'bg-blue-700 hover:bg-blue-800 text-blue-200 hover:text-blue-300',
        },
        fastforward: {
            label: 'Fast Forward ⏭',
            style: 'bg-red-800 hover:bg-red-900 text-red-200 hover:text-red-300',
        },
    };

    const disabledStyle = 'bg-gray-700 text-gray-400 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`py-2 px-4 rounded-full w-full text-lg font-semibold transition-all duration-200 ${disabled ? disabledStyle : buttonConfig[type].style}`}
        >
            {buttonConfig[type].label}
        </button>
    );
};

export default Button;
