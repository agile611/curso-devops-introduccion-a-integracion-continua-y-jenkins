# Configuración de agentes Docker efímeros en Jenkins

En esta práctica configuraremos Jenkins para delegar la ejecución de tareas a contenedores Docker efímeros. Jenkins solicitará un agente cuando lo necesite, ejecutará el trabajo en un contenedor nuevo y retirará ese contenedor al terminar, según la configuración del plugin Docker y del job.

El objetivo es que cada ejecución empiece en un entorno limpio, sin depender de residuos del workspace de una ejecución anterior. Para conseguirlo hacen falta varias piezas coordinadas: un servidor Docker accesible de forma segura, el plugin adecuado en Jenkins, una plantilla de agente compatible y un `Jenkinsfile` que solicite la etiqueta configurada.

> **Advertencia de seguridad importante:** la API de Docker ofrece control muy privilegiado sobre el host. Exponerla por TCP sin TLS ni autenticación —en especial escuchando en `0.0.0.0`— puede permitir a quien alcance el puerto controlar contenedores y, potencialmente, el servidor. **No uses Docker TCP sin protección, ni siquiera como configuración predeterminada para una red interna.** Esta documentación conserva el flujo de la práctica y el puerto de ejemplo `4243`, pero recomienda una conexión protegida por TLS mutuo o un método SSH compatible con el plugin. No uses la contraseña `jenkins` indicada en algunos tutoriales: es débil y no se necesita para conectar agentes mediante “Attach Docker container”.

---

## Objetivos y alcance

La práctica construye una conexión entre Jenkins y un servidor Docker que crea agentes temporales.

### Qué se construirá

Al terminar, el entorno de laboratorio debería permitir que:

1. Jenkins identifique un cloud Docker configurado.
2. Una plantilla declare qué imagen debe usarse.
3. Un pipeline solicite un agente mediante una etiqueta.
4. Jenkins cree un contenedor para esa ejecución.
5. El contenedor acepte el proceso de agente requerido por Jenkins.
6. Los pasos del pipeline se ejecuten dentro del contenedor.
7. Jenkins retire el contenedor al terminar, según la configuración del plugin.

### Qué significa efímero

Un agente efímero es un entorno de ejecución creado para un trabajo y retirado después, en vez de reutilizar permanentemente el mismo contenedor.

El ciclo esperado es:

```text
Jenkins necesita un ejecutor
          |
          v
Solicita un agente con una etiqueta
          |
          v
El plugin contacta con Docker
          |
          v
Docker crea un contenedor nuevo
          |
          v
El agente se conecta a Jenkins
          |
          v
Se ejecutan las etapas del pipeline
          |
          v
El agente termina y el contenedor se retira
```

La eliminación del contenedor no necesariamente borra:

- Artefactos archivados en Jenkins.
- Volúmenes persistentes configurados aparte.
- Imágenes descargadas en el host Docker.
- Logs conservados por Jenkins.
- Datos escritos fuera del contenedor.

Por eso, “efímero” no significa que desaparezca toda evidencia de la ejecución.

### Ventajas esperadas

- **Entorno de ejecución nuevo:** cada ejecución puede empezar con un contenedor recién creado.
- **Menos contaminación entre builds:** se reducen los residuos locales del agente anterior.
- **Dependencias declaradas:** la imagen puede documentar versiones de herramientas.
- **Aislamiento operativo:** cada contenedor tiene su propio entorno de proceso.
- **Uso flexible de capacidad:** Docker puede crear agentes cuando Jenkins los necesita y el host dispone de recursos.

Estas ventajas dependen de la configuración real, de la imagen, de los volúmenes y de las herramientas. No garantizan por sí solas reproducibilidad absoluta ni seguridad completa.

### Resultados de aprendizaje

El alumnado podrá:

- Explicar la relación entre Jenkins, el plugin Docker, el host Docker y el agente.
- Distinguir el controlador Jenkins del agente de ejecución.
- Identificar la etiqueta que solicita un pipeline.
- Explicar por qué la API de Docker requiere protección.
- Probar la conectividad sin abrir el daemon a toda la red.
- Verificar las herramientas disponibles dentro de una imagen.
- Interpretar el ciclo de vida del contenedor en los logs.
- Diagnosticar fallos de red, imagen, usuario, rutas y conexión del agente.
- Documentar los resultados con datos no sensibles.

### Lo que no forma parte de la práctica

Esta práctica no pretende:

- Publicar el socket Docker a una red abierta.
- Usar una contraseña débil para el usuario del sistema.
- Dar acceso a Docker a cualquier equipo del laboratorio.
- Ejecutar el daemon dentro del contenedor del agente.
- Montar el socket Docker del host dentro del agente.
- Compartir credenciales de producción.
- Instalar plugins o paquetes en Jenkins sin autorización.
- Modificar el firewall o `systemd` de un servidor compartido sin permiso.

### Alcance de los ejemplos

El puerto `4243` se conserva como puerto didáctico de ejemplo.

No es un puerto mágico ni una capa de seguridad.

La API puede configurarse en otros puertos, pero el puerto elegido debe estar protegido por autenticación, cifrado y reglas de red.

Los ejemplos presuponen administración autorizada de la máquina virtual y de Jenkins.

### Variaciones entre instalaciones

La interfaz del plugin Docker puede variar según:

- Versión de Jenkins.
- Versión del plugin.
- Sistema operativo del controlador.
- Método de conexión.
- Configuración de TLS.
- Tipo de imagen.
- Configuración de autorización.
- Proveedor de identidades y credenciales.

Usa la documentación local de la instancia para confirmar nombres de campos y opciones.

---

## Arquitectura

La configuración contiene varios componentes que deben coincidir.

### Componentes

- **Controlador de Jenkins:** coordina jobs, colas, stages y agentes.
- **Plugin Docker:** integra Jenkins con un daemon Docker.
- **Servidor Docker:** crea y elimina contenedores.
- **Imagen de agente:** contiene el sistema y el proceso necesarios para conectarse a Jenkins.
- **Plantilla Docker:** relaciona imagen, etiqueta, usuario y sistema de archivos remoto.
- **`Jenkinsfile`:** solicita la etiqueta y define los pasos a ejecutar.
- **Red protegida:** permite que Jenkins alcance al servidor Docker mediante un método autorizado.

### Controlador y agente

El controlador Jenkins coordina la ejecución.

El agente ejecuta los pasos asignados por Jenkins.

En esta práctica, el agente se ejecuta dentro de un contenedor que Docker crea en el host remoto.

No se debe confundir:

- **Controlador Jenkins:** administra la instancia.
- **Host Docker:** máquina que ejecuta el daemon.
- **Contenedor agente:** entorno temporal donde se ejecutan los pasos del job.

### Flujo de solicitud de un agente

1. El pipeline solicita una etiqueta.
2. Jenkins comprueba si hay un agente disponible con esa etiqueta.
3. Si no lo hay, el plugin puede solicitar un contenedor a Docker.
4. Docker crea el contenedor desde la imagen configurada.
5. El método de conexión inicia el proceso del agente.
6. El agente se registra con Jenkins.
7. Jenkins asigna el trabajo.
8. Al finalizar, el plugin puede detener y retirar el contenedor.

El comportamiento exacto depende de la plantilla y de la versión del plugin.

### Requisito de etiqueta

La etiqueta del `Jenkinsfile` debe coincidir con la etiqueta de la plantilla.

En esta práctica, el nombre ilustrativo es:

```text
docker-slave
```

La etiqueta es el selector que usa Jenkins para encontrar el tipo de agente.

No determina por sí sola la seguridad ni las capacidades de la imagen.

### Requisito de red

La comunicación debe permitir que Jenkins llegue al endpoint configurado del servidor Docker.

Comprueba:

- Dirección IP correcta.
- Ruta entre redes.
- Reglas del firewall.
- Protocolo y puerto.
- Certificados, si se utiliza TLS.
- Resolución DNS, si se usa un nombre.
- Reglas de salida y entrada del controlador.

### No confundir conectividad con autorización

Que Jenkins pueda abrir una conexión TCP no significa que la API esté protegida correctamente.

La configuración debe autenticar y autorizar el acceso.

Con Docker TCP sin protección, cualquier cliente que alcance el puerto puede tener privilegios muy amplios sobre el host.

### Dirección privada del host

En el ejemplo de laboratorio puede aparecer una dirección como:

```text
192.168.1.50
```

Sustitúyela por la dirección privada asignada a la máquina virtual.

No copies esa dirección literalmente sin comprobar la topología.

Evita utilizar una dirección pública para exponer el daemon Docker.

### Sobre el puerto `4243`

El puerto de ejemplo `4243` no cifra ni autentica la conexión por sí solo.

Cambiar el puerto estándar o elegir un puerto distinto no protege la API.

La seguridad procede del método de conexión, de TLS, de la autenticación, de la autorización y de las reglas de red.

### Límites de aislamiento

Los contenedores comparten el kernel del host.

No equivalen a una máquina virtual con un kernel independiente.

Un contenedor con privilegios excesivos, montajes sensibles o acceso al socket Docker puede comprometer el host.

### Eliminar el contenedor no limpia todo

Al terminar un agente, pueden permanecer:

- Imágenes en caché.
- Volúmenes con datos.
- Redes creadas por el administrador.
- Artefactos de Jenkins.
- Logs.
- Directorios compartidos.
- Datos persistentes montados en el contenedor.

La limpieza debe revisarse componente por componente.

### Capacidad del host Docker

Cada contenedor consume recursos.

El host debe disponer de capacidad para:

- CPU.
- Memoria.
- Almacenamiento.
- Descargas de imágenes.
- Red.
- Procesos y descriptores disponibles.

La creación de muchos contenedores en paralelo puede agotar recursos.

### Escalabilidad no es automática

Jenkins puede solicitar varios agentes en paralelo si la configuración y los recursos lo permiten.

No significa que el host Docker tenga capacidad ilimitada.

Hay que configurar límites, colas, concurrencia y recursos según las políticas de la instancia.

---

## Preparar el servidor Docker

La configuración del daemon afecta directamente a la seguridad del host.

### Antes de cambiar nada

Confirma que:

- Tienes autorización para administrar la máquina virtual.
- El host es de laboratorio y no contiene cargas de producción.
- Existe un procedimiento para volver atrás.
- Conoces la dirección de Jenkins.
- Conoces la interfaz privada que debe usarse.
- Tienes acceso de consola a la máquina si se pierde conectividad.
- El administrador ha aprobado el método de autenticación.

No modifiques un host compartido basándote únicamente en un tutorial.

### Comprobaciones iniciales

En el host Docker, comprueba:

```bash
docker version
```

Comprueba el estado del servicio:

```bash
sudo systemctl status docker
```

Comprueba la dirección de red:

```bash
ip addr show
```

El comando puede mostrar varias interfaces.

Identifica la interfaz privada correcta antes de configurar el endpoint.

### Dirección IP privada

Como alternativa, en algunas distribuciones puede usarse:

```bash
hostname -I
```

Ese comando puede mostrar varias direcciones.

No copies la primera sin comprobar a qué interfaz pertenece.

### Usuario dedicado en el host

