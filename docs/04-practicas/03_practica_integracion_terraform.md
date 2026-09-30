# Práctica de integración de Terraform con Jenkins

Esta práctica integra Terraform en un pipeline de Jenkins para comprobar y planificar cambios de infraestructura como código. El flujo de laboratorio valida el formato, inicializa Terraform sin configurar un backend remoto, valida la configuración y genera un plan con recursos locales de prueba. **No crea infraestructura en la nube ni ejecuta `terraform apply`.**

El laboratorio enseña a conectar herramientas, repositorio y pipeline sin exponer credenciales ni modificar recursos compartidos. También explica qué cambia cuando Terraform se usa con un proveedor cloud y por qué el estado, los permisos, la aprobación y la revisión del plan requieren controles adicionales.

> **Regla de seguridad:** ejecuta las sesiones únicamente en la carpeta, repositorio y agente autorizados. No añadas credenciales cloud, no uses un backend de producción y no ejecutes `terraform apply` como parte de esta práctica. El plan puede incluir información sensible: no lo publiques ni lo archives sin una política aprobada.

---

## Objetivos y alcance

La práctica conecta Terraform con Jenkins para automatizar comprobaciones reproducibles de una configuración de infraestructura.

### Resultados de aprendizaje

Al completar la práctica, podrás:

- Explicar qué problema resuelve Terraform.
- Identificar los archivos Terraform básicos.
- Distinguir configuración, proveedor, recurso y estado.
- Describir la diferencia entre `plan` y `apply`.
- Crear un pipeline declarativo que invoque Terraform.
- Comprobar la versión de Terraform del agente.
- Ejecutar `terraform fmt -check`.
- Inicializar Terraform en un modo apropiado para el laboratorio.
- Ejecutar `terraform validate`.
- Generar un plan sin aplicar cambios.
- Reconocer que un plan puede contener información sensible.
- Diagnosticar errores de formato, inicialización y validación.
- Evitar almacenar credenciales en el repositorio.
- Explicar por qué el estado debe protegerse.
- Documentar una ejecución con datos no sensibles.

### Qué se construirá

El pipeline de laboratorio ejecutará estas comprobaciones:

1. Obtendrá el repositorio mediante la configuración del job.
2. Verificará que Terraform esté disponible.
3. Comprobará el formato de los archivos.
4. Inicializará Terraform con el backend remoto deshabilitado.
5. Validará la configuración.
6. Generará un plan de prueba.
7. Informará del resultado final.

### Qué queda fuera

Este laboratorio **no**:

- Se conecta a AWS, Azure, Google Cloud u otro proveedor.
- Guarda credenciales cloud.
- Configura un backend remoto de producción.
- Modifica recursos de infraestructura.
- Ejecuta `terraform apply`.
- Destruye recursos.
- Comparte un archivo de estado.
- Publica planes en un repositorio público.
- Autoriza despliegues o cambios en cuentas reales.

### Política de comandos

Durante las sesiones, el pipeline puede ejecutar:

```text
terraform version
terraform fmt -check -recursive
terraform init -backend=false -input=false
terraform validate
terraform plan -input=false
```

No agregues estos comandos sin entender sus opciones.

En particular, no sustituyas el plan de laboratorio por `apply`.

### Práctica y producción

Un pipeline que valida Terraform no es automáticamente un pipeline seguro para aplicar infraestructura.

Un flujo real necesita, entre otras cosas:

- Identidad y credenciales controladas.
- Backend remoto aprobado.
- Estado con acceso limitado.
- Bloqueo de estado.
- Revisión de cambios.
- Separación entre entornos.
- Aprobación adecuada.
- Registro y auditoría.
- Procedimiento de reversión y respuesta a incidentes.

---

## Conceptos de Terraform y Jenkins

Para integrar ambas herramientas, es importante saber qué ejecuta Terraform y dónde lo ejecuta Jenkins.

### Terraform

Terraform es una herramienta de infraestructura como código.

Lee archivos declarativos y calcula qué cambios serían necesarios para aproximar la infraestructura al estado descrito.

No crea recursos solo porque exista un archivo `.tf`.

El comando que se ejecute determina la acción.

### Infraestructura como código

Infraestructura como código permite describir recursos y configuración en archivos versionables.

Esto facilita:

- Revisar cambios.
- Comparar versiones.
- Repetir comprobaciones.
- Detectar diferencias antes de aplicar.
- Documentar quién propuso una modificación.

El control de versiones no sustituye permisos ni revisión.

### Configuración

Los archivos `.tf` describen elementos de Terraform.

Pueden definir:

- Requisitos de Terraform.
- Proveedores.
- Recursos.
- Variables.
- Salidas.
- Módulos.
- Backend.
- Configuración de datos.

En el laboratorio solo se utilizará una configuración local y sin proveedor cloud.

### Proveedor

Un proveedor es un plugin de Terraform que permite interactuar con una API o servicio.

Ejemplos de categorías:

- Proveedores cloud.
- Proveedores de DNS.
- Proveedores de bases de datos.
- Proveedores de servicios SaaS.
- Proveedores locales.

La práctica no declara ni usa un proveedor cloud.

### Recurso

Un recurso es un objeto que Terraform administra.

Puede representar un elemento de infraestructura real o un objeto local de prueba.

En esta práctica se utiliza `terraform_data`, un tipo integrado en Terraform moderno que no crea un recurso cloud.

### Módulo

Un módulo agrupa configuración Terraform para reutilizarla.

Un módulo puede ser:

- El módulo raíz del repositorio.
- Un subdirectorio local.
- Un módulo descargado desde otra fuente.

No agregues módulos externos no aprobados al laboratorio.

### Estado de Terraform

El estado relaciona los objetos descritos en la configuración con los objetos administrados por Terraform.

El estado puede contener:

- Identificadores de recursos.
- Atributos.
- Metadatos.
- Valores sensibles.
- Datos necesarios para planificar cambios.

El archivo local habitual se llama:

```text
terraform.tfstate
```

Trata el estado como información sensible.

### Estado local y remoto

- **Estado local:** guardado en el directorio de trabajo.
- **Estado remoto:** almacenado en un backend configurado, sujeto a los controles de ese servicio.

La práctica no debe usar un estado de producción ni un backend remoto compartido.

### Backend

El backend define cómo Terraform almacena y bloquea el estado.

Un backend remoto puede ofrecer:

- Almacenamiento centralizado.
- Bloqueo de estado.
- Control de acceso.
- Recuperación.
- Auditoría.

La configuración concreta depende de la organización.

### Plan

`terraform plan` calcula los cambios previstos y muestra qué acciones podrían realizarse.

Un plan no equivale a una aprobación.

Un plan guardado puede incluir valores de configuración y datos sensibles.

### Aplicación

`terraform apply` puede ejecutar cambios reales.

Puede crear, modificar o destruir recursos.

No se ejecutará en esta práctica.

### Destrucción

`terraform destroy` puede eliminar infraestructura.

No se utilizará en el laboratorio.

