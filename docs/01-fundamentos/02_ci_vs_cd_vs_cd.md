# CI, entrega continua y despliegue continuo

La integración continua, la entrega continua y el despliegue continuo son prácticas relacionadas que ayudan a mejorar el flujo de cambios de software. Sus nombres se parecen, pero describen objetivos distintos.

- La **integración continua** comprueba cambios con frecuencia para detectar problemas pronto.
- La **entrega continua** mantiene el software preparado para publicarse de forma controlada.
- El **despliegue continuo** publica automáticamente los cambios que superan las comprobaciones acordadas.

En esta unidad aprenderás a distinguir estos conceptos, entender cómo se relacionan con DevOps y practicar un flujo simplificado con Git, scripts y Jenkins.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Definir integración continua, entrega continua y despliegue continuo.
- Explicar las diferencias entre los tres conceptos.
- Describir el propósito de un pipeline de CI/CD.
- Reconocer las etapas habituales de un pipeline.
- Comprender por qué las pruebas automatizadas son importantes.
- Explicar cómo los cambios pequeños reducen el riesgo de integración.
- Distinguir entre construir, probar, entregar y desplegar software.
- Interpretar el resultado de una compilación o de una prueba.
- Crear una validación sencilla ejecutable desde la terminal.
- Guardar cambios y revisar el historial con Git.
- Identificar qué etapas podrían automatizarse en Jenkins.
- Analizar los riesgos de automatizar una publicación.
- Proponer mejoras para un flujo de entrega de software.

## Conceptos básicos

Para comparar CI, entrega continua y despliegue continuo, primero conviene aclarar algunos términos.

### Cambio de software

Un cambio de software es una modificación realizada en una aplicación, su configuración, su documentación o su infraestructura.

Puede ser:

- Una nueva funcionalidad.
- Una corrección de errores.
- Una actualización de una dependencia.
- Un cambio en la configuración.
- Una modificación de la infraestructura.
- Una mejora de rendimiento.
- Una actualización de documentación.

Un cambio no tiene que ser grande para ser importante.

Un cambio pequeño puede afectar a una parte crítica del sistema.

### Código fuente

El código fuente es el conjunto de instrucciones y archivos que describen cómo se construye o configura un programa.

También pueden formar parte del repositorio:

- Archivos de configuración.
- Scripts de automatización.
- Pruebas.
- Documentación.
- Definiciones de infraestructura.
- Archivos de construcción de contenedores.

### Repositorio

Un repositorio almacena archivos y el historial de sus cambios.

Git permite:

- Registrar cambios.
- Consultar versiones anteriores.
- Comparar modificaciones.
- Trabajar en ramas.
- Compartir cambios con otras personas.
- Recuperar una versión conocida.

El repositorio suele ser el punto de partida de un pipeline.

### Build o compilación

Una compilación transforma el código y otros recursos en un resultado que puede ejecutarse, probarse o distribuirse.

Dependiendo del proyecto, una compilación puede:

- Descargar dependencias.
- Compilar código.
- Empaquetar archivos.
- Crear una imagen de contenedor.
- Generar documentación.
- Preparar un artefacto.

No todos los lenguajes requieren una compilación tradicional.

Una aplicación de scripts también puede pasar por un proceso de validación y empaquetado.

### Artefacto

Un artefacto es un resultado generado por el proceso de construcción.

Ejemplos:

- Un archivo `.jar`.
- Un paquete `.zip`.
- Una imagen Docker.
- Un ejecutable.
- Un paquete instalable.
- Un conjunto de archivos estáticos.
- Un informe de pruebas.

El artefacto idealmente se identifica de forma inequívoca y no cambia después de ser generado.

### Prueba

Una prueba comprueba una característica o un comportamiento del software.

Puede verificar:

- Que una función produce el resultado esperado.
- Que varios componentes se comunican correctamente.
- Que una aplicación responde a una petición.
- Que una configuración cumple ciertas reglas.
- Que una modificación no rompe funcionalidades existentes.

Las pruebas reducen incertidumbre, pero no pueden demostrar que un sistema no tenga ningún defecto.

### Entorno

Un entorno es el conjunto de recursos donde se ejecuta o se valida una aplicación.

Algunos entornos habituales son:

- Desarrollo.
- Integración.
- Pruebas.
- Preproducción.
- Producción.

Los nombres y la cantidad de entornos dependen de cada organización.

La existencia de muchos entornos no garantiza por sí sola una entrega segura.

### Despliegue

Un despliegue es la acción de instalar o activar una versión en un entorno.

El despliegue puede realizarse:

- Manualmente.
- Mediante un script.
- Desde una herramienta de automatización.
- Como parte de un pipeline.
- De forma progresiva, por ejemplo, para un grupo reducido de usuarios.

Desplegar una versión no siempre significa que esté disponible para todas las personas usuarias.

### Publicación

La publicación es el momento en que una funcionalidad o versión se pone a disposición de las personas usuarias.

En algunos sistemas, desplegar y publicar son pasos diferentes.

Una funcionalidad puede estar desplegada pero desactivada mediante una bandera de funcionalidad.

Esta separación permite validar el despliegue antes de activar la funcionalidad.

## Integración continua

La **integración continua**, conocida como *Continuous Integration* o **CI**, es una práctica en la que los cambios se integran con frecuencia en una rama compartida y se validan mediante comprobaciones automatizadas.

### Qué intenta resolver CI

Cuando varias personas trabajan durante mucho tiempo en cambios aislados, pueden aparecer problemas al intentar combinarlos.

Por ejemplo:

- Los cambios modifican las mismas partes del código.
- Una dependencia se actualiza de forma incompatible.
- La documentación queda desactualizada.
- Las pruebas descubren problemas tarde.
- El equipo no sabe qué cambio introdujo un error.

CI reduce el tiempo entre realizar un cambio e integrarlo con el resto del proyecto.

### Cómo funciona CI

Un flujo de integración continua suele seguir estos pasos:

1. Una persona modifica el código.
2. Registra el cambio en Git.
3. Envía el cambio al repositorio compartido.
4. Una plataforma detecta el nuevo cambio.
5. Se ejecutan verificaciones automáticas.
6. El resultado se comunica al equipo.
7. Si una comprobación falla, se investiga y corrige el problema.

La plataforma puede ser Jenkins u otro sistema de automatización.

### Qué puede hacer un pipeline de CI

Un pipeline de CI puede:

