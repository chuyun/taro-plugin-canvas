import Taro from '@tarojs/taro';
import { IConfig } from '../types';
/**
 * @description 生成随机字符串
 * @param  { number } length - 字符串长度
 * @returns { string }
 */
export const randomString = (length: number) => {
  let str = Math.random().toString(36).substr(2);
  if (str.length >= length) {
    return str.substr(0, length);
  }
  str += randomString(length - str.length);
  return str;
}

/**
 * @description 获取最大高度
 * @param  {} config
 * @returns { number }
 */
export const getHeight = (config: IConfig) => {
  const getTextHeight = (text) => {
    let fontHeight = text.lineHeight || text.fontSize;
    let height = 0;
    if (text.baseLine === 'top') {
      height = fontHeight;
    } else if (text.baseLine === 'middle') {
      height = fontHeight / 2;
    } else {
      height = 0;
    }
    return height;
  }
  const heightArr: number[] = [];
  (config.blocks || []).forEach((item) => {
    heightArr.push(item.y + item.height);
  });
  (config.texts || []).forEach((item) => {
    let height;
    height = getTextHeight(item);
    heightArr.push(item.y + height);
  });
  (config.images || []).forEach((item) => {
    heightArr.push(item.y + item.height);
  });
  (config.lines || []).forEach((item) => {
    heightArr.push(item.startY);
    heightArr.push(item.endY);
  });
  const sortRes = heightArr.sort((a, b) => b - a);
  let canvasHeight = 0;
  if (sortRes.length > 0) {
    canvasHeight = sortRes[0];
  }
  if (config.height < canvasHeight || !config.height) {
    return canvasHeight;
  } else {
    return config.height;
  }
}


/**
 * 将http转为https
 * @param {String}} rawUrl 图片资源url
 * @returns { string }
 */
export function mapHttpToHttps(rawUrl: string) {
  if (rawUrl.indexOf(':') < 0) {
    return rawUrl;
  }
  const urlComponent = rawUrl.split(':');
  if (urlComponent.length === 2) {
    if (urlComponent[0] === 'http') {
      urlComponent[0] = 'https';
      return `${urlComponent[0]}:${urlComponent[1]}`;
    }
  }
  return rawUrl;
}

/**
 * 下载图片资源
 * @param { string } imageUrl
 * @returns  { Promise }
 */
export function downImage(imageUrl: string) {
  return new Promise<string>((resolve, reject) => {
    // if (/^http/.test(imageUrl) && !new RegExp(wx.env.USER_DATA_PATH).test(imageUrl))
    if (
      /^http/.test(imageUrl) &&
      // @ts-ignore
      !new RegExp((wx as any).env.USER_DATA_PATH).test(imageUrl) &&
      !/^http:\/\/tmp/.test(imageUrl)
    ) {
      Taro.downloadFile({
        url: (imageUrl),
        // TODO
        // url: mapHttpToHttps(imageUrl),
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            reject(res.errMsg);
          }
        },
        fail(err) {
          reject(err);
        },
      });
    } else {
      // 支持本地地址
      resolve(imageUrl);
    }
  });
}

export interface IMageInfo {
  imgPath: string;
  imgInfo: any;
  index: number | string;
}


/**
 * 获取图片信息
 * @param {*} imgPath
 * @param {*} index
 * @returns  { Promise }
 */
export function getImageInfo(imgPath: string, index: string) {
  return new Promise<IMageInfo>((resolve, reject) => {
    Taro.getImageInfo({
      src: imgPath
    })
      .then(res => {
        resolve({
          imgPath,
          imgInfo: res,
          index
        });
      })
      .catch(err => {
        reject(err);
      })
  });
}

/**
* @description 下载图片并获取图片信息
* @param  {} image
* @param  {} index
* @returns  { Promise }
*/
export function downloadImageAndInfo(image, index, toRpxFunc, pixelRatio) {
  return new Promise<any>((resolve, reject) => {
    const { x, y, url, zIndex } = image;
    const imageUrl = url;
    // 下载图片
    downImage(imageUrl)
      // 获取图片信息
      .then(imgPath => getImageInfo(imgPath, index))
      .then(({ imgPath, imgInfo }) => {
        // 根据画布的宽高计算出图片绘制的大小，这里会保证图片绘制不变形
        let sx;
        let sy;
        const borderRadius = image.borderRadius || 0;
        const setWidth = image.width;
        const setHeight = image.height;
        const width = toRpxFunc(imgInfo.width / pixelRatio);
        const height = toRpxFunc(imgInfo.height / pixelRatio);

        if (width / height <= setWidth / setHeight) {
          sx = 0;
          sy = (height - ((width / setWidth) * setHeight)) / 2;
        } else {
          sy = 0;
          sx = (width - ((height / setHeight) * setWidth)) / 2;
        }
        let result = {
          type: 'image',
          borderRadius,
          borderWidth: image.borderWidth,
          borderColor: image.borderColor,
          zIndex: typeof zIndex !== 'undefined' ? zIndex : index,
          imgPath,
          sx,
          sy,
          sw: (width - (sx * 2)),
          sh: (height - (sy * 2)),
          x,
          y,
          w: setWidth,
          h: setHeight,
        }
        resolve(result);
      })
      .catch(err => {
        console.log(err);
        reject(err)
      });
  });
}
