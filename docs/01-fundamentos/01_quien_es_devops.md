# Qué es DevOps?

DevOps es una forma de trabajar que ayuda a los equipos de desarrollo y operaciones a colaborar para entregar software de manera **más frecuente, fiable y segura**.

El término combina *Development* (desarrollo) y *Operations* (operaciones), pero **DevOps no consiste simplemente en unir dos departamentos**, instalar una herramienta o asignar el título de «ingeniero DevOps» a una persona. Implica revisar cómo se organiza el trabajo, cómo se comparte la responsabilidad y cómo se automatizan las tareas repetitivas.

En esta unidad aprenderás qué problema intenta resolver DevOps, cuáles son sus principios y cómo reconocerlos en situaciones cotidianas. También verás cómo encaja DevOps con la integración continua y la entrega de software. Al final realizarás actividades de análisis y una práctica guiada para simular un flujo de trabajo.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar con tus propias palabras qué significa DevOps.
- Describir los problemas que aparecen cuando desarrollo y operaciones trabajan como silos.
- Diferenciar una cultura DevOps de la simple instalación de herramientas.
- Identificar prácticas de colaboración, automatización, medición y aprendizaje continuo.
- Reconocer el flujo básico desde un cambio de código hasta su entrega.
- Relacionar DevOps con integración continua, entrega continua y despliegue continuo.
- Analizar un proceso y proponer mejoras pequeñas y verificables.
- Identificar cómo Jenkins, Git, Docker, Terraform y Ansible pueden apoyar un flujo DevOps.

## Qué significa DevOps

DevOps es un **conjunto de principios, prácticas y hábitos de colaboración** que busca mejorar el ciclo de vida del software, desde la idea inicial hasta su operación y mantenimiento.

En un equipo tradicional, desarrollo puede centrarse en crear funcionalidades, mientras operaciones se ocupa de ejecutar y mantener los sistemas. Si ambos grupos trabajan sin coordinación, sus objetivos pueden entrar en conflicto:

- Desarrollo intenta publicar cambios rápidamente.
- Operaciones intenta reducir el riesgo de cambios en producción.
- El equipo de pruebas recibe cambios tarde y con poco tiempo para validarlos.
- Los problemas se investigan después de la entrega, cuando el impacto ya es mayor.

DevOps busca que las personas involucradas colaboren durante todo el proceso y compartan la responsabilidad por el resultado. Esto no significa que todas las personas deban hacer el mismo trabajo. Significa que el equipo conoce el flujo completo y se coordina para que el software llegue a las personas usuarias con la calidad esperada.

### DevOps no es una persona concreta

En muchas empresas existen puestos con nombres como *DevOps Engineer* o *Platform Engineer*. Esos roles pueden ser útiles, pero **DevOps no depende de una persona que haga todo por los demás**.

Una organización puede tener profesionales especializados en infraestructura, automatización o plataformas y, aun así, trabajar de forma DevOps si los equipos colaboran, automatizan tareas y aprenden de los resultados.

Del mismo modo, cambiar el nombre de un puesto no transforma automáticamente la manera de trabajar. Si una persona recibe todas las tareas de despliegue, configuración y soporte, mientras los demás equipos siguen aislados, el cuello de botella simplemente ha cambiado de nombre.

### DevOps no es una herramienta

Jenkins, Git, Docker, Terraform, Ansible y los sistemas de observabilidad pueden apoyar prácticas DevOps, pero ninguno de ellos es DevOps por sí solo.

Por ejemplo:

- **Jenkins** puede automatizar una compilación, pero no resolver la falta de comunicación del equipo.
- **Git** puede mantener el historial de cambios, pero no garantiza que los cambios se revisen.
- **Docker** puede empaquetar una aplicación, pero no evita una configuración incorrecta.
- **Terraform** puede describir infraestructura, pero el equipo debe definir cómo revisar y aplicar sus cambios.
- **Ansible** puede automatizar la configuración de sistemas, pero es necesario validar las tareas y controlar dónde se ejecutan.

