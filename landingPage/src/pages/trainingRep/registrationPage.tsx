import InputTextfield from "../../components/inputFields/inputTextfield";
import Submitbutton from "../../components/buttons/submitbutton";


const RepRegistrationPage = () => {
  return (
    <div>
      <h1>Representative Registration Page</h1>
            <br />
            <InputTextfield nameHolder="Representative Name"/>
            <br />
            <InputTextfield nameHolder="Email"/>
            <br />
            <InputTextfield nameHolder="Venue"/>
            <br />
            <Submitbutton buttonName="submit"/>
    </div>
  );
}

export default RepRegistrationPage;