import { mat4 } from "./math/mat4";
import { input } from "./render/input";
import { renderObject } from "./render/rend_def";
import { Timer } from "./render/timer";

class _animationContext {
  timer;
  input;
  rnd;

  lastFPSupdate = 0;
  windowTitle;

  units = [];

  constructor(canvasId) {
    this.rnd = renderObject(this, canvasId);
    this.input = new input(this.rnd);
    this.timer = new Timer();

    this.windowTitle = document.getElementById("title");
  }

  frameStart() {
    this.input.reset();
    this.rnd.resize();
    this.timer.response();
    this.rnd.drawFrame();

    if (this.timer.globalTime - this.lastFPSupdate > 2) {
      this.lastFPSupdate = this.timer.globalTime;
      this.windowTitle.innerText = "FPS: " + this.timer.FPS;
    }
  }

  unitsResponse() {
    let toDel = [];
    for (let u in this.units) {
      if (this.units[u] != null) {
        this.units[u].response();
        if (!this.units[u].isActive)
          this.units[u] = null;
        toDel.push(u);
      } 
    }
  }

  unitsRender() {
    for (let u in this.units) {
      if (this.units[u] != null) {
        this.units[u].render();
      }
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