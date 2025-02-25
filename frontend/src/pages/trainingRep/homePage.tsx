import Button from '../../components/buttons/button';
import RoutingMethods from '../routing/RoutingMethods';






const HomePage = () => {
    const { repApplication, repReport, repOffers, indexPage } = RoutingMethods();
    return (
        <div className="flex justify-center space-x-4">
            <Button buttonName="applications" onClick={repApplication} />
            <Button buttonName="reports" onClick={repReport} />
            <Button buttonName="offers" onClick={repOffers} />
            <Button buttonName="community" />
            <Button buttonName="logout" onClick={indexPage} />
        </div>
    )
}

export default HomePage;