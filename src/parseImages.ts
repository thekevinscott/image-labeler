import * as tf from '@tensorflow/tfjs';

type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

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
  // if (image instanceof tf.Tensor) {
  //   return image;
  // }
  const pixels: tf.Tensor3D = tf.browser.fromPixels(image);
  return pixels.expandDims(0);
};

const parseImages = async (images: IImage|Array<IImage>): Promise<tf.Tensor4D> => {
  const preparedImages = getArrayOfImages(images)

  for (let i = 0; i < preparedImages.length; i++) {
    try {
      const img = await getImage(preparedImages[i]);
      return img;
    } catch(err) {
      console.error('There was an error parsing image', err);
    }
  }

  return tf.tensor([]);
};

export default parseImages;
