import Button from '../../components/buttons/button';
import RoutingMethods from '../routing/RoutingMethods';






const HomePage = () => {
    const { studentApplication, studentReport, studentPresentation, indexPage } = RoutingMethods();
    return (
        <div className="flex justify-center space-x-4">
            <Button buttonName="apply for training" onClick={studentApplication} />
            <Button buttonName="reports" onClick={studentReport} />
            <Button buttonName="presentations" onClick={studentPresentation} />
            <Button buttonName="community" />
            <Button buttonName="logout" onClick={indexPage} />
        </div>
    
    )
}

export default HomePage;