# Preparación del entorno para Terraform

Esta práctica prepara un entorno de trabajo para aprender Terraform de forma segura y reproducible. El alumnado verificará las herramientas básicas, organizará un proyecto local, instalará Terraform mediante un método aprobado, revisará la configuración y ejecutará comprobaciones sin conectarse a un proveedor cloud ni modificar infraestructura remota.

El objetivo es dejar el entorno listo para las prácticas posteriores, no configurar una cuenta de producción. Las versiones, los sistemas operativos y las políticas del aula pueden variar: sigue las instrucciones del docente cuando difieran de esta guía.

> **Límite de seguridad:** no introduzcas claves, tokens o contraseñas en archivos del proyecto. No configures credenciales cloud, backends compartidos ni proveedores de producción para completar las sesiones. No ejecutes `terraform apply` ni `terraform destroy` en una cuenta real.

---

## Objetivos y alcance

La preparación del entorno reduce problemas de herramientas antes de comenzar a trabajar con configuraciones Terraform.

### Resultados de aprendizaje

Al completar esta práctica, podrás:

- Identificar el sistema operativo y la terminal que utilizarás.
- Comprobar si Terraform ya está instalado.
- Instalar Terraform mediante un método autorizado.
- Verificar la versión y la ruta del ejecutable.
- Comprobar que Git funciona.
- Crear un directorio de trabajo aislado.
- Crear una estructura inicial de proyecto.
- Distinguir archivos fuente de archivos temporales.
- Preparar un `.gitignore` razonable.
- Ejecutar `terraform fmt`.
- Ejecutar `terraform init` en modo local de laboratorio.
- Ejecutar `terraform validate`.
- Ejecutar un `terraform plan` con una configuración local de prueba.
- Reconocer que un plan puede contener información sensible.
- Distinguir un equipo local de un agente Jenkins.
- Identificar errores de `PATH`, permisos, versión y red.
- Documentar el entorno sin publicar información personal o secretos.
- Explicar qué herramientas no hacen falta para esta práctica.

### Qué se preparará

El entorno incluirá, según la modalidad del curso:

- Terraform CLI.
- Git.
- Una terminal.
- Un editor de texto.
- Un directorio local de laboratorio.
- Una configuración Terraform sin proveedor cloud.
- Una cuenta o repositorio de laboratorio, si se usa Git remoto.
- Un agente Jenkins con Terraform, si el curso incluye CI.

### Qué queda fuera

Esta preparación no:

- Crea recursos en AWS, Azure, Google Cloud u otro proveedor.
- Configura credenciales cloud.
- Configura un backend de producción.
- Instala herramientas en un servidor compartido sin autorización.
- Modifica cuentas o permisos del sistema.
- Ejecuta cambios de infraestructura.
- Configura Terraform Enterprise u otra plataforma de gestión remota.
- Define una arquitectura cloud.
- Reemplaza la política del aula o de la organización.

### Requisitos previos

Se recomienda tener:

- Acceso autorizado al equipo de laboratorio.
- Una cuenta de usuario propia.
- Permiso para crear archivos en el directorio de trabajo.
- Acceso a una terminal.
- Git instalado o disponible en el aula.
- Una conexión a Internet autorizada para obtener herramientas, si hace falta.
- Acceso a un repositorio de práctica, si el curso lo utiliza.
- Un método para pedir ayuda al docente.

### Antes de instalar

No instales herramientas de forma improvisada.

Antes de cambiar el sistema:

- Comprueba si Terraform ya está instalado.
- Pregunta qué versión necesita el curso.
- Confirma si el equipo es personal o compartido.
- Comprueba si el centro ofrece una imagen de laboratorio.
- Averigua si se deben utilizar paquetes aprobados.
- Revisa si necesitas privilegios administrativos.
- No descargues binarios desde fuentes no verificadas.
- No desactives controles del sistema para facilitar una instalación.

### Diferencias entre equipos

Las rutas y comandos dependen de:

- Sistema operativo.
- Tipo de terminal.
- Arquitectura del equipo.
- Método de instalación.
- Permisos de usuario.
- Políticas de seguridad del centro.
- Versión de Terraform.
- Configuración del shell.

Por eso, los comandos de comprobación son más universales que las instrucciones de instalación.

---

## Diseño del entorno de trabajo

Una separación clara entre herramientas, proyecto y datos temporales simplifica el aprendizaje.

### Equipo local y agente remoto

Terraform puede ejecutarse:

- En el equipo local del estudiante.
- En un contenedor de laboratorio.
- En una máquina virtual.
- En un agente Jenkins.
- En un entorno de desarrollo remoto.

Estos entornos pueden tener versiones y permisos distintos.

Comprueba siempre qué equipo ejecuta el comando.

### No asumir que Jenkins ejecuta en tu equipo

Cuando un comando se ejecuta desde Jenkins, normalmente lo ejecuta el agente asignado al job.

El controlador Jenkins coordina el trabajo, pero no necesariamente ejecuta Terraform.

La salida de una terminal local no demuestra qué herramientas hay instaladas en un agente.

### Proyecto aislado

Crea un directorio para cada proyecto.

No mezcles:

- Archivos personales.
- Claves.
- Proyectos de otros cursos.
- Estados de otros ejercicios.
- Archivos descargados sin revisar.
- Configuraciones de producción.

### Ruta de trabajo

Elige una ruta sencilla, sin espacios ni caracteres inesperados si el entorno del curso tiene limitaciones.

Ejemplos ilustrativos:

```text
~/laboratorio/terraform
```

```text
C:\Users\alumno\laboratorio\terraform
```

La ruta real depende de tu sistema.

### Evitar el directorio temporal del sistema

Un directorio temporal puede limpiarse automáticamente.

Guarda el proyecto en una ubicación de trabajo aprobada.

No uses un directorio compartido con otros usuarios salvo que el curso lo indique.

### Reproducibilidad

Anota:

- Sistema operativo.
- Versión de Terraform.
- Versión de Git.
- Editor.
- Rama del repositorio.
- Método de instalación.
- Agente Jenkins utilizado, si corresponde.

No registres números de serie, nombres de usuario personales ni rutas internas restringidas.

### Control de versiones

El directorio de trabajo debería poder inicializarse como repositorio Git o ser un checkout de un repositorio aprobado.

Antes de añadir archivos, inspecciona su contenido.

### Datos temporales

Terraform puede generar archivos que no pertenecen al código fuente, entre ellos:

- `.terraform/`
- `terraform.tfstate`
- `terraform.tfstate.backup`
- Archivos de plan.
- Logs de fallo.
- Cachés locales.

No los compartas sin revisar su contenido y la política del curso.

### Almacenamiento

Comprueba que hay espacio suficiente para:

- El repositorio.
- Los binarios aprobados.
- Los datos temporales.
- La caché de proveedores, si se utilizan.
- Los artefactos del curso.

No borres carpetas del sistema para liberar espacio.

### Permisos del proyecto

El usuario actual debería poder escribir en el directorio del proyecto.

No soluciones un problema de permisos con permisos universales como `777`.

Consulta al docente o administrador si el directorio pertenece a otra cuenta.

---

## Herramientas necesarias

La práctica básica necesita pocas herramientas. Evita instalar componentes innecesarios.

### Terraform CLI

Terraform CLI permite:

