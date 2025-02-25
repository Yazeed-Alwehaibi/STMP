import { useNavigate } from 'react-router-dom';
import {landingPage,studentRegForm, supervisorRegForm, 
    repRegForm, registrationPage,studentHomePage,
    repHomePage ,supervisorHomePage, 
    studentApplicationPage, studentReportPage, studentPresentationPage,
    repOffersPage, repReportPage, repApplicationPage,
    supervisorApplicationPage, supervisorReportPage, supervisorPresentationPage } 
    from './routes';

const RoutingMethods = () => {
    const navigate = useNavigate();


    const indexPage = () => {
        navigate(landingPage);
    }

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

    const studentApplication = () => {
        navigate(studentApplicationPage);
    }

    const studentReport = () => {
        navigate(studentReportPage);
    }

    const studentPresentation = () => {
        navigate(studentPresentationPage);
    }

    const supervisorApplication = () => {
        navigate(supervisorApplicationPage);
    }

    const supervisorReport = () => {
        navigate(supervisorReportPage);
    }

    const supervisorPresentation = () => {
        navigate(supervisorPresentationPage);
    }

    const repApplication = () => {
        navigate(repApplicationPage);
    }

    const repReport = () => {
        navigate(repReportPage);
    }

    const repOffers = () => {
        navigate(repOffersPage);
    }

    return { indexPage,studentRegPage, supervisorRegPage,
         repRegPage, regPage, supervisorHome,
          repHome, studentHome, studentApplication,
           studentReport, studentPresentation, supervisorApplication,
            supervisorReport, supervisorPresentation, repApplication,
             repOffers, repReport };
}

export default RoutingMethods;