import './App.css';
import { useState } from 'react';


const TextInput = () => {
 
    const [text, setText] = useState<string>('')

  return (
    <>
      <h1>Summer Training Platform</h1>
      <br />
      <br />
      <div className="card">
        <input type="text" value={text} onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        } 
        placeholder="           USERNAME"
        className="w-full p-2 rounded-full border border-gray bg-white text-black  focus:outline-none focus:ring-1 focus:ring-white-500" 
        />
        <br />
        <br />
      <input type="text" value={text} onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        } 
        placeholder="           PASSWORD"
        className="w-full p-2 rounded-full border border-gray bg-white text-black  focus:outline-none focus:ring-1 focus:ring-white-500" 
        />
        
        <br />
        <br />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          log in
        </button>
        <button className="px-4 py-2 bg-blue-50 text-white rounded-md hover:bg-blue-600 transition">
          register
        </button>
        </div>
    </>
  )
}

export default TextInput;

