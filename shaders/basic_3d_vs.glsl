#version 100
#ifdef GL_ES
precision mediump float;
#endif

#define in  attribute
#define out varying

uniform mat3 normal_matrix;
uniform mat4 model;
uniform mat4 view;
uniform mat4 model_view;
uniform mat4 projection;
uniform mat4 mvp;

in vec3 position;
in vec4 color;

out vec4 vertex_color;

void main() {
  gl_Position  = mvp * vec4(position, 1.0);
  vertex_color = color;
}