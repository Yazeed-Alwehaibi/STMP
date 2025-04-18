import '../App.css';
import Button from '../components/buttons/button';
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useUser } from "../context/UserContext";
import RoutingMethods from './routing/RoutingMethods';


const TextInput = () => {
  const { regPage, studentHome, supervisorHome, repHome,indexPage } = RoutingMethods();
  const { setUser, user } = useUser();  // <- make sure your context provides setUser
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await loginUser(email, password);

    if (data.user) {
      console.log("User role:", data.user.role);
      setUser(data.user); // update context

      switch (data.user.role) {
        case "Student":
          studentHome();
          break;
        case "Supervisor":
          supervisorHome();
          break;
        case "Training Representative":
          repHome();
          break;
        default:
          indexPage();
      }
    }
  };

  return (
    <>
      <h1>Summer Training Platform</h1>
      <br />
      <div className="flex flex-col items-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {user && <p>Already logged in as {user.email}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            className="bg-white"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="bg-white"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>

      <h2>Temporary buttons</h2>
      <br />
      <div className="flex justify-center space-x-4">
        <Button buttonName="Register" onClick={() => regPage()} />
        <Button buttonName="stu Home Page" onClick={() => studentHome()} />
        <Button buttonName="super HomePage" onClick={() => supervisorHome()} />
        <Button buttonName="rep HomePage" onClick={() => repHome()} />
      </div>
    </>
  );
};

export default TextInput;
