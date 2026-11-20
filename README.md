# Semana 9: Shaders
**Asignatura:** Informática Gráfica 

**Autor:** Nicolás Hernández Castro


## Motivación

El diseño de este shader parte de dos inspiraciones principales:

1. **El sharingan:**  
    El ojo central está inspirado en la evolución ocular del clan Uchiha del anime Naruto. El objetivo fue recrear mediante formas geométricas dinámicas la transición fluida entre el Sharingan clásico de tres aspas y el Mangekyō Sharingan, reproduciendo tanto su rotación continua como el cambio de forma hacia las tres cuchillas curvas y el punto rojo central.

2. **El fondo caleidoscópico:**  
     Para acompañar al ojo y darle profundidad a la escena, se diseñó un fondo animado estilo caleidoscopio que rodea al ojo con formas en continuo movimiento.


## Desarrollo del Shader

En primer lugar, se normalizan las coordenadas de pantalla para situar el origen `(0,0)` en el centro y corregir la relación de aspecto. Después, se pasa a coordenadas polares (distancia al centro `r` y ángulo `a`) y se crea una onda sinusoidal `m` que oscila entre `0` y `1` para controlar la transición entre ambos estados del ojo.
```glsl
// Centrar coordenadas en mitad de la pantalla
vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;

// Distancia al centro, ángulo y progreso de la transformación (0 = normal, 1 = Mangekyō)
float r = length(p);
float a = atan(p.y, p.x);
float m = 0.5 + 0.5 * sin(u_time);
float n = 0.088 * (1.0 - m);
float dr = r - 0.44;

```

Luego, se divide el ojo en 3 sectores iguales de 120° mediante la operación módulo `mod`. Al sumar `u_time` se consigue el giro continuo, mientras que el término cuadrático `r * r` va curvando las figuras a medida que se alejan del centro.
```glsl
// Dividir el ojo en 3 sectores y darles curvatura al girar
float s = mod(a + u_time + 0.465 + (2.4 + 0.8 * m) * r * r, 2.094) - 1.047;
```

A continuación, se dibujan las aspas de forma procedimental calculando la distancia de cada píxel a la figura. La anchura w de la cola se estrecha linealmente con el radio para alargarse hasta el borde al pasar a Mangekyō y la cabeza redonda de cada aspa se calcula usando producto escalar dot, encogiéndose hasta desaparecer en m = 1.
```glsl
// Cola de las aspas que se estira hasta formar las cuchillas
float w = (1.13 + 0.68 * m) * (0.59 + 0.20 * m - r);
float cuchilla = max(abs(s) - w, -dr - 0.34 * m);

// Cabeza circular del aspa (se reduce a 0 cuando m = 1)
vec2 tc = vec2(dr, r * s);
float cabezaTomoe = (dot(tc, tc) - n * n) * 6.0;
```

Se añaden los elementos concéntricos del iris, como el anillo intermedio fino, el contorno negro exterior del ojo y la pupila central, a la que se le recorta un círculo interior con `max()` para abrir el punto rojo característico del Mangekyō.
```glsl
// Anillo fino, borde exterior del ojo y pupila central
float anilloInterior = abs(dr) - 0.125 * n;
float bordeExterior = abs(r - 0.79) - 0.028;
float pupila = max(r - 0.155, 0.11 * m - r);
```

Por último, se unen todas las formas negras con `min()` y se suavizan sus bordes con clamp para evitar el efecto escalera. Tras aplicar un ligero sombreado radial al iris rojo y generar las ondas del fondo caleidoscópico, ambas capas se combinan mediante interpolación lineal `mix()`.
```glsl
// Juntar todas las formas negras y suavizar sus bordes
float sdfNegro = min(min(cuchilla, cabezaTomoe), min(anilloInterior, min(bordeExterior, pupila)));
float mascaraIris = clamp(sdfNegro * 100.0, 0.0, 1.0);

// Color rojo del iris, ondas del fondo caleidoscópico y mezcla final
float rojoOjo = (0.9 - 0.3 * r) * mascaraIris;
float ondas = sin(r * 9.0 - u_time * 3.0 + cos(a * 12.0));
float recorteOjo = clamp((0.82 - r) * 50.0, 0.0, 1.0);

gl_FragColor = vec4(mix(0.45 * ondas * ondas, rojoOjo, recorteOjo), 0.0, 0.0, 1.0);
```

En este repositorio se puede acceder tanto a la versión comentada (shader.frag) como a la versión reducida (shader_tiny.frag), ejecutable directamente en el editor de The Book of Shaders.

## Resultado


## Fuentes utilizadas

* The Book of Shaders: https://editor.thebookofshaders.com/
* Guion de la Práctica 9: https://github.com/otsedom/otsedom.github.io/blob/main/IG/S9/README.md

## Uso de la IA

Se ha utilizado asistencia de IA como apoyo para plantear y ajustar las ecuaciones geométricas de las formas y del movimiento, así como para optimizar y generar la versión reducida del código.