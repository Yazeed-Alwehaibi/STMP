import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const TextInput = () => {
 
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigate = useNavigate();
    const handleregisterclick = () => {
        
        navigate('/registarationPage')
        
    }

  return (
    <>
      <h1>Summer Training Platform</h1>
      <br />
      <br />
      <div className="card">
        <input type="text" value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        } 
        placeholder="           USERNAME"
        className="w-full p-2 rounded-full border border-gray bg-white text-black  focus:outline-none focus:ring-1 focus:ring-white-500" 
        />
        <br />
        <br />
      <input type="password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        } 
        placeholder="           PASSWORD"
        className="w-full p-2 rounded-full border border-gray bg-white text-black  focus:outline-none focus:ring-1 focus:ring-white-500" 
        />
        
        <br />
        <br />
        <button 
        className="px-4 py-2 bg-white mr-2  text-black rounded-md hover:bg-blue-600 transition">
          log in
        </button>
        <button 
        onClick={handleregisterclick}
        className=" px-4 py-2 mr-2 bg-white text-black rounded-md hover:bg-gray-600 transition">
          register
        </button>
        </div>
    </>
  )
}

export default TextInput;

