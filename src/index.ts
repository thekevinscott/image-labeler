import * as tf from '@tensorflow/tfjs';
import {
  MODEL_URL,
  DEFAULT_LABELS,
  DEFAULT_FILTERS,
  DEFAULT_INCLUDE_CONFIDENCE,
  DEFAULT_LABEL_STRINGS,
} from './config';
import parseImages from './parseImages';
import predict from './predict';
import {
  IOptions,
  ICallback,
  IImage,
  ILabels,
} from './types';

type IGetParametersResponse = {
  callback?: ICallback;
  options: IOptions;
};

type IGetParametersParams = [(ICallback|IOptions)?, IOptions?];

const getParameters = (params: IGetParametersParams = []): IGetParametersResponse => {
  if (params.length === 2) {
    return {
      callback: params[0] as ICallback,
      options: params[1],
    };
  } else if (params.length === 0) {
    return {
      options: {},
    };
  }

  if (typeof params[0] !== 'function') {
    return {
      options: params[0],
    };
  };

  return {
    callback: params[0],
    options: {},
  };
};

class ImageLabeler {
  loadingModel: boolean = false;
  model: tf.Model;

  labels: number = DEFAULT_LABELS;
  filters: number = DEFAULT_FILTERS;
  includeConfidence: boolean = DEFAULT_INCLUDE_CONFIDENCE;

  callbacks: Function[] = [];

  constructor(options = {}) {
    this.configure(options);
  }

  configure = async (options: IOptions = {}) => {
    // on load, load the model
    this.getModel();

    if (options.labels !== undefined) {
      this.labels = options.labels;
    }
    if (options.filters !== undefined) {
      this.filters = options.filters;
    }
    if (options.includeConfidence !== undefined) {
      this.includeConfidence = options.includeConfidence;
    }
  }

  loadModel = async () => {
    if (this.loadingModel === true) {
      let resolve;
      const promise = new Promise((_resolve) => {
        resolve = _resolve;
      });
      this.callbacks.push((model => {
        resolve();
      }));
      return promise;
    }

    this.loadingModel = true;
    this.model = await tf.loadLayersModel(MODEL_URL);
    this.loadingModel = false;

    while (this.callbacks.length) {
      const callback = this.callbacks.shift();
      callback();
    }
  }

  getModel = async () => {
    if (this.model) {
      return this.model;
    }

    await this.loadModel();
    return this.model;
  }

  label = async (images: IImage|Array<IImage>, ...rest: IGetParametersParams): Promise<ILabels> => {
    const {
      callback,
      options,
    } = getParameters(rest);

    let results, err;
    try {
      const model = await this.getModel();
      const shape: number[] = model.inputs[0].shape;
      const dims: [number, number] = [shape[1], shape[2]];
      const parsedImages: tf.Tensor4D = await parseImages(images, dims);
      results = await predict(parsedImages, model, DEFAULT_LABEL_STRINGS);
      results = results.slice(0, options.labels || this.labels);
    } catch(_err) {
      err = _err;
    }

    if (callback) {
      callback(err, results);
      return;
    }

    return new Promise((resolve, reject) => {
      if (err) {
        return reject(err);
      }

      return resolve(results);
    });
  }
}

export default ImageLabeler;
