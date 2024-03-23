/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : mesh.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
/* globals gl*/
import {vec3, mat4, quat} from "./gl_matrix/index.js";

export default class Mesh {
  constructor() {
    this.buffers = {};

    this.transform = {
      scale    : vec3.fromValues(1,1,1),
      position : vec3.create(),
      rotation : quat.create(),
    };
  }

  uniform_scale(s) {
    const {scale} = this.transform;
    vec3.scale(scale, scale, s);
  }

  rotate_x(angle) {
    const rot = this.transform.rotation;
    quat.rotateX(rot, rot, angle);
  }

  rotate_y(angle) {
    const rot = this.transform.rotation;
    quat.rotateY(rot, rot, angle);
  }

  get_model_matrix() {
    const model = mat4.create();
    const {rotation, position, scale} = this.transform;
    mat4.fromRotationTranslationScale(model, rotation, position, scale);
    return model;
  }

  buffer(name, buffer) {
    if (this.buffers[name]) {
      throw new Error(`Buffer '${name}' already existed.`);
    }

    buffer.id = gl.createBuffer();
    if (name === "index") {
      const data = new Uint16Array(buffer.data);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.id);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    } else {
      const data = new Float32Array(buffer.data);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }
    this.buffers[name] = buffer;
  }

  draw() {
    if (this.buffers.index) {
      const len = this.buffers.index.data.length;
      gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
    } else {
      const len = this.buffers.position.data.length;
      gl.drawArrays(gl.TRIANGLES, 0, len);
    }
  }
}