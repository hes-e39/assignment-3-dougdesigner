interface SelectProps {
    id: string;
    label: string;
    value: number;
    options: number[];
    onChange: (value: number) => void;
    disabled: boolean;
}

const Select: React.FC<SelectProps> = ({ id, label, value, options, onChange, disabled }) => {
    return (
        <div className="flex flex-row-reverse items-center">
            <label htmlFor={id} className="block text-lg font-semibold text-white">
                {label}
            </label>
            <select
                id={id}
                value={value}
                disabled={disabled}
                onChange={e => onChange(Number.parseInt(e.target.value))}
                className={`mr-2 py-2 px-4 block w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg ${
                    disabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option.toString()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
