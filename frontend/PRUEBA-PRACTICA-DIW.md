## Documentación DIW

## Variables de color creadas
He creado las variables --color-landing y --color-text-landing, que representan el color de fondo que tendrá la landing page de la página y el color de texto de la landing page: 
    --color-landing: rgb(160, 160, 255);
    --color-text-landing: rgb(0, 0, 0);

## Justificación DIW

## Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?
Porque es la que contiene los estilos generales de la página. No se mostrarían los estilos de forma adecuada.

## Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).
Es más específico a la hora de programar ya que ayuda a encontrar las class que estoy modificando de forma más rápida