- Obtener el código desde Git.
- Instalar dependencias.
- Validar el formato.
- Ejecutar análisis estático.
- Ejecutar pruebas unitarias.
- Ejecutar pruebas de integración.
- Construir la aplicación.
- Generar un artefacto.
- Analizar dependencias.
- Publicar informes de resultados.

No todas las comprobaciones tienen que ejecutarse en cada proyecto.

El equipo debe elegirlas de acuerdo con la tecnología, el riesgo y el tiempo disponible.

### El objetivo de las verificaciones

Una verificación debe ofrecer información útil sobre el cambio.

Por ejemplo:

- «La prueba de inicio de sesión falla».
- «No se pudo descargar una dependencia».
- «El archivo de configuración no es válido».
- «La compilación no se pudo completar».
- «El análisis encontró una dependencia con una vulnerabilidad conocida».

Un mensaje como «falló el pipeline» no basta para resolver el problema.

### Integración frecuente

Integrar con frecuencia reduce el tiempo durante el cual el cambio permanece aislado.

Esto ayuda a:

- Encontrar conflictos antes.
- Reducir el tamaño de los cambios pendientes.
- Facilitar la revisión.
- Compartir antes el feedback.
- Evitar integraciones finales muy grandes.
- Localizar con más facilidad el origen de un fallo.

Integrar frecuentemente no implica desplegar cada cambio a producción.

### Ramas y CI

Los equipos pueden usar distintas estrategias de ramas.

Por ejemplo:

- Integrar directamente en una rama principal protegida.
- Crear ramas breves para cambios pequeños.
- Usar solicitudes de cambios o *pull requests*.
- Ejecutar verificaciones antes de permitir la integración.

La estrategia concreta puede variar.

Lo importante es evitar que el trabajo permanezca aislado durante demasiado tiempo y que las verificaciones sean claras.

### Qué no garantiza CI

Tener CI no garantiza automáticamente que:

- Todas las pruebas sean completas.
- El software no tenga defectos.
- La aplicación sea segura.
- El diseño sea correcto.
- El despliegue vaya a funcionar.
- Las personas usuarias estén satisfechas.
- El equipo colabore de manera efectiva.

CI ayuda a reducir ciertos riesgos y a detectar problemas, pero debe formar parte de un proceso más amplio.

## Entrega continua

La **entrega continua**, conocida como *Continuous Delivery*, consiste en mantener el software en condiciones de poder publicarse de forma controlada.

El proceso prepara, valida y empaqueta los cambios para que puedan entregarse cuando la organización lo decida.

### Qué busca la entrega continua

La entrega continua busca que el equipo pueda responder a preguntas como:

- ¿Podemos publicar esta versión?
- ¿Qué verificaciones ha superado?
- ¿Qué cambios incluye?
- ¿Qué artefacto corresponde a esta versión?
- ¿Qué riesgos conocemos?
- ¿Cómo volveríamos a una versión anterior?
- ¿Qué aprobación hace falta antes de publicar?

### Flujo habitual de entrega continua

Un flujo puede incluir:

1. Integrar el cambio.
2. Ejecutar verificaciones automatizadas.
3. Construir el artefacto.
4. Publicar el artefacto en un registro o repositorio.
5. Desplegarlo en un entorno de prueba.
6. Ejecutar pruebas adicionales.
7. Preparar la versión para producción.
8. Solicitar una aprobación manual si corresponde.
9. Desplegar cuando exista una decisión de publicación.

La aprobación puede ser manual, automática o depender del tipo de cambio.

### Artefacto preparado para publicación

En entrega continua, el artefacto debería estar listo para publicarse, aunque la publicación no ocurra automáticamente.

Esto requiere que:

- El artefacto haya pasado las verificaciones acordadas.
- Se conozca su versión o identificador.
- Sus dependencias estén disponibles.
- La configuración necesaria esté definida.
- Exista un procedimiento de despliegue.
- El equipo pueda identificar los cambios incluidos.

### La aprobación manual

Una aprobación manual puede ser apropiada cuando:

- Hay una ventana de publicación establecida.
- Se necesita coordinar con otros equipos.
- Existe un requisito regulatorio.
- El cambio tiene un riesgo elevado.
- La publicación afecta a una operación crítica.
- Se requiere una decisión de negocio.

La aprobación no debería reemplazar las pruebas automáticas.

Una persona que aprueba necesita información suficiente para tomar una decisión.

### Entrega continua no significa demora innecesaria

La aprobación manual no debería convertirse en una espera sin propósito.

Si cada cambio está listo, pero permanece días esperando una revisión que nadie tiene asignada, el proceso no está fluyendo bien.

El equipo puede medir:

- Cuánto tiempo tarda una aprobación.
- Qué información hace falta para aprobar.
- Cuántas versiones esperan una ventana de publicación.
- Qué aprobaciones pueden automatizarse sin aumentar el riesgo.

### Qué no garantiza la entrega continua

La entrega continua no significa necesariamente:

- Que cada cambio llegue automáticamente a producción.
- Que todas las aprobaciones desaparezcan.
- Que un cambio se publique sin comprobarlo.
- Que todos los productos utilicen el mismo proceso.
- Que no haga falta coordinar una publicación.

Su objetivo es mantener la capacidad de entregar, no imponer una frecuencia única de publicación.

## Despliegue continuo

El **despliegue continuo**, conocido como *Continuous Deployment*, consiste en publicar automáticamente cada cambio que supera las verificaciones y reglas definidas.

### Qué requiere el despliegue continuo

Un equipo que automatiza despliegues debe tener confianza en:

- Las pruebas.
- La calidad de los artefactos.
- El proceso de despliegue.
- La configuración de los entornos.
- La capacidad de detectar problemas.
- La posibilidad de revertir o mitigar un cambio.
- La protección de datos y credenciales.
- La respuesta ante incidencias.

Cuanto mayor sea el impacto potencial, más importante resulta definir límites y controles.

### Un flujo habitual

Un flujo de despliegue continuo puede ser:

1. El cambio se integra en la rama compartida.
2. Se ejecutan las verificaciones de CI.
3. Se crea el artefacto.
4. Se despliega en un entorno de validación.
5. Se ejecutan comprobaciones adicionales.
6. El pipeline decide si el cambio cumple los criterios.
7. Se despliega a producción.
8. Se observan las métricas y señales del servicio.
9. Si aparece un problema, se activa una respuesta definida.

El orden y el detalle de los pasos dependen del producto.

### Despliegue automático y control

Automatizar un despliegue no significa perder el control.

El control puede expresarse mediante:

