import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import CanvasDrawer from '../../component/taro-plugin-canvas';

import './index.scss'
const DrawerDataTemp = {
  width: 750,
  height: 750,
  clear: true,
  views: [
    {
      type: 'rect',
      background: '#EFF3F5',
      top: 0,
      left: 0,
      width: 750,
      height: 750,
    },
    {
      type: 'rect',
      background: '#fff',
      top: 40,
      left: 40,
      width: 670,
      height: 670,
      borderRadius: 12,
    },
    {
      type: 'image',
      // pic url
      url: 'https://images.ifanr.cn/wp-content/uploads/2018/08/pexels_photo_9.jpg',
      top: 40,
      left: 40,
      width: 670,
      height: 320,
    },
    {
      type: 'text',
      // 标题
      content: '涨完房租又遇中介爆仓,这届年轻人真惨拉萨的卡萨涨完房租又遇中介爆仓这届年轻人真惨拉萨的卡萨',
      fontSize: 32,
      lineHeight: 48,
      MaxLineNumber: 2,
      color: '#000',
      textAlign: 'left',
      width: 580,
      maxWidth: 590,
      top: 400,
      left: 80,
      bolder: false,
      breakWord: true,
    },
    {
      type: 'rect',
      top: 540,
      left: 80,
      width: 590,
      height: 1,
      background: '#eee',
    },
    {
      type: 'text',
      content: '长按扫描二维码阅读完整内容',
      fontSize: 24,
      lineHeight: 36,
      MaxLineNumber: 1,
      color: '#666',
      textAlign: 'left',
      top: 590,
      left: 80,
      bolder: false,
      breakWord: true,
    },
    {
      type: 'text',
      content: '分享来自 「 RssFeed 」',
      fontSize: 24,
      lineHeight: 36,
      MaxLineNumber: 1,
      color: '#666',
      textAlign: 'left',
      top: 640,
      left: 80,
      bolder: false,
      breakWord: true,
    },
    {
      type: 'image',
      // 文章链接url
      url: 'https://pic.juncao.cc/cms/images/minapp.jpg',
      top: 570,
      left: 560,
      width: 110,
      height: 110,
    },
  ],
};
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);
    this.state = {
      painting: null,
      shareImage: null,
      canvasStatus: false,
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  saveSharCardFuc = () => {
    this.setState({
      canvasStatus: true,
      painting: DrawerDataTemp
    })
    Taro.showLoading({
      title:'绘制中'
    })
  }

  onGetImage(event) {
    console.log("event");
    console.log(event);
    const { tempFilePath, errMsg } = event;
    if (errMsg === 'canvasdrawer:ok') {
      Taro.hideLoading();
      this.setState({
        shareImage: tempFilePath,
      })
    };
  }


  saveToAlbum = () => {
    // 保存图片至本地
    const res = Taro.saveImageToPhotosAlbum({
      filePath: this.state.shareImage,
    });
    if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
      Taro.showToast({
        title: '保存图片成功',
        icon: 'success',
        duration: 2000,
      });
    }
  }

  reset = () => {
    this.setState({
      painting:null,
      shareImage: null,
      canvasStatus: false,
    })
  }

  render() {
    return (
      <View className='index'>
        <View className='shareImage-cont'>
        <Image
          className='shareImage'
          src={this.state.shareImage}
          mode='widthFix'
          lazy-load
        />
        {
          this.state.canvasStatus &&
          (<CanvasDrawer
            painting={this.state.painting}
            onGetImage={this.onGetImage}

          >
          </CanvasDrawer>)
        }
        </View>

        <View>
          <Button onClick={this.saveSharCardFuc} disabled={this.state.shareImage}>绘制</Button>
          <Button onClick={this.saveToAlbum}>保存到相册</Button>
          <Button onClick={this.reset}>重置</Button>
        </View>
      </View>
    )
  }
}