Las herramientas son **medios**. El objetivo es mejorar el flujo de trabajo y la calidad del servicio.

### DevOps no significa publicar sin control

Entregar cambios con frecuencia no significa ignorar las pruebas, la seguridad o las aprobaciones necesarias. Un proceso DevOps busca que los cambios pequeños puedan verificarse y entregarse con un nivel de riesgo controlado.

La frecuencia de publicación debe adaptarse al producto, al equipo y a los requisitos del servicio. **Rapidez sin calidad no es una mejora**.

### DevOps busca mejorar el sistema completo

Una mejora local puede empeorar el flujo general. Por ejemplo, un equipo podría terminar más tareas por semana, pero generar tantas entregas incompletas que las pruebas y operaciones no puedan procesarlas.

Por eso, conviene analizar el proceso de principio a fin:

- ¿Cuánto tarda un cambio desde que se propone hasta que está disponible?
- ¿Dónde se acumula trabajo pendiente?
- ¿Qué actividades se repiten manualmente?
- ¿En qué momento se detectan los errores?
- ¿Qué información se pierde al pasar una tarea de un equipo a otro?

El objetivo no es que cada área optimice únicamente su parte, sino que el flujo completo funcione mejor.

## El problema de trabajar en silos

Un silo es un grupo que trabaja con objetivos, información y responsabilidades separados de los demás. Los silos dificultan que un cambio llegue desde la idea hasta las personas usuarias.

### Ejemplo de un proceso desconectado

Imagina este flujo:

1. Desarrollo termina una funcionalidad y la entrega al equipo de operaciones.
2. Operaciones descubre que faltan instrucciones de configuración.
3. Desarrollo considera que el problema es del entorno.
4. Operaciones considera que el problema es de la aplicación.
5. La entrega se retrasa mientras ambos equipos investigan.
6. La corrección se realiza con urgencia y sin suficiente validación.

El problema no tiene por qué ser la falta de esfuerzo individual. Puede deberse a que el proceso no comparte información ni responsabilidad de principio a fin.

### Consecuencias frecuentes

Cuando los equipos trabajan aislados, pueden aparecer:

- Entregas grandes y difíciles de revisar.
- Esperas entre desarrollo, pruebas y operaciones.
- Errores que solo aparecen en un entorno concreto.
- Cambios manuales que no quedan documentados.
- Dudas sobre quién debe resolver una incidencia.
- Repetición de tareas que podrían automatizarse.
- Información incompleta sobre los cambios realizados.
- Miedo a desplegar porque cada entrega representa demasiado riesgo.
- Correcciones urgentes que interrumpen el trabajo planificado.

### La pregunta útil

En vez de preguntar **«¿quién tiene la culpa?»**, un equipo puede preguntar:

- ¿En qué paso se detuvo el flujo?
- ¿Qué información faltaba?
- ¿Qué parte de la tarea fue manual?
- ¿Cómo podríamos detectar el problema antes?
- ¿Qué pequeño cambio evitaría que se repitiera?
- ¿Qué señal nos habría permitido identificar el problema más rápidamente?

Este cambio de enfoque no elimina la responsabilidad. La dirige hacia la mejora del sistema y la prevención de nuevos problemas.

## Principios y prácticas de DevOps

DevOps se concreta en prácticas que conectan a las personas, los procesos y la tecnología.

### Colaboración y responsabilidad compartida

Las personas que desarrollan, prueban y operan un servicio necesitan compartir información y objetivos.

Esto puede incluir:

- Revisar los cambios antes de integrarlos.
- Acordar cómo se consideran «terminadas» las tareas.
- Involucrar a operaciones y seguridad antes de que una decisión sea difícil de cambiar.
- Compartir la información necesaria para investigar problemas.
- Tratar las incidencias como oportunidades de aprendizaje, no como competiciones para encontrar culpables.
- Documentar decisiones importantes y hacerlas accesibles a quienes las necesitan.

