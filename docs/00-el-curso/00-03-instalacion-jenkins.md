# Instalación de Jenkins en Ubuntu 24.04.5 LTS

Esta guía instala **Jenkins LTS** en Ubuntu 24.04.5 LTS mediante el repositorio oficial de paquetes de Jenkins. Incluye comprobaciones, ejemplos de sesión y ejercicios para que puedas verificar cada paso en el entorno de prácticas.

Los comandos están pensados para ejecutarse en una terminal con un usuario que pueda utilizar `sudo`. Jenkins se administra desde el navegador y, por defecto, escucha en el puerto **8080**.

## Objetivos

Al completar esta práctica, podrás:

- Comprobar la versión de Ubuntu y preparar el sistema.
- Instalar Java, requisito de ejecución de Jenkins.
- Añadir el repositorio oficial de Jenkins e instalar la versión LTS.
- Comprobar el estado del servicio.
- Abrir la interfaz web, completar el asistente inicial y acceder a Jenkins.
- Identificar algunos comandos útiles para diagnosticar problemas.

## Requisitos

Antes de empezar, prepara un entorno de laboratorio con:

- Ubuntu 24.04.5 LTS instalado.
- Acceso a una cuenta de usuario con permisos `sudo`.
- Conexión a Internet.
- Un navegador web desde el equipo Ubuntu o desde otro equipo que pueda acceder a él.
- Como referencia para las prácticas, una máquina virtual con **2 CPU y 4 GB de memoria RAM**. Las necesidades reales dependen de los jobs, plugins y cargas de trabajo que se ejecuten.

!!! warning "Utiliza un entorno de prácticas"
    Sigue esta guía en una máquina de laboratorio. No expongas Jenkins directamente a Internet ni utilices credenciales reales en los ejercicios.

## 1. Comprobar Ubuntu y actualizar los paquetes

Primero verifica la versión del sistema operativo y aplica las actualizaciones disponibles.

### Sesión de terminal

```console
 lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.5 LTS
Release:        24.04
Codename:       noble
```

El texto exacto puede variar ligeramente. Lo importante es confirmar que el sistema corresponde a Ubuntu 24.04 LTS.

Actualiza el índice de paquetes e instala las actualizaciones:

```console
 sudo apt update
 sudo apt upgrade -y
```

Es posible que Ubuntu solicite la contraseña del usuario. Al escribirla, la terminal no mostrará caracteres; es el comportamiento habitual.

Reinicia el sistema si la actualización lo requiere:

```console
 sudo reboot
```

### Comprobación

Después del reinicio, abre una terminal y comprueba que puedes volver a iniciar sesión:

```console
 whoami
alumno
```

## 2. Instalar Java

Jenkins necesita Java para ejecutarse. En esta guía se instala **OpenJDK 21**, disponible en Ubuntu 24.04.

### Instalar el entorno de ejecución

```console
 sudo apt install -y fontconfig openjdk-21-jre
```

Comprueba la versión instalada:

```console
 java -version
openjdk version "21..."
```

La salida incluirá información adicional sobre la versión y el fabricante de Java.

### Si Java no se encuentra

Si el comando `java` no existe, revisa que la instalación haya terminado correctamente:

```console
 dpkg -l openjdk-21-jre
```

También puedes comprobar qué ejecutable utiliza la terminal:

```console
 which java
/usr/bin/java
```

!!! note "Compatibilidad de Java"
    Jenkins actualiza periódicamente sus requisitos de Java. Antes de instalarlo en otro entorno, comprueba la versión requerida por la versión LTS que vas a utilizar en la documentación oficial de Jenkins.

!!! node "Si ya existe un Java instalado"
    Por si ya existe un Java instalado, podéis seleccionar el Java por defecto con este comando `sudo update-alternatives --config java`

## 3. Añadir el repositorio oficial de Jenkins

Se utilizará el repositorio de paquetes **LTS** de Jenkins, en lugar de descargar un paquete manualmente. Así, Jenkins podrá actualizarse mediante el sistema habitual de paquetes de Ubuntu.

### Instalar herramientas necesarias

```console
 sudo apt install -y curl gnupg
```

Crea el directorio para almacenar claves de repositorios:

```console
 sudo install -d -m 0755 /etc/apt/keyrings
```

Descarga la clave de firma del repositorio oficial:

```console
 sudo curl -fsSL \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key \
  -o /etc/apt/keyrings/jenkins-keyring.asc
```

Añade el repositorio LTS:

```console
 echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Actualiza la lista de paquetes para incluir Jenkins:

```console
 sudo apt update