Algunas instrucciones antiguas proponen crear un usuario `jenkins` en el host:

```bash
sudo useradd -m -s /bin/bash -U jenkins
```

Ese usuario **no es un requisito universal** para el método “Attach Docker container”.

El método de conexión, los volúmenes, el UID de la imagen y la configuración del plugin determinan si hace falta un usuario en el host.

Antes de crear una cuenta:

- Comprueba qué usuario necesita el plugin.
- Revisa los montajes que se usarán.
- Confirma si el contenedor se ejecuta con un UID específico.
- Sigue la política de cuentas del administrador.

### No asignar una contraseña débil

No asignes la contraseña `jenkins` a una cuenta del sistema.

Esa contraseña es conocida, débil y no es necesaria para el flujo descrito.

Para cuentas administrativas, sigue la política de identidad del sistema.

Si la práctica requiere una cuenta técnica, el administrador debe definir cómo se autentica y limitar sus permisos.

### Grupo `docker`

Añadir un usuario al grupo `docker` puede conceder privilegios equivalentes a acceso administrativo sobre el host.

No lo hagas para resolver un error de forma rápida.

Revisa la política local y consulta al administrador antes de cambiar ese grupo.

### API Docker y permisos

El daemon Docker puede crear contenedores, montar rutas y gestionar recursos del host.

Quien puede controlar la API puede disponer de capacidades muy privilegiadas.

Por eso:

- No expongas la API sin autenticación.
- No permitas conexiones desde cualquier IP.
- No montes el socket del host dentro de agentes no confiables.
- Limita qué controlador puede autenticarse.
- Usa certificados protegidos y rotables.
- Revisa logs y reglas de firewall.

### Métodos protegidos

Las opciones dependen de la instalación y del plugin disponible.

Entre los patrones que pueden ser adecuados están:

- **TLS mutuo:** el servidor valida un certificado cliente y la conexión está cifrada.
- **SSH:** el cliente accede al daemon mediante una conexión SSH configurada y autorizada, si el plugin y la versión lo admiten.
- **Red privada con controles adicionales:** solo como parte de una política de seguridad definida; una red privada por sí sola no cifra ni autentica Docker.
- **Socket Unix local:** adecuado cuando Jenkins y Docker comparten host, siempre que los permisos estén limitados y el diseño sea aprobado.

Consulta al administrador cuál de estos métodos está habilitado.

### Por qué no usar TCP sin protección

No configures el daemon con una escucha abierta como esta:

```text
-H tcp://0.0.0.0:4243
```

si no está protegido por un método de autenticación y cifrado.

`0.0.0.0` significa que el servicio puede escuchar en todas las interfaces disponibles.

Una regla de firewall ayuda a limitar la exposición, pero no sustituye TLS ni autenticación.

### No considerar suficiente una red interna

Una red interna puede incluir:

- Otros equipos de laboratorio.
- Máquinas virtuales de otros grupos.
- Equipos comprometidos.
- Usuarios con acceso a la red.
- Reglas de enrutamiento no previstas.

No des por hecho que “interno” significa “de confianza”.

### Configuración con TLS

Un diseño de Docker remoto protegido por TLS mutuo requiere, como mínimo:

- Una autoridad certificadora aprobada.
- Certificado del servidor Docker.
- Clave privada del servidor protegida.
- Certificado cliente para Jenkins.
- Clave privada cliente protegida en Jenkins.
- Verificación de los certificados.
- Reglas de firewall limitadas.
- Correspondencia entre los campos TLS del plugin y los archivos emitidos.

Las rutas y los nombres dependen del sistema y del plugin.

No reutilices certificados privados de otro servicio.

No copies claves privadas a un repositorio.

### TLS mutuo: esquema conceptual

```text
Jenkins
  |
  | TLS + certificado cliente
  v
Endpoint privado del daemon Docker
  |
  | valida cliente y presenta certificado servidor
  v
Docker Engine
```

La conexión debe fallar si el certificado no es válido o no corresponde a la autoridad configurada.

### Certificados y Jenkins

La forma de asociar certificados a Jenkins depende de:

- Plugin Docker.
- Tipo de credencial disponible.
- Versión.
- Configuración de clouds.
- Política de la instancia.

Guarda claves privadas como credenciales de Jenkins, no como texto en el `Jenkinsfile`.

### No generar certificados improvisados para producción

Un laboratorio puede usar una autoridad de prueba bajo controles del docente.

En producción, la emisión, rotación y revocación deben seguir la política de la organización.

No uses un certificado de laboratorio en sistemas reales.

### Configurar `dockerd`

La forma de configurar los argumentos del daemon depende de la distribución.

En muchos sistemas Linux el servicio se administra con `systemd`.

Antes de editar:

```bash
systemctl cat docker
```

Esto ayuda a ver cómo se define el servicio realmente.

No asumas que la ruta es siempre `/lib/systemd/system/docker.service`.

### Editar el fichero `/lib/systemd/system/docker.service`

Entra el fichero `/lib/systemd/system/docker.service` y busca la linea que empiece con `ExecStart`. Luego tienes que escribir esto:

```bash
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:4243
```

Luego, salva el fichero y reinicia el servicio de docker

```bash
sudo systemctl daemon-reload
sudo systemctl enable docker
sudo systemctl restart docker
```

### Evitar editar directamente el archivo del paquete

En vez de modificar directamente el archivo distribuido por el paquete, suele ser preferible un *drop-in* de `systemd`, si la administración del host lo permite.

La ruta y el contenido deben definirse con el administrador.

Las actualizaciones del paquete pueden reemplazar el archivo original.

### Revisar `ExecStart`

Al cambiar argumentos de `dockerd` mediante un *drop-in*, se debe prestar atención a la sintaxis de `systemd`.

En muchos casos hay que vaciar primero el `ExecStart` anterior y luego declarar la nueva línea.

No pegues una línea de ejemplo sin comprobar:

- Argumentos existentes.
- Socket Unix.
- Rutas de certificados.
- Unidad activa.
- Versión de Docker.
- Requisitos de arranque de la distribución.

### Esquema conceptual de argumentos TLS

Un daemon protegido puede requerir una configuración equivalente a:

```text
dockerd
  --tlsverify
  --tlscacert=RUTA_CA
  --tlscert=RUTA_CERT_SERVIDOR
  --tlskey=RUTA_CLAVE_SERVIDOR
  -H tcp://IP_PRIVADA:4243
  -H unix:///var/run/docker.sock
```

Este esquema no es una receta universal.

Valida nombres de opciones, rutas, permisos y configuración en la versión instalada.

### Socket Unix local

El socket Unix puede mantenerse si el host lo requiere:

```text
unix:///var/run/docker.sock
```

No cambies ni elimines el socket local sin entender qué componentes lo usan.

### Evitar dos configuraciones contradictorias

Docker puede recibir configuración desde:

- `daemon.json`.
- Argumentos de `dockerd`.
- Unidad `systemd`.
- *Drop-ins*.
- Herramientas de la distribución.

Si la misma opción se define de maneras incompatibles, Docker podría no iniciar.

Revisa la configuración efectiva antes de reiniciar.

### Validar la sintaxis de configuración

Antes de reiniciar:

- Revisa JSON si se modifica `daemon.json`.
- Revisa la unidad y los *drop-ins*.
- Comprueba las rutas de certificados.
- Comprueba permisos de lectura.
- Comprueba que la clave privada solo sea legible por quien corresponda.
- Registra la configuración actual para poder revertirla.

### Recargar `systemd`

Tras un cambio aprobado en la unidad:

```bash
sudo systemctl daemon-reload
```

Este comando recarga la configuración de unidades.

No cambia por sí solo el firewall ni valida los certificados.

### Habilitar el servicio

En un host administrado, el servicio puede habilitarse para el arranque mediante una política del administrador.

El comando siguiente puede modificar el comportamiento de arranque:

```bash
sudo systemctl enable docker
```

Ejecuta ese cambio solo si está autorizado.

### Reiniciar Docker

Un reinicio puede interrumpir contenedores activos.

Comprueba que el host no está ejecutando cargas que deban permanecer disponibles.

Si el laboratorio es desechable y el administrador lo permite, se puede reiniciar el servicio:

```bash
sudo systemctl restart docker
```

### Reiniciar la máquina virtual

No es necesario reiniciar el host en todos los cambios.

Un reinicio puede ayudar en un laboratorio cuando se han modificado red o arranque, pero puede interrumpir sesiones y otros servicios.

Hazlo solo con autorización y después de guardar la configuración.

### Firewall

Limita el acceso al puerto del daemon a la dirección o red autorizada del controlador, además de utilizar autenticación y cifrado.

Las reglas concretas dependen de la distribución y del firewall activo.

No uses una regla de apertura global como solución permanente.

### Ejemplo de principio de firewall

La política debería expresar:

```text
Permitir:
  origen = controlador Jenkins autorizado
  destino = host Docker
  puerto = endpoint protegido
  protocolo = el configurado

Denegar:
  otros orígenes no autorizados
```

El administrador debe adaptar y validar la regla.

### Comprobar puertos en escucha

Para inspeccionar sockets TCP:

```bash
sudo ss -tlnp
```

Filtrar por el puerto de ejemplo:

```bash
sudo ss -tlnp | grep 4243
```

Ver un puerto en escucha no demuestra que esté protegido.

Comprueba también dirección de escucha, firewall, TLS y autenticación.

### Dirección de escucha

Al revisar `ss`, presta atención a si el daemon escucha en:

- Una interfaz privada concreta.
- `127.0.0.1`.
- `0.0.0.0`.
- Una dirección IPv6 amplia.
- Más de una interfaz.

La dirección visible es parte de la superficie expuesta.

### Estado del servicio

```bash
sudo systemctl status docker
```

Si el servicio no inicia, revisa los logs antes de cambiar varias cosas a la vez.

### Logs de `systemd`

```bash
sudo journalctl -u docker --no-pager -n 100
```

Los logs pueden contener rutas y datos operativos.

No los publiques sin revisar la política del entorno.

### Verificar la versión local

```bash
docker version
```

La salida ayuda a comprobar:

- Versión del cliente.
- Versión del servidor.
- Disponibilidad de la API.
- Diferencias entre cliente y servidor.

No compartas identificadores sensibles o certificados que aparezcan en registros personalizados.

### Probar la conectividad desde Jenkins

La prueba de conexión debe hacerse desde la configuración autorizada del plugin.

Un simple `ping` no valida la API Docker.

Una conexión TCP tampoco confirma que TLS y permisos estén correctos.

### Revertir un cambio

Antes de editar, documenta cómo volver a la configuración anterior.

Un plan de reversión puede incluir:

- Restaurar la unidad o el *drop-in* anterior.
- Restaurar `daemon.json`.
- Quitar la regla temporal de firewall.
- Volver a cargar `systemd`.
- Reiniciar Docker de forma coordinada.
- Verificar el socket Unix local.
- Confirmar que los servicios afectados funcionan.

---

## Configurar Jenkins

La configuración de Jenkins debe apuntar al host correcto y utilizar el método de conexión aprobado.

### Comprobar el plugin Docker

