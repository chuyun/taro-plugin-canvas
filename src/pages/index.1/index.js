import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import TaroCanvasDrawer from '../../component/taro-plugin-canvas';

// import { TaroCanvasDrawer } from 'taro-plugin-canvas';

import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);
    this.state = {
      config: null,
      shareImage: null,
      canvasStatus: false,
      jdConfig: {
        width: 750,
        height: 1334,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          {
            width: 690,
            height: 808,
            x: 30,
            y: 183,
            borderWidth: 2,
            borderColor: '#f0c2a0',
            borderRadius: 20,
          },
          {
            width: 634,
            height: 74,
            x: 59,
            y: 770,
            backgroundColor: '#fff',
            opacity: 0.5,
            zIndex: 100,
          },
        ],
        texts: [
          {
            x: 113,
            y: 61,
            baseLine: 'middle',
            text: '伟仔',
            fontSize: 32,
            color: '#8d8d8d',
          },
          {
            x: 30,
            y: 113,
            baseLine: 'top',
            text: '发现一个好物，推荐给你呀',
            fontSize: 38,
            color: '#080808',
          },
          {
            x: 92,
            y: 810,
            fontSize: 38,
            baseLine: 'middle',
            text: '标题标题标题标题标题标题标题标题标题',
            width: 570,
            lineNum: 1,
            color: '#8d8d8d',
            zIndex: 200,
          },
          {
            x: 59,
            y: 895,
            baseLine: 'middle',
            text: [
              {
                text: '2人拼',
                fontSize: 28,
                color: '#ec1731',
              },
              {
                text: '¥99',
                fontSize: 36,
                color: '#ec1731',
                marginLeft: 30,
              }
            ]
          },
          {
            x: 522,
            y: 895,
            baseLine: 'middle',
            text: '已拼2件',
            fontSize: 28,
            color: '#929292',
          },
          {
            x: 59,
            y: 945,
            baseLine: 'middle',
            text: [
              {
                text: '商家发货&售后',
                fontSize: 28,
                color: '#929292',
              },
              {
                text: '七天退货',
                fontSize: 28,
                color: '#929292',
                marginLeft: 50,
              },
              {
                text: '运费险',
                fontSize: 28,
                color: '#929292',
                marginLeft: 50,
              },
            ]
          },
          {
            x: 360,
            y: 1065,
            baseLine: 'top',
            text: '长按识别小程序码',
            fontSize: 38,
            color: '#080808',
          },
          {
            x: 360,
            y: 1123,
            baseLine: 'top',
            text: '超值好货一起拼',
            fontSize: 28,
            color: '#929292',
          },
        ],
        images: [
          {
            width: 62,
            height: 62,
            x: 30,
            y: 30,
            borderRadius: 62,
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/02bb99132352b5b5dcea.jpg',
          },
          {
            width: 634,
            height: 634,
            x: 59,
            y: 210,
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/193256f45999757701f2.jpeg',
          },
          {
            width: 220,
            height: 220,
            x: 92,
            y: 1020,
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/d719fdb289c955627735.jpg',
          },
          {
            width: 750,
            height: 90,
            x: 0,
            y: 1244,
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/67b0a8ad316b44841c69.png',
          }
        ]

      },
      demoConfig: {
        width: 750,
        height: 1000,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          {
            x: 0,
            y: 10,
            width: 750, // 如果内部有文字，由文字宽度和内边距决定
            height: 120,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 10,
            borderColor: 'red',
            backgroundColor: 'blue',
            borderRadius: 40,
            text: {
              text: [
                {
                  text: '金额¥ 1.00',
                  fontSize: 80,
                  color: 'yellow',
                  opacity: 1,
                  marginLeft: 50,
                  marginRight: 10,
                },
                {
                  text: '金额¥ 1.00',
                  fontSize: 20,
                  color: 'yellow',
                  opacity: 1,
                  marginLeft: 10,
                  textDecoration: 'line-through',
                },
              ],
              baseLine: 'middle',
            },
          }
        ],
        texts: [
          {
            x: 0,
            y: 180,
            text: [
              {
                text: '长标题长标题长标题长标题长标题长标题长标题长标题长标题',
                fontSize: 40,
                color: 'red',
                opacity: 1,
                marginLeft: 0,
                marginRight: 10,
                width: 200,
                lineHeight: 40,
                lineNum: 2,
              },
              {
                text: '原价¥ 1.00',
                fontSize: 40,
                color: 'blue',
                opacity: 1,
                marginLeft: 10,
                textDecoration: 'line-through',
              },
            ],
            baseLine: 'middle',
          },
          {
            x: 10,
            y: 330,
            text: '金额¥ 1.00',
            fontSize: 80,
            color: 'blue',
            opacity: 1,
            baseLine: 'middle',
            textDecoration: 'line-through',
          },
        ],
        images: [
          {
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/02bb99132352b5b5dcea.jpg',
            width: 300,
            height: 300,
            y: 450,
            x: 0,
            // borderRadius: 150,
            // borderWidth: 10,
            // borderColor: 'red',
          },
          {
            url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/02bb99132352b5b5dcea.jpg',
            width: 100,
            height: 100,
            y: 450,
            x: 400,
            borderRadius: 100,
            borderWidth: 10,
          },
        ],
        lines: [
          {
            startY: 800,
            startX: 10,
            endX: 300,
            endY: 800,
            width: 5,
            color: 'red',
          }
        ]

      },
      rssConfig: {
        width: 750,
        height: 750,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          {
            x: 0,
            y: 0,
            width: 750,
            height: 750,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 0,
            // borderColor: 'red',
            backgroundColor: '#EFF3F5',
            borderRadius: 0,
          },
          {
            x: 40,
            y: 40,
            width: 670,
            height: 670,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 0,
            // borderColor: 'red',
            backgroundColor: '#fff',
            borderRadius: 12,
          }
        ],
        texts: [
          {
            x: 80,
            y: 420,
            text: '国产谍战、真人演出，《隐形守护者》凭什么成为Steam第一？',
            fontSize: 32,
            color: '#000',
            opacity: 1,
            baseLine: 'middle',
            lineHeight: 48,
            lineNum: 2,
            textAlign: 'left',
            width: 580,
            zIndex: 999,
          },
          {
            x: 80,
            y: 590,
            text: '长按扫描二维码阅读完整内容',
            fontSize: 24,
            color: '#666',
            opacity: 1,
            baseLine: 'middle',
            textAlign: 'left',
            lineHeight: 36,
            lineNum: 1,
            zIndex: 999,
          },
          {
            x: 80,
            y: 640,
            text: '分享来自 「 RssFeed 」',
            fontSize: 24,
            color: '#666',
            opacity: 1,
            baseLine: 'middle',
            textAlign: 'left',
            lineHeight: 36,
            lineNum: 1,
            zIndex: 999,
          }
        ],
        images: [
          {
            url: 'http://pic.juncao.cc/rssfeed/images/demo.png',
            width: 670,
            height: 320,
            y: 40,
            x: 40,
            borderRadius: 12,
            zIndex: 10,
            // borderRadius: 150,
            // borderWidth: 10,
            // borderColor: 'red',
          },
          {
            url: 'https://pic.juncao.cc/cms/images/minapp.jpg',
            width: 110,
            height: 110,
            y: 570,
            x: 560,
            borderRadius: 100,
            borderWidth: 0,
            zIndex: 10,
          },
        ],
        lines: [
          {
            startY: 540,
            startX: 80,
            endX: 670,
            endY: 541,
            width: 1,
            color: '#eee',
          }
        ]

      },
      wxConfig: {
        width: 750,
        height: 1624,
        backgroundColor: '#F2F3F2',
        debug: false,
        blocks: [
          {
            x: 20,
            y: 80,
            width: 710,
            height: 1520,
            paddingLeft: 0,
            paddingRight: 0,
            borderWidth: 2,
            borderColor: '#E7E7E7',
            backgroundColor: '#F2F3F2',
            borderRadius: 60,
          },
          {
            x: 20,
            y: 800,
            width: 710,
            height: 804,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: '#fff',
            borderRadius: 60,
          },
          {
            x: 20,
            y: 800,
            width: 710,
            height: 20,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: '#fff',
            borderRadius: 0,
          },
        ],
        texts: [
          {
            x: 380,
            y: 660,
            text: '京门风月',
            fontSize: 48,
            fontFamily: 'STSong',
            color: '#000',
            opacity: 1,
            baseLine: 'middle',
            lineHeight: 48,
            lineNum: 2,
            textAlign: 'center',
            width: 200,
            zIndex: 999,
          },
          {
            x: 380,
            y: 720,
            text: '测试赛',
            fontFamily: 'STSong',
            fontSize: 32,
            color: '#1B88ED',
            opacity: 1,
            baseLine: 'middle',
            lineHeight: 48,
            lineNum: 2,
            textAlign: 'center',
            width: 200,
            zIndex: 999,
          },
        ],
        images: [
          {
            url: 'https://pic.juncao.cc/temp/IMG_1294.JPG',
            width: 290,
            height: 420,
            y: 170,
            x: 230,
            borderRadius: 12,
            zIndex: 10,
            // borderRadius: 150,
            // borderWidth: 10,
            // borderColor: 'red',
          },

        ],
        lines: [
          {
            startY: 540,
            startX: 80,
            endX: 670,
            endY: 541,
            width: 1,
            color: '#eee',
          }

        ],
      }
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  canvasDrawFunc = (config = this.state.rssConfig) => {
    this.setState({
      canvasStatus: true,
      config: config,
    })
    Taro.showLoading({
      title: '绘制中...'
    })
  }

  onCreateSuccess = (e) => {
    Taro.hideLoading();
    console.log('onCreateSuccess')
    this.setState({
      shareImage: e,
      canvasStatus: false,
      config: null,
    })
    // Taro.previewImage({
    //   current: e,
    //   urls: [e]
    // })
  }

  onCreateFail = (error) => {
    console.log('onCreateFail')
    console.log(error);
    this.setState({
      canvasStatus: false,
      config: null,
    })
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
      shareImage: null,
      canvasStatus: false,
    })
  }

  render() {
    return (
      <View className='index'>

        <View>
          <View className='flex-row'>
            <Button onClick={this.canvasDrawFunc.bind(this, this.state.rssConfig)} >绘制1</Button>
            <Button onClick={this.canvasDrawFunc.bind(this, this.state.jdConfig)}>绘制2</Button>
            <Button onClick={this.canvasDrawFunc.bind(this, this.state.demoConfig)}>绘制3</Button>
            <Button onClick={this.canvasDrawFunc.bind(this, this.state.wxConfig)}>绘制4</Button>
          </View>
          <View className='flex-row'>
            <Button onClick={this.saveToAlbum}>保存到相册</Button>
            <Button onClick={this.reset}>重置</Button>
          </View>
        </View>

        <View className='shareImage-cont'>
          <Image
            className='shareImage'
            src={this.state.shareImage}
            mode='widthFix'
            lazy-load
          />
          {
            this.state.canvasStatus &&
            (<TaroCanvasDrawer
              config={this.state.config}
              onCreateSuccess={this.onCreateSuccess}
              onCreateFail={this.onCreateFail}
            />
            )
          }
        </View>
      </View>
    )
  }
}

