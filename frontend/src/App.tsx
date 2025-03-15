import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
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
import ApplyOwn from './pages/student/application/own'
import VenueSuggestion from './pages/student/application/suggest'
import Offers from './pages/student/application/offers'


import { UserProvider } from "./context/UserContext";
import Login from "./pages/landingPage"; // Use Login instead of LandingPage
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./pages/routing/ProtectedRoute"; 

export default function App() {
    return (
        <UserProvider> {/* Wrap the app with UserProvider */}
            <BrowserRouter>
                <Routes>
                    {/* Login (Replaces LandingPage) */}
                    <Route index element={<Login />} />
                    <Route path="/login" element={<Login />} />

                    {/* Registration Pages */}
                    <Route path="/registrationPage" element={<RegistrationPage />} />

                    {/* Protected Home Pages */}
                    <Route path="/studentHomePage" element={<ProtectedRoute><StudentHomePage /></ProtectedRoute>} />
                    <Route path="/supervisorHomePage" element={<ProtectedRoute><SupervisorHomePage /></ProtectedRoute>} />
                    <Route path="/repHomePage" element={<ProtectedRoute><RepHomePage /></ProtectedRoute>} />

                    {/* Protected Student Pages */}
                    <Route path="/studentApplicationPage" element={<ProtectedRoute><StudentApplicationPage /></ProtectedRoute>}>
                    <Route path="applyOwn" element={<ApplyOwn />} />
                    <Route path="venueSuggestion" element={<VenueSuggestion />} />
                    <Route path="offers" element={<Offers />} />
                    </Route>


                    <Route path="/studentReportPage" element={<ProtectedRoute><StudentReportPage /></ProtectedRoute>} />
                    <Route path="/studentPresentationPage" element={<ProtectedRoute><StudentPresentationPage /></ProtectedRoute>} />
                    

                    {/* Protected Supervisor Pages */}
                    <Route path="/supervisorApplicationPage" element={<ProtectedRoute><SupervisorApplicationPage /></ProtectedRoute>} />
                    <Route path="/supervisorReportPage" element={<ProtectedRoute><SupervisorReportPage /></ProtectedRoute>} />
                    <Route path="/supervisorPresentationPage" element={<ProtectedRoute><SupervisorPresentationPage /></ProtectedRoute>} />

                    {/* Protected Training Rep Pages */}
                    <Route path="/repApplicationPage" element={<ProtectedRoute><RepApplicationPage /></ProtectedRoute>} />
                    <Route path="/repReportPage" element={<ProtectedRoute><RepReportPage /></ProtectedRoute>} />
                    <Route path="/repOffersPage" element={<ProtectedRoute><RepOffersPage /></ProtectedRoute>} />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                    {/* 404 Page */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}
