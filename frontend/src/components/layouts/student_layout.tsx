import RoutingMethods from '../../pages/routing/RoutingMethods';
import { useUser } from "../../context/UserContext";
import QU_logo from '../../components/images/QU-logo.png'
import v2030 from '../../components/images/vision2030.png'
import out from '../../components/images/logout.png'
import venues from '../../components/images/venues.png'
import reports from '../../components/images/reports.png'
import presentation from '../../components/images/presentation.png'
import community from '../../components/images/community.png'
import React from 'react';

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { studentApplication, studentReport, studentPresentation, indexPage } = RoutingMethods();
    const { user } = useUser();

    return (
        <div>
            <div className="grid grid-cols-12 grid-rows-12 h-screen w-screen bg-white">
                {/* Header */}
                <div className="flex items-center justify-between col-span-12 row-span-2 px-6">
                    <img src={v2030} alt="Vision 2030 Logo" className="h-16 object-contain" />
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

                <div className='col-span-10 row-span-1'></div>

                {/* Sidebar */}
                <div className="grid grid-cols-8 grid-rows-12 col-span-2 row-span-8">
                    <div className='row-span-1 col-span-8'></div>
                    <div className='row-span-12 col-span-1'></div>

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
                <div className="grid grid-cols-48 grid-rows-12 gap-2 col-span-10 row-span-7">
                    <div className="col-span-1 row-span-12"></div>
                    <div className="col-span-46 row-span-12">
                        {children}
                    </div>
                </div>
            </div>
            <div className='bg-white h-screen w-screen'></div>
        </div>
    );
};

export default StudentLayout;
