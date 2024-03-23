/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
 * File Name   : box.js
 * Created at  : 2024-03-23
 * Updated at  : 2024-03-23
 * Author      : jeefo
 * Purpose     :
 * Description :
 * Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
import Mesh from "./mesh.js";

const positions = [
  // Front face
  -1.0, -1.0,  1.0,
  +1.0, -1.0,  1.0,
  +1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
  +1.0,  1.0, -1.0,
  +1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
  +1.0,  1.0,  1.0,
  +1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
  +1.0, -1.0, -1.0,
  +1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
  1.0, -1.0, -1.0,
  1.0,  1.0, -1.0,
  1.0,  1.0,  1.0,
  1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];

const uvs = [
  // Front face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Back face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Top face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Bottom face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Right face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,

  // Left face
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
];

const normals = [
  // Front face
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,

  // Back face
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,

  // Top face
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,

  // Bottom face
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,

  // Right face
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,

  // Left face
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
];

const tangents = [
  // Front face
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,

  // Back face
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,

  // Top face
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,

  // Bottom face
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,

  // Right face
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,

  // Left face
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
];

const colors = [
  [1, 0, 0, 1], // Front face (red)
  [0, 1, 0, 1], // Back face (green)
  [0, 0, 1, 1], // Top face (blue)
  [1, 1, 0, 1], // Bottom face (yellow)
  [1, 0, 1, 1], // Right face (purple)
  [0, 1, 1, 1]  // Left face (cyan)
];

const indices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

export default class Box extends Mesh {
  constructor() {
    super();

    const vertex_colors = [];
    for (let i = 0; i < positions.length / 3; i++) {
      vertex_colors.push(...colors[Math.floor(i / 4)]);
    }

    this.buffer("position" , {size: 3, data: positions});
    this.buffer("normal"   , {size: 3, data: normals});
    this.buffer("tangent"  , {size: 3, data: tangents});
    this.buffer("uv"       , {size: 2, data: uvs});
    this.buffer("color"    , {size: 4, data: vertex_colors});
    this.buffer("index"    , {         data: indices});
  }
}