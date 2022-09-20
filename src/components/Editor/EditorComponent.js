import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class EditorComponent extends Component  {
    constructor(props) {
        super(props);
       if (!props.emailMessage) {
            this.state = {editorState: EditorState.createEmpty()};
        } else {
           const contentBlock = htmlToDraft(props.emailMessage);
           const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
           this.state = {editorState: EditorState.createWithContent(contentState)};
        }
    }


    onEditorStateChange = (value) => {
        this.setState({
            editorState:value,
        });
        this.props.onChange(draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())))
    };

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                editorStyle={{border:'1px solid #ddd'}}
                onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}