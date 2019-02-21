import * as tf from '@tensorflow/tfjs';

type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|tf.Tensor;

const getArrayOfImages = (images: IImage|Array<IImage>): Array<IImage> => {
  let arrayOfImages: Array<IImage>;
  if (Array.isArray(images)) {
    arrayOfImages = images;
  } else {
    arrayOfImages = [images];
  }

  return arrayOfImages;
};

const loadImage = async (src): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = src;
  img.crossOrigin = '';
  return await waitForImageToLoad(img);
};

const waitForImageToLoad = (img: HTMLImageElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

const getImage = async (image: IImage): Promise<tf.Tensor4D> => {
  if (typeof image === 'string') {
    image = await loadImage(image);
  } else if (image instanceof HTMLImageElement) {
    image = await waitForImageToLoad(image);
  }

  if (image !instanceof tf.Tensor) {
    if (image.shape.length === 4) {
      return image as tf.Tensor4D;
    } else if (image.shape.length === 3) {
      return image.expandDims(0);
    }

    throw new Error(`You've passed an invalid tensor of shape ${image.shape}, please pass a 3 or 4 dimensional tensor`);
  }

  const pixels: tf.Tensor3D = tf.browser.fromPixels(image);
  return pixels.expandDims(0);
};

const parseImages = async (images: IImage|Array<IImage>): Promise<tf.Tensor4D> => {
  const preparedImages = getArrayOfImages(images)

  let tensor;
  for (let i = 0; i < preparedImages.length; i++) {
    try {
      const img = await getImage(preparedImages[i]);
      if (tensor === undefined) {
        tensor = img;
      } else {
        const old = tensor;
        tensor = tensor.concat(img);
        old.dispose();
        img.dispose();
      }
    } catch(err) {
      console.error('There was an error parsing image', err);
    }
  }

  return tensor || tf.tensor([], [null, null, null, null]);
};

export default parseImages;
