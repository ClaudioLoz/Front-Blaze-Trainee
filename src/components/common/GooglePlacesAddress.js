import React, { PureComponent } from 'react';
import {
	findCountry,
	findState,
	findCity,
	findPostalCode,
	findDescription
} from '../../utils/common';
import Autocomplete from 'react-google-autocomplete';

export default class GooglePlacesAddress extends PureComponent {

    onSelectAddress = (place) => {
		const { address_components, geometry={} } = place;
		const country = findCountry(address_components)
		const state = findState(address_components)
		const city = findCity(address_components)
		const zipCode = findPostalCode(address_components)
		const description = findDescription(address_components)

		const address = {
			address: description || '',
			country: country && country.long_name,
			state: state && state.long_name,
			shortName : state && state.short_name, 
			city: city && city.long_name,
			zipCode: zipCode && zipCode.long_name
		}
        
        const latitude = geometry.location.lat();
        const longitude = geometry.location.lng();

        const location = { latitude, longitude }
        
		this.props.updateAddress(address, location);

	}
    
    render(){

        return (
            <Autocomplete
                onPlaceSelected={this.onSelectAddress}
                types={[]}
                componentRestrictions={{country: "usa"}}
				className="google-autocomplete-input"
				defaultValue={this.props.value || ''}
            />
        )
    }
}