Nunca lo ejecutes como una forma rápida de limpiar un entorno compartido.

### Jenkins

Jenkins coordina la secuencia:

- Obtiene el código.
- Selecciona un agente.
- Ejecuta herramientas.
- Recoge resultados.
- Presenta logs.
- Marca el resultado.

Jenkins no elimina los riesgos propios del acceso a infraestructura.

### Agente Jenkins

Terraform se ejecuta en el agente asignado.

El agente debe tener:

- Una versión de Terraform compatible.
- Acceso al repositorio.
- Permisos adecuados.
- Espacio temporal suficiente.
- Conectividad requerida por el flujo.

Un agente no debería disponer de permisos cloud innecesarios.

### Pipeline

El pipeline define una secuencia de etapas.

En esta práctica, el flujo se divide en:

- Verificación de herramientas.
- Formato.
- Inicialización.
- Validación.
- Planificación.

### `Jenkinsfile`

El `Jenkinsfile` debe versionarse junto con el proyecto cuando sea posible.

Los cambios del `Jenkinsfile` también son código ejecutable y deben revisarse.

---

## Arquitectura de la práctica

El diseño separa la validación del código de cualquier aplicación real de infraestructura.

### Flujo de trabajo

```text
Repositorio de laboratorio
          |
          v
Jenkins obtiene la revisión
          |
          v
Agente con Terraform
          |
          +--> Comprueba versión
          |
          +--> Comprueba formato
          |
          +--> Inicializa sin backend remoto
          |
          +--> Valida la configuración
          |
          +--> Genera un plan local
          |
          v
Resultado visible en Jenkins
```

### Componentes

- **Repositorio:** almacena archivos `.tf` y el `Jenkinsfile`.
- **Job de Jenkins:** selecciona la rama y define cómo cargar el pipeline.
- **Agente:** ejecuta Terraform.
- **Terraform CLI:** analiza e interpreta la configuración.
- **Workspace:** contiene el checkout y los archivos temporales.
- **Consola:** muestra el resultado de los pasos.
- **Backend:** no se usa para un estado compartido en este laboratorio.

### Límite de red

El ejemplo no necesita acceso a una API cloud.

Si Terraform intenta descargar proveedores o módulos, puede necesitar acceso a un registro aprobado.

No des acceso de red más amplio del necesario.

### Sin credenciales cloud

La configuración de laboratorio no debe tener credenciales cloud.

Si un job empieza a requerir credenciales para esta práctica, detente y consulta al docente.

### Sin estado compartido

No conectes el laboratorio a un backend de producción.

No reutilices un archivo `terraform.tfstate` de otro equipo.

No compartas el mismo estado entre trabajos de alumnado.

### Estado temporal

Terraform puede crear archivos temporales en el workspace.

Jenkins o el agente pueden limpiar el workspace al terminar, según la política.

Eso no debe confundirse con una estrategia de almacenamiento de estado para producción.

### Qué puede quedar en el workspace

Según los comandos y el agente, podrían aparecer:

- `.terraform/`
- `.terraform.lock.hcl`
- `terraform.tfstate`
- `terraform.tfstate.backup`
- Archivos de plan.
- Logs.
- Código descargado.

Revisa qué debe conservarse y qué debe limpiarse.

### No archivar por defecto los planes

Un archivo de plan binario puede contener información sensible.

No lo archives sin una política de acceso, retención y revisión aprobada.

El ejemplo no archiva el plan.

---

## Preparación del proyecto Terraform

El proyecto de laboratorio emplea recursos locales para evitar llamadas a proveedores externos.

### Requisitos de versión

La configuración usa `terraform_data`.

Este recurso está disponible desde Terraform 1.4.

Se requiere una versión de Terraform compatible con el agente asignado.

La versión concreta del laboratorio debe confirmarse con el docente.

### Estructura del repositorio

Crea una estructura como esta:

```text
integracion-terraform/
├── Jenkinsfile
├── README.md
└── terraform/
    ├── main.tf
    └── outputs.tf
```

El directorio `terraform` contiene la configuración.

El `Jenkinsfile` permanece en la raíz.

### Crear el directorio

```bash
mkdir -p terraform
```

