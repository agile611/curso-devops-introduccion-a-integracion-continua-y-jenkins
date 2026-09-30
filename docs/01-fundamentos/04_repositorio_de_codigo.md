# Repositorio de código del curso

El repositorio del curso es el punto de partida para obtener los archivos, scripts y configuraciones utilizados en las prácticas de Jenkins y CI/CD. En esta unidad aprenderás a clonarlo, explorar su estructura, entender cómo se gestionan sus cambios con Git y utilizar sus recursos de forma segura.

El repositorio de referencia es [agile611/startusingjenkins](https://github.com/agile611/startusingjenkins). Según su documentación, ofrece scripts y una configuración básica para levantar un entorno local de prueba con Jenkins y, opcionalmente, SonarQube. Incluye un `Vagrantfile` y scripts de ayuda relacionados con Docker, Jenkins, SonarQube, Terraform y Ansible.

> **Importante:** antes de ejecutar cualquiera de los scripts del repositorio, inspecciona su contenido. Los comandos de esta unidad sirven para aprender y explorar. Ejecuta acciones que creen máquinas virtuales, contenedores o servicios únicamente en un equipo de laboratorio y siguiendo las indicaciones del docente.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Explicar qué es un repositorio de código y qué información contiene.
- Clonar el repositorio del curso usando Git.
- Identificar sus archivos y directorios principales.
- Consultar el estado, historial y diferencias de un repositorio.
- Distinguir entre descargar código, modificarlo y compartir cambios.
- Reconocer qué información describe el `README.md`.
- Investigar un script antes de ejecutarlo.
- Comprender para qué sirven el `Vagrantfile` y los scripts de ayuda.
- Preparar una rama para realizar cambios locales.
- Crear commits pequeños y descriptivos.
- Evitar incluir secretos y archivos generados.
- Informar de errores con datos útiles y sin exponer credenciales.
- Utilizar el repositorio como base para las prácticas del curso.

## El repositorio de referencia

El repositorio que se utilizará como ejemplo está alojado en GitHub:

- **Nombre:** `startusingjenkins`.
- **Organización o propietario:** `agile611`.
- **Rama predeterminada indicada:** `main`.
- **Dirección:** `https://github.com/agile611/startusingjenkins`.
- **Propósito descrito:** proporcionar un punto de partida local y educativo para practicar Jenkins y CI.
- **Entorno documentado:** Vagrant y VirtualBox.
- **Servicios mencionados:** Jenkins y, opcionalmente, SonarQube.

La estructura puede cambiar a medida que el repositorio evolucione. Comprueba siempre el contenido actual antes de seguir instrucciones de una copia antigua de esta unidad.

### Archivos de nivel superior

La página del repositorio muestra, entre otros, estos archivos:

| Archivo | Descripción general |
|---|---|
| `README.md` | Introducción, requisitos e instrucciones de uso |
| `Vagrantfile` | Definición de una máquina virtual gestionada con Vagrant |
| `docker.sh` | Script relacionado con la gestión de servicios en Docker |
| `jenkins.sh` | Script de ayuda para tareas relacionadas con Jenkins |
| `sonarqube.sh` | Script relacionado con SonarQube |
| `terraform.sh` | Script relacionado con Terraform |
| `ansible.sh` | Script relacionado con Ansible |
| `DockerfileAgent2404` | Definición de una imagen de agente asociada a Ubuntu 24.04 |
| `DockerfileAgentAlpine` | Definición de una imagen de agente basada en Alpine |
| `.gitignore` | Reglas para excluir archivos del control de versiones |

Esta descripción es orientativa. **El contenido real de cada archivo es la fuente de verdad**. Revisa el archivo antes de utilizarlo y no deduzcas todos sus efectos únicamente por su nombre.

### El README del repositorio

El `README.md` presenta el proyecto y describe su propósito general:

- Proporcionar una configuración mínima para pruebas locales de Jenkins.
- Utilizar Vagrant y VirtualBox para crear una máquina virtual.
- Permitir, de forma opcional, practicar con SonarQube.
- Indicar requisitos y comandos iniciales.
- Mencionar los puertos habituales de Jenkins y SonarQube.
- Orientar sobre algunos problemas de red y aprovisionamiento.

El README también indica que el entorno está pensado para aprendizaje. Eso **no significa** que sea automáticamente adecuado para producción.

### Qué comprobar antes de usar la documentación

Cuando consultes el README:

1. Comprueba que estás viendo el repositorio correcto.
2. Comprueba la rama seleccionada.
3. Busca la sección de requisitos.
4. Lee las instrucciones completas antes de copiar comandos.
5. Revisa si los puertos o versiones han cambiado.
6. Confirma si el curso proporciona una configuración adicional.
7. Comprueba cuándo se actualizó la documentación.
8. Contrasta las instrucciones con el contenido de los archivos.
9. No ejecutes instrucciones que no entiendas.
10. Pregunta al docente antes de modificar equipos compartidos.

## Qué es un repositorio de código

Un repositorio de código es un espacio que contiene archivos y, normalmente, un historial de cambios.

Puede guardar:

- Código fuente.
- Scripts.
- Archivos de configuración.
- Definiciones de infraestructura.
- Documentación.
- Pruebas.
- Recursos de ejemplo.
- Historial de versiones.

Git permite registrar y comparar cambios en esos archivos.

### Repositorio remoto

El repositorio remoto es la copia alojada en un servicio como GitHub. En este curso, el repositorio remoto de referencia es el de Agile611.

El repositorio remoto permite:

- Compartir archivos con otras personas.
- Consultar versiones anteriores.
- Descargar el proyecto.
- Proponer cambios.
- Revisar aportaciones.
- Coordinar el trabajo mediante ramas y solicitudes de cambios.

Un repositorio público puede ser visible para cualquiera. No introduzcas en él datos privados, credenciales ni información sensible.

### Repositorio local

El repositorio local es la copia que tienes en tu equipo.

Al clonar un repositorio, Git descarga los archivos y parte de su historial para que puedas trabajar sin editar directamente la copia remota.

La copia local permite:

- Leer archivos.
- Ejecutar prácticas.
- Hacer cambios de prueba.
- Crear ramas.
- Registrar commits.
- Comparar tus cambios con la versión original.

### Archivos de trabajo y objetos de Git

Git administra dos conceptos que conviene distinguir:

- **Directorio de trabajo:** archivos que ves y editas.
- **Historial del repositorio:** commits que registran estados anteriores.

Cuando modificas un archivo, el historial no cambia automáticamente. Debes revisar y confirmar el cambio mediante los comandos adecuados.

### Remoto, rama y commit

- Un **remoto** identifica otro repositorio, como el alojado en GitHub.
- Una **rama** representa una línea de trabajo.
- Un **commit** registra un conjunto de cambios.
- Un **hash** identifica un commit de forma única.
- Una **solicitud de cambios** propone integrar cambios en otra rama.

En Git es habitual que el remoto principal se llame `origin`, pero ese nombre puede cambiar.

## Requisitos para trabajar con el repositorio

El README indica como requisitos generales Git, Vagrant y VirtualBox para la ruta basada en una máquina virtual. Las actividades concretas pueden necesitar otras herramientas.

### Requisitos para clonar y explorar

Para clonar y leer los archivos basta, en general, con:

- Git instalado.
- Conexión al repositorio.
- Un terminal o cliente gráfico de Git.
- Espacio de almacenamiento para la copia local.

### Requisitos para crear una máquina virtual

Para seguir la práctica basada en Vagrant, el README menciona:

- Vagrant.
- VirtualBox.
- Un sistema compatible con la virtualización.
- Espacio suficiente para descargar la caja y crear el disco virtual.
- Memoria disponible para ejecutar la máquina virtual.
- Acceso a la red para descargar dependencias, salvo que el laboratorio disponga de una caja precargada.

La virtualización puede estar desactivada en el firmware o restringida por el equipo anfitrión. En un ordenador gestionado por una organización, consulta antes de cambiarla.

### Requisitos para utilizar Docker

Las prácticas basadas en Docker pueden requerir:

- Docker instalado o un entorno compatible.
- Un servicio de contenedores en ejecución.
- Permisos suficientes.
- Acceso a los registros de imágenes.
- Puertos libres para los servicios utilizados.
- Memoria y almacenamiento disponibles.

No asumas que instalar Docker basta para poder ejecutarlo como usuario. Los permisos dependen del sistema y de la configuración del laboratorio.

### Herramientas opcionales del repositorio

El repositorio incluye scripts relacionados con herramientas como Terraform y Ansible. La presencia de esos archivos no implica que todas esas herramientas sean necesarias para cada práctica.

Antes de ejecutar una práctica:

- Identifica la herramienta que requiere.
- Comprueba su versión.
- Consulta el README.
- Lee el script correspondiente.
- Confirma que el ejercicio está pensado para tu sistema operativo.
- Utiliza solo recursos de laboratorio autorizados.

## Clonar el repositorio

Clonar crea una copia local del repositorio y la conecta con el remoto de origen.

### Comprobar la instalación de Git

Abre una terminal y ejecuta:

```bash
git --version
```

La salida debería mostrar la versión instalada.

Si aparece un mensaje como `command not found`, Git puede no estar instalado o no estar disponible en la variable `PATH`.

No instales software en un equipo administrado sin seguir el procedimiento de tu organización o del curso.

### Elegir un directorio de trabajo

Crea una carpeta para los repositorios del curso:

```bash
mkdir -p "$HOME/repos"
cd "$HOME/repos"
```

Comprueba la ubicación actual:

```bash
pwd
```

Utilizar un directorio conocido facilita encontrar el proyecto y evita guardar archivos de práctica en ubicaciones aleatorias.

### Clonar con HTTPS

Ejecuta:

```bash
git clone https://github.com/agile611/startusingjenkins.git
```

Git creará un directorio local llamado `startusingjenkins`.

Entra en el directorio:

```bash
cd startusingjenkins
```

Comprueba la ruta:

```bash
pwd
```

### Clonar con SSH

Si tienes configurado el acceso SSH a GitHub y el curso lo recomienda, puedes clonar con una URL SSH:

```bash
git clone git@github.com:agile611/startusingjenkins.git
```

No utilices esta opción si todavía no tienes una clave autorizada. Para explorar un repositorio público, HTTPS suele ser suficiente.

### Confirmar que el clon terminó correctamente

Ejecuta:

```bash
git status
```

Consulta los remotos:

```bash
git remote -v
```

Consulta la rama actual:

```bash
git branch --show-current
```

La rama predeterminada de la página del repositorio se indica como `main`, pero tu rama local puede depender de la configuración de Git y del momento en que clones el proyecto.

### Descargar actualizaciones sin modificar archivos

Para solicitar información nueva del remoto:

```bash
git fetch origin
```

`git fetch` obtiene información del remoto, pero no incorpora automáticamente los cambios a tus archivos.

Es una operación útil para revisar cambios antes de decidir cómo integrarlos.

### Actualizar una rama local

Si el docente indica que debes actualizar tu copia y no tienes cambios pendientes, puedes usar una operación adecuada para tu rama, por ejemplo:

```bash
git pull --ff-only
```

La opción `--ff-only` evita crear un merge automático cuando la historia no permite avanzar de forma lineal.

Si Git informa de conflictos o cambios divergentes, detente y consulta el procedimiento del curso. No fuerces la operación sin entender el estado del repositorio.

## Explorar la estructura del proyecto

Una primera inspección debe ser de solo lectura. Antes de ejecutar scripts, averigua qué archivos existen y qué indican.

### Listar archivos

Desde la raíz del repositorio:

```bash
ls -la
```

Para mostrar una lista de archivos en varios niveles:

```bash
find . -maxdepth 2 -type f -print
```

Si `tree` está instalado:

```bash
tree -L 2
```

`tree` es opcional. No es necesario instalarlo para completar la práctica.

### Leer el README

Desde la terminal:

```bash
less README.md
```

Para salir de `less`, pulsa `q`.

También puedes mostrarlo en la terminal:

```bash
cat README.md
```

Para buscar menciones a requisitos, puertos o comandos:

```bash
grep -nEi 'requisito|puerto|vagrant|docker|jenkins|sonarqube' README.md
```

La búsqueda muestra líneas coincidentes; lee el contexto de cada una antes de seguir la instrucción.

### Consultar archivos concretos

Puedes consultar un archivo sin ejecutarlo:

```bash
sed -n '1,220p' Vagrantfile
```

Para consultar un script:

```bash
sed -n '1,220p' docker.sh
```

Si el archivo tiene más líneas, utiliza `less` o ajusta el intervalo.

### Identificar el tipo de archivo

El comando `file` puede ayudar a identificar el formato:

```bash
file README.md Vagrantfile docker.sh
```

No siempre describe el contenido semántico, pero permite distinguir algunos formatos y tipos.

### Consultar el tamaño del repositorio

Para mostrar el tamaño aproximado de los archivos:

```bash
du -sh .
```

Las imágenes de contenedor y las cajas de Vagrant se descargan aparte, por lo que el espacio ocupado puede aumentar después de iniciar las prácticas.

## Leer un script antes de ejecutarlo

Un script es un archivo con instrucciones que un intérprete ejecuta. Algunos scripts instalan paquetes, crean recursos, modifican archivos o inician servicios.

No ejecutes un script únicamente porque su nombre parezca familiar.

### Inspección básica

Antes de usar un script:

1. Lee el archivo completo.
2. Identifica qué comandos utiliza.
3. Busca operaciones que descarguen o ejecuten archivos.
4. Busca cambios en servicios, puertos o permisos.
5. Comprueba si utiliza `sudo`.
6. Comprueba si borra o reemplaza archivos.
7. Revisa qué variables necesita.
8. Comprueba si contiene rutas específicas de otro sistema.
9. Verifica si acepta argumentos.
10. Pregunta al docente ante cualquier duda.

### Buscar comandos relevantes

Puedes buscar palabras que merecen revisión:

```bash
grep -nE 'sudo|rm |curl|wget|docker|vagrant|systemctl|apt|terraform|ansible' docker.sh
```

Esta búsqueda es solo una ayuda para localizar líneas. No demuestra que el script sea seguro ni reemplaza su lectura completa.

### Examinar el intérprete y las primeras líneas

Consulta el inicio del script:

```bash
head -n 40 jenkins.sh
```

La primera línea puede indicar el intérprete, por ejemplo Bash. Las siguientes líneas pueden mostrar opciones y variables iniciales.

### Consultar argumentos y uso

Busca referencias a `$1`, `$2`, `"$@"`, `case` o mensajes de ayuda:

```bash
grep -nE '\$1|\$2|\$@|case|usage|Usage|help' jenkins.sh
```

Un script puede esperar argumentos. Ejecutarlo sin ellos puede producir un error o un comportamiento distinto del previsto.

### No inferir el comportamiento por el nombre

El archivo `terraform.sh` sugiere una relación con Terraform, pero no permite saber por sí solo:

- Qué directorio usa.
- Si inicializa un proyecto.
- Si ejecuta un plan.
- Si aplica cambios.
- Si accede a una cuenta externa.
- Si requiere credenciales.

Lee su contenido y sigue las instrucciones del curso.

## El archivo `Vagrantfile`

Vagrant utiliza un `Vagrantfile` para describir máquinas virtuales de desarrollo o laboratorio.

El README del repositorio describe un entorno local de prueba con una máquina virtual basada en Ubuntu y señala el uso de VirtualBox.

### Qué puede definir un `Vagrantfile`

Dependiendo del proyecto, puede especificar:

- La caja base.
- El proveedor de virtualización.
- Los puertos que se redirigen.
- La memoria y los procesadores asignados.
- Las carpetas compartidas.
- La configuración de red.
- Los pasos de aprovisionamiento.
- El nombre lógico de la máquina.

No presupongas que todos esos valores están presentes. Comprueba el archivo real.

### Leer el `Vagrantfile`

Desde la raíz del repositorio:

```bash
less Vagrantfile
```

Busca términos relacionados con la configuración:

```bash
grep -nE 'config.vm|provider|memory|cpus|forwarded_port|provision' Vagrantfile
```

Estos términos facilitan la navegación; para entender el efecto de la configuración, lee las líneas cercanas.

### Comandos comunes de Vagrant

En el README se propone iniciar el entorno con:

```bash
vagrant up
```

El comando intenta crear e iniciar la máquina definida por el proyecto.

El README también muestra una conexión a la máquina llamada `jenkins`:

```bash
vagrant ssh jenkins
```

Utiliza estos comandos solo cuando:

- Vagrant y VirtualBox están instalados.
- Has leído el `Vagrantfile`.
- Tienes permiso para crear una máquina virtual.
- Cuentas con recursos suficientes.
- La práctica del curso indica que debes iniciarla.

### Consultar el estado de Vagrant

Desde el directorio que contiene el `Vagrantfile`:

```bash
vagrant status
```

El estado puede indicar que la máquina está activa, detenida o todavía no creada.

### Detener la máquina virtual

Para apagar una máquina sin eliminarla:

```bash
vagrant halt
```

Confirma que estás en el directorio de la máquina correcta antes de ejecutarlo.

### Suspender y reanudar

Vagrant permite suspender o reanudar una máquina en configuraciones compatibles:

```bash
vagrant suspend
```

```bash
vagrant resume
```

El comportamiento puede depender del proveedor y del estado de la máquina.

### Destruir la máquina

`vagrant destroy` elimina la máquina virtual creada por Vagrant. Puede borrar datos que no estén en carpetas compartidas.

No lo ejecutes hasta confirmar:

- Qué máquina va a eliminarse.
- Si hay archivos importantes dentro de la máquina.
- Si el entorno pertenece a tu práctica.
- Si el docente pide conservarlo.

### Cajas de Vagrant

Una caja de Vagrant es una imagen base reutilizable para crear máquinas virtuales.

La primera ejecución puede tardar porque Vagrant puede descargar la caja y ejecutar tareas de aprovisionamiento.

Si la descarga falla:

- Comprueba la conexión.
- Consulta si la red del laboratorio usa proxy o VPN.
- Revisa los mensajes de Vagrant.
- Consulta las instrucciones del curso.
- No descargues cajas de una fuente desconocida.

## El script `docker.sh`

La página del repositorio describe `docker.sh` como un script para crear o gestionar contenedores y servicios. También indica que hay que revisar su contenido para conocer los puertos y volúmenes.

### Qué revisar en `docker.sh`

Antes de ejecutarlo, investiga:

- Qué imágenes intenta utilizar.
- Qué nombres asigna a los contenedores.
- Qué puertos publica.
- Qué volúmenes monta.
- Qué variables espera.
- Si crea una red.
- Si inicia Jenkins, SonarQube u otros servicios.
- Si elimina recursos existentes.
- Si necesita permisos elevados.
- Cómo se detienen los servicios.
- Cómo se conservan o eliminan los datos.

### Consultar el archivo

```bash
less docker.sh
```

Busca operaciones habituales:

```bash
grep -nE 'docker|ports|volumes|rm|stop|run|compose' docker.sh
```

Esta búsqueda no reemplaza la lectura completa.

### Puertos

El README menciona, como valores por defecto configurables:

- Jenkins: `8080`.
- SonarQube: `9000`.

Esos valores pueden cambiar según el script o la configuración local.

Antes de iniciar un servicio, comprueba:

- Qué puerto del equipo anfitrión se utiliza.
- A qué puerto del contenedor se conecta.
- Si el puerto ya está ocupado.
- Si otra aplicación del laboratorio lo necesita.
- Si el servicio queda expuesto más allá de tu equipo.

### Volúmenes

Un volumen puede conservar datos fuera del ciclo de vida de un contenedor.

Antes de montar o borrar un volumen, identifica:

- Qué directorio o volumen se utiliza.
- Qué datos contiene.
- Si es compartido por otros ejercicios.
- Si se necesita conservar el historial de Jenkins.
- Qué procedimiento permite recuperar el estado.

La opción de borrar un contenedor no siempre borra sus volúmenes, y borrar un volumen puede eliminar información persistente.

## Los scripts `jenkins.sh` y `sonarqube.sh`

El README describe `jenkins.sh` como un script de ayuda relacionado con el acceso y la gestión de Jenkins. Describe `sonarqube.sh` como un script para iniciar SonarQube en modo de desarrollo.

Estas descripciones no especifican todos los comandos que ejecuta cada script. Consulta su contenido antes de utilizarlos.

### Revisar `jenkins.sh`

```bash
less jenkins.sh
```

Busca:

- La forma de obtener la URL del servicio.
- Si muestra o consulta credenciales iniciales.
- Si inicia o detiene servicios.
- Si requiere un contenedor en ejecución.
- Si consulta archivos locales.
- Si imprime información sensible.
- Si recibe argumentos.

### Revisar `sonarqube.sh`

```bash
less sonarqube.sh
```

Comprueba:

- Qué imagen o servicio utiliza.
- Cómo asigna el puerto.
- Si conserva datos.
- Qué memoria requiere.
- Qué otras dependencias necesita.
- Cómo se inicia y se detiene.
- Si la configuración es adecuada para un ejercicio local.

### Credenciales iniciales

Jenkins y otros servicios pueden solicitar una configuración inicial.

Si un script muestra una contraseña temporal o un secreto:

- Utilízalo únicamente en el laboratorio autorizado.
- No lo publiques en un repositorio.
- No lo incluyas en capturas compartidas.
- No lo reutilices como contraseña de otros sistemas.
- Sigue las indicaciones del docente para su almacenamiento y eliminación.

## Archivos `DockerfileAgent2404` y `DockerfileAgentAlpine`

Un `Dockerfile` contiene instrucciones para construir una imagen de contenedor. En este repositorio hay dos archivos que parecen definir agentes con bases distintas.

### Qué puede contener un Dockerfile

Un Dockerfile puede especificar:

- Una imagen base.
- Paquetes del sistema.
- Herramientas instaladas.
- Un usuario.
- Directorios de trabajo.
- Variables de entorno.
- Comandos de entrada.
- Archivos copiados a la imagen.

Comprueba su contenido antes de construir una imagen.

### Comparar los dos archivos

Consulta ambos archivos:

```bash
less DockerfileAgent2404
```

```bash
less DockerfileAgentAlpine
```

Puedes comparar sus diferencias:

```bash
diff -u DockerfileAgent2404 DockerfileAgentAlpine
```

La comparación puede mostrar diferencias en:

- Distribución base.
- Gestor de paquetes.
- Paquetes instalados.
- Comandos disponibles.
- Usuario predeterminado.
- Scripts de inicio.

No concluyas que una imagen es mejor únicamente porque tenga un nombre más reciente.

### Compatibilidad de herramientas

Una herramienta que funciona en Ubuntu puede necesitar instrucciones distintas en Alpine, porque las distribuciones utilizan bibliotecas y gestores de paquetes diferentes.

Al elegir una imagen, ten en cuenta:

- Herramientas que requiere el pipeline.
- Compatibilidad de dependencias.
- Tiempo de construcción.
- Tamaño de la imagen.
- Requisitos de seguridad.
- Documentación de mantenimiento.

### Construir una imagen de prueba

Solo si Docker está disponible y el docente lo permite, se puede construir una imagen para inspeccionarla.

Primero confirma el directorio y el archivo:

```bash
pwd
ls -l DockerfileAgent2404
```

El comando de construcción puede tener una forma similar a:

```bash
docker build -f DockerfileAgent2404 -t agente-curso:prueba .
```

Ejecuta un comando de construcción solo después de comprobar el archivo y el contexto. La descarga de una imagen base puede requerir acceso a Internet y ocupar almacenamiento.

## El archivo `.gitignore`

El archivo `.gitignore` define patrones de archivos que Git debería ignorar cuando todavía no están bajo seguimiento.

### Usos habituales

Puede excluir:

- Archivos temporales.
- Registros.
- Resultados de construcción.
- Configuración personal.
- Directorios generados por herramientas.
- Credenciales locales.

### Revisar las reglas actuales

```bash
cat .gitignore
```

Comprueba si existe:

```bash
test -f .gitignore && echo "Hay un .gitignore" || echo "No se encontró .gitignore"
```

### Lo que `.gitignore` no hace

`.gitignore` no:

- Elimina archivos que ya se confirmaron.
- Protege archivos contra lectura local.
- Sustituye un gestor de secretos.
- Evita que una persona fuerce la inclusión de un archivo.
- Elimina un secreto del historial de Git.

Si se ha confirmado un secreto, considera que pudo quedar expuesto y sigue el procedimiento de revocación o rotación correspondiente.

## Ramas y cambios locales

Para practicar modificaciones, crea una rama propia. Así mantendrás separadas tus pruebas de la rama base.

### Comprobar el estado inicial

Desde la raíz del repositorio:

```bash
git status
```

Si existen cambios locales que no reconoces, no los descartes. Averigua primero de dónde proceden.

### Consultar las ramas

```bash
git branch
```

Para incluir ramas remotas:

```bash
git branch -a
```

### Crear una rama de práctica

Un nombre descriptivo puede ser:

```bash
git switch -c practica/documentar-repositorio
```

Comprueba la rama actual:

```bash
git branch --show-current
```

Los nombres de rama son una convención del equipo; utiliza la indicada por el docente si existe.

### Modificar un archivo de documentación

Una práctica segura consiste en añadir una nota local a un documento o crear un archivo nuevo en una rama personal.

Antes de cambiar el README del proyecto original, consulta las instrucciones del curso. Para experimentar, puedes crear un archivo separado, por ejemplo:

```bash
mkdir -p notas-alumno
printf 'Notas de exploración del repositorio\n' > notas-alumno/README.md
```

No añadas archivos personales al repositorio original si no forman parte de la práctica.

### Revisar el cambio

```bash
git status
git diff
```

Si el archivo es nuevo y todavía no está bajo seguimiento, `git diff` puede no mostrar su contenido. Comprueba el estado antes de añadirlo.

### Preparar y confirmar el cambio

Si la práctica solicita crear un commit:

```bash
git add notas-alumno/README.md
git diff --cached
git commit -m "Añade notas de exploración del repositorio"
```

El mensaje debe describir el cambio realizado.

### Consultar el commit

```bash
git log -1 --oneline
git show --stat --oneline HEAD
```

Esto permite revisar el commit más reciente y los archivos que incluye.

## Actualizar el repositorio

El repositorio puede cambiar después de que lo hayas clonado.

### Comprobar la rama y el estado

Antes de actualizar:

```bash
git branch --show-current
git status
```

No mezcles una actualización con cambios locales sin confirmar, salvo que entiendas el procedimiento.

### Obtener novedades

```bash
git fetch origin
```

Consulta los commits que están en el remoto y todavía no en tu rama:

```bash
git log --oneline HEAD..origin/main
```

Este comando supone que la rama remota se llama `origin/main`. Comprueba primero el nombre real si no aparece.

### Actualizar una copia sin cambios locales

Si estás en la rama `main` y el curso indica que debes actualizarla:

```bash
git pull --ff-only origin main
```

No ejecutes este comando en una rama distinta esperando que actualice todo el repositorio.

### Si hay cambios locales

Si Git informa de cambios locales o conflictos:

- Detente y lee el mensaje completo.
- No ejecutes `reset --hard` para «arreglarlo».
- No borres archivos para forzar la actualización.
- Consulta si el cambio debe conservarse.
- Utiliza el procedimiento de ramas y revisión indicado por el docente.

## Fork, rama y solicitud de cambios

Para contribuir a un proyecto público, el flujo habitual consiste en proponer cambios sin escribir directamente en el repositorio original.

### Fork

Un *fork* es una copia del repositorio bajo otra cuenta u organización.

Puede utilizarse para preparar cambios cuando no se tienen permisos de escritura en el proyecto original.

### Rama de trabajo

Dentro del fork, se crea una rama con un propósito concreto.

Por ejemplo:

```text
docs/aclarar-requisitos
```

Evita incluir varios cambios no relacionados en una sola rama.

### Solicitud de cambios

Una solicitud de cambios, llamada *pull request* en GitHub, permite proponer que los cambios se integren en el repositorio de origen.

Una propuesta útil incluye:

- El problema que resuelve.
- Los archivos modificados.
- Cómo se verificó el cambio.
- Capturas o resultados, si aportan contexto.
- Cualquier limitación conocida.

### Revisar antes de proponer

Antes de abrir una solicitud:

```bash
git status
git diff
git diff --check
```

Comprueba que:

- No añadiste credenciales.
- No incluiste archivos generados accidentalmente.
- La documentación concuerda con el comportamiento real.
- Los comandos se pueden reproducir.
- El cambio tiene un alcance claro.

En este curso, la contribución al repositorio público es opcional y debe ajustarse a las instrucciones del docente.

## Seguridad al trabajar con el repositorio

El repositorio es un recurso de aprendizaje, pero sus scripts pueden interactuar con el sistema operativo y la red.

### Principio de mínimo privilegio

Utiliza solo los permisos necesarios para la actividad.

Evita:

- Ejecutar todo con `sudo`.
- Usar credenciales administrativas en contenedores sin motivo.
- Dar acceso a Jenkins a recursos que no requiere.
- Abrir servicios a redes públicas durante una práctica local.
- Compartir una contraseña inicial por canales públicos.

### Revisar antes de ejecutar

Antes de ejecutar un archivo, comprueba:

- Qué intérprete utiliza.
- Qué comandos ejecuta.
- Qué recursos modifica.
- Qué archivos crea.
- Qué puertos publica.
- Qué datos persiste.
- Qué credenciales consume.
- Cómo detenerlo o limpiarlo.

### Proteger las credenciales

No guardes en el repositorio:

- Contraseñas.
- Tokens de GitHub.
- Claves SSH privadas.
- Claves de acceso a servicios en la nube.
- Credenciales de Jenkins.
- Secretos de SonarQube.
- Archivos `.env` con valores reales.

Si necesitas incluir ejemplos de configuración, utiliza valores ficticios y explícitamente no válidos.

### Revisar la procedencia

Antes de confiar en un archivo descargado o en una instrucción:

- Comprueba el dominio.
- Comprueba el propietario del repositorio.
- Comprueba la rama.
- Comprueba los cambios recientes.
- Compara las instrucciones con la documentación.
- Evita ejecutar archivos obtenidos de fuentes desconocidas.

## Sesión práctica 1: clonar y explorar el repositorio

En esta sesión obtendrás una copia local y elaborarás un primer inventario.

### Duración orientativa

- Lectura y preparación: 5 minutos.
- Clonado: 5 minutos.
- Exploración: 15 minutos.
- Puesta en común: 10 minutos.

### Paso 1: crear el directorio

```bash
mkdir -p "$HOME/repos"
cd "$HOME/repos"
```

### Paso 2: clonar el repositorio

```bash
git clone https://github.com/agile611/startusingjenkins.git
cd startusingjenkins
```

### Paso 3: verificar el estado

```bash
git status
git remote -v
git branch --show-current
```

Anota:

- La rama local.
- La dirección del remoto.
- Si el directorio tiene cambios pendientes.
- El nombre del directorio local.

### Paso 4: enumerar archivos

```bash
find . -maxdepth 2 -type f -print | sort
```

Identifica:

- El archivo de documentación.
- El archivo de configuración de Vagrant.
- Los scripts disponibles.
- Los Dockerfiles.
- El archivo de exclusiones de Git.

### Paso 5: leer el README

```bash
less README.md
```

Busca respuestas a estas preguntas:

- ¿Cuál es el propósito del repositorio?
- ¿Qué herramientas pide instalar?
- ¿Qué proveedor de virtualización menciona?
- ¿Qué servicios aparecen en la guía?
- ¿Qué puertos se mencionan?
- ¿Qué comandos de Vagrant muestra?
- ¿Qué problemas habituales describe?

### Paso 6: crear un inventario escrito

Crea un archivo fuera del repositorio para tus notas:

```bash
cat > "$HOME/repos/inventario-repositorio.md" <<'EOF'
# Inventario del repositorio

## Propósito

Completar durante la práctica.

## Archivos principales

Completar durante la práctica.

## Herramientas requeridas

Completar durante la práctica.

## Dudas y observaciones

Completar durante la práctica.
EOF
```

Completa el archivo con tus respuestas.

### Resultado esperado

Al finalizar, deberías poder explicar:

- Cómo se llama el repositorio.
- Qué problema educativo intenta resolver.
- Qué archivos parecen importantes.
- Qué herramientas se necesitan para las prácticas de Vagrant.
- Por qué es necesario leer los scripts antes de ejecutarlos.

## Sesión práctica 2: inspeccionar un script sin ejecutarlo

En esta sesión practicarás la lectura estática de un script.

### Seleccionar un archivo

Escoge uno de los archivos de ayuda, por ejemplo:

```text
docker.sh
```

No lo ejecutes durante esta actividad.

### Consultar el contenido

```bash
sed -n '1,240p' docker.sh
```

Si el archivo tiene más contenido, continúa con otro intervalo o utiliza:

```bash
less docker.sh
```

### Registrar las instrucciones observadas

Crea una tabla en tus notas:

| Pregunta | Observación |
|---|---|
| ¿Qué intérprete parece utilizar? | |
| ¿Qué comandos externos invoca? | |
| ¿Qué variables utiliza? | |
| ¿Qué puertos aparecen? | |
| ¿Qué volúmenes aparecen? | |
| ¿Modifica o elimina recursos? | |
| ¿Necesita permisos elevados? | |
| ¿Cómo parece detenerse el servicio? | |
| ¿Qué dudas quedan? | |

### Buscar operaciones delicadas

Ejecuta:

```bash
grep -nE 'sudo|rm |docker|curl|wget|systemctl|apt' docker.sh
```

Para cada línea coincidente:

- Lee las líneas anteriores y posteriores.
- Explica qué recurso puede modificarse.
- Indica qué dato necesitarías para usarla.
- Anota si el comando podría afectar a recursos ajenos.

### Comparar con el README

Comprueba si las instrucciones del README describen el mismo flujo que el script.

Si encuentras una diferencia:

- Anota las dos versiones.
- No decidas por tu cuenta cuál es correcta.
- Comprueba la fecha y la rama.
- Consulta al docente antes de ejecutar el flujo.

### Resultado esperado

Al finalizar, deberías poder explicar qué has aprendido del script **sin haberlo ejecutado** y señalar qué información te falta antes de usarlo.

## Sesión práctica 3: crear una rama y guardar un cambio

En esta sesión practicarás un cambio local de bajo riesgo. No se propone modificar el funcionamiento de Jenkins ni de Docker.

### Comprobar el estado

Desde la raíz del repositorio:

```bash
git status
```

Si hay cambios que no reconoces, no continúes hasta aclarar su origen.

### Crear una rama

```bash
git switch -c practica/notas-repositorio
```

Comprueba la rama:

```bash
git branch --show-current
```

### Crear un archivo de notas de práctica

Crea un directorio temporal que no contenga credenciales:

```bash
mkdir -p notas-practica
```

Crea un archivo de texto:

```bash
cat > notas-practica/exploracion.md <<'EOF'
# Exploración del repositorio

## Archivos revisados

Completar después de inspeccionar el repositorio.

## Requisitos observados

Completar después de leer el README.

## Precauciones

Inspeccionar scripts antes de ejecutarlos.
No guardar secretos en el repositorio.
EOF
```

### Revisar el cambio

```bash
git status
git diff
```

Como el archivo es nuevo, `git diff` puede no mostrarlo hasta que se prepare. Añádelo temporalmente al área de preparación:

```bash
git add notas-practica/exploracion.md
git diff --cached
```

### Crear un commit

```bash
git commit -m "Añade notas de exploración del repositorio"
```

### Consultar el resultado

```bash
git log -1 --oneline
git status
```

### Limpiar la rama de práctica

Si el docente indica que la rama es solo local y se puede descartar, puedes volver a la rama original:

```bash
git switch main
```

Antes de eliminar una rama, confirma que no contiene trabajo que debas conservar.

La eliminación de una rama es opcional y debe ajustarse a las instrucciones del curso.

## Sesión práctica 4: revisar archivos de contenedor

En esta sesión compararás las definiciones de agentes disponibles en el repositorio.

### Consultar los archivos

```bash
sed -n '1,220p' DockerfileAgent2404
```

```bash
sed -n '1,220p' DockerfileAgentAlpine
```

### Comparar los archivos

```bash
diff -u DockerfileAgent2404 DockerfileAgentAlpine
```

Si la salida es extensa, identifica primero:

- La imagen base.
- El gestor de paquetes.
- Los paquetes instalados.
- El usuario.
- Los comandos de inicio.
- Las rutas creadas.
- Las variables definidas.

### Completar una comparación

| Aspecto | `DockerfileAgent2404` | `DockerfileAgentAlpine` |
|---|---|---|
| Imagen base | | |
| Gestor de paquetes | | |
| Herramientas instaladas | | |
| Usuario configurado | | |
| Directorio de trabajo | | |
| Comando de inicio | | |
| Diferencias relevantes | | |

### Preguntas para el grupo

- ¿Qué herramientas necesita un agente de Jenkins?
- ¿Qué herramientas aparecen en cada definición?
- ¿Qué problemas de compatibilidad podrían presentarse?
- ¿Qué imagen parece más adecuada para una tarea concreta y por qué?
- ¿Qué información falta para tomar una decisión segura?
- ¿Cómo se comprobaría que la imagen construida funciona?

### Actividad opcional

Si Docker está instalado y el docente lo autoriza, construye una imagen de prueba siguiendo las instrucciones del laboratorio.

No ejecutes una construcción si:

- Estás en un equipo compartido sin permiso.
- El Dockerfile descarga contenido no revisado.
- No tienes espacio suficiente.
- No sabes qué etiqueta o contexto estás utilizando.

## Sesión práctica 5: preparar el entorno Vagrant

Esta sesión solo se realiza si el equipo dispone de Vagrant y VirtualBox, y si el docente autoriza crear la máquina virtual.

### Preparación

Comprueba las versiones:

```bash
vagrant --version
```

```bash
VBoxManage --version
```

El segundo comando depende de la instalación y del sistema operativo.

Comprueba el estado del repositorio:

```bash
git status
```

### Inspeccionar el `Vagrantfile`

Antes de crear la máquina:

```bash
less Vagrantfile
```

Anota:

- El nombre de la máquina.
- La caja base.
- La configuración de red.
- Los puertos reenviados.
- La memoria asignada, si está definida.
- Los pasos de aprovisionamiento.
- Los archivos compartidos.
- Los comandos que podrían instalar software.

### Confirmar recursos

Comprueba que tienes:

- Espacio para descargar la caja.
- Memoria suficiente.
- Virtualización disponible.
- Permiso para usar VirtualBox.
- Conectividad para el aprovisionamiento.

### Iniciar el entorno

Solo después de la revisión y con autorización:

```bash
vagrant up
```

Observa los mensajes durante la ejecución.

No cierres la terminal con una operación en curso si no sabes qué estado dejará.

### Consultar el estado

```bash
vagrant status
```

### Conectarse a la máquina indicada

El README muestra una conexión de ejemplo:

```bash
vagrant ssh jenkins
```

Utiliza ese nombre solo si coincide con la configuración actual y la instrucción de la práctica.

### Finalizar la sesión

Para apagar la máquina y conservarla:

```bash
vagrant halt
```

Para limpiar o eliminar la máquina, sigue el procedimiento del docente.

### Registrar problemas

Si falla el aprovisionamiento, anota:

- El comando ejecutado.
- La etapa en la que falló.
- El mensaje de error.
- La versión de Vagrant.
- La versión de VirtualBox.
- Si utilizas VPN o proxy.
- Si el error ocurre también en otros equipos.

No compartas claves, contraseñas o datos privados al informar del fallo.

## Sesión práctica 6: reconocer puertos y servicios

El README menciona valores por defecto para Jenkins y SonarQube, pero la configuración local puede variar.

### Identificar servicios mencionados

Completa esta tabla:

| Servicio | Puerto mencionado en la documentación | ¿Es fijo? | ¿Dónde lo verificarías? |
|---|---:|---|---|
| Jenkins | 8080 | No necesariamente | README, script y configuración |
| SonarQube | 9000 | No necesariamente | README, script y configuración |

### Preguntas para discutir

- ¿El puerto publicado por el anfitrión tiene que coincidir con el del contenedor?
- ¿Qué puede ocurrir si otra aplicación ya usa ese puerto?
- ¿Qué riesgos aparecen si un servicio queda accesible desde una red externa?
- ¿Cómo se comprueba a qué dirección se enlaza el servicio?
- ¿Por qué la documentación dice que esos puertos son configurables?

### Comprobar un puerto ocupado

La herramienta disponible depende del sistema operativo.

En algunas instalaciones de Linux puede utilizarse:

```bash
ss -ltn
```

La salida muestra sockets TCP en escucha.

No cambies el puerto de un servicio sin revisar el archivo de configuración y seguir el procedimiento de la práctica.

## Cómo comunicar un problema del repositorio

Un informe claro ayuda a reproducir y resolver el problema.

### Información útil

Incluye:

- La URL del repositorio.
- La rama o commit utilizado.
- El sistema operativo.
- La versión de Git, Vagrant o Docker relevante.
- El comando ejecutado.
- El resultado esperado.
- El resultado obtenido.
- El mensaje de error completo.
- Los pasos que ya intentaste.
- Si el problema se reproduce en otro entorno.

### Información que debes ocultar

Elimina o sustituye:

- Contraseñas.
- Tokens.
- Claves privadas.
- Direcciones de servicios internos no autorizadas.
- Datos personales de terceros.
- Identificadores de cuentas sensibles.

### Plantilla de informe

```text
Título:
[Resumen corto del problema]

Repositorio:
https://github.com/agile611/startusingjenkins

Rama o commit:
[Nombre o identificador]

Sistema operativo:
[Distribución y versión]

Herramientas:
[Git, Vagrant, VirtualBox, Docker y versiones relevantes]

Pasos para reproducir:
1.
2.
3.

Resultado esperado:
[Qué debía ocurrir]

Resultado observado:
[Qué ocurrió]

Mensaje de error:
[Texto sin secretos]

Notas:
[Comprobaciones realizadas]
```

## Errores frecuentes al trabajar con repositorios

### `fatal: not a git repository`

Suele indicar que el comando se ejecutó fuera de la carpeta del repositorio.

Comprueba:

```bash
pwd
ls -la
```

Entra en el directorio correcto y confirma que existe `.git`.

### `destination path already exists`

Puede aparecer si ya existe un directorio con el nombre usado para clonar.

Comprueba si ese directorio contiene una copia anterior:

```bash
cd "$HOME/repos"
ls -la
```

No lo borres sin revisar su contenido. Puedes elegir otro directorio o actualizar la copia existente.

### No se puede clonar por autenticación

El repositorio de referencia se presenta como público, por lo que la lectura mediante HTTPS normalmente no requiere autenticación. Aun así, la red o la configuración local pueden interferir.

Comprueba:

- La URL.
- La conexión.
- El proxy o VPN.
- La configuración de Git.
- El mensaje completo del error.

No compartas contraseñas en el informe.

### No se pueden actualizar los archivos

Puede haber cambios locales, conflictos o una rama diferente.

Ejecuta:

```bash
git status
git branch --show-current
```

No uses comandos destructivos para hacer desaparecer el problema.

### Un script no se puede ejecutar

Puede faltar el permiso de ejecución o puede existir una incompatibilidad de shell.

Antes de cambiar permisos:

- Lee el script.
- Comprueba su intérprete.
- Confirma el sistema operativo.
- Consulta si debe ejecutarse con `bash script.sh`.
- Sigue la práctica indicada.

### Un puerto está ocupado

El README advierte que puede ser necesario cambiar la configuración o liberar el puerto.

En un equipo compartido, no detengas un proceso sin identificarlo y confirmar que puedes hacerlo.

Alternativas posibles, según la práctica:

- Utilizar otro puerto permitido.
- Cerrar una aplicación propia que no se esté usando.
- Solicitar ayuda al administrador.
- Utilizar el entorno preparado por el curso.

### Vagrant no puede descargar la caja

Posibles causas:

- Falta de conectividad.
- Proxy o VPN.
- Servicio remoto temporalmente indisponible.
- Restricciones del laboratorio.
- Almacenamiento insuficiente.
- Certificados o configuración de red.

El README menciona que, ante problemas de aprovisionamiento, puede ser necesario descargar o añadir la caja directamente. Sigue las instrucciones actuales del docente antes de hacerlo.

### Docker no puede iniciar un contenedor

Posibles causas:

- Docker no está instalado.
- El daemon no está en ejecución.
- Faltan permisos.
- El puerto está ocupado.
- No se puede descargar una imagen.
- Falta memoria o espacio.
- El nombre del contenedor ya está en uso.

Consulta el mensaje completo y los registros. No elimines contenedores o volúmenes compartidos sin confirmar su propósito.

## Licencia y uso del material

La página del repositorio indica una licencia MIT para el proyecto y menciona por separado una licencia Creative Commons Atribución-NoComercial 4.0 Internacional para el tutorial.

La licencia aplicable puede depender del archivo y del tipo de contenido.

Antes de reutilizar, publicar o redistribuir material:

- Lee los avisos de licencia del repositorio.
- Comprueba si un archivo contiene una licencia específica.
- Conserva las atribuciones requeridas.
- Consulta al docente ante dudas.
- No supongas que todos los materiales tienen las mismas condiciones.

Esta unidad sirve como documentación educativa y no sustituye la información legal del repositorio.

## Preguntas de repaso

1. ¿Qué diferencia hay entre un repositorio remoto y uno local?
2. ¿Qué comando clona el repositorio del curso?
3. ¿Qué información contiene el `README.md`?
4. ¿Por qué conviene leer un script antes de ejecutarlo?
5. ¿Qué función cumple un `Vagrantfile`?
6. ¿Qué diferencia hay entre detener y destruir una máquina virtual?
7. ¿Por qué los puertos mencionados en el README pueden cambiar?
8. ¿Qué puede ocurrir si se borra un volumen de Docker?
9. ¿Qué aporta una rama de práctica?
10. ¿Qué diferencia hay entre `git fetch` y una actualización que integra cambios?
11. ¿Por qué `.gitignore` no es suficiente para proteger un secreto ya confirmado?
12. ¿Qué datos debe incluir un informe de error?
13. ¿Qué información debería ocultarse al compartir un registro?
14. ¿Por qué el contenido real de un script tiene prioridad sobre su nombre?
15. ¿Qué comprobaciones realizarías antes de iniciar Vagrant?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«El repositorio tiene un script llamado `docker.sh`, así que puedo ejecutarlo sin leerlo».

### Afirmación 2

«Clonar un repositorio crea una copia local y conserva información de Git».

### Afirmación 3

«El README menciona el puerto 8080, por lo que Jenkins siempre tiene que escuchar en ese puerto».

### Afirmación 4

«El archivo `.gitignore` impide que un secreto confirmado anteriormente aparezca en el historial».

### Afirmación 5

«Antes de ejecutar `vagrant up`, conviene leer el `Vagrantfile`».

### Afirmación 6

«La presencia de `terraform.sh` significa que cualquier persona debe ejecutar Terraform».

### Afirmación 7

«Una rama de práctica puede aislar cambios locales de la rama base».

### Afirmación 8

«Una máquina virtual y un contenedor son exactamente lo mismo».

### Afirmación 9

«Un informe de error debería incluir el comando y el mensaje, pero no una contraseña».

### Afirmación 10

«Si un puerto está ocupado, puedo cerrar cualquier proceso que lo use».

## Respuestas orientativas

### Afirmación 1

**Incorrecta.** Lee el script antes de ejecutarlo y confirma su efecto.

### Afirmación 2

**Correcta.** La copia local permite leer archivos y trabajar con el historial.

### Afirmación 3

**Incorrecta.** El README presenta valores por defecto configurables. Comprueba la configuración real.

### Afirmación 4

**Incorrecta.** `.gitignore` no elimina archivos del historial existente.

### Afirmación 5

**Correcta.** El `Vagrantfile` puede definir recursos y pasos de aprovisionamiento.

### Afirmación 6

**Incorrecta.** Un archivo no implica que todas las actividades requieran esa herramienta.

### Afirmación 7

**Correcta.** Una rama ayuda a separar líneas de trabajo.

### Afirmación 8

**Incorrecta.** Una máquina virtual emula un sistema completo; un contenedor aísla procesos y comparte el núcleo del sistema anfitrión.

### Afirmación 9

**Correcta.** El informe necesita detalles reproducibles, pero nunca debe exponer secretos.

### Afirmación 10

**Incorrecta.** Identifica el proceso y comprueba que tienes autorización antes de detenerlo.

## Glosario

- **Agente:** sistema que ejecuta tareas automatizadas, por ejemplo, un agente de Jenkins.
- **Caja de Vagrant:** imagen base utilizada para crear máquinas virtuales gestionadas por Vagrant.
- **Clonar:** crear una copia local de un repositorio remoto mediante Git.
- **Commit:** registro de cambios en el historial de Git.
- **Contenedor:** entorno aislado que ejecuta procesos a partir de una imagen.
- **Dockerfile:** archivo con instrucciones para construir una imagen de contenedor.
- **Fork:** copia de un repositorio bajo otra cuenta u organización.
- **Git:** sistema distribuido de control de versiones.
- **Máquina virtual:** sistema informático virtualizado que ejecuta un sistema operativo invitado.
- **Origen o remoto:** nombre asociado a otro repositorio, como `origin`.
- **Puerto:** número que identifica un punto de comunicación de red.
- **Pull request:** propuesta para revisar e integrar cambios en un repositorio.
- **Rama:** línea de trabajo independiente dentro del historial de Git.
- **Repositorio local:** copia del proyecto disponible en el equipo del usuario.
- **Repositorio remoto:** copia alojada en un servicio de Git accesible por red.
- **Script:** archivo de texto con instrucciones ejecutables por un intérprete.
- **Vagrantfile:** archivo que describe la configuración de una o más máquinas Vagrant.
- **Volumen:** mecanismo para conservar o compartir datos utilizados por contenedores.

## Resumen

- El repositorio del curso es `https://github.com/agile611/startusingjenkins`.
- Su documentación describe un entorno educativo de Jenkins basado en Vagrant y VirtualBox, con opciones relacionadas con Docker y SonarQube.
- El repositorio contiene un README, un `Vagrantfile`, scripts de ayuda, Dockerfiles y un `.gitignore`.
- Clonar permite obtener una copia local para leer y practicar.
- Antes de ejecutar un script, hay que revisar sus comandos, recursos, permisos y efectos.
- Los puertos y requisitos pueden cambiar; confirma siempre los valores actuales.
- Las ramas y los commits permiten practicar cambios sin alterar la copia remota.
- No guardes contraseñas, tokens ni claves privadas en el repositorio.
- Un buen informe de error describe cómo reproducir el problema sin incluir secretos.