- Formatear configuración.
- Inicializar un proyecto.
- Validar HCL.
- Planificar cambios.
- Aplicar cambios, cuando está autorizado.

En esta práctica se utiliza para formato, inicialización, validación y un plan local de prueba.

### Versión de Terraform

El curso debe indicar una versión o rango compatible.

La versión necesaria depende de:

- Configuración del proyecto.
- Recursos utilizados.
- Proveedores.
- Módulos.
- Compatibilidad con el agente Jenkins.

No actualices la versión solo porque exista una versión nueva.

### Git

Git permite:

- Revisar cambios.
- Crear commits.
- Comparar versiones.
- Compartir el proyecto.
- Asociar una ejecución de CI a un commit.

Git no protege automáticamente secretos que se hayan confirmado.

### Editor de texto

Utiliza un editor que permita:

- Guardar texto plano.
- Mostrar espacios y tabuladores.
- Resaltar sintaxis HCL.
- Revisar diferencias.
- Evitar extensiones accidentales, como `.tf.txt`.

La extensión del editor es opcional para completar los ejercicios.

### Terminal

Puede ser:

- PowerShell.
- Windows Terminal.
- Terminal de macOS.
- Bash.
- Zsh.
- Terminal integrada del editor.
- Una terminal remota autorizada.

Asegúrate de saber en qué directorio se ejecuta el comando.

### `terraform` y `terraform.exe`

En Unix-like suele invocarse:

```bash
terraform
```

En Windows el ejecutable puede llamarse:

```text
terraform.exe
```

El shell puede resolverlo como `terraform`.

### Herramientas opcionales

Según el curso, podrían utilizarse:

- Docker.
- Un editor con integración HCL.
- Un linter.
- Una herramienta de análisis estático.
- Una CLI de proveedor cloud.
- Jenkins.
- Un contenedor de desarrollo.

Ninguna herramienta opcional debería requerir credenciales cloud para las sesiones locales de esta página.

### No instalar una CLI cloud por anticipado

No instales una CLI de proveedor solo porque un tutorial la mencione.

Esta práctica no necesita una CLI cloud.

Si una actividad posterior la requiere, el docente debe indicar:

- Proveedor.
- Cuenta.
- Método de instalación.
- Método de autenticación.
- Permisos.
- Límites de coste.
- Procedimiento de cierre.

### No usar una cuenta personal de nube

No configures cuentas personales para resolver una práctica académica.

Utiliza únicamente cuentas y proyectos proporcionados y autorizados por el curso.

---

## Preparar el sistema

La instalación debe seguir un método permitido por la organización o el centro.

### Comprobar el sistema operativo

En una terminal Unix-like:

```bash
uname -a
```

En PowerShell:

```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion
```

No es necesario entregar toda la información del equipo.

Registra solo el sistema y la versión que el curso solicite.

### Comprobar la arquitectura

En muchos sistemas Unix-like:

```bash
uname -m
```

En macOS:

```bash
uname -m
```

En PowerShell puede consultarse la arquitectura del sistema mediante las herramientas disponibles en esa versión de Windows.

La arquitectura es relevante al elegir un paquete o binario.

### Revisar si Terraform ya está instalado

```bash
terraform version
```

En PowerShell también se puede ejecutar:

```powershell
terraform version
```

Si el comando falla, Terraform puede no estar instalado o no estar en `PATH`.

### Revisar dónde se encuentra Terraform en Unix-like

```bash
command -v terraform
```

Este comando indica qué ejecutable resolverá el shell.

Si no devuelve una ruta, revisa la instalación y `PATH`.

### Revisar dónde se encuentra Terraform en Windows

En PowerShell:

```powershell
Get-Command terraform
```

Si PowerShell no encuentra el comando, revisa el directorio de instalación y la configuración de `PATH`.

### Instalación aprobada

Utiliza solo una de estas opciones si el docente o administrador la ha aprobado:

- Herramienta ya instalada en el aula.
- Paquete mantenido por el sistema operativo.
- Gestor de paquetes aprobado.
- Binario descargado desde la fuente oficial con verificación.
- Imagen de contenedor aprobada.
- Agente gestionado por el curso.

### Instalación mediante el gestor de paquetes

Un gestor de paquetes puede simplificar la instalación y actualización.

Antes de utilizarlo:

- Comprueba qué versión instalará.
- Comprueba quién mantiene el paquete.
- Confirma que la fuente está aprobada.
- Revisa cómo se actualiza.
- Evita usar repositorios de terceros desconocidos.

### Instalación manual mediante binario

Si el método aprobado es descargar un binario:

1. Obtén el paquete desde la fuente oficial indicada por el curso.
2. Comprueba sistema operativo y arquitectura.
3. Verifica la suma de comprobación o firma según las instrucciones oficiales.
4. Instala en una ubicación autorizada.
5. Añade la ruta a `PATH` si corresponde.
6. Abre una terminal nueva.
7. Ejecuta `terraform version`.
8. Registra la versión.

No descargues binarios desde páginas de terceros sin aprobación.

### Verificar checksums

Una suma de comprobación solo ayuda si se compara con una referencia confiable.

No copies el checksum desde la misma fuente no verificada que descargó el archivo.

Sigue el procedimiento oficial de la organización o del curso.

### No desactivar la protección del sistema

No desactives antivirus, Gatekeeper, SmartScreen, políticas de ejecución ni controles corporativos para completar la instalación.

Si aparece un bloqueo, detente y consulta al administrador.

### Windows

En Windows, puedes utilizar PowerShell o una terminal aprobada.

Comprueba Terraform:

```powershell
terraform version
```

Comprueba Git:

```powershell
git --version
```

Comprueba la resolución del ejecutable:

```powershell
Get-Command terraform
```

### Windows: variables de entorno

Si se modifica `PATH`, abre una terminal nueva para comprobar el cambio.

No sobrescribas `PATH` completo.

Añade únicamente la ruta aprobada y sigue la política del equipo.

### Windows: extensiones de archivo

El Explorador puede ocultar extensiones conocidas.

Comprueba que los archivos se llamen:

```text
main.tf
```

y no:

```text
main.tf.txt
```

### Windows: permisos

Utiliza un directorio dentro de tu perfil o el directorio de laboratorio indicado.

No ejecutes la terminal como administrador sin necesidad.

### macOS

En macOS, puedes utilizar la terminal proporcionada por el sistema o por el curso.

Comprueba las herramientas:

```bash
terraform version
```

```bash
git --version
```

Comprueba el ejecutable:

```bash
command -v terraform
```

### macOS: gestor de paquetes

Si el curso autoriza un gestor de paquetes, revisa:

- Fuente.
- Fórmula o paquete.
- Versión.
- Arquitectura.
- Política de actualización.

No añadas repositorios de terceros sin aprobación.

### macOS: herramientas del sistema

No instales herramientas de desarrollo del sistema solo para ocultar un error que puede resolverse usando el entorno del curso.

Consulta al docente cuando falten componentes.

### Linux

En Linux, usa el gestor de paquetes o método proporcionado por el centro.

Comprueba:

```bash
terraform version
```

```bash
git --version
```

```bash
command -v terraform
```

### Linux: paquetes

La disponibilidad de Terraform en los repositorios del sistema varía.

No supongas que una distribución incluye la versión requerida.

No mezcles repositorios de distintas distribuciones.

### Linux: instalación manual

