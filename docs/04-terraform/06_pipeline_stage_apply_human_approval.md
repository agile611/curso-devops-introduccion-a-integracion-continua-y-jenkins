# 06_pipeline_stage_apply_human_approval.md — Etapa `apply` con aprobación humana

Esta guía enseña a diseñar una etapa de aplicación de Terraform protegida por una aprobación humana en Jenkins. El ejemplo está limitado a un laboratorio local: utiliza `terraform_data`, no declara proveedores cloud, no necesita credenciales y solo modifica el estado local del proyecto. No administra máquinas, redes ni servicios externos.

El flujo muestra cómo generar un plan guardado, revisarlo, pedir una aprobación explícita y aplicar **ese mismo plan**. En un entorno real, la aprobación de Jenkins no basta por sí sola: hacen falta identidades y permisos mínimos, un backend protegido, control de cambios, revisión del plan y procedimientos de recuperación.

> **Límite de seguridad:** ejecuta este ejemplo exclusivamente en la carpeta y el agente de laboratorio asignados. No añadas proveedores cloud, credenciales, backends compartidos ni recursos reales. No uses este `Jenkinsfile` para producción. El archivo de plan y el estado pueden contener datos sensibles; no los archives ni los compartas.

---

## Objetivos y alcance

La práctica enseña a colocar una aprobación humana entre el plan y la aplicación.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar qué hace `terraform apply`.
- Distinguir un plan de su aplicación.
- Entender por qué se guarda un plan para aplicar exactamente lo revisado.
- Crear un Pipeline declarativo con una etapa de aprobación.
- Limitar quién puede aprobar una ejecución.
- Establecer un tiempo límite para la aprobación.
- Impedir ejecuciones concurrentes del mismo job.
- Evitar archivar el plan binario por defecto.
- Identificar qué debe revisar una persona antes de aprobar.
- Describir qué cambia al pasar del laboratorio a producción.
- Diagnosticar cancelaciones, rechazos y errores de aplicación.
- Documentar una ejecución sin exponer información sensible.
- Reconocer que una aprobación manual no reemplaza las demás medidas de seguridad.

### Qué se construirá

El laboratorio ejecutará este flujo:

1. Obtendrá el repositorio.
2. Comprobará la versión de Terraform.
3. Revisará el formato.
4. Inicializará el directorio sin backend remoto.
5. Validará la configuración.
6. Generará un plan guardado en el workspace.
7. Esperará una aprobación humana autorizada.
8. Aplicará exactamente el plan guardado si se aprueba.
9. Omitirá la aplicación si se rechaza, cancela o agota el tiempo.
10. Eliminará el archivo de plan temporal al finalizar, según el procedimiento del laboratorio.

### Qué significa “aplicar” en esta práctica

La configuración usa `terraform_data`.

En este ejercicio, la aplicación actualiza el estado local del laboratorio para que Terraform registre el recurso de prueba.

No crea recursos cloud ni realiza conexiones de administración remota.

### Qué queda fuera

Este ejercicio no:

- Se conecta a una nube.
- Usa credenciales de proveedor.
- Administra servidores.
- Configura un backend remoto.
- Gestiona estado compartido.
- Aplica cambios en una cuenta real.
- Destruye infraestructura.
- Sirve como plantilla directa para producción.
- Autoriza al alumnado a ejecutar cambios reales.

### Requisito de supervisión

La etapa `apply` se practica únicamente en un entorno aislado aprobado por el docente.

Si el agente tiene credenciales cloud preexistentes o no se conoce su alcance, no ejecutes el pipeline hasta confirmar el contexto.

---

## Aplicar un plan con Terraform

`terraform apply` puede convertir las acciones de un plan en cambios sobre los recursos administrados.

### Qué hace `terraform apply`

Terraform puede utilizarse de dos formas generales:

- Invocar `apply` sin un plan guardado, para calcular y aplicar acciones según su flujo interactivo.
- Invocar `apply` con un archivo de plan guardado, para aplicar las acciones contenidas en ese plan.

En esta práctica se utiliza la segunda forma.

### Por qué aplicar un plan guardado

El flujo ideal para una revisión controlada es:

```text
Generar plan
     |
     v
Revisar el plan
     |
     v
Aprobar el plan revisado
     |
     v
Aplicar ese mismo plan
```

Así se evita que el paso posterior genere silenciosamente un plan diferente.

### No volver a calcular después de aprobar

No uses esta secuencia como sustituto de aplicar el plan revisado:

```text
Plan A
Aprobación de Plan A
Generar Plan B
Aplicar Plan B
```

La aprobación de una propuesta no debe autorizar automáticamente otra propuesta distinta.

### Aplicar un plan guardado

La forma general es:

```bash
terraform apply -input=false tfplan
```

Cuando se pasa un plan guardado, Terraform aplica las acciones incluidas en ese plan.

La existencia del archivo no significa que el cambio esté autorizado.

La aprobación debe ocurrir antes de ejecutar el comando.

### Por qué el ejemplo no usa `-auto-approve`

El ejemplo usa una compuerta explícita de Jenkins antes de `apply`.

El pipeline aplica un plan guardado y no añade `-auto-approve`.

No añadas `-auto-approve` como atajo ni elimines la compuerta humana.

### El plan puede dejar de ser aplicable

Un plan guardado se genera en un contexto concreto.

Puede dejar de ser aplicable o apropiado si cambia:

- El estado.
- La configuración.
- El commit.
- Las variables.
- El backend.
- El workspace.
- El proveedor.
- El entorno.
- Los recursos externos.
- La identidad utilizada.

Si Terraform informa que el plan está obsoleto, detén el flujo y vuelve a revisar el contexto. No intentes forzar la aplicación.

### Efectos de `apply`

En un entorno real, aplicar un plan puede:

- Crear recursos.
- Modificar recursos.
- Eliminar recursos.
- Reemplazar recursos.
- Alterar permisos.
- Generar costes.
- Interrumpir servicios.
- Cambiar datos persistentes.
- Afectar recursos dependientes.

Por eso `apply` se considera una operación de mayor impacto que `validate` o `plan`.

### El resultado del build no demuestra el estado del servicio

Un `apply` exitoso no demuestra por sí solo que:

- La aplicación funcione.
- El servicio esté disponible.
- Se cumplan todos los controles.
- El coste sea correcto.
- No haya errores en componentes relacionados.

En producción se necesitan comprobaciones posteriores.

---

## Diseñar una aprobación humana

Una aprobación útil requiere contexto suficiente para tomar una decisión informada.

### Qué debe revisar la persona aprobadora

Antes de aprobar, la persona debería conocer:

- El repositorio.
- La rama.
- El commit.
- El entorno.
- El backend.
- El workspace.
- La identidad que ejecutaría el cambio.
- Las acciones del plan.
- Las destrucciones o reemplazos.
- Los impactos posibles.
- Las advertencias.
- El motivo del cambio.
- El procedimiento de recuperación.

### La aprobación debe identificar el build

Una aprobación debe referirse a una ejecución concreta.

Como mínimo, presenta:

- Número del build.
- Commit.
- Rama.
- Resultado de las validaciones.
- Nombre del entorno de laboratorio.
- Ubicación de la salida del plan.
- Instrucción de no aprobar si el contexto no coincide.

### Quién puede aprobar

El job debe restringir la aprobación a personas o grupos autorizados.

En un ejemplo de Jenkins declarativo se puede utilizar el argumento `submitter` del paso `input`.

El grupo y los nombres válidos dependen de la instancia.

### No dejar `submitter` abierto por comodidad

Si no se limita quién puede aprobar, una persona con acceso al job podría aceptar el cambio sin autoridad adecuada.

En el laboratorio, usa el usuario o grupo asignado por el docente.

### Aprobación y autoría

Evita que la persona que propone el cambio sea también la única persona que lo aprueba cuando la política requiera separación de funciones.

La separación concreta depende del nivel de impacto y del entorno.

### Tiempo límite

Una aprobación pendiente no debería quedar abierta indefinidamente.

Usa un timeout razonable.

Si vence:

- El job debe detenerse o quedar abortado según la configuración.
- No debe continuar a `apply`.
- El archivo temporal debe gestionarse según la política del workspace.

### Rechazo y cancelación

Una persona puede rechazar o abortar la ejecución.

Un rechazo significa que no se aplica el plan.

La persona que revisa puede dejar un comentario o registrar el motivo mediante el canal aprobado.

### Preguntas que debe hacerse quien aprueba

- ¿Es el commit que se revisó?
- ¿Es el entorno correcto?
- ¿El plan contiene solo los cambios solicitados?
- ¿Hay acciones de destrucción?
- ¿Hay reemplazos?
- ¿Se entiende el impacto?
- ¿Se identificó la identidad de ejecución?
- ¿La salida contiene datos sensibles?
- ¿La aprobación corresponde a este build y no a otro?
- ¿Existe un procedimiento si algo falla?

### Aprobación no equivale a seguridad automática

El paso `input` de Jenkins no:

- Revisa el plan por sí mismo.
- Impide que el código del job sea malicioso.
- Limita los permisos del proveedor.
- Garantiza que el estado sea correcto.
- Protege el agente.
- Sustituye un sistema de cambios corporativo.
- Sustituye una revisión técnica.

---

## Preparar el laboratorio

El proyecto de laboratorio limita las operaciones a un recurso local de Terraform.

### Requisitos

Se requiere:

- Terraform 1.4 o posterior.
- Jenkins con Pipeline declarativo.
- Un agente asignado por el curso.
- Git si el job obtiene el código desde SCM.
- Un repositorio de laboratorio.
- Permiso para ejecutar el job.
- Un grupo aprobador definido por el docente.

No se requieren:

- Claves SSH.
- Credenciales cloud.
- Proveedores externos.
- Backend remoto.
- Permisos administrativos del agente.

### Estructura del repositorio

```text
apply-approval-lab/
├── Jenkinsfile
├── README.md
├── .gitignore
└── terraform/
    ├── main.tf
    └── outputs.tf
```

### Crear el directorio

En Unix-like:

```bash
mkdir -p apply-approval-lab/terraform
cd apply-approval-lab
```

En PowerShell:

```powershell
New-Item -ItemType Directory -Force apply-approval-lab\terraform
Set-Location apply-approval-lab
```

