import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import RegistrationPage from "./pages/RegistrationPage";
import StudentRegistrationPage from "./pages/student/registrationPage";
import SupervisorRegistrationPage from "./pages/supervisor/registrationPage";
import RepRegistrationPage from "./pages/trainingRep/registrationPage";
import StudentHomePage from "./pages/student/homePage";
import SupervisorHomePage from "./pages/supervisor/homePage";
import RepHomePage from "./pages/trainingRep/homePage";




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

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </>
)


}