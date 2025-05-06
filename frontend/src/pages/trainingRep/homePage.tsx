import RepLayout from '../../components/layouts/rep_layout';
import { useUser } from '../../context/UserContext';

const HomePage = () => {
    const { user } = useUser();

    return (
        <RepLayout>
            <div className="bg-[#e7e7f3] p-4 rounded-2xl mb-4">
                <div className="grid grid-cols-5 grid-rows-3 gap-1">
                    <p className='col-1 row-1 font-bold'>Representitive Name</p>
                    <p className='col-2 row-1'>: {user?.userName}</p>
                    <p className='col-1 row-2 font-bold'>Representitive ID</p>
                    <p className='col-2 row-2'>: {user?.userID}</p>
                    <p className='col-1 row-3 font-bold'>E-mail</p>
                    <p className='col-2 row-3'>: {user?.email}</p>
                </div>
            </div>

            <div className="bg-[#e7e7f3] text-center p-5 rounded-2xl">
                <p>Welcome to the Summer Training Program.</p>
                <br />
                <p>We welcome you to the Program's online portal,</p>
                <p>Please keep your username and password secure to protect your information.</p>
                <br /><br />
                <p>We hope our services meet your expectations.</p>
            </div>
        </RepLayout>
    );
};

export default HomePage;
