# Entorno de trabajo para el curso DevOps

El entorno de trabajo es el conjunto de equipos, sistemas operativos, herramientas, cuentas, redes y procedimientos que permiten desarrollar, probar y automatizar software.

En este curso utilizaremos un entorno de referencia basado en **Ubuntu 24.04 LTS**, Git, Jenkins, Docker, Terraform y Ansible. Algunas actividades pueden ejecutarse en Windows o macOS, pero los comandos y ejemplos de esta unidad están orientados principalmente a Linux.

Preparar un entorno reproducible reduce problemas como «en mi máquina sí funciona», facilita las prácticas y ayuda a entender cómo se ejecutarán los mismos pasos en un agente de Jenkins.

## Objetivos de aprendizaje

Al terminar esta unidad, podrás:

- Describir qué componentes forman un entorno de trabajo DevOps.
- Distinguir entre equipo local, servidor, contenedor, máquina virtual y agente.
- Consultar información básica del sistema operativo y del hardware.
- Utilizar una terminal para ejecutar comandos y organizar archivos.
- Instalar y verificar herramientas comunes del curso.
- Usar Git para comprobar y compartir el estado de un proyecto.
- Comprender por qué conviene aislar dependencias y configuraciones.
- Identificar datos que no deben guardarse en un repositorio.
- Crear un directorio de trabajo reproducible para las prácticas.
- Diagnosticar problemas frecuentes de instalación y conectividad.
- Aplicar pautas básicas de seguridad en el equipo de trabajo.

## Qué entendemos por entorno de trabajo

Un entorno de trabajo no es solo el ordenador que utilizamos. Incluye todos los recursos que intervienen en una tarea.

### Componentes habituales

Un entorno puede incluir:

- **Hardware:** ordenador, memoria, procesador y almacenamiento.
- **Sistema operativo:** Linux, Windows o macOS.
- **Shell:** programa que interpreta los comandos escritos en la terminal.
- **Herramientas de desarrollo:** editor, Git, compiladores y lenguajes.
- **Servicios:** Jenkins, servidores Git, registros de contenedores y bases de datos.
- **Red:** conexión local, VPN, DNS, proxy y reglas de cortafuegos.
- **Credenciales:** claves, tokens y cuentas necesarias para acceder a recursos.
- **Configuración:** variables de entorno, archivos y permisos.
- **Documentación:** instrucciones para instalar, ejecutar y mantener el proyecto.
- **Procedimientos:** pasos acordados para validar, desplegar y recuperar el servicio.

Si uno de estos componentes falta o está configurado de forma distinta, un comando puede comportarse de otra manera.

### Entorno local

El entorno local es el equipo donde una persona escribe código y ejecuta pruebas.

Se utiliza para:

- Editar archivos.
- Ejecutar comandos.
- Probar cambios pequeños.
- Revisar el historial de Git.
- Preparar contribuciones antes de compartirlas.

El entorno local no siempre es igual al de producción. Por eso conviene evitar que la aplicación dependa de ajustes personales que nadie más conoce.

### Entorno de integración

El entorno de integración permite combinar cambios y comprobar que el proyecto sigue funcionando.

Puede incluir:

- Una plataforma de automatización.
- Agentes de ejecución.
- Acceso al repositorio.
- Dependencias controladas.
- Pruebas automáticas.
- Almacenamiento de artefactos.

En este curso, Jenkins podrá cumplir parte de esta función.

### Entorno de pruebas

El entorno de pruebas permite validar una aplicación sin afectar a las personas usuarias de producción.

Puede ser:

- Una máquina virtual.
- Un conjunto de contenedores.
- Un espacio temporal creado por una plataforma.
- Un servidor dedicado.
- Un entorno compartido por el grupo.

Conviene documentar si el entorno es compartido, qué datos contiene y cómo se restaura después de una práctica.

### Entorno de producción

Producción es el entorno donde se ejecuta el servicio utilizado por sus personas usuarias.

Debe tratarse con especial cuidado:

- No ejecutar prácticas destructivas sin autorización.
- No usar credenciales de producción en ejercicios.
- No modificar infraestructura real sin revisión.
- No copiar datos sensibles a entornos de prueba.
- Confirmar el destino antes de ejecutar comandos que cambien recursos.

En los ejercicios de esta unidad no se necesita acceder a producción.

## Equipo local, servidor, máquina virtual y contenedor

Estos términos describen formas distintas de ejecutar herramientas y aplicaciones.

### Equipo local

Es el ordenador que utiliza el alumno o alumna. Puede ser físico o virtual.

Ventajas:

- Está disponible para practicar sin depender continuamente de un servidor.
- Permite utilizar un editor y una terminal conocidos.
- Facilita experimentar con proyectos pequeños.

Limitaciones:

- Puede tener herramientas distintas a las de los compañeros.
- Puede carecer de memoria o almacenamiento suficientes.
- Puede tener restricciones de permisos o de red.

### Servidor

Un servidor es un sistema que ofrece recursos o servicios a otros sistemas.

Puede ser:

- Un servidor físico.
- Una máquina virtual alojada en un centro de datos.
- Una instancia en una plataforma en la nube.
- Un servicio gestionado por un proveedor.

Antes de utilizar un servidor, confirma quién lo administra y qué cambios puedes hacer.

### Máquina virtual

Una máquina virtual emula un ordenador mediante software de virtualización.

Puede ejecutar un sistema operativo invitado, como Ubuntu, dentro de otro sistema operativo anfitrión.

Una máquina virtual resulta útil para:

- Probar una distribución de Linux.
- Aislar herramientas.
- Reproducir un entorno de laboratorio.
- Practicar sin modificar directamente el sistema principal.

Necesita suficiente memoria, almacenamiento y capacidad de procesador.

### Contenedor

Un contenedor empaqueta una aplicación y sus dependencias para ejecutarlas de forma aislada.

Un contenedor comparte el núcleo del sistema anfitrión, por lo que no es lo mismo que una máquina virtual.

Los contenedores pueden ayudar a:

- Ejecutar servicios de prueba.
- Crear agentes temporales.
- Reducir diferencias entre entornos.
- Reproducir herramientas con versiones definidas.

Un contenedor **no sustituye** a la seguridad del sistema anfitrión ni debe considerarse automáticamente confiable.

### Diferencias principales

