import { isEmpty, isNumber } from 'lodash';
import moment from 'moment';

export default function validateVehicle(vehicle) {

    let errors = {}
        
    if (isEmpty(vehicle.name)) {
        errors.name = 'Please enter vehicle name';
    }
    let allowedYear = moment().year() + 1; //allows up to the next year
    let year = parseInt(vehicle.year);
    if (!year || !isNumber(year) || year < 1900 || year > allowedYear) {
        errors.year = 'Please enter a valid vehicle year';
    }
    if (isEmpty(vehicle.vehicleMake)) {
        errors.vehicleMake = 'Please enter vehicle make';
    }
    if (isEmpty(vehicle.vehicleModel)) {
        errors.vehicleModel = 'Please enter vehicle model';
    }
    if (isEmpty(vehicle.color)) {
        errors.color = 'Please enter vehicle color';
    }
    if (isEmpty(vehicle.vehicleLicensePlate)) {
        errors.vehicleLicensePlate = 'Please enter vehicle license';
    }
    if (vehicle.vinNo.trim().length !== 17){
        errors.vinNo = vehicle.vinNo.trim().length === 0 ? 'Please enter vehicle Vin' : 'Vehicle Vin must have 17 digits';
    }
    if (isEmpty(vehicle.defaultDriverEmployeeId)) {
        errors.defaultDriverEmployeeId = 'Please enter vehicle driver';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}