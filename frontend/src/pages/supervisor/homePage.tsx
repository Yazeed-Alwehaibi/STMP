import Button from '../../components/buttons/button';
import RoutingMethods from '../routing/RoutingMethods';





const HomePage = () => {
    const { supervisorApplication, supervisorReport, supervisorPresentation, indexPage } = RoutingMethods();
    return (
        <div className="flex justify-center space-x-4">
            <Button buttonName="applications" onClick={supervisorApplication} />
            <Button buttonName="reports" onClick={supervisorReport} />
            <Button buttonName="presentations" onClick={supervisorPresentation} />
            <Button buttonName="community" />
            <Button buttonName="logout" onClick={indexPage} />
        </div>
    
    )
}

export default HomePage;