En Jenkins, revisa si está instalado el plugin que proporciona clouds y agentes Docker.

La ubicación de la información de plugins depende de la versión y de los permisos.

No instales ni actualices plugins en una instancia compartida sin autorización.

### Versiones del plugin

Comprueba:

- Compatibilidad con la versión de Jenkins.
- Compatibilidad con la versión de Docker Engine.
- Compatibilidad con el método TLS o SSH.
- Compatibilidad con el tipo de imagen.
- Notas de cambios relevantes.
- Estado de mantenimiento.

### Ir a la configuración de clouds

La ruta de interfaz puede variar.

En muchas versiones se encuentra bajo:

```text
Manage Jenkins
  → Nodes and Clouds
  → Clouds
  → Configure Clouds
```

En otras versiones, los nombres o la ubicación pueden diferir.

### Añadir un cloud

Si tienes permiso:

1. Abre la configuración de clouds.
2. Selecciona añadir un cloud.
3. Elige Docker.
4. Asigna un nombre descriptivo.
5. Configura el endpoint.
6. Añade las credenciales TLS o el método SSH aprobado.
7. Prueba la conexión.
8. Guarda solo cuando la validación sea correcta.

Si no tienes permiso administrativo, realiza la práctica con la configuración preparada por el docente.

### Docker Host URI

La URI de ejemplo utiliza el puerto `4243`:

```text
tcp://192.168.1.50:4243
```

Esa forma, por sí sola, **no especifica TLS**.

No introduzcas una URI TCP sin protección en una instancia compartida o en un host accesible por otros equipos.

### URI protegida

La forma exacta de expresar una conexión protegida depende del plugin.

Puede incluir una URI TCP junto con credenciales TLS configuradas en campos separados.

No asumas que añadir `tcp://` basta para habilitar cifrado.

Sigue la interfaz y documentación de la versión instalada.

### Dirección del host

Sustituye la IP de ejemplo por la dirección privada real del host Docker.

Comprueba la interfaz correcta con el administrador.

Evita nombres o direcciones que resuelvan a un host distinto según el entorno.

### Credenciales TLS

Asocia la credencial de cliente mediante el sistema de credenciales de Jenkins, si el plugin lo permite.

Comprueba:

- Certificado de la autoridad.
- Certificado cliente.
- Clave cliente.
- Cadena de certificados.
- Correspondencia con el host.
- Permisos para usar la credencial.
- Rotación y revocación.

### Método SSH

Si el plugin y la versión admiten conexión SSH, el administrador puede configurarla con una identidad técnica limitada.

Comprueba:

- Host y puerto SSH.
- Clave almacenada como credencial.
- Usuario permitido.
- Restricciones de comandos y permisos.
- Reglas de red.
- Compatibilidad del plugin.

No pegues una clave privada en el campo de texto del `Jenkinsfile`.

