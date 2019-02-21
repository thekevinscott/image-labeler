# Image Labeler

`image-labeler` provides autosuggested labels for images or video. It relies on a Neural Network, MobileNet, performing inference in the browser to calculate the suggestions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![CircleCI](https://circleci.com/gh/thekevinscott/image-labeler.svg?style=svg)](https://circleci.com/gh/thekevinscott/image-labeler)

A demo is forthcoming.

## Table of Contents

* [Getting Started](#getting-started)
* [API](#api)
* [Tests](#test)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)
* [Acknowledgments](#acknowledgments)

## Getting Started

<a href="#table-of-contents">Back to Top</a>

### Via script tag

You can use `image-labeler` via a `<script />` tag:

```
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.15.1/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/image-labeler/dist/index.umd.min.js"></script>
    <script>
      const imageLabeler = new ImageLabeler();
      imageLabeler.label('https://imgur.com/some-image').then(suggestions => {
        console.log(suggestions);
        // ['one', 'two', 'three'];
      });
    </script>
  </head>
</html>
```

### Via ES6

Install with:

```
// npm
npm install image-labeler

// yarn
yarn add image-labeler
```

```
import ImageLabeler from 'image-labeler';
const imageLabeler = new ImageLabeler();
imageLabeler.label('https://imgur.com/some-image').then(suggestions => {
  console.log(suggestions);
  // ['one', 'two', 'three'];
});
```

### CORS

Many image src are not loadable via CORS. Theres ways around this.

## API

<a href="#table-of-contents">Back to Top</a>

### `constructor`

Initializes the component. Accepts a single argument, `options`, an object with the following properties:

* `labels` _(optional)_ - The number of labels to return. Defaults to 5.
* `filters` _(optional)_ - The number of filters to use. Defaults to 2 for images greater than 100 pixels.
* `includeConfidence` _(optional)_ - Whether to include confidence scores for each label or not. Defaults to false.

#### Example

```
new ImageLabeler({
  labels: 5,
  filters: 2,
  includeConfidence: true,
});
```

### `configure`

Same function as initialize above, but can be called to update options are instantiation.

#### Example

```
const imageLabeler = new ImageLabeler();
imageLabeler.configure({
  labels: 5,
  filters: 2,
  includeConfidence: true,
});
```

### `label`

Returns a list of labels for an image or a list of images.

* `images` - Accepts a single image or a list of images. Can be a string (the URL to an image), a Blob, an HTMLImageElement, an HTMLVideoElement, a Tensor of pixels, or an array of any of the above.
* `callback` - A callback called with the result of `labels. First argument to the callback is error (which is null if no error), and the second argument is the `labels`.
* `options` - Options, as defined on the constructor.

#### Returns

If no callback is specified, returns a Promise that resolves to `labels`.

```
['one', 'two', 'three']
```

If `includeConfidence` is true, `labels` is made up of objects including the label and its confidence:

```
[{ label: 'one', confidence: 0.9 }, { label: 'two', confidence: 0.8 }]
```

#### Example

```
// pass an image
imageClassifier.label('foo').then(labels => {
  console.log(labels);
});

// pass an image and a callback as the second argument.
// in this case, no promise is returned.
imageClassifier.label('foo', (err, labels) => {
  if (err) {
    throw new Error(err);
  }

  console.log(labels);
});

// pass an image and an options object as the second argument
imageClassifier.label('foo', {
  labels: 10,
}).then(labels => {
  console.log(labels);
});

// pass an image, a callback, and an options object as the second argument
imageClassifier.label('foo', (err, labels) => {
  if (err) {
    throw new Error(err);
  }

  console.log(labels);
}, {
  labels: 10,
});
```



`label` label the image .accepts string html image or video and either a callback or options or both .

options can include the number of labels to return (0 is all), and how many filters to utilize. also includeConfidence

### Filters

a gif about how filters work

## Tests

<a href="#table-of-contents">Back to Top</a>

## Versioning

<a href="#table-of-contents">Back to Top</a>

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/thekevinscott/image-labeler/tags). 

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Author

<a href="#table-of-contents">Back to Top</a>

[Kevin Scott](https://thekevinscott.com)

See also the list of [contributors](https://github.com/thekevinscott/image-labeler/contributors) who participated in this project.

## License

<a href="#table-of-contents">Back to Top</a>

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

<a href="#table-of-contents">Back to Top</a>

This package leverages [`tensorflow.js`](https://js.tensorflow.org) and [MobileNet](https://arxiv.org/abs/1704.04861), both released by Google.

This uses labels from [`imagenet-simple-labels`](https://github.com/anishathalye/imagenet-simple-labels) for cleaner labels from ImageNet.