### Archivo `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "laboratorio" {
  input = {
    proyecto    = "integracion-terraform"
    entorno     = "laboratorio"
    propietario = "curso"
  }
}
```

Este recurso utiliza el proveedor integrado de Terraform.

No crea instancias, redes ni servicios cloud.

### Archivo `terraform/outputs.tf`

```hcl
output "resumen_laboratorio" {
  description = "Datos no sensibles del ejercicio"
  value       = terraform_data.laboratorio.output
}
```

La salida describe información de laboratorio.

No añadas contraseñas, tokens ni datos personales.

### Archivo `README.md`

```text
Laboratorio de integración entre Jenkins y Terraform.
El pipeline valida formato y configuración, y genera un plan local.
No aplica cambios de infraestructura.
```

### Qué hace `required_version`

El bloque:

```hcl
required_version = ">= 1.4.0, < 2.0.0"
```

define el rango de versiones de Terraform aceptadas.

Ajusta el rango solo con una decisión del equipo o del curso.

### Qué hace `terraform_data`

`terraform_data` es un recurso integrado para almacenar datos dentro del modelo de Terraform.

En este ejercicio sirve para demostrar planificación sin llamar a un proveedor cloud.

No es una simulación de una infraestructura de producción.

### Archivo de bloqueo

Si se inicializan proveedores externos, Terraform puede crear:

```text
.terraform.lock.hcl
```

Ese archivo registra selecciones de proveedores.

En este ejercicio no se declara un proveedor externo, por lo que el archivo puede no aparecer.

No elimines un archivo de bloqueo de un proyecto real sin revisar sus implicaciones.

### `.gitignore` de laboratorio

Para evitar confirmar archivos de trabajo local, se puede usar un `.gitignore` como este:

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

El patrón debe ajustarse a la política del proyecto.

No uses `.gitignore` como sustituto de revisar lo que se confirma.

### No ignorar el archivo de bloqueo a ciegas

`.terraform.lock.hcl` puede ser importante para reproducir versiones de proveedores.

No lo excluyas sin comprender la política del proyecto.

### Evitar archivos locales sensibles

No añadas:

- Archivos `*.tfvars` con secretos.
- Archivos de credenciales cloud.
- Variables exportadas desde cuentas personales.
- Estados de producción.
- Planes binarios no revisados.

---

## Validación local del proyecto

Antes de integrar con Jenkins, es útil probar la configuración localmente.

### Comprobar Terraform

```bash
terraform version
```

Registra la versión, no información sensible del entorno.

### Formatear los archivos

```bash
terraform fmt -recursive
```

Este comando modifica el formato de archivos Terraform.

Utilízalo en el checkout local del proyecto, no como sustituto de la comprobación de CI.

### Comprobar formato

```bash
terraform fmt -check -recursive
```

Este comando falla si los archivos no están formateados según el formato estándar de Terraform.

No debería modificar los archivos.

### Inicializar sin backend remoto

```bash
terraform init -backend=false -input=false
```

La opción `-backend=false` evita configurar un backend.

Es apropiada para el laboratorio local, que no debe utilizar estado remoto compartido.

### Validar configuración

```bash
terraform validate
```

La validación comprueba aspectos estructurales de la configuración inicializada.

No demuestra que una infraestructura real sea segura ni que un plan sea correcto.

### Generar un plan

```bash
terraform plan -input=false
```

El plan del ejemplo solo trabaja con el recurso local de prueba.

No agregues un proveedor cloud al proyecto de laboratorio.

### Plan guardado

Un plan guardado se puede crear con:

```bash
terraform plan -input=false -out=plan.tfplan
```

El archivo `plan.tfplan` puede contener datos sensibles.

No lo subas a Git.

No lo archives sin una política aprobada.

### Inspeccionar un plan

El comando `terraform show` puede mostrar detalles del plan:

```bash
terraform show -no-color plan.tfplan
```

La salida puede revelar valores de configuración.

Solo la debes revisar en un entorno de laboratorio con datos no sensibles.

### Probar desde una copia limpia

Para evitar depender de archivos temporales:

1. Usa un checkout limpio.
2. Confirma que están versionados los `.tf` requeridos.
3. Ejecuta `fmt -check`.
4. Ejecuta `init -backend=false`.
5. Ejecuta `validate`.
6. Ejecuta `plan`.
7. Comprueba el resultado.
8. No reutilices un estado de otra actividad.

---

## Preparar Jenkins

El pipeline necesita un agente con Terraform y acceso al repositorio.

### Agente de laboratorio

Solicita o identifica el agente asignado al curso.

Registra:

- Etiqueta.
- Sistema operativo.
- Terraform instalado.
- Git disponible.
- Permisos de workspace.
- Política de limpieza.

### No ejecutar Terraform como administrador

El agente debería ejecutar con permisos mínimos.

La práctica no necesita privilegios administrativos.

No solicites permisos de root para resolver un problema de PATH.

### Terraform preinstalado

La opción recomendada para este laboratorio es que el agente tenga Terraform instalado mediante la configuración aprobada.

Comprueba la versión desde el propio pipeline.

### Imagen o herramienta administrada

Si el curso usa contenedores o herramientas instaladas por Jenkins, verifica:

- Versión de Terraform.
- Imagen o instalador aprobado.
- Compatibilidad con el agente.
- Origen de los binarios.
- Política de actualización.

No descargues ejecutables desde una URL no aprobada durante el job.

### No instalar Terraform a ciegas

No añadas al pipeline una descarga sin validar de un binario de Terraform.

Si Terraform falta:

1. Registra el agente.
2. Registra el mensaje de error.
3. Consulta al administrador.
4. Utiliza el agente preparado.
5. No modifiques el sistema compartido.

### Repositorio SCM

El job debe apuntar al repositorio autorizado.

Comprueba:

- URL.
- Rama.
- Credencial, si corresponde.
- Ruta del `Jenkinsfile`.
- Commit procesado.
- Permisos de lectura.

### Job Pipeline

Puedes crear:

- Un Pipeline con script desde la interfaz.
- Un Pipeline from SCM que cargue el `Jenkinsfile`.

Para una actividad revisable, se recomienda versionar el archivo junto al proyecto.

### Credenciales SCM

Si el repositorio es privado:

- Usa una credencial administrada por Jenkins.
- No guardes el token en el `Jenkinsfile`.
- No añadas el token a la URL.
- No imprimas el entorno completo.
- Limita la credencial al job o carpeta correspondiente.

### Credenciales de proveedor

El laboratorio no requiere credenciales de proveedor cloud.

No crees una credencial AWS, Azure, Google Cloud ni de otro proveedor para completar esta práctica.

### Variables del entorno

Las variables del agente pueden afectar Terraform.

Evita imprimir:

```bash
env
```

Las variables de entorno pueden contener credenciales.

En su lugar, comprueba solo lo necesario y no sensible.

### Concurrencia

Cada build debería usar un workspace aislado o una política que evite conflictos.

Si varios builds usan el mismo backend real, el bloqueo de estado y la coordinación son esenciales.

Este laboratorio no usa ese caso.

---

## Construir el pipeline

El pipeline ejecutará Terraform en etapas visibles y verificables.

### Estructura básica

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    stages {
        stage('Verificar Terraform') {
            steps {
                sh 'terraform version'
            }
        }
    }
}
```

La etiqueta `terraform-lab` es un ejemplo.

Sustitúyela por la etiqueta autorizada del curso.

### Seleccionar el agente

Utiliza el agente que tenga Terraform instalado.

No asumas que `agent any` seleccionará siempre un nodo apropiado.

Una etiqueta incorrecta puede dejar el job esperando indefinidamente.

### Opciones útiles

```groovy
options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
}
```

Las opciones disponibles pueden variar según Jenkins y los plugins.

El timeout debe permitir checkout e inicialización normales.

### Declarar directorio de trabajo

El proyecto se encuentra en:

```text
terraform
```

Los comandos se pueden ejecutar desde ese directorio.

Una forma declarativa habitual es:

```groovy
dir('terraform') {
    sh 'terraform validate'
}
```

Comprueba que la carpeta existe en el checkout.

### Verificar versión

```groovy
stage('Verificar Terraform') {
    steps {
        sh 'terraform version'
    }
}
```

La salida permite diagnosticar la versión del agente.

No registres variables de entorno completas junto con la versión.

### Comprobar formato

```groovy
stage('Formato') {
    steps {
        dir('terraform') {
            sh 'terraform fmt -check -recursive'
        }
    }
}
```

Si el formato no es correcto, el paso falla.

La corrección del formato debería realizarse en el código versionado y revisarse en un cambio.

### Formato automático en CI

Evita que el pipeline modifique silenciosamente el repositorio para corregir formato.

En CI, `fmt -check` sirve para verificar.

El desarrollador puede ejecutar `terraform fmt` localmente y confirmar el cambio.

### Inicialización

Para este laboratorio:

```groovy
stage('Inicializar') {
    steps {
        dir('terraform') {
            sh 'terraform init -backend=false -input=false -no-color'
        }
    }
}
```

`-backend=false` evita configurar un backend remoto.

No elimines esta opción en el laboratorio sin autorización.

### Qué puede descargar `init`

Según la configuración, `terraform init` puede descargar:

- Proveedores.
- Módulos.
- Componentes auxiliares.

La descarga debe limitarse a fuentes aprobadas.

El proyecto de práctica no necesita proveedores cloud externos.

### Validación

```groovy
stage('Validar') {
    steps {
        dir('terraform') {
            sh 'terraform validate -no-color'
        }
    }
}
```

`validate` comprueba la configuración en el contexto inicializado.

No crea recursos de infraestructura.

### Plan de laboratorio

