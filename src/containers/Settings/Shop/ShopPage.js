import React, { PureComponent, Fragment } from 'react';
import {
    Route
} from 'react-router-dom';

// local components
// import ManageReceipts from './ManageReceipts';
// import InventoryManagement from './InventoryManagement';
// import ShopDocuments from './ShopDocuments';
// import ShopTerminals from './ShopTerminals';
// import PricingTemplate from './PricingTemplate';
import ShopInfo from './ShopInfo';

import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';


class ShopPage extends PureComponent {

    render() {

        const { match, shop } = this.props;

        return (
            <Fragment>
                <h2 style={{ textTransform: 'capitalize' }}>{shop.name}</h2>
                <Route exact path={`${match.url}/`} component={ShopInfo} />
                {/* <Route exact path={`${match.url}/receipts/`} component={ManageReceipts} /> */}
                {/* <Route exact path={`${match.url}/inventory/`} component={InventoryManagement} /> */}
                {/* <Route exact path={`${match.url}/documents/`} component={ShopDocuments} /> */}
                {/* <Route exact path={`${match.url}/terminals/`} component={ShopTerminals} /> */}
                {/* <Route exact path={`${match.url}/pricingtemplate/`} component={PricingTemplate} /> */}
                {/* <Route exact path={`${match.url}/employees/`} component={Employees} />
                <Route exact path={`${match.url}/employees/add`} component={AddEmployee} />
                <Route exact path={`${match.url}/employees/:id/edit`} component={AddEmployee} /> */}
            </Fragment>
        )
    }

}

export default ShopSettingsWithUpdate(ShopPage);