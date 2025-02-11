import InputTextfield from "../components/inputTextfield";
import Submitbutton from "../components/submitbutton";



const StudentRegistarationPage = () => {
    return (
        <div>
            <h1>Registration page</h1>
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
            <InputTextfield nameHolder="GPA"/>
            <br />
            <Submitbutton buttonName="submit"/>
        </div>
    )
}

export default StudentRegistarationPage;