La responsabilidad compartida no significa que todas las personas hagan todas las tareas. Significa que el equipo se preocupa por el resultado completo y no considera que el trabajo ha terminado cuando simplemente pasa a otra área.

### Automatización

La automatización reduce tareas repetitivas y permite ejecutar pasos de forma consistente.

Algunos ejemplos son:

- Ejecutar pruebas automáticamente al modificar el código.
- Crear una compilación de manera reproducible.
- Generar un paquete de entrega mediante un procedimiento conocido.
- Aplicar configuraciones mediante código.
- Ejecutar comprobaciones antes de aceptar un cambio.
- Crear entornos de prueba de forma repetible.
- Recopilar resultados y registros de una ejecución.

La automatización también puede repetir un error a gran velocidad. Por eso, antes de automatizar una tarea, conviene entenderla y definir cómo comprobar que su resultado es correcto.

Una buena automatización debe ser:

- **Repetible:** producir resultados consistentes al ejecutarse varias veces.
- **Comprensible:** mostrar qué pasos realiza y por qué.
- **Verificable:** permitir comprobar si tuvo éxito.
- **Segura:** limitar sus permisos y evitar exponer información sensible.
- **Mantenible:** poder actualizarse cuando cambia el proceso.

### Cambios pequeños y frecuentes

Un cambio pequeño suele ser más fácil de entender, revisar y corregir que uno muy grande. Integrar cambios con frecuencia reduce el tiempo durante el cual dos partes del trabajo avanzan sin comprobar su compatibilidad.

Por ejemplo, si dos personas trabajan durante varias semanas en copias separadas de la misma aplicación, la integración final puede revelar muchos conflictos a la vez. Si integran el trabajo de manera frecuente, los problemas suelen aparecer antes y son más sencillos de localizar.

Esto no significa que cualquier cambio tenga que publicarse inmediatamente. Significa que el equipo procura mantener el trabajo integrado, revisable y comprobable.

### Feedback rápido

El *feedback* es la información que permite saber si un cambio funciona.

Puede proceder de:

- Revisiones de código.
- Pruebas automatizadas.
- Comprobaciones de seguridad.
- Resultados de una compilación.
- Registros y métricas del sistema.
- Opiniones de las personas usuarias.
- Incidencias notificadas por soporte.
- Resultados de una prueba en un entorno controlado.

Cuanto antes se detecta un problema, más contexto suele tener el equipo para investigarlo. Un mensaje claro en una prueba fallida puede ahorrar tiempo frente a descubrir el mismo error días después durante una entrega.

### Calidad integrada en el proceso

La calidad no debería comprobarse únicamente al final. Las prácticas DevOps intentan incorporar verificaciones a lo largo del flujo.

Estas verificaciones pueden incluir:

- Revisar el código.
- Ejecutar pruebas.
- Comprobar formatos y convenciones.
- Analizar dependencias.
- Buscar configuraciones inseguras.
- Verificar que los artefactos se construyen correctamente.
- Confirmar que los cambios de infraestructura están revisados.

Las comprobaciones deben ser proporcionales al riesgo. Una modificación sencilla y una modificación crítica pueden necesitar niveles de validación diferentes.

### Seguridad desde el inicio

La seguridad es más efectiva cuando forma parte del diseño y del trabajo cotidiano, no cuando se añade como una revisión de última hora.

Algunas prácticas posibles son:

- No guardar contraseñas o tokens en el código fuente.
- Limitar los permisos de usuarios y procesos.
- Revisar dependencias y sus actualizaciones.
- Proteger los secretos mediante mecanismos adecuados.
- Analizar cambios de infraestructura antes de aplicarlos.
- Registrar las operaciones importantes.
- Incluir a las personas responsables de seguridad en las decisiones relevantes.

La seguridad no es únicamente responsabilidad de un equipo especializado. Las personas que construyen, revisan y operan un servicio pueden contribuir a reducir riesgos.

### Medición y observabilidad

Medir ayuda a entender el comportamiento del proceso y del servicio. La observabilidad permite investigar qué está pasando en un sistema mediante señales como registros, métricas y trazas.

