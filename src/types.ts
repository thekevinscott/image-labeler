export interface IOptions {
  labels?: number;
  filters?: number;
  includeConfidence?: boolean;
}

export type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

export type ICallbackOrOptions = () => void | IOptions;

