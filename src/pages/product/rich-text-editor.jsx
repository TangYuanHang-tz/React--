import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createEmpty(),// 创建一个没有内容的编辑对象
  }

  static propTypes = {
      detail : PropTypes.string
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
      }
    }

  }

  /* 
  ----------提供一个方法，返回富文本编辑器生成的标签格式的参数字符串（以便于父组件调用该方法，获取参数）
  */
  getDetail = ()=>{
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
            editorState={editorState}
        //   wrapperClassName="demo-wrapper"
        //   editorClassName="demo-editor"
            editorStyle={{border: '1px solid black',height: '200px',paddingLeft: 10}}
            onEditorStateChange={this.onEditorStateChange}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}