import Taro from '@tarojs/taro';
export const randomString = (length) => {
    let str = Math.random().toString(36).substr(2);
    if (str.length >= length) {
        return str.substr(0, length);
    }
    str += randomString(length - str.length);
    return str;
};
export const getHeight = (config) => {
    const getTextHeight = (text) => {
        let fontHeight = text.lineHeight || text.fontSize;
        let height = 0;
        if (text.baseLine === 'top') {
            height = fontHeight;
        }
        else if (text.baseLine === 'middle') {
            height = fontHeight / 2;
        }
        else {
            height = 0;
        }
        return height;
    };
    const heightArr = [];
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
    }
    else {
        return config.height;
    }
};
export function mapHttpToHttps(rawUrl) {
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
export function downImage(imageUrl) {
    return new Promise((resolve, reject) => {
        if (/^http/.test(imageUrl) &&
            !new RegExp(wx.env.USER_DATA_PATH).test(imageUrl) &&
            !/^http:\/\/tmp/.test(imageUrl)) {
            Taro.downloadFile({
                url: (imageUrl),
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath);
                    }
                    else {
                        reject(res.errMsg);
                    }
                },
                fail(err) {
                    reject(err);
                },
            });
        }
        else {
            resolve(imageUrl);
        }
    });
}
export function getImageInfo(imgPath, index) {
    return new Promise((resolve, reject) => {
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
        });
    });
}
export function downloadImageAndInfo(image, index, toRpxFunc, pixelRatio) {
    return new Promise((resolve, reject) => {
        const { x, y, url, zIndex } = image;
        const imageUrl = url;
        downImage(imageUrl)
            .then(imgPath => getImageInfo(imgPath, index))
            .then(({ imgPath, imgInfo }) => {
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
            }
            else {
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
            };
            resolve(result);
        })
            .catch(err => {
            console.log(err);
            reject(err);
        });
    });
}
