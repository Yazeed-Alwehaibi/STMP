import { useNavigate } from 'react-router-dom';
import {studentRegForm, supervisorRegForm, repRegForm, registrationPage} from './routes';

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

    return { studentRegPage, supervisorRegPage, repRegPage, regPage };
}

export default RoutingMethods;