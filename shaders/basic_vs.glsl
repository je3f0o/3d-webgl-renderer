#version 100
#ifdef GL_ES
precision mediump float;
#endif

#define in attribute

in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}