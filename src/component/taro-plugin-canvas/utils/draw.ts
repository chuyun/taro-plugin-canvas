
import { CanvasContext } from "@tarojs/taro";
import { IText, IIMage, ILine, IBlock } from '../types';

export interface IDrawRadiusRectData {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export interface IDrawOptions {
  ctx: CanvasContext;
  toPx: (rpx: number, int?: boolean, factor?: number) => number;
  toRpx: (px: number, int?: boolean, factor?: number) => number;
}

/**
  * @description 绘制圆角矩形
  * @param { object } drawData - 绘制数据
  * @param { number } drawData.x - 左上角x坐标
  * @param { number } drawData.y - 左上角y坐标
  * @param { number } drawData.w - 矩形的宽
  * @param { number } drawData.h - 矩形的高
  * @param { number } drawData.r - 圆角半径
  */
export function _drawRadiusRect(drawData: IDrawRadiusRectData, drawOptions: IDrawOptions) {
  const { x, y, w, h, r } = drawData;
  const {
    ctx,
    toPx,
    // toRpx,
  } = drawOptions;
  const br = r / 2;
  ctx.beginPath();
  ctx.moveTo(toPx(x + br), toPx(y));    // 移动到左上角的点
  ctx.lineTo(toPx(x + w - br), toPx(y));
  ctx.arc(toPx(x + w - br), toPx(y + br), toPx(br), 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4))
  ctx.lineTo(toPx(x + w), toPx(y + h - br));
  ctx.arc(toPx(x + w - br), toPx(y + h - br), toPx(br), 0, 2 * Math.PI * (1 / 4))
  ctx.lineTo(toPx(x + br), toPx(y + h));
  ctx.arc(toPx(x + br), toPx(y + h - br), toPx(br), 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4))
  ctx.lineTo(toPx(x), toPx(y + br));
  ctx.arc(toPx(x + br), toPx(y + br), toPx(br), 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4))
}


/**
 * @description 计算文本长度
 * @param { Array | Object } text 数组 或者 对象
 */
export function _getTextWidth(_text: IText | IText[], drawOptions: IDrawOptions): number {
  const { ctx, toPx, toRpx } = drawOptions;
  let texts: IText[] = [];
  if (Array.isArray(_text)) {
    texts = _text;
  } else {
    texts.push(_text);
  }
  let width = 0;
  texts.forEach(({
    fontSize,
    text,
    marginLeft = 0,
    marginRight = 0
  }) => {
    ctx.setFontSize(toPx(fontSize));
    let _textWidth = 0;
    if (typeof text === 'object') {
      _textWidth = ctx.measureText(text.text).width + text.marginLeft + text.marginRight;
    } else {
      _textWidth = ctx.measureText(text).width;
    }
    width += _textWidth + marginLeft + marginRight;
  })
  return toRpx(width);
}


/**
  * @description 渲染一段文字
  * @param { object } drawData - 绘制数据
  * @param { number } drawData.x - x坐标 rpx
  * @param { number } drawData.y - y坐标 rpx
  * @param { number } drawData.fontSize - 文字大小 rpx
  * @param { number } [drawData.color] - 颜色
  * @param { string } [drawData.baseLine] - 基线对齐方式 top| middle|bottom
  * @param { string } [drawData.textAlign='left'] - 对齐方式 left|center|right
  * @param { string } drawData.text - 当Object类型时，参数为 text 字段的参数，marginLeft、marginRight这两个字段可用
  * @param { number } [drawData.opacity=1] - 1为不透明，0为透明
  * @param { string } [drawData.textDecoration='none']
  * @param { number } [drawData.width] - 文字宽度 没有指定为画布宽度
  * @param { number } [drawData.lineNum=1] - 根据宽度换行，最多的行数
  * @param { number } [drawData.lineHeight=0] - 行高
  * @param { string } [drawData.fontWeight='normal'] - 'bold' 加粗字体，目前小程序不支持 100 - 900 加粗
  * @param { string } [drawData.fontStyle='normal'] - 'italic' 倾斜字体
  * @param { string } [drawData.fontFamily="sans-serif"] - 小程序默认字体为 'sans-serif', 请输入小程序支持的字体
  */

