import InputTextfield from "../components/inputTextfield";
import RadioButton from "../components/radioButton";


const RegisterationPage = () => {
    return (
        <div>
            <h1>Registeration page</h1>
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
        </div>
    )
}

export default RegisterationPage;