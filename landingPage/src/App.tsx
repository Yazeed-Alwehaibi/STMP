import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import RegistrationPage from "./pages/RegistrationPage";
import StudentRegistrationPage from "./pages/student/studentRegistrationPage";
import SupervisorRegistrationPage from "./pages/supervisor/supervisorRegistrationPage";
import RepRegistrationPage from "./pages/trainingRep/repRegistrationPage";



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
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </>
)


}