| Recurso | Qué proporciona | Ejemplo de uso |
|---|---|---|
| Equipo local | Herramientas interactivas para trabajar | Editar y probar código |
| Servidor | Recursos y servicios accesibles por red | Alojar Jenkins |
| Máquina virtual | Sistema operativo aislado | Laboratorio Ubuntu |
| Contenedor | Aplicación aislada y sus dependencias | Ejecutar un servicio de prueba |
| Agente | Capacidad de ejecutar tareas de automatización | Ejecutar etapas de Jenkins |

Los conceptos pueden combinarse. Por ejemplo, un agente de Jenkins puede ejecutarse dentro de una máquina virtual o de un contenedor.

## Requisitos recomendados para las prácticas

Los requisitos dependen de las actividades y del sistema anfitrión. Antes de comenzar, comprueba las indicaciones del docente o del laboratorio.

### Sistema operativo

Entorno de referencia del curso:

- Ubuntu 24.04 LTS.
- Shell Bash.
- Conexión a Internet para instalar paquetes y clonar repositorios.
- Permisos de usuario suficientes para trabajar en el directorio personal.
- Acceso a GitHub u otro servidor Git cuando la práctica lo requiera.

Ubuntu puede ejecutarse directamente, en una máquina virtual, en un entorno remoto o mediante WSL en Windows.

### Recursos del equipo

Como orientación para prácticas locales:

- **Memoria:** 8 GB es una base cómoda si se ejecutan varias herramientas.
- **Procesador:** varios núcleos ayudan al utilizar máquinas virtuales y contenedores.
- **Almacenamiento:** reserva espacio para imágenes, paquetes, repositorios y registros.
- **Red:** se necesita conectividad para descargar paquetes y acceder al repositorio.

Jenkins, Docker y las máquinas virtuales pueden consumir recursos considerables. Cierra servicios que no utilices durante las prácticas.

### Herramientas principales

A lo largo del curso se utilizarán varias herramientas:

- **Terminal:** para ejecutar comandos y scripts.
- **Git:** para administrar cambios en los repositorios.
- **Jenkins:** para automatizar pipelines.
- **Docker:** para ejecutar aplicaciones y agentes en contenedores.
- **Terraform:** para describir y gestionar infraestructura como código.
- **Ansible:** para automatizar tareas de configuración y orquestación.
- **Editor de texto:** para modificar Markdown, YAML, scripts y `Jenkinsfile`.

No es necesario instalar todas las herramientas en el primer ejercicio. Instala solo lo que necesites y sigue las instrucciones del módulo correspondiente.

## Preparación del espacio de trabajo

Un directorio ordenado evita confundir los archivos del curso con documentos personales o con otros proyectos.

### Crear un directorio para las prácticas

Abre una terminal y ejecuta:

```bash
mkdir -p "$HOME/practicas-devops"
cd "$HOME/practicas-devops"
```

Comprueba el directorio actual:

```bash
pwd
```

La salida debería mostrar una ruta dentro de tu directorio personal.

### Crear subdirectorios

Puedes crear una estructura básica:

```bash
mkdir -p "$HOME/practicas-devops"/{git,jenkins,docker,terraform,ansible}
```

Comprueba la estructura:

```bash
find "$HOME/practicas-devops" -maxdepth 1 -type d -print
```

Una estructura posible sería:

```text
practicas-devops/
├── ansible/
├── docker/
├── git/
├── jenkins/
└── terraform/
```

No es obligatorio utilizar exactamente estos nombres. Lo importante es mantener un lugar previsible para los archivos.

### Reglas sencillas para nombrar archivos

Para reducir errores:

- Utiliza nombres descriptivos.
- Evita nombres como `prueba-final-final2`.
- Evita espacios en nombres de archivos usados en scripts.
- Mantén una convención consistente.
- Incluye la extensión adecuada.
- No incluyas contraseñas ni tokens en nombres o contenido.
- Separa los archivos de cada ejercicio.

Por ejemplo:

```text
validar-mensaje.sh
inventario-laboratorio.ini
docker-compose.yaml
```

## La terminal

La terminal permite interactuar con el sistema mediante comandos. Es una herramienta frecuente en desarrollo, automatización y operación.

### Abrir una terminal

En Ubuntu Desktop, abre la aplicación de terminal desde el menú de aplicaciones o utiliza el atajo configurado en el escritorio.

En un servidor remoto, normalmente se utiliza SSH desde otra terminal.

### Saber quién eres y dónde estás

Ejecuta:

```bash
whoami
pwd
```

- `whoami` muestra el usuario actual.
- `pwd` muestra el directorio de trabajo actual.

Saber el directorio actual es importante porque muchas rutas de los comandos son relativas a ese directorio.

### Listar archivos

Ejecuta:

```bash
ls
ls -la
```

- `ls` muestra archivos y directorios.
- `ls -la` también muestra archivos ocultos y detalles adicionales.

Los nombres que empiezan con punto, como `.gitignore`, no aparecen con un listado sencillo.

### Navegar entre directorios

Ejecuta:

```bash
cd "$HOME"
cd "$HOME/practicas-devops"
cd ..
```

- `cd` cambia el directorio actual.
- `cd ..` sube un nivel.
- `cd "$HOME"` vuelve al directorio personal.

### Crear, copiar y mover archivos

Algunos comandos frecuentes:

```bash
mkdir notas
cp archivo.txt copia.txt
mv copia.txt notas/
```

`rm` elimina archivos. Utilízalo con cuidado.

Antes de ejecutar un comando que borre contenido:

1. Comprueba el directorio actual.
2. Revisa la ruta del archivo.
3. Confirma que se trata de datos de práctica.
4. Evita usar opciones recursivas si no entiendes su efecto.

### Obtener ayuda

Puedes consultar la ayuda de muchos comandos:

```bash
comando --help
```

También puedes consultar las páginas del manual:

```bash
man ls
```

Para salir de `man`, normalmente se utiliza la tecla `q`.

### Historial de comandos

La terminal suele conservar un historial de comandos:

```bash
history
```

El historial puede ser práctico, pero no escribas secretos en comandos que puedan quedar guardados.

Evita comandos que incluyan contraseñas en texto visible.

## Información del sistema

Conocer el sistema ayuda a diagnosticar diferencias entre entornos.

### Consultar la distribución

En Ubuntu, ejecuta:

