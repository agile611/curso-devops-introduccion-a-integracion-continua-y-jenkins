# Conclusiones de DevOps y CI/CD

DevOps y CI/CD ayudan a los equipos a entregar software con más frecuencia, con feedback más rápido y con riesgos mejor controlados. No son una receta única ni una colección de herramientas que se instalan y quedan resueltas: son prácticas que conectan personas, procesos y tecnología.

En esta unidad de cierre repasaremos los conceptos fundamentales del curso y los aplicaremos en una práctica integradora. Analizarás un flujo de trabajo, ejecutarás comprobaciones locales, revisarás los cambios con Git y diseñarás un pipeline sencillo para Jenkins. El objetivo es poder explicar no solo *qué* hace cada herramienta, sino también *por qué* forma parte del proceso.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar cómo se relacionan DevOps y CI/CD.
- Resumir los principios de colaboración, automatización y aprendizaje continuo.
- Distinguir integración continua, entrega continua y despliegue continuo.
- Describir el flujo desde un cambio de código hasta su operación.
- Identificar responsabilidades de Git, Jenkins, Docker y otras herramientas del curso.
- Interpretar los resultados de una validación automatizada.
- Proponer mejoras para un proceso con esperas o pasos manuales.
- Diseñar un pipeline básico con etapas claras.
- Reconocer limitaciones y riesgos de la automatización.
- Comunicar los resultados de una práctica con información útil y sin secretos.

## El hilo conductor del curso

A lo largo del curso hemos seguido una pregunta sencilla:

> ¿Cómo puede un equipo llevar un cambio de software desde una idea hasta las personas usuarias de forma verificable, repetible y segura?

La respuesta no depende de una única herramienta. Requiere coordinar varias prácticas.

### Desde la colaboración hasta la operación

Un flujo puede incluir:

1. Acordar qué problema se quiere resolver.
2. Realizar un cambio pequeño.
3. Guardar el cambio en Git.
4. Revisarlo con otras personas.
5. Ejecutar comprobaciones automáticas.
6. Construir un artefacto.
7. Preparar una entrega.
8. Desplegar en un entorno adecuado.
9. Observar el comportamiento del servicio.
10. Aprender del resultado y mejorar el proceso.

Cada paso puede generar información que ayude a decidir qué hacer después.

### Una mejora del proceso, no una competición de herramientas

Las herramientas son importantes, pero no reemplazan:

- La comunicación clara.
- Los requisitos comprensibles.
- La revisión del trabajo.
- Las pruebas adecuadas.
- La seguridad.
- La observación del servicio.
- La responsabilidad compartida.

Una organización puede tener Jenkins, Docker y Terraform y seguir padeciendo esperas, transferencias de trabajo poco claras y despliegues manuales frágiles.

## DevOps en pocas ideas

DevOps es una forma de colaboración que busca mejorar el ciclo de vida del software.

### Qué busca DevOps

DevOps procura que los equipos puedan:

- Compartir objetivos y responsabilidad por el servicio.
- Reducir esperas entre áreas.
- Integrar cambios antes y con más frecuencia.
- Automatizar tareas repetibles.
- Obtener feedback útil con rapidez.
- Observar el servicio después de los cambios.
- Aprender de incidentes sin centrar el análisis en buscar culpables.

### Qué no es DevOps

DevOps no es:

- Un producto que se instala.
- Un puesto que resuelve todos los problemas de los demás.
- Una promesa de que nunca habrá errores.
- Una obligación de desplegar a producción cada cambio.
- Una excusa para omitir revisiones o controles.
- Una colección de comandos sin un propósito claro.

### Responsabilidad compartida

La responsabilidad compartida no significa que todas las personas hagan todas las tareas.

Significa que el equipo:

- Entiende el resultado esperado.
- Comparte la información que otras personas necesitan.
- Colabora cuando un cambio atraviesa varias áreas.
- Reconoce los riesgos antes de que lleguen tarde al proceso.
- Aprende del comportamiento del sistema completo.

### Preguntas útiles para el equipo

Cuando un cambio se retrasa, preguntad:

- ¿En qué paso se detuvo?
- ¿Qué tarea estaba esperando?
- ¿Qué información faltaba?
- ¿Qué comprobación llegó demasiado tarde?
- ¿Qué actividad manual se repite?
- ¿Cómo se detectaría antes el mismo problema?
- ¿Qué mejora pequeña se podría probar?

## Principios que conectan el flujo

Las prácticas DevOps funcionan mejor cuando se refuerzan unas a otras.

### Cambios pequeños

Los cambios pequeños suelen ser más fáciles de:

- Revisar.
- Probar.
- Entender.
- Integrar.
- Corregir.
- Revertir.

No todos los cambios pueden dividirse de la misma manera, pero acumular trabajo durante mucho tiempo suele aumentar la dificultad de integrarlo.

### Integración frecuente

La integración frecuente permite detectar diferencias cuando todavía hay contexto.

Puede reducir:

- Conflictos de código acumulados.
- Cambios incompatibles.
- Revisiones demasiado grandes.
- Sorpresas en la fase de entrega.
- Tiempo dedicado a averiguar qué modificación introdujo un fallo.

### Automatización deliberada

Automatiza tareas repetibles cuando:

- Entiendes qué hacen.
- Puedes comprobar el resultado.
- Los pasos son suficientemente estables.
- El equipo sabe quién mantiene la automatización.
- Los permisos están limitados al propósito requerido.

Automatizar un proceso confuso puede hacer que la confusión se repita más deprisa.

### Feedback rápido

El feedback puede proceder de:

- Una revisión de código.
- Una prueba automatizada.
- Un análisis de seguridad.
- Una compilación.
- Una métrica.
- Un registro.
- Una incidencia comunicada por soporte.
- La opinión de una persona usuaria.

El feedback es más útil si llega a tiempo, identifica el contexto y ayuda a decidir una acción.

### Aprendizaje continuo

El aprendizaje ocurre cuando el equipo revisa:

- Qué funcionó.
- Qué falló.
- Qué esperaba que sucediera.
- Qué sucedió realmente.
- Qué señal podría haber alertado antes.
- Qué cambio evitaría repetir el problema.

Aprender de un incidente no elimina la responsabilidad por el servicio. Ayuda a dirigirla hacia cambios que reduzcan el riesgo futuro.

## CI, entrega continua y despliegue continuo

Los términos se parecen y suelen aparecer juntos, pero describen objetivos diferentes.

### Integración continua

La **integración continua**, o CI (*Continuous Integration*), consiste en integrar cambios con frecuencia y validarlos mediante comprobaciones automatizadas.

CI puede incluir:

