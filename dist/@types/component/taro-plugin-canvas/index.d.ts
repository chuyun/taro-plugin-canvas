/// <reference types="react" />
import { Component, CanvasContext } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { IConfig, IIMage } from './types';
import './index.css';
interface ICanvasDrawerProps {
    config: IConfig;
    onCreateSuccess: (res: any) => void;
    onCreateFail: (err: Error) => void;
}
interface ICanvasDrawerState {
    pxWidth: number;
    pxHeight: number;
    debug: boolean;
    factor: number;
    pixelRatio: number;
}
export default class CanvasDrawer extends Component<ICanvasDrawerProps, ICanvasDrawerState> {
    cache: any;
    drawArr: any[];
    canvasId: string;
    ctx: CanvasContext | null;
    static propTypes: {
        config: PropTypes.Validator<object>;
        onCreateSuccess: PropTypes.Validator<(...args: any[]) => any>;
        onCreateFail: PropTypes.Validator<(...args: any[]) => any>;
    };
    static defaultProps: {};
    constructor(props: any);
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    toPx: (rpx: number, int?: boolean, factor?: number) => number;
    toRpx: (px: number, int?: boolean, factor?: number) => number;
    _downloadImageAndInfo: (image: IIMage, index: number, pixelRatio: number) => Promise<any>;
    downloadResource: ({ images, pixelRatio }: {
        images: IIMage[];
        pixelRatio: number;
    }) => Promise<any[]>;
    downloadResourceTransit: () => Promise<any>;
    initCanvas: (w: any, h: any, debug: any) => Promise<void>;
    onCreate: () => Promise<void>;
    create: (config: any) => void;
    getTempFile: (otherOptions: any) => void;
    render(): JSX.Element | null;
}
export {};
