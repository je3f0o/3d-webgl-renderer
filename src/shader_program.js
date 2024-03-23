/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : shader_program.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
/* globals gl*/
import Uniform from "./uniform.js";

const load_shader_from_url = async url => {
  const res = await fetch(url);
  console.assert(res.status === 200);
  return await res.text();
};

const compile_shader = (source_code, type) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source_code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const msg = `Shader error: ${gl.getShaderInfoLog(shader)}`;
    gl.deleteShader(shader);
    throw new Error(msg);
  }

  return shader;
};

const gl_enum_to_string = value => {
  for (const key in gl) {
    if (gl[key] === value) return key;
  }
  return "Unknown";
};

export default class ShaderProgram {
  constructor(pipelines) {
    this.id       = gl.createProgram();
    this.attrs    = [];
    this.shaders  = [];
    this.uniforms = {};
    for (const {src, type} of pipelines) {
      const shader = compile_shader(src, type);
      gl.attachShader(this.id, shader);
      this.shaders.push(shader);
    }
    this.link();
    this.read_attributes();
  }

  link() {
    const program_id = this.id;
    gl.linkProgram(program_id);
    if (!gl.getProgramParameter(program_id, gl.LINK_STATUS)) {
      throw new Error(`Shader link error: ${gl.getShaderInfoLog(program_id)}`);
    }
    gl.validateProgram(program_id);
    if (!gl.getProgramParameter(program_id, gl.VALIDATE_STATUS)) {
      const msg = `Shader validation failed: ${gl.getShaderInfoLog(program_id)}`;
      throw new Error(msg);
    }
  }

  read_attributes() {
    const num_attrs = gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < num_attrs; ++i) {
      const info = gl.getActiveAttrib(this.id, i);
      this.attrs.push({
        name      : info.name,
        type      : info.type,
        location  : gl.getAttribLocation(this.id, info.name),
        type_name : gl_enum_to_string(info.type),
      });
    }
  }

  add_uniform(name, value) {
    if (this.uniforms[name]) {
      throw new Error(`Uniform '${name} has already exists.'`);
    }
    this.uniforms[name] = new Uniform(this.id, name, value);
  }

  destroy() {
    gl.useProgram(null);

    for (const shader of this.shaders) {
      gl.detachShader(this.id, shader);
      gl.deleteShader(shader);
    }
    gl.deleteProgram(this.id);

    this.id      = null;
    this.shaders = [];
  }

  bind() {
    gl.useProgram(this.id);
    for (const uniform of Object.values(this.uniforms)) {
      uniform.upload();
    }
  }

  bind_mesh(mesh) {
    for (const attr of this.attrs) {
      const buffer = mesh.buffers[attr.name];
      if (buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
        gl.enableVertexAttribArray(attr.location);
        let size;
        switch (attr.type) {
          //case gl.FLOAT_VEC2: break;
          case gl.FLOAT_VEC3:
            size = 3;
            break;
          case gl.FLOAT_VEC4:
            size = 4;
            break;
          default:
            throw new Error(`Unhandled attribute type: ${attr.type_name}`);
        }
        gl.vertexAttribPointer(attr.location, size, gl.FLOAT, gl.FALSE, 0, 0);
      }
    }
  }

  static async from_file(pipelines) {
    const promises = pipelines.map(p => load_shader_from_url(p.src));
    const sources = await Promise.all(promises);

    for (const [index, value] of sources.entries()) {
      pipelines[index].src = value;
    }

    return new ShaderProgram(pipelines);
  }
}