import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { Canvas, View } from '@tarojs/components';
import './index.scss';

let inter = null;

export default class CanvasDrawer extends Component {
  static defaultProps = {};
  static propTypes = {
    painting: PropTypes.object,
    onGetImage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showCanvas: false,
      width: 100,
      height: 100,
      tempFileList: [],
      isPainting: false,
    }
    this.ctx = null;
    this.cache = {};
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount() {
    console.log('componentDidMount')
    Taro.removeStorageSync('canvasdrawer_pic_cache')
    this.cache = Taro.getStorageSync('canvasdrawer_pic_cache') || {}
    this.ctx = Taro.createCanvasContext('canvasdrawer', this.$scope)
    // setTimeout(()=>this.readyPigment(),1000);
    this.readyPigment();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.painting === null) {
      return false
    }

  }
  shouldComponentUpdate(nextProps, nextState) {
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentWillUnmount() {
    clearInterval(inter);
    inter = null;
  }


  readyPigment() {
    console.log('readyPigment');
    console.log(this.ctx);

    inter = setInterval(() => {
      console.log(this.props.painting)
      if (this.ctx && this.props.painting) {
        const { width, height, views } = this.props.painting
        this.setState({
          width,
          height,
          showCanvas: true,
          isPainting: true,
        })
        console.log("this.ctx");
        clearInterval(inter)
        this.ctx.clearActions()
        this.ctx.save()
        this.getImagesInfo(views)
      }
    }, 100)
  };

  getImagesInfo(views) {
    const imageList = []
    for (let i = 0; i < views.length; i++) {
      if (views[i].type === 'image') {
        imageList.push(this.getImageInfo(views[i].url))
      }
    }

    const loadTask = []
    for (let i = 0; i < Math.ceil(imageList.length / 8); i++) {
      loadTask.push(new Promise((resolve, reject) => {
        Promise.all(imageList.splice(i * 8, 8)).then(res => {
          resolve(res)
        }).catch(res => {
          reject(res)
        })
      }))
    }
    Promise.all(loadTask).then(res => {
      let tempFileList = []
      for (let i = 0; i < res.length; i++) {
        tempFileList = tempFileList.concat(res[i])
      }
      console.log(tempFileList);
      this.setState({
        tempFileList,
      })
      return tempFileList
    }).then((tempFileList) => {
      this.startPainting({
        tempFileList
      })
    })
  };

  startPainting(data) {
    let tempFileList;
    if (this.state.tempFileList.length <= 0) {
      tempFileList = data.tempFileList
    } else {
      tempFileList = this.state.tempFileList;
    }
    const { painting: { views } } = this.props;
    console.log(views)
    for (let i = 0, imageIndex = 0; i < views.length; i++) {
      if (views[i].type === 'image') {
        try {
          console.log(tempFileList);
          this.drawImage({
            ...views[i],
            url: tempFileList[imageIndex]
          })
        } catch (e) {
          console.log(e);
        }
        imageIndex++
      } else if (views[i].type === 'text') {
        if (!this.ctx.measureText) {
          Taro.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。'
          })
          this.props.onGetImage({
            errMsg: 'canvasdrawer:version too low'
          })
          // this.triggerEvent('getImage', {errMsg: 'canvasdrawer:version too low'})
          return
        } else {
          this.drawText(views[i])
        }
      } else if (views[i].type === 'rect') {
        this.drawRect(views[i])
      }
    }
    this.ctx.draw(false, () => {
      console.log('this.ctx.draw');
      Taro.setStorageSync('canvasdrawer_pic_cache', this.cache)
      const system = Taro.getSystemInfoSync().system
      if (/ios/i.test(system)) {
        this.saveImageToLocal()
      } else {
        // 延迟保存图片，解决安卓生成图片错位bug。
        setTimeout(() => {
          this.saveImageToLocal()
        }, 800)
      }
    })
  };

  drawImage(params) {
    this.ctx.save()
    const {
      url,
      top = 0,
      left = 0,
      width = 0,
      height = 0,
      borderRadius = 0,
      deg = 0,
    } = params
    // if (borderRadius) {
    //   this.ctx.beginPath()
    //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
    //   this.ctx.clip()
    //   this.ctx.drawImage(url, left, top, width, height)
    // } else {
    if (deg !== 0) {
      this.ctx.translate(left + width / 2, top + height / 2)
      this.ctx.rotate(deg * Math.PI / 180)
      this.ctx.drawImage(url, -width / 2, -height / 2, width, height)
    } else {
      try {
        console.log(params)
        console.log(url)
        this.ctx.drawImage(url, left, top, width, height)
      } catch (err) {
        console.log(err);
      }
    }
    // }
    this.ctx.restore()
  };

  drawText(params) {
    this.ctx.save()
    const {
      MaxLineNumber = 2,
      breakWord = false,
      color = 'black',
      content = '',
      fontSize = 16,
      top = 0,
      left = 0,
      lineHeight = 20,
      textAlign = 'left',
      width,
      bolder = false,
      textDecoration = 'none'
    } = params

    this.ctx.beginPath()
    this.ctx.setTextBaseline('top')
    this.ctx.setTextAlign(textAlign)
    this.ctx.setFillStyle(color)
    this.ctx.setFontSize(fontSize)

    if (!breakWord) {
      this.ctx.fillText(content, left, top)
      this.drawTextLine(left, top, textDecoration, color, fontSize, content)
    } else {
      let fillText = ''
      let fillTop = top
      let lineNum = 1
      for (let i = 0; i < content.length; i++) {
        fillText += [content[i]]
        if (this.ctx.measureText(fillText).width > width) {
          if (lineNum === MaxLineNumber) {
            if (i !== content.length) {
              fillText = fillText.substring(0, fillText.length - 1) + '...'
              this.ctx.fillText(fillText, left, fillTop)
              this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
              fillText = ''
              break
            }
          }
          this.ctx.fillText(fillText, left, fillTop)
          this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
          fillText = ''
          fillTop += lineHeight
          lineNum++
        }
      }
      this.ctx.fillText(fillText, left, fillTop)
      this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
    }

    this.ctx.restore()

    if (bolder) {
      this.drawText({
        ...params,
        left: left + 0.3,
        top: top + 0.3,
        bolder: false,
        textDecoration: 'none'
      })
    }
  };

  drawTextLine(left, top, textDecoration, color, fontSize, content) {
    if (textDecoration === 'underline') {
      this.drawRect({
        background: color,
        top: top + fontSize * 1.2,
        left: left - 1,
        width: this.ctx.measureText(content).width + 3,
        height: 1
      })
    } else if (textDecoration === 'line-through') {
      this.drawRect({
        background: color,
        top: top + fontSize * 0.6,
        left: left - 1,
        width: this.ctx.measureText(content).width + 3,
        height: 1
      })
    }
  };

  drawRect(params) {
    this.ctx.save()
    const { background, top = 0, left = 0, width = 0, height = 0 } = params
    this.ctx.setFillStyle(background)
    this.ctx.fillRect(left, top, width, height)
    this.ctx.restore()
  };

  getImageInfo(url) {
    return new Promise((resolve, reject) => {
      if (this.cache[url]) {
        resolve(this.cache[url])
      } else {
        const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
        if (objExp.test(url)) {
          Taro.getImageInfo({
            src: url,
            complete: res => {
              if (res.errMsg === 'getImageInfo:ok') {
                this.cache[url] = res.path
                resolve(res.path)
              } else {
                this.props.onGetImage({
                  errMsg: 'canvasdrawer:download fail'
                })
                // this.triggerEvent('getImage', {errMsg: 'canvasdrawer:download fail'})
                reject(new Error('getImageInfo fail'))
              }
            }
          })
        } else {
          this.cache[url] = url
          resolve(url)
        }
      }
    })
  };

  saveImageToLocal() {
    const { width, height } = this.state;
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width,
      height,
      canvasId: 'canvasdrawer',
      complete: res => {
        console.log(res);
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          this.setState({
            showCanvas: false,
            isPainting: false,
            tempFileList: []
          })
          this.props.onGetImage({
            tempFilePath: res.tempFilePath,
            errMsg: 'canvasdrawer:ok'
          })
          // this.triggerEvent('getImage', {tempFilePath: res.tempFilePath, errMsg: 'canvasdrawer:ok'})
        } else {
          this.props.onGetImage({
            errMsg: 'canvasdrawer:fail'
          })
          // this.triggerEvent('getImage', {errMsg: 'canvasdrawer:fail'})
        }
      }
    }, this.$scope)
  }

  render() {
    const { showCanvas, width, height } = this.state;
    if (showCanvas) {
      return (
        <Canvas canvas-id='canvasdrawer'
          style={`width:${width}px; height:${height}px;`}
          className='board'
        >
        </Canvas >
      )
    }
  }
}

