import React, { PureComponent, Fragment } from "react";
import { Route } from "react-router-dom";

// local components
import MasterCategories from "./MasterCategories";
import MasterProducts from "./MasterProducts";

// import UniqueAttributes from './UniqueAttributes';

export default class MasterCatalogPage extends PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Fragment>
        <Route
          exact
          path={`${match.url}/categories`}
          component={MasterCategories}
        />
        <Route
          exact
          path={`${match.url}/products`}
          component={MasterProducts}
        />
        {/* <Route exact path={`${match.url}/uniqueAttributes`} component={UniqueAttributes} /> */}
      </Fragment>
    );
  }
}
