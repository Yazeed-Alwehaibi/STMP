import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import RegistarationPage from "./pages/RegistrationPage";
import StudentRegistarationPage from "./pages/studentRegestarationPage";
import SupervisorRegistrationPage from "./pages/supervisorRegistrationPage";
import RepRegistarationPage from "./pages/repRegistrationPage";



export default function App() {
return (
  <>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />}/>
        <Route path="/registarationPage" element={<RegistarationPage />} />
        <Route path="/studentRegistarationPage" element={<StudentRegistarationPage />} />
        <Route path="/supervisorRegistrationPage" element={<SupervisorRegistrationPage />} />
        <Route path="/repRegistarationPage" element={<RepRegistarationPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </>
)


}