```groovy
stage('Planificar') {
    steps {
        dir('terraform') {
            sh 'terraform plan -input=false -no-color'
        }
    }
}
```

El plan muestra cambios previstos.

En este ejemplo los recursos son locales y de prueba.

### Plan guardado

Si se guarda un plan:

```groovy
sh 'terraform plan -input=false -no-color -out=plan.tfplan'
```

Trátalo como un archivo sensible.

No lo archives por defecto.

No lo subas al repositorio.

### Publicación del plan

El plan de laboratorio puede mostrarse en la consola porque no contiene credenciales ni datos de infraestructura real.

En proyectos reales, el plan puede incluir información confidencial.

Define controles antes de:

- Imprimirlo.
- Compartirlo.
- Guardarlo.
- Archivar el binario.
- Adjuntarlo a una revisión.

### Archivar salidas seguras

Si se crea un informe de laboratorio no sensible, se puede archivar con un patrón concreto.

No archives el directorio completo.

No archives `terraform.tfstate` ni planes sin autorización.

### Limpieza del workspace

El workspace puede conservar archivos temporales dependiendo del agente y la configuración.

Usa el procedimiento de limpieza aprobado por el curso.

No ejecutes comandos amplios de borrado.

No borres rutas externas al workspace.

### Errores de una etapa

Una etapa que falla debería detener las dependientes.

Si `validate` falla, no conviene generar un plan como si la configuración fuera válida.

### Mensajes de diagnóstico

Usa mensajes claros:

```text
La etapa Formato falló. Ejecuta terraform fmt y revisa el cambio antes de confirmarlo.
```

No incluyas secretos ni valores de estado.

---

## Pipeline completo de laboratorio

El ejemplo siguiente solo valida y planifica la configuración local.

