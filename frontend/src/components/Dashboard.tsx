import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-bold">Welcome, {user.email}!</h2>
            <button onClick={() => { logout(); navigate("/"); }} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