- Reglas de aprobación para ciertos tipos de cambio.
- Límites de uso de recursos.
- Comprobaciones de seguridad.
- Ventanas de despliegue.
- Porcentajes progresivos de tráfico.
- Alertas y umbrales de salud.
- Mecanismos de reversión.
- Permisos mínimos para el pipeline.

### Despliegue progresivo

Una versión puede desplegarse de forma gradual.

Por ejemplo:

- Primero en un entorno de prueba.
- Después para un pequeño porcentaje de tráfico.
- Luego para un grupo mayor.
- Finalmente para todas las personas usuarias.

Este enfoque permite observar el comportamiento antes de ampliar el despliegue.

### Banderas de funcionalidad

Una bandera de funcionalidad permite activar o desactivar una característica sin tener que volver a desplegar toda la aplicación.

Puede ayudar a:

- Separar la instalación de una funcionalidad de su publicación.
- Probar una característica con un grupo reducido.
- Desactivar rápidamente una funcionalidad problemática.
- Mantener cambios incompletos ocultos mientras se terminan.

Las banderas necesitan una gestión clara.

Si nunca se eliminan las que ya no se usan, la aplicación puede acumular complejidad.

### Cuándo no automatizar completamente el despliegue

Puede ser razonable mantener una aprobación o intervención manual cuando:

- El sistema tiene un impacto crítico.
- La recuperación automática todavía no es fiable.
- Las pruebas relevantes aún no están automatizadas.
- Hay obligaciones regulatorias.
- El cambio requiere coordinación operacional.
- La organización está empezando a mejorar su proceso.

La automatización debe aumentar la seguridad y la capacidad del equipo, no convertirse en una meta aislada.

## Diferencias entre CI, entrega continua y despliegue continuo

Los tres conceptos se complementan, pero no significan lo mismo.

| Práctica | Propósito principal | ¿Publica automáticamente a producción? |
|---|---|---|
| Integración continua | Integrar y validar cambios con frecuencia | No necesariamente |
| Entrega continua | Mantener el software preparado para publicar | No necesariamente |
| Despliegue continuo | Publicar automáticamente cambios validados | Sí, según las reglas del proceso |

### Diferencia central

- **CI** pregunta: «¿Podemos integrar este cambio y comprobarlo?»
- **Entrega continua** pregunta: «¿Está el software listo para publicarse?»
- **Despliegue continuo** pregunta: «¿Podemos publicar automáticamente este cambio validado?»

### Ejemplo sencillo

Imagina una aplicación web con una corrección de texto.

- Con **CI**, el cambio se integra y se comprueba automáticamente.
- Con **entrega continua**, se genera una versión validada que podría publicarse.
- Con **despliegue continuo**, la versión se publica automáticamente después de superar las comprobaciones.

### Uso de los términos

En conversaciones informales, las expresiones «CI/CD» y «pipeline CI/CD» se utilizan a veces para describir todo el proceso de integración, pruebas y despliegue.

Conviene aclarar qué significa «CD» en cada conversación:

- *Continuous Delivery* significa entrega continua.
- *Continuous Deployment* significa despliegue continuo.

La diferencia es importante cuando se define si existe una decisión o aprobación antes de publicar.

## Pipeline de CI/CD

Un pipeline es una secuencia de pasos que permite validar, construir, empaquetar o desplegar software.

El pipeline puede ejecutarse ante distintos eventos:

- Un cambio enviado al repositorio.
- Una solicitud de cambios.
- Una modificación en una rama concreta.
- Una ejecución manual.
- Un horario programado.
- Una etiqueta o versión creada.

### Etapas frecuentes

Un pipeline puede tener etapas como estas:

1. Preparar el entorno.
2. Obtener el código.
3. Validar archivos.
4. Instalar dependencias.
5. Ejecutar pruebas.
6. Construir el artefacto.
7. Analizar dependencias.
8. Publicar informes.
9. Desplegar en un entorno de prueba.
10. Solicitar aprobación.
11. Desplegar en producción.
12. Comprobar la salud del servicio.

No todos los pipelines deben contener todas las etapas.

### Fallar temprano

Una comprobación rápida puede ejecutarse antes de una tarea costosa.

Por ejemplo:

- Validar sintaxis antes de descargar grandes dependencias.
- Comprobar el formato antes de construir la aplicación.
- Ejecutar pruebas unitarias antes de pruebas extensas.
- Verificar variables necesarias antes de desplegar.

Este enfoque reduce el tiempo desperdiciado en ejecuciones que ya se sabe que no pueden completarse correctamente.

### Aislamiento entre etapas

Las etapas deben tener entradas y salidas comprensibles.

Por ejemplo:

- La etapa de pruebas recibe el código y genera resultados.
- La etapa de construcción produce un artefacto.
- La etapa de despliegue utiliza un artefacto identificado.
- La etapa de verificación comprueba el estado del entorno.

Un pipeline difícil de entender suele ser más difícil de mantener.

### Informes y resultados

El pipeline debería conservar información útil, por ejemplo:

- Resultado de cada prueba.
- Duración de cada etapa.
- Versión del artefacto.
- Commit que originó la ejecución.
- Entorno de destino.
- Mensajes de error relevantes.
- Identidad de una aprobación, cuando corresponda.

Los informes ayudan a investigar fallos y a comprender qué se entregó.

## Pruebas en un pipeline

Las pruebas son una parte importante del feedback. No todas validan lo mismo ni tienen la misma duración.

### Pruebas unitarias

Las pruebas unitarias validan unidades pequeñas de código de forma aislada.

Suelen ser:

- Rápidas.
- Específicas.
- Adecuadas para ejecutarse con frecuencia.
- Útiles para detectar errores localizados.

Una prueba unitaria no necesariamente valida cómo interactúan todos los componentes de una aplicación.

### Pruebas de integración

Las pruebas de integración verifican la interacción entre componentes.

Pueden comprobar:

- La comunicación con una base de datos.
- La integración con una API.
- El uso de un servicio externo simulado.
- La conexión entre varios módulos.

Suelen requerir más recursos y preparación que las pruebas unitarias.

### Pruebas de aceptación

Las pruebas de aceptación comprueban si el comportamiento de la aplicación satisface ciertos requisitos.

Pueden representar flujos como:

- Crear una cuenta.
- Completar una compra.
- Registrar una petición.
- Generar un informe.

Estas pruebas ayudan a validar el resultado desde una perspectiva más cercana al uso esperado.

### Pruebas de rendimiento

Las pruebas de rendimiento analizan características como:

