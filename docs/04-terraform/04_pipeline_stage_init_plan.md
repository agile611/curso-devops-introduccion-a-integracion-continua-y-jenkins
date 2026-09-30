# Etapas `init` y `plan` en Jenkins

Esta guía explica cómo integrar las etapas `terraform init` y `terraform plan` en una pipeline de Jenkins, qué prepara cada comando y cómo revisar el resultado antes de considerar cualquier operación posterior. Los ejemplos principales utilizan un recurso local de laboratorio y desactivan la inicialización de un backend remoto. **No crean infraestructura cloud y no ejecutan `terraform apply`.**

El objetivo es que el alumnado pueda construir, probar y diagnosticar un pipeline reproducible sin conectar cuentas reales ni exponer credenciales. En un proyecto real, la inicialización, el backend, las identidades, el estado y la protección del plan deben diseñarse y aprobarse específicamente.

> **Límite de seguridad:** ejecuta los ejercicios únicamente en el repositorio y el agente asignados. No añadas credenciales cloud, no uses un backend compartido y no ejecutes `terraform apply` o `terraform destroy`. Un plan o estado puede contener información sensible: no lo publiques ni lo archives sin una política aprobada.

---

## Objetivos y alcance

La guía se centra en dos etapas habituales de una pipeline Terraform: inicializar el directorio de trabajo y calcular un plan.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar el propósito de `terraform init`.
- Explicar el propósito de `terraform plan`.
- Distinguir la inicialización de un backend de la descarga de proveedores.
- Identificar dónde se ejecuta Terraform en Jenkins.
- Definir el directorio de trabajo de una etapa.
- Ejecutar `init` y `plan` con una configuración local de laboratorio.
- Interpretar un resumen básico del plan.
- Reconocer cuándo una inicialización puede descargar código.
- Identificar archivos de trabajo creados por Terraform.
- Explicar por qué estado y planes necesitan protección.
- Configurar una etapa que falle si Terraform devuelve un error.
- Diagnosticar fallos de rutas, versiones, permisos y conectividad.
- Separar el flujo de laboratorio de un flujo real con backend remoto.
- Documentar una ejecución sin divulgar información sensible.

### Qué se construirá

El ejercicio prepara:

- Un repositorio de laboratorio.
- Una configuración Terraform sin proveedor cloud.
- Un `Jenkinsfile` declarativo.
- Una etapa de inicialización local.
- Una etapa de planificación.
- Comprobaciones previas de versión, formato y sintaxis.
- Una verificación de salida no sensible.

### Qué queda fuera

Esta guía no configura:

- Un backend remoto de producción.
- Credenciales de AWS, Azure, Google Cloud u otro proveedor.
- Un job de aplicación de infraestructura.
- `terraform apply`.
- `terraform destroy`.
- Un flujo de aprobación de producción.
- Un procedimiento de recuperación de recursos.
- Una política universal de almacenamiento de estado.
- Un proveedor cloud real.

### Qué significa “planificar”

En esta guía, planificar significa pedir a Terraform que calcule y presente las acciones previstas para la configuración de laboratorio.

No significa aprobar los cambios.

No significa que los cambios sean seguros.

No significa que el pipeline haya creado recursos.

### Para quién es esta guía

Está dirigida a estudiantes que conocen las nociones básicas de:

- Terraform.
- Jenkins Pipeline.
- Git.
- Terminal.
- Archivos HCL.
- Etapas de un build.

Los ejemplos introducen cada etapa por separado y después las combinan.

### Reglas del laboratorio

- Utiliza exclusivamente el repositorio de práctica.
- Utiliza el agente que asignó el curso.
- Comprueba el directorio antes de ejecutar comandos.
- Revisa el inventario de archivos Terraform.
- No añadas proveedores cloud.
- No configures credenciales cloud.
- No cambies a un backend desconocido.
- No archives archivos de estado ni planes binarios.
- No añadas `apply` ni `destroy` al pipeline.

---

## Contexto de la etapa `init`

`terraform init` prepara el directorio de trabajo para las operaciones posteriores.

### Qué prepara `terraform init`

El comando puede:

- Inicializar los datos locales de Terraform.
- Configurar el backend definido por el proyecto.
- Descargar proveedores requeridos.
- Descargar módulos llamados por la configuración.
- Preparar la selección de versiones.
- Crear o actualizar archivos de trabajo.

Su comportamiento depende de la configuración y de las opciones utilizadas.

### `init` no aplica recursos

La inicialización no equivale a `terraform apply`.

Sin embargo, puede acceder a redes, registros de módulos, registros de proveedores o backends.

Por eso conviene revisar la configuración antes de ejecutarla.

### Directorio de trabajo

Terraform trabaja sobre el directorio actual y los archivos de configuración de ese módulo.

En Jenkins, comprueba que los comandos se ejecutan en la carpeta correcta:

```groovy
dir('terraform') {
    sh 'terraform init -backend=false -input=false'
}
```

Si el repositorio no tiene esa carpeta, la etapa fallará.

### Proveedores

Un proveedor es un plugin que permite a Terraform interactuar con una plataforma.

`init` puede descargar proveedores según los requisitos declarados.

Antes de utilizar un proveedor, revisa:

- Su fuente.
- Su versión.
- Su checksum.
- Su compatibilidad.
- Su mantenimiento.
- La política de descargas del entorno.

### Módulos

Un módulo puede estar en un subdirectorio local o en una fuente remota.

`init` puede descargar módulos remotos.

No agregues módulos desconocidos al laboratorio.

En proyectos reales, fija versiones y revisa sus cambios.

### Backend

Un backend determina cómo Terraform guarda y bloquea el estado.

Puede ser local o remoto, según la configuración.

Un backend remoto puede proporcionar almacenamiento común, bloqueo, permisos, cifrado y auditoría, dependiendo del servicio y su diseño.

### Backend en la práctica de laboratorio

La práctica utiliza:

```bash
terraform init -backend=false -input=false
```

La opción `-backend=false` evita inicializar un backend remoto durante esta operación.

Es apropiada para el proyecto local de este ejercicio.

No es una recomendación para eliminar el backend de un proyecto de producción.

### Backend declarado en el código

Si un proyecto contiene un bloque `backend`, revisa su configuración antes de ejecutar `init`.

`-backend=false` omite la inicialización del backend para esa operación, pero no convierte el proyecto en una configuración de producción segura ni resuelve un diseño incorrecto.

### Backend real

En un proyecto real, el backend debe seleccionarse con el equipo responsable.

Antes de inicializar, confirma:

- Organización.
- Cuenta o proyecto.
- Entorno.
- Nombre del estado.
- Permisos.
- Bloqueo.
- Cifrado.
- Retención.
- Acceso del agente.
- Procedimiento de recuperación.

### Archivo de bloqueo de proveedores

Terraform puede crear o actualizar:

```text
.terraform.lock.hcl
```

El archivo registra las selecciones de proveedores y sumas de comprobación en los contextos compatibles.

Su presencia depende de la configuración.

En proyectos con proveedores, el equipo suele decidir si se versiona.

### No eliminar el lockfile a ciegas

El archivo de bloqueo ayuda a mantener selecciones reproducibles.

No lo elimines para resolver un error sin averiguar su causa.

Un cambio de proveedor puede modificar el comportamiento del proyecto.

### Directorio `.terraform`

`init` crea datos locales en:

```text
.terraform/
```

Ese directorio contiene información de trabajo, como plugins o módulos descargados.

Normalmente no se versiona.

### Limpieza del workspace

Jenkins puede crear un workspace nuevo o conservar el anterior.

No dependas de que la limpieza ocurra sin comprobar la política de la instancia.

No borres rutas ajenas al workspace.

### Repetición de `init`

