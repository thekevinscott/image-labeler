import 'babel-polyfill';
import drawImages from './drawImages';
import getImageData from './getImageData';

import simpleTall from './images/simple/tall.jpeg';
import simpleSqua from './images/simple/square.jpeg';
import simpleWide from './images/simple/wide.jpeg';

import remainderTall from './images/remainder/tall.jpeg';
import remainderSqua from './images/remainder/square.jpeg';
import remainderWide from './images/remainder/wide.jpeg';

import filterTall from './images/filter/tall.jpeg';
import filterSqua from './images/filter/square.jpeg';
import filterWide from './images/filter/wide.jpeg';

// import filterRemainderTall from './images/filter-remainder/tall.jpeg';
// import filterRemainderSqua from './images/filter-remainder/square.jpeg';
// import filterRemainderWide from './images/filter-remainder/wide.jpeg';

const root = document.getElementById('root');
const template = `
  <div id="imageContainer"></div>
  <div id="buttonContainer">
    <button id="snapshot">Snapshot</button>
  </div>
`;
function drawSimulation(images, filters, getOffside) {
  root.innerHTML = template;

  if (!images.length) {
    console.log('images', images);
    throw new Error('Bad images');
  }

  drawImages(images, filters, getOffside);
}

const getImages = async (images) => {
  const imgs = [];
  for (let i = 0; i < images.length; i++) {
    imgs[i] = await getImageData(images[i]);
  }
  return imgs;
};

[{
  id: 'simple',
  images: [
    simpleTall,
    simpleSqua,
    simpleWide,
  ],
  filter: 1,
}, {
  id: 'simple-remainder',
  images: [
    remainderTall,
    remainderSqua,
    remainderWide,
  ],
  filter: 1,
}, {
  id: 'filter',
  images: [
    filterTall,
    filterSqua,
    filterWide,
  ],
  filter: 0.5,
}, {
  id: 'filter-remainder',
  images: [
    filterTall,
    filterSqua,
    filterWide,
  ],
  filter: 0.4,
  getOffside: imageIndex => index => {
    if (imageIndex === 1) {
      if (index >= 5) {
        return 2;
      } else if (index >= 2) {
        return 1;
      }
    } else if (imageIndex === 0) {
      if (index >= 9) {
        return 2;
      } else if (index >= 4) {
        return 1;
      }
    } else if (imageIndex === 2) {
      if (index >= 9) {
        return 2;
      } else if (index >= 4) {
        return 1;
      }
    }
    return 0;
  },
}].forEach(({
  id,
  images,
  filter,
  getOffside,
}) => {
  document.getElementById(id).onclick = async () => {
    const loadedImages = await getImages(images);
    drawSimulation(loadedImages, [filter], getOffside);
  };
});
