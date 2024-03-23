/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : main.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
import Box                 from "./box.js";
import {mat4}        from "./gl_matrix/index.js";
import ShaderProgram       from "./shader_program.js";
import {PerspectiveCamera} from "./camera.js";

const canvas = document.querySelector("canvas");
const gl     = canvas.getContext("webgl");
window.gl = gl;

let raf_id, program, mesh, camera;
let paused = false;

const initialize = async () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pipelines = [
    {
      src  : "shaders/basic_3d_vs.glsl",
      type : gl.VERTEX_SHADER,
    },
    {
      src  : "shaders/basic_3d_fs.glsl",
      type : gl.FRAGMENT_SHADER,
    },
  ];

  program = await ShaderProgram.from_file(pipelines);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  addEventListener("keydown", e => {
    if (e.keyCode === 32) {
      paused = !paused;
    }
  });
};

const update = () => {
  if (!paused) {
    mesh.rotate_y(0.01);
    mesh.rotate_x(0.0075);
  }

  const mvp   = mat4.create();
  const model = mesh.get_model_matrix();

  mat4.multiply(mvp, camera.view, model);
  mat4.multiply(mvp, camera.projection, mvp);

  program.uniforms.mvp.value = mvp;
};

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  program.bind();
  mesh.draw();
};

(async function main() {
  await initialize();
  const aspect_ratio = canvas.width / canvas.height;
  gl.viewport(0, 0, canvas.width, canvas.height);

  mesh   = new Box();
  camera = new PerspectiveCamera(90, aspect_ratio, 0.01, 1000);
  program.bind_mesh(mesh);
  window.mesh = mesh;

  mesh.uniform_scale(1.5);

  program.add_uniform("mvp", mat4.create());

  raf_id = requestAnimationFrame(function game_loop() {
    update();
    render();

    raf_id = requestAnimationFrame(game_loop);
  });
})();