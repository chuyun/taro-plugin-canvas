export function _drawRadiusRect(drawData, drawOptions) {
    const { x, y, w, h, r } = drawData;
    const { ctx, toPx, } = drawOptions;
    const br = r / 2;
    ctx.beginPath();
    ctx.moveTo(toPx(x + br), toPx(y));
    ctx.lineTo(toPx(x + w - br), toPx(y));
    ctx.arc(toPx(x + w - br), toPx(y + br), toPx(br), 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
    ctx.lineTo(toPx(x + w), toPx(y + h - br));
    ctx.arc(toPx(x + w - br), toPx(y + h - br), toPx(br), 0, 2 * Math.PI * (1 / 4));
    ctx.lineTo(toPx(x + br), toPx(y + h));
    ctx.arc(toPx(x + br), toPx(y + h - br), toPx(br), 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
    ctx.lineTo(toPx(x), toPx(y + br));
    ctx.arc(toPx(x + br), toPx(y + br), toPx(br), 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
}
export function _getTextWidth(_text, drawOptions) {
    const { ctx, toPx, toRpx } = drawOptions;
    let texts = [];
    if (Array.isArray(_text)) {
        texts = _text;
    }
    else {
        texts.push(_text);
    }
    let width = 0;
    texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
        ctx.setFontSize(toPx(fontSize));
        let _textWidth = 0;
        if (typeof text === 'object') {
            _textWidth = ctx.measureText(text.text).width + text.marginLeft + text.marginRight;
        }
        else {
            _textWidth = ctx.measureText(text).width;
        }
        width += _textWidth + marginLeft + marginRight;
    });
    return toRpx(width);
}
export function _drawSingleText(drawData, drawOptions) {
    const { x, y, fontSize, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none', width = 0, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = "sans-serif" } = drawData;
    const { ctx, toPx } = drawOptions;
    ctx.save();
    ctx.beginPath();
    ctx.font = fontStyle + " " + fontWeight + " " + toPx(fontSize, true) + "px " + fontFamily;
    ctx.setGlobalAlpha(opacity);
    color && ctx.setFillStyle(color);
    baseLine && ctx.setTextBaseline(baseLine);
    ctx.setTextAlign(textAlign);
    let textWidth = (ctx.measureText(text).width);
    const textArr = [];
    let drawWidth = toPx(width);
    if (width && textWidth > drawWidth) {
        let fillText = '';
        let line = 1;
        for (let i = 0; i <= text.length - 1; i++) {
            fillText = fillText + text[i];
            if ((ctx.measureText(fillText).width) >= drawWidth) {
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
            }
            else {
                if (line <= lineNum) {
                    if (i === text.length - 1) {
                        textArr.push(fillText);
                    }
                }
            }
        }
        textWidth = width;
    }
    else {
        textArr.push(text);
    }
    textArr.forEach((item, index) => {
        ctx.fillText(item, toPx(x), toPx(y + (lineHeight || fontSize) * index));
    });
    ctx.restore();
    if (textDecoration !== 'none') {
        let lineY = y;
        if (textDecoration === 'line-through') {
            lineY = y;
            let threshold = 5;
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
export function drawText(params, drawOptions) {
    const { x, y, text, baseLine, } = params;
    if (Array.isArray(text)) {
        let preText = { x, y, baseLine };
        text.forEach(item => {
            preText.x += item.marginLeft || 0;
            const textWidth = _drawSingleText(Object.assign(item, Object.assign({}, preText)), drawOptions);
            preText.x += textWidth + (item.marginRight || 0);
        });
    }
    else {
        _drawSingleText(params, drawOptions);
    }
}
export function drawImage(data, drawOptions) {
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
    }
    else {
        ctx.drawImage(imgPath, toPx(sx), toPx(sy), toPx(sw), toPx(sh), toPx(x), toPx(y), toPx(w), toPx(h));
    }
    ctx.restore();
}
export function drawLine(drawData, drawOptions) {
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
export function drawBlock(blockData, drawOptions) {
    const { ctx, toPx, } = drawOptions;
    const { text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1 } = blockData;
    let blockWidth = 0;
    let textX = 0;
    let textY = 0;
    if (typeof text !== 'undefined') {
        const textWidth = _getTextWidth(text, drawOptions);
        blockWidth = textWidth > width ? textWidth : width;
        blockWidth += paddingLeft + paddingLeft;
        const { textAlign = 'left', } = text;
        textY = height / 2 + y;
        if (textAlign === 'left') {
            textX = x + paddingLeft;
        }
        else if (textAlign === 'center') {
            textX = blockWidth / 2 + x;
        }
        else {
            textX = x + blockWidth - paddingRight;
        }
    }
    else {
        blockWidth = width;
    }
    if (backgroundColor) {
        ctx.save();
        ctx.setGlobalAlpha(opacity);
        ctx.setFillStyle(backgroundColor);
        if (borderRadius > 0) {
            let drawData = {
                x, y, w: blockWidth, h: height, r: borderRadius
            };
            _drawRadiusRect(drawData, drawOptions);
            ctx.fill();
        }
        else {
            ctx.fillRect(toPx(x), toPx(y), toPx(blockWidth), toPx(height));
        }
        ctx.restore();
    }
    if (borderWidth) {
        ctx.save();
        ctx.setGlobalAlpha(opacity);
        borderColor && ctx.setStrokeStyle(borderColor);
        ctx.setLineWidth(toPx(borderWidth));
        if (borderRadius > 0) {
            let drawData = {
                x, y, w: blockWidth, h: height, r: borderRadius,
            };
            _drawRadiusRect(drawData, drawOptions);
            ctx.stroke();
        }
        else {
            ctx.strokeRect(toPx(x), toPx(y), toPx(blockWidth), toPx(height));
        }
        ctx.restore();
    }
    if (text) {
        drawText(Object.assign(text, { x: textX, y: textY }), drawOptions);
    }
}
