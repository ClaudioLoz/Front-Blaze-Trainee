import React, { Fragment } from 'react';
import { ChromePicker } from 'react-color';

import EditableInputHOC from '../../containers/HOC/EditableInputHOC';

export const ColorSwatch = ({ color, ...restProps }) => <div style={{
    backgroundColor: color
}} {...restProps} className="color-swatch"></div>

class ColorPicker extends React.Component {

    state = {
        editMode: false
    }

    constructor(props) {
        super(props);
        this.checkColorPicker = this.checkColorPicker.bind(this);
    }

    toggleEdit = () => {
        const { editMode }  = this.state;
        if(!editMode) {
            document.body.addEventListener('click', this.checkColorPicker)
        }
        else {
            document.body.removeEventListener('click', this.checkColorPicker)
        }
        this.setState(prevState => ({
            editMode: !prevState.editMode
        }))
    }

    checkColorPicker(event) {
        if(this.colorPickerRef && !this.colorPickerRef.contains(event.target)) {
            this.toggleEdit();
        }
    }

    render() {

        const { editMode } = this.state;
        
        return (
            <Fragment>
                <ColorSwatch
                    onClick={this.toggleEdit}
                    color={this.props.color}
                />
                {
                    editMode ? <div
                        ref={(c) => this.colorPickerRef = c}
                        style={{
                            position: 'absolute',
                            zIndex: 2
                        }}
                    >
                        <ChromePicker
                            color={this.props.color}
                            onChangeComplete={this.props.onColorChange}
                        />
                    </div>
                        : null
                }
            </Fragment>
        )
    }

}

export const EditableColorPicker = EditableInputHOC(ColorPicker)