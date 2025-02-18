import InputTextfield from "../../components/inputFields/inputTextfield";
import Submitbutton from "../../components/buttons/submitbutton";


const SupervisorRegistrationPage = () => {
  return (
    <div>
      <div>
            <h1>Supervisor Registration page</h1>
            <br />
            <InputTextfield nameHolder="Supervisor ID"/>
            <br />
            <InputTextfield nameHolder="Supervisor Name"/>
            <br />
            <InputTextfield nameHolder="Email"/>
            <br />
            <InputTextfield nameHolder="Department"/>
            <br />
            <Submitbutton buttonName="submit"/>
        </div>
    </div>
  );
}

export default SupervisorRegistrationPage;