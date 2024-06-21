import { input } from "./render/input";
import { renderObject } from "./render/rend_def";
import { Timer } from "./render/timer";

class _animationContext {
  timer;
  input;
  rnd;

  units = [];

  constructor(canvasId) {
    this.rnd = renderObject(this, canvasId);
    this.input = new input(this.rnd);
    this.timer = new Timer();
  }

  frameStart() {
    this.rnd.resize();
    this.timer.response();
    console.log(this.timer.FPS);
    this.rnd.drawFrame();
  }

  unitsResponse() {
    for (let unit of this.units) {
      unit.response();
    }
  }

  unitsRender() {
    for (let unit of this.units) {
      unit.render();
    }

    this.rnd.frameEnd();
  }

  unitAdd(unit) {
    this.units.push(unit);
    unit.init();
  }
}

export function animationContext(...args) {
  return new _animationContext(...args);
}