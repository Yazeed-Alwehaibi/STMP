import '../App.css';
import Button from '../components/button';
import InputTextfield from '../components/inputTextfield';
import PasswordTextfield from '../components/passwordTextfield';
import RoutingMethods from './routing/RoutingMehods';




const TextInput = () => {

  const {regPage} = RoutingMethods()

  return (
    <>
      <h1>Summer Training Platform</h1>
      <br/>
      <div>
        <InputTextfield nameHolder='USER ID'/>
        <br />
        <PasswordTextfield
        nameHolder='PASSWORD'/>
        <br />
        <div className="flex justify-center space-x-4">
                <Button buttonName="Log in"  />
                <Button buttonName="Register" onClick={regPage} />
            </div>

        </div>
    </>
  )
}

export default TextInput;

