import '../App.css';
import { useState } from 'react';


const InputTextfield = ({ nameHolder }: { nameHolder: string }) => {
const [text, setText] = useState<string>('')

return (
    <div>
        <input type="text"
         value={text} 
         onChange={(e) => setText(e.target.value)}
         placeholder={nameHolder}
         className='px-10 py-1- rounded-sm border border-white bg-white text-black' />
    </div>
)
}


export default InputTextfield;