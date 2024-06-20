export class _unit {
  name;
  init;
  response;
  render;
  close;

  constructor(name, init, response, render, close) {
    this.name = name;

    if (init == undefined)
      this.init = unitInit;
    else      
      this.init = init;
    if (response == undefined)
      this.response = unitResponse;
    else
      this.render = render;
    if (render == undefined)
      this.renser = unitRender;
    else
      this.response = response;
    if (close == undefined)
      this.close = unitClose;
    else
      this.close = close;
  }
}

function unitInit() {
  // do nothing
}

function unitResponse() {
  // do nothing
}

function unitRender() {
  // do nothing
}

function unitClose() {
  // do nothing
}