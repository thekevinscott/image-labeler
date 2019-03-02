import 'babel-polyfill';
import drawImages from './drawImages';
import getImageData from './getImageData';

const root = document.getElementById('root');
function drawSimulation(images, filters) {
  root.innerHTML = `
  <div id="imageContainer"></div>
  <div id="buttonContainer">
    <button id="snapshot">Snapshot</button>
  </div>
  `;

  drawImages(images, filters);
}

document.getElementById('simple').onclick = () => {
  drawSimulation([
    getImageData(80, 240),
    getImageData(120, 120),
    getImageData(240, 80),
  ], [1]);
};

document.getElementById('simple-remainder').onclick = () => {
  drawSimulation([
    getImageData(80, 260),
    getImageData(120, 120),
    getImageData(260, 80),
  ], [1]);
};

document.getElementById('filter').onclick = () => {
  drawSimulation([
    getImageData(120, 240),
    getImageData(120, 120),
    getImageData(240, 120),
  ], [0.5]);
};

document.getElementById('filter-remainder').onclick = () => {
  drawSimulation([
    getImageData(120, 260),
    getImageData(120, 120),
    getImageData(260, 120),
  ], [0.5]);
};