- **Registros (*logs*):** eventos o mensajes generados por una aplicación o sistema.
- **Métricas:** valores numéricos observados a lo largo del tiempo, como el uso de memoria o la duración de una operación.
- **Trazas:** información sobre el recorrido de una petición a través de distintos componentes.

Medir no consiste en vigilar a las personas ni en crear clasificaciones individuales. Las métricas son útiles cuando ayudan al equipo a detectar bloqueos, tendencias o riesgos.

### Aprendizaje continuo

Los procesos, las aplicaciones y los entornos cambian. Un equipo DevOps revisa lo ocurrido y adapta sus prácticas.

El aprendizaje puede producirse mediante:

- Revisiones periódicas del proceso.
- Análisis de incidencias centrados en causas y mejoras.
- Documentación de decisiones importantes.
- Pruebas de cambios en entornos controlados.
- Intercambio de conocimiento entre equipos.
- Revisión de automatizaciones que ya no representan el proceso real.

Una incidencia puede revelar una oportunidad para mejorar una prueba, una alerta, una guía de operación o una parte del diseño. Aprender de un problema no significa ignorar su impacto: significa reducir la posibilidad de que vuelva a ocurrir.

## El ciclo de trabajo del software

Un ciclo de trabajo sencillo puede representarse de esta manera:

```text
Planificar → Desarrollar → Revisar → Probar → Entregar → Operar → Aprender
     ↑                                                               |
     └────────────────────── feedback y mejoras ─────────────────────┘
```

No siempre es un recorrido estrictamente lineal. Los equipos reciben información durante todo el proceso y pueden volver a pasos anteriores. Por ejemplo, una prueba puede descubrir que los requisitos no estaban claros, o una incidencia puede mostrar que hace falta modificar el diseño.

### Planificar

El equipo define qué problema intenta resolver y cómo comprobará que el cambio lo resuelve.

Una tarea bien planteada suele indicar:

- Qué se necesita.
- Por qué es importante.
- Cómo se comprobará el resultado.
- Qué limitaciones o riesgos existen.
- Qué equipos o servicios podrían verse afectados.

### Desarrollar e integrar

El cambio se realiza y se comparte mediante un sistema de control de versiones como Git. Revisar e integrar el trabajo con frecuencia ayuda a detectar incompatibilidades antes de que se acumulen.

El control de versiones también permite consultar qué cambió, quién lo incorporó y cuándo. Esta información facilita revisar el historial y entender decisiones anteriores.

### Revisar

La revisión puede ayudar a detectar problemas de lógica, errores, riesgos de seguridad o diferencias respecto a los requisitos.

Una revisión útil es clara y respetuosa. Se centra en el cambio y en sus consecuencias, no en juzgar a la persona que lo escribió.

### Probar

Las pruebas comprueban distintos aspectos del cambio. Según el proyecto, pueden incluir pruebas unitarias, de integración, de aceptación, análisis estático o comprobaciones de seguridad.

Las pruebas no garantizan que nunca haya errores, pero reducen la probabilidad de que problemas conocidos lleguen a etapas posteriores.

### Entregar y operar

La entrega pone una versión a disposición de las personas usuarias o de quienes operan el servicio. Operar incluye mantener el sistema, observar su comportamiento y responder a incidencias.

La entrega puede estar automatizada total o parcialmente. La forma adecuada depende del nivel de riesgo y de los requisitos del servicio.

### Aprender y mejorar

El equipo utiliza los resultados para decidir qué mantener y qué cambiar. Por ejemplo, si una prueba detecta siempre el mismo tipo de error tarde, puede ser útil incorporar una comprobación anterior en el flujo.

El ciclo se repite: cada cambio y cada incidencia pueden aportar información para mejorar el producto y el proceso.

## DevOps y CI/CD

DevOps y CI/CD están relacionados, pero no son sinónimos.

### Integración continua

La **integración continua** (*Continuous Integration*, CI) consiste en integrar cambios de código de forma frecuente y comprobarlos mediante automatización.

