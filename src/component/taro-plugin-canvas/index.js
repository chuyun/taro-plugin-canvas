import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { Canvas } from '@tarojs/components';
import { randomString, getHeight, downloadImageAndInfo } from './utils/tools';
import { _drawRadiusRect, _getTextWidth } from './utils/draw';
import './index.css';

let count = 1;
export default class CanvasDrawer extends Component {
  static defaultProps = {};
  static propTypes = {
    config: PropTypes.object.isRequired,
    onCreateSuccess: PropTypes.func.isRequired,
    onCreateFail: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      pxWidth: 0,
      pxHeight: 0,
      debug: false,
      factor: 0,
    }
    this.canvasId = randomString(10);
    this.ctx = null;
    this.cache = {};
    this.drawArr = [];
  }

  componentWillMount() {
    const { config } = this.props;
    const height = getHeight(config);
    this.initCanvas(config.width, height, config.debug);
  }

  componentDidMount() {
    const sysInfo = Taro.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    this.setState({
      factor: screenWidth / 750
    })
    this.onCreate();
  }

  componentWillUnmount() { }

  /**
   * @description rpx => px 基础方法
   * @param { number } rpx - 需要转换的数值
   * @param { boolean} int - 是否为 int
   * @param { number } [factor = this.state.factor] - 转化因子
   * @returns { number }
   */
  toPx = (rpx, int, factor = this.state.factor) => {
    if (int) {
      return parseInt(rpx * factor);
    }
    return rpx * factor;
  }
  /**
   * @description px => rpx
   * @param { number } px - 需要转换的数值
   * @param { boolean} int - 是否为 int
   * @param { number } [factor = this.state.factor] - 转化因子
   * @returns { number }
   */
  toRpx = (px, int, factor = this.state.factor) => {
    if (int) {
      return parseInt(px / factor);
    }
    return px / factor;
  }
  /**
   * @description 绘制圆角矩形
   * @param { number } x - 左上角x坐标
   * @param { number } y - 左上角y坐标
   * @param { number } w - 矩形的宽
   * @param { number } h - 矩形的高
   * @param { number } r - 圆角半径
   */
  // _drawRadiusRect = (x, y, w, h, r ) => {
  //   // const { x, y, w, h, r } = drawData;
  //   const br = r / 2;
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(this.toPx(x + br), this.toPx(y));    // 移动到左上角的点
  //   this.ctx.lineTo(this.toPx(x + w - br), this.toPx(y));
  //   this.ctx.arc(this.toPx(x + w - br), this.toPx(y + br), this.toPx(br), 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4))
  //   this.ctx.lineTo(this.toPx(x + w), this.toPx(y + h - br));
  //   this.ctx.arc(this.toPx(x + w - br), this.toPx(y + h - br), this.toPx(br), 0, 2 * Math.PI * (1 / 4))
  //   this.ctx.lineTo(this.toPx(x + br), this.toPx(y + h));
  //   this.ctx.arc(this.toPx(x + br), this.toPx(y + h - br), this.toPx(br), 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4))
  //   this.ctx.lineTo(this.toPx(x), this.toPx(y + br));
  //   this.ctx.arc(this.toPx(x + br), this.toPx(y + br), this.toPx(br), 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4))
  // }
  /**
   * @description 计算文本长度
   * @param {Array|Object}} text 数组 或者 对象
   */
  // _getTextWidth = (text) => {
  //   let texts = [];
  //   if (Object.prototype.toString.call(text) === '[object Object]') {
  //     texts.push(text);
  //   } else {
  //     texts = text;
  //   }
  //   let width = 0;
  //   texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
  //     this.ctx.setFontSize(this.toPx(fontSize));
  //     width += this.ctx.measureText(text).width + marginLeft + marginRight;
  //   })

  //   return this.toRpx(width);
  // }


  /**
   * @description 渲染一段文字
   * @param  {} {x
   * @param  {} y
   * @param  {} fontSize
   * @param  {} color
   * @param  {} baseLine
   * @param  {} textAlign='left'
   * @param  {} text
   * @param  {} opacity=1
   * @param  {} textDecoration='none'
   * @param  {} width
   * @param  {} lineNum=1
   * @param  {} lineHeight=0
   * @param  {} fontWeight='normal'
   * @param  {} fontStyle='normal'
   * @param  {} fontFamily="sans-serif"}
   */
  _drawSingleText = ({ x, y, fontSize, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none',
    width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = "sans-serif" }) => {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.font = fontStyle + " " + fontWeight + " " + this.toPx(fontSize, true) + "px " + fontFamily
    this.ctx.setGlobalAlpha(opacity);
    // this.ctx.setFontSize(this.toPx(fontSize));
    this.ctx.setFillStyle(color);
    this.ctx.setTextBaseline(baseLine);
    this.ctx.setTextAlign(textAlign);
    let textWidth = this.toRpx(this.ctx.measureText(text).width);
    const textArr = [];
    if (textWidth > width) {
      // 文本宽度 大于 渲染宽度
      let fillText = '';
      let line = 1;
      for (let i = 0; i <= text.length - 1; i++) {  // 将文字转为数组，一行文字一个元素
        fillText = fillText + text[i];
        if (this.toRpx(this.ctx.measureText(fillText).width) >= width) {
          if (line === lineNum) {
            if (i !== text.length - 1) {
              fillText = fillText.substring(0, fillText.length - 1) + '...';
            }
          }
          if (line <= lineNum) {
            textArr.push(fillText);
          }
          fillText = '';
          line++;
        } else {
          if (line <= lineNum) {
            if (i === text.length - 1) {
              textArr.push(fillText);
            }
          }
        }
      }
      textWidth = width;
    } else {
      textArr.push(text);
    }

    textArr.forEach((item, index) => {
      this.ctx.fillText(item, this.toPx(x), this.toPx(y + (lineHeight || fontSize) * index));
    })

    this.ctx.restore();

    // textDecoration
    if (textDecoration !== 'none') {
      let lineY = y;
      if (textDecoration === 'line-through') {
        // 目前只支持贯穿线
        lineY = y;
      }
      this.ctx.save();
      this.ctx.moveTo(this.toPx(x), this.toPx(lineY));
      this.ctx.lineTo(this.toPx(x) + this.toPx(textWidth), this.toPx(lineY));
      this.ctx.setStrokeStyle(color);
      this.ctx.stroke();
      this.ctx.restore();
    }

    return textWidth;
  }

  /**
   * @description 渲染块
   * @param  {} {text
   * @param  {} width=0
   * @param  {} height
   * @param  {} x
   * @param  {} y
   * @param  {} paddingLeft=0
   * @param  {} paddingRight=0
   * @param  {} borderWidth
   * @param  {} backgroundColor
   * @param  {} borderColor
   * @param  {} borderRadius=0
   * @param  {} opacity=1}
   */
  drawBlock = ({ text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1 }) => {
    // 判断是否块内有文字
    let blockWidth = 0; // 块的宽度
    let textX = 0;
    let textY = 0;
    if (typeof text !== 'undefined') {
      // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
      const textWidth = _getTextWidth(typeof text.text === 'string' ? text : text.text,this.ctx, this.toPx, this.toRpx);
      blockWidth = textWidth > width ? textWidth : width;
      blockWidth += paddingLeft + paddingLeft;

      const { textAlign = 'left', text: textCon } = text;
      textY = height / 2 + y; // 文字的y轴坐标在块中线
      if (textAlign === 'left') {
        // 如果是右对齐，那x轴在块的最左边
        textX = x + paddingLeft;
      } else if (textAlign === 'center') {
        textX = blockWidth / 2 + x;
      } else {
        textX = x + blockWidth - paddingRight;
      }
    } else {
      blockWidth = width;
    }

    if (backgroundColor) {
      // 画面
      this.ctx.save();
      this.ctx.setGlobalAlpha(opacity);
      this.ctx.setFillStyle(backgroundColor);
      if (borderRadius > 0) {
        // 画圆角矩形
        let drawData ={
          x, y, w:blockWidth, h:height, r:borderRadius
        };
        _drawRadiusRect(drawData,this.ctx,this.toPx);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height));
      }
      this.ctx.restore();
    }
    if (borderWidth) {
      // 画线
      this.ctx.save();
      this.ctx.setGlobalAlpha(opacity);
      this.ctx.setStrokeStyle(borderColor);
      this.ctx.setLineWidth(this.toPx(borderWidth));
      if (borderRadius > 0) {
        // 画圆角矩形边框
        let drawData = {
          x, y, w:blockWidth, h:height, r:borderRadius,
        }
        _drawRadiusRect(drawData,this.ctx,this.toPx);
        this.ctx.stroke();
      } else {
        this.ctx.strokeRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height));
      }
      this.ctx.restore();
    }

    if (text) {
      this.drawText(Object.assign(text, { x: textX, y: textY }))
    }
  }

  /**
   * 渲染文字
   * @param {Object} params
   */
  /**
   * @param  {} params
   * @param  {} params.y
   * @param  {} params.fontSize
   * @param  {} params.color
   * @param  {} params.baseLine
   * @param  {} params.textAlign
   * @param  {} params.text
   * @param  {} params.opacity=1
   * @param  {} params.width
   * @param  {} params.lineNum
   */
  drawText = (params) => {
    const { x, y, fontSize, color, baseLine, textAlign, text, opacity = 1, width, lineNum, lineHeight } = params;
    if (Object.prototype.toString.call(text) === '[object Array]') {
      let preText = { x, y, baseLine };
      text.forEach(item => {
        preText.x += item.marginLeft || 0;
        const textWidth = this._drawSingleText(Object.assign(item, {
          ...preText,
        }));
        preText.x += textWidth + (item.marginRight || 0); // 下一段字的x轴为上一段字x + 上一段字宽度
      })
    } else {
      this._drawSingleText(params);
    }
  }

  /**
   * 渲染图片
   */
  drawImage = (data) => {
    const { imgPath, x, y, w, h, sx, sy, sw, sh, borderRadius = 0, borderWidth = 0, borderColor } = data;
    this.ctx.save();
    if (borderRadius > 0) {
      let drawData = {
        x, y, w, h,
        r: borderRadius
      };
      _drawRadiusRect(drawData,this.ctx,this.toPx);
      this.ctx.clip();
      this.ctx.drawImage(imgPath, this.toPx(sx), this.toPx(sy), this.toPx(sw), this.toPx(sh), this.toPx(x), this.toPx(y), this.toPx(w), this.toPx(h));
      if (borderWidth > 0) {
        this.ctx.setStrokeStyle(borderColor);
        this.ctx.setLineWidth(this.toPx(borderWidth));
        this.ctx.stroke();
      }
    } else {
      this.ctx.drawImage(imgPath, this.toPx(sx), this.toPx(sy), this.toPx(sw), this.toPx(sh), this.toPx(x), this.toPx(y), this.toPx(w), this.toPx(h));
    }
    this.ctx.restore();
  }

  /**
   * @description 渲染线
   * @param  {} {startX
   * @param  {} startY
   * @param  {} endX
   * @param  {} endY
   * @param  {} color
   * @param  {} width}
   */
  drawLine = ({ startX, startY, endX, endY, color, width }) => {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.setStrokeStyle(color);
    this.ctx.setLineWidth(this.toPx(width));
    this.ctx.moveTo(this.toPx(startX), this.toPx(startY));
    this.ctx.lineTo(this.toPx(endX), this.toPx(endY));
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   * @description 下载图片并获取图片信息
   * @param  {} image
   * @param  {} index
   */
  _downloadImageAndInfo = (image, index) => {
    return new Promise((resolve, reject) => {
      downloadImageAndInfo(image, index, this.toRpx)
      .then(
        (result) => {
          this.drawArr.push(result);
          resolve();
        }
      )
      .catch(err => {
        console.log(err);
        reject(err)
      });
    })
  }
  /**
   * @param  {} images=[]
   */
  downloadResource = (images = []) => {
    const drawList = [];
    let imagesTemp = images;

    imagesTemp.forEach((image, index) => drawList.push(this._downloadImageAndInfo(image, index)));

    return Promise.all(drawList);
  }

  /**
   * @param
   */
  downloadResourceTransit = () => {
    const { config } = this.props;
    return new Promise((resolve, reject) => {
      if (config.images && config.images.length > 0) {
        this.downloadResource(config.images || [])
          .then(() => {
            resolve();
          })
          .catch((e) => {
            console.log(e);
            reject(e)
          });
      } else {
        setTimeout(()=>{
          resolve(1);
        }, 500)
      }
    })
  }

  /**
   * @param  {} w
   * @param  {} h
   * @param  {} debug
   */
  initCanvas = (w, h, debug) => {
    return new Promise((resolve) => {
      this.setState({
        pxWidth: this.toPx(w),
        pxHeight: this.toPx(h),
        debug,
      }, resolve);
    });
  }
  /**
   * @param  { boolean }
   */
  onCreate = () => {
    const { onCreateFail, config } = this.props;
    Taro.showLoading({ mask: true, title: '生成中...' });
      return this.downloadResourceTransit()
      .then(() => {
        this.create(config);
      })
      .catch((err) => {
        Taro.hideLoading();
        Taro.showToast({ icon: 'none', title: err.errMsg || '下载图片失败' });
        console.error(err);
        if (!onCreateFail) {
          console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail');
        }
        onCreateFail && onCreateFail(err);
      })
  }

  /**
   * @param  { object } config
   */
  create = (config) => {
    this.ctx = Taro.createCanvasContext(this.canvasId, this.$scope);
    const height = getHeight(config);
    this.initCanvas(config.width, height, config.debug)
      .then(() => {
        // 设置画布底色
        if (config.backgroundColor) {
          this.ctx.save();
          this.ctx.setFillStyle(config.backgroundColor);
          this.ctx.fillRect(0, 0, this.toPx(config.width), this.toPx(height));
          this.ctx.restore();
        }
        const { texts = [], images = [], blocks = [], lines = [] } = config;
        const queue = this.drawArr
          .concat(texts.map((item) => {
            item.type = 'text';
            item.zIndex = item.zIndex || 0;
            return item;
          }))
          .concat(blocks.map((item) => {
            item.type = 'block';
            item.zIndex = item.zIndex || 0;
            return item;
          }))
          .concat(lines.map((item) => {
            item.type = 'line';
            item.zIndex = item.zIndex || 0;
            return item;
          }));
        // 按照顺序排序
        queue.sort((a, b) => a.zIndex - b.zIndex);

        queue.forEach((item) => {
          if (item.type === 'image') {
            this.drawImage(item)
          } else if (item.type === 'text') {
            this.drawText(item)
          } else if (item.type === 'block') {
            this.drawBlock(item)
          } else if (item.type === 'line') {
            this.drawLine(item)
          }
        });

        const res = Taro.getSystemInfoSync();
        const platform = res.platform;
        let time = 0;
        if (platform === 'android') {
          // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
          time = 300;
        }
        this.ctx.draw(false, () => {
          setTimeout(() => {
            this.getTempFile();
          }, time);
        });
      })
      .catch((err) => {
        Taro.showToast({ icon: 'none', title: err.errMsg || '生成失败' });
        console.error(err);
      });
  }

  getTempFile = (otherOptions) => {
    const { onCreateSuccess, onCreateFail } = this.props;
    Taro.canvasToTempFilePath({
      canvasId: this.canvasId,
      success: (result) => {
        if (!onCreateSuccess) {
          console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateSuccess 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#success');
        }
        onCreateSuccess && onCreateSuccess(result);
      },
      fail: (error) => {
        const { errMsg } = error;
        console.log(errMsg)
        if (errMsg === 'canvasToTempFilePath:fail:create bitmap failed') {
          count += 1;
          if (count <= 3) {
            this.getTempFile(otherOptions);
          } else {
            if (!onCreateFail) {
              console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail');
            }
            onCreateFail && onCreateFail(error);
          }
        }
      },
    }, this.$scope);
  }

  render() {
    const { pxWidth, pxHeight, debug } = this.state;
    if(pxWidth && pxHeight){
      return (
        <Canvas
          canvas-id={this.canvasId}
          style={`width:${pxWidth}px; height:${pxHeight}px;`}
          className={`${debug ? 'debug' : 'pro'} canvas`}
        />
      );
    }
    return null;
  }
}