Volver a ejecutar `init` puede ser apropiado después de cambios de proveedores, módulos o backend.

No lo añadas varias veces al pipeline sin motivo.

### Cambios de configuración

Si cambia una dependencia o configuración de backend, Terraform puede indicar que hace falta volver a inicializar.

Lee el mensaje antes de elegir opciones adicionales.

No utilices `-upgrade` como solución genérica.

### Opción `-input=false`

Desactiva preguntas interactivas de Terraform.

Es útil en CI porque los jobs deben comportarse de forma no interactiva.

Si falta una entrada requerida, el comando debería fallar en vez de detener el agente esperando una respuesta manual.

### Opción `-no-color`

Evita códigos de color en la salida.

Puede facilitar la lectura de logs y el procesamiento automático.

No cambia el propósito del comando.

### Opción `-upgrade`

Puede actualizar selecciones de proveedores o módulos dentro de las restricciones aplicables.

No se utiliza en el pipeline de laboratorio.

En proyectos reales, una actualización debe ser explícita, revisada y probada.

### Opción `-reconfigure`

Puede pedir a Terraform que reconfigure el backend.

No se añade por defecto al pipeline.

Utilízala únicamente cuando el cambio de backend esté documentado y autorizado.

### Opciones dependientes del proyecto

Las opciones adecuadas dependen de:

- Configuración del backend.
- Fuentes de módulos.
- Restricciones de proveedores.
- Versión de Terraform.
- Diseño del repositorio.
- Política de CI.
- Requisitos de reproducibilidad.

---

## Contexto de la etapa `plan`

`terraform plan` calcula las acciones previstas para aproximar la infraestructura al estado descrito.

### Qué calcula el plan

Terraform compara la configuración con la información del estado y con la información que puede obtener del proveedor.

Puede proponer:

- Añadir recursos.
- Cambiar recursos.
- Eliminar recursos.
- Reemplazar recursos.
- No realizar cambios.

La salida concreta depende del proveedor, la configuración, el estado y la versión.

### `plan` no es `apply`

`plan` presenta acciones previstas.

`apply` puede ejecutar cambios.

Un plan exitoso no equivale a una aprobación.

Un plan exitoso no confirma que el cambio sea seguro.

### Plan de laboratorio

La configuración de esta guía usa `terraform_data`, que no crea recursos cloud.

El plan permite estudiar la etapa sin conectarse a un proveedor cloud.

Se requiere Terraform 1.4 o posterior para el recurso `terraform_data`.

### Plan de consola

El comando más sencillo para el laboratorio es:

```bash
terraform plan -input=false -no-color
```

La salida se muestra en la consola de Jenkins.

La consola solo debe compartirse después de revisar si contiene información sensible.

### Plan guardado

Terraform permite escribir un plan a un archivo mediante `-out`.

Ejemplo de sintaxis:

```bash
terraform plan -input=false -no-color -out=tfplan
```

Este laboratorio **no necesita guardar un plan**.

Un archivo de plan puede contener datos sensibles y requiere controles de acceso y retención.

### No aplicar un plan guardado

La opción de guardar un plan no implica que deba aplicarse.

En esta guía no se ejecuta:

```text
terraform apply tfplan
```

### Revisión de las acciones

Al leer un plan, comprueba:

- Qué recursos aparecen.
- Qué atributos cambian.
- Si hay reemplazos.
- Si algo se destruye.
- A qué entorno corresponde.
- Qué configuración se evaluó.
- Qué variables se utilizaron.
- Qué backend y workspace se seleccionaron.
- Qué commit se ejecutó.
- Si la salida corresponde a la revisión actual.

### Marcas de salida

Según la versión y el proveedor, los símbolos del plan pueden indicar acciones como:

- Crear.
- Actualizar.
- Eliminar.
- Reemplazar.
- Leer datos.

No apruebes una operación solo por el resumen numérico.

### Resumen del plan

Una salida puede terminar con un resumen similar a:

```text
Plan: 1 to add, 0 to change, 0 to destroy.
```

El formato y el resumen dependen de la versión.

Lee también los detalles de cada recurso.

### Plan sin cambios

Un plan sin cambios significa que Terraform no detecta acciones que deba proponer en ese contexto.

No garantiza que:

- El sistema real sea correcto.
- No exista deriva no visible.
- El proveedor informe todos los atributos.
- El backend sea el correcto.
- El entorno seleccionado sea el esperado.

### Estado y plan

El plan puede depender del estado asociado al proyecto.

Un estado antiguo, equivocado o compartido incorrectamente puede alterar el resultado.

Confirma el backend y el workspace antes de usar una configuración real.

### Variables

El plan puede depender de variables suministradas desde distintas fuentes.

Confirma qué variables usa la pipeline.

No imprimas el entorno completo para averiguarlo.

### Valores sensibles

La salida puede ocultar algunos valores sensibles, según la configuración y la versión.

El plan guardado y el estado pueden contener valores que no se muestran en pantalla.

### Plan y deriva

Una diferencia entre la configuración y recursos modificados fuera de Terraform puede aparecer en el plan.

Antes de corregirla, determina si el cambio externo fue accidental o autorizado.

### Limitaciones del plan

Un plan es una evaluación bajo un contexto concreto.

Puede variar cuando cambian:

- Código.
- Variables.
- Estado.
- Backend.
- Workspace.
- Proveedor.
- Módulos.
- Permisos.
- API remota.
- Cuenta o región.
- Recursos modificados manualmente.

---

## Flujo de trabajo en Jenkins

Jenkins coordina el checkout y la ejecución de las etapas.

### Checkout

El job obtiene una revisión del repositorio.

Antes de interpretar los resultados, comprueba:

- Repositorio.
- Rama.
- Commit.
- Ruta del `Jenkinsfile`.
- Directorio de Terraform.
- Agente asignado.

### Orden de las etapas

Un flujo habitual para el laboratorio es:

1. Comprobar herramientas.
2. Comprobar formato.
3. Inicializar sin backend remoto.
4. Validar configuración.
5. Generar un plan local.
6. Verificar el resultado del job.

### Por qué validar antes de planificar

`terraform validate` permite detectar problemas estructurales antes de pedir el plan.

No reemplaza el plan ni una revisión del resultado.

### Agente Jenkins

Terraform se ejecuta en el agente asignado al pipeline.

El agente debe tener:

- Versión compatible.
- `PATH` correcto.
- Permiso de escritura en el workspace.
- Conectividad necesaria y aprobada.
- Aislamiento apropiado.
- Espacio temporal suficiente.

### No asumir que `agent any` es apropiado

`agent any` puede seleccionar un nodo que no tiene Terraform o que posee permisos distintos.

Una etiqueta específica facilita seleccionar un agente de laboratorio.

### Workspace

El workspace contiene el checkout y los archivos temporales del job.

Puede conservarse o limpiarse según la configuración de Jenkins.

No uses el workspace como almacenamiento permanente del estado.

### Directorio de trabajo

Si los archivos `.tf` están en `terraform/`, encapsula los comandos:

```groovy
dir('terraform') {
    sh 'terraform plan -input=false -no-color'
}
```

Las rutas deben corresponder a la estructura real del repositorio.

### `sh` y códigos de salida

El paso `sh` normalmente marca el build como fallido si el comando devuelve un código distinto de cero.

No ocultes ese error con `|| true`.

### Secuencia dependiente

Si `init` falla, `plan` no debería ejecutarse.

Si `validate` falla, el plan no debería presentarse como correcto.

Las etapas declarativas se ejecutan en orden salvo que la pipeline incluya lógica que altere el flujo.

### Logs

Los logs ayudan a diagnosticar la ejecución.

No incluyas:

- Credenciales.
- Estado completo.
- Variables de entorno completas.
- Planes con datos sensibles.
- Salidas extensas sin necesidad.