- Tiempo de respuesta.
- Cantidad de peticiones soportadas.
- Consumo de memoria.
- Comportamiento bajo carga.
- Estabilidad durante una ejecución prolongada.

Los resultados dependen del entorno y deben interpretarse con cuidado.

### Pruebas de seguridad

Las verificaciones de seguridad pueden analizar:

- Dependencias.
- Configuración.
- Código fuente.
- Imágenes de contenedor.
- Infraestructura como código.
- Permisos.
- Exposición de secretos.

Una herramienta de análisis no sustituye una revisión adecuada, pero puede detectar problemas conocidos con rapidez.

### Pirámide de pruebas

Una forma común de organizar las pruebas es tener muchas verificaciones rápidas y específicas, y menos pruebas grandes y lentas.

Una distribución orientativa puede ser:

- Muchas pruebas unitarias.
- Un número moderado de pruebas de integración.
- Un número menor de pruebas de extremo a extremo.

No es una regla matemática.

La estructura debe adaptarse al sistema y a los riesgos que el equipo quiere controlar.

### Pruebas inestables

Una prueba inestable es una prueba que a veces pasa y a veces falla sin que el cambio de código explique la diferencia.

Puede deberse a:

- Dependencias de tiempo.
- Recursos compartidos.
- Orden de ejecución.
- Datos de prueba no aislados.
- Servicios externos.
- Condiciones de red.
- Errores en la propia prueba.

Las pruebas inestables reducen la confianza en el pipeline.

El equipo debería investigar su causa y evitar acostumbrarse a ignorar fallos.

## Artefactos y trazabilidad

El pipeline debe permitir relacionar un artefacto con el cambio que lo generó.

### Identificar el artefacto

El artefacto puede identificarse mediante:

- Un número de versión.
- El identificador del commit.
- Una etiqueta.
- Un número de compilación.
- Un digest o identificador inmutable.

El identificador debe ayudar a responder: «¿qué versión está funcionando en este entorno?».

### Construir una sola vez

Cuando sea posible, conviene generar un artefacto y promover ese mismo artefacto entre entornos.

Por ejemplo:

1. Construir la aplicación.
2. Validar el artefacto en pruebas.
3. Promover ese artefacto a preproducción.
4. Promover el mismo artefacto a producción.

Si se construye un artefacto distinto para cada entorno, puede ser más difícil demostrar que se está publicando exactamente lo que se validó.

### Configuración por entorno

La configuración puede cambiar entre entornos sin reconstruir la aplicación.

Debe gestionarse con cuidado:

- No incluir secretos en el código.
- Mantener separados los valores propios de cada entorno.
- Proteger los permisos de acceso.
- Validar que se proporcionen los valores necesarios.
- Evitar mostrar datos sensibles en los registros del pipeline.

## Seguridad en CI/CD

Un pipeline tiene acceso a código, dependencias, artefactos y, a veces, credenciales. Por eso, también necesita protección.

### Protección de credenciales

Las credenciales no deben guardarse directamente en archivos de código ni en el `Jenkinsfile`.

Buenas prácticas:

- Usar el gestor de credenciales de la plataforma.
- Limitar qué trabajos pueden usar cada secreto.
- No imprimir secretos en los registros.
- Rotar credenciales cuando corresponda.
- Separar credenciales por entorno.
- Usar permisos mínimos.

### Permisos mínimos

Cada proceso debería tener solo los permisos que necesita.

Por ejemplo:

- Un trabajo de pruebas no debería tener permisos de despliegue a producción.
- Una credencial de lectura no debería permitir modificar el repositorio.
- Un agente de compilación no debería administrar recursos que no utiliza.

### Dependencias

Las dependencias pueden introducir riesgos o cambios inesperados.

El equipo puede:

- Revisar actualizaciones.
- Fijar versiones cuando sea apropiado.
- Analizar vulnerabilidades conocidas.
- Evitar dependencias innecesarias.
- Conservar información sobre el origen de los paquetes.

### Revisión de cambios de pipeline

Los archivos del pipeline son código y deben revisarse.

Un cambio en el proceso de construcción puede:

- Exponer una credencial.
- Modificar permisos.
- Desplegar a otro entorno.
- Eliminar una validación.
- Alterar el contenido del artefacto.

## Observabilidad y recuperación

Un despliegue seguro necesita feedback después de publicar.

### Qué observar

Según el sistema, puede ser útil observar:

- Errores de aplicación.
- Tiempo de respuesta.
- Disponibilidad.
- Uso de CPU y memoria.
- Cantidad de peticiones.
- Resultados de operaciones críticas.
- Tasa de errores.
- Indicadores de experiencia de usuario.

### Comprobaciones posteriores al despliegue

Una verificación posterior puede confirmar que:

- El servicio responde.
- La aplicación informa una versión esperada.
- Una función básica sigue disponible.
- Los indicadores no superan un umbral acordado.
- No han aumentado los errores de forma inusual.

### Recuperación

El equipo debería saber qué hacer si un despliegue causa problemas.

Las opciones pueden incluir:

- Revertir a una versión anterior.
- Desactivar una funcionalidad.
- Detener el despliegue progresivo.
- Aplicar una corrección urgente.
- Redirigir tráfico a una instancia sana.
- Ejecutar un procedimiento de recuperación.

La estrategia debe probarse antes de depender de ella durante una incidencia.

## Estrategias de despliegue

No existe una única forma de desplegar una aplicación.

### Despliegue directo

La versión nueva sustituye a la anterior.

Ventajas posibles:

- Es sencillo de entender.
- Puede requerir pocos recursos adicionales.

Riesgos posibles:

- Puede provocar una interrupción.
- La recuperación puede tardar.
- Puede haber incompatibilidades durante la transición.

### Despliegue progresivo

La versión nueva se activa para una parte del sistema o de las personas usuarias.

Ventajas posibles:

- Permite observar el comportamiento de forma gradual.
- Limita inicialmente el impacto potencial.
- Facilita detener el despliegue ante señales negativas.

Riesgos posibles:

- Requiere más coordinación.
- Puede mantener varias versiones funcionando a la vez.
- La selección de tráfico necesita atención.

### Despliegue azul-verde

Se mantienen dos entornos equivalentes:

- Uno atiende el tráfico actual.
- El otro recibe la nueva versión y se valida.
- Después se cambia el tráfico al nuevo entorno.

Puede facilitar la reversión, aunque consume más recursos y requiere controlar cuidadosamente los datos y las conexiones.

### Despliegue canario

La nueva versión se entrega primero a un grupo pequeño o a una parte del tráfico.