- Obtener el código desde Git.
- Validar archivos.
- Revisar formato.
- Ejecutar pruebas.
- Analizar dependencias.
- Construir la aplicación.
- Publicar resultados.

La pregunta orientativa de CI es:

> ¿Podemos integrar este cambio y comprobarlo pronto?

### Entrega continua

La **entrega continua**, o *Continuous Delivery*, procura que el software esté preparado para publicarse de forma controlada.

Puede incluir:

- Todas las comprobaciones de CI.
- La creación de un artefacto identificado.
- Pruebas en un entorno de validación.
- Preparación de la configuración.
- Una aprobación manual antes de producción.

La pregunta orientativa es:

> ¿Está el software listo para publicarse cuando decidamos hacerlo?

### Despliegue continuo

El **despliegue continuo**, o *Continuous Deployment*, publica automáticamente a producción los cambios que superan las reglas establecidas.

Necesita confianza en:

- Las comprobaciones.
- La calidad del artefacto.
- La observabilidad.
- Los controles de acceso.
- La capacidad de detener o revertir un despliegue.
- La respuesta ante problemas.

La pregunta orientativa es:

> ¿Podemos publicar automáticamente este cambio validado?

### Comparación rápida

| Práctica | Objetivo | Publicación automática a producción |
|---|---|---|
| Integración continua | Integrar y validar cambios con frecuencia | No necesariamente |
| Entrega continua | Mantener el software listo para publicar | No necesariamente |
| Despliegue continuo | Publicar cambios validados automáticamente | Sí, según las reglas del proceso |

### Precisión al usar «CD»

La abreviatura **CD** puede referirse a entrega continua o a despliegue continuo.

En una conversación técnica, aclara cuál de los dos conceptos se está describiendo. El control manual previo a producción es una diferencia importante.

## El papel de las herramientas

Las herramientas ayudan a implementar prácticas. Cada una cubre una parte del flujo.

### Git

Git registra cambios en archivos y facilita la colaboración.

En el flujo del curso puede servir para:

- Clonar el repositorio.
- Revisar archivos.
- Crear ramas.
- Ver diferencias.
- Confirmar cambios.
- Consultar el historial.
- Proporcionar a Jenkins una revisión concreta del código.

Git guarda el historial; no ejecuta automáticamente las pruebas por sí solo.

### Jenkins

Jenkins automatiza tareas definidas en jobs o pipelines.

Puede:

- Obtener código.
- Ejecutar comandos.
- Lanzar pruebas.
- Construir artefactos.
- Archivar resultados.
- Coordinar agentes.
- Desplegar si el pipeline y sus permisos lo permiten.

Jenkins no determina automáticamente si una prueba es suficiente para el producto.

### Docker

Docker puede empaquetar una aplicación, sus dependencias y herramientas de ejecución.

Puede apoyar:

- Entornos de prueba.
- Agentes de CI.
- Servicios de laboratorio.
- Construcción de imágenes.
- Reproducción de dependencias.

Un contenedor no es una garantía automática de seguridad ni de igualdad total entre entornos.

### Terraform

Terraform permite describir infraestructura mediante código.

Puede ayudar a:

- Revisar cambios de infraestructura.
- Mantener configuraciones reproducibles.
- Crear recursos según un plan.
- Compartir definiciones con el equipo.

Un `apply` puede modificar recursos reales. Verifica el destino y los permisos antes de ejecutarlo.

### Ansible

Ansible automatiza tareas de configuración y administración de sistemas.

Puede servir para:

- Aplicar configuración.
- Ejecutar tareas repetibles.
- Gestionar grupos de equipos.
- Documentar acciones operativas en playbooks.

Los inventarios y destinos deben limitarse a máquinas autorizadas.

### Herramientas complementarias

Un flujo puede utilizar además:

- Plataformas de repositorios.
- Registros de imágenes.
- Herramientas de pruebas.
- Sistemas de observabilidad.
- Gestores de secretos.
- Plataformas de artefactos.
- Sistemas de seguimiento de tareas.

La selección debe responder a necesidades concretas, no a la idea de acumular herramientas.

## El ciclo de vida de un cambio

Este recorrido conecta las prácticas estudiadas.

### 1. Planificar

Antes de escribir código, aclarad:

- Qué problema se quiere resolver.
- Quién necesita la mejora.
- Qué resultado sería satisfactorio.
- Qué riesgos puede tener el cambio.
- Cómo se comprobará que funciona.

### 2. Desarrollar

El cambio debe ser comprensible y coherente con el proyecto.

Conviene:

- Mantenerlo pequeño cuando sea posible.
- Seguir las convenciones existentes.
- Evitar cambios no relacionados.
- Documentar decisiones relevantes.
- No incluir credenciales.

### 3. Revisar

La revisión puede detectar:

- Errores de lógica.
- Casos no contemplados.
- Problemas de seguridad.
- Código difícil de mantener.
- Diferencias respecto a los requisitos.
- Archivos o datos añadidos por accidente.

### 4. Probar

Las comprobaciones pueden validar distintos aspectos:

- Que el código se comporta según lo esperado.
- Que los componentes se comunican.
- Que el paquete se construye.
- Que la configuración es válida.
- Que no se han introducido errores conocidos.

### 5. Construir

La construcción transforma los archivos del proyecto en uno o más artefactos.

El artefacto debe poder relacionarse con:

- La versión del código.
- La ejecución del pipeline.
- Los resultados de las pruebas.
- El entorno donde se validó.

### 6. Entregar

La entrega prepara una versión para su publicación controlada.

Puede requerir:

- Aprobación.
- Coordinación con soporte.
- Ventana de despliegue.
- Comprobación de configuración.
- Plan de recuperación.

### 7. Operar

Operar incluye:

- Mantener el servicio.
- Observar su comportamiento.
- Responder a alertas.
- Investigar incidencias.
- Administrar configuración y capacidad.

### 8. Aprender

Después del cambio, comprobad:

- Si se obtuvo el resultado esperado.
- Si hubo incidencias.
- Qué señales fueron útiles.
- Qué tareas podrían automatizarse.
- Qué documentación conviene actualizar.

## Qué es un pipeline

Un pipeline es una secuencia de pasos que valida, construye, empaqueta o despliega software.

### Etapas habituales

Una secuencia sencilla puede ser:

1. Obtener el código.
2. Validar la estructura.
3. Instalar dependencias.
4. Ejecutar pruebas rápidas.
5. Construir la aplicación.
6. Ejecutar pruebas más completas.
7. Guardar el artefacto.
8. Desplegar en un entorno de validación.
9. Solicitar aprobación.
10. Publicar, si corresponde.
11. Verificar el estado posterior al despliegue.

El orden debe adaptarse al proyecto.

### Etapas con nombres claros

