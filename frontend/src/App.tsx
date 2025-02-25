import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import RegistrationPage from "./pages/RegistrationPage";
import StudentRegistrationPage from "./pages/student/registrationPage";
import SupervisorRegistrationPage from "./pages/supervisor/registrationPage";
import RepRegistrationPage from "./pages/trainingRep/registrationPage";
import StudentHomePage from "./pages/student/homePage";
import SupervisorHomePage from "./pages/supervisor/homePage";
import RepHomePage from "./pages/trainingRep/homePage";
import StudentApplicationPage from "./pages/student/applicationPage";
import StudentReportPage from "./pages/student/reportPage";
import StudentPresentationPage from "./pages/student/presentationPage";
import SupervisorApplicationPage from "./pages/supervisor/applicationPage";
import SupervisorReportPage from "./pages/supervisor/reportPage";
import SupervisorPresentationPage from "./pages/supervisor/presentationPage";
import RepApplicationPage from "./pages/trainingRep/applicationPage";
import RepReportPage from "./pages/trainingRep/reportPage";
import RepOffersPage from "./pages/trainingRep/offersPage";



export default function App() {
return (
  <>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />}/>
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/registrationPage" element={<RegistrationPage />} />
        <Route path="/studentRegistrationPage" element={<StudentRegistrationPage />} />
        <Route path="/supervisorRegistrationPage" element={<SupervisorRegistrationPage />} />
        <Route path="/repRegistrationPage" element={<RepRegistrationPage />} />
        <Route path="/studentHomePage" element={<StudentHomePage />} />
        <Route path="/supervisorHomePage" element={<SupervisorHomePage />} />
        <Route path="/repHomePage" element={<RepHomePage />} />
        <Route path="/studentApplicationPage" element={<StudentApplicationPage />} />
        <Route path="/studentReportPage" element={<StudentReportPage />} />
        <Route path="/studentPresentationPage" element={<StudentPresentationPage />} />
        <Route path="/supervisorApplicationPage" element={<SupervisorApplicationPage />} />
        <Route path="/supervisorReportPage" element={<SupervisorReportPage />} />
        <Route path="/supervisorPresentationPage" element={<SupervisorPresentationPage />} />
        <Route path="/repApplicationPage" element={<RepApplicationPage />} />
        <Route path="/repReportPage" element={<RepReportPage />} />
        <Route path="/repOffersPage " element={<RepOffersPage />} />
 
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </>
)


}