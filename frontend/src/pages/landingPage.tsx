import '../App.css';
import Button from '../components/buttons/button';
import InputTextfield from '../components/inputFields/inputTextfield';
import PasswordTextfield from '../components/inputFields/passwordTextfield';
import RoutingMethods from './routing/RoutingMethods';




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

