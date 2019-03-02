import * as tf from '@tensorflow/tfjs';
import {
  DEFAULT_NUMBER_OF_LABELS,
  DEFAULT_FILTERS,
  DEFAULT_INCLUDE_CONFIDENCE,
  DEFAULT_MODEL_SETTINGS,
} from './config';
import parseImages from './parseImages';
// import normalizeImages from './normalizeImages';
import predict from './predict';
import {
  IOptions,
  ICallback,
  IImage,
  ILabels,
  IModelSettings,
} from './types';

type IGetParametersResponse = {
  callback?: ICallback;
  options: IOptions;
};

type IGetParametersParams = [(ICallback|IOptions)?, IOptions?];

const getParameters = (params: IGetParametersParams = [], defaultOptions: IOptions): IGetParametersResponse => {
  if (params.length === 2) {
    return {
      callback: params[0] as ICallback,
      options: {
        ...defaultOptions,
        ...params[1],
      },
    };
  } else if (params.length === 0) {
    return {
      options: defaultOptions,
    };
  }

  if (typeof params[0] !== 'function') {
    return {
      options: {
        ...defaultOptions,
        ...params[0],
      },
    };
  };

  return {
    callback: params[0],
    options: defaultOptions,
  };
};

class ImageLabeler {
  loadingModel: boolean = false;
  model: tf.Model;

  options: IOptions = {
    numberOfLabels: DEFAULT_NUMBER_OF_LABELS,
    filters: DEFAULT_FILTERS,
    includeConfidence: DEFAULT_INCLUDE_CONFIDENCE,
    modelSettings: DEFAULT_MODEL_SETTINGS,
  };

  callbacks: Function[] = [];

  constructor(options = {}) {
    this.configure(options);
  }

  configure = async (options: IOptions = {}) => {
    if (options.modelSettings !== undefined) {
      this.model = undefined;
      if (!options.modelSettings.url || !options.modelSettings.labels) {
        throw new Error('Invalid model provided');
      }
    }
    this.options = {
      ...this.options,
      ...options,
    };

    // on load, load the model
    this.getModel();
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
    if (!this.options.modelSettings) {
      throw new Error('Model is not specified');
    }
    this.model = await tf.loadLayersModel(this.options.modelSettings.url);
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
    } = getParameters(rest, this.options);

    let results, err;
    try {
      const model = await this.getModel();
      const shape: number[] = model.inputs[0].shape;
      const dims: [number, number] = [shape[1], shape[2]];
      const parsedImages: tf.Tensor4D = await parseImages(images, dims, options.filters);
      if (parsedImages.shape[0] === null) {
        throw new Error('Something went wrong when parsing the images');
      }
      results = await predict(parsedImages, model, options);
    } catch(_err) {
      console.error(_err);
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
