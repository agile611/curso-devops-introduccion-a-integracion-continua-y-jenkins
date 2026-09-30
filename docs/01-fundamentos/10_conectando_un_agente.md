# Conectando un agente de Jenkins

Conectar un agente permite que Jenkins ejecute trabajos en un sistema distinto del controlador. El controlador coordina las ejecuciones; el agente, instalado o iniciado en un nodo, ejecuta los pasos asignados. La conexión puede configurarse de varias maneras, y la adecuada depende de la red, la seguridad, el sistema operativo y la versión de Jenkins.

Esta unidad explica los conceptos necesarios para conectar un agente de laboratorio. Incluye dos métodos habituales —conexión mediante SSH e inicio del agente desde el propio nodo—, además de prácticas de verificación, diagnóstico y seguridad. Los nombres de las opciones de la interfaz pueden variar: utiliza siempre las instrucciones vigentes de tu instancia y del docente.

> **Importante:** realiza las prácticas únicamente en equipos y redes autorizados. No reutilices credenciales personales o de producción. No publiques secretos del agente, tokens, claves privadas ni la URL interna de una instancia compartida.

## Arquitectura y conceptos

Conectar un agente consiste en establecer una relación autenticada y funcional entre un nodo de ejecución y el controlador de Jenkins.

### Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar por qué se conecta un agente a Jenkins.
- Diferenciar controlador, nodo, agente, ejecutor y workspace.
- Describir las direcciones de conexión en los métodos SSH e inbound.
- Revisar los requisitos de un nodo antes de conectarlo.
- Crear o solicitar un nodo de laboratorio según los permisos disponibles.
- Identificar las credenciales necesarias sin exponerlas.
- Comprobar si el agente aparece conectado y disponible.
- Ejecutar un job sencillo en el agente.
- Diagnosticar errores frecuentes de conexión.
- Aplicar el principio de mínimo privilegio.
- Documentar la configuración de un agente.
- Distinguir una configuración educativa de una configuración de producción.

### Qué significa conectar un agente

Un agente conectado puede recibir tareas del controlador y comunicarle resultados.

La conexión puede permitir que Jenkins:

- Seleccione el nodo para una ejecución.
- Envíe o coordine pasos de trabajo.
- Reciba la salida de consola.
- Consulte el estado de la ejecución.
- Determine si el agente está disponible.
- Asigne trabajos según etiquetas y capacidad.

Conectar el agente no instala automáticamente todas las herramientas necesarias para cada proyecto. La máquina debe disponer de las dependencias requeridas por los jobs que ejecutará.

### Controlador, nodo y agente

Estos términos describen partes relacionadas, pero distintas.

- **Controlador:** coordina Jenkins, administra la interfaz y programa trabajos.
- **Nodo:** máquina o entorno que Jenkins conoce y puede utilizar.
- **Agente:** proceso que se comunica con el controlador y ejecuta trabajo en el nodo.
- **Ejecutor:** capacidad configurada en un nodo para ejecutar una tarea.
- **Workspace:** directorio utilizado por un job durante su ejecución.

En conversaciones informales se suele llamar «agente» al conjunto formado por el proceso y el nodo. Para diagnosticar problemas, resulta útil distinguir ambas partes.

### Flujo conceptual

```text
Persona o evento
       |
       v
Controlador Jenkins
       |
       | asigna un trabajo
       v
Agente conectado
       |
       +--> obtiene o recibe el código
       |
       +--> ejecuta comandos
       |
       +--> genera resultados
       |
       v
Controlador recibe estado y registros
```

### Qué hace el controlador

El controlador puede:

- Aceptar solicitudes de ejecución.
- Consultar la configuración del job.
- Buscar nodos compatibles.
- Reservar un ejecutor.
- Coordinar la ejecución.
- Presentar los logs y los resultados.
- Mantener la configuración de Jenkins.
- Administrar credenciales conforme a los permisos establecidos.

El controlador no tiene por qué ejecutar los comandos del pipeline.

### Qué hace el agente

El agente puede:

- Ejecutar comandos en el sistema asignado.
- Trabajar en un workspace.
- Utilizar las herramientas instaladas en el nodo.
- Comunicarse con los servicios permitidos.
- Devolver logs y estados al controlador.
- Ejecutar varios trabajos si dispone de suficientes ejecutores y recursos.

### Qué no hace la conexión

Conectar un agente no significa que:

- Jenkins instale automáticamente herramientas.
- El agente tenga acceso a todos los repositorios.
- El nodo pueda comunicarse con cualquier red.
- Los jobs tengan permisos administrativos.
- El workspace se conserve para siempre.
- La conexión sea segura solo porque funciona.
- Todos los jobs deban ejecutarse en ese nodo.

### Relación con el curso

En las unidades anteriores se han presentado jobs Freestyle, pipelines y nodos.

Esta unidad combina esos conceptos:

- Un job solicita un nodo o una etiqueta.
- El controlador busca un agente compatible.
- El agente ejecuta los pasos.
- Jenkins conserva el resultado según la configuración.
- La consola permite revisar qué ocurrió.

El agente es parte de la arquitectura, no un sustituto del controlador ni del job.

### Casos de uso

Un equipo puede conectar agentes para:

- Ejecutar tareas en Linux y Windows.
- Separar trabajos de prueba y construcción.
- Distribuir carga entre varias máquinas.
- Usar herramientas instaladas solo en un nodo específico.
- Aislar trabajos de distinto nivel de confianza.
- Aprovisionar agentes temporales para una ejecución.
- Ejecutar validaciones cerca de un recurso autorizado.

### Ejemplos de separación por capacidad

Un entorno podría tener:

- Un agente Linux para validaciones generales.
- Un agente Windows para pruebas específicas de Windows.
- Un agente con Docker para construir imágenes.
- Un agente temporal para tareas aisladas.
- Un agente de laboratorio sin acceso a producción.

Los nombres, etiquetas y capacidades concretos dependen de la instalación.

## Métodos y requisitos de conexión

Jenkins admite diferentes formas de iniciar o conectar agentes. No mezcles instrucciones de métodos distintos en una misma configuración.

### Elegir el método adecuado

Antes de configurar una conexión, averigua:

- Qué método exige el curso o la organización.
- Qué versión de Jenkins se utiliza.
- Qué sistema operativo tiene el agente.
- Quién inicia la conexión.
- Qué dirección de red es alcanzable.
- Qué credenciales hacen falta.
- Qué puertos se utilizan.
- Quién administra el nodo.
- Qué trabajos ejecutará el agente.
- Cómo se detendrá o eliminará la configuración.

El método apropiado no se decide únicamente por el comando más corto.

### Método SSH

En una conexión SSH, el controlador inicia una conexión hacia el nodo remoto.

Puede ser adecuado cuando:

- El controlador puede alcanzar el nodo por SSH.
- El sistema remoto tiene un servicio SSH autorizado.
- Existe una cuenta de sistema dedicada al agente.
- Jenkins tiene una credencial aprobada para iniciar sesión.
- La política de red permite esa conexión.

El controlador necesita conectividad saliente hacia el agente. El agente no inicia necesariamente la conexión hacia Jenkins en este método.

### Método inbound o iniciado por el agente

En una conexión inbound, el agente inicia la conexión hacia el controlador o utiliza el mecanismo de conexión indicado por Jenkins.

Puede ser adecuado cuando:

- El controlador no puede iniciar una conexión entrante al nodo.
- El agente está detrás de una red restringida.
- La plataforma proporciona agentes temporales.
- El equipo utiliza una conexión mediante WebSocket.
- El laboratorio indica expresamente este método.

El agente debe conocer la URL del controlador y contar con una credencial o secreto temporal según el procedimiento de la instancia.

### Métodos y versiones

La disponibilidad y los nombres de las opciones dependen de la versión de Jenkins y de su configuración.

Antes de seguir una guía técnica:

- Comprueba que corresponde a la versión usada.
- Prioriza las instrucciones del curso.
- Consulta la documentación de la versión instalada.
- No copies comandos antiguos sin revisar sus argumentos.
- No cambies la configuración de seguridad para adaptar Jenkins a una guía desactualizada.

### Conexión iniciada por SSH e inbound: comparación

| Aspecto | SSH | Inbound o iniciado por el agente |
|---|---|---|
| Quién inicia | El controlador inicia hacia el nodo | El agente inicia hacia Jenkins |
| Requisito de red | Controlador alcanza el nodo | Agente alcanza el controlador |
| Credencial habitual | Credencial SSH autorizada | Secreto o credencial del agente |
| Uso frecuente | Nodos remotos administrados | Redes restringidas o agentes temporales |
| Aspecto a revisar | Host key y usuario remoto | URL, identidad y transporte seguro |

La tabla es una orientación. La configuración real puede variar en función de plugins, versión y política de la organización.

### Requisitos del nodo

