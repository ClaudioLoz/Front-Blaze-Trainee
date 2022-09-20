import React, { PureComponent } from 'react';
import { partial } from '../../utils/common';

class EditableHOC extends PureComponent {

    state = {

        dataToEdit: {},
        editMode: false,
        lastModified: null,
        syncMode: false

    }

    static getDerivedStateFromProps (nextProps, prevState) {

        if(nextProps.lastModified !== prevState.lastModified) {

            return {
                lastModified: nextProps.lastModified,
                dataToEdit: nextProps.dataToEdit
            }

        }

        if(nextProps.controlled && (nextProps.editMode !== prevState.editMode)) {

            this.setState({
                editMode: nextProps.editMode
            })

        }

        return null

    }

    componentDidMount () {
        const { dataToEdit, defaultEditMode = false } = this.props;

        this.setState({
            dataToEdit,
            editMode: defaultEditMode
        })

    }

    updateData = dataToEdit => this.setState({ dataToEdit })

    updateEditMode = editMode => this.setState({ editMode })

    updateSyncMode = syncMode => this.setState({ syncMode })

    enableEdit = partial(this.updateEditMode, true)

    disableEdit = partial(this.updateEditMode, false)

    enableSync = partial(this.updateSyncMode, true)

    disableSync = partial(this.updateSyncMode, false)

    onChange = (key, value, fn) => this.setState(prevState => ({

        dataToEdit: {
            ...prevState.dataToEdit,
            [key]: value
        }

    }), fn)

    onSave = (func = () => {} ) => {

        const { dataToEdit } = this.state;
        this.props.onSave(dataToEdit, func)

    }

    onCancel = () => {

        this.updateData(this.props.dataToEdit)
        this.disableEdit()

        if(this.props.onCancel) {
            this.props.onCancel()
        }

    }

    render () {

        const { dataToEdit, editMode, lastModified, syncMode } = this.state;
        const { WrappedComponent, WrappedProps } = this.props;

        return <WrappedComponent
            data={dataToEdit}
            editMode={editMode}
            syncMode={syncMode}
            onSave={this.onSave}
            onCancel={this.onCancel}
            onChange={this.onChange}
            enableEdit={this.enableEdit}
            disableEdit={this.disableEdit}
            enableSync={this.enableSync}
            disableSync={this.disableSync}
            lastModified={lastModified}
            {...WrappedProps}
        />

    }

}

const EditableHOCWrapper = WrappedComponent => props => {

    const {lastModified, dataToEdit, onSave, onCancel, defaultEditMode, ...WrappedProps} = props;
    return <EditableHOC
        WrappedComponent={WrappedComponent}
        WrappedProps={WrappedProps}
        lastModified={lastModified}
        dataToEdit={dataToEdit}
        onSave={onSave}
        onCancel={onCancel}
        defaultEditMode={defaultEditMode}
    />

}

export default EditableHOCWrapper