Los nombres de las etapas deberían comunicar su propósito.

Ejemplos:

- `Validar`
- `Ejecutar pruebas`
- `Construir artefacto`
- `Publicar resultados`
- `Desplegar en pruebas`

Nombres como `Paso 1` o `Tarea final` aportan menos contexto.

### Fallar pronto

Las comprobaciones rápidas suelen ejecutarse antes de las costosas.

Por ejemplo:

- Validar sintaxis antes de una compilación larga.
- Comprobar archivos necesarios antes de instalar dependencias.
- Ejecutar pruebas unitarias antes de una batería completa.
- Validar variables antes de desplegar.

Una falla temprana reduce tiempo perdido y ofrece feedback antes.

### Errores visibles y explicativos

Si una etapa falla, la salida debería ayudar a contestar:

- Qué comando falló.
- Qué condición no se cumplió.
- En qué archivo o componente ocurrió.
- Qué registro o informe consultar.
- Qué paso podría reproducir el problema.

Un indicador rojo sin información adicional no es un diagnóstico completo.

## Pruebas y calidad

Las pruebas forman parte del feedback. No hay una única prueba que demuestre que un sistema está libre de defectos.

### Pruebas unitarias

Comprueban unidades pequeñas de código.

Pueden ser:

- Rápidas.
- Específicas.
- Adecuadas para ejecutarse con frecuencia.
- Útiles para detectar errores localizados.

### Pruebas de integración

Comprueban interacciones entre componentes.

Pueden validar:

- La comunicación con una base de datos.
- La integración con una API.
- La coordinación entre módulos.
- El comportamiento con dependencias simuladas.

### Pruebas de aceptación

Comprueban flujos o requisitos desde una perspectiva más cercana al uso esperado.

Ejemplos:

- Crear una cuenta.
- Enviar un formulario.
- Generar un informe.
- Completar una operación de compra.

### Análisis estático

El análisis estático inspecciona código o configuración sin ejecutar la aplicación de la forma habitual.

Puede detectar:

- Problemas de formato.
- Errores comunes.
- Patrones inseguros.
- Dependencias vulnerables.
- Configuraciones sospechosas.

### Pruebas de extremo a extremo

Validan un flujo que atraviesa varias partes del sistema.

Pueden aportar confianza en un recorrido completo, pero suelen ser más lentas y sensibles a problemas del entorno.

### Calidad proporcional al riesgo

Una modificación de documentación y un cambio en una operación crítica no tienen el mismo riesgo.

El equipo puede ajustar:

- Las pruebas necesarias.
- Las revisiones requeridas.
- La estrategia de despliegue.
- La aprobación.
- El nivel de observación posterior.

## Artefactos y trazabilidad

Un artefacto es un resultado de construcción que puede utilizarse para probar, entregar o desplegar.

### Identificar el artefacto

El artefacto puede relacionarse con:

- Un identificador de commit.
- Una etiqueta.
- Un número de compilación.
- Una versión.
- Un identificador inmutable.

La identificación permite responder:

- ¿Qué código originó este artefacto?
- ¿Qué pruebas superó?
- ¿Qué ejecución lo creó?
- ¿En qué entorno se validó?
- ¿Dónde se desplegó?

### Construir una vez y promover

Cuando el proceso lo permite, es útil construir el artefacto una vez y promover ese mismo artefacto entre entornos.

Así se reduce la posibilidad de que pruebas y producción reciban paquetes distintos construidos a partir de cambios diferentes.

### Conservar resultados

Conserva artefactos e informes según una política adecuada.

La política puede considerar:

- Coste de almacenamiento.
- Necesidad de auditoría.
- Facilidad de investigación.
- Requisitos del producto.
- Tiempo de conservación.
- Posibilidad de reproducir la versión.

## Seguridad en CI/CD

Un pipeline puede ejecutar código y acceder a credenciales. Por eso, forma parte de la superficie de seguridad del sistema.

### Credenciales

Las contraseñas, tokens, claves privadas y claves de API no deben incluirse en:

- El código fuente.
- Un `Jenkinsfile`.
- Un `README.md`.
- Logs de consola.
- Capturas públicas.
- Scripts confirmados en Git.

Utiliza el almacén de credenciales de Jenkins o el mecanismo autorizado por el curso.

### Permisos mínimos

Cada usuario, agente y job debería tener solo los permisos necesarios.

Ejemplos:

- Un agente de pruebas no necesita acceso a producción por defecto.
- Un pipeline que solo lee un repositorio no necesita permisos de escritura.
- Un job de construcción no debería poder borrar recursos de infraestructura sin motivo.
- Una credencial no debería compartirse con jobs que no la necesitan.

### Revisión de pipelines

Un cambio en el pipeline puede alterar:

- Qué comandos se ejecutan.
- Qué credenciales son accesibles.
- A qué entornos se puede desplegar.
- Qué archivos se conservan.
- Qué controles se omiten.

El pipeline es código y merece revisión.

### Dependencias

Revisa las dependencias y las imágenes que utiliza el flujo.

Considera:

- Procedencia.
- Versiones.
- Actualizaciones.
- Vulnerabilidades conocidas.
- Compatibilidad.
- Necesidad real.
- Mantenimiento.

## Observabilidad y operación

El flujo no termina cuando Jenkins muestra «éxito». El servicio debe observarse después de la entrega.

### Señales útiles

Según el sistema, pueden observarse:

- Disponibilidad.
- Tasa de errores.
- Tiempo de respuesta.
- Uso de CPU y memoria.
- Cantidad de solicitudes.
- Resultados de operaciones importantes.
- Registros de errores.
- Opiniones o informes de las personas usuarias.

### Comprobaciones posteriores

Después de un despliegue se puede comprobar:

- Que el servicio responde.
- Que la versión esperada está activa.
- Que una función crítica funciona.
- Que los errores no aumentaron de forma inusual.
- Que las dependencias siguen disponibles.

### Recuperación

Un equipo debería definir cómo responder si una entrega presenta problemas.

Las opciones pueden incluir:

- Detener un despliegue progresivo.
- Revertir a una versión anterior.
- Desactivar una funcionalidad.
- Aplicar una corrección.
- Redirigir tráfico.
- Seguir un procedimiento de recuperación.

La estrategia debe estar documentada y, cuando sea posible, probada antes de necesitarla.

## Métricas para mejorar

Las métricas permiten observar tendencias y bloqueos. No deberían transformarse en una clasificación simplista de personas o equipos.

### Ejemplos de métricas de flujo

Un equipo puede observar:

- Tiempo desde que se inicia un cambio hasta que se entrega.
- Frecuencia de entrega.
- Porcentaje de cambios que necesitan corrección.
- Tiempo de recuperación después de una incidencia.
- Tiempo de espera para una revisión.
- Duración de las etapas del pipeline.
- Porcentaje de ejecuciones que pasan a la primera.