Un nodo debe tener, como mínimo, lo necesario para iniciar el proceso agente y ejecutar los trabajos previstos.

Puede necesitar:

- Sistema operativo compatible.
- Java compatible con la versión de Jenkins y el tipo de agente.
- Red hacia el controlador o desde el controlador, según el método.
- Permisos de lectura y escritura en las rutas de trabajo.
- Espacio disponible.
- Herramientas exigidas por los jobs.
- Un usuario de sistema dedicado.
- Hora y certificados confiables, según el entorno.

No instales una versión de Java por intuición. Comprueba la compatibilidad de la versión concreta de Jenkins y sigue las instrucciones oficiales de la instalación.

### Comprobar Java en el nodo

En una sesión autorizada del nodo:

```bash
java -version
```

Este comando consulta la versión disponible en el entorno donde se ejecuta.

Si Jenkins usa un contenedor o un usuario distinto, la salida de tu terminal no demuestra qué Java utilizará el agente.

Comprueba el entorno efectivo del agente mediante el procedimiento aprobado.

### Comprobar la identidad del proceso

En Linux, un comando de consulta puede mostrar el usuario actual:

```bash
whoami
```

El agente debería ejecutarse con una cuenta adecuada para sus trabajos, no con una cuenta administrativa por defecto.

### Comprobar el directorio de trabajo

```bash
pwd
```

La ruta que aparece depende de la sesión y del usuario.

No uses rutas personales que solo existan en tu cuenta si los jobs deben funcionar para otras personas.

### Comprobar espacio y recursos

En Linux, estas consultas pueden ayudar durante un diagnóstico autorizado:

```bash
df -h
```

```bash
free -h
```

La disponibilidad de estas herramientas puede variar.

No borres archivos para liberar espacio sin identificar su propietario y comprobar la política del entorno.

### Red y direcciones

Antes de conectar el agente, aclara:

- Qué dirección utiliza el controlador.
- Qué dirección utiliza el nodo.
- Qué interfaz de red corresponde al laboratorio.
- Si hay DNS o una IP fija.
- Si se necesita una VPN.
- Si existe un proxy.
- Qué puertos están autorizados.
- Si interviene un cortafuegos o una regla de seguridad.

No publiques direcciones privadas ni detalles de red de una instancia compartida.

### Puertos

El puerto usado depende del método y de la configuración de Jenkins.

No presupongas un número universal.

Comprueba:

- La URL configurada del controlador.
- El mecanismo de conexión.
- La configuración del proxy inverso, si existe.
- Las reglas de red indicadas por el administrador.
- La documentación del laboratorio.

No abras puertos por cuenta propia para «probar si así funciona».

### DNS, certificados y hora

Una conexión puede fallar aunque el proceso agente esté iniciado.

Comprueba con el administrador:

- Si el nombre del controlador resuelve desde el nodo.
- Si el certificado TLS es válido y confiable.
- Si la fecha y hora del nodo son razonables.
- Si una inspección TLS o un proxy afecta a la conexión.
- Si la URL interna es la autorizada para el laboratorio.

No desactives la verificación de certificados para evitar un error de conexión.

### Usuario del sistema

Para ejecutar un agente Linux se suele emplear una cuenta dedicada o una identidad definida por la plataforma.

La cuenta debe tener:

- Permiso para iniciar el proceso agente.
- Escritura en el directorio de trabajo.
- Lectura de los archivos necesarios.
- Acceso a las herramientas requeridas.
- Solo las credenciales y los recursos que el job necesite.

No utilices `root` salvo que exista una decisión administrativa documentada y aprobada.

### Identificar un usuario de agente

Un usuario de sistema dedicado ayuda a:

- Separar la ejecución de las cuentas personales.
- Limitar los permisos.
- Identificar procesos.
- Administrar ownership de archivos.
- Revocar el acceso cuando el agente ya no se necesite.

El nombre de la cuenta depende de la organización; no presupongas que existe un usuario universal llamado `jenkins`.

### Directorio de trabajo

El directorio de trabajo debería:

- Estar en un volumen apropiado.
- Tener permisos limitados.
- Disponer de espacio suficiente.
- No exponer archivos personales.
- Seguir una política de limpieza.
- No ser compartido entre usuarios de forma insegura.

No elimines manualmente el directorio del agente si no sabes si contiene datos de otros jobs.

### Herramientas de los jobs

Un agente debe ofrecer las herramientas requeridas por los jobs que vaya a ejecutar.

Por ejemplo, un job puede necesitar:

- Git para obtener código.
- Bash para ejecutar scripts.
- Un intérprete o compilador.
- Un cliente de contenedores.
- Herramientas de prueba.
- Acceso a dependencias.

Comprueba las herramientas en el nodo, no solo en tu equipo local.

### Diferencias entre herramientas del controlador y del agente

Que Git exista en el controlador no significa que exista en el agente.

Que Java exista en tu terminal local no significa que Jenkins utilice esa instalación.

El job se ejecuta en el nodo asignado y utiliza el entorno disponible allí.

### Etiquetas

Las etiquetas permiten seleccionar nodos por capacidad.

Ejemplos ilustrativos:

```text
linux
laboratorio
docker
pruebas
```

Utiliza únicamente etiquetas existentes y confirmadas.

No inventes una etiqueta esperando que aparezca automáticamente en el nodo.

### Etiquetas compartidas

Una etiqueta puede estar asignada a varios agentes.

Esto permite distribuir trabajos entre nodos compatibles, pero exige que las capacidades representadas por esa etiqueta sean suficientemente consistentes.

Por ejemplo, si una etiqueta significa `linux-con-git`, cada agente con esa etiqueta debería ofrecer lo que los jobs esperan.

### Etiquetas específicas

Una etiqueta asociada a un único agente puede hacer que una ejecución dependa de ese nodo.

Si el agente se desconecta, el job puede quedar esperando.

Documenta esa dependencia y evita usar etiquetas demasiado específicas si no hay una razón.

### Ejecutores

Un ejecutor es una capacidad para procesar un trabajo.

El número de ejecutores debe ajustarse a:

- CPU.
- Memoria.
- Disco.
- Concurrencia segura.
- Capacidad de los servicios de prueba.
- Naturaleza de los jobs.

Más ejecutores pueden aumentar la competencia por recursos y empeorar los tiempos.

### Workspace y aislamiento

Jenkins utiliza un workspace para cada ejecución o job según la configuración.

El workspace puede contener código y archivos temporales.

Antes de habilitar limpieza o reutilización, revisa:

- Si otros jobs usan el mismo nodo.
- Si los directorios son independientes.
- Si se archivan los resultados necesarios.
- Si puede haber ejecuciones concurrentes.
- Si existen archivos sensibles.

### Plan de conexión antes de tocar la configuración

Completa esta ficha antes de realizar la práctica:

```text
Controlador:
Nodo:
Sistema operativo:
Método de conexión:
Quién inicia la conexión:
URL o nombre aprobado:
Usuario de sistema:
Etiqueta:
Ejecutores:
Directorio de trabajo:
Herramientas:
Credencial autorizada:
Responsable:
Procedimiento de desconexión:
```

Deja en blanco cualquier dato que no conozcas y consulta al docente.

## Configuración de una conexión

Las instrucciones de esta sección son educativas. Utiliza el método que indique el curso y no combines opciones de métodos distintos.

### Preparación común

Antes de configurar cualquiera de los métodos:

- Confirma que tienes permiso para crear o administrar el nodo.
- Comprueba que el nombre del nodo sea único.
- Confirma el sistema operativo.
- Identifica el usuario de servicio.
- Revisa el directorio de trabajo.
- Valida la conectividad necesaria.
- Comprueba Java y las herramientas requeridas.
- Define una etiqueta descriptiva.
- Define cuántos ejecutores son razonables.
- Asegúrate de no exponer secretos.

### Crear un nodo desde Jenkins

La interfaz de Jenkins puede permitir crear un nodo mediante una sección de administración.

El nombre y la ubicación de las opciones dependen de la versión y de los permisos.

En general, la configuración del nodo puede incluir:

- Nombre.
- Descripción.
- Cantidad de ejecutores.
- Directorio remoto.
- Etiquetas.
- Política de uso.
- Método de inicio o conexión.
- Disponibilidad temporal o permanente.

No cambies la configuración global de la instancia compartida sin autorización.

### Nombre del nodo

El nombre debería identificar el propósito, no una contraseña ni un dato personal.

Ejemplos:

```text
agente-linux-lab-01
agente-pruebas-a
nodo-practica-linux
```

Evita nombres ambiguos como:

```text
nuevo
test
final
servidor
```

### Descripción del nodo

Una descripción útil puede indicar:

- Sistema operativo.
- Uso previsto.
- Herramientas generales.
- Responsable.
- Restricciones.
- Fecha de revisión.
- Si el agente es temporal o permanente.

No incluyas secretos ni detalles de red sensibles.