Un flujo de CI puede:

1. Obtener el código desde un repositorio.
2. Revisar o validar el formato.
3. Compilar la aplicación.
4. Ejecutar pruebas.
5. Publicar los resultados para que el equipo los revise.

CI ayuda a detectar problemas pronto, pero no garantiza por sí sola que el software esté preparado para producción.

### Entrega continua

La **entrega continua** (*Continuous Delivery*) busca mantener el software en condiciones de poder publicarse de manera controlada.

La preparación de una entrega puede estar automatizada, mientras que la decisión de publicar puede requerir una aprobación manual, según las necesidades del producto.

### Despliegue continuo

El **despliegue continuo** (*Continuous Deployment*) automatiza la publicación de cada cambio que supera las verificaciones establecidas.

No todos los equipos ni todos los productos necesitan desplegar automáticamente cada cambio. La estrategia depende del riesgo, los requisitos regulatorios, la arquitectura y la capacidad de observar y revertir cambios.

### Cómo se relacionan

- **DevOps** aborda la colaboración y la mejora del ciclo de vida del software.
- **CI** es una práctica para integrar y validar cambios con frecuencia.
- **Entrega continua** prepara el software para una publicación controlada.
- **Despliegue continuo** publica automáticamente los cambios que superan las validaciones.

Un pipeline de Jenkins puede automatizar pasos de CI/CD y apoyar prácticas DevOps. Sin embargo, un pipeline por sí solo no garantiza colaboración, feedback útil ni aprendizaje.

## Ejemplo: una mejora en una aplicación

Un equipo recibe una solicitud para mostrar un mensaje de bienvenida en una aplicación.

### Enfoque con poca colaboración

1. Desarrollo implementa el mensaje.
2. El cambio se entrega al final de la semana.
3. Operaciones intenta desplegarlo y encuentra una configuración que no conocía.
4. El equipo investiga el problema manualmente.
5. La entrega se aplaza.
6. Nadie sabe con claridad si el mensaje nuevo se ha probado en todos los entornos.

### Enfoque con prácticas DevOps

1. El equipo acuerda qué debe mostrar la aplicación y cómo comprobarlo.
2. Desarrollo crea un cambio pequeño en Git.
3. Otra persona revisa el cambio.
4. Una comprobación automática valida el contenido.
5. El equipo usa un procedimiento conocido para preparar la entrega.
6. Después de la entrega, observa el resultado y recoge *feedback*.
7. Si aparece un problema, el equipo registra lo aprendido y decide cómo evitar que se repita.

La diferencia principal no es que en el segundo caso se utilice una herramienta específica. La diferencia está en que el trabajo se hace visible, verificable y compartido.

## Indicadores para mejorar el proceso

Las métricas pueden ayudar a entender cómo funciona un proceso, siempre que se interpreten en contexto. No deben usarse como objetivos aislados ni como medida del valor de cada persona.

### Indicadores relacionados con el flujo

Un equipo puede observar, entre otros:

- Cuánto tarda un cambio en pasar desde que se inicia hasta que está disponible.
- Con qué frecuencia se realizan entregas.
- Cuántos cambios necesitan una corrección o una reversión.
- Cuánto se tarda en recuperar el servicio tras una incidencia.
- Cuánto tiempo queda una tarea esperando una revisión, una aprobación o un entorno.
- Qué proporción de las compilaciones termina correctamente.
- Cuánto tarda el equipo en recibir feedback de una prueba automatizada.

Estas métricas suelen ser más útiles para detectar problemas del proceso que para comparar equipos con contextos distintos.

### Evitar las métricas mal interpretadas

Una métrica puede provocar comportamientos no deseados si se transforma en una cuota.

Por ejemplo:

- Contar commits puede incentivar cambios pequeños sin valorar su utilidad.
- Premiar únicamente la rapidez puede reducir el tiempo dedicado a pruebas.
- Medir solo el número de incidencias puede desalentar que se registren.
- Comparar equipos distintos puede ignorar diferencias de producto, riesgo y contexto.
- Medir la cantidad de tareas terminadas puede incentivar dividir tareas artificialmente.

