import Validator from 'is_js';
import { isEmpty } from 'lodash';

export default function validateInputRegion(region) {
    let errors = {};

    if (!region.name || Validator.empty(region.name)){
        errors.name = 'Region Name is required.';
    }
    if(region.kmlEdges && region.kmlEdges.length <= 0 && region.zoneType == "kml"){
        errors.kml = "KML is required.";
    }
    if (region.zipCodes && region.zipCodes.length <= 0 && region.zoneType === "zipCode") {
        errors.zipCode = "ZipCode is required.";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