### Artefactos

La pipeline del laboratorio no archiva un plan binario.

Si el curso requiere un informe, archiva únicamente un archivo concreto, revisado y no sensible.

### Concurrencia

Si varios builds comparten estado remoto, hace falta una estrategia de bloqueo y coordinación.

El ejemplo de laboratorio no debe conectarse a un backend compartido.

---

## Preparación del laboratorio

Los archivos siguientes permiten probar `init` y `plan` sin un proveedor cloud.

### Requisitos de Terraform

La configuración usa `terraform_data`.

Necesita Terraform 1.4 o posterior.

El agente debe cumplir el requisito antes de ejecutar el pipeline.

### Estructura del repositorio

```text
pipeline-init-plan/
├── Jenkinsfile
├── README.md
└── terraform/
    ├── main.tf
    └── outputs.tf
```

### Crear la estructura en Unix-like

```bash
mkdir -p pipeline-init-plan/terraform
cd pipeline-init-plan
```

### Crear la estructura en PowerShell

```powershell
New-Item -ItemType Directory -Force pipeline-init-plan\terraform
Set-Location pipeline-init-plan
```

### Archivo `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "pipeline_laboratorio" {
  input = {
    proyecto = "pipeline-init-plan"
    entorno  = "laboratorio"
    objetivo = "probar init y plan sin proveedor cloud"
  }
}
```

### Archivo `terraform/outputs.tf`

```hcl
output "resumen_laboratorio" {
  description = "Datos públicos del ejercicio local."
  value       = terraform_data.pipeline_laboratorio.output
}
```

### Archivo `README.md`

```text
Práctica de Jenkins con Terraform.
El pipeline inicializa sin backend remoto y genera un plan local.
No usa credenciales ni aplica cambios de infraestructura.
```

### Qué demuestra la configuración

- Existe un bloque de requisitos de versión.
- Terraform puede leer un recurso local de laboratorio.
- `init` prepara el directorio de trabajo.
- `validate` comprueba la configuración.
- `plan` presenta las acciones previstas.
- No se declara un proveedor cloud.

### `.gitignore`

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

Revisa la política del curso antes de confirmar cambios.

### Revisar archivos

Antes de ejecutar:

```bash
git status --short
```

Comprueba que el proyecto no contiene:

- Credenciales.
- Archivos de proveedor personal.
- Estados de otro ejercicio.
- Planes antiguos.
- Configuración de backend no aprobada.
- Módulos externos no autorizados.

---

## Comprobaciones locales previas

Es útil probar los comandos desde una terminal antes de añadirlos al pipeline.

### Confirmar la versión

```bash
terraform version
```

Comprueba que la versión cumple `required_version`.

### Confirmar el directorio

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Cambia a la carpeta correcta antes de continuar.

### Formatear

```bash
terraform fmt -recursive
```

Este comando puede modificar archivos.

Revisa el diff después de ejecutarlo.

### Comprobar formato

```bash
terraform fmt -check -recursive
```

El comando debe terminar correctamente si los archivos están formateados.

### Inicializar en el directorio de Terraform

```bash
cd terraform
terraform init -backend=false -input=false -no-color
```

En PowerShell:

```powershell
Set-Location terraform
terraform init -backend=false -input=false -no-color
```

### Validar

```bash
terraform validate -no-color
```

La validación no aplica recursos.

### Generar un plan local

```bash
terraform plan -input=false -no-color
```

Revisa la salida y confirma que corresponde al recurso local de prueba.

### No avanzar a `apply`

No ejecutes `apply` como una forma de “comprobar si funciona”.

En esta guía se verifica el plan, no se aplican recursos.

---

## Implementar la etapa `init`

La etapa debe ser legible, no interactiva y adecuada al contexto del laboratorio.

### Versión mínima

```groovy
stage('Init') {
    steps {
        dir('terraform') {
            sh 'terraform init -backend=false -input=false -no-color'
        }
    }
}
```

### Por qué usa `dir`

`dir('terraform')` ejecuta los pasos dentro de la carpeta de configuración.

Si el directorio no existe, Jenkins fallará antes de ejecutar Terraform.

### Por qué usa `-backend=false`

Evita inicializar un backend remoto en la práctica de laboratorio.

No lo quites del ejemplo sin aprobación.

### Por qué usa `-input=false`

Evita que el job espere una respuesta interactiva.

Si falta una configuración necesaria, el comando falla y puede diagnosticarse desde el log.

### Por qué usa `-no-color`

Facilita la lectura del log y evita secuencias de color.

No afecta al objetivo de la inicialización.

### Mensaje de etapa

Puedes añadir un mensaje descriptivo:

```groovy
echo 'Inicializando Terraform para el laboratorio local.'
```

No uses mensajes que impliquen que se ha desplegado infraestructura.

### Verificar el resultado

Si `init` termina con código distinto de cero, la pipeline debe fallar.

No envuelvas el comando en una operación que ignore el fallo.

### Mensaje de fallo

`post` puede presentar una explicación general:

```groovy
failure {
    echo 'El pipeline falló. Revisa la primera etapa fallida.'
}
```

No reemplaza la salida concreta del comando.

### Evitar descargas inesperadas

La configuración de laboratorio no usa proveedores cloud ni módulos remotos.

Si `init` intenta descargar componentes inesperados:

1. Detén el ejercicio.
2. Revisa los archivos `.tf`.
3. Revisa los módulos.
4. Comprueba el directorio actual.
5. Consulta al docente.
6. No añadas credenciales para continuar.

### Backend remoto en un proyecto real

En una pipeline real, no uses automáticamente `-backend=false`.

Debes inicializar el backend autorizado con una configuración revisada.

Confirma:

- Ubicación del estado.
- Identidad usada para acceder.
- Bloqueo.
- Permisos.
- Entorno.
- Workspace.
- Cifrado y retención.
- Procedimiento de recuperación.

### Reconfiguración del backend

Cambiar backend puede cambiar dónde se encuentra el estado.

No uses `-reconfigure` ni opciones de migración sin un procedimiento aprobado.

La migración de estado requiere planificación y coordinación.

### Actualización de dependencias

No añadas `-upgrade` al pipeline por defecto.

Una actualización de proveedor o módulo puede cambiar el plan.

Trata la actualización como un cambio de código revisable.

---

## Implementar la etapa `plan`

La etapa genera un plan en consola sin guardarlo como artefacto.

### Plan de consola

```groovy
stage('Plan') {
    steps {
        dir('terraform') {
            sh 'terraform plan -input=false -no-color'
        }
    }
}
```

### `-input=false`

Evita que Terraform espere datos interactivos.

Si falta una variable requerida, el comando debería fallar de forma visible.

### `-no-color`

Facilita el procesamiento y la lectura de logs.

No oculta valores sensibles.

### Salida en consola

La salida de `plan` puede ser útil para revisar el laboratorio.

En un proyecto real, evalúa qué información contiene antes de permitir que la consola sea visible para todos los usuarios del job.

### Plan guardado

La forma general es:

```bash
terraform plan -input=false -no-color -out=tfplan
```

Esta guía no archiva ese archivo.

El plan guardado puede contener información sensible y debe gestionarse como un dato protegido.

### Cuándo guardar un plan

Un flujo real puede guardar un plan para asociar la revisión con una aplicación posterior.

Antes de hacerlo, define:

- Acceso.
- Retención.
- Asociación con commit.
- Asociación con backend y entorno.
- Protección del artefacto.
- Caducidad.
- Procedimiento de aplicación.
- Respuesta ante cambios del estado.

### No archivar todo el directorio

Evita patrones amplios como:

```text
**
```

para archivar el workspace.

Podrían incluir estado, planes, archivos temporales o credenciales.

### Revisar el resumen

Lee el resumen final, pero no te detengas ahí.

Busca acciones concretas en cada recurso.

### El plan no es aprobación

No conviertas el resultado de la etapa en una aprobación automática.

Una revisión real debe considerar impacto, entorno, permisos, disponibilidad y coste.

### Resultado sin cambios

Una salida sin cambios puede ser esperada en algunas ejecuciones.

En un workspace limpio o con estado distinto, el plan local de laboratorio puede indicar una acción pendiente.

Interpreta el resultado en su contexto.

---

## Jenkinsfile mínimo

Este ejemplo contiene `init` y `plan` para el laboratorio.

### Jenkinsfile

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    stages {
        stage('Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init -backend=false -input=false -no-color'
                }
            }
        }

        stage('Plan') {
            steps {
                dir('terraform') {
                    sh 'terraform plan -input=false -no-color'
                }
            }
        }
    }
}
```