Si el curso facilita un binario aprobado:

- Verifica la arquitectura.
- Comprueba la fuente.
- Verifica la integridad.
- Instala en un directorio autorizado.
- Confirma permisos de ejecución.
- Revisa `PATH`.

No uses `sudo` si la instalación puede realizarse en el perfil de usuario y la política lo permite.

### Reiniciar la terminal

Después de cambiar `PATH` o instalar una herramienta:

1. Cierra la terminal actual.
2. Abre una nueva.
3. Comprueba de nuevo `terraform version`.
4. Comprueba la ruta del ejecutable.
5. Comprueba que no se está usando otra versión.

### Versiones múltiples

Si hay varias versiones instaladas:

- Identifica cuál selecciona `PATH`.
- Comprueba si existe un gestor de versiones.
- No cambies la versión global sin permiso.
- Sigue la versión fijada por el curso.
- Registra la ruta efectiva.

### Uso de gestores de versiones

Un gestor de versiones puede ayudar a seleccionar herramientas por proyecto.

Antes de adoptarlo, comprueba:

- Si el curso lo permite.
- Cómo se fija la versión.
- Si el agente Jenkins lo utiliza.
- Si la configuración es compartida.
- Cómo se actualiza de forma segura.

### Contenedor de desarrollo

Un contenedor puede aislar versiones y dependencias.

No es necesario para esta práctica salvo que el curso lo indique.

Comprueba:

- Imagen aprobada.
- Digest o etiqueta utilizada.
- Usuario del contenedor.
- Montajes.
- Permisos del workspace.
- Acceso de red.
- Política de eliminación.

No montes el socket del host en un contenedor de desarrollo sin autorización.

---

## Verificar binarios y `PATH`

Una instalación correcta requiere que la terminal o el agente encuentre el ejecutable esperado.

### Comprobación de Terraform

```bash
terraform version
```

Anota la versión que aparece como ejecutable de Terraform.

### Comprobación de Git

```bash
git --version
```

La práctica de Git puede variar según la versión, pero el comando confirma que Git está disponible.

### Comprobar `PATH` en Unix-like

```bash
printf '%s\n' "$PATH"
```

Esta salida puede mostrar rutas internas.

No es necesario compartirla completa.

### Comprobar `PATH` en PowerShell

```powershell
$env:PATH
```

La salida también puede incluir rutas personales.

No la publiques sin revisarla.

### No imprimir todo el entorno

Evita ejecutar:

```bash
env
```

o:

```powershell
Get-ChildItem Env:
```

en una consola compartida.

Las variables de entorno pueden contener credenciales o datos internos.

### Comprobar un ejecutable concreto

En Unix-like:

```bash
command -v terraform
```

En PowerShell:

```powershell
Get-Command terraform
```

Estas comprobaciones son preferibles a imprimir todo el entorno.

### Comparar terminal local y agente Jenkins

Una herramienta disponible localmente puede faltar en Jenkins.

Ejecuta las comprobaciones en cada entorno de forma separada.

Registra:

```text
Entorno:
Versión Terraform:
Versión Git:
Ruta de Terraform:
Agente o equipo:
```

No incluyas identificadores sensibles.

---

## Preparar Terraform

La configuración del proyecto debe expresar sus requisitos sin depender de la máquina de una persona.

### Versión requerida

Los proyectos pueden declarar un rango de versiones:

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}
```

El rango debe corresponder al proyecto y a las versiones aprobadas.

No copies el rango sin verificar compatibilidad.

### Compatibilidad de recursos

Algunos recursos o características requieren versiones mínimas.

Por ejemplo, `terraform_data` está disponible desde Terraform 1.4.

Comprueba el requisito de cada característica que se use.

### Directorio de trabajo

Terraform trabaja con la configuración del directorio actual.

Antes de ejecutar:

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Confirma que estás en el directorio correcto.

### No ejecutar desde un directorio desconocido

Un comando Terraform puede utilizar archivos `.tf` del directorio actual y de la configuración que se le indique.

No ejecutes comandos desde un repositorio desconocido sin revisar:

- Archivos.
- Backend.
- Proveedores.
- Variables.
- Scripts.
- Workspace.
- Cuenta seleccionada.

### Proveedores

La instalación de un proveedor puede requerir descargas de red.

Un proveedor es un plugin ejecutable.

Antes de utilizarlo, revisa:

- Fuente.
- Versión.
- Integridad.
- Compatibilidad.
- Permisos.
- Política de actualización.

La práctica inicial no necesita proveedores cloud.

### Colección de proveedores

Un proyecto puede declarar restricciones de proveedores.

Fijar un rango adecuado ayuda a controlar cambios, pero también requiere una política de actualización.

No uses rangos amplios sin entender el ciclo de mantenimiento.

### Módulos

Un módulo puede descargarse desde un repositorio o registro.

Cada fuente externa introduce una dependencia.

Revisa:

- Reputación.
- Mantenimiento.
- Versión.
- Código.
- Licencia.
- Requisitos.
- Posibles acciones.

### Registro privado

Algunas organizaciones utilizan registros privados de módulos o proveedores.

No configures acceso a un registro privado sin autorización.

Usa las credenciales proporcionadas por el equipo responsable.

### Archivo `.terraform.lock.hcl`

El archivo de bloqueo registra selecciones y checksums de proveedores en los proyectos que los utilizan.

Su presencia depende de la configuración.

La política del proyecto debería indicar si se versiona.

No lo elimines de forma automática.

### `.terraform/`

El directorio de datos de trabajo suele ser local a cada entorno.

Normalmente se excluye del repositorio.

Puede contener referencias a proveedores y configuración local.

### Variables

Las variables permiten parametrizar valores.

No pongas secretos en valores por defecto ni en archivos confirmados a Git.

### Archivos de variables

Antes de usar un archivo como:

```text
terraform.tfvars
```

comprueba qué contiene.

No todos los archivos de variables son secretos, pero algunos pueden serlo.

### `TF_VAR_*`

Terraform puede leer variables de entorno con el prefijo `TF_VAR_`.

No imprimas el entorno completo.

No asumas que una variable de entorno está protegida solo por no aparecer en un archivo `.tf`.

### Estado local

El estado local puede crearse cuando se ejecuta una operación que actualiza estado.

Trátalo como dato potencialmente sensible.

No lo confirmes a Git.

### Planes guardados

Los planes creados con `-out` pueden contener valores sensibles.

No los subas al repositorio.

No los compartas por canales no aprobados.

---

## Preparar el proyecto

La estructura debe facilitar el trabajo, la revisión y la limpieza.

### Estructura inicial

Crea esta estructura:

```text
preparacion-terraform/
├── README.md
├── .gitignore
└── terraform/
    ├── main.tf
    └── outputs.tf