```bash
cat /etc/os-release
```

También puedes ejecutar:

```bash
lsb_release -a
```

Si el segundo comando no está instalado, utiliza `/etc/os-release`, que suele estar disponible.

### Consultar el núcleo

Ejecuta:

```bash
uname -a
```

Para mostrar solo la versión del núcleo:

```bash
uname -r
```

### Consultar procesador y memoria

Ejecuta:

```bash
nproc
free -h
```

- `nproc` muestra la cantidad de procesadores disponibles para el proceso.
- `free -h` muestra información de memoria en unidades legibles.

### Consultar almacenamiento disponible

Ejecuta:

```bash
df -h
```

Para comprobar el tamaño de un directorio concreto:

```bash
du -sh "$HOME/practicas-devops"
```

### Consultar la fecha y zona horaria

Ejecuta:

```bash
date
timedatectl
```

Las diferencias de hora pueden afectar a registros, certificados y tareas programadas.

## Paquetes y actualizaciones en Ubuntu

Ubuntu utiliza el sistema de paquetes APT para instalar y actualizar gran parte del software del sistema.

### Actualizar la lista de paquetes

En Ubuntu:

```bash
sudo apt update
```

Este comando actualiza la información disponible sobre los paquetes. No actualiza por sí solo todos los programas instalados.

### Instalar actualizaciones

Para instalar actualizaciones disponibles:

```bash
sudo apt upgrade
```

En un equipo compartido, sigue las indicaciones del administrador o del docente antes de modificar paquetes del sistema.

### Instalar herramientas básicas

En una instalación de Ubuntu, varias herramientas comunes se pueden instalar con:

```bash
sudo apt install -y \
  ca-certificates \
  curl \
  git \
  nano \
  unzip \
  tree
```

Este comando utiliza `sudo` porque modifica paquetes del sistema.

Lee los comandos antes de ejecutarlos y no uses `sudo` sin comprender qué hará la operación.

### Consultar información de un paquete

Para ver si un paquete está instalado:

```bash
dpkg -s git
```

Para consultar qué versión está disponible en los repositorios configurados:

```bash
apt policy git
```

La versión disponible puede variar según la configuración del sistema y las actualizaciones instaladas.

### Evitar actualizaciones improvisadas durante una práctica

Durante un ejercicio, no actualices componentes críticos sin necesidad.

Antes de actualizar:

- Comprueba qué paquete se va a modificar.
- Lee el resumen que muestra APT.
- Revisa si alguna práctica depende de una versión concreta.
- Guarda el trabajo que no hayas confirmado.
- Sigue las instrucciones del laboratorio.

## Editores de texto

El editor se utiliza para modificar archivos de código, configuración y documentación.

### Editores gráficos

Algunos editores gráficos conocidos pueden ofrecer:

- Resaltado de sintaxis.
- Búsqueda y reemplazo.
- Integración con Git.
- Validación básica de archivos.
- Extensiones para lenguajes y herramientas.

Utiliza el editor permitido por tu entorno o el recomendado en el curso.

### Editores de terminal

Ubuntu puede incluir `nano`, un editor sencillo que funciona en terminal.

Abre un archivo:

```bash
nano notas.md
```

Atajos habituales de `nano` aparecen en la parte inferior de la pantalla. La tecla `Ctrl` se representa a menudo como `^`.

Para guardar y salir, sigue las indicaciones visibles en el editor.

### Revisar la extensión del archivo

Comprueba que el archivo tenga la extensión prevista:

```bash
ls -l
```

Un archivo llamado `Jenkinsfile.txt` no es necesariamente equivalente a `Jenkinsfile`.

Algunos editores pueden añadir extensiones automáticamente.

### Finales de línea

Windows y Linux pueden representar los finales de línea de forma distinta.

Al mover archivos entre sistemas, comprueba:

- La codificación del archivo.
- Los finales de línea.
- Los permisos de ejecución de los scripts.
- La sensibilidad a mayúsculas y minúsculas.

Si un script falla por finales de línea, primero identifica el problema antes de aplicar una conversión.

## Git como herramienta de trabajo

Git registra cambios y ayuda a colaborar sobre archivos.

### Comprobar la instalación

Ejecuta:

```bash
git --version
```

La salida debe mostrar una versión instalada.

Si el comando no se encuentra, Git puede no estar instalado o no estar disponible en el `PATH`.

### Configurar la identidad

Para configurar una identidad global:

```bash
git config --global user.name "Nombre del alumno"
git config --global user.email "alumno@example.com"
```

Utiliza una dirección adecuada para el entorno de aprendizaje.

En un equipo compartido, pregunta antes de configurar valores globales.

También puedes establecer valores solo para un repositorio, omitiendo `--global`.

### Consultar la configuración

Ejecuta:

```bash
git config --list
```

No compartas una captura de esta salida sin revisar su contenido. Puede incluir información personal o direcciones de repositorios privados.

### Clonar un repositorio

Para obtener una copia local:

```bash
git clone URL_DEL_REPOSITORIO
```

Sustituye `URL_DEL_REPOSITORIO` por la URL real del repositorio.

Después, entra en el directorio creado:

```bash
cd nombre-del-repositorio
```

### Revisar el estado de un repositorio

Ejecuta:

```bash
git status
```

Este comando indica si hay archivos modificados, nuevos o preparados para confirmar.

### Revisar cambios

Para mostrar diferencias de archivos modificados:

```bash
git diff
```

Antes de confirmar cambios, revisa qué archivos se incluirán.

### Buenas prácticas con Git

- Confirma cambios pequeños y relacionados.
- Utiliza mensajes descriptivos.
- No añadas secretos.
- Revisa `git status` antes de cada commit.
- Revisa `git diff` antes de añadir cambios.
- Sigue la estrategia de ramas del curso o del equipo.
- No reescribas historial compartido sin autorización.

## Variables de entorno

Una variable de entorno es un valor que un proceso puede consultar mientras se ejecuta.

Puede utilizarse para configurar:

- El modo de ejecución.
- Una ruta.
- El nombre de un entorno.
- El puerto de un servicio.
- La ubicación de una herramienta.

### Consultar una variable

Para mostrar una variable concreta:

```bash
echo "$HOME"
```

Para consultar una variable que puede no estar definida:

```bash
printenv NOMBRE_VARIABLE
```