### Adaptar la etiqueta

Sustituye `terraform-lab` por la etiqueta que haya asignado el curso.

No elijas un agente con privilegios mayores para resolver una etiqueta incorrecta.

### Adaptar la ruta

Si la configuración está en otra carpeta, ajusta `dir`.

Comprueba que las rutas coinciden con el repositorio.

### Orden de etapas

Jenkins ejecuta las etapas en orden.

Si `init` falla, `plan` no debería ejecutarse como si la inicialización hubiera sido correcta.

---

## Jenkinsfile de laboratorio completo

El siguiente pipeline valida el entorno y la configuración antes de generar el plan.

### Pipeline declarativo

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
        stage('Comprobar herramientas') {
            steps {
                sh '''
                    set -eu
                    terraform version
                    git --version
                '''
            }
        }

        stage('Comprobar formato') {
            steps {
                dir('terraform') {
                    sh 'terraform fmt -check -recursive'
                }
            }
        }

        stage('Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init -backend=false -input=false -no-color'
                }
            }
        }

        stage('Validate') {
            steps {
                dir('terraform') {
                    sh 'terraform validate -no-color'
                }
            }
        }

        stage('Plan') {
            steps {
                dir('terraform') {
                    sh 'terraform plan -input=false -no-color'
                }
            }
        }
    }

    post {
        success {
            echo 'Init, validate y plan terminaron correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        aborted {
            echo 'La ejecución fue interrumpida.'
        }

        always {
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Qué no hace este pipeline

No contiene:

```text
terraform apply
```

No contiene:

```text
terraform destroy
```

No contiene credenciales cloud.

No configura un backend remoto.

No archiva un plan binario.

### `timestamps()`

Añade marcas de tiempo a la salida, si la instancia lo admite.

Puede ayudar a ordenar eventos durante un diagnóstico.

### `timeout`

Limita la duración del build.

El límite debe considerar checkout, inicialización y disponibilidad de agentes.

### Bloque `post`

Permite informar del resultado final.

No debe imprimirse información sensible en estos bloques.

### Shell y fallos

`set -eu` hace que la shell termine ante determinados errores y variables no definidas.

Los detalles dependen de la shell del agente.

El uso del paso `sh` ya suele propagar el código de salida del comando.

### Limitar el alcance

La pipeline es apropiada para la configuración local del laboratorio.

No la reutilices para una cuenta cloud sin rediseñar backend, identidad, permisos, plan y aprobación.

---

## Parámetros de Pipeline y variables

Los parámetros permiten cambiar entradas, pero también pueden abrir un camino a configuraciones equivocadas.

### Evitar parámetros libres para directorios

No permitas que cualquier persona introduzca una ruta arbitraria y la use directamente como directorio Terraform.

La ruta debe estar validada y, en esta práctica, es fija.

### Evitar parámetros libres para comandos

No construyas un comando desde una variable arbitraria:

```groovy
sh "terraform ${params.COMANDO}"
```

Un parámetro podría introducir opciones no previstas.

### Parámetro de entorno

En entornos reales, un parámetro de entorno puede seleccionar recursos distintos.

Debe validar:

- Valores permitidos.
- Backend.
- Workspace.
- Credenciales.
- Rama.
- Permisos.
- Aprobaciones.

### No usar secretos como parámetros de texto

No pidas una contraseña en un parámetro corriente.

Utiliza un almacén de credenciales aprobado.

### Variables Terraform

Una variable puede venir de varios lugares.

Documenta qué entrada usa el job sin imprimir su valor cuando pueda ser sensible.

### Validar entradas

Si una entrada debe limitarse a un conjunto pequeño, comprueba el valor antes de invocar Terraform.

No concatenes entradas sin validación en comandos de shell.

### Variables por defecto

Usa valores por defecto solo cuando sean seguros y apropiados para el laboratorio.

No incluyas valores de acceso ni secretos en defaults.

---

## Seguridad y operación

`init` y `plan` pueden parecer etapas de bajo riesgo, pero interactúan con archivos, servicios y datos sensibles.

### Estado

El estado puede incluir datos que no aparecen claramente en la configuración.

Trátalo como potencialmente sensible.

No lo confirmes a Git.

### Planes

El plan puede contener valores de configuración y atributos de recursos.

El archivo binario del plan requiere controles de acceso y retención.

### Consola de Jenkins

Limita quién puede ver la consola si presenta información interna.

Revisa la salida antes de compartirla con el alumnado o adjuntarla a una entrega.

### Credenciales

La práctica no necesita credenciales cloud.

Si un job pide credenciales:

- Detén el job.
- Comprueba el proveedor.
- Comprueba el backend.
- Revisa el commit.
- Consulta al docente.
- No pegues una clave para continuar.

### Credenciales de SCM

Un repositorio privado puede necesitar una credencial de lectura.

Usa una credencial gestionada por Jenkins y limitada al repositorio o carpeta correspondiente.

No incluyas el token en la URL.

### Agente

El agente ejecuta código del repositorio.

Protege:

- Workspace.
- Credenciales.
- Acceso de red.
- Plugins.
- Permisos de sistema.
- Procesos temporales.
- Logs.

### Versiones

Registra y controla:

- Terraform.
- Proveedores.
- Módulos.
- Imagen del agente.
- Plugins relevantes.
- Configuración del pipeline.

### Concurrencia

No permitas que varios jobs modifiquen el mismo estado sin un mecanismo de bloqueo.

El ejemplo de laboratorio deshabilita el backend y no debe compartir estado de producción.

### Aprobación

Una revisión de plan debe estar ligada al commit y al entorno correspondientes.

Si cambia el código o el estado, revisa si el plan sigue siendo válido.

### No confundir éxito de CI con seguridad

Un pipeline verde demuestra que los comandos terminaron según sus condiciones.

No demuestra que el diseño sea correcto o que la aplicación esté autorizada.

---

## Backend remoto en un flujo real

La práctica usa un backend deshabilitado para mantener el ejercicio local. Un proyecto real puede necesitar estado remoto.

### Objetivos del backend

Un backend remoto puede ayudar a:

- Compartir estado.
- Bloquear operaciones concurrentes.
- Controlar acceso.
- Mantener historial.
- Facilitar recuperación.
- Auditar operaciones.

Las capacidades dependen del servicio utilizado.

### Preparación previa

Antes de configurar un backend:

1. Obtén autorización.
2. Confirma el entorno.
3. Selecciona el servicio aprobado.
4. Define acceso y bloqueo.
5. Define cifrado y retención.
6. Define la identidad del agente.
7. Define el procedimiento de recuperación.
8. Revisa el alcance del estado.

### No migrar por ensayo y error

La migración del estado puede afectar operaciones posteriores.

No ejecutes comandos de migración en un entorno compartido como parte de una prueba informal.

### Credencial del backend

La identidad de acceso al backend puede ser distinta de la identidad del proveedor.

Separa permisos cuando corresponda.

### Estado por entorno

Define cómo se separa el estado entre desarrollo, pruebas y producción.

No confíes solo en el nombre del job para identificar el estado.

### Bloqueo

El mecanismo de bloqueo protege contra determinadas escrituras concurrentes.

No sustituye control de cambios ni resuelve modificaciones manuales externas.

### Backend y CI

Asegura que:

- El job usa el backend previsto.
- La identidad del agente tiene el acceso mínimo.
- Las salidas no revelan configuración sensible.
- Los errores de backend detienen el pipeline.
- El estado no se archiva como artefacto.
- El locking funciona según el diseño del backend.

---

## Artefactos y retención

Guardar resultados facilita la revisión, pero aumenta la superficie de exposición.

### Artefactos del laboratorio

En esta práctica, el resultado importante es la consola de Jenkins.

No es necesario guardar un archivo de plan.

### Archivar un resumen inocuo

Si el docente pide evidencia, utiliza un resumen no sensible creado expresamente.

No archives el workspace completo.

### Retención

Define cuánto tiempo deben conservarse:

- Builds.
- Consolas.
- Artefactos.
- Informes.
- Logs del agente.

Conserva únicamente lo necesario para el objetivo del curso.

### Revisar antes de archivar

Comprueba que el archivo no incluya:

- Estado.
- Plan binario.
- Credenciales.
- Variables personales.
- Rutas internas.
- Valores de infraestructura restringidos.

### Acceso al artefacto

Confirma quién puede:

- Descargarlo.
- Compartirlo.
- Eliminarlo.
- Ver su historial.
- Mantener copias.

### Descarga local

Un artefacto descargado puede permanecer en una carpeta sincronizada o compartida.

No guardes planes en lugares que el curso no haya aprobado.

---

## Diagnóstico de `terraform init`

Los fallos de `init` pueden proceder de la configuración, la red, el backend o el agente.

### Terraform no encontrado

Comprueba:

- Etiqueta del agente.
- `PATH`.
- Versión instalada.
- Imagen del agente.
- Configuración del job.

No instales una versión diferente en un nodo compartido sin autorización.

### Versión incompatible

Compara:

- `terraform version`.
- `required_version`.
- Requisitos del recurso.
- Requisitos de proveedor.
- Versión indicada por el curso.

No edites `required_version` para ocultar el problema.

### Directorio incorrecto

Comprueba:

- Checkout.
- Rama.
- Ruta de `dir`.
- Nombre de carpeta.
- Mayúsculas y minúsculas.
- Directorio actual del shell.

### No se encuentran archivos de configuración

Comprueba que el directorio actual contiene los archivos `.tf` esperados.

No ejecutes desde la raíz si Terraform debe ejecutarse dentro de `terraform/`.

### Error al descargar proveedores

Comprueba:

- Si el proyecto declara proveedores externos.
- Registro autorizado.
- Conectividad permitida.
- Certificados.
- Mirror aprobado.
- Restricción de versión.
- Archivo de bloqueo.

No añadas credenciales cloud para corregir una descarga de proveedor.

### Error al descargar módulos

Comprueba:

- Fuente del módulo.
- Versión.
- Acceso a Git o al registro.
- Credencial SCM, si está autorizada.
- Red del agente.
- Configuración de proxies aprobada.

No cambies la fuente a una alternativa no revisada.

### Backend inesperado

Detén el job si `init` intenta utilizar un backend no previsto.

Comprueba:

- Bloque `backend`.
- Archivos `.tf`.
- Directorio actual.
- Variables del job.
- Perfil del agente.
- Commit.
- Workspace.

### Backend inaccesible

En un proyecto real, comprueba conectividad, identidad y permisos con el responsable.

En el laboratorio, comprueba que el backend no forma parte de la actividad.

### `init` solicita entrada

Comprueba:

- `-input=false`.
- Backend.
- Variables.
- Configuración del proveedor.
- Datos faltantes.
- Estado del checkout.

No introduzcas secretos en un prompt compartido.

### Lockfile cambiado

Comprueba qué proveedor o versión se seleccionó.

Revisa el diff.

No confirmes cambios inesperados sin explicar su origen.

### Configuración de backend cambió

Un mensaje que pida reinicializar puede indicar un cambio de backend.

Detén el flujo y confirma el cambio con el equipo responsable.

No añadas `-reconfigure` como respuesta automática.

### Tiempo de inicialización excesivo

Comprueba:

- Descargas.
- Conectividad.
- Proveedores.
- Módulos.
- Cachés del agente.
- Registros.
- Límites del timeout.

No descargues repetidamente dependencias desconocidas para “probar suerte”.

---

## Diagnóstico de `terraform plan`

Los fallos del plan pueden proceder de configuración, variables, proveedores o estado.

### `validate` pasa, pero `plan` falla

`validate` y `plan` comprueban cosas distintas.

El plan puede requerir:

- Variables.
- Acceso a proveedor.
- Backend.
- Permisos.
- Estado.
- Consultas a una API.

Lee el primer error relevante.

### Variable requerida ausente

Comprueba:

- Declaración de la variable.
- Fuente aprobada.
- Nombre de variable.
- Parámetros del job.
- Variables de entorno.
- Archivo de variables autorizado.

No escribas el valor en el `Jenkinsfile`.

### Error de autenticación

Detén la ejecución y revisa:

- Qué proveedor se usa.
- Qué identidad intenta autenticarse.
- Qué entorno seleccionó el agente.
- Si la credencial está caducada.
- Si el job debía necesitar credenciales.

No imprimas el token para comprobarlo.

### Error de permisos

El proveedor puede autenticar correctamente y aun así no tener permiso para una consulta.

Comprueba el permiso mínimo requerido con el responsable.

No concedas privilegios administrativos como primer intento.

### El plan propone borrar recursos

No continúes hacia ninguna aplicación.

Revisa:

- Backend.
- Estado.
- Workspace.
- Variables.
- Código.
- Proveedor.
- Motivo del cambio.
- Identidad de la cuenta.
- Commit.

### El plan propone reemplazar recursos

Un reemplazo puede causar interrupción o pérdida de datos.

Identifica el atributo que lo provoca y consulta a la persona responsable.

### El plan está vacío

Comprueba:

- Directorio.
- Archivos `.tf`.
- Módulos.
- Variables.
- Estado.
- Workspace.
- Commit.
- Si la configuración incluye recursos.

### El plan varía entre builds

Compara:

- Commit.
- Versión de Terraform.
- Versiones de proveedores.
- Archivo de bloqueo.
- Variables.
- Estado.
- Backend.
- Entorno del agente.
- Cambios manuales externos.
- APIs y datos consultados.

### Salida con datos sensibles

Detén la difusión del log.

Sigue el procedimiento de exposición.

No copies el valor a un ticket para pedir ayuda.

### Código de salida ignorado

Comprueba si el pipeline usa:

- `|| true`.
- `returnStatus` no validado.
- `catchError`.
- `ignore_errors` en scripts auxiliares.
- Un wrapper que siempre termina con cero.

El resultado debe reflejar el fallo real.

---

## Diagnóstico de Jenkins

Jenkins puede fallar antes o después de invocar Terraform.

### Job esperando agente

Comprueba:

- Etiqueta.
- Estado del nodo.
- Ejecutores.
- Restricciones del job.
- Disponibilidad del agente.
- Capacidad del entorno.

No cambies a un agente no autorizado.

### Checkout incorrecto

Comprueba:

- URL del repositorio.
- Rama.
- Commit.
- Credencial SCM.
- Ruta del `Jenkinsfile`.
- Estado del workspace.

### Error de sintaxis del Pipeline

Comprueba:

- Llaves.
- Comillas.
- Paréntesis.
- Bloques `pipeline`, `stages` y `steps`.
- Uso de `dir`.
- Disponibilidad de plugins para pasos opcionales.

### Ruta de Terraform incorrecta

Comprueba que `dir('terraform')` coincide con la estructura del repositorio.

No utilices rutas absolutas del equipo personal.

### Falta de `terraform` en el agente

La versión local no demuestra que el agente tenga el ejecutable.

Ejecuta `terraform version` como etapa del job.

### El plan se ejecuta tras fallar `init`

Busca lógica que permita continuar, como:

- Errores capturados y descartados.
- `returnStatus` no comprobado.
- `catchError` configurado para continuar.
- Scripts auxiliares que devuelven código cero.

### El log no muestra suficiente información

No actives de inmediato la máxima verbosidad.

Empieza por:

- Identificar la etapa.
- Confirmar directorio.
- Confirmar versión.
- Revisar el primer error.
- Revisar el commit.
- Revisar el agente.

### Ficha de diagnóstico

```text
Job:
Número de build:
Rama:
Commit:
Agente:
Versión Terraform:
Directorio de trabajo:
Etapa:
Comando:
Primer mensaje relevante:
Resultado observado:
Hipótesis:
Comprobación siguiente:
```

No incluyas secretos, planes, estados ni variables de entorno completas.

---

## Sesiones prácticas

Las sesiones enseñan las etapas `init` y `plan` mediante ejercicios locales.

### Preparación común

Antes de empezar:

- Confirma el repositorio.
- Comprueba la versión de Terraform.
- Usa el agente de laboratorio.
- No configures credenciales cloud.
- No uses backend compartido.
- No ejecutes `apply` ni `destroy`.
- Revisa archivos y directorio.
- Registra el número del build.
- No compartas logs completos sin revisarlos.

### Sesión 1: dibujar el flujo

**Objetivo:** explicar cómo Jenkins y Terraform se relacionan.

Dibuja:

```text
Repositorio
    |
    v
Jenkins
    |
    v
Agente con Terraform
    |
    +--> terraform init
    |
    +--> terraform validate
    |
    +--> terraform plan
    |
    v
Consola del build
```

Responde:

- ¿Dónde se ejecuta Terraform?
- ¿Quién elige el agente?
- ¿Qué archivos usa `init`?
- ¿Qué información produce `plan`?
- ¿Qué acciones no están en este flujo?

### Sesión 2: inspeccionar el repositorio

**Objetivo:** verificar el contexto antes de ejecutar.

#### Instrucciones

1. Abre el repositorio de laboratorio.
2. Revisa `git status`.
3. Lista los archivos `.tf`.
4. Identifica el directorio Terraform.
5. Revisa si existe un bloque `backend`.
6. Revisa si se declaran proveedores.
7. Comprueba que no hay credenciales.
8. Detente si encuentras archivos inesperados.

### Sesión 3: registrar versiones

**Objetivo:** confirmar compatibilidad.

#### Comandos

```bash
terraform version
```

```bash
git --version
```

#### Instrucciones

1. Anota la versión de Terraform.
2. Lee `required_version`.
3. Comprueba el agente asignado.
4. Compara la versión local y la del agente, si ambas están disponibles.
5. Explica cualquier diferencia.

### Sesión 4: probar `fmt`

**Objetivo:** comprobar formato antes de inicializar.

#### Comandos

```bash
terraform fmt -recursive
```

```bash
terraform fmt -check -recursive
```

#### Instrucciones

1. Ejecuta el formato en el checkout local.
2. Revisa el diff.
3. Ejecuta `fmt -check`.
4. Corrige únicamente archivos del proyecto.
5. Guarda el cambio en Git si el curso lo solicita.

### Sesión 5: ejecutar `init` local

**Objetivo:** inicializar sin backend remoto.

#### Comando

```bash
terraform init -backend=false -input=false -no-color
```

#### Instrucciones

1. Ejecuta desde `terraform/`.
2. Comprueba el resultado.
3. Observa si se crea `.terraform/`.
4. Comprueba si aparece un lockfile.
5. No añadas los archivos temporales a Git.
6. Registra si Terraform descargó algo.

### Sesión 6: estudiar opciones de `init`

**Objetivo:** explicar el efecto de opciones habituales.

Completa:

```text
-backend=false:
-input=false:
-no-color:
-upgrade:
-reconfigure:
```

Para cada opción, explica si se utiliza en este laboratorio y por qué.

No ejecutes `-upgrade` o `-reconfigure` sobre un proyecto compartido.

### Sesión 7: comprobar la inicialización en Jenkins

**Objetivo:** verificar que el agente puede inicializar el proyecto.

#### Instrucciones

1. Añade una etapa `Init`.
2. Usa el agente asignado.
3. Ejecuta dentro del directorio Terraform.
4. Comprueba la consola.
5. Confirma que no se configuró un backend remoto.
6. Registra el número del build.

### Sesión 8: provocar un error de ruta

**Objetivo:** diagnosticar una ruta incorrecta.

#### Instrucciones

1. En una copia de laboratorio, cambia `dir('terraform')` por una ruta que no exista.
2. Ejecuta el job.
3. Identifica si falló Jenkins o Terraform.
4. Registra el primer error.
5. Restaura la ruta.
6. Vuelve a ejecutar.

### Sesión 9: provocar una versión incompatible

**Objetivo:** relacionar la CLI con el requisito del proyecto.

#### Instrucciones

1. Compara `terraform version` y `required_version`.
2. Utiliza únicamente el agente asignado.
3. No alteres la instalación del agente.
4. Describe dónde debería corregirse la incompatibilidad.
5. Consulta al docente antes de modificar el requisito.

### Sesión 10: validar antes de planificar

**Objetivo:** asegurar que un fallo estructural impide la etapa `plan`.

#### Instrucciones

1. Añade la etapa `Validate`.
2. Colócala después de `Init`.
3. En una copia temporal, introduce un error de sintaxis.
4. Ejecuta el job.
5. Comprueba que `Plan` no aparece como ejecutado.
6. Restaura el archivo correcto.

### Sesión 11: ejecutar `plan` local

**Objetivo:** leer el resultado de la configuración de laboratorio.

#### Comando

```bash
terraform plan -input=false -no-color
```

#### Instrucciones

1. Ejecuta en `terraform/`.
2. Identifica el recurso local.
3. Lee las acciones propuestas.
4. Revisa el resumen.
5. Confirma que no se usó proveedor cloud.
6. No ejecutes `apply`.

### Sesión 12: integrar `plan` en Jenkins

**Objetivo:** mostrar el plan en la consola del build.

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

1. Guarda el `Jenkinsfile`.
2. Comprueba la sintaxis.
3. Ejecuta el job.
4. Revisa el resultado.
5. Confirma que la etapa termina con el código esperado.
6. No archives la consola si la política no lo permite.

### Sesión 13: revisar el plan con una plantilla

**Objetivo:** redactar una revisión de plan breve.

Completa:

```text
Commit:
Directorio:
Versión de Terraform:
Backend del ejercicio:
Recursos indicados:
Acciones propuestas:
Destrucciones:
Reemplazos:
Información pendiente:
Decisión:
```

La decisión para esta práctica es observar el plan, no aplicarlo.

### Sesión 14: distinguir `plan` de `apply`

**Objetivo:** explicar la diferencia entre calcular y realizar cambios.

#### Actividad

Clasifica:

```text
terraform init
terraform validate
terraform plan
terraform apply
terraform destroy
```

Marca cada comando como:

- Preparación.
- Validación.
- Planificación.
- Modificación posible.
- Eliminación posible.

No ejecutes los dos últimos en infraestructura real.

### Sesión 15: plan con un cambio controlado

**Objetivo:** relacionar cambios HCL con acciones previstas.

#### Instrucciones

1. Guarda una copia del archivo inicial.
2. Cambia un valor no sensible del recurso `terraform_data`.
3. Ejecuta `terraform fmt -check`.
4. Ejecuta `terraform plan`.
5. Compara el plan.
6. Registra qué parte del cambio aparece.
7. Restaura la versión requerida por el ejercicio.

### Sesión 16: revisar un plan ficticio con destrucción

**Objetivo:** practicar la identificación de acciones de alto impacto.

El docente proporciona una salida ficticia que incluye una eliminación.

#### Instrucciones

1. Identifica el recurso.
2. Identifica el entorno.
3. Explica qué revisarías.
4. Lista la información que falta.
5. No ejecutes el comando.
6. No interpretes un resumen como aprobación.

### Sesión 17: plan guardado, análisis de riesgo

**Objetivo:** comprender el riesgo de `-out`.

El docente muestra la forma:

```bash
terraform plan -input=false -no-color -out=tfplan
```

#### Instrucciones

1. Explica qué archivo se crea.
2. Identifica dónde podría filtrarse.
3. Revisa por qué no se archiva en esta práctica.
4. Describe controles necesarios en un proyecto real.
5. No crees ni compartas un plan de producción.

### Sesión 18: comprobar que no se archiva el workspace

**Objetivo:** evitar artefactos demasiado amplios.

#### Instrucciones

1. Revisa `archiveArtifacts`, si existe.
2. Identifica el patrón de archivos.
3. Confirma que no incluye `.terraform/`.
4. Confirma que no incluye `terraform.tfstate`.
5. Confirma que no incluye `*.tfplan`.
6. Documenta la razón de cada exclusión.

### Sesión 19: analizar el resultado de `init`

**Objetivo:** distinguir una inicialización correcta de una conexión inesperada.

#### Instrucciones

1. Lee los mensajes de `init`.
2. Identifica proveedores descargados, si los hay.
3. Identifica módulos, si los hay.
4. Comprueba si aparece configuración de backend.
5. Si algo es inesperado, detén el job.
6. Escribe un informe sin copiar datos sensibles.

### Sesión 20: analizar una deriva ficticia

**Objetivo:** entender por qué el estado influye en el plan.

#### Escenario

Una persona cambia manualmente un recurso ficticio fuera del flujo Terraform.

#### Preguntas

- ¿Puede cambiar el plan posterior?
- ¿Qué debe averiguarse antes de aceptar una acción?
- ¿Quién es responsable del recurso?
- ¿El cambio manual era una emergencia?
- ¿Qué evidencia se necesita para decidir?

No conectes el laboratorio a una cuenta para reproducir la deriva.

### Sesión 21: revisar dos builds

**Objetivo:** comparar dos ejecuciones reproducibles.

#### Instrucciones

1. Ejecuta el pipeline dos veces sobre el mismo commit.
2. Compara agente y versión.
3. Compara salida de `init`.
4. Compara plan.
5. Identifica diferencias.
6. Comprueba si Jenkins limpió el workspace.
7. Describe posibles causas sin asumir una sola.

### Sesión 22: revisar una ejecución fallida

**Objetivo:** producir un diagnóstico útil.

#### Instrucciones

1. El docente proporciona un log de laboratorio con un error.
2. Identifica la primera etapa fallida.
3. Copia solo el mensaje no sensible necesario.
4. Comprueba versión, ruta y commit.
5. Formula una hipótesis.
6. Propón una comprobación siguiente.
7. No modifiques el sistema compartido.

### Sesión 23: limitar credenciales del job

**Objetivo:** comprobar que las etapas no reciben credenciales innecesarias.

#### Instrucciones

1. Revisa si el Pipeline utiliza `withCredentials`.
2. Revisa variables de entorno definidas por el job.
3. Revisa el agente asignado.
4. Comprueba que el proyecto de laboratorio no necesita credenciales cloud.
5. Detén el job si se solicitan.
6. Documenta la observación.

### Sesión 24: revisión por parejas

**Objetivo:** verificar el flujo completo.

La persona autora explica:

- Qué hace `init`.
- Qué hace `plan`.
- Por qué se usa `-backend=false`.
- Qué archivos pueden crearse.
- Qué información puede ser sensible.
- Por qué no se archiva el plan binario.

La persona revisora verifica:

- Rutas correctas.
- Versión compatible.
- Orden de etapas.
- Fallos propagados.
- Sin credenciales.
- Sin backend remoto.
- Sin `apply`.
- Sin `destroy`.
- Sin archivado amplio.

### Sesión 25: proyecto integrador

**Objetivo:** construir una pipeline de planificación local segura.

#### Requisitos

- Repositorio de laboratorio.
- Terraform 1.4 o posterior.
- Recurso `terraform_data`.
- Etapa de herramientas.
- Etapa de formato.
- Etapa `Init` con `-backend=false`.
- Etapa `Validate`.
- Etapa `Plan`.
- Agente identificado.
- `post` con mensajes claros.
- Prueba de éxito.
- Prueba de fallo controlado.
- Sin credenciales cloud.
- Sin backend remoto.
- Sin `apply` o `destroy`.
- Sin plan binario archivado.

#### Entrega

Incluye:

- `Jenkinsfile`.
- Archivos Terraform.
- Rama y commit.
- Número del build exitoso.
- Número del build fallido.
- Versión de Terraform.
- Resumen del plan.
- Diagnóstico del fallo.
- Explicación de por qué no se aplica infraestructura.

---

## Ejemplos de sesiones de diagnóstico

Estas actividades enseñan a buscar la causa sin ampliar permisos.

### Ejemplo: backend no esperado

#### Observación

`terraform init` indica que está configurando un backend remoto.

#### Acción

- Detén el pipeline.
- Revisa los archivos `.tf`.
- Comprueba la carpeta ejecutada.
- Confirma el commit.
- Consulta al responsable.
- No introduzcas credenciales.

### Ejemplo: falta un proveedor

#### Observación

`terraform init` indica que debe descargar un proveedor.

#### Acción

- Identifica el bloque `required_providers`.
- Revisa la fuente y versión.
- Comprueba si pertenece al laboratorio.
- Confirma si el registro está aprobado.
- No descargues un binario manualmente.

### Ejemplo: variable ausente

#### Observación

`terraform plan` informa de una variable requerida.

#### Acción

- Localiza la declaración.
- Confirma si la variable pertenece al ejercicio.
- Revisa el mecanismo aprobado para suministrarla.
- No pegues un secreto en la consola.
- Consulta al docente si no debería requerirse.

### Ejemplo: el plan propone destrucción

#### Observación

El plan indica una acción de destrucción.

#### Acción

- No ejecutes `apply`.
- Comprueba el directorio.
- Comprueba backend y workspace.
- Comprueba recursos y variables.
- Revisa si hay estado previo.
- Registra el hallazgo sin copiar información sensible.

### Ejemplo: el agente no encuentra Terraform

#### Observación

Jenkins informa que `terraform` no existe.

#### Acción

- Verifica la etiqueta.
- Verifica la versión desde el agente.
- Comprueba `PATH` sin imprimir el entorno completo.
- Confirma el sistema operativo.
- Solicita un agente preparado.
- No instales Terraform en un nodo compartido sin permiso.

---

## Checklist de seguridad y calidad

### Código y estructura

- [ ] Los archivos Terraform pertenecen al repositorio de laboratorio.
- [ ] La carpeta de trabajo está identificada.
- [ ] `required_version` coincide con el agente.
- [ ] No hay proveedor cloud innecesario.
- [ ] No hay módulos externos desconocidos.
- [ ] No hay credenciales ni valores personales.

### Etapa `init`

- [ ] Se ejecuta en el directorio correcto.
- [ ] Se utiliza `-input=false`.
- [ ] Se utiliza `-backend=false` en este laboratorio.
- [ ] No se añade `-upgrade` sin revisión.
- [ ] No se añade `-reconfigure` sin autorización.
- [ ] Los cambios de lockfile se inspeccionan.
- [ ] Las descargas inesperadas detienen la actividad.

### Etapa `plan`

- [ ] Se ejecuta después de `init`.
- [ ] Se ejecuta después de la validación.
- [ ] Se utiliza `-input=false`.
- [ ] La salida se revisa antes de compartir.
- [ ] El plan se asocia al commit correcto.
- [ ] No se ejecuta `apply`.
- [ ] No se ejecuta `destroy`.
- [ ] No se guarda un plan binario por defecto.

### Jenkins

- [ ] El agente tiene Terraform compatible.
- [ ] La etiqueta es la aprobada.
- [ ] El workspace y directorio están claros.
- [ ] Los errores detienen la ejecución.
- [ ] No se imprime el entorno completo.
- [ ] El timeout es razonable.
- [ ] Los artefactos usan patrones específicos.
- [ ] No se archivan estado, plan ni credenciales.

### Estado y backend

- [ ] No se utiliza un backend compartido en el laboratorio.
- [ ] No se versiona `terraform.tfstate`.
- [ ] No se copia estado de otra práctica.
- [ ] Se reconoce que el estado puede ser sensible.
- [ ] El backend real, si se usa en otro proyecto, está aprobado.

---

## Rúbrica de evaluación

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| `init` | No explica qué prepara | Describe backend, proveedores y módulos | Analiza opciones y dependencias del proyecto |
| `plan` | Lo confunde con `apply` | Interpreta acciones básicas | Revisa impacto, contexto, estado y reemplazos |
| Pipeline | Etapas incompletas | Ordena init, validate y plan | Propaga fallos y documenta cada etapa |
| Directorio | Ejecuta desde una ruta ambigua | Usa la carpeta correcta | Verifica rutas y reproducibilidad local/CI |
| Seguridad | Archiva artefactos amplios | No usa credenciales ni backend real | Justifica controles para estado y planes |
| Diagnóstico | Se limita a repetir el error | Identifica la etapa y la causa probable | Separa observación, hipótesis y comprobación |
| Evidencias | No asocia build y código | Registra versión, commit y resultado | Presenta evidencias mínimas y no sensibles |

### Evidencias mínimas

Entrega:

- `Jenkinsfile`.
- Configuración Terraform local.
- `.gitignore`.
- Versión de Terraform.
- Build exitoso.
- Build con fallo controlado.
- Resumen del plan.
- Informe de diagnóstico.
- Confirmación de que el plan no se aplicó.
- Confirmación de que no se utilizaron credenciales cloud.

---

## Preguntas de repaso

1. ¿Qué prepara `terraform init`?
2. ¿Qué diferencia hay entre backend, proveedor y módulo?
3. ¿Qué puede descargar `init`?
4. ¿Qué hace `-backend=false` en este laboratorio?
5. ¿Por qué no se debe usar esa opción automáticamente en producción?
6. ¿Qué aporta `.terraform.lock.hcl`?
7. ¿Qué función tiene `-input=false`?
8. ¿Qué calcula `terraform plan`?
9. ¿Qué diferencia hay entre un plan de consola y uno guardado?
10. ¿Por qué un archivo `tfplan` puede ser sensible?
11. ¿Por qué un plan exitoso no equivale a una aprobación?
12. ¿Qué comprobaciones deberían ejecutarse antes de `plan`?
13. ¿Dónde se ejecuta Terraform dentro de Jenkins?
14. ¿Por qué la etiqueta del agente importa?
15. ¿Qué ocurriría si `init` falla?
16. ¿Por qué no se debe ignorar un error de shell?
17. ¿Qué puede explicar diferencias entre dos planes?
18. ¿Por qué no se archiva el workspace completo?
19. ¿Qué debe revisarse si el plan propone una destrucción?
20. ¿Qué evidencias permiten relacionar un build con su código?

---

## Glosario

- **Agente Jenkins:** nodo que ejecuta los comandos de un job.
- **Backend:** mecanismo que almacena el estado de Terraform.
- **Bloqueo:** mecanismo que limita operaciones concurrentes sobre un estado.
- **Build:** ejecución de un job en Jenkins.
- **Checkout:** obtención del código desde el sistema de control de versiones.
- **Commit:** revisión identificable del código en Git.
- **`dir`:** paso de Pipeline que ejecuta pasos dentro de un directorio.
- **`terraform_data`:** recurso integrado de Terraform para guardar datos en su modelo.
- **`terraform init`:** comando que prepara el directorio de trabajo.
- **`terraform validate`:** comando que comprueba la configuración inicializada.
- **`terraform plan`:** comando que calcula acciones previstas.
- **`terraform apply`:** comando que puede aplicar cambios a recursos.
- **`terraform destroy`:** comando que puede eliminar recursos gestionados.
- **`-backend=false`:** opción de `init` que evita inicializar un backend para esa operación.
- **`-input=false`:** opción que evita preguntas interactivas.
- **`-no-color`:** opción que elimina códigos de color de la salida.
- **Archivo de bloqueo:** archivo que registra selecciones de proveedores.
- **Módulo:** conjunto de configuración Terraform reutilizable.
- **Plan guardado:** archivo creado con `terraform plan -out`.
- **Proveedor:** plugin que permite interactuar con una plataforma.
- **Recurso:** objeto descrito y gestionado por Terraform.
- **Estado:** registro que relaciona la configuración con objetos administrados.
- **Workspace Jenkins:** directorio de trabajo del job.
- **Workspace Terraform:** selección de estado asociada a una configuración, cuando se usa esa función.
- **Artefacto:** archivo que Jenkins conserva como resultado de un build.
- **Lockfile:** nombre común del archivo de bloqueo de proveedores.
- **Deriva:** diferencia entre la configuración declarada y el estado observado.
- **CI:** integración continua, ejecución automatizada de comprobaciones.

---

## Plantilla de informe de ejecución

```text
Job:
Número de build:
Repositorio:
Rama:
Commit:
Agente:
Versión de Terraform:
Directorio Terraform:
Resultado de fmt:
Resultado de init:
Resultado de validate:
Resultado de plan:
Acciones resumidas:
Archivos archivados:
¿Se aplicaron cambios?: No
Observaciones:
```

No incluyas el contenido completo del estado ni de un plan sensible.

---

## Plantilla de diagnóstico

```text
Etapa fallida:
Comando:
Directorio:
Versión de Terraform:
Primer mensaje relevante:
Resultado esperado:
Resultado observado:
Hipótesis:
Comprobación realizada:
Resultado de la comprobación:
Acción autorizada:
```

Distingue claramente entre hechos observados y explicaciones todavía no verificadas.

---

## Síntesis final

Las etapas `init` y `plan` preparan y analizan una configuración, pero no deben tratarse como operaciones sin riesgo.

- `terraform init` puede configurar un backend y descargar proveedores o módulos.
- `terraform plan` calcula acciones a partir de la configuración y el contexto disponible.
- En esta práctica, `-backend=false` mantiene la inicialización en el ámbito local.
- El plan no es una aprobación ni una aplicación.
- El estado y los planes pueden contener información sensible.
- La pipeline debe ejecutarse en el agente y directorio esperados.
- Los fallos deben propagarse; no los ocultes con `|| true`.
- No archives el workspace completo.
- No añadas credenciales cloud a la práctica.
- No ejecutes `terraform apply` ni `terraform destroy`.