### Interpretar con contexto

Una métrica no explica por sí sola por qué ocurrió un resultado.

Preguntas útiles:

- ¿Qué cambió durante el periodo observado?
- ¿Qué parte del proceso influye en la cifra?
- ¿Qué factores externos afectan al equipo?
- ¿Qué decisión concreta puede apoyarse en esta información?
- ¿Qué conducta podría incentivar el indicador?

### Evitar cuotas dañinas

Evita usar métricas aisladas para:

- Premiar cantidad de commits.
- Exigir una frecuencia de despliegue sin contexto.
- Comparar equipos con productos distintos.
- Penalizar que se reporten incidencias.
- Incentivar cerrar tareas sin validar su resultado.

## Errores de interpretación que conviene evitar

### «Si el pipeline pasó, no hay errores»

El pipeline solo valida lo que tiene configurado. Puede pasar y dejar sin detectar problemas fuera de su alcance.

### «CI significa despliegue automático»

CI se centra en integrar y validar cambios. El despliegue automático pertenece a una decisión y práctica distinta.

### «Automatizar elimina todo riesgo»

La automatización reduce ciertos errores manuales y puede introducir otros. Requiere revisión, pruebas, permisos adecuados y observación.

### «Más herramientas significa más madurez»

Una herramienta debe resolver una necesidad identificada. Añadir herramientas sin mantenerlas aumenta complejidad.

### «Un equipo puede entregar más rápido si omite las revisiones»

Omitir controles puede reducir el tiempo aparente de una tarea y aumentar el coste de corregir fallos después.

### «DevOps elimina los roles especializados»

Los roles especializados pueden seguir siendo necesarios. La colaboración evita que el conocimiento y la responsabilidad queden completamente aislados.

## Antipatrones y señales de alerta

Un antipatrón es una forma de trabajar que parece resolver un problema inmediato, pero tiende a generar problemas mayores.

### Pipeline que nadie mantiene

Señales:

- Falla con frecuencia.
- Usa herramientas obsoletas.
- Contiene comandos que nadie comprende.
- Los mensajes no ayudan a diagnosticar.
- Solo una persona sabe cómo cambiarlo.

Mejoras posibles:

- Documentar su propósito.
- Revisar las dependencias.
- Asignar responsabilidad de mantenimiento.
- Simplificar etapas redundantes.
- Añadir mensajes útiles.

### Agente con permisos excesivos

Señales:

- El agente comparte credenciales amplias.
- Puede acceder a sistemas ajenos al trabajo.
- Ejecuta código sin aislamiento.
- Tiene permisos administrativos sin justificación.

Mejoras posibles:

- Reducir permisos.
- Separar agentes por tarea.
- Limitar credenciales.
- Aislar trabajos no confiables.
- Revisar montajes y acceso de red.

### Aprobación sin contexto

Señales:

- Se solicita aprobar sin describir el cambio.
- No hay resultados de pruebas visibles.
- No se identifica el artefacto.
- No se explica el impacto.

Mejoras posibles:

- Presentar cambios y resultados.
- Identificar el entorno de destino.
- Mostrar riesgos conocidos.
- Definir quién aprueba y con qué criterios.

### Automatizar un procedimiento desconocido

Señales:

- Nadie entiende qué hace el script.
- Se copian comandos sin revisarlos.
- No existe una forma de comprobar el resultado.
- No se sabe cómo detener o revertir la operación.

Mejoras posibles:

- Documentar el comportamiento actual.
- Revisar los permisos y efectos.
- Probar en un entorno aislado.
- Añadir validaciones.
- Definir un plan de recuperación.

## Caso de estudio: una entrega que se retrasa

Lee el escenario y analiza el proceso.

### Situación

Un equipo termina una funcionalidad y la entrega a operaciones al final del sprint.

Operaciones no conoce una nueva variable de configuración.

Las pruebas solo se ejecutan manualmente y en un entorno compartido.

El despliegue tarda varias horas y nadie sabe con certeza cómo volver a la versión anterior.

Soporte no recibe un resumen del cambio.

### Problemas observables

Pueden aparecer:

- Transferencia de responsabilidad tardía.
- Configuración no documentada.
- Dependencia de un entorno compartido.
- Validación manual.
- Entrega grande y difícil de diagnosticar.
- Recuperación incierta.
- Comunicación incompleta con soporte.

### Propuestas posibles

El equipo podría probar:

- Incluir criterios de aceptación antes de desarrollar.
- Añadir validaciones automatizadas.
- Documentar la configuración requerida.
- Integrar cambios con mayor frecuencia.
- Preparar un paquete identificable.
- Ensayar el procedimiento de recuperación.
- Compartir una nota de entrega con soporte.
- Medir el tiempo de espera en cada etapa.

### Preguntas de discusión

- ¿Qué mejora tendría el mayor impacto inicial?
- ¿Qué información falta para desplegar con seguridad?
- ¿Qué pruebas podrían ejecutarse antes?
- ¿Qué aspecto debe revisarse con seguridad?
- ¿Qué evidencia demostraría que el proceso mejoró?
- ¿Qué riesgos siguen presentes después de automatizar?

## Sesión práctica 1: mapa del flujo de entrega

Esta actividad permite observar el proceso antes de proponer herramientas.

### Duración y organización

- Duración: 25–35 minutos.
- Modalidad: equipos de 3–5 personas.
- Material: pizarra o documento compartido.

### Instrucciones

1. Elegid un cambio sencillo de una aplicación.
2. Dibujad los pasos desde la solicitud hasta la operación.
3. Identificad qué personas o equipos intervienen.
4. Marcad las esperas.
5. Señalad los pasos manuales.
6. Indicad dónde se ejecutan las pruebas.
7. Anotad qué información se transfiere entre equipos.
8. Identificad qué ocurre si una etapa falla.
9. Proponed dos mejoras pequeñas.
10. Definid cómo comprobar si cada mejora funcionó.

### Plantilla de análisis

| Paso | Responsable | Entrada | Salida | Espera o riesgo |
|---|---|---|---|---|
| Planificar | | | | |
| Desarrollar | | | | |
| Revisar | | | | |
| Probar | | | | |
| Entregar | | | | |
| Operar | | | | |

### Puesta en común

Cada grupo presenta:

- Un cuello de botella.
- Una tarea manual repetida.
- Una mejora que no dependa de comprar una herramienta.
- Una señal para comprobar el resultado.

## Sesión práctica 2: repaso de Git

Esta práctica combina revisión, cambios pequeños y trazabilidad.

### Preparación

