import '../App.css';
import { useState } from 'react';

const PasswordTextfield = ({ nameHolder }: { nameHolder: string }) => {
const [password, setText] = useState<string>('')

return (
    <div>
        <input type="password"
         value={password} 
         onChange={(e) => setText(e.target.value)}
         placeholder={nameHolder}
         className='px-2 py-2 rounded-sm border border-white bg-white text-black hover:bg-gray-400' />
    </div>
)
}


export default PasswordTextfield;