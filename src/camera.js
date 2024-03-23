/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : camera.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
import { vec3, mat4 } from "./gl_matrix/index.js";

const UP = vec3.fromValues(0, 1, 0);

const A_DEGREE_IN_RADIAN = Math.PI / 180;
const to_radian          = v => v * A_DEGREE_IN_RADIAN;

class Camera {
  constructor() {
    this.target   = vec3.create();
    this.position = vec3.fromValues(0, 3, 5);
    this.view     = mat4.create();
    this.update();
  }

  update() {
    mat4.lookAt(this.view, this.position, this.target, UP);
  }
}

class PerspectiveCamera extends Camera {
  constructor(fov, aspect, near, far) {
    super();

    this.fov        = fov;
    this.far        = far;
    this.near       = near;
    this.aspect     = aspect;
    this.projection = mat4.create();

    mat4.perspective(this.projection, to_radian(fov), aspect, near, far);
  }
}

export {Camera, PerspectiveCamera};