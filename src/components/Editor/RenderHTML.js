import React, { Component } from 'react';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

export default class RenderHTMLComponent extends Component  {
    constructor(props) {
        super(props);

        if (!props.message) {
            this.state = {editorState: EditorState.createEmpty()};
        } else {
            const contentBlock = htmlToDraft(props.message);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            this.state = {editorState: EditorState.createWithContent(contentState)};
        }
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}} />
        )
    }
}