interface IDrawSingleTextData extends IText {
}
export function _drawSingleText(drawData: IDrawSingleTextData, drawOptions: IDrawOptions) {
  let { x, y, fontSize, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none',
    width = 0, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = "sans-serif" } = drawData;
  const { ctx, toPx } = drawOptions;
  ctx.save();
  ctx.beginPath();
  ctx.font = fontStyle + " " + fontWeight + " " + toPx(fontSize, true) + "px " + fontFamily
  ctx.setGlobalAlpha(opacity);
  // ctx.setFontSize(toPx(fontSize));
  if (typeof text === 'object') {
    text = text.text
  }

  color && ctx.setFillStyle(color);
  baseLine && ctx.setTextBaseline(baseLine);
  ctx.setTextAlign(textAlign);
  let textWidth = (ctx.measureText(text as string).width);
  const textArr: string[] = [];
  let drawWidth = toPx(width);
  if (width && textWidth > drawWidth) {
    // 文本宽度 大于 渲染宽度
    let fillText = '';
    let line = 1;
    for (let i = 0; i <= (text as string).length - 1; i++) {  // 将文字转为数组，一行文字一个元素
      fillText = fillText + text[i];
      if ((ctx.measureText(fillText).width) >= drawWidth) {
        if (line === lineNum) {
          if (i !== (text as string).length - 1) {
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
          if (i === (text as string).length - 1) {
            textArr.push(fillText);
          }
        }
      }
    }
    textWidth = width;
  } else {
    textArr.push(text as string);
  }

  textArr.forEach((item, index) => {
    ctx.fillText(item, toPx(x), toPx(y + (lineHeight || fontSize) * index));
  })
  ctx.restore();
  // textDecoration
  if (textDecoration !== 'none') {
    let lineY = y;
    if (textDecoration === 'line-through') {
      // 目前只支持贯穿线
      lineY = y;
      // 小程序画布baseLine偏移阈值
      let threshold = 5;

      // 根据baseLine的不同对贯穿线的Y坐标做相应调整
      switch (baseLine) {
        case 'top':
          lineY += fontSize / 2 + threshold;
          break;
        case 'middle':
          break;
        case 'bottom':
          lineY -= fontSize / 2 + threshold;
          break;
        default:
          lineY -= fontSize / 2 - threshold;
          break;
      }
    }
    ctx.save();
    ctx.moveTo(toPx(x), toPx(lineY));
    ctx.lineTo(toPx(x) + toPx(textWidth), toPx(lineY));
    color && ctx.setStrokeStyle(color);
    ctx.stroke();
    ctx.restore();
  }
  return textWidth;
}

/**
 * 渲染文字
 * @param { object } params - 绘制数据
 * @param { number } params.x - x坐标 rpx
 * @param { number } params.y - y坐标 rpx
 * @param { number } params.fontSize - 文字大小 rpx
 * @param { number } [params.color] - 颜色
 * @param { string } [params.baseLine] - 基线对齐方式 top| middle|bottom
 * @param { string } [params.textAlign='left'] - 对齐方式 left|center|right
 * @param { string } params.text - 当Object类型时，参数为 text 字段的参数，marginLeft、marginRight这两个字段可用
 * @param { number } [params.opacity=1] - 1为不透明，0为透明
 * @param { string } [params.textDecoration='none']
 * @param { number } [params.width] - 文字宽度 没有指定为画布宽度
 * @param { number } [params.lineNum=1] - 根据宽度换行，最多的行数
 * @param { number } [params.lineHeight=0] - 行高
 * @param { string } [params.fontWeight='normal'] - 'bold' 加粗字体，目前小程序不支持 100 - 900 加粗
 * @param { string } [params.fontStyle='normal'] - 'italic' 倾斜字体
 * @param { string } [params.fontFamily="sans-serif"] - 小程序默认字体为 'sans-serif', 请输入小程序支持的字体
 */
export function drawText(params: IText, drawOptions: IDrawOptions) {
  // const { ctx, toPx, toRpx } = drawOptions;
  const {
    x,
    y, text, baseLine,
    // fontSize,
    // color,
    // textAlign,
    // opacity = 1,
    // width,
    // lineNum,
    // lineHeight
  } = params;
  if (Array.isArray(text)) {
    let preText = { x, y, baseLine };
    text.forEach(item => {
      preText.x += item.marginLeft || 0;
      const textWidth = _drawSingleText(Object.assign(item, {
        ...preText,
      }), drawOptions);
      preText.x += textWidth + (item.marginRight || 0); // 下一段字的 x 轴为上一段字 x + 上一段字宽度
    })
  } else {
    _drawSingleText(params, drawOptions);
  }
}

export interface IDrawImageData extends IIMage {
  imgPath: string;
  w: number;
  h: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/**
 * @description 渲染图片
 * @param { object } data
 * @param { number } x - 图像的左上角在目标 canvas 上 x 轴的位置
 * @param { number } y - 图像的左上角在目标 canvas 上 y 轴的位置
 * @param { number } w - 在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放
 * @param { number } h - 在目标画布上绘制图像的高度，允许对绘制的图像进行缩放
 * @param { number } sx - 源图像的矩形选择框的左上角 x 坐标
 * @param { number } sy - 源图像的矩形选择框的左上角 y 坐标
 * @param { number } sw - 源图像的矩形选择框的宽度
 * @param { number } sh - 源图像的矩形选择框的高度
 * @param { number } [borderRadius=0] - 圆角
 * @param { number } [borderWidth=0] - 边框
 */
export function drawImage(data: IDrawImageData, drawOptions: IDrawOptions) {
  const { ctx, toPx } = drawOptions;
  const { imgPath, x, y, w, h, sx, sy, sw, sh, borderRadius = 0, borderWidth = 0, borderColor } = data;
  ctx.save();
  if (borderRadius > 0) {
    let drawData = {
      x, y, w, h,
      r: borderRadius
    };
    _drawRadiusRect(drawData, drawOptions);
    ctx.strokeStyle = 'rgba(255,255,255,0)';
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(imgPath, toPx(sx), toPx(sy), toPx(sw), toPx(sh), toPx(x), toPx(y), toPx(w), toPx(h));
    if (borderWidth > 0) {
      borderColor && ctx.setStrokeStyle(borderColor);
      ctx.setLineWidth(toPx(borderWidth));
      ctx.stroke();
    }
  } else {
    ctx.drawImage(imgPath, toPx(sx), toPx(sy), toPx(sw), toPx(sh), toPx(x), toPx(y), toPx(w), toPx(h));
  }
  ctx.restore();
}

/**
 * @description 渲染线
 * @param  { number } startX - 起始坐标
 * @param  { number } startY - 起始坐标
 * @param  { number } endX - 终结坐标
 * @param  { number } endY - 终结坐标
 * @param  { number } width - 线的宽度
 * @param  { string } [color] - 线的颜色
 */
export function drawLine(drawData: ILine, drawOptions: IDrawOptions) {
  const { startX, startY, endX, endY, color, width } = drawData;
  const { ctx, toPx } = drawOptions;
  ctx.save();
  ctx.beginPath();
  color && ctx.setStrokeStyle(color);
  ctx.setLineWidth(toPx(width));
  ctx.moveTo(toPx(startX), toPx(startY));
  ctx.lineTo(toPx(endX), toPx(endY));
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

/**
* @description 渲染块
* @param  { number } x - x坐标
* @param  { number } y - y坐标
* @param  { number } height -高
* @param  { string|object } [text] - 块里面可以填充文字，参考texts字段
* @param  { number } [width=0] - 宽 如果内部有文字，由文字宽度和内边距决定
* @param  { number } [paddingLeft=0] - 内左边距
* @param  { number } [paddingRight=0] - 内右边距
* @param  { number } [borderWidth] - 边框宽度
* @param  { string } [backgroundColor] - 背景颜色
* @param  { string } [borderColor] - 边框颜色
* @param  { number } [borderRadius=0] - 圆角
* @param  { number } [opacity=1] - 透明度
*
*/
export function drawBlock(blockData: IBlock, drawOptions: IDrawOptions) {
  const { ctx, toPx, } = drawOptions;
  const { text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1 } = blockData;
  // 判断是否块内有文字
  let blockWidth = 0; // 块的宽度
  let textX = 0;
  let textY = 0;
  if (typeof text !== 'undefined') {
    // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
    // const textWidth = _getTextWidth(typeof text.text === 'string' ? text : text.text, drawOptions);
    const textWidth: number = _getTextWidth(text, drawOptions);
    blockWidth = textWidth > width ? textWidth : width;
    blockWidth += paddingLeft + paddingLeft;

    const {
      textAlign = 'left',
      // text: textCon,
    } = text;
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
    ctx.save();
    ctx.setGlobalAlpha(opacity);
    ctx.setFillStyle(backgroundColor);
    if (borderRadius > 0) {
      // 画圆角矩形
      let drawData = {
        x, y, w: blockWidth, h: height, r: borderRadius
      };
      _drawRadiusRect(drawData, drawOptions);
      ctx.fill();
    } else {
      ctx.fillRect(toPx(x), toPx(y), toPx(blockWidth), toPx(height));
    }
    ctx.restore();
  }
  if (borderWidth) {
    // 画线
    ctx.save();
    ctx.setGlobalAlpha(opacity);
    borderColor && ctx.setStrokeStyle(borderColor);
    ctx.setLineWidth(toPx(borderWidth));
    if (borderRadius > 0) {
      // 画圆角矩形边框
      let drawData = {
        x, y, w: blockWidth, h: height, r: borderRadius,
      }
      _drawRadiusRect(drawData, drawOptions);
      ctx.stroke();
    } else {
      ctx.strokeRect(toPx(x), toPx(y), toPx(blockWidth), toPx(height));
    }
    ctx.restore();
  }

  if (text) {
    drawText(Object.assign(text, { x: textX, y: textY }), drawOptions)
  }
}
