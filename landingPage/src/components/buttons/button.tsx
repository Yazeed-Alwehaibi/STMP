import '../../App.css';

interface ButtonProps {
    buttonName: string;
    onClick?: () => void; // Optional onClick function
}

const Button = ({ buttonName, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick} // Attach the onClick function
            className="w-40 h-15 
                       rounded-sm border 
                       bg-white 
                       text-black 
                       hover:bg-gray-500 
                       transition duration-300"
        >
            {buttonName}
        </button>
    );
};

export default Button;
