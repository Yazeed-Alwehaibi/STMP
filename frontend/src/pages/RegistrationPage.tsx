import Button from '../components/buttons/button';
import RoutingMethods from './routing/RoutingMethods';



const RegistrationPage = () => {
    const { studentRegPage, supervisorRegPage, repRegPage, 
        studentHome, supervisorHome, repHome } = RoutingMethods();

    return (
        <div>
            <h1>Registration Page</h1>
            <br />
            <div className="flex justify-center space-x-4">
                <Button buttonName="Student" onClick={studentRegPage} />
                <Button buttonName="Supervisor" onClick={supervisorRegPage} />
                <Button buttonName="Training Representative" onClick={repRegPage} />
            </div>
            <br />
            <h2>temporary buttons</h2>
            <br />
            <div className='flex justify-center space-x-4'> 
                <Button buttonName="stu Home Page" onClick={studentHome} />
                <Button buttonName="super HomePage" onClick={supervisorHome} />
                <Button buttonName="rep HomePage" onClick={repHome} />
            </div>
        </div>
    )
}

export default RegistrationPage;