El equipo observa su comportamiento y decide si aumenta la exposición.

El término suele describir una estrategia progresiva de reducción de riesgo.

## Ejemplo comparativo completo

Supongamos que un equipo cambia el formulario de registro de una aplicación.

### Con solo validación manual

1. Una persona modifica el formulario.
2. El cambio se envía al repositorio.
3. Otra persona lo revisa visualmente.
4. El equipo espera a que alguien pruebe el flujo manualmente.
5. La versión se despliega siguiendo instrucciones escritas.
6. Si algo falla, el equipo revisa los registros.

Este proceso puede funcionar, pero depende de pasos manuales y puede tardar más.

### Con integración continua

1. El cambio se envía al repositorio.
2. Se revisa el código.
3. El pipeline valida el formato.
4. Ejecuta pruebas unitarias.
5. Construye la aplicación.
6. Publica el resultado de las comprobaciones.

El equipo recibe feedback antes de entregar.

### Con entrega continua

1. Se ejecutan las etapas de CI.
2. Se genera un artefacto identificado.
3. El artefacto se instala en un entorno de pruebas.
4. Se ejecutan pruebas de aceptación.
5. La versión queda disponible para una decisión de publicación.
6. Una persona autorizada aprueba el despliegue.

La versión está preparada, aunque la publicación aún requiere una decisión.

### Con despliegue continuo

1. Se ejecutan todas las verificaciones definidas.
2. Se genera y valida el artefacto.
3. El pipeline lo despliega automáticamente.
4. Se ejecutan verificaciones posteriores.
5. Se observan las señales del servicio.
6. El proceso se detiene o revierte si se detectan condiciones críticas.

La decisión de desplegar está automatizada según las reglas del equipo.

## Ejemplo de sesión práctica: validar un archivo con Bash

En esta práctica crearás un archivo y una comprobación sencilla. El ejercicio simula una validación de CI local.

### Requisitos

Necesitas:

- Una terminal.
- Bash.
- Las herramientas `mkdir`, `printf`, `grep` y `chmod`.

Git es necesario para la sesión siguiente, pero no para esta parte.

### Crear el proyecto

Crea el directorio de trabajo:

```bash
mkdir practica-ci
cd practica-ci
```

Crea una carpeta para los archivos de la aplicación:

```bash
mkdir app
```

Crea un archivo con un mensaje de ejemplo:

```bash
printf 'Curso de integración continua\n' > app/mensaje.txt
```

Comprueba el contenido:

```bash
cat app/mensaje.txt
```

### Crear una validación

Crea un script llamado `validar.sh`:

```bash
cat > validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe el archivo $ARCHIVO"
  exit 1
fi

if grep -q "integración continua" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

Permite que se ejecute:

```bash
chmod +x validar.sh
```

Ejecuta la validación:

```bash
./validar.sh
```

El resultado esperado es:

```text
OK: se encontró el texto esperado
```

### Provocar un fallo

Cambia el mensaje para que no contenga el texto esperado:

```bash
printf 'Curso de automatización\n' > app/mensaje.txt
```

Ejecuta de nuevo el script:

```bash
./validar.sh
```

El script debería fallar y mostrar un mensaje explicativo.

Consulta el código de salida:

```bash
echo $?
```

Un código distinto de `0` indica que el comando anterior terminó con error.

### Recuperar la validación

Restaura un contenido válido:

```bash
printf 'Curso de integración continua\n' > app/mensaje.txt
```

Ejecuta otra vez el script:

```bash
./validar.sh
```

### Preguntas de reflexión

- ¿Qué condiciones comprueba el script?
- ¿Qué recibe una persona cuando la validación falla?
- ¿Por qué resulta útil que el script termine con un código distinto de cero?
- ¿Qué otra comprobación añadirías?
- ¿Qué parte del script se ejecutaría en un agente de Jenkins?
- ¿Qué diferencia hay entre esta validación local y una validación automática al enviar cambios?

## Ejemplo de sesión práctica: usar Git

En esta sesión guardarás cambios y revisarás el historial del proyecto.

### Comprobar Git

Comprueba si Git está disponible:

```bash
git --version
```

Si no está instalado, solicita asistencia al docente o utiliza el entorno preparado para la práctica.

### Inicializar el repositorio

Desde el directorio `practica-ci`, ejecuta:

```bash
git init
```

Comprueba el estado:

```bash
git status
```

Git indicará que existen archivos sin seguimiento.

### Añadir los archivos

Añade el archivo de aplicación y el script:

```bash
git add app/mensaje.txt validar.sh
```

Comprueba de nuevo el estado:

```bash
git status
```

Crea el primer commit:

```bash
git commit -m "Añade una validación local"
```

Si Git solicita identidad, configura un nombre y un correo para este repositorio:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Después vuelve a ejecutar el comando de `git commit`.

### Modificar un archivo

Cambia el contenido del archivo:

```bash
printf 'Curso de integración continua y Jenkins\n' > app/mensaje.txt
```

Revisa la diferencia:

```bash
git diff
```

El texto `integración continua` sigue presente, por lo que la validación debería pasar:

```bash
./validar.sh
```

Guarda el nuevo cambio:

```bash
git add app/mensaje.txt
git commit -m "Amplía el mensaje del curso"
```

Consulta el historial:

```bash
git log --oneline
```

### Ejercicio adicional

1. Cambia el contenido para que la validación falle.
2. Ejecuta `./validar.sh`.
3. Revisa el cambio con `git diff`.
4. Recupera el contenido correcto.
5. Ejecuta la validación otra vez.
6. Guarda la modificación con un nuevo commit.

### Preguntas de reflexión

- ¿Qué información aparece en un commit?
- ¿Qué diferencia hay entre un archivo modificado y un archivo confirmado en Git?
- ¿Por qué es útil revisar la diferencia antes de confirmar?
- ¿Cómo podría un sistema detectar que hay un nuevo commit?
- ¿Qué pasos de esta sesión podrían automatizarse?

## Ejemplo de sesión práctica: simular un pipeline local

En esta sesión crearás un script que ejecuta varias etapas en orden.

### Objetivo

El flujo realizará estas acciones:

1. Comprobar que existe el archivo.
2. Ejecutar la validación.
3. Crear una copia del archivo validado.
4. Mostrar un mensaje de resultado.

El ejercicio no despliega una aplicación real. Simula una pequeña parte del recorrido de un artefacto.

### Crear el script del flujo

Crea un archivo llamado `pipeline-local.sh`:

```bash
cat > pipeline-local.sh <<'EOF'
#!/usr/bin/env bash
set -eu