```

El directorio `terraform` contiene la configuración de laboratorio.

### Crear directorios en Unix-like

```bash
mkdir -p preparacion-terraform/terraform
cd preparacion-terraform
```

Comprueba la ruta:

```bash
pwd
```

### Crear directorios en PowerShell

```powershell
New-Item -ItemType Directory -Force preparacion-terraform\terraform
Set-Location preparacion-terraform
```

Comprueba el directorio:

```powershell
Get-Location
```

### Archivo `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "preparacion" {
  input = {
    proyecto = "preparacion-terraform"
    entorno  = "laboratorio"
    objetivo = "verificar herramientas localmente"
  }
}
```

Este recurso integrado permite practicar el flujo sin un proveedor cloud.

### Archivo `terraform/outputs.tf`

```hcl
output "entorno" {
  description = "Entorno identificado por la configuración de laboratorio."
  value       = terraform_data.preparacion.output.entorno
}
```

La salida no debe contener secretos.

### Archivo `README.md`

```text
Proyecto de preparación del entorno Terraform.
El ejercicio usa terraform_data y no crea recursos cloud.
No se utilizan credenciales ni backends remotos.
```

### Archivo `.gitignore`

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

Este ejemplo es una base.

Adáptalo a la política del curso.

### Archivos adicionales

Según el proyecto, pueden aparecer:

```text
variables.tf
versions.tf
providers.tf
outputs.tf
terraform.tfvars
.terraform.lock.hcl
```

No crees archivos solo por seguir una convención.

La estructura debe ayudar al equipo a comprender el proyecto.

### Nombres de archivo

Usa nombres claros y consistentes.

Evita:

```text
test2.tf
nuevo-final-ahora-si.tf
cosas.tf
```

### No duplicar bloques

Terraform combina los archivos `.tf` de un módulo.

Evita declarar dos veces el mismo bloque de forma accidental.

### Verificar extensiones

Comprueba que los archivos terminan con `.tf`.

Un archivo guardado como `main.tf.txt` no se tratará como configuración Terraform.

---

## Preparar Git

Git permite revisar el proyecto, pero requiere comprobar qué se confirma.

### Comprobar Git

```bash
git --version
```

Si no está instalado, utiliza el procedimiento aprobado por el curso.

### Identidad local de Git

Git puede necesitar nombre y correo para crear commits.

Comprueba la configuración existente:

```bash
git config --get user.name
```

```bash
git config --get user.email
```

No compartas datos personales innecesariamente.

### Configurar identidad

Si el curso lo solicita, utiliza la identidad indicada.

No cambies una configuración global compartida en un equipo de aula sin permiso.

Puedes consultar al docente qué alcance usar:

- Configuración local del repositorio.
- Configuración global del usuario.

### Inicializar repositorio local

Solo si el directorio no es ya un checkout:

```bash
git init
```

No vuelvas a inicializar un repositorio que ya contiene `.git` sin entender su estado.

### Revisar estado

```bash
git status --short
```

Comprueba qué archivos están:

- Sin seguimiento.
- Modificados.
- Preparados para commit.
- Ignorados.

### Añadir archivos

Añade solo los archivos necesarios:

```bash
git add README.md .gitignore terraform/main.tf terraform/outputs.tf
```

Antes de confirmar, vuelve a revisar:

```bash
git status
```

### Revisar diferencias

```bash
git diff
```

Para revisar cambios preparados:

```bash
git diff --cached
```

Lee el diff antes de crear un commit.

### Crear un commit de laboratorio

```bash
git commit -m "Prepara entorno de Terraform"
```

El mensaje debe describir el cambio.

### Comprobar el historial

```bash
git log -1 --oneline
```

El historial permite identificar el commit de la práctica.

No es necesario publicar información personal del autor.

### `.gitignore` no elimina archivos ya confirmados

Si un archivo sensible ya se confirmó, añadirlo a `.gitignore` no lo elimina del historial.

Detén la actividad y solicita ayuda al docente o administrador.

No intentes resolverlo con una operación destructiva en un repositorio compartido.

### No confirmar secretos

Antes de confirmar, busca:

- Contraseñas.
- Tokens.
- Claves privadas.
- Archivos de estado.
- Planes binarios.
- Archivos de credenciales.
- Variables locales.
- Logs.
- Datos personales.

### Revisar el staging

Ejecuta:

```bash
git status
```

y:

```bash
git diff --cached
```

No confirmes archivos que no hayas inspeccionado.

---

## Preparar el editor

Un editor bien configurado facilita detectar errores de HCL y YAML.

### HCL y formato

HCL utiliza espacios, bloques y expresiones.

`terraform fmt` es la referencia para el formato de Terraform.

Un resaltado de sintaxis ayuda, pero no sustituye los comandos de Terraform.

### Extensiones del editor

Si el curso lo permite, puedes instalar una extensión que:

- Resalte HCL.
- Identifique bloques Terraform.
- Ayude con formato.
- Muestre diagnósticos.
- Integre con la CLI.

Utiliza solo extensiones aprobadas.

Una extensión de editor puede tener acceso al código del proyecto.

### Formato automático

El formato automático del editor puede ser útil.

Aun así, comprueba el resultado con:

```bash
terraform fmt -check -recursive
```

### Formato al guardar

Si habilitas formato al guardar:

- Revisa el diff.
- Comprueba que no modifica archivos no relacionados.
- Confirma que usa una versión compatible.
- Desactívalo si entra en conflicto con la práctica.

### Comillas y caracteres

HCL admite cadenas y expresiones.

No sustituyas comillas normales por caracteres tipográficos.

Evita pegar texto con comillas curvas desde procesadores de texto.

### Codificación

Guarda archivos como texto plano.

UTF-8 suele ser apropiado para proyectos actuales, pero sigue la convención del curso.

### Espacios y tabuladores

`terraform fmt` normaliza el formato.

No dependas de la indentación manual para resolver errores estructurales.

### Editor sin extensión

Puedes trabajar con un editor de texto básico.

La validación se realiza con Terraform CLI.

### No instalar extensiones de fuentes desconocidas

Una extensión puede acceder a los archivos del proyecto.

Revisa su origen, permisos y política de actualización.

---

## Comprobaciones iniciales

Ejecuta estas comprobaciones en el directorio de laboratorio.

### Confirmar el directorio

Unix-like:

```bash
pwd
```

PowerShell:

```powershell
Get-Location
```

Asegúrate de que la ruta corresponde al proyecto correcto.

### Confirmar archivos Terraform

Unix-like:

```bash
find terraform -maxdepth 1 -type f
```

PowerShell:

```powershell
Get-ChildItem terraform -File
```

La salida puede diferir según los archivos creados.

### Comprobar la versión

```bash
terraform version
```

Compara el resultado con `required_version`.

### Comprobar Git

```bash
git --version
```

Comprueba que el proyecto se puede revisar mediante control de versiones.

### Formatear

```bash
terraform fmt -recursive
```

Este comando puede modificar archivos.

Revisa el diff después.

### Comprobar formato

```bash
terraform fmt -check -recursive
```

Si falla, corrige el formato y vuelve a comprobar.

### Inicializar sin backend

Desde el directorio `terraform`:

```bash
terraform init -backend=false -input=false
```

Este comando se usa en este laboratorio porque no se quiere configurar un backend remoto.

### Validar

Desde el directorio `terraform`:

```bash
terraform validate
```

La validación no crea recursos cloud.

### Generar un plan local

```bash
terraform plan -input=false
```

Ejecuta este comando solo en el proyecto de laboratorio preparado.

No añadas `apply` como “siguiente paso”.

### Revisar salida

Comprueba:

- Versión.
- Directorio.
- Configuración seleccionada.
- Mensajes de error.
- Recursos que aparecen en el plan.
- Resultado final.

### Limpiar el contexto

Al terminar:

- No borres archivos del sistema.
- No elimines datos de otro proyecto.
- No compartas archivos de estado o plan.
- Sigue las instrucciones del curso para limpiar el directorio.
- Conserva los archivos fuente que se soliciten en la entrega.

---

## Preparar Jenkins como entorno opcional

Algunos cursos ejecutan Terraform desde Jenkins además de probarlo localmente.

### Agente y herramientas

El agente Jenkins debe tener una versión de Terraform compatible.

Comprueba la herramienta desde el pipeline, no solo desde tu equipo.

### No asumir que el controlador es el agente

El controlador coordina.

El agente ejecuta los pasos asignados.

El job puede fallar si el controlador tiene Terraform, pero el agente no.

### Etiqueta del agente

Utiliza la etiqueta entregada por el curso.

No inventes una etiqueta.

No cambies a un agente privilegiado solo para evitar una espera.

### Workspace

El workspace contiene el checkout de una ejecución.

Puede limpiarse automáticamente.

No guardes el estado ni los planes como datos permanentes del workspace.

### Job de comprobación

Un pipeline básico puede comprobar:

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    stages {
        stage('Versiones') {
            steps {
                sh 'terraform version'
                sh 'git --version'
            }
        }

        stage('Formato') {
            steps {
                dir('terraform') {
                    sh 'terraform fmt -check -recursive'
                }
            }
        }

        stage('Validación') {
            steps {
                dir('terraform') {
                    sh 'terraform init -backend=false -input=false'
                    sh 'terraform validate'
                }
            }
        }
    }
}
```

