import { CLOSE_MESSAGE, OPEN_MESSAGE } from '../types/message';
import { partial } from '../utils/common';


export const closeMessage = () => ({
    type: CLOSE_MESSAGE,
})

export const setMessage = (type, message) => ({
    type: OPEN_MESSAGE,
    payload: {
        type, message
    }
})

export const openSuccessMessage = partial(setMessage, 'success');
export const openErrorMessage = partial(setMessage, 'error');