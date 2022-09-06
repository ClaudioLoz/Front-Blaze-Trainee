import { STOP_LOADING, START_LOADING } from '../types/loading';


export const stopLoading = () => ({
    type: STOP_LOADING,
})

export const startLoading = () => ({
    type: START_LOADING,
})