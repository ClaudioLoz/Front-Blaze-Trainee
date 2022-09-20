import React, { PureComponent } from 'react';
import {
    QuickBookGrey,
    QuickBookWhite,
    SpringBigGrey,
    SpringBigWhite,
    WeedmapsGrey,
    WeedmapsWhite,
    CloverWhite,
    CloverGrey,
    LeaflyGrey,
    LeaflyWhite,
    SpencePurple,
    SpenceGray,
    UniqueAttributesWhite,
    UniqueAttributesGrey,
    stronghold,
    strongholdGray
} from '../../../assets';

export default class ListIcon extends PureComponent {
    render () {
        const { title, active } = this.props;
        let src = null;
        switch(title){
            case 'Quickbook': src = active ? QuickBookWhite : QuickBookGrey;
                             break;
            case 'springbig': src= active ? SpringBigWhite : SpringBigGrey;
                             break;
            case 'Weedmaps': src= active ? WeedmapsWhite : WeedmapsGrey;
                             break;
            case 'Clover':  src = active ? CloverWhite : CloverGrey;
                            break;
            case 'Leafly':  src = active ? LeaflyWhite : LeaflyGrey;
                            break;
            case 'Unique Attributes':  src = active ? UniqueAttributesWhite : UniqueAttributesGrey;
                            break;
            case 'Spence':  src = active ? SpencePurple : SpenceGray;
                            break;
            case 'Stronghold':  src = active ? stronghold : strongholdGray;
                            break;
            default:
                     break;
        }
        
        return (
            src ? <img src={src} height={24} width={24} style={{paddingLeft: 10}} alt="" /> : null
        )
    }
}