Utiliza el repositorio local indicado por el docente. Si no tienes uno, crea una carpeta de práctica:

```bash
mkdir -p "$HOME/practicas-devops/repaso-git"
cd "$HOME/practicas-devops/repaso-git"
git init
```

### Crear archivos de práctica

```bash
mkdir -p app scripts
printf 'Aplicación de ejemplo\n' > app/mensaje.txt
```

Crea un script de validación:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "ejemplo" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

Permite su ejecución:

```bash
chmod +x scripts/validar.sh
```

### Configurar Git si hace falta

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Utiliza la identidad indicada para el curso.

### Revisar y confirmar el primer cambio

```bash
git status
git diff
git add app/mensaje.txt scripts/validar.sh
git diff --cached
git commit -m "Añade una aplicación de ejemplo y su validación"
```

### Crear y ejecutar una validación

```bash
./scripts/validar.sh
```

El resultado esperado es:

```text
OK: se encontró el texto esperado
```

### Modificar y revisar

```bash
printf 'Aplicación de ejemplo para DevOps\n' > app/mensaje.txt
git status
git diff
./scripts/validar.sh
```

El texto `ejemplo` continúa en el archivo, así que la validación debería pasar.

### Confirmar el cambio

```bash
git add app/mensaje.txt
git diff --cached
git commit -m "Amplía el mensaje de ejemplo"
git log --oneline -2
```

### Preguntas

- ¿Qué archivos se confirmaron en cada commit?
- ¿Qué mostró `git diff`?
- ¿Por qué conviene revisar el área de preparación?
- ¿Qué ventaja tiene que el cambio sea pequeño?
- ¿Qué información permite relacionar el commit con una ejecución futura de Jenkins?

## Sesión práctica 3: automatizar una validación local

Esta práctica construye una secuencia sencilla para representar etapas de CI.

### Crear el script del flujo

Desde la raíz del proyecto, crea `pipeline-local.sh`:

```bash
cat > pipeline-local.sh <<'EOF'
#!/usr/bin/env bash
set -eu

echo "Etapa 1: comprobar estructura"
test -f app/mensaje.txt
test -x scripts/validar.sh

echo "Etapa 2: ejecutar validación"
./scripts/validar.sh

echo "Etapa 3: preparar salida"
mkdir -p salida
cp app/mensaje.txt salida/mensaje.txt

echo "Pipeline local completado correctamente"
EOF
```

Permite su ejecución:

```bash
chmod +x pipeline-local.sh
```

### Ejecutar el flujo

```bash
./pipeline-local.sh
```

Comprueba la salida:

```bash
cat salida/mensaje.txt
```

### Provocar un error

Modifica el archivo para que no incluya la palabra esperada:

```bash
printf 'Aplicación de práctica\n' > app/mensaje.txt
```

Ejecuta:

```bash
./pipeline-local.sh
```

El flujo debería detenerse en la validación.

### Restaurar el estado

```bash
printf 'Aplicación de ejemplo para DevOps\n' > app/mensaje.txt
./pipeline-local.sh
```

### Analizar el resultado

Responde:

- ¿Qué etapa se ejecutó primero?
- ¿Qué ocurrió cuando falló la validación?
- ¿Qué efecto tiene `set -eu` en este script?
- ¿Qué condición impide copiar un archivo inválido?
- ¿Qué necesitaría el pipeline para registrar resultados?
- ¿Qué parte del proceso todavía no se está automatizando?

## Sesión práctica 4: construir un pipeline de Jenkins

Esta actividad convierte la secuencia local en un `Jenkinsfile`.

El ejemplo supone esta estructura:

```text
proyecto/
├── app/
│   └── mensaje.txt
├── scripts/
│   └── validar.sh
├── pipeline-local.sh
└── Jenkinsfile
```

### Crear el `Jenkinsfile`

Crea un archivo llamado `Jenkinsfile` en la raíz:

```groovy
pipeline {
    agent any

    stages {
        stage('Validar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -x scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh './scripts/validar.sh'
            }
        }

        stage('Preparar salida') {
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
            echo 'Pipeline fallido. Revisa la etapa y los registros.'
        }

        always {
            echo 'La ejecución ha finalizado.'
        }
    }
}
```

### Revisar el ejemplo

Identifica:

- El agente donde se ejecuta el pipeline.
- Las etapas.
- Los comandos ejecutados.
- El artefacto archivado.
- Las acciones posteriores al resultado.

### Requisitos del agente

El agente debe poder:

- Obtener el código.
- Ejecutar una shell compatible.
- Encontrar los archivos esperados.
- Ejecutar el script de validación.
- Escribir dentro de su workspace.

No necesita permisos administrativos para esta práctica.

### Resultado esperado

Si los archivos están presentes y la validación pasa:

- Jenkins muestra las etapas completadas.
- El pipeline archiva `salida/mensaje.txt`.
- La consola comunica que la ejecución terminó.

Si la validación falla:

- La etapa correspondiente aparece como fallida.
- No debe presentarse la copia como una entrega correcta.
- La consola ofrece información para investigar.

### Límites del ejemplo

Este pipeline es didáctico.

No:

- Publica a producción.
- Construye una aplicación real.
- Usa credenciales.
- Ejecuta pruebas de seguridad.
- Gestiona concurrencia.
- Configura una estrategia de recuperación.

## Sesión práctica 5: experimentar con éxito y fallo

Esta actividad enseña a interpretar los resultados del pipeline.

### Preparar una ejecución correcta

1. Comprueba el contenido de `app/mensaje.txt`.
2. Ejecuta la validación local.
3. Confirma que Git no muestra cambios inesperados.
4. Inicia el job de Jenkins.
5. Revisa todas las etapas.
6. Localiza el artefacto.
7. Registra el resultado.

### Preparar una ejecución fallida

1. Cambia el archivo para que no cumpla la validación.
2. Guarda el cambio.
3. Confirma la modificación en una rama de práctica.
4. Ejecuta el job.
5. Identifica la etapa fallida.
6. Lee la consola alrededor del error.
7. Escribe una hipótesis sobre la causa.

### Recuperar el flujo

1. Corrige el contenido.
2. Ejecuta la validación local.
3. Revisa la diferencia.
4. Confirma el cambio.
5. Ejecuta Jenkins de nuevo.
6. Comprueba que el artefacto corresponde al resultado esperado.

### Registro de ejecuciones

| Ejecución | Cambio | Resultado | Etapa relevante | Aprendizaje |
|---|---|---|---|---|
| 1 | Contenido válido | | | |
| 2 | Contenido inválido | | | |
| 3 | Corrección aplicada | | | |

## Sesión práctica 6: elegir CI, entrega continua o despliegue continuo

Lee cada escenario y decide qué práctica describe.

