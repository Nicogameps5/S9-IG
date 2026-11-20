precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
vec2 R=u_resolution,p=(gl_FragCoord.xy*2.-R)/R.y;
float t=u_time,r=length(p),a=atan(p.y,p.x),m=.5+.5*sin(t),n=.09*(1.-m),dr=r-.44,
s=mod(a+t+.46+(2.4+m)*r*r,2.1)-1.05,w=(1.+m)*(.6+.2*m-r),
d=min(min(max(abs(s)-w,-dr-.3*m),(dot(p=vec2(dr,r*s),p)-n*n)*6.),min(abs(dr)-.1*n,min(abs(r-.8)-.03,max(r-.16,.1*m-r)))),
g=sin(r*9.-t*3.+cos(a*12.));
gl_FragColor=vec4(mix(.5*g*g,.8*clamp(d*99.,0.,1.),smoothstep(.82,.8,r)),0.,0.,1.);
}