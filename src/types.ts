export type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

export type ILabels = Array<IPred>;

export type ICallback = (err: Error | undefined, results: ILabels) => void;

export type IPred = {
  label: string;
  confidence: number;
};

export type IPreds = Array<IPred>;

export type IModelSettings = {
  url: string;
  labels: {
    [index: string]: string;
  } | string[];
};

export type IOptions = {
  numberOfLabels?: number;
  filters?: Array<number>;
  includeConfidence?: boolean;
  modelSettings?: IModelSettings;
}
