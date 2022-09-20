import React, { PureComponent } from "react";

const EditableInputHOC = (WrappedComponent) => {
  return class ComponentWithAddedLogic extends PureComponent {
    render() {
      const {
        editMode,
        valueToRender,
        material = true,
        name = "",
        ...restProps
      } = this.props;

      return editMode ? (
        <WrappedComponent
          fullWidth
          className={!material && "select-master-catalog"}
          {...restProps}
          name={name}
        />
      ) : (
        <span>{valueToRender}</span>
      );
    }
  };
};

export default EditableInputHOC;