### Escenario A

Cada cambio integrado ejecuta pruebas unitarias y una compilación.

**Interpretación:** describe integración continua si esos pasos se ejecutan de forma frecuente al integrar cambios.

### Escenario B

El pipeline construye y valida un paquete que queda listo para publicar.

Una aprobación manual inicia el despliegue a producción.

**Interpretación:** describe entrega continua, siempre que el software se mantenga preparado para esa publicación.

### Escenario C

Cada cambio que supera las verificaciones se publica automáticamente en producción.

**Interpretación:** describe despliegue continuo, de acuerdo con las reglas configuradas.

### Escenario D

Una persona ejecuta una prueba manual antes de copiar archivos a un servidor.

**Interpretación:** hay una validación manual y una transferencia manual; la situación no demuestra por sí sola CI ni entrega continua.

### Escenario E

Jenkins construye una imagen Docker y la publica en un registro.

**Interpretación:** puede ser parte de CI o entrega continua. Publicar una imagen en un registro no demuestra que haya un despliegue a producción.

### Escenario F

Jenkins despliega una aplicación automáticamente en un entorno de pruebas, pero una persona aprueba la publicación a producción.

**Interpretación:** puede formar parte de una estrategia de entrega continua. El despliegue automático a pruebas no convierte por sí solo el proceso en despliegue continuo a producción.

### Discusión

Para cada escenario, explicad:

- Qué se automatiza.
- Qué verificaciones se ejecutan.
- Quién decide la publicación.
- Qué artefacto se genera.
- Qué información se conserva.
- Qué riesgo sigue pendiente.

## Sesión práctica 7: analizar riesgos de una publicación

En esta actividad analizarás una entrega automatizada desde el punto de vista del riesgo.

### Escenario

Un pipeline puede desplegar una nueva versión de una aplicación.

El equipo todavía no ha definido:

- Quién puede iniciar el despliegue.
- Qué pruebas son obligatorias.
- Cómo se identifican los artefactos.
- Cómo se observa el servicio.
- Cómo se detiene un despliegue.
- Cómo se recupera una versión anterior.

### Tarea

Crea una lista de controles para estas áreas:

- Acceso al job.
- Acceso a credenciales.
- Agentes.
- Pruebas.
- Artefactos.
- Despliegue.
- Observabilidad.
- Recuperación.
- Comunicación con soporte.

### Preguntas

- ¿Qué permisos necesita el pipeline?
- ¿Qué permisos no necesita?
- ¿Qué condiciones detendrían la publicación?
- ¿Qué señal indicaría un problema?
- ¿Quién recibe la alerta?
- ¿Qué se debe registrar para investigar lo ocurrido?

### Resultado esperado

El grupo debería acordar controles mínimos antes de automatizar una publicación a producción.

## Sesión práctica 8: métricas y mejora continua

Esta actividad utiliza datos inventados para practicar la interpretación, no para medir personas.

### Datos del equipo

Un equipo registra:

- El tiempo entre el inicio de una tarea y su integración.
- El tiempo que espera una revisión.
- La duración del pipeline.
- La cantidad de ejecuciones fallidas.
- El tiempo de recuperación después de una incidencia.

### Tarea

Elegid una métrica y responded:

1. ¿Qué pregunta intenta responder?
2. ¿Qué periodo conviene observar?
3. ¿Qué factores de contexto pueden afectarla?
4. ¿Qué decisión podría apoyar?
5. ¿Qué comportamiento no deseado podría incentivar?
6. ¿Qué otra señal permitiría interpretarla mejor?

### Ejemplo de interpretación prudente

Si el tiempo de espera de revisión aumenta, no se puede concluir inmediatamente que quienes revisan trabajan mal.

Puede haber:

- Más cambios de lo habitual.
- Solicitudes demasiado grandes.
- Falta de responsables asignados.
- Diferencia horaria entre equipos.
- Interrupciones por incidencias.
- Revisiones que requieren conocimiento especializado.

### Resultado esperado

Proponed una mejora del proceso que no convierta la métrica en una cuota individual.

## Práctica integradora: mini proyecto de principio a fin

Esta práctica reúne los temas principales del curso mediante un proyecto pequeño.

### Propósito

El equipo creará una comprobación repetible, la guardará en Git y la ejecutará en un pipeline.

El ejercicio no requiere acceso a producción ni credenciales externas.

### Requisitos

- Una terminal con Bash.
- Git.
- Un repositorio local de práctica.
- Jenkins y un agente Linux, si la práctica se realiza en Jenkins.
- Permiso para crear una rama o un job de laboratorio.

### Crear el proyecto

```bash
mkdir -p "$HOME/practicas-devops/proyecto-final"
cd "$HOME/practicas-devops/proyecto-final"
git init
```

Crea directorios:

```bash
mkdir -p app scripts docs
```

Crea un archivo de aplicación:

```bash
printf 'Entrega de práctica DevOps\n' > app/mensaje.txt
```

### Crear una comprobación

Crea `scripts/validar.sh`:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="DevOps"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

Permite la ejecución:

```bash
chmod +x scripts/validar.sh
```

### Crear documentación mínima

Crea `README.md`:

```bash
cat > README.md <<'EOF'
# Proyecto de práctica DevOps

Este proyecto contiene un archivo de ejemplo y una validación local.

## Validar

Desde la raíz del proyecto:

```bash
./scripts/validar.sh
```

La validación debe terminar correctamente si `app/mensaje.txt`
contiene la palabra `DevOps`.
EOF
```

### Ejecutar la validación local

```bash
./scripts/validar.sh
```

Comprueba el código de salida:

```bash
echo $?
```

El resultado `0` indica que la validación terminó correctamente.

### Revisar con Git

```bash
git status
git diff
```

Configura una identidad local si es necesario:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Prepara y confirma:

```bash
git add README.md app scripts
git diff --cached
git commit -m "Crea proyecto de práctica con validación"
```

### Crear una rama para modificar el proyecto

```bash
git switch -c practica/mejora-mensaje
```

Actualiza el contenido:

```bash
printf 'Entrega final del curso DevOps y CI/CD\n' > app/mensaje.txt
```

Comprueba que la validación sigue funcionando:

```bash
./scripts/validar.sh
```

Revisa los cambios:

```bash
git status
git diff
```

Confirma el cambio:

```bash
git add app/mensaje.txt
git commit -m "Actualiza el mensaje del proyecto"
```

### Añadir el pipeline de Jenkins

Crea un `Jenkinsfile` en la raíz:

```groovy
pipeline {
    agent any

    stages {
        stage('Validar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -x scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh './scripts/validar.sh'
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
            echo 'Validación y preparación completadas.'
        }

        failure {
            echo 'Revisa la etapa fallida y sus registros.'
        }

        always {
            echo 'Ejecución finalizada.'
        }
    }
}
```

