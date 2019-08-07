import React, { Component } from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Button,
  Cascader
} from 'antd'

import LinkButton from '../../components/link-button'
//移入获取分类列表的方法
import { reqCategorys } from '../../api'
//引入图片上传组件
import PicturesWall from './pictures-wall'
//引入富文本编辑器组件---还需要引入相应样式
import RichTextEditor from './rich-text-editor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const { Item } = Form
//获取文本域
const { TextArea } = Input;

/* const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      isLeaf: false,
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      isLeaf: false,
    },
  ]; */

/* 
商品的添加/修改子路由组件
*/
class ProductAddUpdate extends Component {

    state = {
        options: [],
    }

    // 定义用来接收图片上传组件对象的ref容器
    constructor(props) {
        super(props);
        this.pwRef = React.createRef();
        this.editorRef = React.createRef();
      }

    //--------点击提交进行统一校验
    submit = ()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
              

                //读取所有上传图片的文件名数组（方法有子组件提供，父组件通过获取子组件对象来调用）
                const imgs = this.pwRef.current.getImgs()
                // console.log(imgs);
                //读取富文本内容（html格式的字符串）
                const detail = this.editorRef.current.getDetail() 

                console.log('Received values of form: ', values,imgs,detail);
            }
        })
    }
    //-------自定义校验商品价格
    validatePrice = (rule, value, callback)=>{
        if(value < 0){
            callback('商品价格不能小于0')
        }else{
            callback()
        }
    }

    


    /* 
      ------------------获取一级/二级分类列表的方法
    */
    getCategorys = async (parentId) => {
        // 发送请求获取一级分类列表
        const result = await reqCategorys(parentId)
        if(result.status === 0 ){
            const categorys = result.data
            if(parentId === '0'){
                //获取的是一级分类列表，调用初始化一级分类列表的方法
                this.initOptions(categorys)
            }else{
                //获取的是二级列表，我们需要将响应的数据返回，借助async函数特性：async函数最终返回的一定是一个promise对象，该对象的状态
                //取决于内部异步操作的状态，成功的值取决于函数内部返回什么值
                return categorys
            }
        }
    }

    /* 
    --------------------初始化一级分类列表的方法
    */
   initOptions = async (categorys) => {
        // 获取每一个一级分类对象，对其进行遍历，返回一个option对象，该对象包含三个属性：label，value，isLeaf
        const options = categorys.map((c) => ({
            label: c.name,
            value: c._id,
            isLeaf: false
        }))

        //----------如果当前是进行修改操作，那么在初始化一级分类之后，还需要判断准备修改的当前商品是不是二级分类下的商品
        //如果是，那么我们需要加载这个二级分类以便于商品分类的默认显示
        const { product,isUpdate} = this 
        if(isUpdate  && product.pCategoryId !== '0'){
            //发送请求获取指定的二级分类列表
            const subCategorys = await this.getCategorys(product.pCategoryId)
            //需要将获取的二级分类列表，添加到对应的一级分类列表对象的children属性中
            const targetOption = options.find( option => option.value === product.pCategoryId)
            targetOption.children = subCategorys.map( c => ({
                label: c.name,
                value: c._id,
                isLeaf: true
            }))
        }

        //更新状态中的options
        this.setState({
            options
        })
   }

   /* 
   --------------------级联选择的动态加载方法
   */
   loadData = async selectedOptions => {
     /* console.log(selectedOptions)
     selectedOptions是选择项数组对象，目前是只能选择一个，所以数组中只有一个对象，也就是我们选择的那项的参数
     const targetOption = selectedOptions[selectedOptions.length - 1];
     console.log(selectedOptions):[{value: "zhejiang", label: "Zhejiang", isLeaf: false, loading: false, children: Array(2)}] */
        const targetOption = selectedOptions[0];
        //点击下一级的时候，加载图片出现
        targetOption.loading = true;

        // 异步加载下一级选择项
        // 获取二级列表的parentId
        const pCategoryId = targetOption.value
        //发送请求获取指定的二级列表
        const subCategorys = await this.getCategorys(pCategoryId)
        // console.log(subCategorys)
        targetOption.loading = false
        //判断我们点击的一级列表是否有二级列表
        if(!subCategorys || subCategorys.length === 0){
            //没有二级列表，将点击的一级列表置为叶子
            targetOption.isLeaf = true
        }else{
            //将二级列表，添加到一级列表的children属性中
            targetOption.children = subCategorys.map( c => ({
                label: c.name,
                value: c._id,
                isLeaf: true
            }))
        }

        // 更新状态
        this.setState({
            options: [...this.state.options]
        })

    /*  setTimeout(() => {
            //获取到响应数据，加载图片消失
            targetOption.loading = false;
            //将下一级需要显示的选择项添加到本级选择项的children属性中
            targetOption.children = [
                {
                label: `${targetOption.label} Dynamic 1`,
                value: 'dynamic1',
                },
                {
                label: `${targetOption.label} Dynamic 2`,
                value: 'dynamic2',
                },
            ];
            //将最新的options显示数据更新到状态中，是的页面重新渲染，渲染出下一级选择项
            this.setState({
                //使用这种方式是因为，我们是对状态中的options进行属性上的改变，react监测不到我们对状态的修改。因为原本options的值就是一个数组对象，所以
                //我们新建一个数组对象，将最新的options数据放入这个数组中，再将其赋值给options。这就意味着状态中options的值直接更换了对象，react就能监测
                // 我们对状态的修改
                options: [...this.state.options],   
            });
        }, 1000); */

   };



    //   --------------------------------------------生命周期函数

   componentWillMount(){
       //在组件即将挂载的时候确定，本次我们是执行的更新商品还是添加商品
       this.product = this.props.location.state || {}
       this.isUpdate = !!this.product._id
   }

    componentDidMount(){
        //调用获取一级/二级分类列表的方法
        this.getCategorys('0')
    }


  
  render() {
    const { getFieldDecorator } = this.props.form
    //确定本次渲染页面是为了修改商品还是添加商品 
    const { product,isUpdate } = this 

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </LinkButton>
        {isUpdate ? '修改商品' : '添加商品'}
      </span>
    )

    // 指定form的item布局的对象
    const formLayout = {
      labelCol: { span: 2 },    //左边占多少份宽度
      wrapperCol: { span: 8 }   //右边占多少宽度
    }

    //判断是否有从修改商品跳转到本页面，并且携带准备修改的商品数据
    if(product._id){
        //进行修改操作
        if(product.pCategoryId === '0'){
            //修改的商品为一级列表商品
            product.categoryIds = [product.categoryId]
        }else{
            //修改的商品为二级列表商品
            product.categoryIds = [product.pCategoryId,product.categoryId]
        }
    }else{
        //进行添加操作
        product.categoryIds = []
    }

    return (
      <Card title={title}>
        <Form {...formLayout}>
          <Item label="商品名称">   {/* label用来指定输入项前面的文本内容 */}
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  { required: true, message: '商品名称必须输入' }
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, message: '商品描述必须输入' }
                ]
              })(
                <TextArea placeholder="请输入商品描述" autosize />
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  /* 自定义校验商品价格 */
                  { validator: this.validatePrice}
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter="元"/>
              )
            }
          </Item>

          <Item label="商品分类">
            {
                getFieldDecorator('categoryIds', {
                initialValue: product.categoryIds,
                rules: [
                  { required: true, message: '商品分类必须指定' },
                ]
                })(
                  /*使用级联选择进行分类的选择  */
                    <Cascader
                    options={this.state.options}    //展示的具体分类数据，从状态中读取
                    loadData={this.loadData}        //动态加载下一级
                    // onChange={this.onChange}
                    // changeOnSelect
                    />
                )
            }
          </Item>

          <Item label="商品图片">
                {/* 定义ref以便于获取组件对象 */}
                {/* 因为页面还有可能是执行修改，所以将商品数据中的图片数据传递给子组件渲染 */}
                <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
          </Item>


          <Item
            label="商品详情"
            wrapperCol={{ span: 15 }}    /* 改变编辑器宽度 */
          >     
                {/* 富文本编辑器组件标签 */}
                <RichTextEditor ref={this.editorRef} detail={product.detail} />
          </Item>



          {/* 给提交按钮绑定监听，点击的时候进行统一校验 */}
          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)