Sustituye `NOMBRE_VARIABLE` por el nombre que quieras consultar.

### Definir una variable temporal

En Bash, una variable puede definirse para la sesión actual:

```bash
export ENTORNO=practica
```

Comprueba el valor:

```bash
echo "$ENTORNO"
```

La variable desaparecerá al cerrar esa sesión, salvo que se haya configurado de forma persistente.

### No guardar secretos como variables visibles

Las variables de entorno no son un almacén seguro de secretos por sí mismas.

No:

- Imprimas tokens en registros.
- Compartas capturas con credenciales visibles.
- Guardes secretos en archivos versionados.
- Incluyas una contraseña directamente en un comando.

En Jenkins, utiliza el gestor de credenciales y mecanismos de uso seguro indicados en el curso.

### Archivos de configuración local

Los proyectos a veces usan archivos locales para configurar herramientas.

Antes de añadir un archivo al repositorio:

- Comprueba si contiene credenciales.
- Comprueba si debe compartirse.
- Consulta `.gitignore`.
- Añade una plantilla sin secretos cuando sea apropiado.

## Rutas y permisos

Las rutas determinan dónde están los archivos. Los permisos determinan quién puede leerlos, modificarlos o ejecutarlos.

### Rutas absolutas y relativas

Una ruta absoluta comienza desde la raíz del sistema o desde una ubicación completa.

Ejemplo:

```text
/home/alumno/practicas-devops
```

Una ruta relativa se interpreta desde el directorio actual.

Ejemplo:

```text
app/mensaje.txt
```

Antes de ejecutar un comando con rutas relativas, consulta el directorio actual:

```bash
pwd
```

### Ver permisos

Ejecuta:

```bash
ls -l
```

La salida incluye información sobre permisos, propietario y grupo.

### Hacer ejecutable un script

Si un script debe ejecutarse directamente:

```bash
chmod +x script.sh
```

Después:

```bash
./script.sh
```

También puede ejecutarse mediante el intérprete:

```bash
bash script.sh
```

### Evitar permisos excesivos

No conviertas automáticamente todos los archivos en ejecutables.

No utilices permisos amplios como `777` para resolver problemas sin entenderlos.

Los permisos deben conceder solo lo necesario.

## Red y conectividad

Muchas herramientas necesitan acceder a servicios externos o internos.

### Comprobar conectividad general

Puedes consultar si un dominio resuelve a una dirección:

```bash
getent hosts example.com
```

Para comprobar si una URL responde, `curl` puede resultar útil:

```bash
curl -I https://example.com
```

La respuesta depende de la red, del servidor y de posibles proxys.

### DNS

DNS traduce nombres de dominio a direcciones IP.

Si un nombre no se resuelve:

- Comprueba la escritura del dominio.
- Comprueba la conexión a la red.
- Averigua si se requiere una VPN.
- Consulta si el laboratorio utiliza DNS interno.
- Comprueba si otros dominios se resuelven.

### Proxy y VPN

Algunos entornos requieren un proxy o una VPN para acceder a repositorios o servicios internos.

Antes de configurar uno:

- Solicita la dirección y los valores al administrador.
- No inventes configuraciones.
- No guardes contraseñas del proxy en archivos públicos.
- Comprueba qué herramientas deben utilizar esa configuración.
- Desconecta la VPN solo si el procedimiento lo indica.

### Puertos

Un servicio puede escuchar en un puerto de red.

Por ejemplo, Jenkins suele utilizar un puerto configurado por su administrador. No des por hecho que siempre está disponible en una dirección concreta.

Para acceder a un servicio:

- Confirma su URL.
- Confirma si necesitas VPN.
- Confirma si el puerto está abierto.
- No cambies el cortafuegos de un servidor sin autorización.

## SSH y acceso remoto

SSH permite conectarse de forma segura a sistemas remotos cuando se ha configurado el acceso.

### Comprobar el cliente SSH

Ejecuta:

```bash
ssh -V
```

La opción `-V` muestra información de la versión.

### Conectarse a un servidor

La forma general es:

```bash
ssh usuario@servidor
```

Utiliza este comando únicamente con datos proporcionados para el laboratorio.

### Claves SSH

Una clave SSH puede permitir autenticación sin introducir una contraseña en cada conexión.

Las claves privadas:

- No deben compartirse.
- No deben incluirse en Git.
- Deben protegerse con los permisos adecuados.
- No deben copiarse a un equipo compartido sin autorización.

La clave pública puede instalarse en un servidor siguiendo un procedimiento autorizado.

### Verificar una conexión

Si una conexión falla:

- Revisa el nombre del servidor.
- Revisa el usuario.
- Comprueba la red o VPN.
- Comprueba que el servicio SSH esté disponible.
- Revisa si la clave correcta está cargada.
- Comprueba los permisos del archivo de clave.
- Consulta al administrador antes de cambiar la configuración remota.

## Contenedores Docker en el entorno de trabajo

Docker puede utilizarse para ejecutar aplicaciones, servicios y agentes en contenedores.

### Comprobar si Docker está disponible

Ejecuta:

```bash
docker --version
```

Para comprobar el estado del servicio en un sistema con `systemd`:

```bash
systemctl status docker
```

Es posible que necesites permisos administrativos para consultar o administrar el servicio.

### Ejecutar una prueba básica

Si Docker está instalado y tienes autorización para usarlo:

```bash
docker run --rm hello-world
```

El comando descarga una imagen y ejecuta un contenedor de prueba.

Puede fallar si no hay conexión al registro, si Docker no está iniciado o si tu usuario carece de permisos.

### Precaución con el grupo Docker

En Linux, permitir que un usuario controle el servicio Docker puede otorgar permisos muy elevados sobre el sistema.

No añadas tu usuario al grupo `docker` en un equipo compartido sin comprender las implicaciones y sin autorización.

### Imágenes y contenedores

- Una **imagen** es una plantilla de solo lectura usada para crear contenedores.
- Un **contenedor** es una instancia que ejecuta un proceso basado en una imagen.
- Un **registro** almacena y distribuye imágenes.

Las imágenes pueden ocupar bastante espacio.

Comprueba el consumo antes de limpiar recursos.

### Limpiar recursos de Docker

No ejecutes comandos de limpieza en un equipo compartido sin revisar su efecto.

Algunos comandos pueden eliminar contenedores, imágenes o volúmenes utilizados por otras prácticas.

