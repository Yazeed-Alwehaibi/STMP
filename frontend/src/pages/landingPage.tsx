import '../App.css';
import Button from '../components/buttons/button';
import InputTextfield from '../components/inputFields/inputTextfield';
import PasswordTextfield from '../components/inputFields/passwordTextfield';
import RoutingMethods from './routing/RoutingMethods';




const TextInput = () => {

  const {regPage,studentHome, supervisorHome, repHome} = RoutingMethods()

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

        <h2>temporary buttons</h2>
            <br />
            <div className='flex justify-center space-x-4'> 
                <Button buttonName="stu Home Page" onClick={studentHome} />
                <Button buttonName="super HomePage" onClick={supervisorHome} />
                <Button buttonName="rep HomePage" onClick={repHome} />
            </div>
    </>
  )
}

export default TextInput;

