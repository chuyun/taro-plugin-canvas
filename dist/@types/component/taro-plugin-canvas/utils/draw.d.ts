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
export declare function _drawRadiusRect(drawData: IDrawRadiusRectData, drawOptions: IDrawOptions): void;
export declare function _getTextWidth(_text: IText | IText[], drawOptions: IDrawOptions): number;
interface IDrawSingleTextData extends IText {
}
export declare function _drawSingleText(drawData: IDrawSingleTextData, drawOptions: IDrawOptions): number;
export declare function drawText(params: IText, drawOptions: IDrawOptions): void;
export interface IDrawImageData extends IIMage {
    imgPath: string;
    w: number;
    h: number;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
}
export declare function drawImage(data: IDrawImageData, drawOptions: IDrawOptions): void;
export declare function drawLine(drawData: ILine, drawOptions: IDrawOptions): void;
export declare function drawBlock(blockData: IBlock, drawOptions: IDrawOptions): void;
export {};