### Archivo `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "aprobacion_laboratorio" {
  input = {
    proyecto = "apply-approval-lab"
    entorno  = "laboratorio"
    mensaje  = "Recurso local de prueba para una aprobación humana"
  }
}
```

### Archivo `terraform/outputs.tf`

```hcl
output "resumen_laboratorio" {
  description = "Datos no sensibles del recurso local de práctica."
  value       = terraform_data.aprobacion_laboratorio.output
}
```

### Qué modifica este recurso

`terraform_data` representa datos dentro del modelo de Terraform.

La aplicación de este proyecto afecta al estado local del laboratorio.

No crea una máquina virtual, una red ni un recurso de proveedor cloud.

### Archivo `.gitignore`

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

El archivo se debe ajustar a la política del repositorio.

### Revisar los archivos antes de ejecutar

Comprueba que:

- No hay un bloque `backend`.
- No hay bloques `provider` de nube.
- No hay módulos remotos.
- No hay credenciales.
- No hay variables de producción.
- El recurso de prueba es el único recurso administrado.
- El `Jenkinsfile` contiene la compuerta de aprobación.

### Recurso local y alcance del aprendizaje

El recurso local permite estudiar:

- Generación de un plan.
- Pausa del pipeline.
- Identidad de quien aprueba.
- Aplicación de un plan guardado.
- Resultado de la ejecución.

No representa los riesgos, costes ni impactos de una infraestructura real.

---

## Flujo del pipeline

La pipeline organiza los pasos en una secuencia que hace visible la decisión humana.

### 1. Checkout y contexto

Jenkins obtiene el código desde el repositorio.

El build debe permitir identificar:

- Rama.
- Commit.
- Job.
- Agente.
- Número de ejecución.

### 2. Comprobar herramientas

La pipeline verifica la versión de Terraform.

Un agente incorrecto puede producir un plan distinto o incompatible.

### 3. Comprobar formato

`terraform fmt -check` detecta archivos sin formato.

No debería modificar el repositorio.

### 4. Inicializar

En esta práctica:

```bash
terraform init -backend=false -input=false -no-color
```

La inicialización no usa un backend remoto.

### 5. Validar

`terraform validate` detecta errores estructurales antes de planificar.

No garantiza que el plan sea aceptable.

### 6. Crear un plan guardado

El Pipeline ejecuta:

```bash
terraform plan -input=false -no-color -out=tfplan
```

El plan se conserva temporalmente en el workspace.

No se archiva como artefacto.

### 7. Solicitar aprobación

Jenkins se detiene en la etapa de aprobación.

El mensaje identifica el build y la revisión que debe comprobarse.

Solo una persona autorizada puede aprobar.

### 8. Aplicar el plan aprobado

Si la aprobación ocurre dentro del plazo:

```bash
terraform apply -input=false tfplan
```

Terraform aplica el plan guardado.

No se genera un plan nuevo entre la aprobación y la aplicación.

### 9. Rechazo, cancelación o timeout

Si la persona rechaza, cancela o no responde dentro del plazo:

- La ejecución no llega a `apply`.
- No se aplica el plan.
- Jenkins registra que el build fue abortado o fallido según la configuración.
- El archivo temporal se gestiona según la política de limpieza.

### 10. Resultado y limpieza

Al final:

- Se informa del resultado.
- Se elimina `tfplan` si la política del laboratorio lo permite.
- No se archiva el estado.
- No se archiva el plan binario.
- El workspace sigue la política configurada para el job.

---

## Jenkinsfile de laboratorio

El ejemplo completo aplica únicamente el recurso local `terraform_data`.

### Antes de usar el archivo

Sustituye los valores ilustrativos por los que asigne el curso:

- `terraform-lab`: etiqueta aprobada del agente.
- `terraform-reviewers`: grupo autorizado para aprobar.
- `terraform/`: directorio de configuración.

Confirma los nombres de grupos con el administrador de Jenkins.

### Pipeline completo

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        TF_IN_AUTOMATION = 'true'
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

        stage('Inicializar laboratorio') {
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

        stage('Crear plan') {
            steps {
                dir('terraform') {
                    sh 'terraform plan -input=false -no-color -out=tfplan'
                }
            }
        }

        stage('Aprobación humana') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        input(
                            message: """Revisa el plan del laboratorio antes de continuar.
Job: ${env.JOB_NAME}
Build: ${env.BUILD_NUMBER}
Commit: ${env.GIT_COMMIT ?: 'No disponible'}
Este ejercicio solo usa terraform_data local.
Aprueba únicamente si has verificado el contexto.""",
                            ok: 'Aprobar plan de laboratorio',
                            submitter: 'terraform-reviewers'
                        )
                    }
                }
            }
        }

        stage('Aplicar plan aprobado') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -input=false tfplan'
                }
            }
        }

        stage('Verificar resultado local') {
            steps {
                dir('terraform') {
                    sh 'terraform output -no-color'
                }
            }
        }
    }

    post {
        success {
            echo 'El plan local fue aprobado y aplicado correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        aborted {
            echo 'El pipeline fue rechazado, cancelado o excedió el tiempo de aprobación.'
        }

        always {
            dir('terraform') {
                sh 'rm -f tfplan'
            }
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Revisión obligatoria antes de usarlo

El `Jenkinsfile` es un ejemplo educativo.

Antes de ejecutarlo, confirma:

- Que el job está en una instancia de laboratorio.
- Que el agente no tiene credenciales cloud disponibles.
- Que el grupo de aprobación es correcto.
- Que solo contiene `terraform_data`.
- Que el backend remoto no está configurado.
- Que las rutas coinciden.
- Que la política permite eliminar el archivo de plan mediante `rm -f`.
- Que el Pipeline declarativo y las funciones usadas están disponibles.

### Sobre `TF_IN_AUTOMATION`

La variable `TF_IN_AUTOMATION` indica a Terraform que se está ejecutando en un contexto automatizado.

No es una credencial y no hace que una operación sea segura.

### Sobre `disableConcurrentBuilds()`

Evita que el mismo job ejecute builds simultáneos en paralelo.

Es un control adicional para el laboratorio.

No sustituye el bloqueo de estado de un backend remoto.

### Sobre el timeout general

El timeout total limita cuánto puede durar el build.

El timeout de aprobación limita cuánto puede quedar esperando la compuerta.

Ajusta ambos valores según el ejercicio.

### Sobre el mensaje de aprobación

El mensaje incluye metadatos y el límite del ejercicio.

No incluye el contenido completo del plan ni valores sensibles.

En un proyecto real, el mensaje debería dirigir a la persona aprobadora a una vista protegida del plan.

### Sobre `submitter`

`submitter` restringe quién puede responder al paso `input`, según la configuración de Jenkins.

Utiliza un usuario o grupo válido para la instancia.

No dejes este campo sin configurar en una etapa de alto impacto sin aprobación del administrador.

### Sobre `GIT_COMMIT`

`GIT_COMMIT` puede no estar definido en todos los tipos de job.

El ejemplo utiliza un texto alternativo si falta.

En un flujo real, confirma cómo se obtiene la revisión exacta.

### Sobre `terraform apply -input=false tfplan`

Se aplica el archivo de plan generado antes de la aprobación.

La aplicación no vuelve a calcular un plan nuevo como parte de ese comando.

No se añade `-auto-approve`.

### Sobre `terraform output`

El ejemplo muestra una salida no sensible del recurso local.

No agregues salidas que impriman tokens, claves, contraseñas o datos restringidos.

### Sobre `rm -f tfplan`

El ejemplo elimina el plan temporal al terminar.

Este comando solo debe ejecutarse en la carpeta de laboratorio definida por `dir`.

No amplíes la limpieza a rutas externas al workspace.

### Alternativa de limpieza con Jenkins

Algunas instancias disponen de pasos de limpieza de workspace mediante plugins.

Su disponibilidad y configuración varían.

Usa el mecanismo aprobado por el curso.

No reemplaces la limpieza específica del archivo por un borrado amplio sin revisión.

---

## Explicación por etapas

Cada etapa tiene un propósito distinto y una condición para continuar.

### Comprobar herramientas

Comprueba que el agente ejecuta las herramientas esperadas.

Si la versión de Terraform no es compatible, el pipeline debe detenerse antes de generar el plan.

### Comprobar formato

`terraform fmt -check -recursive`:

- Detecta formato incorrecto.
- No debería modificar archivos.
- Permite que la revisión de código vea la corrección como un cambio explícito.

### Inicializar

`terraform init -backend=false`:

- Prepara el directorio de trabajo.
- No configura un backend remoto para esta operación.
- Puede preparar dependencias si el proyecto las declara.

El proyecto del ejercicio no necesita proveedores cloud.

### Validar

`terraform validate`:

- Comprueba aspectos estructurales de la configuración.
- No aplica recursos.
- No aprueba cambios.
- No garantiza que el plan sea seguro.

### Crear plan

`terraform plan -out=tfplan`:

- Calcula acciones.
- Muestra un resumen.
- Escribe un archivo de plan.
- No aplica las acciones.
- Puede crear un archivo que debe protegerse.

### Aprobación

`input`:

- Pausa la ejecución.
- Espera una acción humana.
- Puede limitar quién responde.
- Puede expirar por timeout.
- No revisa automáticamente la salida del plan.

### Aplicar

`terraform apply tfplan`:

- Aplica el contenido del plan guardado.
- Puede fallar si el contexto o el estado han cambiado.
- No debe llegar a ejecutarse si la aprobación no se concedió.

### Verificar salida

`terraform output`:

- Muestra salidas de Terraform.
- En este laboratorio muestra datos no sensibles.
- Puede revelar información si se modifican las salidas.

### `post`

`post`:

- Informa del resultado.
- Ejecuta acciones finales según el estado del build.
- Debe ser prudente con logs y limpieza.
- No debe ocultar la causa del fallo.

---

## Control de concurrencia

Las aprobaciones prolongadas pueden coincidir con otras ejecuciones.

### Dos builds del mismo job

Si dos builds planifican o aplican al mismo tiempo, podrían competir por el mismo workspace o estado.

El ejemplo usa:

```groovy
disableConcurrentBuilds()
```

### Control de concurrencia no es bloqueo de estado

`disableConcurrentBuilds()` afecta a ejecuciones del job en Jenkins.

No impide que otra persona o pipeline distinta modifique el mismo estado remoto.

Un backend real necesita su propio mecanismo de bloqueo.

### Estado local del laboratorio

El estado local de este ejercicio puede residir en el workspace.

La política del agente puede conservarlo o limpiarlo.

Confirma el comportamiento antes de hacer pruebas repetidas.

### Evitar workspace compartido manualmente

No configures dos jobs distintos para compartir un directorio de trabajo sin un diseño aprobado.

### El plan pendiente y el estado

Mientras Jenkins espera aprobación, el estado o los recursos pueden cambiar por otra vía.

En el laboratorio se limita el alcance a un agente de práctica.

En un sistema real, el plan puede quedar obsoleto mientras espera.

### Bloqueo y espera humana

Mantener un bloqueo de estado durante una aprobación prolongada puede bloquear otros cambios.

La estrategia depende del backend y del proceso.

No supongas que el bloqueo se mantiene o se libera de una manera concreta sin verificarlo.

---

## Registro de la aprobación

La aprobación debe ser trazable sin registrar secretos.

### Información útil

Registra:

- Job.
- Build.
- Commit.
- Entorno.
- Identidad de quien aprueba.
- Momento de la aprobación.
- Resultado de la operación.
- Enlace interno al plan revisado, si la política lo permite.

### Información que no debe registrarse

No registres:

- Claves.
- Tokens.
- Contraseñas.
- Variables de entorno completas.
- Estado completo.
- Plan binario en un canal público.
- Datos de recursos restringidos.

### Evidencia del aprobador

Jenkins puede registrar quién respondió a `input`, dependiendo de la configuración y los plugins.

Comprueba la funcionalidad de auditoría de la instancia.

No uses un usuario genérico compartido si la política requiere atribución individual.

### Comentarios de aprobación

Si la herramienta permite comentarios, pide una referencia breve al motivo o al ticket.

No pidas que se pegue el plan completo en el comentario.

### Aprobación accidental

Una persona puede pulsar “aprobar” sin revisar.

Reduce ese riesgo mediante:

- Mensajes claros.
- Permisos limitados.
- Revisión previa.
- Entornos bien identificados.
- Tiempo suficiente.
- Procedimientos de cancelación.
- Separación de funciones cuando corresponda.

---

## Revisar un plan antes de aprobar

La decisión debe basarse en el plan correcto y en el contexto correcto.

### Confirmar el build

Comprueba:

- Job.
- Build.
- Commit.
- Rama.
- Agente.
- Directorio.
- Versión de Terraform.
- Resultado de las etapas previas.

### Confirmar el entorno

En una pipeline real, confirma:

- Cuenta.
- Proyecto.
- Región.
- Backend.
- Workspace.
- Identidad.
- Variables.
- Etiquetas de entorno.

En la práctica, confirma que se trata del laboratorio local.

### Revisar acciones

Identifica:

- Recursos creados.
- Recursos actualizados.
- Recursos eliminados.
- Recursos reemplazados.
- Dependencias afectadas.
- Datos que no se conocen durante el plan.

### Revisar la intención

Compara el plan con el objetivo del cambio.

Pregunta:

- ¿El plan contiene solo el cambio solicitado?
- ¿Se han añadido acciones no relacionadas?
- ¿Las variables corresponden al entorno?
- ¿El cambio está documentado?
- ¿El cambio fue revisado en Git?

### Revisar riesgos

Evalúa:

- Interrupción.
- Pérdida de datos.
- Permisos.
- Exposición de red.
- Coste.
- Requisitos regulatorios.
- Dependencias.
- Reversibilidad.

### Detenerse ante incertidumbre

No apruebes si:

- No conoces el entorno.
- No entiendes una destrucción.
- No entiendes un reemplazo.
- Falta el commit.
- El plan no coincide con la revisión.
- La salida está incompleta.
- El backend no está identificado.
- El job utiliza credenciales inesperadas.
- Hay información sensible visible.
- El plan quedó esperando tanto tiempo que podría estar obsoleto.

### Rechazar no es un error

Rechazar o cancelar un plan puede ser la decisión correcta.

La persona aprobadora no debe sentirse obligada a aceptar para “hacer pasar” el build.

---

## Seguridad de la aprobación

La compuerta de Jenkins es solo una parte del control de cambios.

### Permisos de Jenkins

Limita quién puede:

- Ejecutar el job.
- Cambiar su configuración.
- Cambiar el `Jenkinsfile`.
- Aprobar el `input`.
- Administrar credenciales.
- Cambiar el agente.
- Descargar artefactos.

### Proteger el Pipeline

Una persona que puede cambiar el `Jenkinsfile` puede intentar modificar el comportamiento del job.

Protege la rama y revisa cambios de pipeline.

### Proteger ramas

En producción, limita las aplicaciones a ramas y revisiones confiables.

No permitas que código de pull requests no revisados reciba credenciales de aplicación.

### Aprobación asociada al plan

La persona debe aprobar el plan que se aplicará, no una descripción vaga de “ejecutar Terraform”.

En el ejemplo, se genera `tfplan` antes del paso de aprobación y se aplica el mismo archivo después.

### No exponer el plan innecesariamente

El plan puede ser visible en los logs o en un artefacto.

Define controles de acceso antes de presentarlo.

### Credenciales

El laboratorio no necesita credenciales de proveedor.

En un sistema real:

- Usa identidades dedicadas.
- Aplica mínimo privilegio.
- Separa lectura y aplicación cuando corresponda.
- Limita el acceso por entorno.
- Prefiere credenciales temporales si la plataforma lo permite.
- No imprimas el entorno completo.

### Agente

El agente debe estar protegido porque ejecuta código y puede recibir credenciales.

Considera:

- Aislamiento.
- Usuarios del sistema.
- Permisos del workspace.
- Acceso de red.
- Persistencia de archivos.
- Otros jobs que comparten el nodo.
- Limpieza al finalizar.

### No confiar únicamente en `submitter`

Restringir el aprobador en Jenkins ayuda a limitar quién responde.

No sustituye:

- Permisos del job.
- Revisión del código.
- Protección del agente.
- Gestión de identidades.
- Registro de auditoría.
- Políticas de aprobación externas.

### Separación de funciones

En un entorno con impacto real, la persona que escribe el cambio puede no ser quien lo aprueba o lo aplica.

Las reglas dependen de la organización y del impacto del servicio.

---

## Adaptación conceptual a un entorno real

El ejemplo de laboratorio no debe copiarse directamente a producción.

### Backend remoto

Un entorno real suele necesitar estado compartido con:

- Cifrado.
- Control de acceso.
- Bloqueo.
- Retención.
- Copias de seguridad.
- Auditoría.
- Recuperación.

La elección del backend debe aprobarla el equipo responsable.

### Identidad de proveedor

La identidad de aplicación debe:

- Tener permisos mínimos.
- Estar limitada al entorno.
- Ser distinta de una cuenta personal.
- Tener un propietario.
- Ser auditable.
- Poder revocarse.
- Evitar secretos permanentes cuando exista una alternativa aprobada.

### Plan y commit

El plan debe corresponder a:

- Un commit.
- Un entorno.
- Un estado.
- Un conjunto de variables.
- Una identidad.
- Un agente.
- Una versión conocida de Terraform y proveedores.

### Cambios entre plan y aplicación

Si cambia el estado o la configuración después de la revisión, genera un nuevo plan y vuelve a revisarlo según la política.

No fuerces la aplicación de un plan obsoleto.

### Aplicación en etapas

Un cambio real puede necesitar:

- Validación automática.
- Revisión de código.
- Revisión del plan.
- Aprobación.
- Aplicación controlada.
- Verificación posterior.
- Monitorización.
- Plan de recuperación.

### Costes

La persona aprobadora debe conocer posibles costes y recursos afectados.

Un plan de Terraform no siempre presenta una estimación completa del coste.

### Ventana de cambio

Los cambios con impacto sobre disponibilidad pueden necesitar una ventana de mantenimiento y comunicación previa.

### Recuperación

Antes de aplicar, define:

- Qué se considera fallo.
- Quién decide la recuperación.
- Qué datos deben conservarse.
- Qué copias existen.
- Cómo se restaura el servicio.
- Qué evidencia se registra.

### No usar aprobaciones como decoración

Un paso `input` vacío o genérico no aporta revisión efectiva.

El proceso debe dar a la persona aprobadora información, tiempo, autoridad y responsabilidad apropiados.

---

## Sesiones prácticas

Las sesiones siguen el flujo completo en un entorno local y supervisado.

### Preparación común

Antes de empezar:

- Usa un repositorio de laboratorio.
- Confirma la etiqueta del agente.
- Comprueba `terraform version`.
- Revisa el inventario de archivos.
- Confirma que no hay proveedor cloud.
- Confirma que no hay credenciales.
- Confirma que no hay backend remoto.
- No publiques el estado o el plan.
- Registra número de build y commit.
- Sigue las instrucciones del docente.

### Sesión 1: dibujar el flujo

**Objetivo:** visualizar dónde se produce la decisión humana.

Dibuja:

```text
Checkout
   |
   v
