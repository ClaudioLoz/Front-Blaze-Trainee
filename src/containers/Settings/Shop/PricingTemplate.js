import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ContainerWithTitleWrapper from '../../HOC/ContainerWithTitle';
import ShopSettingsWithUpdate from '../../../components/layout/ShopSettingsWithUpdate';
import PricingTemplateContainer from '../../../components/PricingTemplate/PricingTemplateContainer';
import {
    getPricingTemplates,
    getWeightTolerances,
    createPricingTemplate,
    updatePricingTemplate,
    deletePricingTemplate,
    getPriceBreaks
} from '../../../actions/pricingTemplate';
import { openSuccessMessage, openErrorMessage } from '../../../actions/message';

class PricingTemplate extends PureComponent {

    componentDidMount() {
        this.props.dispatch(getPricingTemplates());
        this.props.dispatch(getWeightTolerances());
    }

    onSavePricingTemplate = (pricingTemplate, afterSave) => {
        const { priceBreaks=[], priceRanges=[] } = pricingTemplate;

        let valid = true;

        if(priceBreaks) {
            for(let i in priceBreaks){
                if(isNaN(priceBreaks[i].price) || priceBreaks[i].price < 0) {
                    valid = false;
                }
            }
            if(!valid) {
                return this.props.dispatch(openErrorMessage('Please enter correct price'));
            }
        }

        if(priceRanges) {
            for(let i in priceRanges){
                if(isNaN(priceRanges[i].price) || priceRanges[i].price < 0) {
                    valid = false;
                }
            }
            if(!valid) {
                return this.props.dispatch(openErrorMessage('Please enter correct price'));
            }
        }
    
        if(!pricingTemplate.id) {
            this.props.dispatch(createPricingTemplate(pricingTemplate)).then(res => {
                afterSave && afterSave();
                this.props.dispatch(openSuccessMessage('Pricing Template Created Successfully'))
            })
        }
        else {
            this.props.dispatch(updatePricingTemplate(pricingTemplate)).then(res => {
                afterSave && afterSave();
                this.props.dispatch(openSuccessMessage('Pricing Template Updated Successfully'))
            })
        }
    }

    onDelete = (pricingTemplate, afterDelete) => {
        this.props.dispatch(deletePricingTemplate(pricingTemplate.id)).then(res => {
            afterDelete && afterDelete();
            this.props.dispatch(openSuccessMessage('Pricing Template Deleted Successfully'))
            this.props.dispatch(getPricingTemplates());
        })
    }

    getPriceBreaks = (weightPerUnit) => {
        return this.props.dispatch(getPriceBreaks(weightPerUnit))
    }

    render() {
        
        const {
            pricingTemplates={},
            weightTolerances={}
        } = this.props.pricingTemplateReducer;
        
        const weightToleranceValues = weightTolerances.values || [];

        return (
            <div>
                <h3 style={{textTransform: 'capitalize'}}>
                    Pricing Template
                </h3>
                <PricingTemplateContainer 
                    pricingTemplates={pricingTemplates}
                    weightToleranceValues={weightToleranceValues}
                    onSavePricingTemplate={this.onSavePricingTemplate}
                    onDelete={this.onDelete}
                    getPriceBreaks={this.getPriceBreaks}
                />
            </div>
        )
    }
}

const PricingTemplateWithTitle = ContainerWithTitleWrapper(PricingTemplate, 'Pricing Template')

export default connect(
    ({
        dispatch,
        shopReducer,
        pricingTemplateReducer
    }) => ({
        dispatch,
        shopReducer,
        pricingTemplateReducer
    })
)(ShopSettingsWithUpdate(PricingTemplateWithTitle));