!!!note "Plugin a poner"
    Para que todo funcione bien a la primera, hace falta poner el plugin [`SSH Agent Plugin`](https://plugins.jenkins.io/ssh-agent/)

### Nombre del cloud

Usa un nombre que describa el entorno, por ejemplo:

```text
docker-laboratorio
```

No incluyas datos secretos en el nombre.

### Probar la conexión

Pulsa **Test Connection** o la opción equivalente.

Una conexión correcta debería mostrar información del daemon o de la API, según el plugin.

La versión observada puede variar.

### Ejemplo de información devuelta

La interfaz podría mostrar datos como:

```text
Versión del servidor: 24.x
Versión de API: 1.x
```

Los valores dependen de la instalación.

No exijas exactamente las versiones de un ejemplo de otra máquina.

### Guardar la configuración

Guarda solo después de revisar:

- URI.
- Método de autenticación.
- Credencial.
- Firewall.
- Host.
- Puerto.
- Etiquetas.
- Plantillas.

### Errores de conexión frecuentes

- Host equivocado.
- Puerto cerrado.
- Firewall que bloquea.
- Certificado incorrecto.
- Certificado caducado.
- Nombre del host que no coincide con el certificado.
- Credencial no asociada.
- Plugin incompatible.
- Daemon sin la configuración esperada.
- Docker detenido.
- Resolución DNS incorrecta.
- Reloj de host o controlador desajustado, afectando certificados.

### No abrir el firewall sin límite

Si la prueba falla, no uses una regla de firewall que permita conexiones desde cualquier origen como primer recurso.

Identifica:

- IP de origen real del controlador.
- IP de destino.
- Puerto.
- Protocolo.
- Método de autenticación.
- Ruta de red.

Pide al administrador que aplique la regla mínima autorizada.

---

## Crear la plantilla del agente

La plantilla define el tipo de contenedor que Jenkins solicitará para una etiqueta.

### Qué es una plantilla

Una plantilla asocia:

- Etiquetas.
- Imagen Docker.
- Sistema de archivos remoto.
- Usuario.
- Método de conexión.
- Variables y opciones adicionales admitidas por el plugin.
- Límites de contenedor, si están configurados.

Los nombres exactos de los campos dependen de la versión.

### Plantillas Docker que funcionan y estan ya preparadas
Las plantillas ja tienen el puerto SSH mapeado del contenedor de Docker, normalmente un puerto en el host de Docker, tiene que ser accesible a través de la red desde el nodo maestro.
Las imagenes de Docker tienen instalado sshd, Java y el usuario Jenkins. En la imagen el `Remote File System Root` es `/home/jenkins`.
Los datos de inicio de sesión deben estar configurados según el plugin [`SSH Agent Plugin`](https://plugins.jenkins.io/ssh-agent/). Se debe inyectar la llave SSH con el usuario jenkins.

Imágenes disponibles que funcionan:
- [Agente Debian 13](https://hub.docker.com/repository/docker/guillemhs/jenkins-debian-13-agent/general)
- [Agente Alpine 3.24.2](https://hub.docker.com/repository/docker/guillemhs/jenkins-alpine-agent/general)
- [Agente Ubuntu 26.04](https://hub.docker.com/repository/docker/guillemhs/jenkins-ubuntu-agent/general)
- [Agente Terraform](https://hub.docker.com/repository/docker/guillemhs/jenkins-terraform-agent/general)
- [Agente Ansible](https://hub.docker.com/repository/docker/guillemhs/jenkins-ansible-agent/general)


### Ejemplo de pipeline con un agente docker fungible

Después de crear tu agente `debian-13-agent` en el cloud de Docker puedes ejecutar este pipeline:

```groovy
pipeline {
    agent {
        label 'debian-13-agent'
    }

    stages {
        stage('Ejemplo01') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
        stage('Ejemplo02') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
        stage('Ejemplo03') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
        stage('Ejemplo04') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
        stage('Ejemplo05') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
        stage('Ejemplo06') {
            steps {
                echo 'Hola desde Jenkins'
            }
        }
    }
}
```

### Etiqueta `docker-slave`

La práctica utiliza esta etiqueta:

```text
docker-slave
```

El pipeline puede solicitarla con:

```groovy
agent {
    label 'docker-slave'
}
```

La etiqueta del pipeline y la de la plantilla deben coincidir exactamente.

### Nombre de plantilla

Un nombre ilustrativo:

```text
docker-slave
```

El nombre identifica la configuración en Jenkins.

No sustituye la etiqueta.

Una plantilla puede tener un nombre interno y una o más etiquetas.

### Imagen Docker

La imagen define el sistema y las herramientas iniciales del contenedor.

Una imagen de agente debería incluir o permitir iniciar:

- Un sistema operativo compatible.
- Java adecuado para el agente y la versión de Jenkins.
- El mecanismo de conexión requerido por el plugin.
- Un usuario correcto.
- Un directorio de trabajo escribible.
- Las herramientas necesarias para el proyecto.

### Opción ligera de la práctica

La explicación original propone esta imagen:

```text
itnove/jenkins-agent-alpine:alpine-312-openjdk-11
```

Es una referencia didáctica, no una recomendación automática para producción.

Antes de usarla, verifica:

- Que la imagen sigue publicada.
- Que el origen es confiable.
- Que la etiqueta corresponde al contenido esperado.
- Que el sistema operativo y Java siguen soportados.
- Que la imagen es compatible con la versión de Jenkins.
- Que incluye el agente y el método de conexión requeridos.
- Que el usuario y el home están configurados como espera la plantilla.

Alpine 3.12 y Java 11 pueden estar fuera de soporte según el ciclo de vida aplicable. No uses una imagen antigua sin revisar su estado.

### Opción con herramientas integradas

La explicación original propone también:

```text
mzagar/jenkins-slave-jdk-maven-git
```

Trátala como una referencia de laboratorio que se debe revisar.

Antes de usarla, verifica:

- Mantenimiento.
- Procedencia.
- Fecha de actualización.
- Arquitectura.
- Java incluido.
- Maven incluido.
- Git incluido.
- Usuario predeterminado.
- Compatibilidad con el agente Jenkins.
- Vulnerabilidades conocidas.

### Imagen oficial o mantenida por la organización

En un entorno profesional suele ser preferible una imagen:

- Mantenida por el equipo.
- Construida desde una base confiable.
- Versionada con etiquetas explícitas.
- Escaneada según la política interna.
- Actualizada en un ciclo conocido.
- Documentada con herramientas y versiones.
- No ejecutada con privilegios innecesarios.

### No usar `latest` sin control

La etiqueta `latest` puede cambiar sin que el `Jenkinsfile` cambie.

Para reproducibilidad, utiliza una etiqueta versionada o un digest aprobado por el equipo.

La política de actualización debe equilibrar estabilidad y parches de seguridad.

### Sistema de archivos remoto

La plantilla puede pedir un **Remote File System Root** o campo equivalente.

La explicación original utiliza:

```text
/home/jenkins
```

Ese directorio debe corresponder al home o al área de trabajo del usuario agente dentro de la imagen, según el plugin.

Comprueba:

- Que existe.
- Que el usuario del proceso puede escribir.
- Que el directorio no está montado como solo lectura.
- Que el plugin espera esa ruta.
- Que no se está confundiendo con el workspace del host.

### El usuario del contenedor

La imagen puede ejecutar el agente como un usuario llamado `jenkins`.

Comprueba el usuario real desde el contenedor o mediante el pipeline:

```bash
whoami
```

No supongas que el nombre de usuario en el contenedor coincide con el usuario del host.

### UID y permisos

Si se montan volúmenes del host, pueden surgir conflictos entre UID/GID.

Antes de añadir un volumen:

- Confirma que es necesario.
- Define permisos mínimos.
- Evita montar rutas sensibles.
- Comprueba quién escribe los archivos.
- Evita compartir el socket Docker.
- Documenta qué datos sobreviven al contenedor.

### Método “Attach Docker container”

La práctica propone:

```text
Attach Docker container
```

Este método puede iniciar el contenedor y adjuntar el proceso del agente sin requerir SSH dentro del contenedor, según el plugin y la configuración.

Verifica que:

- La imagen es compatible con el método.
- El comando o entrada del contenedor no termina antes de conectar.
- El agente dispone del Java necesario.
- El plugin puede adjuntar su proceso.
- La imagen no sustituye el `ENTRYPOINT` requerido de manera incompatible.

### No asumir que toda imagen Linux sirve

Una imagen genérica puede carecer de:

- Java.
- Proceso de agente.
- Usuario adecuado.
- Bash.
- Git.
- Certificados del sistema.
- Herramientas requeridas.
- Directorio escribible.

La existencia de `/bin/sh` no basta para que una imagen sea un agente Jenkins.

### Conexión sin SSH

En el método attach, el plugin puede interactuar con el proceso del contenedor directamente.

Eso no implica que se puedan omitir los requisitos del agente Jenkins.

El contenedor necesita un mecanismo válido para iniciar y mantener conectado al agente.

### Opciones adicionales

La plantilla puede exponer parámetros como:

- Variables de entorno.
- Directorio de trabajo.
- Retención del contenedor.
- Política de eliminación.
- Montajes.
- Red Docker.
- Límites de CPU y memoria.
- Usuario.
- Comando de inicio.

No habilites una opción sin comprender su efecto.

### Retención del contenedor tras el build

Algunos plugins permiten conservar temporalmente contenedores cuando falla una ejecución para diagnóstico.

Puede ser útil en laboratorio, pero modifica la expectativa de efimeridad.

Si se conserva:

- Limita el tiempo.
- No dejes datos sensibles dentro.
- Asegura permisos de acceso.
- Documenta cómo se elimina.
- Comprueba que no se acumulan contenedores.

### Eliminar contenedor al terminar

Comprueba la configuración de la plantilla para asegurar que el contenedor se retira cuando corresponde.

La eliminación debe verificarse en el host autorizado y con el procedimiento del laboratorio.

No borres manualmente contenedores ajenos al ejercicio.

---

## Requisitos de la imagen del agente

La imagen es parte del contrato de ejecución.

### Java

El agente suele necesitar una versión de Java compatible con el modo de conexión y la versión de Jenkins.

Confirma los requisitos actuales de la instancia.

No asumas que la versión de Java usada por una aplicación es también la versión del agente.

### Java del agente y JDK de compilación

Puede haber dos necesidades distintas:

- Java necesario para ejecutar el agente Jenkins.
- JDK que necesita el proyecto para compilar.

Una imagen puede traer uno, ambos o ninguno.

Comprueba la configuración real.

### Git

El checkout puede ejecutar Git en el agente, según el job y el plugin.

Confirma que el ejecutable existe y que su ruta corresponde al agente.

### Maven

Para ejecutar Maven, el agente puede necesitar:

- Maven instalado.
- JDK compatible.
- Variables correctas.
- Configuración de repositorios.
- Certificados o proxies autorizados, si corresponden.

No incluyas contraseñas de repositorios en la imagen.

### Certificados del sistema

Si el agente necesita acceder a repositorios internos por TLS, la imagen podría requerir certificados corporativos aprobados.

No desactives la verificación TLS como solución.

### Dependencias del proyecto

Instala o declara dependencias de forma reproducible.

Evita que la imagen dependa de cambios manuales no documentados.

### Usuario no root

Cuando sea posible, el contenedor de build debería usar un usuario no root.

La compatibilidad depende del plugin y del proceso de agente.

No des permisos privilegiados al contenedor para resolver un error de escritura sin entender el origen.

### Directorio de trabajo

El directorio debe:

- Existir.
- Ser escribible por el usuario del agente.
- Tener espacio suficiente.
- No compartir datos sensibles de otro job.
- Corresponder con la raíz configurada en Jenkins.

### Herramientas mínimas

Incluye solo lo que el job necesita.

Una imagen más pequeña puede reducir superficie y tiempo de descarga, pero no debe quedar incompleta para el pipeline.

### Etiquetas y digests

Las etiquetas facilitan administrar versiones.

Los digests identifican una imagen de forma inmutable, cuando la política de la organización lo permite.

Documenta cómo se actualiza la imagen.

---

## Configurar herramientas globales

Las herramientas globales de Jenkins permiten declarar herramientas que los jobs pueden solicitar.

La configuración debe coincidir con lo instalado en el agente.

### Abrir la configuración de herramientas

La ubicación habitual es:

```text
Manage Jenkins
  → Tools
```

En versiones anteriores puede aparecer como **Global Tool Configuration**.

La interfaz y los nombres varían entre versiones.

### Diferencia entre herramienta instalada automáticamente y herramienta del agente

Jenkins puede:

- Descargar una herramienta en el agente.
- Usar una instalación preexistente.
- Usar una ruta configurada.
- Seleccionar una instalación por nombre.

El comportamiento depende del tipo de herramienta y de la configuración.

No supongas que una ruta indicada en Jenkins instala el programa dentro del contenedor.

### Git

La explicación de la práctica propone verificar la ruta de Git:

```text
/usr/bin/git
```

En Alpine y en distribuciones Debian/Ubuntu puede ser una ruta habitual, pero debes comprobar la imagen concreta.

Dentro de una imagen temporal de laboratorio, el administrador podría verificar:

```bash
which git
```

Y:

```bash
git --version
```

No ejecutes contenedores con imágenes no revisadas en un host compartido.

### Configuración de Git en Jenkins

Si se configura un nombre de instalación de Git:

- Usa un nombre descriptivo.
- Indica la ruta validada.
- Comprueba que el ejecutable existe dentro del agente.
- Asegúrate de que el plugin de Git usa esa configuración.
- Prueba un checkout de laboratorio.

### JDK

La imagen de ejemplo ligera menciona OpenJDK 11.

Antes de fijar ese valor:

- Comprueba que la versión sigue soportada para el propósito del curso.
- Comprueba la compatibilidad con Jenkins Agent.
- Comprueba la compatibilidad con el proyecto.
- Distingue JDK de aplicación y Java del agente.
- Consulta la política de versiones del administrador.

### Maven

La práctica propone un nombre de instalación como:

```text
M3
```

El nombre debe coincidir exactamente con el que se usa en el `Jenkinsfile`.

Una ruta ilustrativa es:

```text
/usr/share/maven
```

No asumas que la ruta es correcta para todas las imágenes.

### Comprobar Maven en una imagen

En un entorno de laboratorio aislado, una comprobación puede tener esta forma:

```bash
docker run --rm IMAGEN_APROBADA which mvn
```

Y:

```bash
docker run --rm IMAGEN_APROBADA mvn --version
```

Sustituye `IMAGEN_APROBADA` por la imagen autorizada por el curso.

No ejecutes una imagen desconocida solo para averiguar su contenido.

### Comprobar Java en una imagen

```bash
docker run --rm IMAGEN_APROBADA java -version
```

La salida se escribe normalmente en la salida de error de algunas herramientas.

Al combinarlo con captura, ten en cuenta ambos canales.

### Comprobar Git en una imagen

```bash
docker run --rm IMAGEN_APROBADA git --version
```

Comprueba que la imagen es confiable y que el host Docker es de laboratorio.

### Rutas de Alpine

Alpine utiliza `apk` como gestor de paquetes y puede organizar archivos de forma distinta a Debian o Ubuntu.

No asumas rutas de Maven ni disponibilidad de GNU utilities.

Comprueba la documentación y el contenido de la imagen aprobada.

### Rutas Debian y Ubuntu

En Debian o Ubuntu, Git suele aparecer en una ruta como `/usr/bin/git`.

Maven puede instalarse en distintas rutas según el método de instalación.

Comprueba la ruta real en vez de copiar un valor de otra imagen.

### Maven Home

La ruta `MAVEN_HOME` debe apuntar a la instalación correcta, si Jenkins o un plugin la necesita.

Verifica:

```text
mvn --version
```

y revisa la ruta que informa la instalación, cuando corresponda.

### Nombre de herramienta en el `Jenkinsfile`

Si se configura Maven con nombre `M3`, el pipeline puede usar el nombre declarado mediante la directiva `tools`, en contextos compatibles.

```groovy
tools {
    maven 'M3'
}
```

La disponibilidad depende de la configuración global y del tipo de job.

No añadas la directiva si la instalación no existe.

### Java del agente frente a `tools`

La directiva `tools` puede seleccionar herramientas para etapas o pipelines.

Comprueba si la herramienta se instala, se localiza o se añade al `PATH` en el agente.

No asumas que el contenedor trae la misma versión que el controlador.

### Git y checkout

El plugin SCM puede elegir una instalación de Git configurada.

Si el checkout falla:

- Comprueba Git en el agente.
- Comprueba permisos del repositorio.
- Comprueba credenciales de SCM.
- Comprueba certificados.
- Revisa la versión del plugin.
- No imprimas claves o tokens.

### Configuración global compartida

Los cambios en Global Tools pueden afectar muchos jobs.

En un laboratorio compartido:

- No modifiques herramientas globales sin autorización.
- Usa la configuración preparada por el docente.
- Anota el nombre de instalación.
- Informa si una ruta no coincide con la imagen.

---

## Pipeline de prueba

La primera ejecución debe demostrar que la etiqueta selecciona el agente esperado.

### Pipeline mínimo

```groovy
pipeline {
    agent {
        label 'docker-slave'
    }

    stages {
        stage('Verificar agente Docker') {
            steps {
                echo 'Ejecutando en un agente Docker solicitado por etiqueta.'
                sh 'whoami'
                sh 'pwd'
                sh 'hostname'
            }
        }
    }
}
```

Este ejemplo requiere que la etiqueta `docker-slave` esté configurada en un agente o plantilla compatible.

### `agent { label ... }`

La directiva solicita un nodo que satisfaga la etiqueta.

Si no hay un agente estático disponible, la configuración del cloud puede crear uno.

La etiqueta no crea por sí sola la plantilla.

### Verificar el usuario

```groovy
sh 'whoami'
```

La salida identifica el usuario del proceso dentro del contenedor.

No demuestra qué permisos tiene el usuario en el host.

### Verificar el directorio de trabajo

```groovy
sh 'pwd'
```

La ruta debería estar dentro del sistema de archivos del contenedor según la configuración.

El workspace puede incluir nombres asignados por Jenkins.

### Verificar el hostname

```groovy
sh 'hostname'
```

En un contenedor, el hostname puede ser un identificador corto o un valor configurado.

No siempre será el ID completo del contenedor.

### Verificar el sistema operativo

```groovy
sh 'cat /etc/os-release'
```

La salida identifica el sistema base de la imagen, si el archivo existe.

Algunas imágenes mínimas pueden no incluirlo.

### Verificar Java

```groovy
sh 'java -version'
```

En algunas distribuciones la versión se escribe en `stderr`; el paso `sh` normalmente sigue mostrando esa salida en la consola.

### Verificar Git

```groovy
sh 'git --version'
```

Si el comando no existe, revisa la imagen y Global Tools.

### Verificar Maven

```groovy
sh 'mvn --version'
```

La salida puede incluir versión de Maven y del JDK que Maven está usando.

Comprueba ambas.

### Pipeline de prueba ampliado

```groovy
pipeline {
    agent {
        label 'docker-slave'
    }

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Identidad del agente') {
            steps {
                echo 'Comprobando la identidad del agente.'
                sh 'whoami'
                sh 'pwd'
                sh 'hostname'
            }
        }

        stage('Sistema operativo') {
            steps {
                sh 'cat /etc/os-release'
            }
        }

        stage('Herramientas') {
            steps {
                sh 'java -version'
                sh 'git --version'
            }
        }
    }

    post {
        always {
            echo "Resultado: ${currentBuild.currentResult}"
        }

        success {
            echo 'La comprobación básica del agente terminó correctamente.'
        }

        failure {
            echo 'Falló una comprobación del agente o de sus herramientas.'
        }
    }
}
```

Adapta las herramientas a la imagen autorizada.

### Inspeccionar Docker desde el host

El docente o administrador puede revisar los contenedores en el host Docker con comandos de administración autorizados.

No ejecutes comandos de eliminación sobre todos los contenedores.

No inspecciones contenedores de otros grupos.

### Verificar la eliminación

Al terminar:

- Comprueba el log del plugin.
- Confirma que el agente deja de estar conectado.
- Verifica el estado del contenedor según el procedimiento autorizado.
- Comprueba que la política de retención no lo conserva intencionalmente.
- No elimines recursos de otra ejecución.

### Contenedor diferente por ejecución

Para demostrar que se crea un contenedor nuevo, compara:

- El nombre del nodo de Jenkins.
- El hostname observado.
- Los identificadores que exponga el plugin.
- El registro de creación y retirada.

No supongas que el hostname siempre es un ID único exacto.

### Limpiar evidencia con cuidado

El objetivo es retirar el contenedor temporal, no borrar indiscriminadamente imágenes o datos del host.

La imagen puede permanecer en caché para acelerar ejecuciones posteriores.

La conservación de la imagen no significa que el agente anterior siga activo.

---

## Sesiones prácticas

Las sesiones avanzan desde la inspección hasta la ejecución de un pipeline en un agente temporal.

### Preparación general

Antes de empezar:

- Confirma que el host es de laboratorio.
- Solicita autorización para cualquier cambio.
- Usa un endpoint protegido.
- No abras la API Docker a toda la red.
- No uses la contraseña `jenkins`.
- No añadas usuarios al grupo `docker` sin autorización.
- No montes `/var/run/docker.sock` en el agente.
- Anota la versión del plugin y Docker.
- Utiliza una imagen aprobada.
- Evita cargas reales o datos sensibles.

### Sesión 1: dibujar la arquitectura

**Objetivo:** identificar los componentes antes de configurar.

#### Actividad

Dibuja:

```text
Controlador Jenkins
        |
        | conexión autenticada y protegida
        v
Servidor Docker
        |
        | crea
        v
Contenedor agente
        |
        | ejecuta
        v
Pasos del pipeline
```

#### Preguntas

- ¿Qué componente crea el contenedor?
- ¿Dónde se ejecuta `sh`?
- ¿Qué componente elimina el contenedor?
- ¿Qué protege la conexión?
- ¿Qué datos sobreviven al contenedor?

#### Entregable

Escribe los nombres de los componentes reales de tu laboratorio sin publicar direcciones privadas.

### Sesión 2: inspeccionar el host Docker

**Objetivo:** comprobar servicio, versión e interfaces.

#### Instrucciones

1. Accede a la máquina virtual autorizada.
2. Ejecuta `docker version`.
3. Ejecuta `sudo systemctl status docker`.
4. Ejecuta `ip addr show`.
5. Identifica la interfaz privada que indicó el docente.
6. Ejecuta `sudo ss -tlnp`.
7. No cambies la configuración todavía.
8. Registra únicamente la información autorizada.

#### Tabla de registro

| Comprobación | Resultado observado | Observación |
|---|---|---|
| Servicio Docker | | |
| Versión del servidor | | |
| IP privada autorizada | | |
| Puerto en escucha | | |
| Interfaz | | |

### Sesión 3: comprobar el riesgo de una API sin protección

**Objetivo:** comprender por qué no se debe publicar Docker TCP sin autenticación.

#### Actividad

1. Revisa la dirección de escucha del daemon.
2. Revisa las reglas del firewall con el docente.
3. Identifica si el endpoint exige TLS o SSH.
4. No intentes conectarte desde equipos no autorizados.
5. No ejecutes comandos Docker sobre hosts ajenos.
6. Describe el impacto que tendría una API sin protección.

#### Preguntas

- ¿Qué capacidades puede tener el daemon?
- ¿Por qué cambiar de puerto no es autenticación?
- ¿Por qué `0.0.0.0` amplía la superficie de exposición?
- ¿Qué diferencia hay entre cifrado y autorización?

### Sesión 4: revisar el método seguro disponible

**Objetivo:** acordar cómo se autenticará Jenkins.

#### Opciones a revisar

- TLS mutuo.
- SSH, si el plugin lo admite.
- Socket Unix local con una arquitectura autorizada.
- Otra integración preparada por el administrador.

#### Instrucciones

1. Consulta al administrador qué método utiliza el laboratorio.
2. Identifica qué credencial de Jenkins se necesita.
3. Confirma quién puede usarla.
4. Comprueba que el certificado o clave no está en Git.
5. No generes ni copies credenciales reales.
6. Documenta el método sin escribir secretos.

#### Hoja de registro

```text
Método:
Plugin:
Tipo de credencial:
Alcance:
Host autorizado:
Puerto autorizado:
Regla de firewall:
Responsable de rotación:
```

### Sesión 5: configurar TLS bajo supervisión

**Objetivo:** relacionar endpoint, certificados y plugin.

#### Esta práctica requiere un docente o administrador

No configures TLS en un host compartido sin supervisión.

#### Actividad

1. Confirma que los certificados fueron emitidos por el procedimiento del laboratorio.
2. Comprueba que las claves privadas están protegidas.
3. Añade la credencial al almacén autorizado.
4. Configura el cloud Docker con el endpoint indicado.
5. Activa la validación del certificado servidor.
6. Configura el certificado cliente si corresponde.
7. Ejecuta **Test Connection**.
8. Registra si la conexión fue aceptada.
9. No copies la clave privada en la documentación.

### Sesión 6: identificar la plantilla Docker

**Objetivo:** localizar los campos que determinan el agente.

#### Actividad

Completa con la configuración del laboratorio:

| Campo | Valor |
|---|---|
| Nombre del cloud | |
| Nombre de plantilla | |
| Etiqueta | |
| Imagen aprobada | |
| Sistema de archivos remoto | |
| Método de conexión | |
| Usuario del contenedor | |
| Política de eliminación | |

#### Preguntas

- ¿Qué campo consulta el `Jenkinsfile`?
- ¿Qué campo define el sistema base?
- ¿Qué campo debe coincidir con el home configurado?
- ¿Qué campo determina cómo se conecta el agente?

### Sesión 7: revisar el sistema de archivos remoto

**Objetivo:** comprobar que el contenedor puede escribir en el área del agente.

#### Ruta ilustrativa

```text
/home/jenkins
```

#### Instrucciones

1. Confirma que la ruta existe en la imagen.
2. Confirma cuál es el usuario efectivo.
3. Comprueba que el usuario puede escribir.
4. No cambies permisos con `chmod 777`.
5. No montes directorios del host sin autorización.
6. Registra la ruta configurada.

### Sesión 8: inspeccionar una imagen aprobada

**Objetivo:** verificar sistema operativo y herramientas.

#### Con permiso del docente

Ejecuta contenedores temporales solo con la imagen aprobada:

```bash
docker run --rm IMAGEN_APROBADA java -version
```

```bash
docker run --rm IMAGEN_APROBADA git --version
```

```bash
docker run --rm IMAGEN_APROBADA mvn --version
```

No ejecutes estos comandos contra una imagen de origen desconocido.

#### Registro

```text
Imagen:
Etiqueta o digest:
Java:
Git:
Maven:
Usuario:
Home:
Observaciones:
```

### Sesión 9: probar las rutas de herramientas

**Objetivo:** confirmar que Global Tools corresponde a la imagen.

#### Instrucciones

1. Consulta la herramienta Git configurada.
2. Comprueba la ruta dentro de la imagen.
3. Consulta Maven, si está configurado.
4. Comprueba `mvn --version`.
5. Compara la versión con la política del curso.
6. No modifiques herramientas globales sin autorización.

### Sesión 10: crear el Pipeline Job de prueba

**Objetivo:** solicitar un agente por etiqueta.

#### Jenkinsfile

```groovy
pipeline {
    agent {
        label 'docker-slave'
    }

    stages {
        stage('Verificación del agente') {
            steps {
                echo 'Jenkins asignó un agente con la etiqueta solicitada.'
                sh 'whoami'
                sh 'pwd'
                sh 'hostname'
            }
        }
    }

    post {
        success {
            echo 'La verificación básica terminó correctamente.'
        }

        failure {
            echo 'La verificación falló. Revisa la conexión y la imagen.'
        }

        always {
            echo "Resultado: ${currentBuild.currentResult}"
        }
    }
}
```

#### Instrucciones

1. Confirma que la plantilla tiene la etiqueta `docker-slave`.
2. Guarda el pipeline en la rama autorizada.
3. Inicia el job.
4. Observa la cola.
5. Busca mensajes de provisionamiento del contenedor.
6. Registra el nodo que ejecutó la etapa.
7. Comprueba `whoami`, `pwd` y `hostname`.
8. Registra el resultado.

### Sesión 11: verificar Java y el sistema operativo

**Objetivo:** comprobar las capacidades reales del agente.

Añade:

```groovy
stage('Sistema y Java') {
    steps {
        sh 'cat /etc/os-release'
        sh 'java -version'
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Identifica la distribución.
3. Identifica la versión de Java.
4. Compara con la imagen configurada.
5. Comprueba si el usuario esperado coincide.
6. No interpretes una versión de ejemplo como requisito universal.

### Sesión 12: comprobar Git y Maven

**Objetivo:** verificar herramientas del proyecto.

Añade solo las comprobaciones que la imagen de laboratorio deba incluir:

```groovy
stage('Git y Maven') {
    steps {
        sh 'git --version'
        sh 'mvn --version'
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline.
2. Si Git falla, verifica la imagen y Global Tools.
3. Si Maven falla, verifica si la imagen lo incluye.
4. Anota las versiones.
5. No instales paquetes durante la ejecución sin autorización.

### Sesión 13: comprobar la creación de un contenedor nuevo

**Objetivo:** observar el carácter efímero.

#### Instrucciones

1. Ejecuta el job una vez.
2. Anota el nombre del agente y hostname que se muestran.
3. Ejecuta el job de nuevo.
4. Compara ambos identificadores.
5. Revisa el log del plugin.
6. Comprueba con el docente que el contenedor anterior fue retirado.
7. No uses `docker rm` sobre recursos que no puedas identificar.

#### Preguntas

- ¿Qué evidencias sugieren que se creó un contenedor distinto?
- ¿Qué datos permanecen en Jenkins?
- ¿La imagen Docker también se elimina?
- ¿Qué efecto tendría un volumen persistente?

### Sesión 14: observar el log completo

**Objetivo:** interpretar el ciclo de vida de provisionamiento.

Busca mensajes que correspondan a:

- Espera en la cola.
- Solicitud de nodo.
- Creación del contenedor.
- Conexión del agente.
- Inicio de las etapas.
- Finalización del pipeline.
- Retirada del contenedor.

Los mensajes exactos cambian con plugin y versión.

No esperes que el texto coincida literalmente con una captura del curso.

### Sesión 15: probar un fallo de herramienta

**Objetivo:** diagnosticar un requisito ausente sin cambiar la imagen.

#### Instrucciones

1. Añade una etapa que invoque una herramienta conocida que no esté en la imagen, solo con aprobación del docente.
2. Ejecuta una vez.
3. Registra el mensaje y el resultado.
4. Comprueba si el agente se retira tras el fallo.
5. No instales la herramienta manualmente.
6. Propón si debe cambiarse la imagen o la etapa.

### Sesión 16: probar una imagen incompatible

**Objetivo:** comprender los requisitos de conexión del agente.

#### Actividad supervisada

1. El docente proporciona una imagen de prueba que no sea compatible con el agente.
2. Ejecuta el job de laboratorio.
3. Observa si el contenedor arranca.
4. Comprueba si Jenkins logra conectar el agente.
5. Registra el mensaje de error.
6. Cambia de nuevo a la imagen aprobada.

No uses imágenes aleatorias de Internet para esta prueba.

### Sesión 17: diagnosticar un fallo de conexión

**Objetivo:** separar red, TLS, daemon y plugin.

#### Procedimiento

1. Confirma que Jenkins apunta al host correcto.
2. Confirma el puerto configurado.
3. Confirma que Docker está activo.
4. Confirma la regla de firewall.
5. Confirma la credencial TLS o SSH.
6. Confirma que el certificado corresponde al host.
7. Revisa logs del daemon.
8. Revisa logs del plugin.
9. No abras el endpoint a toda la red como prueba.

### Sesión 18: comparar plantilla ligera y completa

**Objetivo:** relacionar tamaño de imagen con herramientas disponibles.

#### Antes de comparar

El docente debe aprobar ambas imágenes.

#### Registro

| Propiedad | Imagen ligera | Imagen completa |
|---|---|---|
| Tiempo de descarga | | |
| Java | | |
| Git | | |
| Maven | | |
| Tamaño aproximado | | |
| Usuario | | |
| Método de agente | | |

#### Preguntas

- ¿Qué herramientas hacen falta para el proyecto?
- ¿Qué herramientas sobran?
- ¿Qué impacto tiene una imagen más grande?
- ¿Qué evidencia de mantenimiento existe para cada imagen?

### Sesión 19: revisar configuración del usuario

**Objetivo:** distinguir el usuario del host del usuario del contenedor.

#### Instrucciones

1. Ejecuta `whoami` desde el pipeline.
2. Registra el usuario del contenedor.
3. Consulta con el docente si se necesita una cuenta en el host.
4. No cambies contraseñas.
5. No añadas usuarios al grupo `docker`.
6. Explica por qué ambos usuarios no tienen por qué coincidir.

### Sesión 20: recuperación y limpieza

**Objetivo:** comprender cómo retirar un agente tras una ejecución.

#### Instrucciones

1. Ejecuta el job exitosamente.
2. Revisa la salida de `post`.
3. Comprueba que el nodo temporal deja de estar conectado.
4. Confirma la política de eliminación.
5. Revisa si el host conserva la imagen en caché.
6. No borres imágenes para forzar limpieza.
7. Consulta al administrador si queda un contenedor huérfano.

### Sesión 21: modificar el pipeline para un proyecto Maven

**Objetivo:** solicitar Maven solo si la plantilla lo ofrece.

#### Requisitos

- Maven debe estar instalado o configurado en el agente.
- El proyecto debe tener un `pom.xml`.
- La versión del JDK debe ser compatible.
- El job debe usar una etiqueta de agente aprobada.

#### Ejemplo conceptual

```groovy
pipeline {
    agent {
        label 'docker-slave'
    }

    stages {
        stage('Verificar Maven') {
            steps {
                sh 'mvn --version'
            }
        }

        stage('Construcción') {
            steps {
                sh 'mvn -B -ntp test'
            }
        }
    }
}
```

Este ejemplo solo tiene sentido si el repositorio incluye un proyecto Maven y la imagen dispone de las herramientas necesarias.

### Sesión 22: revisar el uso de herramientas globales

**Objetivo:** comprobar si el nombre de herramienta se resuelve correctamente.

#### Actividad

1. Identifica el nombre configurado para Maven.
2. Comprueba si existe una instalación llamada `M3`.
3. Si existe, prueba una declaración `tools` compatible.
4. Revisa la consola para ver la ruta efectiva.
5. Confirma si Jenkins descarga Maven o utiliza la imagen.
6. No cambies la configuración global.

### Sesión 23: documentar la prueba de fuego

**Objetivo:** elaborar una evidencia reproducible.

#### Plantilla

```text
Job:
Número de ejecución:
Rama:
Commit:
Etiqueta solicitada:
Cloud:
Plantilla:
Imagen:
Sistema operativo:
Usuario:
Directorio de trabajo:
Java:
Git:
Maven:
Resultado:
Contenedor retirado:
Observaciones:
```

No registres claves, certificados privados ni direcciones que la política considere confidenciales.

### Sesión 24: revisión por pares

**Objetivo:** revisar la configuración antes de una entrega.

La persona autora explica:

- Qué host Docker se utiliza.
- Cómo se autentica Jenkins.
- Qué etiqueta solicita el pipeline.
- Qué imagen se usa.
- Cómo se conecta el agente.
- Qué evidencia demuestra la efimeridad.

La persona revisora comprueba:

- API sin exposición abierta.
- TLS o SSH, según la configuración.
- Credenciales almacenadas en Jenkins.
- Imagen confiable.
- Usuario no privilegiado cuando sea posible.
- Sistema de archivos remoto escribible.
- Herramientas presentes.
- Contenedor retirado al final.
- Ausencia de montajes peligrosos.

### Sesión 25: informe final

Entrega:

- Diagrama de arquitectura.
- Captura o descripción del cloud.
- Nombre de plantilla.
- Etiqueta utilizada.
- Imagen autorizada.
- Resultado de prueba de conexión.
- `Jenkinsfile` de verificación.
- Log resumido sin secretos.
- Evidencia de un agente creado y retirado.
- Análisis breve de seguridad.

---

## Diagnóstico y operación

Los fallos pueden originarse en Jenkins, Docker, red, imagen, plugin o pipeline.

### Jenkins no crea el contenedor

Comprueba:

- Que el pipeline solicita la etiqueta exacta.
- Que existe una plantilla con esa etiqueta.
- Que el cloud está habilitado.
- Que el plugin está activo.
- Que el host Docker es accesible.
- Que la autenticación funciona.
- Que el host tiene recursos disponibles.

### La ejecución espera indefinidamente

Puede ocurrir si:

- No hay agente con la etiqueta.
- El cloud está mal configurado.
- Docker no responde.
- El plugin no puede aprovisionar.
- La imagen no puede descargarse.
- El host está sin capacidad.
- La conexión del agente no termina de establecerse.

Revisa la cola y los logs antes de cambiar la configuración.

### Test Connection falla

Comprueba:

- URI y puerto.
- Dirección privada correcta.
- Estado del daemon.
- Regla de firewall.
- Método TLS o SSH.
- Certificados y cadena.
- Credencial asociada.
- Nombre del host del certificado.
- Diferencias de reloj.
- Compatibilidad del plugin.

No pruebes abriendo la API sin protección.

### Error de certificado

Comprueba:

- Fecha de caducidad.
- Autoridad certificadora.
- Nombre del host.
- Cadena completa.
- Certificado cliente.
- Clave asociada.
- Tipo de credencial.
- Ruta y permisos del servidor.

No desactives la verificación TLS para eliminar el error.

### Error de firewall

Comprueba la ruta de red y solicita una regla limitada.

La regla debería identificar origen, destino, puerto y protocolo.

No uses `allow` global como solución permanente.

### Docker no inicia después del cambio

Comprueba:

- Sintaxis de `daemon.json`.
- Argumentos de `dockerd`.
- Definición de `systemd`.
- Opciones repetidas.
- Rutas de certificados.
- Permisos.
- Logs de `journalctl`.

Restaura la configuración previa si no puedes validar el cambio.

### No se descarga la imagen

Comprueba:

- Nombre y etiqueta.
- Acceso al registro.
- DNS y conectividad.
- Límite de disco.
- Credenciales del registro, si son necesarias.
- Arquitectura de la imagen.
- Política del registro.

No imprimas credenciales del registro.

### Imagen descargada, agente sin conexión

La imagen puede arrancar, pero el agente no llegar a conectarse.

Comprueba:

- Java requerido.
- Proceso de agente.
- Configuración del método attach.
- Argumentos del plugin.
- Entrada o comando del contenedor.
- Usuario y permisos.
- Conectividad desde el contenedor hacia Jenkins.
- Compatibilidad de la versión de agente.

### Directorio remoto no escribible

Comprueba:

- Que el directorio existe.
- Usuario efectivo.
- UID/GID.
- Permisos.
- Montajes.
- Sistema de archivos de solo lectura.
- Correspondencia entre el home y la raíz remota.

No soluciones el problema con permisos universales como `777`.

### Falta Java

Comprueba:

- `java -version` dentro de la imagen.
- Java que requiere la versión de agente.
- Diferencia entre Java de agente y JDK del proyecto.
- Compatibilidad del plugin.
- Imagen configurada en la plantilla.

### Falta Git

Comprueba:

- `git --version`.
- Ruta de Git.
- Global Tools.
- Agente asignado.
- Instalación real dentro de la imagen.
- Plugin SCM.

### Falta Maven

Comprueba:

- `mvn --version`.
- Instalación configurada en Jenkins.
- Variable o ruta de Maven.
- JDK usado por Maven.
- Imagen real.
- Nombre de instalación solicitado por el pipeline.

### Error de checkout

Comprueba:

- Git en el agente.
- URL del repositorio.
- Rama.
- Credencial SCM autorizada.
- Certificados.
- Permisos.
- Resolución de DNS.

No imprimas tokens ni claves para diagnosticar.

### El contenedor no desaparece

Comprueba:

- Política de retención de la plantilla.
- Estado de la ejecución.
- Fallo de limpieza del plugin.
- Si se configuró retener contenedores para diagnóstico.
- Si el contenedor es realmente de esta ejecución.

Solicita al administrador que lo revise.

No elimines contenedores basándote solo en un nombre parecido.

### El contenedor desaparece, pero siguen existiendo datos

Comprueba:

- Volúmenes Docker.
- Bind mounts.
- Workspace compartido.
- Artefactos Jenkins.
- Caché de imágenes.
- Directorios de datos externos.

La eliminación del contenedor no elimina necesariamente esos recursos.

### Dos ejecuciones parecen compartir archivos

Comprueba:

- Workspaces compartidos.
- Volúmenes persistentes.
- Nombres de archivos fijos.
- Concurrencia.
- Stash o artefactos.
- Directorios montados desde el host.

Un contenedor distinto no garantiza que no exista un almacenamiento compartido.

### El hostname no cambia

El hostname puede estar configurado por el plugin o por la imagen.

No uses solo el hostname para demostrar que los contenedores son distintos.

Corrobora con logs del plugin o una identificación autorizada del contenedor.

### El pipeline funciona en agente estático, pero no en Docker

Compara:

- Sistema operativo.
- Java.
- Git.
- Maven.
- PATH.
- Usuario.
- Workspace.
- Certificados.
- Permisos.
- Arquitectura.
- Variables de entorno.

La diferencia entre agentes puede ser la causa principal.

### Método de diagnóstico

1. Identifica el número de ejecución.
2. Confirma la etiqueta solicitada.
3. Busca el evento de aprovisionamiento.
4. Comprueba el cloud y la plantilla.
5. Revisa el endpoint protegido.
6. Revisa el estado del daemon.
7. Comprueba imagen y arquitectura.
8. Comprueba el proceso del agente.
9. Comprueba la etapa y el comando.
10. Comprueba la retirada del contenedor.
11. Distingue datos del contenedor y datos persistentes.
12. Documenta la causa antes de modificar la configuración.

---

## Seguridad y buenas prácticas

El daemon Docker debe tratarse como una interfaz administrativa del host.

### No publicar Docker sin autenticación

No expongas la API en TCP sin TLS ni autenticación.

No la enlaces a todas las interfaces como solución rápida.

### No confiar solo en el firewall

El firewall reduce quién llega al endpoint.

No proporciona por sí solo autenticación ni cifrado.

Úsalo junto con un método autenticado aprobado.

### No usar contraseñas de laboratorio débiles

No configures:

```text
usuario: jenkins
contraseña: jenkins
```

Es una credencial débil y conocida. No la utilices en un host conectado a una red.

### No conceder acceso Docker sin revisar el impacto

El acceso al daemon puede permitir acciones con privilegios elevados sobre el host.

Antes de dar acceso:

- Identifica quién ejecutará jobs en ese cloud.
- Limita el acceso a las cuentas y jobs autorizados.
- Revisa el código que puede ejecutar esos jobs.
- Evita compartir el cloud con proyectos de confianza diferente.
- Comprueba cómo se revocan las credenciales.

### No montar el socket Docker en el agente

Evita montar el socket del host, por ejemplo:

```text
/var/run/docker.sock
```

dentro de un contenedor de build, salvo que exista una justificación aprobada y controles específicos.

Quien controle ese socket puede obtener capacidades muy elevadas sobre el host.

### No usar contenedores privilegiados sin necesidad

No habilites `privileged` para resolver problemas de permisos o de herramientas.

Investiga qué capacidad concreta requiere el trabajo y busca una solución con menos privilegios.

### Imágenes confiables

Utiliza imágenes:

- Aprobadas por el curso o la organización.
- Provenientes de un registro confiable.
- Con etiquetas versionadas.
- Mantenidas y actualizadas.
- Escaneadas según la política interna.
- Compatibles con el agente Jenkins.

No ejecutes imágenes aleatorias descargadas de Internet en el host compartido.

### Imagen y reproducibilidad

Una etiqueta mutable puede apuntar a contenidos distintos con el tiempo.

Documenta:

- Nombre de la imagen.
- Etiqueta o digest usado.
- Fecha de verificación.
- Versiones de herramientas.
- Procedimiento de actualización.

### No confundir limpieza con seguridad

Retirar el contenedor reduce residuos de ejecución, pero no elimina:

- Imágenes almacenadas.
- Volúmenes.
- Registros de consola.
- Artefactos de Jenkins.
- Datos persistentes.
- Credenciales filtradas en logs.

Revisa cada lugar por separado.

### Logs y datos sensibles

No imprimas:

- Claves privadas.
- Certificados con material secreto.
- Tokens.
- Contraseñas.
- Variables de entorno completas.
- Datos de conexión que la política considere restringidos.

En los informes de práctica, describe el método de conexión sin copiar credenciales ni claves.

### Credenciales de Jenkins

Si el cloud requiere certificados o claves:

- Guárdalos mediante el almacén de credenciales de Jenkins.
- Limita qué jobs y carpetas pueden utilizarlos.
- Evita incrustarlos en el `Jenkinsfile`.
- No los escribas en el workspace.
- No los copies a la imagen.
- Define un procedimiento de renovación y revocación.

### Seguridad de ramas y Jenkinsfiles

Una rama que modifica el `Jenkinsfile` puede cambiar lo que ejecuta el agente.

No concedas credenciales del cloud a código no revisado.

Aplica las reglas de confianza de la organización a:

- Pull requests externos.
- Ramas de prueba.
- Jobs de forks.
- Bibliotecas compartidas.
- Jobs que ejecutan código de terceros.

### Separar nubes por nivel de confianza

Si una organización tiene jobs con distintos niveles de confianza, puede ser necesario separar:

- Clouds.
- Agentes.
- Credenciales.
- Hosts Docker.
- Redes.
- Permisos de jobs.

La separación debe diseñarla y administrarla el equipo responsable.

### Actualizaciones

Mantén un proceso controlado para actualizar:

- Jenkins.
- Plugins.
- Docker Engine.
- Imágenes de agentes.
- Java.
- Git.
- Maven.

Prueba los cambios en un entorno de laboratorio antes de aplicarlos a servicios compartidos.

### Capacidad y límites

Define límites apropiados de:

- Número de contenedores simultáneos.
- CPU.
- Memoria.
- Espacio temporal.
- Tiempo de ejecución.
- Descargas de imágenes.

Un host Docker sin límites puede quedarse sin recursos si Jenkins lanza demasiadas tareas en paralelo.

### No eliminar recursos en bloque

Evita comandos de limpieza general que puedan borrar contenedores, volúmenes o imágenes ajenos al job.

Identifica el recurso y la ejecución antes de solicitar su eliminación.

En un host compartido, la limpieza corresponde a la política del administrador.

---

## Buenas prácticas de operación

Una configuración correcta también necesita una forma clara de observarla y mantenerla.

### Mantener un inventario

Documenta, sin incluir secretos:

- Nombre del cloud.
- Host o alias autorizado.
- Método de conexión.
- Etiquetas.
- Imágenes permitidas.
- Herramientas disponibles.
- Responsable del host.
- Procedimiento de incidencias.

### Revisar los logs del plugin

Los logs del plugin ayudan a distinguir:

- Solicitud de un agente.
- Conexión al daemon.
- Creación del contenedor.
- Inicio del agente.
- Fallo de conexión.
- Retirada del contenedor.

Los mensajes exactos varían por versión.

### Evitar publicar logs completos

Antes de compartir una consola o un log:

- Revisa si contiene direcciones restringidas.
- Revisa posibles credenciales.
- Elimina datos personales innecesarios.
- Conserva los mensajes necesarios para diagnosticar.

### Nombres coherentes

Usa nombres que indiquen propósito y entorno:

```text
docker-laboratorio
agent-java-lab
docker-slave
```

Evita nombres que expongan información confidencial o generen confusión.

### Etiquetas específicas

Una etiqueta precisa reduce la posibilidad de asignar un job a un agente equivocado.

Por ejemplo:

```text
docker-slave
```

puede bastar en un laboratorio pequeño.

En un entorno con varias imágenes, conviene distinguir las capacidades de forma deliberada.

### No abusar de las etiquetas

Una etiqueta no valida:

- La seguridad de la imagen.
- La disponibilidad de una herramienta.
- La capacidad de memoria.
- La confianza del código.
- La protección del endpoint.

Es un mecanismo de selección, no una política de seguridad completa.

### Separar capacidades por imagen

Una imagen para un proyecto Java puede incluir Java y Maven.

Otra imagen para tareas de documentación puede ser más pequeña.

Evita crear una imagen enorme que contenga herramientas innecesarias para todos los jobs.

### Preparar las imágenes fuera del build

Es preferible construir, probar y publicar imágenes de agente mediante un proceso controlado.

No instales dependencias de sistema en cada ejecución de un job si eso genera variaciones o ralentiza el host.

### Mantener las imágenes actualizadas

La reproducibilidad no significa congelar una imagen vulnerable para siempre.

Define una política que incluya:

- Revisión de actualizaciones.
- Evaluación de compatibilidad.
- Pruebas de la nueva imagen.
- Cambio versionado.
- Plan de reversión.

### Reducir la duración de la vida del contenedor

El contenedor debería existir solo el tiempo necesario para la ejecución.

Si se conserva para diagnóstico:

- Limita su tiempo de retención.
- Anota quién puede acceder.
- Elimina datos sensibles.
- Documenta cómo se retirará.

### Observar recursos

Controla las métricas y alertas de:

- Memoria.
- CPU.
- Almacenamiento.
- Espacio de imágenes.
- Número de contenedores.
- Tiempo de provisionamiento.
- Errores de conexión.

### Evitar cambios manuales no registrados

Una modificación manual en Jenkins o en el host puede desaparecer durante una actualización o no reproducirse en otro entorno.

Registra cambios según la política de configuración de la organización.

### Versionar la configuración cuando sea apropiado

La gestión como código puede facilitar revisión y reproducción.

No guardes en el repositorio:

- Claves privadas.
- Contraseñas.
- Certificados privados.
- Tokens.
- Direcciones restringidas que la política prohíba publicar.

### Probar un cambio de imagen de forma controlada

Antes de reemplazar una imagen:

1. Revisa su procedencia.
2. Comprueba las versiones incluidas.
3. Prueba el método de conexión.
4. Ejecuta un pipeline mínimo.
5. Ejecuta el proyecto real de laboratorio.
6. Comprueba la limpieza.
7. Documenta los resultados.
8. Define cómo volver a la imagen anterior.

### Mantener un agente alternativo

En algunos entornos se necesita una alternativa temporal si el cloud Docker está indisponible.

Esa alternativa debe estar aprobada y ofrecer condiciones de seguridad comparables.

No cambies de agente a uno con permisos mayores para evitar un error de conexión.

---

## Checklist de configuración

Usa esta lista antes de declarar que el laboratorio está listo.

### Host Docker

- [ ] El host es de laboratorio o está autorizado.
- [ ] Docker está instalado y funciona.
- [ ] Se ha identificado la interfaz privada correcta.
- [ ] El daemon no está publicado sin protección.
- [ ] La API utiliza un método de autenticación aprobado.
- [ ] La conexión usa cifrado cuando corresponde.
- [ ] El firewall limita el acceso a los orígenes autorizados.
- [ ] Los cambios de `systemd` y Docker están documentados.
- [ ] Existe un plan de reversión.
- [ ] No se modificaron permisos de forma amplia.

### Usuario y permisos

- [ ] No se usa la contraseña débil `jenkins`.
- [ ] No se creó una cuenta del sistema sin una necesidad definida.
- [ ] No se añadió un usuario al grupo `docker` sin autorización.
- [ ] El proceso del contenedor usa un usuario adecuado.
- [ ] El directorio de trabajo es escribible sin permisos excesivos.
- [ ] No se montó el socket Docker del host dentro del agente.

### Jenkins

- [ ] El plugin Docker está instalado y es compatible.
- [ ] El cloud apunta al host correcto.
- [ ] La conexión utiliza el método seguro aprobado.
- [ ] Las credenciales están en el almacén de Jenkins.
- [ ] La prueba de conexión funciona.
- [ ] La etiqueta está escrita correctamente.
- [ ] El nombre del cloud y la plantilla son reconocibles.
- [ ] Los permisos de uso están limitados.

### Plantilla e imagen

- [ ] La imagen está aprobada.
- [ ] La etiqueta o digest está documentado.
- [ ] La imagen incluye Java compatible con el agente.
- [ ] El método “Attach Docker container” funciona con la imagen.
- [ ] El usuario y el directorio remoto son correctos.
- [ ] Git está disponible si el job requiere checkout en el agente.
- [ ] Maven está disponible si el proyecto lo requiere.
- [ ] Las rutas de herramientas se han comprobado dentro de la imagen.
- [ ] No se habilitó `privileged` sin justificación.
- [ ] La política de eliminación del contenedor es conocida.

### Pipeline

- [ ] El `Jenkinsfile` solicita la etiqueta de la plantilla.
- [ ] El pipeline utiliza un agente efímero previsto.
- [ ] Las herramientas se comprueban desde el contenedor.
- [ ] El resultado se interpreta con los códigos de salida adecuados.
- [ ] Hay un límite de tiempo razonable.
- [ ] Las acciones posteriores no ocultan los fallos.
- [ ] No se imprimen secretos.
- [ ] La ejecución se probó en éxito y fallo controlado.

### Limpieza y observabilidad

- [ ] Los logs permiten identificar el ciclo de vida del agente.
- [ ] El agente deja de estar conectado al acabar.
- [ ] El contenedor se retira según la política.
- [ ] Se sabe qué datos pueden persistir en volúmenes o artefactos.
- [ ] No se borran recursos de otros jobs.
- [ ] La retención de imágenes y artefactos está documentada.

---

## Lista de diagnóstico rápida

Cuando falle una ejecución, recorre esta lista en orden.

### La tarea espera en cola

- ¿La etiqueta existe?
- ¿La etiqueta coincide exactamente?
- ¿El cloud está habilitado?
- ¿Hay una plantilla asociada?
- ¿El host Docker está disponible?
- ¿Se alcanzó el límite de agentes?

### No se puede conectar con Docker

- ¿La URI apunta al host correcto?
- ¿El puerto está permitido?
- ¿Docker está activo?
- ¿La conexión usa el método de autenticación correcto?
- ¿Los certificados son válidos?
- ¿El firewall permite solo el origen autorizado?
- ¿El plugin admite esta configuración?

### Docker crea el contenedor, pero Jenkins no conecta

- ¿La imagen contiene Java compatible?
- ¿Se inicia el proceso adecuado?
- ¿El método de conexión es el esperado?
- ¿El contenedor puede alcanzar Jenkins?
- ¿El usuario puede escribir en el directorio remoto?
- ¿La imagen mantiene vivo el proceso de agente?

### El agente conecta, pero faltan herramientas

- ¿La herramienta está en la imagen?
- ¿La ruta de Global Tools es correcta?
- ¿Se usa el agente esperado?
- ¿La herramienta corresponde a esa distribución?
- ¿El pipeline invoca el nombre correcto?

### El job funciona en otra máquina, pero no aquí

- Compara versiones de Docker.
- Compara versión del plugin.
- Compara imagen y digest.
- Compara Java y herramientas.
- Compara permisos y entorno.
- Compara reglas de red.
- Compara el `Jenkinsfile` y el commit.

### El contenedor queda activo

- ¿La plantilla lo conserva para diagnóstico?
- ¿El build sigue ejecutándose?
- ¿Falló el paso de limpieza?
- ¿El contenedor pertenece a esta ejecución?
- ¿Hay una incidencia registrada?
- ¿Debe intervenir el administrador?

### El host queda sin espacio

- Comprueba uso de disco e imágenes según el procedimiento autorizado.
- Identifica quién administra la limpieza.
- No borres imágenes o volúmenes en bloque.
- Revisa si los contenedores de agente se están retirando.
- Revisa la política de caché y retención.

---

## Evaluación

La evaluación debe comprobar que el alumnado entiende el ciclo de vida y no solo que el pipeline termina en verde.

### Evidencias mínimas

Entrega:

- Diagrama de arquitectura.
- Nombre de cloud y plantilla.
- Etiqueta solicitada.
- Imagen de agente autorizada.
- Método de conexión descrito sin secretos.
- `Jenkinsfile` de verificación.
- Salida de `whoami`, `pwd` y `hostname`.
- Comprobación de Java.
- Resultado de conexión.
- Evidencia del ciclo de creación y retirada.
- Informe de diagnóstico de un fallo controlado.

### Criterios de evaluación

| Criterio | Básico | Adecuado | Avanzado |
|---|---|---|---|
| Arquitectura | Identifica algunos componentes | Explica el flujo completo | Explica límites y confianza |
| Conexión | Comprueba el endpoint | Usa el método aprobado | Justifica controles de red y credenciales |
| Plantilla | Configura etiqueta e imagen | Verifica usuario y raíz remota | Revisa compatibilidad y mantenimiento |
| Pipeline | Solicita la etiqueta | Verifica herramientas y entorno | Diagnostica fallo y limpieza |
| Seguridad | Evita secretos en el Jenkinsfile | No expone Docker sin protección | Explica privilegios y amenazas |
| Operación | Ejecuta una prueba | Comprueba el ciclo de vida | Documenta capacidad y retención |

### Preguntas de evaluación

1. ¿Qué diferencia hay entre el controlador Jenkins y el agente?
2. ¿Qué componente crea el contenedor?
3. ¿Qué debe coincidir entre la plantilla y el `Jenkinsfile`?
4. ¿Qué significa “efímero” en esta práctica?
5. ¿Qué datos pueden permanecer aunque se retire el contenedor?
6. ¿Por qué no es seguro exponer Docker TCP sin autenticación?
7. ¿Qué implica que Docker escuche en `0.0.0.0`?
8. ¿Por qué cambiar el puerto no protege la API?
9. ¿Qué función cumple TLS mutuo?
10. ¿Qué debe comprobarse en la imagen del agente?
11. ¿Por qué `/home/jenkins` debe corresponder con la configuración de la imagen?
12. ¿Qué hace el método “Attach Docker container”?
13. ¿Por qué el agente necesita Java?
14. ¿Por qué Git puede ser necesario en el agente?
15. ¿Qué diferencia hay entre Java del agente y JDK del proyecto?
16. ¿Qué significa la etiqueta `docker-slave`?
17. ¿Cómo comprobarías si el job se ejecutó dentro del contenedor?
18. ¿Qué demuestra `whoami` y qué no demuestra?
19. ¿Qué revisarías si Docker crea el contenedor, pero el agente no conecta?
20. ¿Por qué no se debe montar el socket Docker en el agente sin autorización?

### Ejercicio de revisión

Revisa esta configuración conceptual:

```text
Docker Host URI: tcp://0.0.0.0:4243
Firewall: permite cualquier origen
Autenticación: ninguna
Imagen: latest
Contenedor: privileged
Montaje: /var/run/docker.sock
```

Identifica al menos cinco riesgos.

Propón cambios que reduzcan la exposición sin modificar el entorno compartido.

No ejecutes la configuración.

### Respuestas orientativas del ejercicio

- `0.0.0.0` expone el servicio en todas las interfaces.
- No hay autenticación ni cifrado.
- El firewall permite el acceso desde cualquier origen.
- `latest` puede cambiar sin revisión.
- `privileged` concede capacidades excesivas.
- El socket Docker expone el daemon del host.
- No se describe ninguna política de credenciales.
- No existe aislamiento suficiente entre jobs.

Una versión más segura debería usar un endpoint restringido y autenticado, una imagen revisada, privilegios mínimos y una política aprobada para el acceso al daemon.

---

## Glosario

- **Agente:** nodo o proceso donde Jenkins ejecuta tareas.
- **Agente efímero:** agente creado para una ejecución o periodo breve y retirado según la política.
- **Cloud Docker:** configuración de Jenkins que permite aprovisionar agentes mediante Docker.
- **Contenedor:** entorno de ejecución basado en una imagen y que comparte el kernel del host.
- **Controlador Jenkins:** componente que coordina jobs, colas y agentes.
- **Daemon Docker:** servicio que recibe solicitudes para gestionar imágenes y contenedores.
- **Docker Host URI:** dirección que usa el plugin para comunicarse con Docker.
- **Etiqueta:** selector que permite a un pipeline solicitar un tipo de agente.
- **Imagen:** plantilla de solo lectura a partir de la cual se crea un contenedor.
- **Plantilla de agente:** configuración que define imagen, etiqueta y propiedades del agente.
- **Remote File System Root:** directorio del sistema remoto que Jenkins usa como raíz del agente o del workspace, según la configuración.
- **TLS:** protocolo que permite proteger una conexión con cifrado y autenticación.
- **TLS mutuo:** configuración en la que cliente y servidor se autentican mediante certificados.
- **Socket Unix:** interfaz local de comunicación entre procesos en un sistema Unix.
- **Workspace:** directorio donde Jenkins ejecuta y organiza el trabajo del job.
- **Volumen:** mecanismo de almacenamiento que puede conservar datos fuera del ciclo de vida del contenedor.
- **Bind mount:** montaje de una ruta del host dentro del contenedor.
- **`systemd`:** sistema de inicialización y gestión de servicios común en muchas distribuciones Linux.
- **UID/GID:** identificadores numéricos de usuario y grupo usados por el sistema.
- **Agente de confianza:** agente autorizado para ejecutar código que puede recibir determinados permisos.
- **Efímero:** creado para un uso temporal, aunque otros datos asociados puedan persistir.
- **API Docker:** interfaz de administración de Docker Engine.
- **Socket Docker:** interfaz local o remota que permite gestionar el daemon.
- **Digest:** identificador inmutable de una imagen por su contenido.
- **`systemctl`:** herramienta para consultar y gestionar servicios `systemd`.

---

## Síntesis

La práctica configura Jenkins para solicitar agentes en contenedores Docker temporales. La cadena completa incluye el controlador, el plugin, un endpoint Docker protegido, una imagen compatible, una plantilla con etiqueta y un pipeline que pide ese agente.

Los puntos esenciales son:

- La etiqueta del `Jenkinsfile` debe coincidir con la plantilla.
- La imagen debe incluir el proceso de agente y las herramientas necesarias.
- El directorio remoto debe existir y ser escribible por el usuario correcto.
- Git, Java y Maven deben verificarse dentro del agente real.
- El método “Attach Docker container” evita necesitar SSH dentro del contenedor en los escenarios compatibles, pero no elimina los requisitos del agente.
- La API Docker es privilegiada; no la expongas por TCP sin autenticación y protección.
- `0.0.0.0` no es una opción segura por defecto.
- La contraseña `jenkins` no es apropiada.
- Eliminar el contenedor no elimina necesariamente imágenes, volúmenes, artefactos o logs.
- La efimeridad reduce residuos, pero no reemplaza controles de seguridad, revisión de imágenes ni políticas de acceso.