Añade y confirma el archivo:

```bash
git add Jenkinsfile
git diff --cached
git commit -m "Añade pipeline de validación"
```

### Ejecutar en Jenkins

Sigue la configuración de job indicada por el docente.

Comprueba:

- Que Jenkins obtiene el repositorio correcto.
- Que el agente dispone de Bash y Git.
- Que el workspace contiene los archivos esperados.
- Que las etapas aparecen en el orden previsto.
- Que el artefacto se archiva.
- Que los logs no contienen secretos.

### Provocar un fallo controlado

Cambia el mensaje para que no contenga `DevOps`:

```bash
printf 'Entrega de práctica automatizada\n' > app/mensaje.txt
```

Confirma el cambio en una rama de práctica y ejecuta Jenkins.

Comprueba:

- Qué etapa falla.
- Qué mensaje aparece.
- Si se crea el artefacto.
- Qué información ayuda a corregir el error.

Restaura un mensaje válido y ejecuta el pipeline de nuevo.

### Reflexión final del proyecto

Responde:

- ¿Qué parte representa CI?
- ¿El proyecto realiza entrega continua?
- ¿El proyecto despliega a producción?
- ¿Qué prueba adicional sería útil?
- ¿Qué información conserva el artefacto?
- ¿Qué permisos necesita el agente?
- ¿Qué deberías añadir antes de desplegar en un entorno real?

## Rúbrica para el proyecto integrador

La práctica puede evaluarse con criterios claros y observables.

### Repositorio

- La estructura del proyecto es comprensible.
- Los commits tienen mensajes descriptivos.
- No se incluyen secretos.
- Los cambios están relacionados con el objetivo del ejercicio.
- El README permite ejecutar la validación.

### Validación

- El script comprueba que el archivo existe.
- La condición esperada está definida.
- El resultado correcto produce código de salida `0`.
- El resultado incorrecto produce un código distinto de `0`.
- Los mensajes ayudan a entender el resultado.

### Pipeline

- Las etapas tienen nombres claros.
- La validación se ejecuta antes de preparar el artefacto.
- Los fallos detienen la ejecución.
- El artefacto se identifica y conserva.
- La consola ofrece información útil.

### Seguridad

- No hay credenciales en el repositorio.
- El agente no necesita permisos administrativos.
- No se despliega a producción.
- Las instrucciones son adecuadas para un laboratorio.

### Comunicación

- El alumno explica qué comprueba el flujo.
- El alumno puede interpretar un resultado fallido.
- El alumno identifica limitaciones del ejercicio.
- El alumno propone una mejora razonable.

## Cómo presentar una mejora DevOps

Una propuesta de mejora debe ser concreta y verificable.

### Estructura recomendada

Describe:

- **Problema:** qué ocurre actualmente.
- **Evidencia:** cómo se observó.
- **Propuesta:** qué cambio se probará.
- **Riesgo:** qué podría salir mal.
- **Medición:** cómo se evaluará el resultado.
- **Responsable:** quién mantendrá la mejora.
- **Revisión:** cuándo se decidirá si se conserva.

### Ejemplo

**Problema:** las pruebas de validación se ejecutan solo antes de publicar.

**Evidencia:** varias correcciones fallidas se descubrieron durante la preparación de la entrega.

**Propuesta:** ejecutar la validación al integrar cada cambio.

**Riesgo:** aumentar la duración del pipeline si la prueba es lenta.

**Medición:** observar el tiempo de feedback y la cantidad de fallos detectados antes de la entrega.

**Responsable:** el equipo que mantiene el pipeline.

**Revisión:** evaluar el resultado después de dos semanas de uso.

## Checklist de un flujo saludable

Un flujo de CI/CD puede revisarse con preguntas como estas:

### Código y cambios

- [ ] ¿Los cambios se integran con frecuencia?
- [ ] ¿Las revisiones tienen criterios claros?
- [ ] ¿Los cambios incluyen contexto y propósito?
- [ ] ¿Se evitan secretos en el repositorio?

### Pruebas y construcción

- [ ] ¿Las pruebas importantes se ejecutan automáticamente?
- [ ] ¿Los fallos muestran mensajes comprensibles?
- [ ] ¿El artefacto se relaciona con un commit?
- [ ] ¿Se conoce la duración de las etapas?

### Entrega y despliegue

- [ ] ¿Está claro quién autoriza la publicación?
- [ ] ¿El destino está identificado?
- [ ] ¿Existe una estrategia de recuperación?
- [ ] ¿Se observan señales posteriores al despliegue?

### Operación y aprendizaje

- [ ] ¿Las incidencias dejan aprendizajes documentados?
- [ ] ¿Las métricas se interpretan con contexto?
- [ ] ¿Las automatizaciones tienen responsables?
- [ ] ¿Se revisa periódicamente el proceso?

## Errores frecuentes al cerrar el curso

### Confundir velocidad con eficiencia

Un proceso puede publicar con rapidez y producir muchas correcciones.

La mejora debe considerar calidad, riesgo, estabilidad y feedback, no solo rapidez.

### Tratar el pipeline como caja negra

Si nadie entiende una etapa, será difícil mantenerla o diagnosticarla.

Documenta el propósito de cada etapa y simplifica los pasos que no aportan valor.

### Conservar automatizaciones obsoletas

Un pipeline sin mantenimiento puede utilizar versiones antiguas, credenciales innecesarias o instrucciones que ya no coinciden con el proceso.

Revisa sus dependencias y resultados.

### Medir sin decidir

Una métrica que nadie interpreta ni utiliza añade trabajo, no conocimiento.

Define qué pregunta responde y qué decisión puede apoyar.

### Desplegar sin observar

El final de la ejecución de Jenkins no es necesariamente el final del proceso.

Comprueba cómo se comporta el servicio después de una entrega.

### Buscar culpables en lugar de causas

Culpar puede reducir la comunicación de errores y riesgos.

Investiga las condiciones del proceso, conserva la responsabilidad y acuerda mejoras concretas.

## Recomendaciones para seguir aprendiendo

Después de esta unidad, puedes profundizar en:

- Git y estrategias de ramas.
- Jenkins declarativo y bibliotecas compartidas.
- Diseño de pruebas automatizadas.
- Contenedores e imágenes reproducibles.
- Seguridad de pipelines y gestión de secretos.
- Infraestructura como código.
- Gestión de configuración.
- Observabilidad.
- Estrategias de despliegue progresivo.
- Recuperación y respuesta ante incidentes.
- Métricas de flujo de trabajo.
- Mantenimiento de agentes y plugins.