Comprueba siempre:

```bash
docker ps -a
docker images
docker volume ls
```

## Herramientas del curso

Las herramientas se instalarán y utilizarán de forma progresiva.

### Git

Git gestiona el historial del código y los archivos.

Se usa para:

- Clonar repositorios.
- Revisar cambios.
- Crear commits.
- Compartir modificaciones.
- Obtener un `Jenkinsfile` desde el repositorio.

### Jenkins

Jenkins ejecuta tareas automatizadas mediante jobs y pipelines.

Puede:

- Obtener código desde Git.
- Ejecutar scripts.
- Ejecutar pruebas.
- Construir artefactos.
- Publicar resultados.
- Coordinar agentes.
- Solicitar aprobación antes de una acción.

El Jenkins del laboratorio puede estar alojado en una máquina distinta del equipo local.

### Docker

Docker permite empaquetar y ejecutar procesos en contenedores.

Puede utilizarse para:

- Ejecutar servicios de laboratorio.
- Crear agentes efímeros.
- Mantener dependencias separadas.
- Probar una imagen de aplicación.

### Terraform

Terraform describe infraestructura mediante archivos de configuración.

En las prácticas se utilizará para aprender conceptos como:

- Proveedores.
- Recursos.
- Variables.
- Estado.
- Planificación.
- Aplicación de cambios.
- Gestión segura de credenciales.

No apliques configuraciones contra una cuenta o nube real sin instrucciones explícitas.

### Ansible

Ansible automatiza tareas de configuración y orquestación.

Puede administrar equipos mediante:

- Inventarios.
- Playbooks.
- Variables.
- Módulos.
- Conexiones SSH.

Las prácticas deben dirigirse únicamente a máquinas de laboratorio autorizadas.

## Aislamiento de herramientas de Python

Algunas herramientas del curso pueden estar escritas en Python. Instalar paquetes directamente en el Python del sistema puede interferir con paquetes administrados por Ubuntu.

### Consultar la versión de Python

Ejecuta:

```bash
python3 --version
```

Comprueba también que `pip` esté disponible:

```bash
python3 -m pip --version
```

Si no lo está, sigue las instrucciones de instalación del laboratorio.

### Crear un entorno virtual

Desde el directorio del proyecto:

```bash
python3 -m venv .venv
```

Actívalo en Bash:

```bash
source .venv/bin/activate
```

El indicador de la terminal puede cambiar para mostrar que el entorno virtual está activo.

### Instalar dependencias del proyecto

Si el repositorio incluye un archivo `requirements.txt`:

```bash
python -m pip install -r requirements.txt
```

Instala solo las dependencias requeridas para el ejercicio.

### Salir del entorno virtual

Ejecuta:

```bash
deactivate
```

El entorno virtual separa las dependencias del proyecto de las del sistema, pero no sustituye la revisión de los paquetes que se instalan.

## Organización de proyectos

Un proyecto ordenado facilita que otras personas comprendan cómo ejecutarlo.

### Estructura sencilla de ejemplo

```text
mi-proyecto/
├── README.md
├── .gitignore
├── Jenkinsfile
├── app/
├── scripts/
└── tests/
```

La estructura real depende del lenguaje y del tipo de proyecto.

### README

Un `README.md` debería explicar, como mínimo:

- Qué contiene el proyecto.
- Qué requisitos tiene.
- Cómo prepararlo.
- Cómo ejecutarlo.
- Cómo ejecutar las pruebas.
- Qué variables de configuración se necesitan.
- Cómo pedir ayuda o informar de un problema.

No incluyas secretos ni instrucciones que expongan datos sensibles.

### Archivo `.gitignore`

`.gitignore` indica qué archivos no deberían añadirse al repositorio.

Puede excluir:

- Entornos virtuales.
- Archivos temporales.
- Resultados locales de compilación.
- Registros.
- Archivos de configuración con datos personales.
- Credenciales o claves.
- Directorios de herramientas generados localmente.

`.gitignore` no elimina automáticamente archivos que ya se han añadido al historial.

## Configuración y diferencias entre entornos

Una aplicación puede ejecutarse en más de un entorno y necesitar valores distintos.

### Ejemplos de configuración

Algunos valores que suelen variar:

- Puerto de escucha.
- URL de un servicio.
- Nombre de una base de datos.
- Nivel de registro.
- Modo de ejecución.
- Directorio temporal.

### Separar configuración del código

Separar configuración y código ayuda a reutilizar la misma aplicación en varios entornos.

El equipo debe definir:

- Qué valores son obligatorios.
- Cómo se proporcionan.
- Quién puede consultarlos.
- Cómo se validan.
- Cómo se protegen los secretos.

### Evitar valores ocultos

No dependas de configuraciones locales que solo existan en un equipo.

Documenta los requisitos y, cuando sea posible, proporciona valores de ejemplo que no sean secretos.

### Configuración explícita

Un programa debería poder informar con claridad cuando falta una configuración necesaria.

Un error explícito suele ser más útil que un fallo posterior difícil de relacionar con la causa.

## Seguridad básica del entorno

Las prácticas de seguridad reducen el riesgo de afectar al equipo propio, a los compañeros o a servicios reales.

### Actualizaciones

Mantén el sistema razonablemente actualizado siguiendo el procedimiento del laboratorio.

No ejecutes actualizaciones masivas en medio de una práctica si pueden modificar herramientas necesarias sin consultarlo.

### Cuentas de usuario

Utiliza tu cuenta personal o la cuenta de laboratorio asignada.

Evita:

- Compartir contraseñas.
- Trabajar como `root` sin necesidad.
- Usar la cuenta de otra persona.
- Guardar credenciales en notas públicas.

### Secretos

Un secreto puede ser:

- Una contraseña.
- Un token.
- Una clave privada.
- Una clave de API.
- Una credencial de nube.
- Un archivo de acceso.

Guárdalo únicamente en el mecanismo autorizado por el curso.

### Archivos descargados

Antes de ejecutar un archivo descargado:

- Comprueba de dónde procede.
- Revisa el contenido si es un script.
- Confirma que corresponde a la práctica.
- Evita ejecutarlo con privilegios administrativos sin motivo.

### Comandos destructivos

Los comandos que borran, reemplazan o modifican recursos requieren especial cuidado.

