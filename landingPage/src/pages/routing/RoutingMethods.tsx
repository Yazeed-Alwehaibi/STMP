import { useNavigate } from 'react-router-dom';
import {studentRegForm, supervisorRegForm, 
    repRegForm, registrationPage,studentHomePage,repHomePage ,supervisorHomePage} from './routes';

const RoutingMethods = () => {
    const navigate = useNavigate();

    const studentRegPage = () => {
        navigate(studentRegForm);
    }

    const supervisorRegPage = () => {
        navigate(supervisorRegForm);
    }

    const repRegPage = () => {
        navigate(repRegForm);
    }

    const regPage = () => {
        
        navigate(registrationPage)
        
    }

    
    const repHome = () => {
        navigate(repHomePage);
    }

    const supervisorHome = () => {
        navigate(supervisorHomePage);
    }

    
    const studentHome = () => {
        navigate(studentHomePage);
    }

    return { studentRegPage, supervisorRegPage, repRegPage, regPage, supervisorHome, repHome, studentHome };
}

export default RoutingMethods;