### Ejecutores del nodo

Para un agente de laboratorio con recursos modestos, un número bajo de ejecutores puede ser suficiente.

La cantidad concreta debe definirse con el responsable del nodo.

No aumentes el número para vaciar una cola sin revisar los recursos y el comportamiento de los trabajos.

### Etiqueta del nodo

La etiqueta debe representar una capacidad comprobada.

Antes de asignarla:

- Confirma qué herramientas están instaladas.
- Comprueba el sistema operativo.
- Asegura que el nodo es apropiado para esos jobs.
- Evita etiquetas que sugieran permisos que el nodo no debe tener.

### Directorio remoto o de trabajo

Jenkins puede solicitar una ruta para el trabajo del agente.

La ruta debe:

- Existir o poder crearse según el procedimiento.
- Ser accesible por la cuenta del agente.
- Disponer de espacio suficiente.
- Estar separada de carpetas sensibles.
- Seguir la política de almacenamiento.

No utilices una carpeta personal del administrador como ruta por defecto.

### Método de lanzamiento

Selecciona el método acordado:

- SSH, si el controlador inicia hacia el nodo.
- Inbound u otro método iniciado por el agente, si así lo requiere la arquitectura.
- Una plataforma de agentes temporales, si el curso utiliza ese sistema.

La etiqueta de «launch method» puede variar según la versión de Jenkins.

### Guardar y revisar

Antes de guardar, verifica:

- Que el nombre es correcto.
- Que el método corresponde al plan de red.
- Que la credencial es la autorizada.
- Que la ruta es adecuada.
- Que la etiqueta existe o se va a asignar correctamente.
- Que el número de ejecutores es razonable.
- Que no se ha habilitado una opción no prevista.

### Método SSH: visión general

Con SSH, Jenkins abre una sesión hacia el nodo remoto para iniciar o administrar el agente.

Una configuración típica necesita:

- Nombre o dirección del nodo.
- Puerto SSH autorizado.
- Cuenta de sistema.
- Credencial SSH gestionada por Jenkins.
- Verificación de la identidad del servidor SSH.
- Directorio remoto.
- Java compatible.
- Ruta de red desde el controlador al nodo.

Los detalles exactos dependen de la instalación y de los plugins.

### Preparar el nodo SSH

En el nodo autorizado, el administrador puede tener que comprobar:

- Que SSH está disponible.
- Que la cuenta del agente puede iniciar sesión.
- Que la clave pública correspondiente está autorizada.
- Que la cuenta no tiene permisos innecesarios.
- Que el directorio de trabajo tiene los permisos correctos.
- Que Java está disponible para el usuario del agente.
- Que las reglas de red permiten la conexión prevista.

Los alumnos no deben modificar el servicio SSH del equipo anfitrión sin autorización.

### Verificación de host key

El host key ayuda a comprobar la identidad del servidor remoto.

Sigue la política de verificación configurada por Jenkins.

No desactives la verificación de host key para resolver un problema de conexión.

Una advertencia de host key debe investigarse antes de continuar.

### Credenciales SSH

La clave privada, si se utiliza, debe guardarse en el almacén de credenciales autorizado.

No la:

- Pegues en un `Jenkinsfile`.
- Guardes en el repositorio.
- Escribas en una descripción.
- Envíes por correo o chat sin protección.
- Imprimas en logs.
- Compartas entre jobs sin necesidad.

### Cuenta SSH del agente

La cuenta remota debe tener solo los permisos necesarios.

Comprueba:

- Quién es su propietario.
- Qué directorios puede modificar.
- Si tiene acceso a `sudo`.
- Si puede leer archivos sensibles.
- Qué repositorios puede consultar.
- Qué redes puede alcanzar.

Un job debería ejecutarse con una cuenta de servicio limitada.

### Conectividad SSH

La conexión debe seguir la dirección definida por el método:

```text
Controlador Jenkins  --->  nodo agente
```

Si el controlador no puede alcanzar el nodo, comprueba con el administrador:

- Resolución DNS.
- Rutas.
- Reglas de cortafuegos.
- VPN.
- Puerto autorizado.
- Estado del servicio SSH.
- Dirección configurada.

No abras el servicio SSH a redes públicas para completar la práctica.

### Comprobar acceso SSH sin exponer secretos

La prueba de conectividad debe realizarla personal autorizado mediante el método aprobado.

No escribas claves privadas en la línea de comandos.

No compartas la salida completa si revela nombres de host, usuarios o rutas internas.

Si no tienes acceso administrativo, registra el error y solicítalo al responsable del laboratorio.

### Inicio del agente por SSH

Una vez configurado el nodo, Jenkins puede iniciar el proceso agente mediante el mecanismo correspondiente.

Durante el primer inicio puede:

- Comprobar Java.
- Crear o utilizar el directorio remoto.
- Descargar o ejecutar componentes de agente.
- Establecer la comunicación.
- Mostrar mensajes de inicialización.

La salida exacta depende de la versión y del método configurado.

### Método inbound: visión general

En el método inbound, el agente inicia una conexión hacia el controlador.

La configuración suele requerir:

- Un nodo definido en Jenkins.
- El nombre e identidad del agente.
- La URL del controlador.
- Un mecanismo autenticado.
- Java compatible, según el mecanismo.
- Un directorio de trabajo.
- Una ruta de red permitida.

Jenkins puede proporcionar un comando de lanzamiento desde la interfaz. Ese comando puede incluir un secreto.

### Secreto del agente inbound

El secreto autentica el agente frente al controlador.

Debe tratarse como una credencial:

- No lo publiques.
- No lo incluyas en un repositorio.
- No lo pegues en una captura.
- No lo envíes en un canal no aprobado.
- No lo incluyas en una documentación compartida.
- No lo reutilices para otros nodos.

Si el secreto se expone, avisa al administrador para que determine si debe rotarse o revocarse.

### Utilizar el comando generado por Jenkins

En algunas configuraciones, Jenkins ofrece un comando o instrucciones para iniciar el agente.

Úsalos solo si:

- Provienen de la instancia correcta.
- El nodo corresponde al laboratorio.
- El método coincide con el indicado por el curso.
- Entiendes dónde se ejecutará el comando.
- El secreto no se guardará en el historial o en un archivo compartido.

No copies el comando generado en un chat público o en documentación versionada.

### Riesgo de secretos en argumentos

Un secreto escrito como argumento de un proceso podría aparecer en herramientas de diagnóstico del sistema, historial de shell o registros.

Para entornos reales, sigue el método aprobado para protegerlo, como un almacén de credenciales o un mecanismo de plataforma.

En un laboratorio, conserva el secreto de forma temporal y privada, y elimina cualquier copia accidental siguiendo las instrucciones del docente.

### Ejemplo conceptual de lanzamiento inbound

El siguiente ejemplo es solo esquemático. No es un comando completo para ejecutar:

```text
java -jar agent.jar
  -url URL_DEL_CONTROLADOR
  -secret SECRETO_DEL_NODO
  -name NOMBRE_DEL_NODO
  -workDir DIRECTORIO_DE_TRABAJO
```

No sustituyas los marcadores con datos reales en esta documentación.

Utiliza el comando exacto y vigente generado por la instancia, cuando el curso lo indique.

### WebSocket

Algunas configuraciones permiten que el agente inbound se conecte mediante WebSocket.

El transporte puede ser útil en entornos donde las conexiones se enrutan por HTTP o HTTPS.

Aun así, se necesita:

- URL correcta.
- Autenticación.
- Certificados válidos.
- Permiso de red.
- Compatibilidad del controlador y del agente.
- Configuración correcta de proxy, si existe.

WebSocket no elimina la necesidad de proteger el secreto del agente.

### Agente iniciado desde un contenedor

Un agente puede ejecutarse en un contenedor si la imagen y el sistema de coordinación están preparados para ello.

Antes de iniciar:

- Revisa la imagen.
- Comprueba el usuario dentro del contenedor.
- Identifica los volúmenes montados.
- Verifica los permisos de red.
- Confirma cómo se proporciona la credencial.
- Determina cómo se limpia el contenedor.
- Comprueba qué datos persisten.

No montes archivos sensibles del anfitrión sin necesidad.

### Persistencia de datos del agente

El workspace puede ser efímero o persistente.

Aclara:

- Qué se conserva al detener el agente.
- Qué se elimina al borrar el contenedor.
- Si hay volúmenes externos.
- Si se archivan los artefactos en Jenkins.
- Quién puede limpiar el almacenamiento.
- Qué ocurre con datos temporales de otros jobs.

### No usar el controlador como agente sin necesidad

En una instancia compartida, el controlador puede estar configurado para no ejecutar trabajos de usuario.

Respeta esa configuración.

No reduzcas la protección del controlador para evitar conectar un agente.

### Comprobar el estado del nodo en Jenkins

Una vez iniciado el agente, consulta la página de nodos o agentes, si tienes permiso de lectura.