Sustituye la etiqueta y las rutas por las proporcionadas por el curso.

### Diferencias entre local y CI

Localmente puedes tener:

- Más herramientas.
- Una versión distinta.
- Un workspace persistente.
- Variables personales.
- Una caché de proveedores.

En Jenkins puede haber:

- Un agente diferente.
- Un workspace nuevo.
- Un entorno controlado.
- Credenciales limitadas.
- Una política de limpieza.
- Otra versión de Terraform.

### No imprimir variables de entorno

No uses:

```groovy
sh 'env'
```

El entorno podría incluir información sensible.

### Credenciales Jenkins

La preparación básica no necesita credenciales cloud.

Si un job las solicita:

- Detente.
- Confirma el propósito.
- Comprueba la identidad.
- Verifica el ámbito y permisos.
- Consulta al docente.
- No copies el valor a la consola.

### Limitar artefactos

No archives:

- Estado.
- Plan binario.
- Variables sensibles.
- Directorio `.terraform`.
- Logs con información sensible.

Archiva solo los resultados explícitamente solicitados.

---

## Seguridad y mantenimiento

Preparar el entorno también significa decidir qué no debe estar disponible.

### Credenciales

No guardes credenciales en:

- `main.tf`.
- `variables.tf`.
- Archivos `*.tfvars` confirmados.
- `Jenkinsfile`.
- `.bashrc` compartido.
- Historial del shell.
- Capturas.
- Logs.
- Artefactos.

### Credenciales locales

Si el sistema ya tiene credenciales de proveedor configuradas, no las uses para esta práctica.

Consulta al docente antes de ejecutar Terraform en ese entorno.

### Estado local

Un estado local puede contener información sensible.

No:

- Lo añadas a Git.
- Lo adjuntes a la entrega.
- Lo copies a una carpeta compartida.
- Lo publiques en un chat.
- Lo subas a almacenamiento personal.

### Backend remoto

No configures un backend remoto sin instrucciones expresas.

Antes de usar uno, verifica:

- Entorno.
- Cuenta.
- Permisos.
- Cifrado.
- Bloqueo.
- Retención.
- Recuperación.
- Propietario.

### Planes

Un plan puede exponer valores de configuración y detalles de recursos.

No subas un archivo de plan a un repositorio.

No publiques la salida completa si contiene datos sensibles.

### Permisos

Usa un usuario normal para el trabajo cotidiano.

No ejecutes el editor ni la terminal como administrador si no hace falta.

### Actualizaciones

Actualiza herramientas solo mediante el procedimiento aprobado.

Antes de actualizar:

- Comprueba compatibilidad.
- Revisa el cambio de versión.
- Prueba en laboratorio.
- Conserva una forma de volver a la versión aprobada.
- Documenta el resultado.

### Proveedores

El proveedor es código que se ejecuta durante operaciones Terraform.

Usa fuentes y versiones aprobadas.

No descargues proveedores desde mirrors desconocidos.

### Módulos

Los módulos son dependencias de código.

Revisa sus fuentes, versiones y cambios.

No consumas módulos desconocidos por comodidad.

### Red

`terraform init` puede necesitar acceso para descargar proveedores o módulos.

No abras acceso de red amplio sin autorización.

Si la descarga falla, registra el mensaje y consulta al docente.

### Costes

Esta práctica no necesita una cuenta cloud.

No actives un servicio que pueda generar cargos por resolver una prueba local.

### Limpieza

Antes de limpiar:

- Identifica la carpeta exacta.
- Comprueba que pertenece al ejercicio.
- Conserva archivos requeridos.
- No borres estados compartidos.
- Sigue la política del aula.

---

## Sesiones prácticas

Las sesiones preparan el entorno y comprueban cada herramienta por separado.

### Preparación común de las sesiones

Antes de comenzar:

- Confirma el equipo asignado.
- Usa un directorio de laboratorio.
- Anota las versiones necesarias.
- No utilices una cuenta cloud.
- No configures credenciales.
- No ejecutes `apply` o `destroy`.
- Revisa cada archivo antes de confirmarlo.
- Registra errores sin exponer información sensible.

### Sesión 1: dibujar el entorno

**Objetivo:** identificar qué componente ejecuta cada comando.

#### Actividad

Dibuja el entorno que utilizarás:

```text
Estudiante
   |
   +--> Editor
   |
   +--> Terminal local
             |
             +--> Terraform CLI
             |
             +--> Git
```

Si el curso usa Jenkins, añade:

```text
Repositorio
   |
   v
Jenkins Controller
   |
   v
Agente de laboratorio
   |
   +--> Terraform
   +--> Git
```

#### Preguntas

- ¿Dónde se ejecuta Terraform localmente?
- ¿Dónde se ejecuta Terraform en CI?
- ¿Qué componente conserva el historial?
- ¿Qué componente conserva el estado?
- ¿Qué información no debe quedar en el diagrama de entrega?

### Sesión 2: identificar sistema y terminal

**Objetivo:** conocer el entorno antes de instalar herramientas.

#### Instrucciones

1. Abre la terminal aprobada.
2. Identifica el sistema operativo.
3. Identifica el shell.
4. Comprueba la arquitectura si el docente lo solicita.
5. Registra solo la información necesaria.
6. No compartas rutas personales completas.

#### Ficha

```text
Sistema:
Versión:
Shell:
Arquitectura:
Equipo local o agente:
Observaciones:
```

### Sesión 3: comprobar Terraform existente

**Objetivo:** determinar si hace falta instalación.

#### Instrucciones

1. Ejecuta `terraform version`.
2. Si funciona, registra versión.
3. Comprueba la ruta del ejecutable.
4. Compara la versión con la del curso.
5. Si falla, no descargues un binario sin permiso.
6. Consulta el método de instalación aprobado.

#### Resultado

Anota una de estas opciones:

```text
Terraform disponible y compatible.
Terraform disponible, pero versión incompatible.
Terraform no disponible.
El comando resuelve a un ejecutable inesperado.
```

### Sesión 4: comprobar Git

**Objetivo:** preparar control de versiones.

#### Instrucciones

1. Ejecuta `git --version`.
2. Comprueba la carpeta del proyecto.
3. Consulta identidad configurada, si crearás commits.
4. No cambies la configuración global en un equipo compartido.
5. Pregunta al docente qué identidad usar.

### Sesión 5: instalar Terraform por el método aprobado

**Objetivo:** dejar disponible una versión compatible.

#### Instrucciones

1. Confirma el método autorizado.
2. Comprueba sistema operativo y arquitectura.
3. Sigue la documentación proporcionada por el curso.
4. Verifica la integridad si el método lo requiere.
5. Instala con permisos mínimos.
6. Abre una terminal nueva.
7. Ejecuta `terraform version`.
8. Registra el resultado.

No añadas repositorios de terceros sin autorización.

### Sesión 6: solucionar un error de `PATH`

**Objetivo:** entender por qué una instalación puede no resolver el comando.

#### Escenario

Terraform está instalado, pero el shell responde que no encuentra el comando.

#### Instrucciones

1. Comprueba la ubicación aprobada del ejecutable.
2. Ejecuta `command -v terraform` o `Get-Command terraform`.
3. Revisa `PATH` sin publicar toda la salida.
4. Comprueba si la terminal se abrió después de instalar.
5. Consulta al docente antes de editar perfiles del shell.
6. Vuelve a probar en una terminal nueva.

### Sesión 7: crear el directorio del proyecto

**Objetivo:** aislar los archivos de práctica.

#### Instrucciones

1. Crea `preparacion-terraform`.
2. Crea `terraform` dentro.
3. Confirma el directorio actual.
4. Comprueba permisos de escritura.
5. No uses una carpeta compartida.
6. Registra el nombre del proyecto.

### Sesión 8: crear los archivos iniciales

**Objetivo:** preparar una configuración local mínima.

#### Instrucciones

1. Crea `terraform/main.tf`.
2. Añade `required_version`.
3. Añade un recurso `terraform_data`.
4. Crea `terraform/outputs.tf`.
5. Añade una salida no sensible.
6. Guarda ambos archivos en texto plano.
7. Comprueba las extensiones.

### Sesión 9: comprobar archivos y extensiones

**Objetivo:** detectar nombres de archivo incorrectos.

#### Instrucciones

1. Lista el contenido del directorio.
2. Confirma que `main.tf` termina en `.tf`.
3. Confirma que no existe `main.tf.txt`.
4. Abre el archivo desde la terminal o el editor.
5. Comprueba que no hay caracteres tipográficos en las cadenas.

### Sesión 10: ejecutar formato

**Objetivo:** usar `terraform fmt` para normalizar archivos.

#### Instrucciones

1. Ejecuta `terraform fmt -recursive`.
2. Revisa los archivos que cambió.
3. Inspecciona el diff.
4. Ejecuta `terraform fmt -check -recursive`.
5. Registra el resultado.
6. Explica por qué `fmt` no valida arquitectura.

### Sesión 11: inicializar el proyecto

**Objetivo:** preparar el directorio local sin backend remoto.

#### Comando

```bash
terraform init -backend=false -input=false
```

#### Instrucciones

1. Ejecuta el comando desde `terraform`.
2. Revisa la salida.
3. Comprueba que no se configura backend remoto.
4. Anota si Terraform creó archivos de trabajo.
5. No confirmes `.terraform/` en Git.

### Sesión 12: validar la configuración

**Objetivo:** comprobar que Terraform acepta la estructura.

#### Instrucciones

1. Ejecuta `terraform validate`.
2. Registra el resultado.
3. En una copia temporal, introduce un error sintáctico controlado.
4. Ejecuta de nuevo.
5. Identifica la línea del diagnóstico.
6. Restaura la configuración válida.

### Sesión 13: leer un plan de laboratorio

**Objetivo:** distinguir planificar de aplicar.

#### Instrucciones

1. Ejecuta `terraform plan -input=false`.
2. Lee las acciones previstas.
3. Identifica el recurso local de prueba.
4. Comprueba que no hay proveedor cloud.
5. No ejecutes `apply`.
6. Resume el plan sin copiar información innecesaria.

### Sesión 14: crear `.gitignore`

**Objetivo:** excluir archivos locales y datos potencialmente sensibles.

Añade:

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

#### Instrucciones

1. Guarda el archivo en la raíz.
2. Ejecuta `git status`.
3. Comprueba los archivos ignorados.
4. Explica por qué el `.gitignore` no elimina datos ya confirmados.
5. No uses patrones amplios que oculten código requerido.

### Sesión 15: inicializar Git

**Objetivo:** preparar el proyecto para revisión.

#### Instrucciones

1. Comprueba si el proyecto ya es un repositorio.
2. Si está autorizado y aún no lo es, ejecuta `git init`.
3. Revisa `git status`.
4. Añade solo archivos fuente.
5. Revisa `git diff --cached`.
6. Crea un commit de laboratorio.
7. No añadas estado ni planes.

### Sesión 16: investigar un archivo ignorado

**Objetivo:** distinguir exclusión del repositorio y eliminación del disco.

#### Instrucciones

1. Crea un archivo de prueba no sensible con un patrón ignorado.
2. Comprueba `git status`.
3. Comprueba que el archivo sigue en el disco.
4. Explica qué hace `.gitignore`.
5. Borra el archivo de prueba solo si el curso lo autoriza.

### Sesión 17: probar el proyecto desde un directorio limpio

**Objetivo:** comprobar que el proyecto no depende de archivos personales.

#### Instrucciones

1. Clona el repositorio en una carpeta nueva, si el curso usa remoto.
2. Comprueba que están los archivos fuente.
3. Ejecuta `terraform fmt -check`.
4. Ejecuta `terraform init -backend=false`.
5. Ejecuta `terraform validate`.
6. Ejecuta el plan de laboratorio.
7. No copies el estado anterior.
8. Registra la secuencia.

### Sesión 18: comparar local y Jenkins

**Objetivo:** identificar diferencias entre dos entornos de ejecución.

#### Instrucciones

1. Ejecuta `terraform version` localmente.
2. Ejecuta `terraform version` desde el agente Jenkins.
3. Compara versiones.
4. Compara disponibilidad de Git.
5. Compara rutas sin publicarlas.
6. Explica qué debe fijarse para reducir diferencias.

### Sesión 19: verificar el agente Jenkins

**Objetivo:** confirmar que Terraform está disponible en el nodo correcto.

#### Instrucciones

1. Usa el job de comprobación del curso.
2. Revisa la etiqueta.
3. Ejecuta `terraform version`.
4. Confirma que se ejecutó en el agente esperado.
5. Registra el número del build.
6. No imprimas el entorno completo.

### Sesión 20: revisar el workspace Jenkins

**Objetivo:** comprender dónde se almacenan los archivos temporales del build.

#### Instrucciones

1. Revisa la salida del job.
2. Identifica la ruta del workspace solo si es necesario.
3. Comprueba qué archivos se crearon.
4. No intentes acceder al workspace de otro usuario.
5. No archives el estado.
6. Sigue las instrucciones del docente para limpieza.

### Sesión 21: corregir una versión incompatible

