import { UPDATE_PAGE_TITLE } from '../types/currentPage';

export const updateRouteTitle = title => ({
    type: UPDATE_PAGE_TITLE,
    payload: {
        title
    }
})