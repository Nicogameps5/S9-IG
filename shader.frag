#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // Centrar coordenadas en mitad de la pantalla
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;

    // Distancia al centro, ángulo y progreso de la transformación (0 = normal, 1 = Mangekyō)
    float r = length(p);
    float a = atan(p.y, p.x);
    float m = 0.5 + 0.5 * sin(u_time);
    float n = 0.088 * (1.0 - m);
    float dr = r - 0.44;

    // Dividir el ojo en 3 sectores y darles curvatura al girar
    float s = mod(a + u_time + 0.465 + (2.4 + 0.8 * m) * r * r, 2.094) - 1.047;

    // Cola de las aspas que se estira hasta formar las cuchillas
    float w = (1.13 + 0.68 * m) * (0.59 + 0.20 * m - r);
    float cuchilla = max(abs(s) - w, -dr - 0.34 * m);

    // Cabeza circular del aspa (se reduce a 0 cuando m = 1)
    vec2 tc = vec2(dr, r * s);
    float cabezaTomoe = (dot(tc, tc) - n * n) * 6.0;

    // Anillo fino, borde exterior del ojo y pupila central
    float anilloInterior = abs(dr) - 0.125 * n;
    float bordeExterior = abs(r - 0.79) - 0.028;
    float pupila = max(r - 0.155, 0.11 * m - r);

    // Juntar todas las formas negras y suavizar sus bordes
    float sdfNegro = min(min(cuchilla, cabezaTomoe), min(anilloInterior, min(bordeExterior, pupila)));
    float mascaraIris = clamp(sdfNegro * 100.0, 0.0, 1.0);

    // Color rojo del iris, ondas del fondo caleidoscópico y mezcla final
    float rojoOjo = (0.9 - 0.3 * r) * mascaraIris;
    float ondas = sin(r * 9.0 - u_time * 3.0 + cos(a * 12.0));
    float recorteOjo = clamp((0.82 - r) * 50.0, 0.0, 1.0);

    gl_FragColor = vec4(mix(0.45 * ondas * ondas, rojoOjo, recorteOjo), 0.0, 0.0, 1.0);
}