### Jenkinsfile

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Verificar herramientas') {
            steps {
                sh 'terraform version'
                sh 'git --version'
            }
        }

        stage('Comprobar formato') {
            steps {
                dir('terraform') {
                    sh 'terraform fmt -check -recursive'
                }
            }
        }

        stage('Inicializar sin backend remoto') {
            steps {
                dir('terraform') {
                    sh 'terraform init -backend=false -input=false -no-color'
                }
            }
        }

        stage('Validar configuración') {
            steps {
                dir('terraform') {
                    sh 'terraform validate -no-color'
                }
            }
        }

        stage('Generar plan de laboratorio') {
            steps {
                dir('terraform') {
                    sh 'terraform plan -input=false -no-color'
                }
            }
        }
    }

    post {
        success {
            echo 'Formato, inicialización, validación y plan terminaron correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        aborted {
            echo 'La ejecución se interrumpió.'
        }

        always {
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Por qué no hay `apply`

El pipeline no contiene:

```text
terraform apply
```

Esto es intencional.

La práctica enseña la integración y la inspección del plan, no la modificación de infraestructura.

### Por qué se usa `-backend=false`

La opción evita configurar el backend para esta inicialización de laboratorio.

No debe tomarse como una recomendación para una infraestructura real.

Un entorno real necesita un backend diseñado, protegido y administrado.

### Por qué se ejecuta `init` antes de `validate`

Terraform necesita preparar el directorio de trabajo para ciertas operaciones.

La inicialización puede configurar backend, proveedores y módulos según el proyecto.

En este laboratorio, el backend está deshabilitado y no se usa un proveedor cloud.

### Por qué se ejecuta `fmt -check`

El paso detecta archivos que necesitan formato estándar.

No modifica el repositorio.

El cambio debe corregirse y revisarse en el flujo normal de Git.

### Por qué no se archiva el plan

El plan guardado puede contener valores sensibles.

El pipeline de práctica imprime el plan local de prueba para fines educativos.

No conserva un archivo de plan como artefacto.

### Adaptar la etiqueta

Sustituye:

```groovy
label 'terraform-lab'
```

por la etiqueta autorizada.

No uses una etiqueta de controlador ni un agente con privilegios mayores solo para evitar una espera.

### Adaptar el directorio

Si la configuración Terraform no está en `terraform/`, ajusta los bloques `dir`.

No uses una ruta absoluta del equipo de una persona.

### No ejecutar varias veces `init` sin propósito

`init` prepara el directorio de trabajo.

Ejecutarlo repetidamente puede ser necesario después de cambios, pero no debe añadirse en cada etapa sin motivo.

### Código con `returnStatus`

Si se requiere interpretar el resultado de un comando, `returnStatus` puede utilizarse.

No lo uses para ignorar un error.

Ejemplo conceptual:

```groovy
script {
    int codigo = sh(
        returnStatus: true,
        script: 'terraform validate -no-color'
    )

    if (codigo != 0) {
        error "terraform validate terminó con código ${codigo}."
    }
}
```

La forma simple de `sh` ya falla ante un código no cero en la mayoría de los casos.

Capturar el código tiene sentido si el pipeline debe tratar resultados de forma explícita y segura.

---

## Integración segura en entornos reales

La práctica no configura infraestructura real, pero es importante entender las diferencias.

### Backend remoto y estado

Un backend remoto puede centralizar el estado y ofrecer bloqueo.

El diseño debe definir:

- Servicio de almacenamiento.
- Cifrado.
- Acceso por identidad.
- Bloqueo concurrente.
- Retención.
- Copias de seguridad.
- Recuperación.
- Auditoría.
- Separación de entornos.

No configures un backend real en el ejercicio.

### Estado compartido

Dos ejecuciones no deben modificar el mismo estado simultáneamente sin controles de bloqueo.

Sin bloqueo, las operaciones pueden competir y producir inconsistencias.

La configuración depende del backend y de Terraform.

### Estado como dato sensible

El estado puede contener información que no se espera ver en consola.

No:

- Lo imprimas.
- Lo confirmes en Git.
- Lo adjuntes a una tarea.
- Lo archives sin política.
- Lo copies entre estudiantes.

### Plan binario como dato sensible

Un plan binario puede incluir valores de configuración y atributos de recursos.

Guárdalo solo en un sistema con controles aprobados.

Limita:

- Acceso.
- Duración de conservación.
- Uso posterior.
- Asociación con el commit y la revisión.

### Credenciales del proveedor

En producción, Terraform puede necesitar autenticarse con un proveedor.

La práctica no necesita esas credenciales.

En un flujo real, la identidad debería:

- Tener permisos mínimos.
- Estar asociada al job apropiado.
- No ser permanente si existe una identidad temporal aprobada.
- No aparecer en logs.
- Ser revocable y auditable.

### No guardar credenciales en archivos Terraform

No codifiques secretos en:

- `main.tf`.
- `variables.tf`.
- `terraform.tfvars`.
- `*.auto.tfvars`.
- El `Jenkinsfile`.
- Parámetros de texto normal.

Usa el mecanismo de credenciales aprobado por la organización.

### Jenkins Credentials

Jenkins puede almacenar credenciales para jobs y carpetas.

La forma de enlazarlas depende del tipo de credencial y de la instancia.

No copies un ejemplo genérico y lo uses con una cuenta real sin revisión.

### Variables `TF_VAR_*`

Terraform puede utilizar variables de entorno con nombres `TF_VAR_*`.

Su uso no hace que el valor sea secreto por sí mismo.

El valor puede quedar expuesto mediante logs, procesos, archivos o planes.

No uses variables de entorno para esconder una credencial sin evaluar el riesgo.

### Argumentos de línea de comandos

Evita pasar secretos como argumentos de línea de comandos.

Pueden quedar visibles en:

- Logs.
- Listados de procesos.
- Historiales.
- Diagnósticos.

Sigue la integración segura definida para el proveedor y Jenkins.

### Separar validación y aplicación

Un flujo real suele separar:

- Validación de sintaxis.
- Planificación.
- Revisión.
- Aprobación.
- Aplicación.
- Comprobación posterior.

La persona o sistema que aprueba el cambio debe tener información suficiente y confianza apropiada.

### Aprobación humana

Una aprobación no debería ser una pausa decorativa.

Debe requerir:

- Revisión del plan.
- Identidad autorizada.
- Entorno correcto.
- Commit correcto.
- Plan asociado a la revisión.
- Política documentada.

### No aplicar desde cualquier rama

Un flujo de producción debería limitar las acciones según:

- Rama protegida.
- Revisión aprobada.
- Entorno.
- Identidad.
- Rol.
- Estado de pruebas.
- Política de cambios.

No añadas una etapa de aplicación a esta práctica.

### Workspaces paralelos

Terraform puede usar archivos locales en el workspace.

Si dos builds comparten directorio o estado local, pueden interferir.

Diseña concurrencia y workspace de acuerdo con el backend y el agente.

### Separación por entornos

Desarrollo, prueba y producción deberían tener límites claros.

Pueden variar:

- Backend.
- Credenciales.
- Permisos.
- Variables.
- Aprobadores.
- Políticas.
- Recursos permitidos.

No uses la cuenta de producción en sesiones de práctica.

### Módulos externos

Un módulo remoto puede ejecutar lógica de proveedor o introducir cambios de comportamiento.

Revisa:

- Fuente.
- Versión.
- Integridad.
- Mantenimiento.
- Licencia.
- Seguridad.
- Compatibilidad.

No agregues módulos externos no aprobados al laboratorio.

### Proveedores externos

Los proveedores se descargan y ejecutan como plugins.

Usa versiones fijadas según la política del proyecto.

Revisa:

- Origen.
- Versión.
- Checksums.
- Archivo de bloqueo.
- Cambios de versión.
- Permisos que solicita la configuración.

### Costos

Los recursos cloud pueden generar costos incluso durante pruebas.

Antes de cualquier actividad real, define:

- Cuenta.
- Presupuesto.
- Región.
- Recursos permitidos.
- Etiquetas.
- Duración.
- Política de limpieza.
- Responsable.

Esta práctica no crea recursos cloud.

---

## Sesiones prácticas

Las sesiones avanzan desde la inspección hasta la integración completa del pipeline.

### Preparación general de las sesiones

Antes de cada sesión:

- Confirma que el repositorio es de laboratorio.
- Usa un agente autorizado.
- Comprueba la versión de Terraform.
- No accedas a cuentas cloud.
- No configures credenciales de proveedor.
- No uses un backend compartido.
- No ejecutes `apply` ni `destroy`.
- Guarda el número del build.
- Restaura cambios de prueba al terminar.

### Sesión 1: dibujar la arquitectura

**Objetivo:** identificar qué componente ejecuta cada tarea.

#### Actividad

Dibuja:

```text
Git
 |
 v
Jenkins
 |
 v
Agente de laboratorio
 |
 v
Terraform CLI
 |
 +--> fmt
 +--> init -backend=false
 +--> validate
 +--> plan
```

#### Preguntas

- ¿Dónde se ejecuta Terraform?
- ¿Qué componente selecciona el agente?
- ¿Qué aporta el repositorio?
- ¿Qué no hace esta arquitectura?
- ¿Qué datos no deberían entrar en la consola?

### Sesión 2: comprobar la versión local

**Objetivo:** relacionar versión y compatibilidad.

#### Comando

```bash
terraform version
```

#### Instrucciones

1. Ejecuta el comando en tu entorno local autorizado.
2. Anota la versión.
3. Compara con `required_version`.
4. No instales otra versión sin permiso.
5. Explica qué sucedería si el agente tuviera una versión incompatible.

### Sesión 3: crear la estructura del repositorio

**Objetivo:** preparar los archivos mínimos.

Crea:

```text
Jenkinsfile
README.md
terraform/main.tf
terraform/outputs.tf
```

#### Instrucciones

1. Crea el directorio `terraform`.
2. Escribe `main.tf`.
3. Escribe `outputs.tf`.
4. Añade un README que describa el alcance.
5. Revisa que ningún archivo incluya secretos.
6. Ejecuta `git status`.

### Sesión 4: ejecutar `terraform fmt`

**Objetivo:** aplicar el formato estándar localmente.

#### Comandos

```bash
terraform fmt -recursive
```

Después:

```bash
terraform fmt -check -recursive
```

#### Instrucciones

1. Ejecuta el primer comando.
2. Revisa el diff.
3. Ejecuta el segundo comando.
4. Confirma que no quedan archivos pendientes de formato.
5. No permitas que Jenkins reescriba el repositorio sin revisión.

### Sesión 5: inicializar sin backend

**Objetivo:** preparar Terraform sin usar un estado remoto.

#### Comando

```bash
terraform init -backend=false -input=false
```

#### Instrucciones

1. Ejecuta desde el directorio `terraform`.
2. Lee los mensajes.
3. Comprueba si hay proveedores externos.
4. Confirma que no se configuró backend remoto.
5. No apuntes a un backend compartido.

### Sesión 6: validar la configuración

**Objetivo:** detectar errores estructurales.

#### Comando

```bash
terraform validate
```

#### Instrucciones

1. Ejecuta tras `init`.
2. Registra si la configuración es válida.
3. Cambia una palabra clave de forma controlada en una copia.
4. Ejecuta de nuevo.
5. Observa el diagnóstico.
6. Restaura el archivo válido.

### Sesión 7: generar un plan local

**Objetivo:** distinguir el plan de la aplicación.

#### Comando

```bash
terraform plan -input=false
```

#### Instrucciones

1. Ejecuta solo sobre la configuración de laboratorio.
2. Revisa las acciones previstas.
3. Confirma que no se conecta a un proveedor cloud.
4. No ejecutes `terraform apply`.
5. Explica qué informa el plan y qué no garantiza.

### Sesión 8: guardar un plan y revisar su riesgo

**Objetivo:** reconocer que un archivo de plan puede ser sensible.

#### Comando supervisado

```bash
terraform plan -input=false -out=plan.tfplan
```

#### Instrucciones

1. Ejecuta solo con la configuración local aprobada.
2. Comprueba que el archivo se creó.
3. No lo subas a Git.
4. No lo archives.
5. Inspecciónalo solo si el docente lo autoriza.
6. Elimínalo mediante el procedimiento aprobado para el workspace.

#### Preguntas

- ¿Qué podría contener el plan?
- ¿Por qué no conviene publicarlo?
- ¿Qué controles harían falta para conservarlo?

### Sesión 9: construir un Pipeline mínimo

**Objetivo:** invocar Terraform desde Jenkins.

#### Jenkinsfile

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    stages {
        stage('Versión') {
            steps {
                sh 'terraform version'
            }
        }
    }
}
```

#### Instrucciones

1. Sustituye la etiqueta por la asignada.
2. Guarda en el repositorio.
3. Ejecuta el job.
4. Comprueba la versión en consola.
5. Anota el número del build.
6. No compartas logs completos si contienen información restringida.

### Sesión 10: añadir formato

**Objetivo:** hacer que CI detecte archivos sin formato.

Añade:

```groovy
stage('Formato') {
    steps {
        dir('terraform') {
            sh 'terraform fmt -check -recursive'
        }
    }
}
```

#### Instrucciones

1. Guarda el cambio.
2. Ejecuta el pipeline con los archivos formateados.
3. Registra el resultado.
4. Cambia la indentación en una copia de práctica.
5. Ejecuta de nuevo.
6. Restaura y formatea localmente.

### Sesión 11: añadir inicialización segura

**Objetivo:** inicializar Terraform en el contexto de laboratorio.

Añade:

```groovy
stage('Inicializar') {
    steps {
        dir('terraform') {
            sh 'terraform init -backend=false -input=false -no-color'
        }
    }
}
```

#### Instrucciones

1. Comprueba el directorio de trabajo.
2. Ejecuta el pipeline.
3. Revisa si Terraform solicita entrada interactiva.
4. Comprueba que no aparece un backend remoto.
5. Registra cualquier advertencia.
6. No retires `-backend=false` en este ejercicio.

### Sesión 12: añadir validación

**Objetivo:** validar la configuración antes de planificar.

Añade:

```groovy
stage('Validar configuración') {
    steps {
        dir('terraform') {
            sh 'terraform validate -no-color'
        }
    }
}
```

#### Instrucciones

1. Ejecuta con `main.tf` válido.
2. Cambia una estructura de forma controlada en una copia.
3. Vuelve a ejecutar.
4. Identifica el primer error.
5. Restaura la configuración.
6. Explica por qué `validate` no aplica cambios.

### Sesión 13: añadir el plan

**Objetivo:** integrar la planificación en CI.

Añade:

```groovy
stage('Plan') {
    steps {
        dir('terraform') {
            sh 'terraform plan -input=false -no-color'
        }
    }
}
```

#### Instrucciones

1. Ejecuta el pipeline completo.
2. Revisa la salida del plan.
3. Comprueba que no se ejecutó `apply`.
4. Registra el resumen del plan sin copiar información confidencial.
5. Explica qué diferencia hay entre planificar y aplicar.

### Sesión 14: provocar un error de formato

**Objetivo:** probar una validación de calidad.

#### Instrucciones

1. Modifica el formato de un archivo en una rama de práctica.
2. Ejecuta Jenkins.
3. Observa qué etapa falla.
4. Confirma que las etapas posteriores no se ejecutan como si el formato estuviera bien.
5. Ejecuta `terraform fmt` localmente.
6. Revisa el diff.
7. Confirma la corrección.

### Sesión 15: provocar un error de sintaxis

**Objetivo:** practicar la lectura de diagnósticos Terraform.

#### Instrucciones

1. En una copia temporal, elimina un carácter necesario.
2. Ejecuta `terraform validate`.
3. Registra el archivo y la línea señalados.
4. No copies la configuración rota a la rama compartida.
5. Corrige el error.
6. Vuelve a ejecutar.

### Sesión 16: diagnosticar una versión incompatible

**Objetivo:** reconocer el efecto de `required_version`.

#### Instrucciones

1. Revisa la versión del agente.
2. Revisa el rango de `required_version`.
3. Compara los valores.
4. No cambies la instalación global.
5. Describe si la solución corresponde al código o al agente.
6. Consulta al docente si hay discrepancia.

### Sesión 17: comprobar que no se usan credenciales

**Objetivo:** revisar el alcance de la práctica.

#### Instrucciones

1. Inspecciona los archivos `.tf`.
2. Inspecciona el `Jenkinsfile`.
3. Revisa los parámetros del job.
4. Comprueba que no se declara un proveedor cloud.
5. Comprueba que no se solicita una credencial de proveedor.
6. Anota cualquier elemento inesperado.
7. No imprimas variables de entorno.

### Sesión 18: revisar archivos generados

**Objetivo:** identificar estado y plan en el workspace.

#### Instrucciones

1. Lista solo los archivos del directorio de laboratorio.
2. Identifica `.terraform`, estado y planes, si existen.
3. No abras ni publiques archivos sensibles.
4. Comprueba qué archivos están ignorados por Git.
5. Revisa `git status`.
6. Elimina temporales solo según el procedimiento del curso.

### Sesión 19: comparar una validación de código con un despliegue

**Objetivo:** separar CI de cambios de infraestructura.

#### Actividad

Clasifica estas tareas:

```text
terraform fmt -check
terraform init -backend=false
terraform validate
terraform plan
terraform apply
terraform destroy
```

Para cada una, indica:

- Si inspecciona o modifica infraestructura.
- Si necesita backend.
- Si podría requerir credenciales.
- Si se permite en este laboratorio.

No ejecutes `apply` ni `destroy`.

### Sesión 20: crear un resumen no sensible

**Objetivo:** comunicar resultado sin publicar el plan completo.

#### Actividad

Crea un mensaje de pipeline que indique:

- Job.
- Número de build.
- Rama o commit, si está disponible y se puede compartir.
- Etapa alcanzada.
- Resultado final.

No incluyas:

- Estado.
- Plan binario.
- Credenciales.
- Variables completas.
- Identificadores cloud sensibles.

### Sesión 21: revisión por pares

**Objetivo:** revisar la seguridad y legibilidad.

La persona autora explica:

- Qué configuración se valida.
- Qué versión de Terraform se usa.
- Por qué se deshabilita el backend.
- Qué datos pueden aparecer en el plan.
- Por qué no se aplica infraestructura.

La persona revisora comprueba:

- Que no haya `apply` ni `destroy`.
- Que no haya proveedor cloud.
- Que no haya credenciales.
- Que `fmt`, `init`, `validate` y `plan` estén ordenados.
- Que no se archive el estado ni el plan.
- Que los mensajes sean claros.

### Sesión 22: proyecto integrador

**Objetivo:** entregar un pipeline de validación reproducible.

#### Requisitos

- Repositorio de laboratorio.
- `Jenkinsfile` versionado.
- Configuración Terraform local.
- Restricción de versión.
- Etapa de versión.
- Etapa de formato.
- Inicialización con `-backend=false`.
- Etapa de validación.
- Etapa de plan.
- Acciones `post`.
- Prueba de éxito.
- Prueba de fallo controlado.
- Sin `apply`.
- Sin credenciales cloud.

#### Entrega

Incluye:

- Rama y commit.
- Número del build exitoso.
- Número del build fallido controlado.
- Salida resumida de las etapas.
- Versión de Terraform observada.
- Riesgo identificado.
- Descripción de cómo se evitó usar estado compartido.

---

## Errores frecuentes y diagnóstico

Un error puede deberse al código Terraform, al agente, al repositorio o a la configuración del job.

### Terraform no encontrado

Comprueba:

- Etiqueta del agente.
- `PATH`.
- Instalación de Terraform.
- Sistema operativo.
- Versión del agente.
- Herramienta global configurada, si se usa.

No descargues un binario sin validación.

### Versión incompatible

Comprueba:

- Salida de `terraform version`.
- `required_version`.
- Política de versiones del curso.
- Agente asignado.
- Configuración global de herramientas.

No cambies el requisito del proyecto para ocultar una versión de agente equivocada.

### `fmt -check` falla

Comprueba:

- Archivo señalado.
- Salida de `terraform fmt`.
- Diff del cambio.
- Que el formato corregido esté confirmado en Git.
- Que Jenkins use la revisión actualizada.

### `terraform init` falla

Comprueba:

- Directorio.
- Configuración Terraform.
- Acceso a los registros aprobados.
- Proveedores declarados.
- Módulos externos.
- Certificados.
- Backend configurado accidentalmente.

En esta práctica, revisa que se mantenga `-backend=false`.

### Terraform solicita entrada

Comprueba:

- Si se pasó `-input=false`.
- Si hay variables requeridas sin valor.
- Si se usa un backend que requiere configuración.
- Si la configuración del job está completa.

No respondas con credenciales personales en un prompt del build.

### Error de proveedor

Comprueba:

- Si se declaró un proveedor que no pertenece al laboratorio.
- Si el agente puede descargarlo.
- Si existe una restricción de versión.
- Si hay un archivo de bloqueo.
- Si la fuente está aprobada.

No añadas una credencial cloud para resolver un error de configuración de laboratorio.

### `terraform validate` falla

Comprueba:

- Sintaxis HCL.
- Tipos.
- Nombres de variables.
- Referencias.
- Estructura de bloques.
- Requisitos de proveedor.
- Versión de Terraform.

### `terraform plan` informa de cambios

En la configuración de laboratorio, puede haber acciones sobre `terraform_data`.

Lee el resumen.

No interpretes un plan como autorización para aplicar.

### Backend inesperado

Comprueba:

- Bloque `backend` en la configuración.
- Archivos `.tf` incluidos.
- Workspace.
- Variables de entorno del job.
- Directorio actual.
- Parámetros de inicialización.

Detén el trabajo si se conecta a un backend no autorizado.

### Estado local inesperado

Comprueba si el workspace contiene:

- `terraform.tfstate`.
- `terraform.tfstate.backup`.
- `.terraform/`.
- Archivos de otra ejecución.

No lo copies a Git ni lo compartas.

Solicita al docente instrucciones de limpieza.

### Módulo o proveedor no descargado

Comprueba:

- Conectividad permitida.
- Registro configurado.
- Restricciones de salida.
- Nombre y versión.
- Caché del agente.
- Política del curso.

No configures un mirror o registro nuevo sin autorización.

### Error al leer el `Jenkinsfile`

Comprueba:

- Checkout.
- Rama.
- Ruta configurada.
- Sintaxis Groovy.
- Nombre exacto del archivo.
- Diferencia entre mayúsculas y minúsculas.
- Commit procesado.

### Job esperando agente

Comprueba:

- Etiqueta `terraform-lab`.
- Estado del nodo.
- Capacidad del agente.
- Ejecutores ocupados.
- Restricciones del job.
- Disponibilidad del cloud, si se utiliza.

No cambies a un agente con privilegios mayores para salir de la cola.

### Error de permisos en el workspace

Comprueba:

- Usuario efectivo.
- Propietario del directorio.
- Permisos asignados.
- Agente.
- Workspace compartido.
- Montajes.

No uses permisos globales para resolverlo.

### Plan inesperadamente vacío

Comprueba:

- Directorio Terraform seleccionado.
- Archivos `.tf` presentes.
- Recursos definidos.
- Estado local previo.
- Módulos cargados.
- Workspace.
- Rama y commit.

### Plan diferente entre ejecuciones

Comprueba:

- Versión de Terraform.
- Versiones de proveedores.
- Archivo de bloqueo.
- Módulos externos.
- Estado.
- Variables.
- Rama y commit.
- Diferencias del agente.

### Build exitoso pese a una etapa fallida

Busca:

- `catchError`.
- `try/catch`.
- `returnStatus` sin comprobar.
- `|| true`.
- Código de salida ignorado.
- Etapa omitida.
- Script que termina siempre con cero.

### Build fallido después de un `echo` de éxito

Un mensaje de éxito no determina el resultado del proceso.

Busca:

- Código de salida posterior.
- Error de archivado.
- Error de `post`.
- Timeout.
- Excepción.
- Paso que falló después del mensaje.

### Informe de diagnóstico

```text
Job:
Número de build:
Rama:
Commit:
Agente:
Versión de Terraform:
Etapa fallida:
Primer mensaje relevante:
Comando:
Resultado:
Observación:
Hipótesis:
Próxima comprobación:
```

### Observación frente a hipótesis

Ejemplo:

```text
Observación:
terraform validate informa de un bloque no válido en main.tf.

Hipótesis:
El bloque se escribió con una palabra clave incorrecta.

Comprobación:
Revisar la línea señalada y la documentación de Terraform.
```

No presentes una hipótesis como un hecho confirmado.

---

## Checklist de seguridad y calidad

### Terraform

- [ ] La versión requerida está declarada.
- [ ] No hay proveedor cloud en el laboratorio.
- [ ] No hay backend remoto de producción.
- [ ] No se ejecuta `apply`.
- [ ] No se ejecuta `destroy`.
- [ ] El estado no se confirma en Git.
- [ ] El plan binario no se publica.
- [ ] No hay secretos en variables o archivos.

### Jenkins

- [ ] El job está en la carpeta autorizada.
- [ ] El agente tiene Terraform instalado.
- [ ] La etiqueta es la aprobada.
- [ ] No se imprimen variables de entorno completas.
- [ ] El timeout es razonable.
- [ ] El pipeline no cambia infraestructura real.
- [ ] Los cambios de `Jenkinsfile` se revisan.

### Repositorio

- [ ] Los archivos `.tf` están formateados.
- [ ] Los archivos generados están ignorados cuando corresponde.
- [ ] El `.gitignore` no oculta cambios necesarios.
- [ ] No se versionan estados ni planes.
- [ ] No se incluyen credenciales.
- [ ] El commit de la ejecución está identificado.

### Diagnóstico

- [ ] Se probó el camino exitoso.
- [ ] Se probó un fallo controlado.
- [ ] Se registró la primera causa.
- [ ] Se verificó el agente.
- [ ] Se verificó la rama.
- [ ] Se comprobó el resultado final.
- [ ] Se restauró la configuración válida.

---

## Evaluación

La evaluación se centra en la calidad del flujo, no en la creación de infraestructura.

### Evidencias mínimas

Entrega:

- Repositorio de laboratorio.
- `Jenkinsfile`.
- Archivos Terraform.
- Archivo `.gitignore`, si se utiliza.
- Build exitoso.
- Build fallido controlado.
- Versión de Terraform del agente.
- Informe de diagnóstico.
- Explicación de por qué no se usa `apply`.
- Revisión de archivos que no deben versionarse.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Terraform | Archivos incompletos | Configuración válida | Versiones y alcance explicados |
| Pipeline | Etapas confusas | Flujo ordenado | Etapas y dependencias bien justificadas |
| Validación | Sin formato o validate | `fmt`, `init`, `validate` | Diagnóstico de fallos reproducible |
| Plan | No distingue plan y apply | Genera plan sin aplicarlo | Explica riesgo y tratamiento del plan |
| Estado | No reconoce sensibilidad | No versiona estado | Explica backend, bloqueo y acceso |
| Seguridad | Incluye riesgos | No usa secretos ni apply | Justifica límites y controles |
| Pruebas | Solo éxito | Éxito y fallo controlado | Casos de borde documentados |
| Documentación | Insuficiente | Reproducible | Incluye evidencias y limitaciones |

### Preguntas de evaluación

1. ¿Qué diferencia hay entre `terraform plan` y `terraform apply`?
2. ¿Qué hace `terraform fmt -check`?
3. ¿Qué comprueba `terraform validate`?
4. ¿Por qué `terraform init` puede descargar proveedores o módulos?
5. ¿Qué hace `-backend=false` en este laboratorio?
6. ¿Qué contiene el estado de Terraform?
7. ¿Por qué el estado puede ser sensible?
8. ¿Por qué un plan guardado también requiere protección?
9. ¿Dónde se ejecuta Terraform dentro de Jenkins?
10. ¿Qué necesita el agente para ejecutar el pipeline?
11. ¿Por qué no se deben imprimir variables de entorno completas?
12. ¿Qué puede hacer que un plan varíe entre ejecuciones?
13. ¿Por qué no se aplica infraestructura en esta práctica?
14. ¿Qué controles necesita un pipeline real de aplicación?
15. ¿Qué información debe incluir un informe de diagnóstico?

### Ejercicio de clasificación

Clasifica estas operaciones como **comprobación**, **planificación**, **modificación potencial** o **gestión de estado**:

```text
terraform fmt -check
terraform init -backend=false
terraform validate
terraform plan
terraform apply
terraform destroy
terraform state list
```

No ejecutes `apply`, `destroy` ni operaciones de estado sobre sistemas reales.

### Respuestas orientativas

- `terraform fmt -check`: comprobación de formato.
- `terraform init -backend=false`: inicialización sin backend remoto.
- `terraform validate`: comprobación de configuración.
- `terraform plan`: planificación de cambios.
- `terraform apply`: modificación potencial de infraestructura.
- `terraform destroy`: eliminación potencial de infraestructura.
- `terraform state list`: consulta de objetos registrados en el estado; debe usarse con permisos y alcance adecuados.

---

## Glosario

- **Backend:** mecanismo que almacena y, a menudo, bloquea el estado.
- **Build:** ejecución de un job en Jenkins.
- **Agente:** nodo donde Jenkins ejecuta los pasos.
- **`terraform apply`:** comando que puede aplicar cambios de infraestructura.
- **`terraform destroy`:** comando que puede destruir infraestructura.
- **`terraform fmt`:** comando que formatea archivos Terraform.
- **`terraform init`:** comando que prepara el directorio de trabajo.
- **`terraform plan`:** comando que calcula cambios previstos.
- **`terraform validate`:** comando que valida la configuración.
- **Estado:** registro que relaciona configuración y objetos gestionados.
- **Plan binario:** archivo creado con `terraform plan -out`.
- **Proveedor:** plugin que integra Terraform con una plataforma o servicio.
- **Recurso:** objeto descrito y gestionado por Terraform.
- **Módulo:** conjunto de configuración Terraform reutilizable.
- **`terraform_data`:** recurso integrado de Terraform para almacenar datos dentro del modelo.
- **`Jenkinsfile`:** archivo que define el pipeline.
- **Workspace:** directorio de trabajo de Jenkins.
- **Agente:** entorno que ejecuta comandos del pipeline.
- **Credencial:** identidad o secreto gestionado por una herramienta.
- **Bloqueo de estado:** mecanismo que evita escrituras concurrentes incompatibles.
- **`-backend=false`:** opción para no inicializar el backend durante ese `init`.
- **`-input=false`:** opción para evitar preguntas interactivas de Terraform.
- **Archivo de bloqueo:** archivo que registra selecciones de proveedores.
- **Infraestructura como código:** práctica de describir infraestructura en archivos versionables.

---

## Plantillas de documentación

### Ficha del proyecto Terraform

```text
Nombre:
Repositorio:
Rama:
Commit:
Directorio Terraform:
Versión requerida:
Proveedor declarado:
Backend:
Recursos de laboratorio:
```

### Ficha de ejecución Jenkins

```text
Job:
Número de build:
Agente:
Etiqueta:
Versión Terraform:
Rama:
Commit:
Resultado:
Etapa fallida:
Artefactos no sensibles:
```

### Ficha de diagnóstico

```text
Observación:
Primera causa:
Hipótesis:
Comprobación:
Resultado:
Cambio realizado:
Prueba de confirmación:
```

### Ficha de revisión de seguridad

```text
¿Se usan credenciales cloud?:
¿Se configura backend remoto?:
¿Se ejecuta apply?:
¿Se archiva un plan?:
¿Se versiona estado?:
¿Se imprimen variables sensibles?:
¿Quién autorizó el alcance?:
```

---

## Síntesis final

La integración de Terraform con Jenkins permite automatizar comprobaciones y planificación, pero no convierte una operación de infraestructura en algo inocuo por defecto.

- El laboratorio usa una configuración local y no crea recursos cloud.
- `fmt`, `init`, `validate` y `plan` tienen propósitos distintos.
- `terraform plan` no es una autorización para aplicar.
- El estado y los planes pueden contener datos sensibles.
- Las credenciales no pertenecen al repositorio ni a la consola.
- El agente debe tener una versión de Terraform compatible.
- El `Jenkinsfile` debe versionarse y revisarse como código ejecutable.
- Un backend real requiere controles de acceso, cifrado y bloqueo.
- La aplicación de cambios necesita revisión, permisos mínimos y aprobación.
- En esta práctica no se ejecutan `terraform apply` ni `terraform destroy`.