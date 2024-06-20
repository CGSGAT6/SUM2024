class _image {
  img;
  name;

  constructor(path) {
    this.name = path;
    this.img = new Image();
    this.img.src = path;
  }
}

export function image(path) {
  return new _image(path);
}