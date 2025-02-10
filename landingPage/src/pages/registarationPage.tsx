import InputTextfield from "../components/inputTextfield";
import RadioButton from "../components/radioButton";
import Submitbutton from "../components/submitbutton";



const RegistarationPage = () => {
    return (
        <div>
            <h1>Registration page</h1>
            <br />
            <RadioButton nameHolder="Student" valueHolder="Student" />
            <br />
            <InputTextfield nameHolder="Student ID"/>
            <br />
            <InputTextfield nameHolder="Student Name"/>
            <br />
            <InputTextfield nameHolder="Email"/>
            <br />
            <InputTextfield nameHolder="Major"/>
            <br />
            <InputTextfield nameHolder="Studied hours"/>
            <br />
            <Submitbutton buttonName="submit"/>
        </div>
    )
}

export default RegistarationPage;