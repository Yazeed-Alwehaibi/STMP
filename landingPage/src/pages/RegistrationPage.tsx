import Button from '../components/button';
import { useNavigate } from 'react-router-dom';






const RegistarationPage = () => {
    const navigate = useNavigate();
    const handlestudentclick = () => {
        
        navigate('/studentRegistarationPage')
        
    }

    const handleSupervisortclick = () => {
        
        navigate('/supervisorRegistrationPage')
    }

    const handleRepClick = () => {
        navigate('/repRegistarationPage')
    }

    return (
        <div>
            
            <h1>Registration Page</h1>
            <br />
            <div className="flex justify-center space-x-4">
                <Button buttonName="Student" onClick={handlestudentclick} />
                <Button buttonName="Supervisor" onClick={handleSupervisortclick} />
                <Button buttonName="Training Representative" onClick={handleRepClick} />
            </div>
        </div>
    )
}

export default RegistarationPage;