Aprende cada tema mediante prácticas pequeñas y aisladas antes de conectarlo con sistemas importantes.

## Preguntas de repaso

1. ¿Qué objetivo general persigue DevOps?
2. ¿Qué diferencia hay entre una herramienta y una práctica?
3. ¿Qué valida la integración continua?
4. ¿Qué significa mantener el software listo para publicar?
5. ¿Qué característica distingue el despliegue continuo?
6. ¿Por qué un pipeline exitoso no demuestra que la aplicación esté libre de errores?
7. ¿Qué papel tiene Git en el flujo?
8. ¿Qué papel tiene Jenkins?
9. ¿Qué diferencia hay entre un artefacto y un workspace?
10. ¿Por qué los agentes deben tener permisos limitados?
11. ¿Qué señales conviene observar después de un despliegue?
12. ¿Qué información hace útil una métrica?
13. ¿Por qué una aprobación manual no reemplaza las pruebas?
14. ¿Qué puede hacer un equipo ante una prueba inestable?
15. ¿Qué diferencia hay entre desplegar una funcionalidad y activarla para usuarios?
16. ¿Por qué conviene construir un artefacto identificable?
17. ¿Qué información debe incluir un informe de fallo?
18. ¿Qué pasos de la práctica integradora corresponden a CI?
19. ¿Qué partes faltarían para hablar de entrega continua?
20. ¿Qué decisiones serían necesarias antes de desplegar automáticamente a producción?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«DevOps se consigue instalando Jenkins».

### Afirmación 2

«La integración continua puede ejecutar pruebas al integrar cambios».

### Afirmación 3

«La entrega continua requiere desplegar cada cambio automáticamente a producción».

### Afirmación 4

«El despliegue continuo automatiza la publicación de los cambios que superan las reglas definidas».

### Afirmación 5

«Un pipeline puede pasar y aun así quedar fuera de su alcance un defecto».

### Afirmación 6

«Las credenciales deberían guardarse en texto claro dentro del `Jenkinsfile` para facilitar su uso».

### Afirmación 7

«La observabilidad ayuda a entender cómo se comporta un servicio después de un despliegue».

### Afirmación 8

«Una métrica debe interpretarse teniendo en cuenta el contexto».

### Afirmación 9

«Un agente de pruebas necesita automáticamente acceso a producción».

### Afirmación 10

«Una automatización puede repetir un error con mucha rapidez».

### Afirmación 11

«Un artefacto identificable ayuda a relacionar el resultado con su código de origen».

### Afirmación 12

«La frecuencia de publicación debe ser idéntica para todos los productos».

### Afirmación 13

«Las pruebas automatizadas sustituyen toda revisión humana».

### Afirmación 14

«Un cambio pequeño suele ser más fácil de revisar que uno muy grande».

### Afirmación 15

«Una aprobación manual puede formar parte de un proceso de entrega continua».

## Respuestas orientativas del ejercicio

### Afirmación 1

**Incorrecta.** Jenkins puede apoyar prácticas DevOps, pero no crea por sí solo colaboración o mejora continua.

### Afirmación 2

**Correcta.** Esa es una práctica habitual de CI.

### Afirmación 3

**Incorrecta.** La entrega continua mantiene el software listo para una publicación controlada; puede existir una aprobación manual.

### Afirmación 4

**Correcta.** Describe la idea de despliegue continuo según las reglas definidas.

### Afirmación 5

**Correcta.** El pipeline solo comprueba las condiciones configuradas.

### Afirmación 6

**Incorrecta.** Las credenciales deben gestionarse mediante mecanismos protegidos.

### Afirmación 7

**Correcta.** Los registros, métricas y trazas ayudan a investigar el comportamiento.

### Afirmación 8

**Correcta.** Un número aislado no explica las condiciones que lo produjeron.

### Afirmación 9

**Incorrecta.** Los permisos del agente deben limitarse a lo necesario.

### Afirmación 10

**Correcta.** La automatización puede repetir acciones incorrectas si el proceso está mal definido.

### Afirmación 11

**Correcta.** La trazabilidad permite relacionar artefacto, código y ejecución.

### Afirmación 12

**Incorrecta.** La frecuencia depende del producto, el riesgo y las necesidades del equipo.

### Afirmación 13

**Incorrecta.** Las pruebas automatizadas complementan la revisión; no cubren todos los aspectos.

### Afirmación 14

**Correcta.** Los cambios pequeños suelen ser más sencillos de entender y corregir.

### Afirmación 15

**Correcta.** Puede existir una aprobación antes de publicar y seguirse una práctica de entrega continua.

## Glosario final

- **Agente:** nodo que ejecuta tareas de Jenkins.
- **Artefacto:** resultado empaquetado o generado por una construcción.
- **Automatización:** ejecución de pasos mediante instrucciones reproducibles.
- **CI:** integración continua; integración frecuente con validaciones automatizadas.
- **CD:** abreviatura que puede referirse a entrega continua o despliegue continuo.
- **Commit:** registro de cambios en Git.
- **Despliegue:** instalación o activación de una versión en un entorno.
- **Entrega continua:** práctica de mantener el software listo para publicarse de forma controlada.
- **Feedback:** información sobre el resultado de un cambio, prueba o servicio.
- **Jenkinsfile:** archivo que define un pipeline de Jenkins como código.
- **Observabilidad:** capacidad de investigar un sistema a partir de registros, métricas y trazas.
- **Pipeline:** secuencia de etapas para validar, construir, entregar o desplegar software.
- **Prueba de integración:** prueba que comprueba la interacción entre componentes.
- **Prueba unitaria:** prueba que valida una unidad pequeña de código.
- **Rollback:** acción de volver a una versión o estado anterior conocido.
- **Trazabilidad:** capacidad de relacionar cambios, pruebas, artefactos y despliegues.
- **Workspace:** directorio de trabajo utilizado durante una ejecución.
- **Despliegue continuo:** publicación automática de cambios que superan las reglas establecidas.

## Síntesis final

DevOps conecta la colaboración con la operación del software y la mejora del proceso.

CI, entrega continua y despliegue continuo describen prácticas relacionadas, pero distintas:

- CI integra y valida cambios con frecuencia.
- Entrega continua mantiene el software preparado para publicar.
- Despliegue continuo publica automáticamente cambios validados.

Git, Jenkins, Docker, Terraform y Ansible pueden apoyar distintas partes del flujo. Su valor depende de cómo se utilicen, qué problema resuelvan y qué controles los acompañen.

Un flujo saludable busca cambios comprensibles, pruebas útiles, feedback rápido, artefactos identificables, permisos limitados, observación del servicio y aprendizaje continuo. No promete eliminar todos los errores; ayuda a detectarlos antes y a responder mejor cuando aparecen.