Antes de ejecutarlos:

1. Lee el comando completo.
2. Comprueba el directorio actual.
3. Confirma el destino.
4. Comprueba si el recurso es compartido.
5. Solicita ayuda si no conoces el resultado.

## Registro de actividades y documentación

Tomar notas ayuda a repetir los ejercicios y a resolver problemas.

### Qué conviene anotar

Puedes registrar:

- Comandos utilizados.
- Versiones de las herramientas.
- Errores y su solución.
- Rutas relevantes.
- Decisiones del ejercicio.
- Diferencias entre entorno local y Jenkins.
- Preguntas para revisar con el docente.

### Qué no debes anotar en una documentación compartida

No incluyas:

- Contraseñas.
- Tokens.
- Claves privadas.
- Datos personales innecesarios.
- Direcciones de servicios internos no autorizadas.
- Información de producción.
- Capturas con credenciales visibles.

### Documentar los pasos

Una buena instrucción debe indicar:

- Requisitos previos.
- Comandos que hay que ejecutar.
- Resultado esperado.
- Qué hacer si falla.
- Cómo limpiar el entorno de práctica.

## Práctica guiada: inventario del entorno

En esta sesión recopilarás información básica sobre el equipo.

### Preparación

Abre una terminal.

Crea una carpeta para guardar notas:

```bash
mkdir -p "$HOME/practicas-devops/entorno"
cd "$HOME/practicas-devops/entorno"
```

### Consultar el sistema operativo

Ejecuta:

```bash
cat /etc/os-release
```

Anota:

- Nombre de la distribución.
- Versión.
- Arquitectura, si aparece.
- Si el entorno es local, virtual o remoto.

### Consultar el hardware disponible

Ejecuta:

```bash
nproc
free -h
df -h "$HOME"
```

Anota:

- Cantidad de procesadores disponibles.
- Memoria total y disponible.
- Espacio disponible en el directorio personal.

No es necesario copiar números de serie ni información personal.

### Consultar herramientas

Ejecuta estos comandos:

```bash
git --version
python3 --version
bash --version
```

Si Docker está instalado:

```bash
docker --version
```

Si Terraform está instalado:

```bash
terraform version
```

Si Ansible está instalado:

```bash
ansible --version
```

Una herramienta puede no estar instalada todavía. Anota ese hecho sin tratarlo como un error del ejercicio.

### Guardar un resumen

Crea un archivo de notas:

```bash
cat > inventario.md <<'EOF'
# Inventario del entorno

## Sistema operativo

Completar durante la práctica.

## Hardware

Completar durante la práctica.

## Herramientas

Completar durante la práctica.

## Observaciones

Anotar diferencias o dudas.
EOF
```

Edita `inventario.md` con tu editor y completa la información.

### Preguntas de reflexión

- ¿El entorno es local, virtual o remoto?
- ¿Qué herramientas están disponibles?
- ¿Hay recursos suficientes para ejecutar contenedores?
- ¿Qué información necesitaría otra persona para reproducir el entorno?
- ¿Qué dato no convendría incluir en el informe compartido?

## Práctica guiada: crear un espacio de trabajo

Esta práctica crea una estructura inicial y algunos archivos de prueba.

### Crear directorios

Ejecuta:

```bash
mkdir -p "$HOME/practicas-devops/laboratorio"/{app,scripts,tests,docs}
cd "$HOME/practicas-devops/laboratorio"
```

Comprueba la estructura:

```bash
find . -maxdepth 2 -type d -print
```

### Crear un archivo de aplicación

Ejecuta:

```bash
printf 'Entorno de trabajo DevOps\n' > app/mensaje.txt
```

### Crear un script de comprobación

Ejecuta:

```bash
cat > scripts/comprobar-mensaje.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no se encuentra $ARCHIVO"
  exit 1
fi

if grep -q "DevOps" "$ARCHIVO"; then
  echo "OK: se encontró la palabra DevOps"
else
  echo "ERROR: no se encontró la palabra DevOps"
  exit 1
fi
EOF
```

Dale permiso de ejecución:

```bash
chmod +x scripts/comprobar-mensaje.sh
```

### Ejecutar la comprobación

Desde la raíz del proyecto, ejecuta:

```bash
./scripts/comprobar-mensaje.sh
```

El resultado esperado es:

```text
OK: se encontró la palabra DevOps
```

### Probar un fallo

Cambia el contenido:

```bash
printf 'Entorno de automatización\n' > app/mensaje.txt
```

Vuelve a ejecutar:

```bash
./scripts/comprobar-mensaje.sh
```

Anota el mensaje y el código de salida:

```bash
echo $?
```

Restaura el contenido:

```bash
printf 'Entorno de trabajo DevOps\n' > app/mensaje.txt
```

### Preguntas de reflexión

- ¿Desde qué directorio debe ejecutarse el script?
- ¿Por qué la ruta del archivo es relativa?
- ¿Qué ocurriría si ejecutaras el script desde otro directorio?
- ¿Cómo podrías hacer que el script funcionara desde cualquier ubicación?
- ¿Qué información debería quedar en un mensaje de error?

## Práctica guiada: inicializar un repositorio Git

Esta práctica convierte el espacio de trabajo en un repositorio local.

### Inicializar Git

Desde la raíz del laboratorio:

```bash
cd "$HOME/practicas-devops/laboratorio"
git init
```

Comprueba el estado:

```bash
git status
```

### Configurar la identidad si hace falta

Si Git no conoce una identidad, configura una para este repositorio:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Utiliza los datos indicados por el curso.

### Crear un archivo `.gitignore`

Ejecuta:

```bash
cat > .gitignore <<'EOF'
.venv/
__pycache__/
*.log
.env
EOF
```

Este archivo es solo un ejemplo. Un proyecto real puede necesitar reglas distintas.

### Revisar y confirmar los archivos

Ejecuta:

```bash
git status
git diff -- .gitignore
git add .gitignore app scripts docs tests
git status
git commit -m "Prepara el entorno de prácticas"
```

### Comprobar el historial

Ejecuta:

```bash
git log --oneline
git status
```

El repositorio debería mostrar el commit creado y no tener cambios pendientes.

### Preguntas de reflexión

