import { createStore,combineReducers,applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import authReducer from "./reducers/auth";
import shopReducer from "./reducers/shop";
import organizationReducer from "./reducers/organization";
import companyReducer from "./reducers/company";


const reducer = combineReducers({authReducer,shopReducer,organizationReducer,companyReducer});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
