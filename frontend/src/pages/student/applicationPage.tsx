import { Link, Outlet } from "react-router-dom";

const StudentApplicationPage: React.FC = () => {
  return (
    <>
      {/* Full-Width Static Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-600 shadow-lg py-4 px-6 flex justify-center space-x-6 z-50">
        <Link to="/studentApplicationPage/applyOwn" className="text-black font-semibold hover:underline">
          Apply Own Venue
        </Link>
        <Link to="/studentApplicationPage/venueSuggestion" className="text-black font-semibold hover:underline">
          Venue Suggestion
        </Link>
        <Link to="/studentApplicationPage/offers" className="text-black font-semibold hover:underline">
          Offers
        </Link>
      </nav>

      <div className="mt-20 p-6">
        <Outlet /> 
      </div>
    </>
  );
};

export default StudentApplicationPage;