- ¿Qué archivos se incluyeron en el commit?
- ¿Por qué conviene revisar `git status` antes de confirmar?
- ¿Qué tipos de archivos evita incluir el `.gitignore` de ejemplo?
- ¿Por qué ignorar `.env` puede ser importante?
- ¿Por qué `.gitignore` no es una caja fuerte para secretos?

## Práctica guiada: documentar comandos del entorno

En esta práctica crearás un documento que otra persona pueda seguir.

### Crear el documento

Crea `docs/preparar-entorno.md`:

```bash
cat > docs/preparar-entorno.md <<'EOF'
# Preparar el entorno de prácticas

## Requisitos

- Ubuntu o un entorno Linux compatible.
- Bash.
- Git.
- Acceso al repositorio de prácticas.

## Preparación

1. Clonar el repositorio.
2. Entrar en el directorio del proyecto.
3. Leer este documento.
4. Ejecutar las verificaciones indicadas.

## Verificación

Ejecutar el script de comprobación desde la raíz del proyecto:

```bash
./scripts/comprobar-mensaje.sh
```

El resultado esperado es un mensaje que comienza por `OK`.

## Ayuda

Si la comprobación falla, revisar el directorio actual, el contenido de `app/mensaje.txt`
y los permisos del script.
EOF
```

### Revisar el archivo

Comprueba el contenido:

```bash
cat docs/preparar-entorno.md
```

Comprueba que Git detecta el cambio:

```bash
git status
git diff -- docs/preparar-entorno.md
```

### Mejorar el documento

Añade una sección que explique:

- Cómo consultar la versión de Git.
- Qué hacer si el script no es ejecutable.
- Cómo volver al directorio raíz del proyecto.
- A quién pedir ayuda en el entorno de laboratorio.

### Preguntas de reflexión

- ¿Las instrucciones indican desde qué directorio se ejecuta el comando?
- ¿El resultado esperado es claro?
- ¿El documento contiene secretos o datos personales?
- ¿Podría un compañero completar la práctica sin pedirte explicaciones?

## Práctica guiada: identificar diferencias entre local y agente

Compara tu terminal local con un agente de Jenkins, si el curso proporciona acceso a uno.

### Información que puedes comparar

- Sistema operativo.
- Versión de Bash.
- Versión de Git.
- Directorio de trabajo.
- Permisos de ejecución.
- Variables de entorno necesarias.
- Herramientas disponibles.
- Acceso a Internet.
- Acceso al repositorio.

No compartas valores de variables que puedan contener secretos.

### Tabla para completar

| Elemento | Equipo local | Agente Jenkins | Diferencia observada |
|---|---|---|---|
| Sistema operativo |  |  |  |
| Versión de Git |  |  |  |
| Shell disponible |  |  |  |
| Ruta del proyecto |  |  |  |
| Permisos del script |  |  |  |
| Acceso al repositorio |  |  |  |
| Herramientas instaladas |  |  |  |

### Preguntas de reflexión

- ¿Qué diferencia explica un fallo que solo ocurre en Jenkins?
- ¿Qué pasos deberían documentarse para que ambos entornos sean compatibles?
- ¿Qué herramienta sería conveniente instalar en el agente?
- ¿Qué credenciales debería recibir el agente y cuáles no necesita?
- ¿Por qué no se deben copiar secretos personales al agente?

## Práctica opcional: comprobar conectividad

Esta actividad sirve para identificar problemas de red sin cambiar la configuración del equipo.

### Consultar resolución DNS

Ejecuta:

```bash
getent hosts github.com
```

Si el comando muestra direcciones, el nombre se ha resuelto en ese momento.

Si no devuelve resultados, puede existir un problema de red o DNS.

### Comprobar una URL

Ejecuta:

```bash
curl -I https://github.com
```

La respuesta puede incluir un código HTTP.

Un error no siempre significa que el servicio esté caído. También puede deberse a:

- Una VPN necesaria.
- Un proxy.
- Un cortafuegos.
- Una restricción del laboratorio.
- Un problema temporal de DNS.
- Un certificado o una política de red.

### Registrar el resultado

Anota:

- El comando ejecutado.
- La hora aproximada.
- El mensaje de error, si lo hubo.
- Si estabas conectado a una VPN.
- Si otras personas del laboratorio observaron el mismo problema.

No publiques direcciones privadas ni datos de red internos en documentación pública.

## Buenas prácticas del entorno de trabajo

### Mantener un entorno comprensible

Documenta:

- Las herramientas necesarias.
- Las versiones relevantes.
- Los pasos de preparación.
- Los comandos de verificación.
- Los posibles errores conocidos.

### Evitar dependencias personales

No dependas de:

- Archivos guardados solo en el escritorio.
- Alias de shell que nadie conoce.
- Variables configuradas manualmente y no documentadas.
- Versiones instaladas de forma distinta en cada equipo.
- Credenciales personales dentro del proyecto.

### Mantener herramientas actualizadas con criterio

Una versión más nueva no siempre es automáticamente compatible con un proyecto.

Si el proyecto requiere una versión concreta:

- Consulta su documentación.
- Utiliza el mecanismo autorizado para instalarla.
- Registra la versión.
- No cambies la versión del entorno compartido sin aprobación.

### Limpiar solo recursos propios

Antes de borrar:

- Identifica quién creó el recurso.
- Comprueba si otras personas lo utilizan.
- Verifica el directorio o el identificador.
- Sigue el procedimiento de limpieza de la práctica.

### Compartir información útil

Cuando comuniques un problema, incluye:

- Qué intentabas hacer.
- Qué comando ejecutaste.
- Qué esperabas que ocurriera.
- Qué ocurrió en realidad.
- El mensaje de error completo, sin secretos.
- Qué pasos ya probaste.

Evita comunicar únicamente «no funciona». Ese mensaje es cierto, pero deja al equipo sin pistas.

## Solución de problemas frecuentes

### `command not found`

Posibles causas:

- La herramienta no está instalada.
- El nombre del comando está mal escrito.
- El ejecutable no está en el `PATH`.
- El terminal no ha cargado la configuración actualizada.

Pasos de diagnóstico:

1. Comprueba la escritura del comando.
2. Consulta si el paquete está instalado.
3. Comprueba `command -v nombre`.
4. Revisa las instrucciones del entorno.
5. Solicita ayuda antes de modificar rutas del sistema.

### `Permission denied`

Posibles causas:

- El archivo no tiene permiso de ejecución.
- No tienes permisos para acceder al directorio.
- El archivo pertenece a otro usuario.
- El sistema de archivos tiene restricciones.

Comprueba:

```bash
ls -l nombre-del-archivo
```

Si es un script de práctica, puede bastar con:

```bash
chmod +x nombre-del-archivo
```

No cambies permisos de archivos del sistema sin autorización.

### `No such file or directory`

Posibles causas:

- La ruta está mal escrita.
- El directorio actual no es el esperado.
- El archivo no se ha creado.
- La ruta distingue entre mayúsculas y minúsculas.
- El nombre contiene una extensión distinta.

Comprueba:

```bash
pwd
ls -la
```

### Git indica que falta una identidad

Configura el nombre y el correo de acuerdo con el entorno:

```bash
git config user.name "Nombre del alumno"
git config user.email "alumno@example.com"
```

Comprueba la configuración local:

```bash
git config --local --list
```

### Git indica que hay cambios sin confirmar

Comprueba:

```bash
git status
git diff
```

Decide si los cambios deben:

- Añadirse al próximo commit.
- Guardarse temporalmente.
- Descartarse, si confirmas que no los necesitas.

No descartes cambios sin revisarlos.

### Docker no puede conectarse al daemon

Posibles causas:

- El servicio no está iniciado.
- El usuario no tiene permisos.
- Docker no está instalado correctamente.
- El entorno no permite ejecutar Docker.
- El laboratorio utiliza otro servicio de contenedores.

Comprueba el mensaje completo y las instrucciones del entorno.

No cambies permisos globales ni reinicies servicios compartidos sin autorización.

### No se puede acceder a un repositorio

Comprueba:

- La URL.
- El acceso a Internet o VPN.
- Los permisos de la cuenta.
- Si el repositorio es privado.
- Si el método de autenticación está autorizado.
- Si el servicio está temporalmente indisponible.

No envíes credenciales por chat o correo sin un mecanismo aprobado.

### Una herramienta funciona localmente y falla en Jenkins

Compara:

- Versiones.
- Sistema operativo.
- Rutas.
- Variables necesarias.
- Permisos.
- Dependencias.
- Directorio de ejecución.
- Acceso a servicios externos.

Intenta reproducir el comando de Jenkins desde una sesión limpia.

## Checklist antes de una práctica

Antes de empezar, comprueba:

- [ ] Estoy en el entorno correcto.
- [ ] Sé dónde está el directorio de la práctica.
- [ ] He consultado los requisitos del ejercicio.
- [ ] Tengo las herramientas necesarias o sé cuáles faltan.
- [ ] Puedo acceder al repositorio requerido.
- [ ] No estoy usando credenciales de producción.
- [ ] He leído los comandos que voy a ejecutar.
- [ ] Sé qué archivos puedo modificar.
- [ ] Sé cómo comunicar un problema sin exponer secretos.
- [ ] Tengo suficiente espacio y recursos disponibles.

## Checklist al terminar una práctica

Antes de cerrar la sesión:

- [ ] He guardado los archivos que necesito.
- [ ] He revisado `git status`.
- [ ] He confirmado solo los cambios previstos.
- [ ] No he incluido credenciales en el repositorio.
- [ ] He anotado errores que puedan servir para aprender.
- [ ] He limpiado recursos temporales solo si el ejercicio lo indica.
- [ ] He dejado el entorno compartido en el estado acordado.
- [ ] He cerrado sesiones remotas que ya no necesito.

## Preguntas de repaso

1. ¿Qué elementos forman parte de un entorno de trabajo?
2. ¿Qué diferencia hay entre una máquina virtual y un contenedor?
3. ¿Por qué el directorio actual importa al ejecutar comandos?
4. ¿Qué información ofrece `git status`?
5. ¿Por qué conviene usar un `.gitignore`?
6. ¿Qué tipos de datos nunca deberían guardarse en un repositorio público?
7. ¿Qué información permite comparar el equipo local con un agente de Jenkins?
8. ¿Por qué no conviene utilizar `sudo` para todas las operaciones?
9. ¿Qué pasos seguirías si un comando no se encuentra?
10. ¿Cómo comunicarías que no puedes acceder al repositorio?
11. ¿Por qué un entorno reproducible facilita la automatización?
12. ¿Qué riesgo puede introducir conceder permisos excesivos a un agente?

## Glosario

- **Agente:** equipo o proceso que ejecuta tareas de automatización, como etapas de un pipeline.
- **APT:** sistema de gestión de paquetes utilizado por Ubuntu y otras distribuciones Debian.
- **Bash:** shell que interpreta comandos y scripts en numerosos sistemas Linux.
- **Contenedor:** entorno aislado para ejecutar un proceso con sus dependencias.
- **Directorio de trabajo:** ubicación desde la que se ejecuta un comando o proceso.
- **Entorno:** conjunto de herramientas, sistemas, configuración y recursos que intervienen en una actividad.
- **Entorno virtual:** aislamiento de dependencias de Python para un proyecto.
- **Git:** sistema de control de versiones distribuido.
- **Máquina virtual:** sistema informático emulado que ejecuta un sistema operativo invitado.
- **PATH:** variable que indica los directorios donde el sistema busca ejecutables.
- **Repositorio:** almacenamiento de archivos y del historial de cambios.
- **Secreto:** dato que permite acceder a un sistema o servicio, como una contraseña o un token.
- **Shell:** programa que interpreta comandos.
- **SSH:** protocolo y herramienta para establecer conexiones remotas seguras.
- **Variable de entorno:** valor disponible para los procesos iniciados en un entorno determinado.

## Resumen

- El entorno de trabajo incluye equipo, sistema operativo, herramientas, red, configuración y procedimientos.
- Un equipo local, un servidor, una máquina virtual, un contenedor y un agente cumplen funciones distintas.
- La terminal permite inspeccionar el sistema, gestionar archivos y ejecutar herramientas.
- Git facilita registrar, revisar y compartir cambios.
- La configuración debería estar documentada y ser reproducible.
- Los secretos no deben guardarse en el repositorio ni imprimirse en registros.
- Las diferencias entre el equipo local y Jenkins pueden explicar fallos de automatización.
- Antes de ejecutar comandos destructivos o con privilegios elevados, hay que entender su efecto.
- Un entorno preparado y documentado facilita practicar con seguridad y reproducir resultados.