Init
   |
   v
Validate
   |
   v
Crear plan guardado
   |
   v
Aprobación humana
   |
   +--> Rechazo o timeout: detener
   |
   +--> Aprobación: aplicar plan guardado
```

Responde:

- ¿En qué etapa se genera el plan?
- ¿Qué espera la etapa de aprobación?
- ¿Qué ocurre si se rechaza?
- ¿Qué archivo se aplica después?
- ¿Por qué no se crea otro plan?

### Sesión 2: revisar la configuración

**Objetivo:** comprobar el alcance del ejercicio.

#### Instrucciones

1. Revisa `main.tf`.
2. Comprueba el requisito de versión.
3. Busca bloques `provider`.
4. Busca bloques `backend`.
5. Busca módulos externos.
6. Comprueba que solo aparece `terraform_data`.
7. Detén la sesión si aparece una configuración no esperada.

### Sesión 3: ejecutar el plan sin aplicar

**Objetivo:** establecer una línea de base antes de añadir el gate.

#### Comandos

```bash
terraform init -backend=false -input=false
```

```bash
terraform validate
```

```bash
terraform plan -input=false
```

#### Instrucciones

1. Ejecuta desde `terraform/`.
2. Lee el plan.
3. Anota el resumen.
4. Confirma que el plan es local.
5. No ejecutes `apply` manualmente.
6. Registra el commit.

### Sesión 4: localizar `tfplan` en el Pipeline

**Objetivo:** comprender dónde se guarda el plan.

#### Instrucciones

1. Revisa la etapa `Crear plan`.
2. Localiza `-out=tfplan`.
3. Comprueba que la ruta está dentro del módulo.
4. Confirma que `.gitignore` excluye `*.tfplan`.
5. Confirma que no se archiva el archivo.
6. Explica qué proceso lo elimina.

### Sesión 5: ejecutar hasta la aprobación

**Objetivo:** comprobar que el Pipeline se detiene antes de aplicar.

#### Instrucciones

1. Ejecuta el job de laboratorio.
2. Espera a la etapa `Aprobación humana`.
3. Comprueba el job, build y commit indicados.
4. No apruebes sin revisar el resultado.
5. Registra que la etapa `Aplicar plan aprobado` aún no se ha ejecutado.
6. Pide al docente que supervise el siguiente paso.

### Sesión 6: aprobar el plan del laboratorio

**Objetivo:** practicar una aprobación explícita.

#### Instrucciones

1. Comprueba que el build es el previsto.
2. Comprueba que las etapas previas terminaron correctamente.
3. Comprueba que el plan corresponde al recurso local.
4. Comprueba que no hay proveedor cloud.
5. Comprueba que el grupo de aprobación es el asignado.
6. Aprueba únicamente con autorización del docente.
7. Revisa el resultado de `apply`.
8. No interpretes el ejercicio como autorización para infraestructura real.

### Sesión 7: observar la ejecución tras la aprobación

**Objetivo:** relacionar aprobación y aplicación.

#### Instrucciones

1. Revisa la marca temporal de la aprobación.
2. Revisa la etapa `Aplicar plan aprobado`.
3. Comprueba que la orden utiliza `tfplan`.
4. Confirma que no aparece `-auto-approve`.
5. Revisa la salida de Terraform.
6. Registra el resultado sin copiar el estado.

### Sesión 8: rechazar una aprobación

**Objetivo:** confirmar que rechazar impide la etapa de aplicación.

#### Instrucciones

1. Ejecuta el job hasta la compuerta.
2. Utiliza el mecanismo de rechazo o cancelación indicado por el docente.
3. Comprueba que `apply` no se ejecutó.
4. Revisa el resultado final del build.
5. Confirma que el plan no se archiva.
6. Documenta el resultado.

### Sesión 9: dejar expirar la aprobación

**Objetivo:** comprobar el timeout de la compuerta.

#### Instrucciones

1. Ejecuta el job de laboratorio.
2. No respondas al `input`.
3. Espera el timeout bajo supervisión.
4. Comprueba que la etapa de aplicación no se ejecuta.
5. Registra si el job terminó como abortado o fallido.
6. Revisa la limpieza del archivo temporal.

No provoques expiraciones prolongadas en un Jenkins compartido sin permiso.

### Sesión 10: probar un error de formato

**Objetivo:** confirmar que el Pipeline no llega a la aprobación con formato inválido.

#### Instrucciones

1. Cambia la indentación de un archivo en una copia de laboratorio.
2. Ejecuta el job.
3. Identifica la etapa fallida.
4. Confirma que `Plan` no se ejecuta.
5. Confirma que `Aprobación humana` no aparece.
6. Restaura el formato correcto.

### Sesión 11: probar un error de validación

**Objetivo:** comprobar la dependencia entre `validate`, `plan` y `apply`.

#### Instrucciones

1. Introduce un error sintáctico controlado en una copia.
2. Ejecuta el job.
3. Registra el primer error.
4. Comprueba que no se solicita aprobación.
5. Comprueba que no se ejecuta `apply`.
6. Restaura la configuración válida.

### Sesión 12: revisar un plan con destrucción ficticia

**Objetivo:** practicar una decisión de rechazo.

El docente presenta una salida ficticia con una acción de eliminación.

#### Instrucciones

1. Identifica el recurso afectado.
2. Identifica el entorno.
3. Enumera información que falta.
4. Explica por qué no aprobarías automáticamente.
5. No modifiques el proyecto local para imitar la destrucción.
6. Registra una decisión de revisión, no de aplicación.

### Sesión 13: revisar el mensaje de aprobación

**Objetivo:** comprobar si la persona tiene contexto suficiente.

Evalúa si el mensaje muestra:

- Job.
- Build.
- Commit.
- Entorno.
- Resultado de validaciones.
- Límite del laboratorio.
- Instrucción de revisión.

Propón mejoras que no publiquen valores sensibles.

### Sesión 14: probar un aprobador no autorizado

**Objetivo:** verificar el límite de `submitter` en una instancia de laboratorio.

#### Instrucciones

1. Ejecuta el job en el entorno supervisado.
2. Comprueba quién puede responder al `input`.
3. No cambies la configuración de permisos.
4. Registra el comportamiento.
5. Consulta al administrador si el límite no coincide con lo esperado.
6. No uses una cuenta ajena.

### Sesión 15: revisar concurrencia

**Objetivo:** entender el efecto de `disableConcurrentBuilds()`.

#### Instrucciones

1. Ejecuta el job hasta la aprobación.
2. Inicia un segundo build solo si el docente lo autoriza.
3. Observa cómo Jenkins gestiona la concurrencia.
4. No inicies otro job que comparta estado.
5. Explica por qué esta opción no sustituye el locking del backend.

### Sesión 16: comparar dos commits

**Objetivo:** asociar la aprobación a una revisión concreta.

#### Instrucciones

1. Ejecuta el plan para un commit de laboratorio.
2. Anota el commit mostrado en el gate.
3. Cambia un valor en una nueva revisión.
4. Genera un nuevo build.
5. Compara los commits y planes.
6. No apruebes el build anterior como si fuera el nuevo.

### Sesión 17: examinar la limpieza

**Objetivo:** comprobar qué ocurre con el archivo de plan.

#### Instrucciones

1. Inspecciona el patrón `tfplan`.
2. Revisa el bloque `post`.
3. Comprueba la ruta del comando de limpieza.
4. Confirma que la operación está limitada a `terraform/`.
5. No borres archivos fuera del workspace.
6. Sigue la política de limpieza del curso.

### Sesión 18: revisar el estado local

**Objetivo:** entender que `apply` actualiza el estado aunque el recurso sea local.

#### Instrucciones

1. Después de una aplicación supervisada, revisa el workspace autorizado.
2. Comprueba si hay archivos de estado.
3. No abras ni adjuntes su contenido.
4. Confirma que Git los ignora.
5. Elimina el workspace solo según instrucciones del docente.
6. Explica por qué el estado merece protección.

### Sesión 19: simular un plan obsoleto en discusión

**Objetivo:** reconocer por qué no se debe forzar un plan antiguo.

#### Escenario

El estado cambia mientras una aprobación está pendiente.

#### Preguntas

- ¿Sigue representando el plan el contexto actual?
- ¿Qué debería comprobar el equipo?
- ¿Conviene generar un plan nuevo?
- ¿Quién debe volver a revisarlo?
- ¿Qué riesgo tendría aplicar un plan antiguo?

No alteres estados compartidos para reproducir el escenario.

### Sesión 20: examinar códigos de salida

**Objetivo:** entender `-detailed-exitcode` y Jenkins.

#### Instrucciones

1. Lee la etapa opcional de planificación detallada.
2. Identifica los códigos `0`, `1` y `2`.
3. Explica qué código puede representar cambios previstos.
4. Explica por qué `sh` podría interpretar `2` como fallo.
5. Revisa cómo se debe comprobar cada código.
6. No uses `|| true`.

### Sesión 21: revisar el acceso a logs

**Objetivo:** evaluar qué información ve cada persona.

#### Instrucciones

1. Revisa los permisos del job de laboratorio.
2. Identifica quién puede leer la consola.
3. Identifica quién puede aprobar.
4. Identifica quién puede modificar el `Jenkinsfile`.
5. No cambies permisos existentes.
6. Propón una separación adecuada para otro entorno.

### Sesión 22: comparar la práctica con producción

**Objetivo:** listar los elementos que cambiarían antes de un despliegue real.

Completa:

```text
Backend:
Identidad:
Permisos:
Estado:
Plan:
Revisión:
Aprobador:
Concurrencia:
Ventana de cambio:
Costes:
Comprobación posterior:
Recuperación:
```

No configures ninguno de estos elementos en una cuenta real.

### Sesión 23: revisión por parejas

**Objetivo:** evaluar el Pipeline como artefacto ejecutable.

La persona autora explica:

- Qué recurso se aplica.
- Qué archivos usa.
- Dónde se genera el plan.
- Quién puede aprobar.
- Qué ocurre con rechazo y timeout.
- Cómo se aplica el mismo plan.
- Cómo se limpia el archivo temporal.

La persona revisora comprueba:

- No hay proveedores cloud.
- No hay credenciales.
- No hay backend remoto.
- El agente es de laboratorio.
- El commit es visible.
- El plan se genera antes de la aprobación.
- `apply` usa el archivo guardado.
- No se usa `-auto-approve`.
- El plan no se archiva.
- El timeout está definido.
- La concurrencia está controlada.
- La limpieza está limitada.

### Sesión 24: redactar una decisión de aprobación

**Objetivo:** practicar una revisión escrita.

Completa:

```text
Build:
Commit:
Entorno:
Resumen del plan:
Acciones de creación:
Acciones de cambio:
Acciones de destrucción:
Reemplazos:
Riesgos:
Información pendiente:
Decisión:
Motivo:
```

Para esta práctica, indica expresamente que el ámbito es local.

### Sesión 25: proyecto integrador

**Objetivo:** construir y documentar una aplicación con aprobación en laboratorio.

#### Requisitos

- Configuración `terraform_data`.
- `Jenkinsfile` declarativo.
- Verificación de versión.
- Formato.
- `init -backend=false`.
- `validate`.
- Plan guardado.
- Aprobación limitada.
- Timeout de aprobación.
- Control de concurrencia.
- `apply` del plan guardado.
- Verificación de salida local.
- Limpieza del plan.
- Prueba de aprobación.
- Prueba de rechazo o timeout.
- Prueba de fallo anterior al gate.
- Sin credenciales cloud.
- Sin backend remoto.
- Sin artefactos sensibles.

#### Entrega

Incluye:

- `Jenkinsfile`.
- Archivos Terraform.
- Rama y commit.
- Número del build aprobado.
- Número del build rechazado o agotado.
- Evidencia de la etapa de aprobación.
- Resultado de la aplicación local.
- Diagnóstico del fallo controlado.
- Explicación de por qué el ejemplo no es apto para producción.

---

## Errores frecuentes

### Usar `apply` sin compuerta

Añadir `terraform apply -auto-approve` directamente elimina la revisión humana.

No lo hagas como solución rápida.

### Generar un plan nuevo después de aprobar

Si se genera otro plan después de la aprobación, se puede aplicar un cambio que nadie revisó.

Aplica el archivo guardado que corresponde a la propuesta aprobada.

### Plan caducado u obsoleto

Un plan puede dejar de coincidir con el estado o el código.

Si Terraform lo rechaza, detén el flujo y vuelve a revisar.

### Aprobación sin contexto

Un mensaje como:

```text
¿Continuar?
```

no aporta suficiente información.

La persona debe conocer build, commit, entorno y propósito.

### `submitter` incorrecto

Si el usuario o grupo no existe o no tiene el formato esperado, la aprobación puede no funcionar como se espera.

Confirma los nombres con el administrador.

### Aprobación abierta

Sin límite temporal, el build puede quedar esperando demasiado tiempo.

Configura un timeout apropiado.

### Aplicación pese a rechazo

Revisa el flujo para confirmar que el paso de aplicación depende del resultado de `input`.

No captures y descartes una excepción de rechazo para continuar.

### `apply` no encuentra el plan

Comprueba:

- Directorio.
- Nombre del archivo.
- Workspace.
- Agente.
- Persistencia del archivo entre etapas.
- Limpieza anticipada.

No regeneres el plan y lo apliques sin una nueva revisión.

### El agente cambia entre etapas

En esta guía, un agente declarado a nivel de Pipeline ofrece un contexto de trabajo común para las etapas.

En un diseño distinto, comprueba que el plan guardado esté disponible en la etapa de aplicación y que corresponda al mismo build.

No uses un artefacto de un build anterior.

### La aplicación informa que el plan está obsoleto

No intentes forzar la operación.

Comprueba si cambió el estado, la configuración o el contexto.

Genera un plan nuevo y vuelve a revisarlo según el proceso autorizado.

### El build expira durante la aprobación

Verifica que:

- `apply` no se ejecutó.
- El job registra el timeout.
- El archivo temporal se limpia según la política.
- No queda un proceso ejecutándose en segundo plano.

### Error de validación que llega al gate

Comprueba que no hay lógica que ignore el código de salida de `validate`.

Revisa `returnStatus`, `catchError` y scripts con `|| true`.

### Plan o estado publicado como artefacto

Limita el acceso según el procedimiento.

Notifica al responsable y evalúa si contiene información sensible.

No te limites a quitar el enlace si ya se descargó.

### Limpieza demasiado amplia

Evita comandos como:

```bash
rm -rf *
```

La limpieza debe apuntar solo a un archivo o directorio de laboratorio cuyo alcance se haya confirmado.

### Etiqueta de agente incorrecta

Confirma que Jenkins ejecuta en el agente esperado.

No cambies a un agente con permisos superiores para resolver una espera.

### Ficha de diagnóstico

```text
Job:
Build:
Rama:
Commit:
Agente:
Versión:
Etapa fallida:
Aprobación solicitada:
Aprobador autorizado:
Archivo de plan:
Comando:
Primer mensaje relevante:
¿Se ejecutó apply?:
Resultado:
Hipótesis:
Comprobación siguiente:
```

No incluyas credenciales, contenido del estado ni archivos de plan.

---

## Checklist de seguridad

### Configuración

- [ ] El proyecto es de laboratorio.
- [ ] Solo usa `terraform_data`.
- [ ] No declara proveedores cloud.
- [ ] No declara un backend remoto.
- [ ] No contiene credenciales.
- [ ] La versión es compatible.
- [ ] El directorio de trabajo es el correcto.

### Plan

- [ ] Se ejecuta después de `init` y `validate`.
- [ ] Se guarda antes de la aprobación.
- [ ] El archivo pertenece a este build.
- [ ] El plan no se archiva por defecto.
- [ ] Se revisan acciones y entorno.
- [ ] La revisión corresponde al commit.
- [ ] Un plan obsoleto se rechaza y se vuelve a revisar.

### Aprobación

- [ ] La persona conoce el build y el commit.
- [ ] El mensaje identifica el alcance.
- [ ] El grupo aprobador es el autorizado.
- [ ] Hay timeout.
- [ ] Rechazo y cancelación impiden `apply`.
- [ ] La aprobación queda registrada.
- [ ] La aprobación no se trata como una garantía automática.

### Aplicación

- [ ] `apply` utiliza el plan guardado.
- [ ] No se usa `-auto-approve`.
- [ ] No se ejecuta si el `input` no se aprueba.
- [ ] No se regenera un plan después de la aprobación.
- [ ] La salida posterior no contiene secretos.
- [ ] La práctica no modifica recursos externos.

### Jenkins y agente

- [ ] El agente está autorizado.
- [ ] La etiqueta es correcta.
- [ ] La concurrencia está controlada.
- [ ] El workspace está identificado.
- [ ] El código de Pipeline se revisa.
- [ ] Los logs tienen acceso apropiado.
- [ ] La limpieza está limitada.
- [ ] No se imprime el entorno completo.

---

## Evaluación

La evaluación mide la comprensión del control humano y la integridad entre plan y aplicación.

### Evidencias mínimas

Entrega:

- `Jenkinsfile`.
- Configuración Terraform.
- Captura o registro del build con el gate, sin datos sensibles.
- Build aprobado en laboratorio.
- Build rechazado, cancelado o expirado.
- Commit y versión.
- Revisión escrita del plan.
- Diagnóstico de un fallo.
- Confirmación de que no se usó un proveedor cloud.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Plan y aplicación | Confunde ambos pasos | Explica su diferencia | Mantiene la relación entre plan, commit y estado |
| Gate humano | El gate es genérico | Restringe aprobadores y añade timeout | Diseña revisión trazable y adecuada al impacto |
| Aplicación | Aplica un plan nuevo | Aplica el plan guardado | Detecta y detiene planes obsoletos |
| Jenkins | Las etapas continúan tras errores | Ordena y controla etapas | Maneja rechazo, timeout y concurrencia |
| Seguridad | Publica el plan o usa credenciales | Limita el laboratorio | Diseña controles para agente, logs y estado |
| Revisión | Mira solo el resumen | Revisa acciones principales | Evalúa impacto, dependencias y recuperación |
| Evidencias | No identifica el build | Asocia build y commit | Documenta sin divulgar datos sensibles |

### Preguntas de evaluación

1. ¿Por qué se genera un plan antes de la aprobación?
2. ¿Por qué conviene aplicar el mismo archivo de plan?
3. ¿Qué información debe ver la persona aprobadora?
4. ¿Qué hace `submitter`?
5. ¿Qué debería ocurrir al vencer el timeout?
6. ¿Por qué `disableConcurrentBuilds()` no sustituye el bloqueo del backend?
7. ¿Qué significa que el plan esté obsoleto?
8. ¿Por qué no se usa `-auto-approve`?
9. ¿Qué puede contener `tfplan`?
10. ¿Por qué el archivo no se archiva por defecto?
11. ¿Qué controles adicionales se necesitan en producción?
12. ¿Qué información debe quedar en el registro de aprobación?
13. ¿Qué debería hacer una persona ante una destrucción inesperada?
14. ¿Qué ocurre si el agente cambia entre la etapa de plan y la de aplicación?
15. ¿Qué evidencia demuestra que la aplicación fue solo local?

---

## Glosario

- **Aprobación humana:** decisión explícita de una persona autorizada para continuar una ejecución.
- **Agente Jenkins:** nodo donde se ejecutan los comandos del Pipeline.
- **Artefacto:** archivo conservado por Jenkins como resultado de un build.
- **Backend:** mecanismo que almacena y coordina el estado de Terraform.
- **Build:** ejecución concreta de un job Jenkins.
- **Commit:** revisión identificable del código en Git.
- **`disableConcurrentBuilds()`:** opción de Pipeline para impedir ejecuciones simultáneas del mismo job.
- **`input`:** paso de Jenkins que pausa la ejecución y espera una decisión.
- **`submitter`:** restricción de Jenkins que limita quién puede responder a una entrada, según la configuración.
- **`terraform_data`:** recurso integrado de Terraform para almacenar datos en el modelo de Terraform.
- **`terraform plan`:** comando que calcula acciones previstas.
- **`terraform apply`:** comando que puede aplicar cambios a recursos.
- **Plan guardado:** archivo creado con `terraform plan -out`.
- **Plan obsoleto:** plan que ya no corresponde al contexto actual del estado o de la configuración.
- **Workspace de Jenkins:** directorio de trabajo de un job.
- **Workspace de Terraform:** selección de un estado asociada a la configuración, cuando se usa esa función.
- **Estado:** registro que relaciona la configuración con recursos administrados.
- **Timeout:** límite de tiempo para una ejecución o una aprobación.
- **Mínimo privilegio:** concesión de los permisos estrictamente necesarios.
- **Concurrencia:** ejecución simultánea de trabajos u operaciones.
- **`-input=false`:** opción que evita preguntas interactivas.
- **`-out`:** opción que guarda un plan en un archivo.
- **`-auto-approve`:** opción que omite una confirmación interactiva; no se usa en esta práctica.
- **Separación de funciones:** división de responsabilidades entre quien propone, revisa, aprueba y aplica.
- **Revisión de plan:** evaluación de las acciones previstas antes de permitir la aplicación.

---

## Plantilla de registro de aprobación

```text
Job:
Build:
Repositorio:
Rama:
Commit:
Entorno:
Agente:
Versión de Terraform:
Etapas previas:
Resumen no sensible del plan:
Acciones de creación:
Acciones de cambio:
Acciones de eliminación:
Reemplazos:
Persona aprobadora:
Momento de aprobación:
Decisión:
Motivo:
Resultado de apply:
Comprobación posterior:
```

No incluyas el contenido del estado ni valores sensibles.

---

## Plantilla de revisión previa

```text
¿El commit coincide con el cambio revisado?:
¿El entorno es el correcto?:
¿El backend es el esperado?:
¿La identidad de aplicación es la prevista?:
¿El plan contiene acciones no relacionadas?:
¿Hay destrucciones?:
¿Hay reemplazos?:
¿Se entiende el impacto?:
¿Hay información sensible visible?:
¿Existe un procedimiento de recuperación?:
Decisión:
Motivo:
```

Si alguna respuesta esencial es desconocida, detén la revisión y solicita la información que falta.

---

## Síntesis final

Una etapa de `apply` protegida por aprobación humana debe aplicar el plan revisado, no una propuesta distinta.

- Genera el plan antes del gate.
- Identifica build, commit y entorno.
- Limita quién puede aprobar.
- Establece un timeout.
- No continúa después de rechazo o cancelación.
- Aplica el archivo de plan guardado.
- No añade `-auto-approve`.
- No archives planes o estados sin una política aprobada.
- Controla la concurrencia y el workspace.
- Revisa destrucciones, reemplazos, permisos y costes.
- En el laboratorio, utiliza solo `terraform_data`.
- No uses credenciales cloud ni backend remoto.
- No reutilices este ejemplo directamente en producción.