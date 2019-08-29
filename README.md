# taro-plugin-canvas
小程序组件-小程序海报组件
   [![npm](https://img.shields.io/npm/v/taro-plugin-canvas.svg?style=flat "npm")](https://www.npmjs.com/package/taro-plugin-canvas)[![npm](https://img.shields.io/npm/dm/taro-plugin-canvas.svg?style=flat "npm")](https://www.npmjs.com/package/taro-plugin-canvas)

## 概述
taro-plugin-canvas 是基于 Taro 框架的微信小程序 canvas 绘图组件，封装了常用的操作，通过配置的方式生成分享图片

本组件是基于 [wxa-plugin-canvas](https://github.com/jasondu/wxa-plugin-canvas) 的Taro封装版本

## 生成效果
<img width="300" src="https://github.com/chuyun/taro-plugin-canvas/blob/master/src/assets/images/demo1.png"></img> <img width="300" src="https://github.com/chuyun/taro-plugin-canvas/blob/master/src/assets/images/demo2.png"></img><img width="300" src="https://github.com/chuyun/taro-plugin-canvas/blob/master/src/assets/images/demo3.png"></img>

## 组件原理说明
参见 wxa-plugin-canvas => https://juejin.im/post/5b7e48566fb9a01a1059543f

## 使用之前

使用 taro-plugin-canvas 前，请确保你已经学习过微信官方的 [小程序简易教程](https://mp.weixin.qq.com/debug/wxadoc/dev/) 和 [自定义组件介绍](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)。

## 安装

#### 通过 npm 安装 (推荐)

小程序已经支持使用 npm 安装第三方包，详见 [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?search-key=npm)

``` bash
# npm
npm i taro-plugin-canvas -S --production

# yarn
yarn add taro-plugin-canvas --production
```
## 使用组件

```javascript
// 引入代码
import { TaroCanvasDrawer } from '../../component/taro-plugin-canvas';

// 在 render 方法中调用
<TaroCanvasDrawer
  config={this.state.config}
  onCreateSuccess={this.onCreateSuccess}
  onCreateFail={this.onCreateFail}
/>
// 注意点 
// config 绘图配置信息 - 必填项
// onCreateSuccess 绘图成功回调 - 必须实现 => 接收绘制结果、重置 TaroCanvasDrawer 状态
// onCreateFail 绘图失败回调 - 必须实现 => 接收绘制错误信息、重置 TaroCanvasDrawer 状态
```


#### 方式二.下载代码

直接通过 git 下载 taro-plugin-canvas 源代码，并将`src/component/taro-plugin-canvas`目录拷贝到自己的项目的 `src/component`目录中

## 使用组件

```javascript
// 引入代码 *引入方式和上面的方式一略有不同
import TaroCanvasDrawer from '../../component/taro-plugin-canvas';

// 在 render 方法中调用 和方式一一样
```


## 使用注意事项

1. 图片的域名**务必**添加到downloadFile合法域名中（开发设置-服务器域名-downloadFile合法域名）
【P.s 开发时可 选中不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书】
【P.s 真机运行，可打开调试模式】

## 组件参数解释

### config字段

| 字段            | 类型                     | 必填 | 描述                                       |
| --------------- | ------------------------ | ---- | ------------------------------------------ |
| width           | Number(单位:rpx)         | 是   | 画布宽度                                   |
| height          | Number(单位:rpx)         | 是   | 画布高度                                   |
| backgroundColor | String                   | 否   | 画布颜色                                   |
| debug           | Boolean                  | 否   | false隐藏canvas，true显示canvas，默认false |
| preload         | Boolean                  | 否   | true：图片资源预下载 默认false             |
| hide-loading    | Boolean                  | 否   | true：隐藏loading 默认false                |
| blocks          | Object Array（对象数组） | 否   | 看下文                                     |
| texts           | Object Array（对象数组） | 否   | 看下文                                     |
| images          | Object Array（对象数组） | 否   | 看下文                                     |
| lines           | Object Array（对象数组） | 否   | 看下文   |
| pixelRatio | Number | 否 | 1为一般，值越大越清晰 |

### blocks字段

| 字段名          | 类型             | 必填 | 描述                                   |
| --------------- | ---------------- | ---- | -------------------------------------- |
| x               | Number(单位:rpx) | 是   | 块的坐标                               |
| y               | Number(单位:rpx) | 是   | 块的坐标                               |
| width           | Number(单位:rpx) | 否   | 如果内部有文字，由文字宽度和内边距决定 |
| height          | Number(单位:rpx) | 是   |                                        |
| paddingLeft     | Number(单位:rpx) | 否   | 内左边距                               |
| paddingRight    | Number(单位:rpx) | 否   | 内右边距                               |
| borderWidth     | Number(单位:rpx) | 否   | 边框宽度                               |
| borderColor     | String           | 否   | 边框颜色                               |
| backgroundColor | String           | 否   | 背景颜色                               |
| borderRadius    | Number(单位:rpx) | 否   | 圆角                                   |
| text            | Object           | 否   | 块里面可以填充文字，参考texts字段解释  |
| zIndex          | Int              | 否   | 层级，越大越高                         |

### texts字段

| 字段名         | 类型             | 必填 | 描述                                                         |
| -------------- | ---------------- | ---- | ------------------------------------------------------------ |
| x              | Number(单位:rpx) | 是   | 坐标                                                         |
| y              | Number(单位:rpx) | 是   | 坐标                                                         |
| text           | String\|Object   | 是   | 当Object类型时，参数为text字段的参数，marginLeft、marginRight这两个字段可用（示例请看下文） |
| fontSize       | Number(单位:rpx) | 是   | 文字大小                                                     |
| color          | String           | 否   | 颜色                                                         |
| opacity        | Int              | 否   | 1为不透明，0为透明                                           |
| lineHeight     | Number(单位:rpx) | 否   | 行高                                                         |
| lineNum        | Int              | 否   | 根据宽度换行，最多的行数                                     |
| width          | Number(单位:rpx) | 否   | 没有指定为画布宽度                                           |
| marginLeft     | Number(单位:rpx) | 否   | 当text字段为Object可以使用，用来控制多行文字间距             |
| marginRight    | Number(单位:rpx) | 否   | 当text字段为Object可以使用，用来控制多行文字间距             |
| textDecoration | String           | 否   | 目前只支持 line-through（贯穿线），默认为none                |
| baseLine       | String           | 否   | top\| middle\|bottom基线对齐方式                             |
| textAlign      | String           | 否   | left\|center\|right对齐方式                                  |
| zIndex         | Int              | 否   | 层级，越大越高                                               |
| fontFamily     | String           | 否   | 小程序默认字体为'sans-serif', 请输入小程序支持的字体，例如：'STSong' |
| fontWeight     | String           | 否   | 'bold'加粗字体，目前小程序不支持 100 - 900 加粗            |
| fontStyle      | String           | 否   | 'italic'倾斜字体                                          |

### images字段

| 字段         | 类型             | 必填 | 描述                                      |
| ------------ | ---------------- | ---- | ----------------------------------------- |
| x            | Number(单位:rpx) | 是   | 右上角的坐标                              |
| y            | Number(单位:rpx) | 是   | 右上角的坐标                              |
| url          | String           | 是   | 图片url（**需要添加到下载白名单域名中**）也支持本地图片 |
| width        | Number(单位:rpx) | 是   | 宽度（**会根据图片的尺寸同比例缩放**）    |
| height       | Number(单位:rpx) | 是   | 高度（**会根据图片的尺寸同比例缩放**）    |
| borderRadius | Number(单位:rpx) | 否   | 圆角，跟css一样                           |
| borderWidth  | Number(单位:rpx) | 否   | 边框宽度                                  |
| borderColor  | String           | 否   | 边框颜色                                  |
| zIndex       | Int              | 否   | 层级，越大越高                            |

### lines字段

| 字段   | 类型             | 必填 | 描述           |
| ------ | ---------------- | ---- | -------------- |
| startX | Number(单位:rpx) | 是   | 起始坐标       |
| startY | Number(单位:rpx) | 是   | 起始坐标       |
| endX   | Number(单位:rpx) | 是   | 终结坐标       |
| endY   | Number(单位:rpx) | 是   | 终结坐标       |
| width  | Number(单位:rpx) | 是   | 线的宽度       |
| color  | String           | 否   | 线的颜色       |
| zIndex | Int              | 否   | 层级，越大越高 |

## 事件

### success

成功回调 onCreateSuccess  

返回生成海报图片的本地url，一般做法是使用wx.previewImage预览海报或者在指定位置预览，如下

```javascript
// 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = (result) => {
    const { tempFilePath, errMsg } = result;
    Taro.hideLoading();
    if (errMsg === 'canvasToTempFilePath:ok') {
      this.setState({
        shareImage: tempFilePath,
        // 重置 TaroCanvasDrawer 状态
        canvasStatus: false,
        config: null
      })
    } else {
      // 重置 TaroCanvasDrawer 状态
      this.setState({
        canvasStatus: false,
        config: null
      })
      Taro.showToast({ icon: 'none', title: errMsg || '出现错误' });
      console.log(errMsg);
    }
  }

```

### fail

错误回调 onCreateFail

```javascript
// 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  onCreateFail = (error) => {
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态
    this.setState({
      canvasStatus: false,
      config: null
    })
    console.log(error);
  }
```

### Demo 

以下是简易的Demo实现，也可以clone代码，里面有具体实现，线上案例见小程序 RssFeed  


<details><summary>例子代码（点击展开）</summary><br>

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import TaroCanvasDrawer from '../../component/taro-plugin-canvas'; // 拷贝文件到component的引入方式
// import { TaroCanvasDrawer  } from 'taro-plugin-canvas'; // npm 引入方式
import './index.scss'

export default class Simple extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);
    this.state = {
      // 绘图配置文件
      config: null,
      // 绘制的图片
      shareImage: null,
      // TaroCanvasDrawer 组件状态
      canvasStatus: false,
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
            // borderColor: '#ccc',
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
            // borderColor: '#ccc',
            backgroundColor: '#fff',
            borderRadius: 12,
          }
        ],
        texts: [
          {
            x: 80,
            y: 420,
            text: '国产谍战 真人演出,《隐形守护者》凭什么成为Steam第一?',
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
    }
  }

  // 调用绘画 => canvasStatus 置为true、同时设置config
  canvasDrawFunc = (config = this.state.rssConfig) => {
    this.setState({
      canvasStatus: true,
      config: config,
    })
    Taro.showLoading({
      title: '绘制中...'
    })
  }

  // 绘制成功回调函数 （必须实现）=> 接收绘制结果、重置 TaroCanvasDrawer 状态
  onCreateSuccess = (result) => {
    const { tempFilePath, errMsg } = result;
    Taro.hideLoading();
    if (errMsg === 'canvasToTempFilePath:ok') {
      this.setState({
        shareImage: tempFilePath,
        // 重置 TaroCanvasDrawer 状态，方便下一次调用
        canvasStatus: false,
        config: null
      })
    } else {
      // 重置 TaroCanvasDrawer 状态，方便下一次调用
      this.setState({
        canvasStatus: false,
        config: null
      })
      Taro.showToast({ icon: 'none', title: errMsg || '出现错误' });
      console.log(errMsg);
    }
    // 预览
    // Taro.previewImage({
    //   current: tempFilePath,
    //   urls: [tempFilePath]
    // })
  }

  // 绘制失败回调函数 （必须实现）=> 接收绘制错误信息、重置 TaroCanvasDrawer 状态
  onCreateFail = (error) => {
    Taro.hideLoading();
    // 重置 TaroCanvasDrawer 状态，方便下一次调用
    this.setState({
      canvasStatus: false,
      config: null
    })
    console.log(error);
  }

   // 保存图片至本地
  saveToAlbum = () => {
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

  render() {
    return (
      <View className='index'>
        <View>
          <View className='flex-row'>
            <Button onClick={this.canvasDrawFunc.bind(this, this.state.rssConfig)}>绘制</Button>
            <Button onClick={this.saveToAlbum}>保存到相册</Button>
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
            // 由于部分限制，目前组件通过状态的方式来动态加载
            this.state.canvasStatus &&
            (<TaroCanvasDrawer
              config={this.state.config} // 绘制配置
              onCreateSuccess={this.onCreateSuccess} // 绘制成功回调
              onCreateFail={this.onCreateFail} // 绘制失败回调
            />
            )
          }
        </View>
      </View>
    )
  }
}

```

## 问题反馈

有什么问题可以直接提issue

[提issue](https://github.com/chuyun/taro-plugin-canvas/issues/new)