echo "Etapa 1: comprobar archivo"
test -f app/mensaje.txt

echo "Etapa 2: ejecutar validación"
./validar.sh

echo "Etapa 3: preparar artefacto"
mkdir -p salida
cp app/mensaje.txt salida/mensaje.txt

echo "Pipeline local completado correctamente"
EOF
```

Permite que se ejecute:

```bash
chmod +x pipeline-local.sh
```

Ejecuta el flujo:

```bash
./pipeline-local.sh
```

Comprueba el archivo generado:

```bash
cat salida/mensaje.txt
```

### Observar un fallo en una etapa

Cambia el archivo para que la validación falle:

```bash
printf 'Texto sin la frase esperada\n' > app/mensaje.txt
```

Ejecuta el flujo:

```bash
./pipeline-local.sh
```

El script debería detenerse en la etapa de validación.

Comprueba si la carpeta `salida` contiene una copia nueva:

```bash
ls -l salida
```

### Recuperar el flujo

Restaura el texto válido:

```bash
printf 'Curso de integración continua y Jenkins\n' > app/mensaje.txt
```

Vuelve a ejecutar el flujo:

```bash
./pipeline-local.sh
```

### Análisis del ejercicio

- ¿Qué etapas se ejecutaron?
- ¿En qué etapa se detuvo el flujo cuando falló la validación?
- ¿Por qué es importante detenerse antes de preparar una salida inválida?
- ¿Qué información sería conveniente guardar como artefacto?
- ¿Cómo podría ejecutarse este script en Jenkins?
- ¿Qué haría falta para que el flujo desplegara una aplicación de verdad?

## Ejemplo de sesión práctica: crear un Jenkinsfile

Esta actividad traslada la idea del pipeline local a una definición declarativa de Jenkins.

El ejemplo asume que el repositorio contiene:

```text
practica-ci/
├── app/
│   └── mensaje.txt
├── validar.sh
└── Jenkinsfile
```

### Jenkinsfile de ejemplo

Crea un archivo llamado `Jenkinsfile` en la raíz del repositorio:

```groovy
pipeline {
    agent any

    stages {
        stage('Obtener código') {
            steps {
                checkout scm
            }
        }

        stage('Validar archivos') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -x validar.sh || chmod +x validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh './validar.sh'
            }
        }

        stage('Preparar artefacto') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado correctamente.'
        }

        failure {
            echo 'El pipeline ha fallado. Revisa la etapa y sus registros.'
        }

        always {
            echo 'La ejecución del pipeline ha finalizado.'
        }
    }
}
```

### Qué representa cada parte

- `pipeline` declara un pipeline declarativo.
- `agent any` permite utilizar cualquier agente disponible.
- `stages` contiene las etapas del proceso.
- `stage` define una etapa con un propósito concreto.
- `steps` contiene los pasos ejecutados en esa etapa.
- `checkout scm` obtiene el código configurado para el trabajo.
- `sh` ejecuta comandos de shell en un agente compatible.
- `archiveArtifacts` conserva un archivo como artefacto de Jenkins.
- `post` define acciones que dependen del resultado del pipeline.

### Requisitos para ejecutar el ejemplo

El agente de Jenkins necesita:

- Acceso al repositorio.
- Una shell compatible.
- Permisos para escribir en el espacio de trabajo.
- Jenkins configurado para encontrar el `Jenkinsfile`.
- La configuración necesaria para recuperar el código fuente.

En Windows, los pasos de shell pueden requerir comandos diferentes, como `bat` o `powershell`.

### Actividad

1. Añade el `Jenkinsfile` al repositorio.
2. Confirma el cambio en Git.
3. Configura un trabajo de tipo Pipeline conectado al repositorio.
4. Ejecuta el trabajo.
5. Revisa el resultado de cada etapa.
6. Comprueba que el artefacto aparece en Jenkins.
7. Modifica `app/mensaje.txt` para provocar un fallo.
8. Vuelve a ejecutar el pipeline.
9. Identifica la etapa que falla y consulta sus registros.
10. Corrige el contenido y repite la ejecución.

### Preguntas para revisar el pipeline

- ¿Qué etapas pertenecen claramente a CI?
- ¿Qué archivo se conserva como artefacto?
- ¿Qué sucede si falla la validación?
- ¿Qué diferencia hay entre guardar un artefacto y desplegarlo?
- ¿Qué permisos debería tener el agente?
- ¿Qué credenciales necesitaría una etapa de despliegue real?
- ¿Debería este ejemplo publicar automáticamente a producción? ¿Por qué?

## Sesión práctica: distinguir entrega continua y despliegue continuo

Lee las siguientes situaciones y clasifícalas.

### Situación A

Cada cambio se integra en una rama compartida.

El pipeline ejecuta pruebas y construye una aplicación.

Una persona decide cuándo iniciar el despliegue.

**Clasificación sugerida:** integración continua, con una decisión manual de publicación.

### Situación B

Cada cambio se integra, se prueba y produce un artefacto listo para publicar.

El artefacto se despliega en un entorno de validación.

Una aprobación manual inicia el despliegue a producción.

**Clasificación sugerida:** integración continua y entrega continua.

### Situación C

Cada cambio que supera las pruebas y verificaciones se despliega automáticamente a producción.

El sistema observa métricas y puede detener o revertir el despliegue.

**Clasificación sugerida:** integración continua y despliegue continuo.

### Situación D

El equipo ejecuta pruebas una vez al final del proyecto.

Una persona copia manualmente archivos a producción siguiendo instrucciones informales.

**Clasificación sugerida:** proceso manual con poca automatización; no representa por sí mismo CI ni entrega continua.

### Situación E

El pipeline construye una imagen Docker y la publica en un registro.

Una persona responsable inicia después el despliegue a producción.

**Clasificación sugerida:** puede formar parte de CI y entrega continua. Publicar una imagen en un registro no implica automáticamente desplegarla a producción.

### Trabajo en grupo

Para cada situación, respondan:

- ¿Qué parte del proceso está automatizada?
- ¿Qué verificaciones se ejecutan?
- ¿Quién decide que el cambio se publique?
- ¿Qué información se conserva?
- ¿Qué riesgos siguen presentes?
- ¿Qué mejora pequeña propondríais?

## Diseño de un pipeline para una aplicación

Esta actividad invita a diseñar un pipeline antes de implementarlo.

### Escenario

Un equipo mantiene una aplicación web sencilla.

El repositorio contiene código, pruebas y un archivo de configuración.

El equipo quiere detectar problemas antes de publicar nuevas versiones.

### Paso 1: identificar los cambios posibles

Anotad ejemplos de cambios que podrían llegar al repositorio:

- Modificación de una página.
- Cambio en una función.
- Actualización de una dependencia.
- Ajuste de una configuración.
- Modificación de infraestructura.
- Actualización de documentación.

### Paso 2: definir comprobaciones

Para cada tipo de cambio, indicad qué comprobaciones serían útiles.

Algunas posibilidades:

- Validación de sintaxis.
- Revisión del formato.
- Pruebas unitarias.
- Pruebas de integración.
- Análisis de dependencias.
- Construcción del paquete.
- Verificación de archivos requeridos.
- Prueba manual en un entorno de validación.

### Paso 3: ordenar las etapas

Colocad primero las verificaciones que son rápidas y permiten detener el flujo con poco coste.

Un posible orden podría ser:

1. Obtener el código.
2. Validar estructura.
3. Instalar dependencias.
4. Ejecutar pruebas rápidas.
5. Construir.
6. Ejecutar pruebas más extensas.
7. Publicar el artefacto.
8. Desplegar en un entorno de prueba.
9. Solicitar aprobación.
10. Desplegar en producción.

El orden debe adaptarse al proyecto.

### Paso 4: decidir qué se automatiza

Para cada etapa, indicad si será:

- Automática al recibir un cambio.
- Manual bajo demanda.
- Condicionada por una aprobación.
- Exclusiva de una rama o entorno.

Explicad la razón de cada decisión.

### Paso 5: definir fallos y recuperación

Anotad qué debe ocurrir si:

- No se puede descargar una dependencia.
- Falla una prueba.
- No se puede generar el artefacto.
- El entorno de pruebas no está disponible.
- La aprobación tarda más de lo esperado.
- El despliegue presenta errores.

## Buenas prácticas para CI/CD

### Mantener las etapas comprensibles

Una etapa debe tener un propósito reconocible.

Nombres como `Validar`, `Probar` o `Construir` suelen ser más claros que nombres genéricos como `Paso 1`.

### Priorizar feedback útil

El resultado debería indicar:

- Qué comprobación falló.
- En qué archivo o paso.
- Qué información ayuda a corregirlo.
- Qué logs o informes se pueden consultar.

### Reducir tiempos de espera

El feedback tarda más cuando:

- Los agentes están saturados.
- Las pruebas son lentas.
- Se descargan dependencias en cada ejecución.
- Hay tareas redundantes.
- Se espera una aprobación sin responsable asignado.

La solución no siempre es añadir más recursos.

También puede convenir organizar mejor las pruebas y eliminar trabajo innecesario.

### Mantener las pruebas confiables

Una prueba que falla de forma aleatoria reduce la confianza del equipo.

Las pruebas deben revisarse como cualquier otro código.

### Proteger la rama principal

Las ramas compartidas pueden protegerse con reglas como:

- Exigir que pase el pipeline.
- Solicitar revisión antes de integrar.
- Evitar cambios directos no revisados.
- Requerir que se resuelvan conflictos.
- Limitar quién puede modificar configuraciones críticas.

### Conservar artefactos y resultados

Los artefactos y resultados deben conservarse el tiempo necesario para:

- Investigar fallos.
- Comparar versiones.
- Reproducir una entrega.
- Identificar qué se desplegó.
- Cumplir requisitos de auditoría.

La política de conservación debe equilibrar trazabilidad, coste y espacio disponible.

### Separar configuración y secretos

La configuración puede cambiar entre entornos.

Los secretos deben almacenarse en mecanismos protegidos, no en archivos públicos del repositorio ni en registros de consola.

### Revisar los permisos de los agentes

Los agentes de compilación ejecutan código y comandos.

Conviene limitar:

- Las credenciales accesibles.
- Los permisos sobre el sistema.
- El acceso a redes.
- Los entornos a los que pueden desplegar.
- La reutilización de espacios de trabajo sensibles.

## Errores habituales

### Confundir CI con despliegue automático

CI se centra en integrar y validar cambios.

No implica que el cambio se despliegue automáticamente a producción.

### Confundir entrega continua con despliegue continuo

En entrega continua, el software está preparado para publicarse, pero puede existir una decisión manual.

En despliegue continuo, la publicación a producción se automatiza cuando se cumplen las reglas establecidas.

### Pensar que un pipeline exitoso prueba todo

Un pipeline puede pasar y aun así existir errores no cubiertos por las pruebas.

El resultado debe interpretarse según el alcance de las verificaciones realizadas.

### Crear muchas etapas sin valor claro

Más etapas no significan automáticamente más calidad.

Cada etapa debería aportar una comprobación, un artefacto o una decisión útil.

### Ignorar los fallos intermitentes

Reintentar una etapa repetidamente puede ocultar un problema.

Los fallos intermitentes deben analizarse y, cuando sea posible, corregirse.

### Desplegar sin observar

El resultado del pipeline no cuenta toda la historia.

Después del despliegue conviene observar el sistema y comprobar que funciona como se esperaba.

### Automatizar sin definir responsabilidades

Si nadie sabe quién mantiene el pipeline, las automatizaciones pueden quedar obsoletas o fallar sin atención.

El equipo debería definir responsables de revisión y mantenimiento.

### Guardar secretos en el repositorio

Un secreto publicado en Git puede permanecer en el historial incluso después de borrarlo del archivo actual.

Si se expone una credencial, debe tratarse como comprometida y rotarse según el procedimiento correspondiente.

## Solución de problemas en prácticas de CI/CD

### El comando funciona localmente, pero falla en Jenkins

Posibles causas:

- El agente tiene otra versión de una herramienta.
- Falta una dependencia.
- El directorio de trabajo es diferente.
- Una variable de entorno no está definida.
- Los permisos de un archivo no se conservan.
- El sistema operativo del agente es distinto.
- El proceso depende de un archivo local no incluido en Git.

Comprobaciones recomendadas:

1. Consultar los registros de la etapa.
2. Revisar las versiones de las herramientas.
3. Comprobar qué archivos existen en el espacio de trabajo.
4. Verificar los permisos.
5. Comparar las variables de entorno necesarias.
6. Reproducir el comando desde un entorno limpio.

### El pipeline no encuentra un archivo

Comprueba:

- La ruta relativa.
- Las mayúsculas y minúsculas.
- Si el archivo está en Git.
- El directorio actual del proceso.
- Si una etapa anterior movió o eliminó el archivo.

En sistemas Linux, `Archivo.txt` y `archivo.txt` pueden ser nombres distintos.

### Una prueba falla solo en CI

Posibles causas:

- Dependencia del orden de ejecución.
- Datos de prueba compartidos.
- Diferencias de zona horaria.
- Condiciones de red.
- Dependencia de servicios externos.
- Recursos insuficientes.
- Diferencias entre sistemas operativos.

Registra información suficiente para identificar las condiciones de la ejecución.

### El artefacto no corresponde al cambio esperado

Comprueba:

- El commit utilizado por la ejecución.
- El identificador del artefacto.
- Si la etapa de construcción tomó el código correcto.
- Si el artefacto fue reemplazado o reconstruido.
- Si el despliegue seleccionó la versión prevista.

### El despliegue se completó, pero el servicio no funciona

Comprueba:

- Los registros de la aplicación.
- Las métricas del servicio.
- Las variables de configuración.
- La conectividad con dependencias.
- Los resultados de las verificaciones posteriores.
- Si existe una opción de reversión o mitigación.

## Preguntas de repaso

1. ¿Qué problema intenta resolver la integración continua?
2. ¿Qué diferencia hay entre integrar un cambio y desplegarlo?
3. ¿Qué significa que una versión esté preparada para publicarse?
4. ¿Qué diferencia hay entre entrega continua y despliegue continuo?
5. ¿Por qué CI no garantiza que una aplicación esté libre de errores?
6. ¿Qué es un artefacto?
7. ¿Por qué conviene identificar el commit asociado a un artefacto?
8. ¿Qué podría ocurrir si cada entorno recibe un artefacto construido de forma distinta?
9. ¿Qué información debería mostrar una etapa fallida?
10. ¿Por qué es importante observar el sistema después del despliegue?
11. ¿Qué podría justificar una aprobación manual?
12. ¿Qué riesgos introduce un pipeline con acceso a credenciales?
13. ¿Por qué una prueba intermitente puede reducir la confianza en CI?
14. ¿Qué pasos de la práctica local podrían transformarse en etapas de Jenkins?
15. ¿Qué características del sistema habría que conocer antes de automatizar el despliegue a producción?

## Ejercicio de evaluación

Clasifica cada afirmación como **CI**, **entrega continua**, **despliegue continuo** o **no basta la información**.

### Afirmación 1

El equipo ejecuta pruebas automáticamente cada vez que integra cambios.

### Afirmación 2

El artefacto validado queda listo para publicarse, pero una persona decide cuándo desplegarlo.

### Afirmación 3

Los cambios que superan las verificaciones se despliegan automáticamente a producción.

### Afirmación 4

El equipo construye una aplicación en Jenkins.

### Afirmación 5

Una imagen Docker se publica en un registro privado.

### Afirmación 6

El pipeline despliega automáticamente a un entorno de pruebas, pero una aprobación controla la publicación a producción.

### Afirmación 7

El equipo hace pruebas manuales antes de cada publicación.

### Afirmación 8

La rama principal se valida automáticamente, pero no se conoce el proceso de publicación.

## Respuestas orientativas del ejercicio

### Afirmación 1

Corresponde a **integración continua**, porque los cambios se validan automáticamente al integrarse.

### Afirmación 2

Corresponde a **entrega continua**, porque el software queda listo para publicarse, pero la publicación requiere una decisión.

### Afirmación 3

Corresponde a **despliegue continuo**, siempre que las verificaciones y reglas de publicación estén automatizadas.

### Afirmación 4

**No basta la información.** Construir una aplicación puede ser parte de CI, pero no sabemos cuándo se ejecuta ni qué otras verificaciones existen.

### Afirmación 5

**No basta la información.** Publicar un artefacto en un registro no indica si el software está preparado para producción ni si se despliega.

### Afirmación 6

Puede formar parte de **entrega continua**. El despliegue a pruebas está automatizado, pero la publicación a producción requiere aprobación.

### Afirmación 7

No describe por sí sola CI, entrega continua ni despliegue continuo. Es un proceso de validación manual.

### Afirmación 8

Describe una práctica de **integración continua**, pero no aporta suficiente información para determinar si existe entrega o despliegue continuo.

## Glosario

- **Agente:** máquina o proceso que ejecuta tareas de un pipeline.
- **Artefacto:** resultado generado por una compilación o proceso de empaquetado.
- **Build:** proceso que construye o empaqueta una aplicación.
- **CI:** integración continua; integración frecuente de cambios acompañada de verificaciones automatizadas.
- **CD:** abreviatura que puede referirse a entrega continua o despliegue continuo; conviene aclarar cuál de los dos conceptos se está describiendo.
- **Commit:** registro de un conjunto de cambios en un repositorio Git.
- **Despliegue:** instalación o activación de una versión en un entorno.
- **Entrega continua:** práctica de mantener el software listo para publicarse de forma controlada.
- **Despliegue continuo:** publicación automática de los cambios que superan las validaciones establecidas.
- **Etapa:** grupo de pasos relacionados dentro de un pipeline.
- **Jenkinsfile:** archivo que define un pipeline de Jenkins como código.
- **Pipeline:** secuencia de pasos para validar, construir, empaquetar o desplegar software.
- **Prueba de integración:** prueba que verifica la interacción entre componentes.
- **Prueba unitaria:** prueba que valida una unidad pequeña de código.
- **Rama:** línea de trabajo independiente dentro de un repositorio.
- **Repositorio:** espacio que contiene archivos y su historial de cambios.
- **Rollback:** reversión a una versión anterior o a un estado conocido.
- **Trazabilidad:** capacidad de relacionar un cambio con sus pruebas, artefactos y despliegues.
- **Trigger:** evento que inicia un pipeline, como un commit o una ejecución programada.

## Resumen final

- La **integración continua** integra y valida cambios con frecuencia.
- La **entrega continua** mantiene el software preparado para publicarse de manera controlada.
- El **despliegue continuo** publica automáticamente los cambios que superan las reglas definidas.
- Un pipeline puede automatizar pruebas, compilaciones, empaquetado y despliegues.
- Un artefacto identificable facilita la trazabilidad entre el código y la versión entregada.
- La automatización necesita pruebas fiables, permisos adecuados, observabilidad y mecanismos de recuperación.
- La estrategia apropiada depende del producto, el riesgo y las necesidades del equipo.
- Jenkins puede ejecutar estas etapas, pero la herramienta no sustituye el diseño del proceso.