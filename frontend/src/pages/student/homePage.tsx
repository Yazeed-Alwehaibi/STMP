import Button from '../../components/buttons/button';
import RoutingMethods from '../routing/RoutingMethods';
import QU_logo from '../../components/images/QU-logo.png'
import v2030 from '../../components/images/vision2030.png'
import out from '../../components/images/logout.png'
import venues from '../../components/images/venues.png'
import reports from '../../components/images/reports.png'
import presentation from '../../components/images/presentation.png'
import community from '../../components/images/community.png'





const HomePage = () => {
    const { studentApplication, studentReport, studentPresentation, indexPage } = RoutingMethods();
    return (
        <div className="grid grid-cols-12 grid-rows-12 h-screen w-screen">
            {/* Header */}
            <div className="flex items-center justify-between col-span-12 row-span-2 px-6">
                {/* Left image */}
                <img src={v2030} alt="Vision 2030 Logo" className="h-16 object-contain" />
                {/* Right image */}
                <img src={QU_logo} alt="Qassim University Logo" className="h-16 object-contain" />
            </div>

            {/* Navbar */}
            <div className="bg-[rgb(81,181,214)] text-white flex items-center justify-start px-40 col-span-12 row-span-1">
                <button
                    onClick={indexPage}
                    className="flex items-center gap-2 hover:underline text-white"
                >
                    <img src={out} alt="Logout" className="h-6 w-6 object-contain" />
                    Logout
                </button>
            </div>

            {/* Empty space */}
            <div className='col-span-10 row-span-1'></div>

            {/* Invisible Sidebar */}
            <div className=" grid grid-cols-8 grid-rows-12 col-span-2 row-span-8">

                {/* Empty space */}
                <div className='row-span-1 col-span-8'></div> <div className='row-span-12 col-span-1'></div>
           
                {/* Visible Sidebar */}
                <div className="rounded-2xl border row-span-11 col-span-6 flex flex-col justify-center items-center space-y-10 bg-[rgb(81,181,214)]">
                    <button onClick={studentApplication} className="flex flex-col items-center text-black text-xs font-semibold hover:scale-105 transition">
                        <img src={venues} className="h-6 w-6 mb-1" alt="Applications" />
                        Applications
                    </button>

                    <button onClick={studentReport} className="flex flex-col items-center text-black text-xs font-medium hover:scale-105 transition">
                        <img src={reports} className="h-6 w-6 mb-1" alt="Reports" />
                        Reports
                    </button>

                    <button onClick={studentPresentation} className="flex flex-col items-center text-black text-xs font-semibold hover:scale-105 transition">
                        <img src={presentation} className="h-6 w-6 mb-1" alt="Presentation" />
                        Presentation
                    </button>

                    <button className="flex flex-col items-center text-black text-xs font-medium hover:scale-105 transition">
                        <img src={community} className="h-6 w-6 mb-1" alt="Community" />
                        Community
                    </button>
                </div>


            </div>

            {/* Main Content Area */}
            <div className=" grid grid-cols-48 grid-rows-12 gap-2 col-span-10 row-span-7">

                {/* Empty Space */}
                <div className="col-span-1 row-span-12 "></div>

                {/* User Info */}
                <div className="col-span-46 row-span-4 bg-[#e7e7f3] p-2 rounded-2xl">
                    <div className="grid grid-cols-5 grid-rows-3 gap-1 ">
                        <p className='col-1 row-1 font-bold'>Student Name</p>
                        <p className='col-2 row-1'>: Ibrahim Almania</p>
                        <p className='col-1 row-2 font-bold'>Student ID</p>
                        <p className='col-2 row-2'>: 411107862</p>
                        <p className='col-1 row-3 font-bold'>E-mail</p>
                        <p className='col-2 row-3 col-span-2'>: ibrahimalmania@gmail.com</p>
                        <p className='col-4 row-1 font-bold'>Department</p>
                        <p className='col-5 row-1'>: Computer Scince</p>
                        <p className='col-4 row-2 font-bold'>Traning Status</p>
                        <p className='col-5 row-2'>: Active</p>
                    </div>
                </div>

                {/* Welcome Massage */}
                <div className="col-span-46 row-span-8 bg-[#e7e7f3] text-center p-5 rounded-2xl">
                    <p>Welcome to the Summer Traning Program.</p>
                    <br />
                    <p>We welcome you in the Program's online portal,</p>
                    <p>we recommend that you keep your username and password secure to protect the confidentiality of your information.</p>
                    <br /><br />
                    <p>We hope our services meet your satisfaction.</p>

                </div>

            </div>

        </div>    
    )
}

export default HomePage;