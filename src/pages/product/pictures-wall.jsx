import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import PropTypes from 'prop-types'

import { reqDelteImg } from '../../api'
// 引入图片基础路径
import { BASE_IMG_URL } from '../../utils/constents'


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  // 对接收参数做出限制
  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false,  //是否显示大图
    previewImage: '',       //大图的地址
    fileList: [           //所有已上传图片信息对象的数组
      /* {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }, */
    ],
  };

  // 关闭大图预览
  handleCancel = () => this.setState({ previewVisible: false });
 
  /* 当我们点击图片上的预览（小眼睛）触发的函数 */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  /* 图片状态发生改变的时候触发的函数 
    file是当前正在操作的文件，fileList是当前正在操作的文件列表
  */
  handleChange = async ({ file,fileList }) => {
    if(file.status === 'done'){   //图片上传完毕
      //获取图片上传后，返回的结果
      const result = file.response
      if(result.status === 0){
        // 图片上传请求，成功响应,获取图片文件名和url(从接口文档中了解)
        const name = result.data.name
        const url = result.data.url
        // console.log(name,url)   image-1565168147430.jpg http://localhost:5000/upload/image-1565168147430.jpg
        //但是这个时候文件列表中对应的当前文件（也就是文件列表的最后一个文件对象）的name和url还是原先的数据（Base64的url）
        // 所以我们还需要更新fileList中的最后一个file
        
        fileList[fileList.length -1].name = name
        fileList[fileList.length -1].url  = url
        //给当前的文件也修改名字
        file.name = name
        file.url = url
      }

    }else if(file.status === 'removed'){
      //当我们点击删除图片的标志的时候，file的状态status会发生改变，变成removed
      //发送请求请求删除图片
      const result = await reqDelteImg(file.name)
      if(result.status === 0){
        message.success('删除图片成功')
      }else{
        message.error('删除图片失败')
      }
    }

    this.setState({ fileList })
  };

  /* 
    -------返回所有已上传图片文件名数组
    -------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    该方法需要通过父组件来调用，这就要求父组件能够获取子组件对象！！！
    我们通过ref来实现：在子组件标签上定义ref，然后通过refs获取该指定的标签对象。
    重点在于：如果我们定义ref的标签是组件标签，则我们获取的是组件对象
             如果我们定义ref的标签是一般的html标签，则我们获取的是原生dom对象，也是我们常说的标签对象
  */
  getImgs = () => {
    return this.state.fileList.map( file => file.name)
  }

  /* 
    如果传入了imgs，说明是修改，所以需要显示图片，准备初始化数据
  */
  componentWillMount(){
    // 根据传入的imgs，更新fileList为imgs对应的值
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      const fileList = imgs.map((img,index) => ({
        uid: -index + "",
        name: img,
        url: BASE_IMG_URL + img,
        status: 'done'
      }))

      this.setState({
        fileList
      })
    }
  }


  //---------------------------------------------------------------------------------
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"  /* 图片上传地址 */
          listType="picture-card"
          fileList={fileList}         /* 已经上传的文件列表 */
          name='image'  /* 发请求上传图片的时候，请求参数名默认是file，但是我们接口中接收的参数名是image，所以通过这个属性来进行配置 */
          onPreview={this.handlePreview} /* 当我们点击图片上的预览（小眼睛）触发的函数 */
          onChange={this.handleChange}
        >
          {/* 文件列表中的文件格式大于等于8个的时候，不再出现上传按钮 */}
          {fileList.length >= 8 ? null : uploadButton} 
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

