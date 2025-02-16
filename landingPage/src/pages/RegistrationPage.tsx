import Button from '../components/button';
import RoutingMethods from './routing/RoutingMehods';



const RegistarationPage = () => {
    const { studentRegPage, supervisorRegPage, repRegPage } = RoutingMethods();

    return (
        <div>
            <h1>Registration Page</h1>
            <br />
            <div className="flex justify-center space-x-4">
                <Button buttonName="Student" onClick={studentRegPage} />
                <Button buttonName="Supervisor" onClick={supervisorRegPage} />
                <Button buttonName="Training Representative" onClick={repRegPage} />
            </div>
        </div>
    )
}

export default RegistarationPage;