Comprueba:

- Estado conectado.
- Nombre del nodo.
- Etiquetas.
- Ejecutores disponibles.
- Estado de ocupación.
- Información de sistema que se muestre.
- Motivo de desconexión, si aparece.

No cambies la configuración desde esa página a menos que tengas autorización.

### Estado conectado no significa capacidad completa

Un agente puede aparecer conectado y, aun así:

- Carecer de una herramienta.
- No tener espacio suficiente.
- No alcanzar el repositorio.
- Tener una etiqueta incorrecta.
- No disponer de ejecutores.
- No tener permisos para un archivo requerido.

La conexión es una condición necesaria, no una garantía de que todos los jobs funcionarán.

### Probar con un job inocuo

Cuando el agente aparezca conectado, ejecuta un job pequeño de consulta.

El job puede comprobar:

- Que se selecciona el nodo esperado.
- Que la shell funciona.
- Que el usuario del proceso es el previsto.
- Que Git está disponible, si el ejercicio lo requiere.
- Que se puede escribir en el workspace.

No pruebes con un comando de despliegue o de modificación del sistema.

### Pipeline mínimo de comprobación

Este ejemplo requiere un agente compatible con shell Unix:

```groovy
pipeline {
    agent {
        label 'ETIQUETA_AUTORIZADA'
    }

    stages {
        stage('Verificar agente') {
            steps {
                sh 'echo "Agente de laboratorio conectado"'
                sh 'uname -s'
                sh 'whoami'
                sh 'pwd'
            }
        }
    }
}
```

Sustituye `ETIQUETA_AUTORIZADA` por la etiqueta real indicada por el docente.

No uses una etiqueta inventada ni una etiqueta de producción.

### Job Freestyle mínimo de comprobación

En un job Freestyle autorizado, un paso de shell de consulta puede ser:

```bash
echo "Comprobación del agente"
uname -s
whoami
pwd
```

Si el agente no es Linux, solicita los comandos equivalentes.

### Verificar la etiqueta

Comprueba que:

- La etiqueta existe.
- Está asignada al nodo correcto.
- Describe una capacidad real.
- El agente está conectado.
- El job la solicita correctamente.
- No hay otro nodo con capacidades incompatibles y la misma etiqueta.

### Verificar el workspace

En la ejecución de prueba, consulta el directorio de trabajo mediante el método aprobado.

Comprueba:

- Que pertenece al entorno esperado.
- Que la cuenta puede escribir en él.
- Que no apunta a una carpeta sensible.
- Que la limpieza no afectará a otros trabajos.

### Verificar herramientas concretas

Comprueba solo las herramientas requeridas por el ejercicio.

Ejemplos:

```bash
git --version
```

```bash
python3 --version
```

No imprimas variables de entorno completas ni secretos para diagnosticar una herramienta.

### Cerrar una sesión inbound

La forma de detener un agente inbound depende de cómo se haya iniciado.

Puede requerir:

- Detener el proceso mediante el supervisor autorizado.
- Cerrar la sesión de terminal de laboratorio.
- Detener el contenedor.
- Desconectar el nodo desde el procedimiento de administración.

No mates procesos de manera indiscriminada.

### Desconectar un nodo desde Jenkins

La interfaz puede permitir desconectar un nodo temporalmente, pero esa acción puede interrumpir trabajos.

Antes de utilizarla:

- Comprueba si hay ejecuciones activas.
- Confirma que tienes permisos.
- Consulta al responsable.
- Sigue el procedimiento del laboratorio.
- Evita desconectar nodos compartidos para experimentar.

### Eliminar un nodo

Eliminar un nodo de Jenkins y borrar la máquina son acciones diferentes.

Antes de eliminar una configuración:

- Comprueba quién la usa.
- Revisa jobs que solicitan sus etiquetas.
- Confirma que no hay ejecuciones activas.
- Comprueba si la configuración es temporal.
- Solicita autorización.
- Sigue el procedimiento de limpieza.

### Registrar el resultado de la conexión

Anota:

```text
Nodo:
Método:
Estado inicial:
Estado final:
Etiqueta:
Job de prueba:
Resultado:
Fecha:
Dificultad observada:
Responsable consultado:
```

No registres el secreto del agente ni la clave privada.

## Sesiones prácticas para alumnos

Las sesiones siguientes están diseñadas para realizarse con una instancia y un nodo de laboratorio.

### Organización de las sesiones

Cada sesión puede adaptarse a una clase de 45–60 minutos.

Las actividades pueden hacerse en parejas:

- Una persona revisa la documentación.
- Otra interpreta la interfaz.
- Ambas anotan evidencias.
- Los roles se intercambian en la siguiente actividad.

No cambies la configuración global de Jenkins durante estas sesiones.

### Sesión 1: dibujar el flujo de conexión

**Objetivo:** representar cómo se comunicarían el controlador y un agente.

#### Preparación

El docente proporciona:

- Nombre del controlador.
- Nombre del nodo de laboratorio.
- Método de conexión.
- Una descripción general de la red.
- Restricciones del entorno.

No se necesita anotar secretos ni direcciones sensibles.

#### Actividad

Dibuja:

```text
Controlador:
Agente:
Quién inicia la conexión:
Credencial utilizada:
Ruta de red:
Trabajo de prueba:
Resultado esperado:
```

#### Preguntas

- ¿Qué componente asigna el job?
- ¿Qué componente ejecuta los comandos?
- ¿En qué dirección se inicia la conexión?
- ¿Qué dato debe protegerse?
- ¿Qué podría impedir la comunicación?

#### Entregable

Entrega un diagrama sin claves, contraseñas ni información de red no autorizada.

### Sesión 2: revisar los requisitos del nodo

**Objetivo:** decidir si un nodo está preparado para el job de práctica.

#### Job de ejemplo

El job necesita:

- Bash.
- Git.
- Acceso de lectura al repositorio de práctica.
- Escritura en el workspace.
- Sin credenciales de producción.

#### Actividad

Consulta, mediante la interfaz o con ayuda del docente:

- Sistema operativo.
- Estado del nodo.
- Etiquetas.
- Ejecutores.
- Herramientas disponibles.
- Responsable del agente.

#### Tabla de evaluación

| Requisito | Disponible | Evidencia | Acción pendiente |
|---|---|---|---|
| Bash | | | |
| Git | | | |
| Acceso de lectura | | | |
| Workspace | | | |
| Ejecutor disponible | | | |

#### Preguntas

- ¿Qué requisito es imprescindible?
- ¿Qué requisito puede comprobarse desde el job?
- ¿Qué información debe confirmar el administrador?
- ¿Qué capacidad no es necesaria para esta tarea?

### Sesión 3: observar un agente conectado

**Objetivo:** comprobar la conectividad mediante una ejecución inocua.

#### Preparación

El docente indica:

- Job de prueba.
- Etiqueta autorizada.
- Resultado esperado.
- Permisos disponibles.

#### Instrucciones

1. Abre la página del job.
2. Revisa su descripción.
3. Confirma la etiqueta.
4. Inicia una única ejecución.
5. Espera a que Jenkins la asigne.
6. Abre la consola.
7. Localiza la identificación del sistema.
8. Registra usuario y ruta de trabajo, si están disponibles.
9. Comprueba el resultado.
10. Comparte solo datos aprobados.

#### Comandos de ejemplo

```bash
echo "Agente de prueba"
uname -s
whoami
pwd
```

#### Preguntas

- ¿Qué evidencia confirma que el job se ejecutó?
- ¿Cómo sabes qué nodo lo ejecutó?
- ¿Qué usuario ejecutó el proceso?
- ¿Qué diferencia hay entre el controlador y este entorno?
- ¿Qué dato debería ocultarse antes de compartir la consola?

### Sesión 4: conexión inbound en un entorno guiado

**Objetivo:** comprender el proceso de inicio sin divulgar secretos.

Esta sesión debe ser supervisada por el docente.

#### Requisitos

- Nodo de laboratorio autorizado.
- Método inbound configurado por el administrador.
- Comando o procedimiento proporcionado por la instancia.
- Java compatible, si el método lo requiere.
- Canal seguro para entregar información temporal.

#### Instrucciones

1. Confirma que el nodo corresponde a la práctica.
2. Comprueba la URL indicada por Jenkins.
3. Lee el comando de inicio sin copiarlo a un lugar público.
4. Identifica qué partes son datos y cuáles son secretos.
5. Inicia el agente según las instrucciones del docente.
6. Observa el log de inicio.
7. Confirma el estado conectado en Jenkins.
8. Ejecuta un job de consulta.
9. Detén el agente según el procedimiento indicado.
10. Confirma el estado final.

#### No hacer

- No publiques el comando completo.
- No pegues el secreto en Git.
- No guardes el secreto en un documento compartido.
- No uses una URL de otra instancia.
- No dejes el proceso iniciado si el curso pide detenerlo.
- No copies el secreto a otra máquina.