La pregunta importante no es solo **«¿cuál es el número?»**, sino también **«¿qué significa en este contexto y qué decisión útil permite tomar?»**.

## Sesión práctica: detectar los silos

Esta actividad ayuda a identificar puntos de espera y pérdida de información en un proceso sencillo.

### Duración y organización

- **Duración:** 20–30 minutos.
- **Modalidad:** grupos de 3–5 personas.
- **Material:** pizarra, papel o documento compartido.

### Situación

Una empresa necesita publicar una nueva versión de una aplicación. Participan cuatro funciones:

- Desarrollo.
- Pruebas.
- Operaciones.
- Soporte.

El cambio está terminado, pero nadie ha escrito instrucciones de despliegue. Las pruebas solo se pueden ejecutar en un entorno compartido. Operaciones desconoce una nueva variable de configuración. Soporte no sabe qué ha cambiado.

### Instrucciones

1. Dibujad los pasos que seguiría el cambio desde que desarrollo lo termina hasta que llega a las personas usuarias.
2. Marcad cada espera, transferencia de responsabilidad o dato que falte.
3. Identificad quién detecta cada problema y en qué momento.
4. Proponed tres mejoras concretas.
5. Para cada mejora, indicad cómo sabríais si ha funcionado.
6. Elegid una mejora que pueda probarse en una semana.

### Preguntas para el grupo

- ¿Qué información debería acompañar al cambio?
- ¿Qué tarea podría ejecutarse antes o automatizarse?
- ¿Qué comprobación ayudaría a detectar antes la configuración incorrecta?
- ¿Quién debería participar en la definición de los criterios de aceptación?
- ¿Qué parte del proceso se podría simplificar sin aumentar el riesgo?
- ¿Cómo podría soporte conocer los cambios relevantes?
- ¿Qué observación permitiría saber si la mejora ha reducido las esperas?

### Resultado esperado

El grupo debería producir un flujo sencillo, una lista de bloqueos y algunas propuestas verificables. Por ejemplo, añadir una lista de comprobación de configuración, validar la variable automáticamente o compartir notas de entrega con soporte.

## Sesión práctica: automatizar una comprobación

En esta actividad crearás una simulación local de una comprobación automática. No se requiere Jenkins: el objetivo es entender cómo una instrucción clara y repetible puede reducir trabajo manual.

### Preparar el espacio de trabajo

Abre una terminal y crea un directorio para el ejercicio:

```bash
mkdir practica-devops
cd practica-devops
mkdir app
```

Crea un archivo que represente el contenido de la aplicación:

```bash
printf 'Bienvenido al curso DevOps\n' > app/mensaje.txt
```

Comprueba que el archivo existe y muestra su contenido:

```bash
ls -l app
cat app/mensaje.txt
```

### Crear una comprobación manual

Ejecuta esta comprobación:

```bash
grep -q "curso DevOps" app/mensaje.txt \
  && echo "Comprobación correcta" \
  || echo "Comprobación fallida"
```

El comando busca la frase `curso DevOps` en el archivo. Si la encuentra, muestra `Comprobación correcta`; si no, muestra `Comprobación fallida`.

### Convertir la comprobación en un script

Crea un archivo llamado `comprobar.sh`:

```bash
cat > comprobar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe $ARCHIVO"
  exit 1
fi

if grep -q "curso DevOps" "$ARCHIVO"; then
  echo "OK: el mensaje esperado está presente"
else
  echo "ERROR: no se encontró el mensaje esperado"
  exit 1
fi
EOF
```

Dale permiso de ejecución y ejecútalo:

```bash
chmod +x comprobar.sh
./comprobar.sh
```

El resultado esperado es:

```text
OK: el mensaje esperado está presente
```

### Provocar un error y observar el resultado

Cambia el contenido del archivo para que ya no incluya la frase esperada:

