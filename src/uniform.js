/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : uniform.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
/* globals gl*/

const upload_float_array = uniform => {
  const {value, location} = uniform;
  switch (value.length) {
    case 2:
      gl.uniform2fv(location, value);
      break;
    case 3:
      gl.uniform3fv(location, value);
      break;
    case 4:
      gl.uniform4fv(location, value);
      break;
    case 16:
      gl.uniformMatrix4fv(location, false, value);
      break;
    default:
      throw new Error("Unhandled uniform");
  }
};

export default class Uniform {
  constructor(program, name, value) {
    this.name       = name;
    this.program    = program;
    this.location   = gl.getUniformLocation(program, name);
    this.is_changed = true;

    Object.defineProperty(this, "value", {
      get() { return value; },
      set(v) {
        if (value !== v) {
          value = v;
          this.is_changed = true;
        }
      }
    });
  }

  upload() {
    switch (this.value.constructor) {
      case Number:
        this.program.gl.uniform1f(this.location, this.value);
        break;
      case Float32Array:
        upload_float_array(this);
        break;
    }
  }
}