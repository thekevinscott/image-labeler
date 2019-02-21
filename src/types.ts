export type IOptions = {
  labels?: number;
  filters?: number;
  includeConfidence?: boolean;
}

export type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

export type ILabels = Array<IPred>;

export type ICallback = (err: Error | undefined, results: ILabels) => void;

export type IPred = {
  label: string;
  confidence: number;
};

export type IPreds = Array<IPred>;
