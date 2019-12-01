import { IConfig } from '../types';
export declare const randomString: (length: number) => string;
export declare const getHeight: (config: IConfig) => number;
export declare function mapHttpToHttps(rawUrl: string): string;
export declare function downImage(imageUrl: string): Promise<string>;
export interface IMageInfo {
    imgPath: string;
    imgInfo: any;
    index: number | string;
}
export declare function getImageInfo(imgPath: string, index: string): Promise<IMageInfo>;
export declare function downloadImageAndInfo(image: any, index: any, toRpxFunc: any, pixelRatio: any): Promise<any>;