#### Reflexión

- ¿Qué evidencia indicó que la conexión se completó?
- ¿Qué componente inició la conexión?
- ¿Qué información debía protegerse?
- ¿Qué parte del procedimiento dependía del administrador?

### Sesión 5: conexión SSH en un entorno supervisado

**Objetivo:** comprender qué requisitos tiene SSH sin administrar un servidor ajeno.

Esta sesión puede realizarse mediante una demostración o un nodo expresamente preparado.

#### Preparación

El responsable del laboratorio confirma:

- Dirección o nombre de nodo.
- Usuario remoto.
- Credencial administrada.
- Verificación de host key.
- Ruta del workspace.
- Regla de red aplicable.

Los alumnos no necesitan copiar ni inspeccionar la clave privada.

#### Actividad de observación

Anota:

- Quién inicia la conexión.
- Qué cuenta se utiliza.
- Qué proceso inicia Jenkins.
- Qué mensaje aparece cuando el agente queda disponible.
- Cómo se identifica el nodo en la interfaz.

#### Preguntas

- ¿Por qué el controlador necesita alcanzar el nodo?
- ¿Qué verifica la host key?
- ¿Por qué no debe desactivarse la verificación?
- ¿Qué permiso mínimo necesita la cuenta remota?
- ¿Qué información debería contener el log de diagnóstico?

### Sesión 6: comparar SSH e inbound

**Objetivo:** elegir el método según la dirección de red y el modelo operativo.

#### Escenario A

El controlador puede alcanzar por SSH a un nodo Linux administrado.

#### Escenario B

Un agente temporal inicia conexión hacia un controlador desde una red restringida.

#### Actividad

Para cada escenario, describe:

- Quién inicia la conexión.
- Qué requisitos de red existen.
- Qué credencial se utiliza.
- Qué equipo administra el nodo.
- Qué problema de seguridad hay que evitar.
- Qué procedimiento de apagado corresponde.

#### Resultado esperado

Explica por qué ambos métodos pueden ser válidos en contextos distintos y por qué no conviene elegir uno sin revisar la arquitectura.

### Sesión 7: diagnosticar una etiqueta incorrecta

**Objetivo:** resolver un job que espera por una etiqueta no disponible.

#### Escenario

El job solicita:

```text
linux-practica
```

Ningún nodo conectado tiene esa etiqueta.

#### Instrucciones

1. Consulta el motivo de la espera.
2. Revisa las etiquetas disponibles, si tienes permiso.
3. Comprueba si hay un error tipográfico.
4. No cambies la etiqueta global.
5. Informa al docente.
6. Registra la evidencia.

#### Preguntas

- ¿El agente está desconectado o la etiqueta no existe?
- ¿El job ha iniciado algún paso?
- ¿Qué dato confirma el motivo?
- ¿Quién puede corregir la configuración?
- ¿Qué riesgo hay al asignar una etiqueta distinta sin revisar capacidades?

### Sesión 8: identificar una herramienta ausente

**Objetivo:** entender por qué un job puede fallar aunque el agente esté conectado.

#### Escenario

El agente está conectado, pero el job termina con un mensaje que indica que no se encuentra Git.

#### Actividad

Comprueba:

- Qué agente ejecutó el job.
- Si Git está disponible allí.
- Si la etiqueta describe correctamente el agente.
- Si otra máquina con esa etiqueta tiene capacidades distintas.
- Qué persona mantiene la imagen o máquina.

#### Preguntas

- ¿Por qué la conexión no garantiza que Git esté instalado?
- ¿Qué alternativa existe además de instalarlo manualmente?
- ¿Qué debería documentarse en la ficha del agente?
- ¿Qué procedimiento de cambio debe seguirse?

### Sesión 9: analizar recursos y ejecutores

**Objetivo:** relacionar trabajos en cola con la capacidad del nodo.

#### Escenario

Un agente tiene un ejecutor ocupado y varios jobs esperan.

#### Actividad

Sin cambiar configuración:

- Observa la cola.
- Identifica cuántos ejecutores están ocupados.
- Revisa la duración de los jobs.
- Busca indicios de uso elevado de recursos, si tienes permiso.
- Propón una mejora.

#### Preguntas

- ¿Aumentar ejecutores resolvería siempre la cola?
- ¿Qué tareas podrían ejecutarse en paralelo?
- ¿Qué recursos podrían agotarse?
- ¿Se pueden dividir o reubicar jobs?
- ¿Qué datos se necesitan antes de cambiar la capacidad?

### Sesión 10: construir una ficha de agente

**Objetivo:** documentar un nodo para facilitar su uso y mantenimiento.

#### Instrucciones

Completa la plantilla de la sección anterior con datos no sensibles.

Incluye:

- Nombre.
- Sistema operativo.
- Etiqueta.
- Herramientas.
- Método de conexión, si puede documentarse.
- Responsable.
- Restricciones.
- Procedimiento de desconexión.

#### Revisión por pares

Intercambia la ficha con otro grupo.

La otra pareja debe poder responder:

- ¿Qué jobs puede ejecutar?
- ¿Qué herramientas tiene?
- ¿Qué etiqueta deben solicitar?
- ¿Qué permisos no tiene?
- ¿A quién consultar ante un fallo?

### Sesión 11: ejecutar una validación de Git

**Objetivo:** comprobar que un agente puede obtener y validar un repositorio de práctica.

#### Requisitos

- Repositorio proporcionado por el curso.
- Acceso de lectura autorizado.
- Agente de laboratorio con Git.
- Job de prueba configurado por el docente.

#### Validación de ejemplo

```bash
test -f README.md
git --version
echo "Repositorio preparado en el agente"
```

#### Instrucciones

1. Inicia el job.
2. Observa el checkout.
3. Identifica la rama.
4. Identifica el commit.
5. Revisa el directorio de trabajo.
6. Confirma que el archivo existe.
7. Comprueba el resultado.
8. No imprimas ni compartas credenciales.

#### Preguntas

- ¿Qué sistema obtuvo el repositorio?
- ¿Qué commit se procesó?
- ¿Git estaba instalado en el nodo?
- ¿Qué permiso necesitó Jenkins?
- ¿Qué harías si el checkout falla?

### Sesión 12: simular un agente no disponible sin desconectarlo

**Objetivo:** analizar un fallo de disponibilidad sin afectar el laboratorio.

El docente puede proporcionar una captura, una ejecución histórica o un entorno simulado.

#### Escenario

Un job necesita una etiqueta cuyo único nodo aparece desconectado.

#### Análisis

- Identifica el job.
- Identifica la etiqueta.
- Identifica el estado del nodo.
- Lee el mensaje de cola.
- Distingue la indisponibilidad de un fallo de código.
- Propón una solicitud de soporte con evidencia.

#### Informe sugerido

```text
Job:
Ejecución:
Etiqueta solicitada:
Estado del nodo:
Mensaje de Jenkins:
¿Llegó a ejecutarse algún paso?:
Hipótesis:
Información pendiente:
```

### Sesión 13: revisar aislamiento de un agente

**Objetivo:** reconocer permisos y montajes que pueden aumentar el riesgo.

#### Escenario

Un agente de contenedor tiene acceso al socket de Docker y a una carpeta amplia del anfitrión.

#### Tarea

Identifica:

- Qué recursos puede alcanzar el contenedor.
- Qué datos podrían estar expuestos.
- Qué job necesita ese acceso.
- Qué acceso puede reducirse.
- Quién debe revisar la configuración.

#### Preguntas

- ¿Por qué un socket de Docker puede conceder capacidades elevadas?
- ¿Por qué un montaje amplio aumenta el riesgo?
- ¿Qué alternativa tendría un job que solo necesita ejecutar pruebas?
- ¿Qué permiso requiere realmente el pipeline?

## Ejemplos de configuración orientativos

Los ejemplos son didácticos y no sustituyen la configuración de una instancia concreta.

### Pipeline con cualquier agente disponible

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar agente') {
            steps {
                sh 'echo "Ejecución de laboratorio"'
                sh 'uname -s'
                sh 'whoami'
            }
        }
    }
}
```

Este ejemplo utiliza cualquier agente disponible que cumpla la configuración aplicable.

No significa que Jenkins pueda ejecutar la tarea en cualquier máquina de Internet.

### Pipeline con etiqueta

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Verificar herramientas') {
            steps {
                sh 'git --version'
                sh 'pwd'
            }
        }
    }
}
```

La etiqueta debe existir y el nodo debe tener capacidad y ejecutores disponibles.

### Pipeline para agente Linux

```groovy
pipeline {
    agent {
        label 'linux'
    }

    stages {
        stage('Consultar sistema') {
            steps {
                sh 'uname -a'
                sh 'whoami'
            }
        }
    }
}
```

No uses la etiqueta `linux` sin confirmar que existe en la instancia del curso.

