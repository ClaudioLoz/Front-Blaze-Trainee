import React, { PureComponent } from 'react';
import {
    Grid,
    Paper,
    Table,
    TableRow,
    TableBody,
    TableHead,
    TableCell
} from "@material-ui/core";
import { connect } from 'react-redux';

// actions
import { getPartners, getPaymentProviders, savePaymentProviders } from '../../../actions/shop';
import { startLoading, stopLoading } from '../../../actions/loading';

// local components
import PaymentProviders from '../../../components/PaymentProviders';
import ContainerWithTitle from '../../HOC/ContainerWithTitle';
import EditActionComponent from '../../../components/common/EditActionComponent';
import { hasAccess } from '../../../utils/api';
import { capitalizeFirstLetter } from '../../../utils/common';

import { getCurrentSession } from '../../../actions/auth';

class PaymentProvidersContainer extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            shopPartners: [],
            shopProviders: [],
        }
    }

    getAvailablePaymentOptions(partner) {
        let paymentOptions = [];
        if (partner.hasOwnProperty("availablePaymentOptions")) {
            paymentOptions.push("None")
            partner.availablePaymentOptions.forEach( e => {

                if(e != "None") {
                    paymentOptions.push(e);    
                }

            }) 
        } 

        return paymentOptions;
    }

    componentDidMount() {

        this.props.dispatch(getPartners())
        this.props.dispatch(getPaymentProviders())
    }

    componentDidUpdate() {
        
        this.loadData();

    }


    loadData() {

        let shopPartners = [ ...this.state.shopPartners];
        let shopProviders = [ ...this.state.shopProviders];
        let partners = [ ...this.props.shopReducer.partners];
        let paymentProviders = [ ...this.props.shopReducer.paymentProviders];

        if(paymentProviders.length > 0 && partners.length > 0) {

            if(shopPartners.length < 1 && shopProviders.length < 1) {
             
    
                let partnerList = partners.map((p)=>{               
                    switch(p.name){
                        case 'OnlineWidget': p.name = 'Online Widget';   break;
                        default: p.name = capitalizeFirstLetter(p.name); break;
                    }
                    return p;
                })
        
                partnerList.forEach(p => {

                    let prov = paymentProviders.find(pp => pp.partnerId == p.id);

                    if(prov) {
                        shopProviders.push(prov);
        
                        p.availablePaymentOptions = this.getAvailablePaymentOptions(p);
            
                        shopPartners.push(p);
                    }
                   
                });

        
                this.setState({
                    shopPartners: shopPartners,
                    shopProviders: shopProviders
                })
            }
            
        }

    }

    onChange = (index) => (key, value) => {

        const { shopProviders } = this.state;

        let updatedProviders = [...shopProviders];

        updatedProviders[index] = { ...updatedProviders[index], [key]: value };

        this.setState({
            shopProviders: updatedProviders
        })

    }

    onSave = () => {

        const { shopProviders, shopPartners } = this.state;

        let filteredProviders = [];

        shopPartners.forEach(p => {
            if(p.availablePaymentOptions.length > 0) {
                
                let result = shopProviders.find(pp => pp.partnerId == p.id);
                filteredProviders.push(result);
            }
        });

        if(filteredProviders.length>0){
        
        this.props.dispatch(startLoading())

        this.props.dispatch(savePaymentProviders({ values: filteredProviders }))
            .then(response => {
                this.props.dispatch(getCurrentSession());
                this.disableEdit();
                this.props.dispatch(stopLoading());
            })
        } else {
            this.disableEdit();
        }
    }

    enableEdit = () => {
        this.setState({
            editMode: true
        })
    }

    disableEdit = () => {
        this.setState({
            editMode: false
        })
    }

    onCancel = () => {
        const { paymentProviders } = this.props.shopReducer;
        this.setState({
            shopProviders: paymentProviders,
            editMode: false
        })
    }

    render() {

        const { editMode, shopPartners, shopProviders } = this.state;

        return (
            <Grid container>
                <Grid className="addButton" item xs={12} sm={12} md={12} lg={12}>
                    {hasAccess() ? <div className="pull-right margin-bottom-small">
                        <EditActionComponent
                            onSave={this.onSave}
                            onCancel={this.onCancel}
                            onEdit={this.enableEdit}
                            editMode={editMode}
                        />
                    </div> : <div className="pull-right margin-bottom-small"></div>}
                </Grid>
                <Grid className="paymentProviders" item xs={12} sm={12} md={12} lg={12}>
                    <Paper>
                        <div className="table-scroll">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Partner Name</TableCell>
                                        <TableCell>Payment Provider</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shopPartners && shopPartners.map((option, index) => {
                                        return <PaymentProviders
                                            partner={option}
                                            provider={shopProviders[index]}
                                            editMode={editMode}
                                            onChange={this.onChange(index)}
                                        />
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

}

const PaymentProvidersWithTitle = ContainerWithTitle(PaymentProvidersContainer, 'Payment Providers')
const PaymentProvidersConnected = connect(({ dispatch, shopReducer }) => ({ dispatch, shopReducer }))(PaymentProvidersWithTitle)

export default PaymentProvidersConnected;