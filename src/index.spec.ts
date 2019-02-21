import ImageLabeler from './index';
import { expect } from 'chai';
import {
  DEFAULT_MODEL_SETTINGS,
  DEFAULT_LABELS,
  DEFAULT_FILTERS,
  DEFAULT_INCLUDE_CONFIDENCE,
} from './config';
import simple from './labels/simple';
const DEFAULT_LABEL_STRINGS = DEFAULT_MODEL_SETTINGS.labels;

describe('ImageLabeler', () => {
  it('loads and sets defaults', () => {
    const imageLabeler = new ImageLabeler();
    expect(imageLabeler.labels).to.equal(DEFAULT_LABELS);
    expect(imageLabeler.filters).to.equal(DEFAULT_FILTERS);
    expect(imageLabeler.includeConfidence).to.equal(DEFAULT_INCLUDE_CONFIDENCE);
  });

  it('sets options', () => {
    const imageLabeler = new ImageLabeler({
      labels: 6,
      filters: 3,
      includeConfidence: true,
    });
    expect(imageLabeler.labels).to.equal(6);
    expect(imageLabeler.filters).to.equal(3);
    expect(imageLabeler.includeConfidence).to.equal(true);
  });

  it('sets options via configure', () => {
    const imageLabeler = new ImageLabeler({
      labels: 7,
      filters: 4,
      includeConfidence: false,
    });
    imageLabeler.configure({
      labels: 6,
      filters: 3,
      includeConfidence: true,
    });
    expect(imageLabeler.labels).to.equal(6);
    expect(imageLabeler.filters).to.equal(3);
    expect(imageLabeler.includeConfidence).to.equal(true);
  });

  describe('label', () => {
    const BLACKWHITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAAXNSR0IArs4c6QAAAA9JREFUCB1j+A8EDAwM/wEa7gT8qKTw7wAAAABJRU5ErkJggg==';

    const expectedLabelIds = [
      476,
      874,
      51,
      547,
      388,
    ];

    const expectedLabels = expectedLabelIds.map(id => simple[id]);

    it('returns labels for an image', async () => {
      const imageLabeler = new ImageLabeler();
      const results = await imageLabeler.label(BLACKWHITE_DATA);
      expect(results.length).to.equal(DEFAULT_LABELS);
      expect(results[0].label).to.equal(expectedLabels[0]);
      expect(results[1].label).to.equal(expectedLabels[1]);
      expect(results[2].label).to.equal(expectedLabels[2]);
      expect(results[3].label).to.equal(expectedLabels[3]);
      expect(results[4].label).to.equal(expectedLabels[4]);
    });

    it('returns labels for an image via callback', (done) => {
      const imageLabeler = new ImageLabeler();
      const callback = (err, results) => {
        expect(results.length).to.equal(DEFAULT_LABELS);
        expect(results[0].label).to.equal(expectedLabels[0]);
        expect(results[1].label).to.equal(expectedLabels[1]);
        expect(results[2].label).to.equal(expectedLabels[2]);
        expect(results[3].label).to.equal(expectedLabels[3]);
        expect(results[4].label).to.equal(expectedLabels[4]);
        done();
      };
      imageLabeler.label(BLACKWHITE_DATA, callback);
    });

    it('returns labels with options', async () => {
      const labels = 2;
      const imageLabeler = new ImageLabeler();
      const results = await imageLabeler.label(BLACKWHITE_DATA, {
        labels,
      });
      expect(results.length).to.equal(labels);
      expect(results[0].label).to.equal(expectedLabels[0]);
      expect(results[1].label).to.equal(expectedLabels[1]);
    });

    it('returns labels with callback and options', (done) => {
      const labels = 2;
      const imageLabeler = new ImageLabeler();
      const callback = (err, results) => {
        expect(results.length).to.equal(labels);
        expect(results[0].label).to.equal(expectedLabels[0]);
        expect(results[1].label).to.equal(expectedLabels[1]);
        done();
      };
      imageLabeler.label(BLACKWHITE_DATA, callback, {
        labels,
      });
    });

    it('throws error if invalid model is provided', async () => {
      expect(() => {
        new ImageLabeler({
          model: {
            foo: 'foo',
          },
        });
      }).to.throw();
    });

    it('returns labels for custom labels', async () => {
      const labels = {
        [expectedLabelIds[0]]: 'one',
        [expectedLabelIds[1]]: 'two',
        [expectedLabelIds[2]]: 'three',
        [expectedLabelIds[3]]: 'four',
        [expectedLabelIds[4]]: 'five',
      };
      const imageLabeler = new ImageLabeler({
        model: {
          url: DEFAULT_MODEL_SETTINGS.url,
          labels,
        },
      });
      const results = await imageLabeler.label(BLACKWHITE_DATA);
      expect(results.length).to.equal(DEFAULT_LABELS);
      console.log(labels);
      expect(results[0].label).to.equal(labels[expectedLabelIds[0]]);
      expect(results[1].label).to.equal(labels[expectedLabelIds[1]]);
      expect(results[2].label).to.equal(labels[expectedLabelIds[2]]);
      expect(results[3].label).to.equal(labels[expectedLabelIds[3]]);
      expect(results[4].label).to.equal(labels[expectedLabelIds[4]]);
    });
  });
});