### Pipeline con restricciones de agente

En algunas configuraciones se pueden expresar varias condiciones de etiqueta.

La sintaxis y su interpretación dependen de Jenkins.

No supongas que combinar dos etiquetas selecciona exactamente un agente sin revisar la documentación de la versión y la configuración local.

### Pipeline con etapas en distintos agentes

Un flujo puede asignar etapas a diferentes agentes.

Esto puede ser útil, pero requiere planificar:

- Qué archivos genera cada etapa.
- Cómo llegan esos archivos a la siguiente.
- Qué workspace usa cada agente.
- Qué se archiva.
- Qué permisos tiene cada nodo.
- Qué hacer si una etapa posterior falla.

No añadas etapas en múltiples agentes a una práctica introductoria si no necesitas demostrar esa capacidad.

### Ejemplo de mensaje de identificación

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Identificar entorno') {
            steps {
                sh 'echo "Nodo seleccionado para la práctica"'
                sh 'uname -s'
                sh 'git --version'
            }
        }
    }
}
```

El ejemplo imprime información limitada y evita mostrar variables de entorno completas.

### No introducir secretos en el pipeline

No escribas secretos en líneas como:

```text
echo TOKEN=valor
```

No pongas credenciales directamente en los argumentos de comandos.

Utiliza el almacén de credenciales autorizado y limita su uso al job necesario.

## Diagnóstico y resolución de problemas

Un agente puede fallar en la conexión, en la asignación o durante la ejecución. Distinguir esas etapas ayuda a encontrar la causa.

### Categorías de problemas

Un problema puede estar en:

- La definición del nodo.
- La identidad del agente.
- La red.
- La autenticación.
- Java o una dependencia.
- La etiqueta.
- Los ejecutores.
- El workspace.
- Los permisos.
- Una herramienta del job.
- El servicio externo al que se conecta el job.

### Método de diagnóstico

1. Identifica el job y la ejecución.
2. Comprueba si el job llegó a salir de la cola.
3. Identifica el nodo o etiqueta solicitada.
4. Comprueba el estado del agente.
5. Lee el primer error útil.
6. Determina si falló la conexión o un paso del job.
7. Compara con una ejecución anterior.
8. Formula una hipótesis concreta.
9. Realiza solo comprobaciones autorizadas.
10. Registra el resultado.

### El nodo no aparece en Jenkins

Posibles causas:

- El nodo no se creó.
- Tu usuario no tiene permiso para verlo.
- La página consultada no corresponde a la instancia correcta.
- La configuración quedó sin guardar.
- El nodo se eliminó.
- La interfaz utiliza otra sección para mostrar agentes.

Consulta al docente antes de crear un segundo nodo.

### El agente aparece desconectado

Posibles causas:

- El proceso agente no está iniciado.
- El sistema está apagado.
- La red no permite la comunicación.
- La URL es incorrecta.
- Hay un problema de DNS.
- El certificado no es válido.
- La autenticación falló.
- Hubo mantenimiento o reinicio.

No desactives controles TLS ni abras puertos sin autorización.

### Error de autenticación

Comprueba con el administrador:

- Qué credencial corresponde al nodo.
- Si ha caducado o sido revocada.
- Si el usuario remoto es correcto.
- Si la clave pública está autorizada.
- Si el secreto pertenece a ese nodo.
- Si estás utilizando la instancia adecuada.

No intentes adivinar credenciales ni reutilices las de otra máquina.

### Error de host key en SSH

El error puede indicar:

- Que la clave del servidor cambió.
- Que se está conectando a otro host.
- Que la verificación no está configurada.
- Que existe una sustitución inesperada.

Verifica la identidad del nodo por el canal autorizado.

No aceptes automáticamente una clave inesperada ni desactives la verificación para ocultar el problema.

### Error de Java

Comprueba:

- La versión de Java que usa el proceso agente.
- La compatibilidad con la versión de Jenkins.
- El `PATH` de la cuenta de servicio.
- Si Java está instalado para ese usuario.
- Si el agente utiliza una máquina o contenedor distinto.
- Si la política del laboratorio administra Java.

La versión de Java de tu terminal local no demuestra qué versión encuentra el agente.

### Error de conexión o timeout

Posibles causas:

- Ruta de red incorrecta.
- DNS no disponible.
- Cortafuegos.
- Proxy.
- Puerto no autorizado.
- Controlador detenido.
- Nodo inaccesible.
- Certificado o TLS.

Recoge el mensaje exacto y consulta al administrador.

No pruebes direcciones o puertos no autorizados.

### El agente conecta y se desconecta repetidamente

Posibles causas:

- Red inestable.
- Proceso agente reiniciado.
- Límites de recursos.
- Mantenimiento del nodo.
- Configuración de conexión inadecuada.
- Incompatibilidad de versiones.
- Servicio externo que interrumpe la conexión.

Anota la hora y si otros jobs o agentes presentan el mismo comportamiento.

### El job queda en cola

Puede suceder porque:

- No hay un nodo con la etiqueta.
- El nodo está desconectado.
- Los ejecutores están ocupados.
- El job solicita un tipo de agente incorrecto.
- Existe un límite de concurrencia.
- El nodo está temporalmente reservado.

Un job en cola no demuestra que el código fuente esté mal.

### El job corre en el nodo equivocado

Comprueba:

- La etiqueta solicitada.
- Las etiquetas de los nodos.
- La configuración del job.
- Las reglas del pipeline.
- Si varios nodos comparten etiqueta.
- Si la etiqueta describe con precisión las capacidades.

No cambies a una etiqueta más amplia sin comprobar el impacto.

### Falta una herramienta

Comprueba:

- Qué nodo ejecutó el job.
- Si la herramienta está instalada en ese nodo.
- Si la ruta aparece en el `PATH`.
- La versión disponible.
- Si el job seleccionó el agente esperado.
- Si la imagen del agente fue actualizada.

Solicita al administrador el cambio de imagen o paquete. No instales software desde el job sin permiso.

### Permiso denegado en el workspace

Comprueba:

- Usuario del proceso.
- Propietario del directorio.
- Permisos del workspace.
- Si una ejecución anterior creó archivos con otra identidad.
- Si el directorio es compartido.
- Si la política permite corregir permisos.

No uses `chmod -R` sobre una ruta amplia sin saber qué cambiará.

### Falta de espacio

Comprueba con el responsable:

- Uso de workspaces.
- Artefactos retenidos.
- Cachés.
- Imágenes de contenedor.
- Logs.
- Directorios temporales.
- Cuotas de almacenamiento.

No borres archivos de otros jobs para liberar espacio.

### El agente puede conectarse, pero no obtiene código

La conexión con el controlador y el acceso al repositorio son problemas diferentes.

Comprueba:

- URL del repositorio.
- DNS y red desde el agente.
- Credenciales de lectura.
- Rama configurada.
- Certificados.
- Proxy.
- Versión de Git.
- Permisos del job.

La conexión del agente no concede automáticamente acceso a Git.

### El job termina después de perder el agente

Puede quedar fallido, abortado o con otro estado según el momento y la configuración.

Comprueba:

- Si el proceso agente sigue disponible.
- Si el controlador recibió el resultado.
- Si el job puede reintentarse de forma segura.
- Si el paso dejó cambios parciales.
- Si el destino es compartido.

No reintentes automáticamente una operación con efectos externos sin revisar primero el estado.

### El log no ofrece información suficiente

Añade mensajes de diagnóstico que indiquen:

- El paso actual.
- La ruta de entrada esperada.
- La versión de la herramienta.
- El resultado de una validación.

No añadas:

- Variables de entorno completas.
- Secretos.
- Contenido confidencial.
- Datos personales innecesarios.
- Rutas privadas sin justificación.

## Seguridad operativa

Un agente puede ejecutar código del repositorio y acceder a los recursos permitidos a su proceso. Debe tratarse como una máquina de ejecución sensible.

### Principio de mínimo privilegio

Un agente debería tener solo:

- Los permisos del sistema necesarios.
- Acceso a las rutas de trabajo necesarias.
- Conectividad requerida por los jobs.
- Credenciales autorizadas.
- Herramientas necesarias para sus tareas.

### Separar trabajos por nivel de confianza

Considera agentes diferentes para:

- Código revisado internamente.
- Solicitudes de cambios externas.
- Construcción de artefactos.
- Tareas con credenciales sensibles.
- Entornos de prueba.
- Operaciones de despliegue.

La separación reduce el riesgo de que un job menos confiable alcance recursos de otro trabajo.

### Proteger el controlador

No conviertas el controlador en un agente de uso general solo para simplificar una práctica.

El controlador contiene configuración y puede tener acceso a información sensible.

Sigue la política del administrador sobre ejecución de jobs en el controlador.

### Proteger las credenciales

No coloques credenciales en:

- Archivos de configuración versionados.
- Scripts de usuario.
- Comandos visibles.
- Parámetros de texto.
- Logs.
- Capturas.
- Documentación compartida.

Utiliza los mecanismos de credenciales de Jenkins o los servicios aprobados.

### Limitar la red

Un agente solo debería alcanzar servicios necesarios para sus tareas.

La política puede restringir:

- Repositorios.
- Registros de artefactos.
- Servicios de prueba.
- Controladores.
- Redes internas.
- Destinos de despliegue.

No amplíes el acceso de red sin una necesidad aprobada.

### Proteger las imágenes

Para agentes basados en contenedor:

- Utiliza imágenes de fuentes confiables.
- Fija versiones de forma reproducible.
- Revisa paquetes y usuarios.
- Evita ejecutar como administrador si no es necesario.
- Limita montajes.
- No compartas el socket de Docker sin una revisión formal.
- Actualiza imágenes mediante un procedimiento.

### Proteger el workspace

El workspace puede incluir código y archivos generados.

Asegúrate de que:

- Los jobs no compartan datos accidentalmente.
- La limpieza sea segura.
- Los artefactos necesarios se archiven.
- Los permisos del directorio sean adecuados.
- No se dejen secretos temporales.

### Tratar los logs como información potencialmente sensible

Los logs pueden revelar:

- Nombres de usuarios.
- Rutas.
- Direcciones internas.
- Argumentos de comandos.
- Datos de prueba.
- Mensajes de sistemas externos.
- Secretos impresos accidentalmente.

Revisa la consola antes de compartirla.

## Gestión del ciclo de vida

Un agente conectado necesita mantenimiento y un procedimiento de retirada.

### Alta de un agente

Documenta:

- Responsable.
- Motivo de creación.
- Método de conexión.
- Identidad de sistema.
- Etiquetas.
- Herramientas.
- Ejecutores.
- Red necesaria.
- Política de limpieza.
- Fecha de revisión.

### Actualización

Antes de actualizar un agente:

- Comprueba qué jobs dependen de él.
- Revisa las versiones de herramientas.
- Prueba los cambios en un entorno controlado.
- Conserva la posibilidad de recuperar la configuración.
- Informa a los equipos afectados.
- Registra los cambios realizados.

### Rotación de credenciales

La rotación debe realizarse según la política de seguridad.

Comprueba:

- Qué jobs utilizan la credencial.
- Qué agentes pueden acceder a ella.
- Si existen copias locales.
- Si los logs contienen valores antiguos.
- Si es necesario reiniciar o volver a conectar el agente.

### Desconexión temporal

Desconectar un agente puede impedir nuevas asignaciones o interrumpir trabajos, según el método.

Antes de desconectarlo:

- Revisa ejecuciones activas.
- Informa a las personas afectadas.
- Sigue el procedimiento de mantenimiento.
- Confirma el estado después de la acción.

### Retirada definitiva

Al retirar un agente:

- Elimina o revoca credenciales asociadas.
- Actualiza etiquetas y jobs.
- Confirma que no quedan dependencias.
- Limpia datos siguiendo la política.
- Retira reglas de red innecesarias.
- Actualiza la documentación.
- Conserva registros necesarios para auditoría.

## Registro y documentación

Una conexión bien documentada es más fácil de mantener y diagnosticar.

### Datos útiles de documentación

Incluye:

- Nombre del nodo.
- Propósito.
- Responsable.
- Sistema operativo.
- Etiquetas.
- Herramientas.
- Ejecutores.
- Método de conexión.
- Requisitos de red descritos de forma segura.
- Política de workspace.
- Procedimiento de parada.
- Procedimiento de diagnóstico.
- Última revisión.

### Datos que no deben documentarse en claro

No incluyas:

- Contraseñas.
- Tokens.
- Secretos inbound.
- Claves privadas.
- Códigos de recuperación.
- Credenciales personales.
- Direcciones o reglas internas no autorizadas.

### Ficha de conexión

```text
Nombre del agente:
Propósito:
Responsable:
Controlador asociado:
Método:
Quién inicia la conexión:
Sistema operativo:
Usuario de ejecución:
Etiqueta:
Ejecutores:
Directorio de trabajo:
Herramientas:
Requisitos de red:
Credencial referenciada:
Procedimiento de inicio:
Procedimiento de parada:
Procedimiento de diagnóstico:
Fecha de revisión:
```

La ficha debería hacer referencia al identificador de la credencial, no al valor secreto.

## Práctica integradora

Esta actividad conecta un agente de laboratorio con un job sencillo y valida el flujo de extremo a extremo.

### Alcance

La práctica:

- Utiliza un agente autorizado.
- Ejecuta comandos de consulta.
- Valida archivos de ejemplo.
- No utiliza credenciales de producción.
- No despliega una aplicación.
- No modifica servicios del sistema.
- No administra reglas de red.

### Preparación del job

El docente proporciona:

- Una etiqueta válida.
- Un repositorio de práctica o workspace preparado.
- Un agente conectado.
- Un job plantilla o permiso para crearlo.
- El resultado esperado.

### Crear un archivo de ejemplo

En el repositorio de práctica, crea:

```text
app/mensaje.txt
```

Contenido:

```text
Práctica de conexión de agentes Jenkins
```

### Crear un script de validación

```bash
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: falta $ARCHIVO"
  exit 1
