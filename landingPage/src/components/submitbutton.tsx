import '../App.css';

const Button = ({ buttonName }: { buttonName: string }) => {
    return(
    <div>
        <button className='px-10 py-1
                           rounded-sm border
                           border-black
                           bg-blue-200
                           text-black
                           hover:bg-gray-500'
                           
        type='submit'
        onClick={() => console.log('Button clicked')}
        aria-label={buttonName}
        >
            {buttonName}
        </button>
    </div>
    )
}

export default Button;