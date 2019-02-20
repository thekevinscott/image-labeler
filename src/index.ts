import * as tf from '@tensorflow/tfjs';

interface IOptions {
}

type ICallbackOrOptions = () => void | IOptions;

class ImageLabeler {
  constructor(options = {}) {
    this.setOptions(options);
  }

  configure(options: IOptions = {}) {
    this.setOptions(options);
  }

  setOptions = async (options) => {
    const model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json');
    model.summary();
  }

  label = async (images: any, callbackOrOptions?: ICallbackOrOptions, optionalOptions?: IOptions) => {
    let callback, options;
    if (typeof callbackOrOptions !== 'function') {
      options = callbackOrOptions;
    } else if (typeof callbackOrOptions === 'object') {
      callback = callbackOrOptions;
      options = optionalOptions;
    }

    if (callback) {
      return;
    }

    return new Promise((resolve) => {
    });
  }
}

export default ImageLabeler;