```bash
printf 'Bienvenido al curso\n' > app/mensaje.txt
./comprobar.sh
```

El script debería mostrar un mensaje de error y terminar con un código de salida distinto de cero. Puedes comprobar el código inmediatamente después de ejecutarlo:

```bash
echo $?
```

Un resultado `0` indica que el comando anterior terminó correctamente. Un resultado distinto de `0` suele indicar que la comprobación falló.

### Recuperar el estado correcto

Restaura el contenido esperado y vuelve a ejecutar la comprobación:

```bash
printf 'Bienvenido al curso DevOps\n' > app/mensaje.txt
./comprobar.sh
```

### Qué demuestra el ejercicio

La práctica muestra que una comprobación puede ser:

- **Repetible:** varias personas pueden ejecutar el mismo comando.
- **Explícita:** define qué resultado se espera.
- **Automatizable:** más adelante puede incluirse en un pipeline.
- **Temprana:** puede detectar un problema antes de entregar el cambio.

La comprobación es deliberadamente sencilla. En un proyecto real se añadirían pruebas apropiadas para la aplicación y su contexto.

## Sesión práctica: compartir un cambio con Git

Esta actividad muestra cómo Git ayuda a mantener un historial compartido del trabajo. Si Git no está instalado, puedes continuar con la práctica anterior.

### Comprobar la instalación

```bash
git --version
```

Si el comando está disponible, inicializa un repositorio en el directorio del ejercicio:

```bash
git init
```

Añade los archivos y crea un commit:

```bash
git add app/mensaje.txt comprobar.sh
git commit -m "Añade una comprobación sencilla"
```

Si Git solicita un nombre o una dirección de correo, configura los datos para este repositorio:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Después, repite el comando `git commit`.

### Revisar el historial y modificar un archivo

Consulta el estado y el último commit:

```bash
git status
git log --oneline -1
```

Modifica el mensaje de la aplicación:

```bash
printf 'Bienvenido al curso DevOps y Jenkins\n' > app/mensaje.txt
```

Observa el cambio:

```bash
git diff
git status
```

El script seguirá buscando `curso DevOps`, por lo que la nueva frase debería superar la comprobación. Ejecútalo:

```bash
./comprobar.sh
```

Guarda el cambio en Git:

```bash
git add app/mensaje.txt
git commit -m "Amplía el mensaje de bienvenida"
```

### Reflexión

- ¿Qué información conserva Git sobre los cambios?
- ¿Qué ventaja tiene revisar `git diff` antes de confirmar un cambio?
- ¿Qué podría ocurrir si varias personas modificaran los mismos archivos sin integrar su trabajo?
- ¿Cómo podría una comprobación automática ejecutarse al incorporar un cambio?

## Reto opcional: crear un flujo local

En esta parte unirás los conceptos de cambio, comprobación y entrega simulada.

### Tarea

Crea un script `flujo.sh` que:

1. Compruebe que existe `app/mensaje.txt`.
2. Ejecute `comprobar.sh`.
3. Cree un directorio llamado `salida`.
4. Copie allí `app/mensaje.txt` solo si la comprobación termina correctamente.
5. Muestre un mensaje indicando que la entrega simulada está preparada.

### Pistas

- Puedes ejecutar otro script desde un script usando `./comprobar.sh`.
- Usa `mkdir -p salida` para crear el directorio si no existe.
- Usa `cp app/mensaje.txt salida/` para copiar el archivo.
- Coloca las acciones en el orden adecuado: primero comprobar, después copiar.
- Asegúrate de que el script se detenga si la comprobación falla.

### Comprobación del resultado

Si todo funciona, al ejecutar:

```bash
./flujo.sh
```

debería aparecer el mensaje definido en el script y el archivo debería estar disponible en:

```text
salida/mensaje.txt
```

Prueba a modificar el contenido para que la comprobación falle. El archivo no debería copiarse como si la entrega hubiera sido correcta.

## Errores habituales de interpretación

### «DevOps es que desarrollo haga también el trabajo de operaciones»

