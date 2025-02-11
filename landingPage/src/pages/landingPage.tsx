import '../App.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import InputTextfield from '../components/inputTextfield';
import PasswordTextfield from '../components/passwordTextfield';




const TextInput = () => {
 
    const navigate = useNavigate();
    const handleregisterclick = () => {
        
        navigate('/registarationPage')
        
    }

  return (
    <>
      <h1>Summer Training Platform</h1>
      <br/>
      <div>
        <InputTextfield nameHolder='USER ID' 
        
        />
        <br />
        <PasswordTextfield
        nameHolder='PASSWORD'
        />
        <br />
        <div className="flex justify-center space-x-4">
                <Button buttonName="Log in"  />
                <Button buttonName="Register" onClick={handleregisterclick} />
            </div>

        </div>
    </>
  )
}

export default TextInput;

