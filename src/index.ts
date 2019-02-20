import * as tf from '@tensorflow/tfjs';
import {
  MODEL_URL,
} from './config';

interface IOptions {
  labels?: number;
  filters?: number;
  includeConfidence?: boolean;
}

type ICallbackOrOptions = () => void | IOptions;

const URL = '';

class ImageLabeler {
  loadingModel: boolean = false;
  model: any;

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
    this.model = await tf.loadModel(MODEL_URL);
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

  label = async (images: any, callbackOrOptions?: ICallbackOrOptions, optionalOptions?: IOptions) => {
    let callback, options;
    if (typeof callbackOrOptions !== 'function') {
      options = callbackOrOptions;
    } else if (typeof callbackOrOptions === 'object') {
      callback = callbackOrOptions;
      options = optionalOptions;
    }

    const model = await this.getModel();
    model.summary();

    if (callback) {
      return;
    }

    return new Promise((resolve) => {
    });
  }
}

export default ImageLabeler;