**Objetivo:** relacionar el requisito del proyecto con el binario instalado.

#### Instrucciones

1. Lee `required_version`.
2. Comprueba la salida de Terraform.
3. Determina si el agente cumple.
4. No cambies el requisito para ocultar el problema.
5. Anota si la solución corresponde al agente o al proyecto.
6. Consulta al administrador.

### Sesión 22: inspeccionar dependencias

**Objetivo:** reconocer la aparición de proveedores y módulos.

#### Instrucciones

1. Revisa si el proyecto declara `required_providers`.
2. Revisa si llama módulos externos.
3. Comprueba si hay `.terraform.lock.hcl`.
4. No añadas dependencias externas a la práctica sin autorización.
5. Explica qué necesitaría descargar `terraform init`.
6. Describe cómo se aprobaría esa fuente.

### Sesión 23: preparar una ficha de entorno

**Objetivo:** documentar datos suficientes para reproducir la práctica.

Completa:

```text
Sistema operativo:
Shell:
Terraform:
Git:
Editor:
Ruta del proyecto:
Método de instalación:
Repositorio:
Agente Jenkins:
Observaciones:
```

No incluyas datos personales o secretos.

### Sesión 24: revisar en parejas

**Objetivo:** comprobar que el entorno está listo.

La persona autora explica:

- Qué versión de Terraform está instalada.
- Cómo se instaló.
- Qué directorio se utiliza.
- Qué archivos se versionan.
- Qué archivos se excluyen.
- Qué comandos se ejecutaron.

La persona revisora comprueba:

- Versión compatible.
- Ruta de proyecto aislada.
- Ausencia de credenciales.
- `.gitignore` razonable.
- Formato válido.
- Inicialización sin backend remoto.
- Validación correcta.
- Plan no aplicado.

### Sesión 25: proyecto integrador

**Objetivo:** entregar un entorno local listo para las siguientes prácticas.

#### Requisitos

- Terraform disponible.
- Git disponible.
- Proyecto con estructura clara.
- Requisito de versión.
- Configuración local sin proveedor cloud.
- `.gitignore` revisado.
- Formato comprobado.
- Inicialización de laboratorio.
- Validación correcta.
- Plan generado y no aplicado.
- Commit de los archivos fuente.
- Sin estado, planes ni credenciales en Git.

#### Entrega

Incluye:

- Sistema operativo.
- Versión de Terraform.
- Versión de Git.
- Estructura del proyecto.
- Resultado de formato.
- Resultado de inicialización.
- Resultado de validación.
- Resumen del plan.
- Commit de la práctica.
- Una limitación o riesgo identificado.

---

## Diagnóstico de errores habituales

### `terraform` no se reconoce como comando

Comprueba:

- Instalación.
- `PATH`.
- Terminal nueva.
- Nombre del ejecutable.
- Arquitectura.
- Ubicación aprobada.
- Agente correcto, si ocurre en Jenkins.

No descargues otro binario sin investigar primero.

### Se ejecuta una versión distinta

Comprueba:

- Ruta resuelta por el shell.
- Varias instalaciones.
- Gestor de versiones.
- Configuración del agente.
- Orden de `PATH`.
- Versión fijada por el proyecto.

### `git` no se encuentra

Comprueba:

- Instalación.
- `PATH`.
- Terminal.
- Agente Jenkins.
- Imagen del agente.

La falta de Git puede afectar al checkout o a los comandos del job, pero no necesariamente a un proyecto local ya descargado.

### No hay permisos para instalar

No intentes elevar privilegios de forma no autorizada.

Pregunta si el curso ofrece:

- Una herramienta preinstalada.
- Un contenedor.
- Un agente Jenkins.
- Un instalador gestionado.
- Una ubicación de usuario.

### Error de arquitectura

Comprueba que el paquete corresponde al sistema operativo y a la arquitectura.

No ejecutes binarios de otra plataforma.

### Error de checksum o firma

Detén la instalación.

Comprueba la fuente y la referencia de verificación según el procedimiento aprobado.

No ignores el error para continuar.

### Terraform no reconoce una configuración

Comprueba:

- Directorio actual.
- Extensión `.tf`.
- Sintaxis.
- Archivos guardados.
- Ruta del módulo.
- Versión de Terraform.

### Archivo `.tf.txt`

Activa la visualización de extensiones o renombra el archivo mediante el método aprobado.

Comprueba el nombre en la terminal.

### `terraform init` intenta acceder a una red

Comprueba:

- Proveedores.
- Módulos.
- Backend.
- Registro.
- Configuración del proyecto.

No permitas conexiones no autorizadas para completar la práctica.

### `terraform init` muestra error de backend

Comprueba si existe configuración de backend.

Confirma que la práctica pide usar `-backend=false`.

No introduzcas parámetros de un backend desconocido.

### `terraform validate` dice que falta inicializar

Ejecuta `terraform init` en el contexto correcto, con la opción de laboratorio aprobada.

No ejecutes `init` desde otro directorio.

### `terraform validate` falla por versión

Compara el requisito del código con la versión del ejecutable.

No cambies `required_version` sin justificación.

### `terraform fmt -check` falla

Ejecuta `terraform fmt` en el proyecto local, revisa el diff y vuelve a ejecutar el modo de comprobación.

No dejes que CI modifique el repositorio silenciosamente.

### El plan no encuentra recursos

Comprueba:

- Directorio.
- Archivos `.tf`.
- Módulo seleccionado.
- Checkout.
- Rama.
- Workspace.
- Recurso de laboratorio.

### El plan muestra un backend o recursos inesperados

Detén la ejecución.

Comprueba:

- Directorio actual.
- Archivos de configuración.
- Backend.
- Workspace.
- Variables.
- Credenciales existentes.
- Cuenta o perfil activo.

No continúes con un contexto desconocido.

### Git muestra archivos que no deberían confirmarse

Antes de confirmar:

- Revisa el nombre.
- Inspecciona el archivo si es seguro.
- Comprueba `.gitignore`.
- No lo añadas al staging.
- Consulta al docente si contiene datos sensibles.
- No lo publiques para pedir ayuda.

### `.gitignore` no oculta un archivo

Comprueba si el archivo ya estaba confirmado.

`.gitignore` no elimina archivos ya seguidos por Git.

No ejecutes comandos de limpieza destructivos en un repositorio compartido.

### Jenkins funciona localmente, pero no en el agente

Compara:

- Versiones.
- `PATH`.
- Sistema operativo.
- Directorio.
- Etiqueta.
- Herramientas.
- Workspace.
- Acceso a registros.
- Rama y commit.

### La terminal local funciona, pero el pipeline espera

Comprueba:

- Etiqueta de agente.
- Nodos conectados.
- Ejecutores disponibles.
- Restricciones del job.
- Estado del cloud de agentes, si existe.

No cambies a un agente no autorizado.

### Informe de diagnóstico

```text
Entorno:
Sistema:
Herramienta:
Versión:
Comando:
Directorio:
Mensaje relevante:
Resultado esperado:
Resultado observado:
Hipótesis:
Comprobación siguiente:
```

Separa observaciones de hipótesis.

---

## Checklist de preparación

### Herramientas