```

### Comprobar que Ubuntu encuentra Jenkins

```console
 apt policy jenkins
```

La salida debe mostrar información sobre el paquete `jenkins` y una versión candidata. Si no aparece ninguna versión candidata, revisa la URL del repositorio y la salida de `sudo apt update`.

## 4. Instalar Jenkins LTS

Instala Jenkins utilizando `apt`:

```console
 sudo apt install -y jenkins
```

El paquete configura un servicio de `systemd`. Comprueba su estado:

```console
 sudo systemctl status jenkins
```

Busca una línea similar a:

```text
Active: active (running)
```

Pulsa `q` para salir de la vista de estado.

### Habilitar el inicio automático

El paquete suele iniciar y habilitar el servicio durante la instalación. Puedes verificarlo explícitamente con:

```console
 sudo systemctl enable --now jenkins
```

Comprueba el estado otra vez:

```console
 systemctl is-active jenkins
active
```

Y confirma que se iniciará automáticamente al arrancar el sistema:

```console
 systemctl is-enabled jenkins
enabled
```

### Comprobar el puerto de escucha

Jenkins utiliza el puerto TCP **8080** de forma predeterminada:

```console
 sudo ss -ltnp | grep 8080
```

Si el servicio está funcionando, deberías ver una entrada asociada al puerto `8080`. La salida concreta depende del sistema.

## 5. Acceder a la interfaz web

Desde un navegador en la misma máquina, abre:

```text
http://localhost:8080
```

Si accedes desde otro equipo de la red, utiliza la dirección IP de la máquina Ubuntu:

```text
http://DIRECCION_IP_DEL_SERVIDOR:8080
```

Para consultar las direcciones IP disponibles:

```console
 hostname -I
192.168.1.50
```

En este ejemplo, desde otro equipo de la misma red se accedería a `http://192.168.1.50:8080`.

!!! warning "Acceso desde la red"
    No abras el puerto 8080 a toda Internet. En un laboratorio, limita el acceso a la red de prácticas o accede mediante una VPN o túnel seguro, según las indicaciones del instructor.

## 6. Completar el asistente inicial

La primera vez que abras Jenkins, aparecerá la pantalla de desbloqueo.

### Obtener la contraseña inicial

En una terminal del servidor, ejecuta:

```console
 sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copia el valor mostrado e introdúcelo en la página de Jenkins.

La contraseña inicial es un secreto temporal de configuración. **No la publiques ni la compartas** en capturas, repositorios o documentos.

### Instalar plugins iniciales

El asistente ofrece dos opciones:

- **Instalar los plugins sugeridos:** opción recomendada para iniciar el curso.
- **Seleccionar plugins:** permite elegirlos manualmente; úsala solo si la práctica lo requiere.

Espera a que termine la instalación antes de cerrar la página. La duración dependerá de la conexión y del rendimiento de la máquina.

### Crear el usuario administrador

Crea una cuenta personal para el laboratorio. Utiliza una contraseña propia de pruebas y no reutilices contraseñas de otros servicios.

Completa también la configuración de la URL de Jenkins. En un laboratorio local, puedes conservar la dirección propuesta si es correcta para el entorno desde el que accederás.

Al terminar el asistente, Jenkins mostrará su página principal.

## 7. Verificar la instalación

Una vez dentro de Jenkins, comprueba que puedes navegar por la interfaz y que el servicio continúa funcionando.

### Comprobación desde la terminal

```console
 sudo systemctl is-active jenkins
active
```

Consulta la versión del paquete instalado:

```console
 apt policy jenkins
```

Comprueba que la interfaz web responde desde la máquina Ubuntu:

```console
 curl -I http://localhost:8080
```

Una respuesta HTTP como `200`, `403` o una redirección indica que hay un servicio web respondiendo. El código exacto puede variar según la pantalla o configuración de Jenkins.

## 8. Comandos útiles para administrar Jenkins

Estos comandos permiten consultar el servicio y revisar sus registros durante las prácticas.

### Consultar el estado

```console
 sudo systemctl status jenkins
```

### Iniciar, detener o reiniciar Jenkins

```console
 sudo systemctl start jenkins
 sudo systemctl stop jenkins
 sudo systemctl restart jenkins
```

Después de reiniciar el servicio, espera unos segundos y vuelve a abrir la página en el navegador.

### Consultar los registros recientes

```console
 sudo journalctl -u jenkins -n 50 --no-pager
```

Para seguir los registros en tiempo real:

```console
 sudo journalctl -u jenkins -f
