import React, { PureComponent } from 'react';
import ExpandableListItem from './ExpandableListItem';
import { getObject } from "../../../utils/api";

export default class ExpandableList extends PureComponent {

    state = {
        selectedIndex: 0
    }

    componentDidMount() {
        const { currentUrl = '', list = [] } = this.props;

        const selectedIndex = list && list.findIndex((item, index) => {
            return item.url === currentUrl
        })

        this.setState({
            selectedIndex
        });
    }

    selectItem = index => e => {

        const { selectedIndex } = this.state;

        let newIndex = index;

        if (newIndex === selectedIndex) {
            newIndex = -1
        }

        this.setState({
            selectedIndex: newIndex
        })

    };

    hasAccessQuickBook() {
        let session = getObject('session');
        if (session == null) {
            return false;
        }
        return !!((session.employee && session.employee.role && session.employee.role.name === 'Admin') || (session.employee && session.employee.role && session.employee.role.permissions.find((perm) => perm === "WebQuickBookManage")));

    }

    render() {
        const {
            list = [],
            onItemClick = () => { },
            currentUrl,
            currentRoute,
            assignedShop = {},
            goToPage
        } = this.props;

        const {
            selectedIndex = 0
        } = this.state;
        return (
            list.map(
                (item, index) => {
                    var isVisible = true;
                    let newItem = { ...item };
                    let newList = [...item.childrenList];
                    if (!this.hasAccessQuickBook()) {
                        newItem['childrenList'] = newList.filter(res => res.url !== "quickbook");
                    }

                    if (assignedShop.appTarget === 'Distribution') {
                        newList = newList.filter((child) => !['OnFleet', 'Terminals', 'Manage Receipts', 'Memberships', 'Contracts', 'Weedmaps', 'Webhook Management', 'Loyalty Rewards'].includes(child.title)) || [];
                        newItem['childrenList'] = [...newList]
                    }

                    if (assignedShop.appTarget === 'Retail') {
                        newList = newList.filter((child) => !['Invoices & Purchase Orders'].includes(child.title)) || [];
                        newItem['childrenList'] = [...newList]
                    }

                    if (assignedShop.appTarget === 'Grow') {
                        newList = newList.filter((child) => !['OnFleet','Tax Option','Reset','Pricing Templates','Headset','Weedmaps','SpringBig', 'Tookan', 'MTrac', 'Third Party', 'Third Party Accounts', 'Delivery Tax Rates', 'Payment Options', 'Terminals', 'Manage Receipts', 'Memberships', 'Online Store', 'Shop Documents', 'Contracts', 'Loyalty Rewards', 'Fee Minimums'].includes(child.title)) || [];
                        newItem['childrenList'] = [...newList]
                    }

                    // if(newItem.url=='blazePay'){
                    //     if(assignedShop && assignedShop.paymentOptions){
                    //         var blazePayPermission = assignedShop.paymentOptions.find(paymentOption => paymentOption.paymentOption == 'BlazePay');
                    //         isVisible = blazePayPermission && blazePayPermission.enabled ? true : false;
                    //     }else{
                    //         isVisible = false;
                    //     }
                    // }
                    
                    return isVisible ? (
                        <ExpandableListItem
                            key={index}
                            item={newItem}
                            onClick={this.selectItem(index)}
                            isOpen={selectedIndex === index}
                            onItemClick={onItemClick}
                            currentUrl={currentUrl}
                            currentRoute={currentRoute}
                            goToPage={goToPage}
                        />
                    ) : null
                }
            )
        )

    }

}