#version 100
#ifdef GL_ES
precision mediump float;
#endif

#define in varying

in vec4 vertex_color;
//in vec3 vertex_position;

void main() {
  //gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  gl_FragColor = vertex_color;
}