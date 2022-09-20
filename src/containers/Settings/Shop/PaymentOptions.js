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

//Utils
import _ from 'lodash'

// actions
import { getPaymentOptions, savePaymentOptions } from '../../../actions/shop';
import { startLoading, stopLoading } from '../../../actions/loading';

// local components
import PaymentOptions from '../../../components/PaymentOptions';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import EditableHOCWrapper from '../../HOC/EditableHOC';
import EditActionComponent from '../../../components/common/EditActionComponent';
import {  hasAccess } from '../../../utils/api';
import { openErrorMessage } from '../../../actions/message';

import { getCurrentSession } from '../../../actions/auth';


const PaymentOptionsEditable = EditableHOCWrapper(PaymentOptions)

class PaymentOptionsContainer extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            payOptions: []
        }
    }

    componentDidMount () {

        this.props.dispatch(getPaymentOptions()).then(res => {
            var changePayOptions = res.map((po)=>{               
                switch(po.paymentOption){
                    case 'BlazePay': po.label = 'BLAZEPAY';   break;
                    case 'CashlessATM': po.label = 'Cashless ATM';   break;
                    case 'Spence': po.label = 'Spence';   break;
                    case 'Stronghold': po.label = 'Stronghold';   break;
                    case 'GiftCard': po.label = 'Gift Card';   break;
                    case 'Split': po.label = 'Multiple Payments';   break;
                    case 'StoreCredit': po.label = 'Store Credit';   break;
                    default: po.label = po.paymentOption;   break;
                }
                return po;
            })                
            this.setState({
                payOptions: _.filter(changePayOptions,(payOption) => (payOption.paymentOption !== "Clover" && payOption.paymentOption !== "Mtrac"))
            })
        });

    }

    onChange = (index) => (key, value) => {

        const { payOptions } = this.state;

        let updatedPayOptions = [...payOptions];

        updatedPayOptions[index] = {...updatedPayOptions[index], [key]: value};

        this.setState({
            payOptions: updatedPayOptions
        })

    }

    onSave = () => {

        const { payOptions } = this.state;

        if(payOptions.length>0){
            var enableCashlessATM = payOptions.filter(po => po.enabled).find(po => po.paymentOption == 'CashlessATM');
            var enableBlazePay = payOptions.filter(po => po.enabled).find(po => po.paymentOption == 'BlazePay');
            var enableSpence = payOptions.filter(po => po.enabled).find(po => po.paymentOption == 'Spence');
            var enableStronghold = payOptions.filter(po => po.enabled).find(po => po.paymentOption == 'Stronghold');
            if(enableCashlessATM && enableBlazePay){
                this.props.dispatch(openErrorMessage("You can't choose BLAZEPAY and Cashless ATM at the same time"));
                return;
            }else if(enableSpence && enableStronghold){
                this.props.dispatch(openErrorMessage("You can't choose Spence and Stronghold at the same time"));
                return;
            }
        }

        this.props.dispatch(startLoading())
        
        this.props.dispatch(savePaymentOptions({values: payOptions}))
            .then(response => {
                this.props.dispatch(getCurrentSession());
                this.disableEdit();
                this.props.dispatch(stopLoading());
            })
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
        const { paymentOptions } = this.props.shopReducer;
        this.setState({
            payOptions: paymentOptions,
            editMode: false
        })
    }

    render () {

        const {
            paymentOptions = [],
            lastModified = null
        } = this.props.shopReducer;

        const { editMode, payOptions=[] } = this.state;

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
                <Grid className="paymentOptions" item xs={12} sm={12} md={12} lg={12}>
                    <Paper>
                        <div className="table-scroll">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Payment Option</TableCell>
                                        <TableCell>Enabled</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payOptions && payOptions.map((option, index) => {
                                        return <PaymentOptions
                                            data={option}
                                            lastModified={lastModified}
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

const PaymentOptionsWithTitle = ContainerWithTitle(PaymentOptionsContainer, 'Payment Options')
const PaymentOptionsConnected = connect(({dispatch, shopReducer}) => ({dispatch, shopReducer}))(PaymentOptionsWithTitle)

export default PaymentOptionsConnected;