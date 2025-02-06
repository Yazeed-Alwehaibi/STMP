import '../App.css';
import { useState } from 'react';


const RadioButton = ({ nameHolder, valueHolder }: { nameHolder: string; valueHolder: string }) => {

    const [selectedOption, setSelectedOption] = useState<string>('');

    return(
    <div>
        <input type="radio"
             value={valueHolder}
             checked={selectedOption === valueHolder}
             onChange={(e) => setSelectedOption(e.target.value)}
            className='px-10 py-1 rounded-sm border border-black bg-white text-white' />{nameHolder}
    </div>
    )
}
export default RadioButton;