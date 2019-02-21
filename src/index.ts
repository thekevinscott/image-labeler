import * as tf from '@tensorflow/tfjs';
import {
  MODEL_URL,
} from './config';
import parseImages from './parseImages';
import predict from './predict';
import {
  IOptions,
  ICallbackOrOptions,
  IImage,
} from './types';

class ImageLabeler {
  loadingModel: boolean = false;
  model: tf.Model;

  labels: number = 5;
  filters: number = 2;
  includeConfidence: boolean = false;

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

  label = async (images: IImage|Array<IImage>, callbackOrOptions?: ICallbackOrOptions, optionalOptions?: IOptions) => {
    let _results, _err;
    let callback, options;
    if (typeof callbackOrOptions !== 'function') {
      options = callbackOrOptions;
    } else if (typeof callbackOrOptions === 'object') {
      callback = callbackOrOptions;
      options = optionalOptions;
    }

    try {
      const model = await this.getModel();
      model.summary();

      const parsedImages: tf.Tensor4D = await parseImages(images);
      _results = await predict(parsedImages, model);
    } catch(err) {
      _err = err;
    }

    if (callback) {
      callback(_err, _results);
      return;
    }

    return new Promise((resolve, reject) => {
      if (_err) {
        return reject(_err);
      }

      return resolve(_results);
    });
  }
}

export default ImageLabeler;