fi

if grep -q "Jenkins" "$ARCHIVO"; then
  echo "OK: se encontró Jenkins"
else
  echo "ERROR: no se encontró Jenkins"
  exit 1
fi
```

### Permiso de ejecución

Si el sistema y la práctica lo requieren, marca el script como ejecutable en el repositorio.

Comprueba que el permiso se conserva al obtener el código.

### Pipeline de ejemplo

El siguiente pipeline presupone un agente compatible con shell Unix y una etiqueta autorizada:

```groovy
pipeline {
    agent {
        label 'ETIQUETA_AUTORIZADA'
    }

    stages {
        stage('Identificar agente') {
            steps {
                sh 'uname -s'
                sh 'whoami'
                sh 'pwd'
                sh 'git --version'
            }
        }

        stage('Validar estructura') {
            steps {
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'Agente y validación comprobados.'
        }

        failure {
            echo 'Revisa la consola y el estado del agente.'
        }
    }
}
```

Sustituye la etiqueta solo con el valor proporcionado por el docente.

### Ejecutar la práctica

1. Confirma el repositorio.
2. Confirma la etiqueta.
3. Confirma el agente.
4. Inicia una sola ejecución.
5. Revisa si sale de la cola.
6. Abre la consola.
7. Identifica el nodo.
8. Comprueba la herramienta Git.
9. Revisa la validación.
10. Registra el resultado.

### Provocar un fallo controlado

Cambia el mensaje para que no contenga `Jenkins`.

Crea una revisión de práctica y vuelve a ejecutar el job.

Comprueba:

- Si el agente sigue conectado.
- Si el job obtuvo la revisión esperada.
- Qué etapa falló.
- Qué mensaje muestra el script.
- Si el fallo se debe al agente o al contenido.

### Corregir el fallo

Restaura el contenido válido y vuelve a ejecutar.

Comprueba:

- Que se procesa el commit corregido.
- Que el agente es el esperado.
- Que todas las etapas terminan.
- Que el estado final coincide con el resultado.
- Que no se expusieron secretos.

### Informe de la práctica

```text
Nombre del job:
Ejecución correcta:
Ejecución fallida:
Agente:
Etiqueta:
Sistema operativo:
Herramientas:
Causa del fallo controlado:
Corrección:
Resultado final:
Aprendizaje:
```

### Reflexión de cierre

- ¿Qué demuestra que el job se ejecutó en un agente?
- ¿Qué parte del flujo pertenece al controlador?
- ¿Qué permisos necesita el agente?
- ¿Qué ocurriría si la etiqueta no existiera?
- ¿Qué ocurriría si el agente se desconectara?
- ¿Qué dato comprobarías primero ante una cola prolongada?

## Errores que conviene evitar

### Copiar un secreto en un canal público

El secreto de un agente permite autenticación y debe tratarse como una credencial.

Si se expone, informa al administrador.

### Utilizar una cuenta personal

Una cuenta personal puede tener permisos y ciclos de vida inadecuados para un agente.

Utiliza la identidad definida por el administrador.

### Ejecutar el agente como administrador

Los permisos elevados aumentan el impacto de un error o de código malicioso.

No lo hagas salvo que exista una necesidad justificada y aprobada.

### Desactivar verificación TLS o de host key

Desactivar verificaciones puede ocultar una conexión al servidor equivocado.

Investiga el certificado o la clave antes de continuar.

### Abrir puertos a toda la red

Una regla amplia puede exponer servicios innecesariamente.

Solicita el acceso mínimo requerido por el método de conexión.

### Asignar una etiqueta sin verificar capacidades

El job puede ejecutarse en un nodo sin las herramientas necesarias o con permisos distintos a los esperados.

Comprueba y documenta las capacidades.

### Aumentar ejecutores sin medir

Más tareas simultáneas pueden saturar CPU, memoria, disco o servicios externos.

Analiza métricas y colas antes de cambiar la capacidad.

### Compartir workspaces entre proyectos

Puede exponer archivos o causar interferencias.

Aísla datos y revisa la política de limpieza.

### Instalar paquetes desde el job

Un job no debería modificar el sistema del agente sin autorización.

Las dependencias deben gestionarse mediante la imagen, el aprovisionamiento o el procedimiento aprobado.

### Confundir conexión con disponibilidad funcional

Un agente puede estar conectado y no tener Git, espacio o conectividad al repositorio.

Prueba las capacidades específicas que requiere el trabajo.

## Evaluación

Utiliza estas preguntas para comprobar lo aprendido.

### Preguntas de repaso

1. ¿Qué función cumple un agente?
2. ¿Qué diferencia hay entre un agente y un nodo?
3. ¿Qué componente inicia una conexión SSH tradicional?
4. ¿Quién inicia una conexión inbound?
5. ¿Qué representa un ejecutor?
6. ¿Qué información proporciona una etiqueta?
7. ¿Qué puede hacer que un job quede en cola?
8. ¿Por qué la versión de Java debe comprobarse en el agente?
9. ¿Qué diferencia hay entre un agente conectado y un agente preparado para un job?
10. ¿Por qué se debe proteger el secreto inbound?
11. ¿Qué función cumple la verificación de host key?
12. ¿Por qué no debe ejecutarse un agente como `root` por defecto?
13. ¿Qué puede ocurrir si varios jobs comparten un workspace?
14. ¿Qué datos se deberían incluir en la ficha del agente?
15. ¿Qué información no debe aparecer en los logs?
16. ¿Qué comprobarías si el agente se conecta y se desconecta repetidamente?
17. ¿Por qué un contenedor no elimina todos los riesgos?
18. ¿Qué diferencia hay entre retirar un nodo y apagar la máquina?
19. ¿Qué información registrarías ante un error de conexión?
20. ¿Qué método de conexión elegirías para un agente que no puede recibir conexiones entrantes y por qué?

### Ejercicio de clasificación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

#### Afirmación 1

«El controlador coordina los trabajos y el agente ejecuta los pasos asignados».

#### Afirmación 2

«Conectar un agente instala automáticamente todas las herramientas de los jobs».

#### Afirmación 3

«En el método SSH, normalmente el controlador inicia la conexión hacia el nodo».

#### Afirmación 4

«En el método inbound, el agente puede iniciar la conexión hacia el controlador».

#### Afirmación 5

«El secreto inbound debe guardarse en el repositorio para facilitar la instalación».

#### Afirmación 6

«Un agente conectado puede carecer de las herramientas requeridas por un job».

#### Afirmación 7

«Una etiqueta debería corresponder a capacidades comprobadas».

#### Afirmación 8

«Si un job está en cola, el código siempre tiene un error».

#### Afirmación 9

«Aumentar el número de ejecutores puede incrementar la competencia por recursos».

#### Afirmación 10

«La verificación de host key ayuda a comprobar la identidad del servidor SSH».

#### Afirmación 11

«El workspace debe considerarse permanente y compartido entre todos los jobs».

#### Afirmación 12

«Un agente temporal puede facilitar el aislamiento si está bien configurado».

#### Afirmación 13

«La conexión del agente concede automáticamente acceso al repositorio Git».

#### Afirmación 14

«Las credenciales del agente deben limitarse a los jobs que las necesitan».

#### Afirmación 15

«Un contenedor puede seguir teniendo acceso amplio si se configura con demasiados permisos».

### Respuestas orientativas

#### Afirmación 1

**Correcta.** Es la separación básica entre coordinación y ejecución.

#### Afirmación 2

**Incorrecta.** Las herramientas deben estar instaladas o disponibles en el entorno del agente.

#### Afirmación 3

**Correcta.** Esa es la dirección habitual en una configuración SSH iniciada por el controlador.

#### Afirmación 4

**Correcta.** Es una característica del método inbound.

#### Afirmación 5

**Incorrecta.** El secreto es una credencial y no debe versionarse.

#### Afirmación 6

**Correcta.** Conectividad y capacidad funcional son conceptos diferentes.

#### Afirmación 7

**Correcta.** Las etiquetas deben representar capacidades reales y mantenidas.

#### Afirmación 8

**Incorrecta.** El job puede esperar por un nodo, etiqueta, ejecutor o recurso.

#### Afirmación 9

**Correcta.** Los trabajos simultáneos compiten por recursos.

#### Afirmación 10

**Correcta.** La verificación ayuda a identificar el host remoto esperado.

#### Afirmación 11

**Incorrecta.** El workspace puede ser temporal y su aislamiento depende de la configuración.

#### Afirmación 12

**Correcta.** Puede ayudar, pero depende de la configuración y del ciclo de vida.

#### Afirmación 13

**Incorrecta.** El acceso al repositorio necesita sus propios permisos y credenciales.

#### Afirmación 14

**Correcta.** Es parte del principio de mínimo privilegio.

#### Afirmación 15

**Correcta.** Un contenedor mal configurado puede exponer el anfitrión o recursos compartidos.

## Lista de comprobación final

### Antes de conectar

- [ ] Tengo autorización para utilizar el nodo.
- [ ] Sé qué método de conexión debo usar.
- [ ] Conozco quién inicia la conexión.
- [ ] He confirmado el sistema operativo.
- [ ] He comprobado la compatibilidad de Java, si aplica.
- [ ] Conozco la etiqueta autorizada.
- [ ] Sé qué herramientas requiere el job.
- [ ] La cuenta de sistema está definida.
- [ ] El directorio de trabajo es adecuado.
- [ ] La red y los puertos están aprobados.
- [ ] No tengo que copiar secretos a un repositorio.

### Después de conectar

- [ ] Jenkins muestra el nodo conectado.
- [ ] La etiqueta coincide con la práctica.
- [ ] Hay un ejecutor disponible.
- [ ] El job puede seleccionar el nodo.
- [ ] La consola identifica el entorno.
- [ ] Las herramientas necesarias están disponibles.
- [ ] El workspace permite el trabajo requerido.
- [ ] No se imprimieron secretos.
- [ ] Se registró el resultado.
- [ ] El agente se dejó en el estado indicado por el curso.

### Antes de desconectar o retirar

- [ ] No hay trabajos activos que puedan interrumpirse.
- [ ] El responsable conoce la acción.
- [ ] Los datos necesarios están archivados.
- [ ] Las credenciales se revocarán o rotarán si corresponde.
- [ ] Las etiquetas y jobs dependientes están revisados.
- [ ] El procedimiento de limpieza está autorizado.
- [ ] La documentación refleja el estado final.

## Glosario

- **Agente:** proceso que permite ejecutar tareas de Jenkins en un nodo.
- **Agente inbound:** agente que inicia su conexión hacia el controlador.
- **Controlador:** componente central que coordina Jenkins.
- **Ejecutor:** capacidad de un nodo para ejecutar una tarea.
- **Etiqueta:** nombre que representa un grupo o capacidad de agentes.
- **Host key:** clave que ayuda a verificar la identidad de un servidor SSH.
- **Inbound:** método en el que el agente inicia la conexión con Jenkins.
- **Nodo:** máquina o entorno registrado en Jenkins.
- **SSH:** protocolo que puede utilizarse para que el controlador inicie conexión hacia un nodo.
- **Secreto del agente:** credencial usada para autenticar un agente inbound.
- **Workspace:** directorio de trabajo asociado a una ejecución.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.
- **Agente temporal:** agente creado para una ejecución o periodo limitado.
- **Host:** sistema donde se ejecuta una máquina virtual o contenedor.
- **Concurrencia:** ejecución de varias tareas al mismo tiempo.
- **Conectividad:** posibilidad de comunicación entre sistemas.
- **TLS:** protocolo que protege conexiones de red cuando está configurado correctamente.
- **WebSocket:** mecanismo de comunicación que algunas instalaciones pueden utilizar para agentes.

## Síntesis final

- Un agente permite ejecutar trabajos fuera del controlador.
- Un nodo es el sistema; el agente es el proceso que lo conecta con Jenkins.
- SSH e inbound son métodos distintos y tienen direcciones de conexión diferentes.
- La conectividad requiere red, autenticación y una configuración compatible.
- El agente debe disponer de las herramientas que requieren sus jobs.
- Etiquetas y ejecutores determinan qué trabajo puede asignarse y cuánta concurrencia se permite.
- Los workspaces y las credenciales deben gestionarse con cuidado.
- El agente debe tener permisos mínimos y acceso de red limitado.
- Una conexión exitosa no garantiza que el job tenga todas sus dependencias.
- La documentación y los registros no deben contener secretos.