import { Link, Outlet } from "react-router-dom";
import StudentLayout from '../../components/layouts/student_layout';

const StudentApplicationPage: React.FC = () => {
  return (
    <StudentLayout>
    <>
      {/* Full-Width Static Navigation Bar */}
      <nav className="w-full bg-[rgb(81,181,214)] shadow-lg py-4 px-6 flex justify-center space-x-6 z-50">
        <Link to="/studentApplicationPage/applyOwn" className="!text-white font-semibold hover:underline">
          Apply Own Venue
        </Link>
        <Link to="/studentApplicationPage/venueSuggestion" className="!text-white font-semibold hover:underline">
          Venue Suggestion
        </Link>
        <Link to="/studentApplicationPage/offers" className="!text-white font-semibold active:underline">
          Offers
        </Link>
      </nav>

      <div className="p-4">
        <Outlet /> 
      </div>
    </>
    </StudentLayout>
  );
};

export default StudentApplicationPage;
