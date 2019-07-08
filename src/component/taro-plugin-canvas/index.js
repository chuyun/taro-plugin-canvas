import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { Canvas } from '@tarojs/components';
import { randomString, getHeight, downloadImageAndInfo } from './utils/tools';
import {
  drawImage,
  drawText,
  drawBlock,
  drawLine,
} from './utils/draw';
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
        setTimeout(() => {
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
        const {
          texts = [],
          // images = [],
          blocks = [],
          lines = [],
        } = config;
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
          let drawOptions = {
            ctx: this.ctx,
            toPx: this.toPx,
            toRpx: this.toRpx,
          }
          if (item.type === 'image') {
            drawImage(item, drawOptions)
          } else if (item.type === 'text') {
            drawText(item, drawOptions)
          } else if (item.type === 'block') {
            drawBlock(item, drawOptions)
          } else if (item.type === 'line') {
            drawLine(item, drawOptions)
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
    if (pxWidth && pxHeight) {
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

