import React, { PureComponent } from 'react';
import {
    Grid,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@material-ui/core';
import { fetchAdjustments, deleteAdjustment, addNewAdjustment, updateAdjustment } from '../../../actions/adjustments';
import { openErrorMessage } from '../../../actions/message';
import { connect } from 'react-redux';
import AdjustmentItemContainer from '../../../components/Adjustments/AdjustmentItemContainer';
import { hasAccess } from '../../../utils/api';
import ContainerWithTitle from '../../../containers/HOC/ContainerWithTitle';
import { Appcues } from '../../../utils/constants';

const emptyAdjustment = {
    name: '',
    accountType: 'None',
    active: false,
    regionIds: []
}

class Adjustments extends PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            showEmptyAdjustment: false
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchAdjustments());
    }

    toggleEmptyAdjustment = () => {
        Appcues.track('Adding Adjustment')
        this.setState(
            prevState => (
                {
                    showEmptyAdjustment: !prevState.showEmptyAdjustment
                }
            )
        )
    }

    onSave = (data, afterOnSave) => {
        const { showEmptyAdjustment } = this.state;

        const isValid = this.validateAdjustment(data);

        if(isValid) {
            if(showEmptyAdjustment) {
                this.props.dispatch(addNewAdjustment(data)).then(res => {
                    Appcues.track('New Adjustment Saved')
                    this.props.dispatch(fetchAdjustments());
                    afterOnSave && afterOnSave();
                    this.toggleEmptyAdjustment();
                });
            }
            else {
                this.props.dispatch(updateAdjustment(data)).then(res => {
                    this.props.dispatch(fetchAdjustments());
                    afterOnSave && afterOnSave();
                });
            }
        }
    }

    onDelete = (adjustment) => () => {
        this.props.dispatch(deleteAdjustment(adjustment.id)).then(res => {
            Appcues.track('Adjustment Deleted')
            this.props.dispatch(fetchAdjustments());
        });
    }

    validateAdjustment = (adjustment) => {
        if(!adjustment.name || !adjustment.name.trim()) {
            this.props.dispatch(openErrorMessage('Please enter adjustment name'));
            return false;
        }

        if(!adjustment.type || !adjustment.type.trim()) {
            this.props.dispatch(openErrorMessage('Please select adjustment type'));
            return false;
        }

        return true;
    }
    
    render() {

        const { showEmptyAdjustment } = this.state;

        const { 
            adjustments, 
            lastModified 
        } = this.props.adjustmentsReducer; 

        const adjustmentValues = (adjustments && adjustments.values) || [];

        return (<Grid container>
            {hasAccess() ? <Grid item xs={12} sm={12} md={12} lg={12}>
                <Button variant="raised" className="primary-button pull-right margin-bottom-small" onClick={this.toggleEmptyAdjustment}>Add Adjustment</Button>
            </Grid> : <Grid item xs={12} sm={12} md={12} lg={12}/>}
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <div className="table-scroll cus-pager-top">
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Active</TableCell>
                                    <TableCell>Adjustment Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    showEmptyAdjustment ?
                                        <AdjustmentItemContainer
                                            adjustment={emptyAdjustment}
                                            //lastModified={lastModified}
                                            onInventoryUpdate={this.addNewInventory}
                                            defaultEditMode={true}
                                            onSave={this.onSave}
                                            onCancel={this.toggleEmptyAdjustment}
                                        />
                                    : null
                                }
                                {
                                    adjustmentValues.map((adjustment, i) => {
                                        return (
                                            <AdjustmentItemContainer 
                                                key={adjustment.id}
                                                adjustment={adjustment}
                                                lastModified={lastModified}
                                                onInventoryUpdate={this.addNewInventory}
                                                defaultEditMode={false}
                                                onSave={this.onSave}
                                                onDelete={this.onDelete(adjustment)}
                                            />
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </Grid>
        </Grid>
        )
    }
}

export default connect(
    ({
        dispatch,
        adjustmentsReducer
    }) => ({
        dispatch,
        adjustmentsReducer
    })
)(ContainerWithTitle(Adjustments, 'Adjustments'));