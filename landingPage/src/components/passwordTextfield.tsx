import '../App.css';
import { useState } from 'react';

const PasswordTextfield = () => {
const [text, setText] = useState<string>('')

return (
    <div>
        <input type="password"
         value={text} 
         onChange={(e) => setText(e.target.value)}
         placeholder='USERNAME'
         className='px-2 py-2 rounded-sm border border-white bg-white text-black' />
    </div>
)
}


export default PasswordTextfield;