No necesariamente. El objetivo es mejorar la colaboración y el flujo de trabajo, no trasladar todo el trabajo de un grupo a otro.

### «DevOps es instalar Jenkins»

Jenkins puede automatizar partes del proceso, pero no define por sí solo cómo colaboran los equipos ni qué verificaciones necesita una entrega.

### «Si automatizamos, ya no habrá errores»

La automatización mejora la repetibilidad, pero también puede propagar errores. Hay que definir comprobaciones, revisar los cambios y observar los resultados.

### «DevOps siempre significa desplegar automáticamente en producción»

No. La estrategia depende del riesgo y de las necesidades del servicio. Un equipo puede automatizar pruebas y preparación de entregas y seguir requiriendo una aprobación antes de publicar.

### «Las métricas sirven para encontrar a quién culpar»

Las métricas deben ayudar a comprender el comportamiento del proceso y del servicio. Usarlas para buscar culpables puede reducir la transparencia y dificultar el aprendizaje.

### «Responsabilidad compartida significa que todo el mundo es responsable de todo»

La responsabilidad compartida no elimina la necesidad de roles claros. Cada persona puede tener funciones concretas y, al mismo tiempo, colaborar para que el servicio completo funcione.

## Preguntas de repaso

1. ¿Qué problema intenta resolver DevOps?
2. ¿Por qué DevOps no es simplemente una herramienta?
3. ¿Qué diferencia hay entre colaboración y responsabilidad compartida?
4. ¿Qué ventaja aporta realizar cambios pequeños y frecuentes?
5. ¿Por qué la automatización no sustituye a la revisión del proceso?
6. ¿Qué tipo de feedback puede ayudar a un equipo a detectar problemas antes?
7. ¿Por qué una métrica no debería interpretarse fuera de contexto?
8. ¿Qué diferencia hay entre DevOps, integración continua y despliegue continuo?
9. En la práctica de terminal, ¿qué indica un código de salida distinto de cero?
10. ¿Qué parte de las actividades realizadas podría ejecutarse después en un pipeline de Jenkins?
11. ¿Qué información conviene compartir con operaciones antes de una entrega?
12. ¿Cómo puede un equipo aprender de una incidencia sin centrarse únicamente en buscar culpables?

## Glosario

- **Automatización:** ejecución de tareas mediante instrucciones o herramientas para reducir pasos manuales y hacerlos repetibles.
- **CI/CD:** conjunto de prácticas de integración, entrega o despliegue continuo.
- **Despliegue:** puesta en funcionamiento de una versión de software en un entorno.
- **Feedback:** información sobre el resultado de un cambio, una prueba o un servicio.
- **Integración continua:** práctica de integrar cambios de código con frecuencia y validarlos mediante comprobaciones.
- **Observabilidad:** capacidad de investigar el estado interno de un sistema a partir de sus señales, como registros, métricas y trazas.
- **Pipeline:** secuencia de pasos automatizados para validar, construir o entregar software.
- **Silo:** grupo o área que trabaja de forma aislada y comparte poca información con otras partes de la organización.
- **Control de versiones:** sistema que registra cambios en archivos y facilita la colaboración sobre ellos.
- **Entrega continua:** práctica que mantiene el software preparado para publicarse de forma controlada.
- **Despliegue continuo:** práctica que publica automáticamente los cambios que superan las verificaciones establecidas.

## Resumen

- **DevOps es una forma de colaborar y mejorar el ciclo de vida del software.**
- No es una herramienta, un puesto concreto ni una promesa de publicar sin control.
- La colaboración, la automatización, los cambios pequeños y el feedback rápido ayudan a reducir bloqueos y riesgos.
- La calidad y la seguridad deben formar parte del flujo, no añadirse únicamente al final.
- Las métricas deben servir para aprender y mejorar el proceso, no para juzgar a las personas.
- CI/CD puede apoyar prácticas DevOps, pero no sustituye la colaboración ni el aprendizaje.
- Una comprobación clara y repetible puede automatizarse e incorporarse más adelante a un pipeline.