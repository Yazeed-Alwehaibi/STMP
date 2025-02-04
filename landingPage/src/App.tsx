import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import RegisterationPage from "./pages/registerationPage";



export default function App() {
return (
  <>
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />}/>
        <Route path="/registerationPage" element={<RegisterationPage />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  
  
  </>
)


}