- [ ] Terraform está instalado o disponible en el agente.
- [ ] La versión coincide con la del curso.
- [ ] Git está disponible.
- [ ] El editor guarda texto plano.
- [ ] La terminal ejecuta los comandos esperados.
- [ ] El agente Jenkins está identificado, si corresponde.

### Proyecto

- [ ] Existe un directorio de laboratorio aislado.
- [ ] La estructura es clara.
- [ ] Los archivos tienen extensiones correctas.
- [ ] La configuración no declara un proveedor cloud innecesario.
- [ ] La versión requerida está declarada.
- [ ] No hay credenciales.
- [ ] No hay datos personales innecesarios.

### Git

- [ ] El repositorio es el correcto.
- [ ] `.gitignore` está revisado.
- [ ] No se añaden estados.
- [ ] No se añaden planes.
- [ ] No se añaden archivos locales sensibles.
- [ ] Se revisa `git diff --cached`.
- [ ] El commit identifica el cambio.

### Terraform

- [ ] `terraform version` funciona.
- [ ] `terraform fmt -check` pasa.
- [ ] `terraform init` se ejecuta con el alcance de laboratorio.
- [ ] `terraform validate` pasa.
- [ ] El plan corresponde al proyecto local.
- [ ] No se ejecuta `apply`.
- [ ] No se ejecuta `destroy`.
- [ ] No se usa un backend desconocido.

### Jenkins opcional

- [ ] La etiqueta del agente es la correcta.
- [ ] Terraform está instalado en el agente.
- [ ] El job utiliza el repositorio esperado.
- [ ] El checkout usa una credencial aprobada si corresponde.
- [ ] No se imprimen variables de entorno.
- [ ] No se archivan estados o planes.
- [ ] El resultado se asocia a un commit.

---

## Rúbrica de evaluación

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Herramientas | No verifica versiones | Terraform y Git comprobados | Compara local y agente y explica diferencias |
| Instalación | Usa un método desconocido | Sigue el método aprobado | Verifica fuente, integridad y actualización |
| Proyecto | Archivos desordenados | Estructura clara | Estructura y convenciones justificadas |
| Git | Añade archivos sin revisar | Inspecciona estado y diff | Explica exclusión y riesgo de datos sensibles |
| Terraform | No completa las comprobaciones | Ejecuta formato, init y validate | Diagnostica versiones y dependencias |
| Seguridad | Incluye o expone datos | No utiliza credenciales ni backend remoto | Explica riesgos de estado, planes y herramientas |
| Jenkins | No identifica el agente | Verifica Terraform en el agente | Relaciona build, commit y entorno |
| Documentación | Evidencias insuficientes | Incluye versiones y resultados | Es reproducible, limitada y clara |

### Evidencias mínimas

La entrega debería incluir:

- Ficha de entorno.
- Estructura del proyecto.
- `main.tf` de laboratorio.
- `outputs.tf`.
- `.gitignore`.
- Resultado de `terraform version`.
- Resultado de `terraform fmt -check`.
- Resultado de `terraform init -backend=false`.
- Resultado de `terraform validate`.
- Resumen de plan local.
- Commit de los archivos fuente.
- Confirmación de que no se ejecutó `apply`.

### Preguntas de evaluación

1. ¿Qué sistema operativo utilizaste?
2. ¿Qué versión de Terraform tienes?
3. ¿Cómo comprobaste la ruta del ejecutable?
4. ¿Qué información contiene `PATH`?
5. ¿Qué función tiene Git en la preparación?
6. ¿Por qué se crea un directorio aislado?
7. ¿Qué excluye el `.gitignore`?
8. ¿Por qué un archivo ignorado no se elimina del historial?
9. ¿Qué prepara `terraform init`?
10. ¿Qué diferencia hay entre `fmt` y `validate`?
11. ¿Qué tipo de archivo puede crear Terraform durante la práctica?
12. ¿Por qué no se deben confirmar estados y planes?
13. ¿Qué diferencia hay entre la herramienta local y la del agente Jenkins?
14. ¿Qué harías si `init` intenta configurar un backend inesperado?
15. ¿Qué harías si la versión del agente no coincide con la del proyecto?

---

## Glosario

- **Agente:** nodo donde Jenkins ejecuta los pasos del job.
- **Backend:** mecanismo que guarda el estado de Terraform.
- **Binario:** archivo ejecutable de una herramienta.
- **CI:** integración continua, proceso de ejecutar comprobaciones de forma automatizada.
- **Commit:** registro de un conjunto de cambios en Git.
- **Directorio de trabajo:** carpeta desde la que se ejecutan los comandos.
- **`PATH`:** variable que indica en qué directorios busca ejecutables el shell.
- **HCL:** lenguaje de configuración utilizado por Terraform.
- **IaC:** infraestructura como código.
- **Módulo:** conjunto de configuración Terraform reutilizable.
- **Plan:** representación de cambios que Terraform prevé realizar.
- **Proveedor:** plugin que permite a Terraform interactuar con una plataforma.
- **Recurso:** objeto descrito y gestionado por Terraform.
- **Estado:** registro que relaciona configuración y objetos administrados.
- **`terraform init`:** comando que prepara el directorio de trabajo.
- **`terraform fmt`:** comando que formatea archivos Terraform.
- **`terraform validate`:** comando que valida la configuración.
- **`terraform plan`:** comando que calcula cambios previstos.
- **`terraform apply`:** comando que puede aplicar cambios.
- **`terraform destroy`:** comando que puede eliminar recursos gestionados.
- **Workspace de Jenkins:** directorio de trabajo asignado a un job.
- **`.terraform/`:** directorio de datos local de trabajo.
- **`.terraform.lock.hcl`:** archivo de bloqueo de proveedores.
- **`terraform.tfstate`:** archivo de estado local habitual.
- **Checksum:** valor utilizado para comprobar integridad.
- **Integridad:** garantía de que un archivo corresponde al contenido esperado.
- **Versión:** release identificable de una herramienta o dependencia.

---

## Síntesis

Preparar el entorno no consiste solo en instalar Terraform: también implica saber qué versión se usa, en qué directorio se trabaja, qué archivos se comparten y qué datos deben quedar fuera del repositorio.

- Comprueba Terraform y Git antes de comenzar.
- Usa un método de instalación aprobado.
- Aísla el proyecto en un directorio de laboratorio.
- Declara los requisitos de versión del proyecto.
- Comprueba formato y validez antes de avanzar.
- Usa `terraform init -backend=false` únicamente para los ejercicios locales que lo requieren.
- Revisa el estado de Git antes de confirmar cambios.
- Excluye datos temporales y sensibles según la política.
- Distingue tu terminal del agente que ejecuta Jenkins.
- No configures credenciales cloud ni backends reales para esta práctica.
- No ejecutes `apply` o `destroy` en una cuenta real.

## Actividad de cierre

Entrega una ficha breve con:

1. Sistema operativo y terminal.
2. Versión de Terraform.
3. Versión de Git.
4. Método aprobado de instalación.
5. Estructura del directorio.
6. Resultado de `terraform fmt -check`.
7. Resultado de `terraform init -backend=false`.
8. Resultado de `terraform validate`.
9. Resumen del plan local.
10. Archivos excluidos de Git.
11. Diferencia observada entre el entorno local y Jenkins, si se utilizó.
12. Una limitación o riesgo que hayas identificado.

No incluyas credenciales, archivos de estado, planes guardados, rutas personales completas ni datos internos restringidos.