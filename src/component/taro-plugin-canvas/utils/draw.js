/**
  * @description 绘制圆角矩形
  * @param { object } drawData - 绘制数据
  * @param { number } drawData.x - 左上角x坐标
  * @param { number } drawData.y - 左上角y坐标
  * @param { number } drawData.w - 矩形的宽
  * @param { number } drawData.h - 矩形的高
  * @param { number } drawData.r - 圆角半径
  *
  * @param { object } ctx - ctx对象
  * @param { function } toPx - toPx方法
  */
export function _drawRadiusRect(drawData, ctx, toPx) {
  const { x, y, w, h, r } = drawData;
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
  * @param { object } ctx - ctx对象
  * @param { function } toPx - toPx方法
  * @param { function } toRpx - toRpx方法
  */
export function _getTextWidth(text, ctx, toPx, toRpx) {
  let texts = [];
  if (Object.prototype.toString.call(text) === '[object Object]') {
    texts.push(text);
  } else {
    texts = text;
  }
  let width = 0;
  // eslint-disable-next-line no-shadow
  texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
    ctx.setFontSize(toPx(fontSize));
    width += ctx.measureText(text).width + marginLeft + marginRight;
  })
  return toRpx(width);
}


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
  export function _drawSingleText ({ x, y, fontSize, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none',
    width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = "sans-serif" }, ctx, toPx,toRpx) {
    ctx.save();
    ctx.beginPath();
    ctx.font = fontStyle + " " + fontWeight + " " + toPx(fontSize, true) + "px " + fontFamily
    ctx.setGlobalAlpha(opacity);
    // ctx.setFontSize(toPx(fontSize));
    ctx.setFillStyle(color);
    ctx.setTextBaseline(baseLine);
    ctx.setTextAlign(textAlign);
    let textWidth = toRpx(ctx.measureText(text).width);
    const textArr = [];
    if (textWidth > width) {
      // 文本宽度 大于 渲染宽度
      let fillText = '';
      let line = 1;
      for (let i = 0; i <= text.length - 1; i++) {  // 将文字转为数组，一行文字一个元素
        fillText = fillText + text[i];
        if (toRpx(ctx.measureText(fillText).width) >= width) {
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
      ctx.fillText(item, toPx(x), toPx(y + (lineHeight || fontSize) * index));
    })

    ctx.restore();

    // textDecoration
    if (textDecoration !== 'none') {
      let lineY = y;
      if (textDecoration === 'line-through') {
        // 目前只支持贯穿线
        lineY = y;
      }
      ctx.save();
      ctx.moveTo(toPx(x), toPx(lineY));
      ctx.lineTo(toPx(x) + toPx(textWidth), toPx(lineY));
      ctx.setStrokeStyle(color);
      ctx.stroke();
      ctx.restore();
    }

    return textWidth;
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
export function drawText(params) {
  const { x, y, fontSize, color, baseLine, textAlign, text, opacity = 1, width, lineNum, lineHeight } = params;
  if (Object.prototype.toString.call(text) === '[object Array]') {
    let preText = { x, y, baseLine };
    text.forEach(item => {
      preText.x += item.marginLeft || 0;
      const textWidth = _drawSingleText(Object.assign(item, {
        ...preText,
      }));
      preText.x += textWidth + (item.marginRight || 0); // 下一段字的x轴为上一段字x + 上一段字宽度
    })
  } else {
    _drawSingleText(params);
  }
}


 /**
   * 渲染图片
   */
  export function  drawImage(data,ctx,toPx, toRpx) {
    const { imgPath, x, y, w, h, sx, sy, sw, sh, borderRadius = 0, borderWidth = 0, borderColor } = data;
    ctx.save();
    if (borderRadius > 0) {
      let drawData = {
        x, y, w, h,
        r: borderRadius
      };
      _drawRadiusRect(drawData,ctx,toPx);
      ctx.clip();
      ctx.drawImage(imgPath, toPx(sx), toPx(sy), toPx(sw), toPx(sh), toPx(x), toPx(y), toPx(w), toPx(h));
      if (borderWidth > 0) {
        ctx.setStrokeStyle(borderColor);
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
   * @param  {} {startX
   * @param  {} startY
   * @param  {} endX
   * @param  {} endY
   * @param  {} color
   * @param  {} width}
   */
  export function drawLine ({ startX, startY, endX, endY, color, width },ctx ,toPx,toRpx){
    ctx.save();
    ctx.beginPath();
    ctx.setStrokeStyle(color);
    ctx.setLineWidth(toPx(width));
    ctx.moveTo(toPx(startX), toPx(startY));
    ctx.lineTo(toPx(endX), toPx(endY));
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
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
  export function  drawBlock({ text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1 },ctx,toPx,toRpx) {
    // 判断是否块内有文字
    let blockWidth = 0; // 块的宽度
    let textX = 0;
    let textY = 0;
    if (typeof text !== 'undefined') {
      // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
      const textWidth = _getTextWidth(typeof text.text === 'string' ? text : text.text,ctx, toPx, toRpx);
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
      ctx.save();
      ctx.setGlobalAlpha(opacity);
      ctx.setFillStyle(backgroundColor);
      if (borderRadius > 0) {
        // 画圆角矩形
        let drawData ={
          x, y, w:blockWidth, h:height, r:borderRadius
        };
        _drawRadiusRect(drawData,ctx,toPx);
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
      ctx.setStrokeStyle(borderColor);
      ctx.setLineWidth(toPx(borderWidth));
      if (borderRadius > 0) {
        // 画圆角矩形边框
        let drawData = {
          x, y, w:blockWidth, h:height, r:borderRadius,
        }
        _drawRadiusRect(drawData,ctx,toPx);
        ctx.stroke();
      } else {
        ctx.strokeRect(toPx(x), toPx(y), toPx(blockWidth), toPx(height));
      }
      ctx.restore();
    }

    if (text) {
      drawText(Object.assign(text, { x: textX, y: textY }))
    }
  }