```

Pulsa `Ctrl+C` para dejar de seguir el registro.

## 9. Prácticas para el alumnado

Realiza estas actividades después de completar la instalación. Anota los resultados en tu cuaderno de prácticas.

### Práctica 1: identificar el entorno

Ejecuta los comandos y registra la versión de Ubuntu, la versión de Java y la dirección IP del servidor:

```console
 lsb_release -a
 java -version
 hostname -I
```

**Resultado esperado:** identificar qué sistema operativo y versión de Java utiliza el laboratorio, y qué dirección usar para acceder a Jenkins desde otro equipo de la red.

### Práctica 2: comprobar el estado del servicio

Ejecuta:

```console
 systemctl is-active jenkins
 systemctl is-enabled jenkins
```

**Resultado esperado:** el servicio aparece como activo y habilitado para iniciarse con el sistema.

### Práctica 3: reiniciar Jenkins y revisar los registros

```console
 sudo systemctl restart jenkins
 sudo systemctl status jenkins
 sudo journalctl -u jenkins -n 20 --no-pager
```

**Resultado esperado:** Jenkins vuelve a estar activo después del reinicio. Identifica en los registros cualquier mensaje informativo o error.

### Práctica 4: acceder desde otro equipo

1. Ejecuta `hostname -I` en el servidor Ubuntu.
2. Anota la dirección IP correspondiente a la red del laboratorio.
3. Desde otro equipo de esa misma red, abre `http://DIRECCION_IP:8080`.
4. Comprueba que aparece la página de inicio de sesión de Jenkins.

**Resultado esperado:** acceder a la interfaz sin exponer el servicio a redes públicas.

## 10. Solución de problemas

Si Jenkins no inicia o no puedes acceder a la interfaz, revisa estos puntos en orden.

### El servicio no está activo

Comprueba el estado y los registros:

```console
 sudo systemctl status jenkins
 sudo journalctl -u jenkins -n 100 --no-pager
```

Verifica también que Java está disponible:

```console
 java -version
```

### El navegador no puede abrir la página

Comprueba que el servicio está activo:

```console
 sudo systemctl is-active jenkins
```

Comprueba si el puerto 8080 está escuchando:

```console
 sudo ss -ltnp | grep 8080
```

Si accedes desde otro equipo, verifica que:

- Ambos equipos pueden comunicarse por la red.
- Estás utilizando la dirección IP del servidor Ubuntu, no `localhost`.
- La red o el firewall del laboratorio permiten el tráfico al puerto TCP 8080.

### APT no encuentra el paquete

Actualiza la información de paquetes y revisa la configuración del repositorio:

```console
 sudo apt update
 cat /etc/apt/sources.list.d/jenkins.list
```

El archivo debe apuntar al repositorio LTS de Jenkins. Si `apt update` muestra errores de clave o de conexión, consulta la documentación oficial para confirmar la configuración vigente.

### Jenkins tarda en iniciar

Un primer inicio puede tardar mientras Jenkins termina la configuración y carga los plugins. Consulta los registros para distinguir una demora de un fallo:

```console
 sudo journalctl -u jenkins -f
```

## 11. Limpieza y seguridad del laboratorio

Jenkins permite ejecutar comandos y acceder a recursos del sistema según los permisos de su configuración. Por eso, durante el curso:

- Utiliza una máquina virtual o un entorno aislado.
- No uses contraseñas reutilizadas ni secretos reales en ejercicios.
- No publiques la contraseña inicial ni credenciales de Jenkins.
- No expongas el puerto 8080 directamente a Internet.
- Revisa cuidadosamente los comandos de pipelines antes de ejecutarlos.
- Limita los permisos de los usuarios y agentes en prácticas compartidas.

!!! note "Acerca de los cambios del sistema"
    La instalación añade el repositorio y la clave de firma de Jenkins, instala paquetes y crea un servicio del sistema. No ejecutes la práctica en una máquina administrada sin autorización.

## 12. Referencias

Para consultar instrucciones actualizadas y ampliar la información, utiliza la documentación oficial:

- [Instalación de Jenkins en Linux](https://www.jenkins.io/doc/book/installing/linux/)
- [Guía de instalación de Jenkins](https://www.jenkins.io/doc/book/installing/)
- [Requisitos de Java de Jenkins](https://www.jenkins.io/doc/book/platform-information/support-policy-java/)
- [Documentación de Ubuntu](https://help.ubuntu.com/)

Los procedimientos y requisitos pueden cambiar entre versiones. Si una instrucción de esta página difiere de la documentación oficial vigente, sigue la documentación correspondiente a la versión de Jenkins utilizada en el curso.