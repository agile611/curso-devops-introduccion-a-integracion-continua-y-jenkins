# 07_modificando_la_infraestructura.md — Modificar infraestructura con Terraform

Esta guía enseña a cambiar una configuración Terraform de forma controlada, revisar el plan resultante y aplicar los cambios únicamente en un laboratorio local. El proyecto utiliza `terraform_data`: permite practicar el ciclo de modificación sin proveedores cloud, cuentas reales ni credenciales.

El foco no es cambiar código rápidamente, sino entender **qué cambio se solicita, qué propone Terraform y qué consecuencias puede tener una aplicación**. En un proyecto real, modificar una línea puede cambiar permisos, reemplazar recursos, causar interrupciones o generar costes. Por eso, el plan debe revisarse antes de cada aplicación.

> **Límite del laboratorio:** usa solo la carpeta de práctica y un estado local desechable. No añadas proveedores cloud, credenciales ni backends remotos. No ejecutes `terraform destroy`. No edites el archivo de estado a mano. No reutilices este ejemplo directamente en producción.

---

## Objetivos y alcance

Esta página aborda cómo modificar una configuración Terraform y evaluar sus consecuencias antes de aplicar cambios.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar cómo una modificación de código puede afectar al estado de Terraform.
- Separar una modificación de configuración de una modificación aplicada.
- Crear una línea de base antes de cambiar un proyecto.
- Cambiar atributos de un recurso local de laboratorio.
- Añadir una variable y comprobar cómo afecta al plan.
- Interpretar propuestas de actualización, creación, eliminación y reemplazo.
- Detectar cambios no relacionados con el objetivo.
- Aplicar una modificación local de forma controlada.
- Verificar el resultado con una salida de Terraform.
- Explicar por qué no se debe editar manualmente el estado.
- Proponer controles para cambios realizados desde Jenkins.
- Documentar pruebas sin publicar archivos potencialmente sensibles.
- Identificar situaciones en las que hay que detenerse y pedir revisión.

### Qué se construirá

El laboratorio utiliza una configuración simple con:

- Un recurso `terraform_data`.
- Un atributo de entrada descriptivo.
- Una variable de laboratorio.
- Una salida no sensible.
- Una secuencia de formato, validación, plan y aplicación.
- Ejercicios de comparación antes y después del cambio.

### Qué queda fuera

La práctica no enseña a:

- Modificar una cuenta cloud real.
- Cambiar permisos de producción.
- Migrar estado.
- Cambiar un backend.
- Crear redes o máquinas virtuales.
- Aplicar planes de producción.
- Ejecutar `terraform destroy`.
- Eliminar recursos reales.
- Ignorar aprobaciones.
- Recuperar una infraestructura crítica sin supervisión.

### Regla principal

**No apliques una modificación hasta entender el plan que la describe.**

Si no puedes explicar una acción, detén el proceso.

### Uso supervisado

La aplicación del laboratorio debe realizarse en:

- Un repositorio desechable.
- Un agente de práctica autorizado.
- Un directorio de trabajo identificado.
- Un estado local exclusivo del ejercicio.
- Un entorno sin credenciales cloud.
- Una sesión supervisada cuando así lo indique el curso.

---

## Qué significa modificar infraestructura

Terraform interpreta el código como una declaración del estado deseado y compara esa declaración con el estado conocido.

### Configuración y estado

La **configuración** son los archivos que describen lo que se desea administrar.

El **estado** registra la relación entre la configuración y los objetos que Terraform administra.

El estado puede contener datos sensibles y debe protegerse.

### Cambio de código y cambio real

Editar un archivo `.tf` no modifica por sí solo un recurso.

Terraform debe evaluar el cambio mediante un plan.

La aplicación del plan ejecuta las acciones propuestas.

En esta práctica, esas acciones afectan al estado local de un recurso `terraform_data`.

### El ciclo de modificación

Un flujo controlado suele seguir estas etapas:

1. Identificar el objetivo del cambio.
2. Confirmar repositorio, rama, commit y entorno.
3. Revisar la configuración existente.
4. Modificar una parte concreta.
5. Revisar el diff de Git.
6. Comprobar formato y sintaxis.
7. Generar un plan.
8. Revisar todas las acciones.
9. Obtener aprobación cuando corresponda.
10. Aplicar el cambio autorizado.
11. Verificar el resultado.
12. Registrar la ejecución.

### Cambio limitado

Un cambio bien definido tiene un objetivo comprensible.

Por ejemplo:

- Actualizar una etiqueta de laboratorio.
- Cambiar un valor descriptivo.
- Añadir una salida no sensible.
- Modificar un valor de variable.

Evita mezclar cambios de objetivos distintos en una sola modificación.

### Cambio de infraestructura frente a cambio de configuración

Una modificación de configuración puede:

- No producir cambios.
- Actualizar un recurso.
- Crear un recurso.
- Eliminar un recurso.
- Reemplazar un recurso.
- Cambiar dependencias.
- Producir efectos secundarios en otros recursos.

No presupongas que cada línea modificada corresponde a una sola acción.

### Riesgo e impacto

En un entorno real, un cambio puede afectar:

- Disponibilidad.
- Seguridad.
- Permisos.
- Datos persistentes.
- Costes.
- Redes.
- Dependencias.
- Usuarios.
- Cumplimiento.
- Recuperación ante errores.

En el laboratorio, el impacto se limita a un recurso local de prueba.

---

## Preparar un laboratorio seguro

El laboratorio debe mantenerse aislado de cualquier infraestructura real.

### Requisitos

Se necesita:

- Terraform 1.4 o posterior.
- Un terminal local o agente de Jenkins preparado.
- Git para revisar cambios, si se usa control de versiones.
- Una carpeta desechable de laboratorio.
- Permiso del docente para ejecutar `apply` local.

No se necesita:

- Una cuenta cloud.
- Un token.
- Una clave SSH.
- Un proveedor externo.
- Un backend remoto.
- Un recurso compartido.

### Estructura del proyecto

```text
modificando-infraestructura/
├── .gitignore
├── README.md
├── Jenkinsfile
└── terraform/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

El archivo `Jenkinsfile` se utiliza solo en las sesiones de integración con Jenkins.

### Crear la estructura

En Unix-like:

```bash
mkdir -p modificando-infraestructura/terraform
cd modificando-infraestructura
```

En PowerShell:

```powershell
New-Item -ItemType Directory -Force modificando-infraestructura\terraform
Set-Location modificando-infraestructura
```

Comprueba el directorio actual antes de ejecutar comandos de Terraform.

### Configuración inicial: `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "laboratorio" {
  input = {
    proyecto = "modificando-infraestructura"
    entorno  = "laboratorio"
    version  = "base"
  }
}
```

### Configuración inicial: `terraform/variables.tf`

```hcl
variable "etiqueta_laboratorio" {
  description = "Etiqueta descriptiva para las sesiones del laboratorio."
  type        = string
  default     = "base"
}
```

### Configuración inicial: `terraform/outputs.tf`

```hcl
output "resumen_laboratorio" {
  description = "Datos no sensibles del recurso local de práctica."
  value       = terraform_data.laboratorio.output
}
```

### Configuración inicial mejorada

Para que la variable se utilice en el recurso, se puede sustituir `main.tf` por esta versión:

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "laboratorio" {
  input = {
    proyecto = "modificando-infraestructura"
    entorno  = "laboratorio"
    etiqueta = var.etiqueta_laboratorio
  }
}
```

Utiliza una sola de las versiones de `main.tf`; no mantengas dos recursos con el mismo nombre.

### Archivo `.gitignore`

```gitignore
.terraform/
*.tfstate
*.tfstate.*
*.tfplan
crash.log
crash.*.log
```

Adapta las reglas a la política del curso y del repositorio.

### Archivo `README.md`

```text
Laboratorio local para practicar modificaciones Terraform.
Utiliza terraform_data y no administra recursos cloud.
No incluye credenciales ni backend remoto.
Aplicar cambios afecta únicamente al estado local del proyecto.
```

### Archivos que se generan

La inicialización puede crear:

```text
.terraform/
.terraform.lock.hcl
```

Una aplicación local puede crear:

```text
terraform.tfstate
terraform.tfstate.backup
```

Un plan guardado puede crear:

```text
tfplan
```

No confirmes automáticamente estos archivos.

---

## Establecer una línea de base

Antes de cambiar código, registra el estado inicial del proyecto.

### Confirmar la ubicación

En Unix-like:

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Cambia a la carpeta `terraform` antes de ejecutar comandos Terraform.

### Confirmar la versión

```bash
terraform version
```

Comprueba que la versión satisface el bloque `required_version`.

### Confirmar Git

Desde la raíz del repositorio:

```bash
git status --short
```

Comprueba la rama:

```bash
git branch --show-current
```

Comprueba el último commit:

```bash
git log -1 --oneline
```

Si el proyecto no usa Git, anota cómo se identifica la versión de los archivos.

### Inspeccionar la configuración

Confirma que:

- No hay proveedores cloud.
- No hay un bloque `backend`.
- No hay módulos remotos.
- Solo aparece el recurso local previsto.
- Las variables son de laboratorio.
- No hay archivos secretos.

### Formatear la configuración

Desde `terraform/`:

```bash
terraform fmt -recursive
```

Comprueba el formato:

```bash
terraform fmt -check -recursive
```

Si `fmt` modifica archivos, revisa el diff antes de continuar.

### Inicializar el directorio

```bash
terraform init -backend=false -input=false -no-color
```

`-backend=false` se usa en este laboratorio para no inicializar un backend remoto.

No es una recomendación para desactivar backends en proyectos reales.

### Validar la configuración

```bash
terraform validate -no-color
```

Si la validación falla, corrige el error antes de generar un plan.

### Generar el plan inicial

```bash
terraform plan -input=false -no-color
```

Anota:

- Si Terraform propone una creación.
- Qué recurso aparece.
- Qué atributos se muestran.
- El resumen final.
- Si el plan contiene una acción inesperada.

### Aplicar el estado inicial del laboratorio

Solo con autorización del docente y después de revisar el plan:

```bash
terraform apply -input=false
```

La aplicación puede pedir confirmación interactiva.

Lee el resumen y confirma únicamente en el laboratorio autorizado.

No añadas `-auto-approve` para saltarte la revisión.

### Comprobar la línea de base

```bash
terraform output -no-color
```

Comprueba la salida no sensible del recurso.

No uses `cat` para publicar el archivo de estado.

### Registrar la línea de base

Completa:

```text
Rama:
Commit:
Versión de Terraform:
Directorio:
Recurso:
Plan inicial:
Aplicación inicial autorizada:
Resultado de salida:
```

No adjuntes el estado a la ficha.

---

## Modificar la configuración

Cada ejercicio de modificación debe tener un propósito y un diff fácil de revisar.

### Cambiar un atributo

En `main.tf`, cambia:

```hcl
version = "base"
```

por:

```hcl
version = "practica-1"
```

El valor es descriptivo y no sensible.

### Revisar el diff

Desde la raíz del repositorio:

```bash
git diff -- terraform/main.tf
```

Comprueba que el diff refleja solo el cambio pretendido.

### Formatear y validar

```bash
terraform fmt -check -recursive
```

```bash
terraform validate -no-color
```

### Crear el plan de modificación

Desde `terraform/`:

```bash
terraform plan -input=false -no-color
```

Lee qué atributo cambia y qué acción se propone.

### Aplicar el cambio en el laboratorio

Solo después de revisar el plan y con permiso:

```bash
terraform apply -input=false
```

Lee nuevamente el plan interactivo antes de confirmar.

### Añadir un atributo descriptivo

Se puede añadir otro valor no sensible:

```hcl
input = {
  proyecto   = "modificando-infraestructura"
  entorno    = "laboratorio"
  etiqueta   = var.etiqueta_laboratorio
  responsable = "equipo-practica"
}
```

El nombre y el valor deben describir la práctica, no identificar a una persona real.

### Cambiar el valor de la variable

En `variables.tf`, conserva un valor por defecto seguro:

```hcl
variable "etiqueta_laboratorio" {
  description = "Etiqueta descriptiva para las sesiones del laboratorio."
  type        = string
  default     = "practica-2"
}
```

El plan mostrará el efecto del cambio si la variable está referenciada por el recurso.

### Usar `terraform.tfvars` para una variable no sensible

Solo si el docente lo permite, crea un archivo local:

```hcl
etiqueta_laboratorio = "practica-local"
```

Ese archivo debe añadirse a `.gitignore` si contiene datos específicos del equipo o del entorno.

No utilices esta técnica para contraseñas, tokens ni claves.

### Usar `-var` con una variable no sensible

Para una prueba puntual:

```bash
terraform plan -input=false -no-color -var="etiqueta_laboratorio=practica-cli"
```

No pases secretos con `-var`.

Los argumentos pueden aparecer en historial, logs o información del proceso.

### Añadir una salida no sensible

En `outputs.tf`:

```hcl
output "etiqueta_actual" {
  description = "Etiqueta pública de la práctica."
  value       = var.etiqueta_laboratorio
}
```

Valida y revisa el plan después de añadirla.

### Añadir un recurso local de prueba

Solo con autorización, añade un segundo recurso con nombre distinto:

```hcl
resource "terraform_data" "nota_laboratorio" {
  input = {
    clase  = "practica"
    estado = "aislado"
  }
}
```

Este recurso no requiere un proveedor cloud.

La creación modifica el estado local cuando se aplica.

### No reutilizar nombres a ciegas

El nombre del recurso forma parte de su dirección Terraform.

Comprueba que:

- No existe ya un recurso con esa dirección.
- El nombre no se confunde con un recurso real.
- El cambio está limitado al laboratorio.

### Cambiar una descripción

Cambiar `description` en una variable o salida puede no producir cambios en un recurso.

Eso no significa necesariamente que Terraform ignore el archivo.

El plan ayuda a distinguir cambios de configuración y cambios de recursos.

---

## Leer el plan de modificación

El plan muestra lo que Terraform propone bajo el contexto actual.

### Actualizaciones

Una actualización indica que Terraform propone modificar atributos de un objeto gestionado.

Revisa:

- Qué atributos cambian.
- Si los valores son los esperados.
- Si el recurso afectado es el correcto.
- Si aparecen cambios derivados.
- Si el proveedor considera que la modificación requiere reemplazo.

En el laboratorio, un cambio de `terraform_data.input` suele representarse como una actualización del recurso.

El comportamiento exacto puede variar según la configuración y la versión.

### Creaciones

Una creación añade un objeto al estado de Terraform.

En el ejemplo local, añadir `terraform_data.nota_laboratorio` produce una creación prevista si la dirección no existe en el estado.

Comprueba el nombre y el contenido antes de aplicar.

### Eliminaciones

Una eliminación puede aparecer si:

- Se elimina un bloque de recurso.
- Se cambia una dirección sin migración.
- Se modifica una relación con el estado.
- Una condición hace que el recurso deje de existir.
- El proveedor informa de otra situación.

No interpretes una eliminación como una limpieza inocua en proyectos reales.

En el laboratorio, puedes revisar una eliminación ficticia en el plan, pero no tienes que aplicarla.

### Reemplazos

Un reemplazo implica retirar y volver a crear un objeto según las reglas del proveedor o de la configuración.

En recursos reales, un reemplazo puede causar interrupción o pérdida de datos.

Comprueba qué atributo lo provoca.

### Cambios no relacionados

Un plan puede mostrar cambios distintos al objetivo original.

Posibles causas:

- Drift.
- Variables diferentes.
- Otro workspace.
- Estado incorrecto.
- Cambios manuales.
- Versiones de proveedor.
- Cambios en módulos.
- Una ruta de ejecución distinta.
- Un valor por defecto diferente.

Detén la aplicación si el plan contiene acciones no explicadas.

### Valores conocidos

Un valor conocido está disponible durante el plan.

Comprueba si es seguro que aparezca en la consola.

### Valores desconocidos

Un valor desconocido no se puede determinar hasta una operación posterior o una consulta con el proveedor.

No supongas que un valor desconocido será el que esperas.

### Valores sensibles

Terraform puede marcar valores como sensibles para ocultarlos en ciertas salidas.

La marca sensible no garantiza que el valor desaparezca del estado o de un plan guardado.

### No revisar solo el resumen

El resumen es una orientación.

Revisa los recursos y atributos concretos.

### Comparar el cambio pretendido con el plan

Comprueba:

- ¿El recurso es el esperado?
- ¿La acción coincide con el objetivo?
- ¿Se modifica algún atributo adicional?
- ¿Hay eliminaciones?
- ¿Hay reemplazos?
- ¿Aparecen valores que no deberían mostrarse?
- ¿El backend y el workspace son los correctos?

---

## Aplicar modificaciones de forma controlada

La aplicación debe corresponder al plan revisado.

### Aplicación interactiva

Desde el directorio Terraform:

```bash
terraform apply -input=false
```

Terraform calcula el plan de aplicación y solicita confirmación, salvo que el flujo o las opciones cambien ese comportamiento.

Lee las acciones antes de confirmar.

### Confirmar solo en laboratorio

Solo confirma si:

- Estás en el proyecto desechable.
- No hay proveedor cloud.
- No hay backend remoto.
- El plan coincide con el ejercicio.
- El docente autorizó la aplicación.
- Comprendes que cambia el estado local.

### Aplicar un plan guardado

En un flujo controlado:

```bash
terraform plan -input=false -no-color -out=tfplan
```

Después de revisar ese plan:

```bash
terraform apply -input=false tfplan
```

El segundo comando aplica el plan guardado.

No generes un plan nuevo entre la aprobación y la aplicación.

### Plan obsoleto

Si Terraform informa que el plan ya no es válido, no intentes forzarlo.

Comprueba:

- Si cambió el estado.
- Si cambió el código.
- Si cambió el backend.
- Si cambió el workspace.
- Si otra ejecución actuó sobre el mismo recurso.

Genera un plan nuevo y vuelve a revisarlo según la política.

### Verificar el resultado

```bash
terraform output -no-color
```

Comprueba que el valor esperado aparece en la salida.

No uses esta comprobación para exponer valores sensibles.

### Volver a planificar

Después de una aplicación local:

```bash
terraform plan -input=false -no-color
```

Un resultado sin cambios indica que Terraform no propone otras acciones en ese contexto.

No demuestra que el diseño sea correcto en todos los sentidos.

### Comparar tres elementos

Después de aplicar, compara:

1. El diff del código.
2. El plan aprobado.
3. La salida posterior.

Los tres deben corresponder al mismo objetivo.

### No editar estado manualmente

No edites `terraform.tfstate` en un editor.

Un cambio manual puede corromper relaciones, valores o referencias.

Usa el flujo aprobado de Terraform y consulta al responsable ante inconsistencias.

### No usar `apply` para diagnosticar

`apply` no es un comando de prueba.

Usa `fmt`, `validate` y `plan` para estudiar el cambio antes de la aplicación.

---

## Modificaciones con Terraform en Jenkins

Jenkins puede automatizar el flujo y exigir revisión antes de aplicar.

### Flujo recomendado

Para este laboratorio:

1. Checkout.
2. Verificar Terraform.
3. Revisar formato.
4. Inicializar sin backend remoto.
5. Validar.
6. Crear un plan.
7. Aprobar, si la sesión lo requiere.
8. Aplicar el plan aprobado.
9. Verificar una salida local.
10. Limpiar archivos temporales según la política.

### Pipeline local de práctica

```groovy
pipeline {
    agent {
        label 'terraform-lab'
    }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Comprobar versión') {
            steps {
                sh 'terraform version'
            }
        }

        stage('Comprobar formato') {
            steps {
                dir('terraform') {
                    sh 'terraform fmt -check -recursive'
                }
            }
        }

        stage('Inicializar') {
            steps {
                dir('terraform') {
                    sh 'terraform init -backend=false -input=false -no-color'
                }
            }
        }

        stage('Validar') {
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

        stage('Aplicar plan de laboratorio') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -input=false tfplan'
                }
            }
        }

        stage('Verificar salida local') {
            steps {
                dir('terraform') {
                    sh 'terraform output -no-color'
                }
            }
        }
    }

    post {
        success {
            echo 'La modificación local terminó correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        always {
            dir('terraform') {
                sh 'rm -f tfplan'
            }
            echo "Resultado: ${currentBuild.currentResult}"
        }
    }
}
```

### Advertencia sobre aplicación automática

El Pipeline anterior aplica el plan sin una etapa `input`.

**No lo uses como ejemplo de aplicación en producción.**

Para la práctica de aprobación humana, integra una compuerta como la de `06_pipeline_stage_apply_human_approval.md`.

### Pipeline con aprobación

El flujo debe:

- Generar el plan antes de esperar.
- Mostrar a la persona aprobadora el build y el commit.
- Restringir quién puede aprobar.
- Definir un timeout.
- Aplicar el mismo archivo de plan.
- Impedir que un rechazo continúe a `apply`.

### Plan y workspace

Asegúrate de que el plan guardado pertenece al mismo build y workspace.

No apliques un archivo copiado desde una ejecución anterior.

### Control de concurrencia

`disableConcurrentBuilds()` puede evitar builds simultáneos del mismo job.

No sustituye el bloqueo de un backend compartido.

El laboratorio no debe conectarse a un estado remoto compartido.

### Logs y archivos temporales

No archives automáticamente:

- `terraform.tfstate`.
- `terraform.tfstate.backup`.
- `tfplan`.
- El directorio `.terraform/`.
- El workspace completo.

Los archivos de plan y estado pueden contener datos sensibles.

### Fallos de etapas anteriores

Si `fmt`, `init` o `validate` falla, el pipeline no debe avanzar a `apply`.

No uses `|| true` para hacer que una etapa parezca correcta.

### Identidad del agente

Comprueba que el agente no hereda credenciales cloud.

Un proyecto local no debería necesitar una identidad de proveedor.

---

## Cambios que requieren atención especial

Algunas modificaciones tienen consecuencias más complejas que un cambio de valor.

### `triggers_replace`

`terraform_data` incluye el argumento `triggers_replace`, que permite asociar cambios a una sustitución del recurso.

Ejemplo exclusivamente local:

```hcl
resource "terraform_data" "laboratorio" {
  input = {
    etiqueta = var.etiqueta_laboratorio
  }

  triggers_replace = [
    var.revision_laboratorio
  ]
}
```

En `variables.tf`:

```hcl
variable "revision_laboratorio" {
  description = "Valor de revisión no sensible para el ejercicio."
  type        = string
  default     = "revision-1"
}
```

Cambiar `revision_laboratorio` puede hacer que Terraform proponga reemplazar el recurso `terraform_data`.

El ejercicio muestra el concepto; no traslades este patrón a recursos reales sin comprender su ciclo de vida.

### Cambio de un atributo normal

Modificar `input` en `terraform_data` no es lo mismo que modificar `triggers_replace`.

El plan permite observar la diferencia entre un cambio del contenido de entrada y una condición explícita de reemplazo.

### Cambiar el nombre de un recurso

Cambiar:

```hcl
terraform_data "laboratorio"
```

por otro nombre cambia la dirección del recurso en Terraform.

Terraform puede interpretar que el recurso anterior desaparece y que otro aparece.

No renombres recursos reales sin un plan de migración adecuado.

### Cambio de tipo

Cambiar el tipo de recurso puede requerir una operación distinta o un reemplazo.

No asumas que dos tipos con atributos parecidos comparten estado.

### Mover un bloque

Mover una configuración a otro módulo o cambiar su dirección puede provocar acciones inesperadas.

La migración de direcciones necesita una revisión específica.

### Añadir módulos

Un módulo introduce otra configuración y posibles dependencias.

Antes de incorporarlo:

- Comprueba la fuente.
- Fija una versión.
- Revisa sus recursos.
- Comprueba sus variables.
- Revisa sus salidas.
- Evalúa su mantenimiento.
- Verifica su licencia y política.

### Añadir proveedores

Un proveedor añade una interfaz con una plataforma externa.

Puede requerir permisos, red, autenticación y versiones específicas.

No añadas un proveedor cloud a las sesiones de esta guía.

### Cambios en valores por defecto

Un cambio de valor por defecto puede afectar a quienes no proporcionan explícitamente la variable.

Revisa todos los consumidores de la variable.

### Cambios de tipo de variable

Cambiar `string` por `number`, `bool`, lista u objeto puede afectar a:

- Conversión de valores.
- Validaciones.
- Módulos.
- Recursos.
- Pipelines.
- Archivos `.tfvars`.

### Recursos con datos persistentes

Un cambio aparentemente pequeño en un recurso real puede reemplazar una base de datos, un volumen, una cola o un almacenamiento.

Revisa la documentación del proveedor y el plan antes de actuar.

### Cambios de permisos

Cambiar políticas o roles puede aumentar o reducir privilegios.

Requiere revisión de seguridad y una identidad de aplicación controlada.

---

## Revisión, seguridad y gobernanza

La modificación segura combina revisión de código, revisión del plan y controles de ejecución.

### Revisión de código

La revisión del diff debe responder:

- ¿Qué objetivo tiene el cambio?
- ¿Qué archivos se modificaron?
- ¿Hay valores de configuración inesperados?
- ¿Se añadieron proveedores o módulos?
- ¿Se añadió un secreto por error?
- ¿El cambio incluye trabajo no relacionado?

### Revisión del plan

La revisión del plan debe responder:

- ¿Qué objetos cambian?
- ¿Qué atributos cambian?
- ¿Hay destrucciones?
- ¿Hay reemplazos?
- ¿Qué dependencias aparecen?
- ¿El entorno es el correcto?
- ¿La identidad es la esperada?
- ¿El plan corresponde al commit revisado?

### Aprobación

Una aprobación humana debe estar vinculada a:

- Un build concreto.
- Un commit concreto.
- Un plan concreto.
- Un entorno concreto.
- Una persona autorizada.

No apruebes una ejecución cuyo contexto no puedas identificar.

### Credenciales

La práctica no utiliza credenciales cloud.

En un sistema real:

- Guarda secretos en un almacén aprobado.
- Limita su alcance.
- Prefiere identidades dedicadas.
- Evita cuentas personales.
- Usa credenciales temporales cuando estén disponibles.
- No imprimas secretos en logs.
- Evita que ramas no confiables accedan a credenciales.

### Estado y copias de seguridad

El estado local puede persistir en el workspace.

No lo almacenes en Git.

En un entorno real, sigue el procedimiento aprobado para backend, copias de seguridad y recuperación.

### Reversión

No todos los cambios son reversibles mediante un simple cambio de código.

Antes de aplicar un cambio real, identifica:

- Qué podría salir mal.
- Qué datos podrían cambiar.
- Qué copia existe.
- Qué procedimiento de reversión está probado.
- Quién toma la decisión.
- Qué servicios dependen del recurso.

### Recuperación

Si una aplicación real falla:

- No ejecutes comandos de recuperación al azar.
- No edites el estado manualmente.
- Informa al responsable.
- Conserva los datos necesarios para el diagnóstico.
- Sigue el procedimiento de incidentes.
- Evita divulgar el estado o las credenciales.

### Separación de funciones

La política puede separar:

- Autoría.
- Revisión de código.
- Revisión del plan.
- Aprobación.
- Aplicación.
- Administración de credenciales.

En cambios de alto impacto, una sola persona no debería controlar todas las etapas sin justificación.

---

## Sesiones prácticas

Las sesiones usan datos locales y progresan desde un cambio sencillo hasta un flujo integrado.

### Preparación común

Antes de empezar:

- Comprueba la ruta del proyecto.
- Comprueba la versión de Terraform.
- Revisa `git status`.
- Confirma que no existe proveedor cloud.
- Confirma que no existe backend remoto.
- Comprueba que la configuración usa `terraform_data`.
- No uses credenciales.
- No ejecutes `terraform destroy`.
- No compartas el estado.
- Pide autorización antes de aplicar.

### Sesión 1: inspeccionar la configuración inicial

**Objetivo:** identificar recursos, variables y salidas.

#### Instrucciones

1. Abre `main.tf`.
2. Identifica el recurso.
3. Abre `variables.tf`.
4. Identifica el valor por defecto.
5. Abre `outputs.tf`.
6. Comprueba que la salida no es sensible.
7. Dibuja la relación entre variable y recurso.

#### Preguntas

- ¿Qué atributo recibe la variable?
- ¿Qué hace `terraform_data` en este laboratorio?
- ¿Qué archivos forman parte del módulo?
- ¿Qué archivos deben ignorarse en Git?

### Sesión 2: registrar la línea de base

**Objetivo:** documentar la configuración antes de cambiarla.

#### Instrucciones

1. Ejecuta `terraform version`.
2. Comprueba la rama y el commit.
3. Ejecuta `terraform fmt -check -recursive`.
4. Ejecuta `terraform validate`.
5. Genera un plan inicial.
6. Registra el resumen.
7. No apliques hasta recibir autorización.

### Sesión 3: establecer estado local de práctica

**Objetivo:** preparar el estado inicial para comparar modificaciones.

Esta actividad requiere supervisión.

#### Instrucciones

1. Comprueba que el directorio es desechable.
2. Confirma que no hay backend remoto.
3. Genera el plan inicial.
4. Pide al docente que revise el resultado.
5. Ejecuta `terraform apply -input=false` únicamente si lo autoriza.
6. Confirma la salida local.
7. No adjuntes el estado.

### Sesión 4: cambiar una etiqueta

**Objetivo:** modificar un valor descriptivo.

#### Instrucciones

1. Cambia el valor de `etiqueta_laboratorio`.
2. Revisa el diff.
3. Ejecuta `terraform fmt -check`.
4. Ejecuta `terraform validate`.
5. Genera un plan.
6. Describe la acción.
7. No apliques hasta revisar el plan con el docente.

### Sesión 5: aplicar una actualización local

**Objetivo:** completar un cambio simple en el estado de laboratorio.

#### Instrucciones

1. Confirma que el plan muestra únicamente la modificación esperada.
2. Confirma que el proyecto no usa proveedor cloud.
3. Confirma que el directorio es el de práctica.
4. Solicita autorización.
5. Ejecuta la aplicación interactiva.
6. Verifica la salida.
7. Registra el resultado.

### Sesión 6: añadir un atributo al mapa `input`

**Objetivo:** observar cómo se amplía una entrada local.

#### Instrucciones

1. Añade un atributo descriptivo, por ejemplo `responsable = "equipo-practica"`.
2. No uses nombres de personas.
3. Formatea el código.
4. Valida.
5. Genera un plan.
6. Identifica el atributo que se actualiza.
7. Revisa si hay cambios adicionales.

### Sesión 7: modificar el valor por defecto

**Objetivo:** observar el efecto de un cambio en una variable.

#### Instrucciones

1. Cambia `default = "base"` por `default = "practica-variable"`.
2. Comprueba que el recurso consume la variable.
3. Ejecuta el plan.
4. Compara el valor anterior y el nuevo.
5. Explica qué ocurriría si el valor se sobrescribe desde otra fuente.
6. No incluyas valores secretos.

### Sesión 8: pasar un valor por línea de comandos

**Objetivo:** comparar una variable por defecto con una entrada explícita no sensible.

#### Comando

```bash
terraform plan -input=false -no-color -var="etiqueta_laboratorio=practica-cli"
```

#### Instrucciones

1. Ejecuta el comando solo en el laboratorio.
2. Compara con el plan que usa el valor por defecto.
3. Identifica cuál es el valor efectivo.
4. Revisa si la entrada aparece en el historial.
5. No uses este método con secretos.

### Sesión 9: añadir una salida

**Objetivo:** exponer de forma controlada un dato no sensible del ejercicio.

#### Instrucciones

1. Añade la salida `etiqueta_actual`.
2. Ejecuta formato y validación.
3. Genera el plan.
4. Comprueba si el cambio requiere modificar un recurso.
5. Aplica solo con permiso.
6. Ejecuta `terraform output`.
7. Confirma que no has expuesto datos privados.

### Sesión 10: añadir un segundo recurso local

**Objetivo:** observar una acción de creación en el plan.

#### Instrucciones

1. Añade `terraform_data.nota_laboratorio`.
2. Utiliza valores descriptivos y ficticios.
3. Revisa el diff.
4. Ejecuta formato y validación.
5. Genera el plan.
6. Comprueba que la creación se limita al recurso local.
7. Aplica solo con autorización.
8. Verifica la salida si corresponde.

### Sesión 11: comparar el diff con el plan

**Objetivo:** comprobar que las acciones coinciden con el objetivo del cambio.

#### Instrucciones

1. Guarda el diff de Git.
2. Lee el plan completo.
3. Identifica cada recurso afectado.
4. Relaciona cada atributo cambiado con la modificación.
5. Busca acciones no relacionadas.
6. Escribe una conclusión de tres frases.

### Sesión 12: retirar un recurso de laboratorio sin aplicar

**Objetivo:** reconocer una propuesta de eliminación.

#### Instrucciones

1. En una copia desechable, comenta o elimina el bloque del segundo recurso.
2. Ejecuta `terraform plan`.
3. Identifica la acción de eliminación.
4. Describe qué recurso se vería afectado.
5. No ejecutes `apply`.
6. Restaura el bloque o elimina la copia desechable según las instrucciones.

### Sesión 13: observar un cambio de dirección

**Objetivo:** entender el efecto potencial de renombrar un recurso.

#### Instrucciones

1. En una copia aislada, cambia el nombre lógico del recurso.
2. Genera un plan.
3. Identifica si Terraform propone creación y eliminación.
4. Explica por qué un simple cambio de nombre puede cambiar la dirección.
5. No apliques en un estado compartido.
6. Restaura la configuración inicial.

### Sesión 14: `triggers_replace` controlado

**Objetivo:** observar una sustitución de un recurso local.

#### Instrucciones

1. Añade el argumento `triggers_replace` al recurso de laboratorio.
2. Añade una variable de revisión no sensible.
3. Genera un plan inicial.
4. Cambia el valor de revisión.
5. Genera otro plan.
6. Identifica la propuesta de reemplazo.
7. No uses este patrón en recursos reales sin aprobación.
8. No apliques si el contexto no es el estado local desechable.

### Sesión 15: detectar cambios no relacionados

**Objetivo:** practicar una decisión de detenerse.

El docente proporciona una salida de plan ficticia con una acción adicional inesperada.

#### Instrucciones

1. Identifica el recurso no relacionado.
2. Comprueba rama, commit y directorio en el escenario.
3. Lista hipótesis posibles.
4. Escribe qué información falta.
5. Decide si continuar o detenerse.
6. No apliques el plan.

### Sesión 16: comparar planes de dos commits

**Objetivo:** asociar cada plan a una revisión concreta.

#### Instrucciones

1. Genera un plan para el primer commit.
2. Registra la revisión.
3. Cambia un valor en un segundo commit.
4. Genera un plan nuevo.
5. Compara las salidas.
6. Comprueba la versión de Terraform.
7. Explica por qué no debe aprobarse un build antiguo para aplicar un cambio nuevo.

### Sesión 17: comprobar una aplicación supervisada

**Objetivo:** verificar que el cambio aplicado coincide con el plan.

#### Instrucciones

1. Identifica el build o la ejecución local.
2. Confirma la aprobación.
3. Revisa que se aplicó el mismo plan.
4. Ejecuta `terraform output`.
5. Genera un plan posterior.
6. Comprueba si quedan cambios pendientes.
7. Registra el resultado sin adjuntar el estado.

### Sesión 18: modificar en Jenkins

**Objetivo:** ejecutar una modificación local desde una pipeline.

#### Instrucciones

1. Revisa la etiqueta del agente.
2. Comprueba que el agente es de laboratorio.
3. Modifica un valor descriptivo.
4. Revisa el diff.
5. Ejecuta el pipeline hasta la etapa `Plan`.
6. Comprueba la salida.
7. Aplica únicamente si el Pipeline incluye la aprobación prevista y el docente lo autoriza.

### Sesión 19: revisar el gate de aprobación

**Objetivo:** practicar la revisión antes de modificar el estado local.

#### Instrucciones

1. Ejecuta el job hasta el `input`.
2. Confirma el build.
3. Confirma la rama y el commit.
4. Confirma el recurso de laboratorio.
5. Revisa el plan.
6. Decide aprobar o rechazar.
7. Registra la decisión y el motivo.

### Sesión 20: rechazo y cancelación

**Objetivo:** confirmar que una decisión negativa no aplica cambios.

#### Instrucciones

1. Ejecuta el job hasta el gate.
2. Rechaza o cancela según las instrucciones del docente.
3. Confirma que `apply` no se ejecutó.
4. Revisa el resultado del build.
5. Comprueba la limpieza del plan.
6. Documenta el resultado sin incluir el archivo.

### Sesión 21: probar un error de validación

**Objetivo:** confirmar que una configuración inválida no llega a la aplicación.

#### Instrucciones

1. En una copia, introduce un error HCL controlado.
2. Ejecuta el job.
3. Identifica la etapa fallida.
4. Confirma que no aparece aprobación.
5. Confirma que no se ejecuta `apply`.
6. Restaura el archivo correcto.

### Sesión 22: estudiar un plan obsoleto

**Objetivo:** comprender que la aprobación depende del estado y el contexto.

#### Escenario

El estado cambia después de generar el plan.

#### Instrucciones

1. Lee el escenario del docente.
2. Explica por qué el plan puede quedar obsoleto.
3. Indica qué revisarías.
4. Propón generar un plan nuevo.
5. Describe quién debe revisarlo.
6. No modifiques estados compartidos para reproducirlo.

### Sesión 23: revisión de seguridad por parejas

**Objetivo:** detectar riesgos en una modificación propuesta.

La persona autora presenta:

- Objetivo.
- Diff.
- Plan.
- Entorno.
- Commit.
- Riesgos.
- Procedimiento de recuperación.

La persona revisora comprueba:

- Cambios limitados.
- Ausencia de credenciales.
- Ausencia de backend remoto.
- Ausencia de proveedores inesperados.
- Acciones explicadas.
- Destrucciones identificadas.
- Reemplazos identificados.
- Aprobación ligada al build.
- Evidencia sin estado ni plan binario.

### Sesión 24: redactar un plan de reversión conceptual

**Objetivo:** explicar cómo analizar una reversión sin ejecutarla.

Completa:

```text
Cambio original:
Recurso afectado:
Datos que podrían perderse:
Dependencias:
Qué información se conservaría:
Cómo se verificaría una reversión:
Quién tendría que aprobar:
Qué no se debe hacer:
```

No ejecutes acciones de recuperación sobre una infraestructura real.

### Sesión 25: proyecto integrador

**Objetivo:** presentar una modificación local desde el cambio de código hasta la verificación.

#### Requisitos

- Proyecto Terraform con `terraform_data`.
- Cambio pequeño y justificado.
- Diff revisado.
- Formato correcto.
- Validación correcta.
- Plan documentado.
- Aplicación solo con aprobación del docente.
- Verificación de salida.
- Plan posterior sin cambios pendientes, cuando corresponda.
- Sin proveedor cloud.
- Sin backend remoto.
- Sin credenciales.
- Sin `destroy`.
- Sin archivos de estado o planes en la entrega.

#### Entrega

Incluye:

- Configuración inicial.
- Diff de código.
- Configuración modificada.
- Resumen no sensible del plan.
- Decisión de revisión.
- Evidencia de aprobación, si se aplicó.
- Salida local posterior.
- Diagnóstico de un fallo o cambio inesperado.
- Explicación de las limitaciones del laboratorio.

---

## Diagnóstico

Al encontrar un problema, identifica primero el contexto y la etapa.

### El plan no refleja el cambio

Comprueba:

- Directorio.
- Rama.
- Commit.
- Nombre de variable.
- Fuente del valor.
- Estado.
- Workspace.
- Archivo que modificaste.
- Que el recurso consume realmente ese valor.

No asumas que Terraform ha ignorado el cambio antes de comprobar esas condiciones.

### La variable no cambia el resultado

Comprueba:

- Si la variable está referenciada.
- Si una entrada explícita sobrescribe el valor por defecto.
- Si existe un archivo `.tfvars`.
- Si el job define variables.
- Si estás planificando el directorio correcto.
- Si el plan se generó desde el commit esperado.

No imprimas todas las variables para investigarlo.

### El plan propone una destrucción

Detén la aplicación.

Comprueba:

- Si se eliminó un bloque.
- Si cambió la dirección.
- Si cambió el estado.
- Si cambió el workspace.
- Si cambió el backend.
- Si hay una variable condicional.
- Si el plan se genera desde la rama correcta.

### El plan propone un reemplazo

Identifica el atributo o regla que lo causa.

En recursos reales, consulta la documentación del proveedor y el propietario del recurso.

No apruebes si no entiendes el impacto.

### Aparecen cambios no relacionados

Compara:

- Commit.
- Variables.
- Backend.
- Workspace.
- Estado.
- Versión.
- Proveedor.
- Módulos.
- Cambios manuales.
- Directorio de ejecución.

Detén la aplicación hasta explicar la diferencia.

### `terraform apply` falla

Identifica:

- El primer error.
- El comando.
- El directorio.
- La versión.
- El estado del workspace.
- Si el plan era guardado.
- Si el plan quedó obsoleto.
- Si el agente conservó los archivos temporales.

No vuelvas a ejecutar repetidamente sin entender el error.

### La salida no coincide con lo esperado

Comprueba:

- Qué versión de código se aplicó.
- Qué plan se usó.
- Qué valor final tiene la variable.
- Si la salida está actualizada.
- Si estás consultando el directorio correcto.

### Error de permisos inesperado

El proyecto local no debería requerir permisos cloud.

Si aparece un error de proveedor o autenticación:

1. Detén la ejecución.
2. Revisa la configuración.
3. Comprueba el directorio.
4. Comprueba el agente.
5. Consulta al docente.
6. No amplíes permisos para continuar.

### Estado bloqueado o inconsistente

En el laboratorio, comprueba si el agente mantiene una ejecución previa.

No elimines el estado ni fuerces un desbloqueo sin autorización.

En un proyecto real, sigue el procedimiento del backend y consulta al propietario.

### Ficha de diagnóstico

```text
Job o proyecto:
Build:
Rama:
Commit:
Agente:
Versión de Terraform:
Directorio:
Etapa:
Comando:
Primer mensaje relevante:
Cambio pretendido:
Resultado observado:
Hipótesis:
Comprobación realizada:
Resultado:
Acción autorizada:
```

No incluyas credenciales, estado completo, plan binario ni variables sensibles.

---

## Checklist de modificación

### Antes de editar

- [ ] El objetivo del cambio está documentado.
- [ ] El repositorio y el entorno son los correctos.
- [ ] La rama y el commit están identificados.
- [ ] La versión de Terraform es compatible.
- [ ] No hay proveedor cloud en el laboratorio.
- [ ] No hay backend remoto.
- [ ] Se ha registrado la línea de base.

### Después de editar

- [ ] El diff coincide con el objetivo.
- [ ] No se añadieron secretos.
- [ ] El formato pasa.
- [ ] La validación pasa.
- [ ] El plan se generó desde el directorio correcto.
- [ ] Se revisaron todas las acciones.
- [ ] Las destrucciones están identificadas.
- [ ] Los reemplazos están identificados.
- [ ] Los cambios adicionales se explicaron.

### Antes de aplicar

- [ ] El entorno es el laboratorio autorizado.
- [ ] El plan corresponde al commit actual.
- [ ] El estado es local y desechable.
- [ ] El docente o aprobador dio permiso.
- [ ] El plan no contiene acciones no entendidas.
- [ ] No se usó un plan de otro build.
- [ ] No se omitió una aprobación requerida.

### Después de aplicar

- [ ] Se verificó la salida esperada.
- [ ] Se generó un plan posterior cuando corresponde.
- [ ] Se registró el resultado.
- [ ] No se publicó el estado.
- [ ] No se publicó el plan binario.
- [ ] Los archivos temporales se gestionaron según la política.

---

## Evaluación

La evaluación considera tanto el cambio técnico como la calidad de la revisión.

### Evidencias mínimas

Entrega:

- Configuración inicial.
- Diff de modificación.
- Plan antes de aplicar.
- Justificación de la decisión.
- Salida posterior.
- Commit y versión, si se usa Git.
- Diagnóstico de un fallo controlado.
- Confirmación de que no se usaron recursos cloud.
- Confirmación de que no se compartió estado o plan binario.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Cambio de configuración | Cambia varias cosas sin explicación | Realiza un cambio acotado | Separa cambios y justifica cada uno |
| Lectura del plan | Mira solo el resumen | Identifica recursos y acciones | Evalúa dependencias, reemplazos e impacto |
| Aplicación | Aplica sin revisar | Aplica tras autorización | Asocia plan, commit, estado y aprobación |
| Verificación | No comprueba el resultado | Revisa una salida local | Compara código, plan y estado posterior |
| Seguridad | Publica archivos temporales | Protege estado y plan | Define límites de acceso y recuperación |
| Diagnóstico | Repite comandos | Identifica etapa y contexto | Contrasta hipótesis con evidencia |
| Documentación | No registra el contexto | Registra build, versión y resultado | Documenta sin divulgar datos sensibles |

### Preguntas de repaso

1. ¿Qué diferencia hay entre modificar código y modificar infraestructura?
2. ¿Qué información utiliza Terraform para generar un plan?
3. ¿Por qué se crea una línea de base antes de cambiar?
4. ¿Qué puede significar una propuesta de reemplazo?
5. ¿Por qué un cambio pequeño puede provocar una acción grande?
6. ¿Qué diferencia hay entre `input` y `triggers_replace` en `terraform_data`?
7. ¿Por qué no se debe renombrar un recurso real sin revisar el plan?
8. ¿Qué comprobaciones preceden a una aplicación?
9. ¿Por qué no se edita el archivo de estado a mano?
10. ¿Qué puede hacer que el plan no refleje el cambio?
11. ¿Qué información relaciona el plan con una revisión de código?
12. ¿Por qué un plan guardado debe tratarse como potencialmente sensible?
13. ¿Qué papel tiene una aprobación humana?
14. ¿Qué no garantiza un build exitoso?
15. ¿Qué harías ante una destrucción inesperada?
16. ¿Qué debe ocurrir si el plan queda obsoleto?
17. ¿Por qué `disableConcurrentBuilds()` no sustituye el bloqueo de estado?
18. ¿Qué evidencia demuestra que un cambio se verificó?
19. ¿Qué diferencias hay entre el laboratorio y producción?
20. ¿Qué datos no deben incluirse en la entrega?

---

## Glosario

- **Aplicación:** ejecución de las acciones de cambio previstas por Terraform.
- **Aprobación humana:** decisión explícita de una persona autorizada para permitir una aplicación.
- **Backend:** mecanismo que almacena y coordina el estado.
- **Build:** ejecución de un job en Jenkins.
- **Commit:** revisión identificable del código.
- **Configuración:** archivos Terraform que describen el estado deseado.
- **Deriva:** diferencia entre la configuración, el estado y los recursos observados.
- **Estado:** registro que relaciona la configuración con los objetos administrados.
- **`terraform_data`:** recurso integrado de Terraform para almacenar datos en el modelo de Terraform.
- **`input`:** argumento de `terraform_data` que proporciona datos al recurso.
- **`triggers_replace`:** argumento de `terraform_data` que puede hacer que un cambio solicite un reemplazo.
- **Plan:** propuesta de acciones que Terraform calcula.
- **Plan guardado:** archivo generado con `terraform plan -out`.
- **Recurso:** objeto definido y administrado por Terraform.
- **Reemplazo:** operación que retira y crea de nuevo un recurso según las reglas aplicables.
- **Variable:** entrada parametrizable de una configuración Terraform.
- **Salida:** valor que una configuración presenta después de una operación.
- **Workspace Jenkins:** directorio de trabajo de una ejecución Jenkins.
- **Workspace Terraform:** selección lógica del estado para una configuración, cuando se utiliza esa función.
- **Mínimo privilegio:** principio de conceder solo los permisos necesarios.
- **Revisión de código:** análisis del cambio propuesto antes de incorporarlo o ejecutarlo.
- **Revisión de plan:** análisis de las acciones previstas antes de aplicar.

---

## Plantilla de registro del cambio

```text
Proyecto:
Job:
Build:
Rama:
Commit:
Versión de Terraform:
Objetivo:
Archivos modificados:
Diff revisado por:
Resultado de fmt:
Resultado de validate:
Resumen del plan:
Acciones de creación:
Acciones de cambio:
Acciones de eliminación:
Reemplazos:
Decisión:
Aprobador:
Resultado de apply:
Verificación posterior:
```

No incluyas valores sensibles, estado completo ni el contenido del plan binario.

---

## Plantilla de decisión

```text
Cambio solicitado:
¿El diff coincide con el objetivo?:
¿El entorno es correcto?:
¿El plan corresponde al commit?:
¿Hay acciones no relacionadas?:
¿Hay destrucciones?:
¿Hay reemplazos?:
¿Se entiende el impacto?:
¿Existe una aprobación necesaria?:
Decisión:
Motivo:
```

Si una respuesta esencial es desconocida, detén el proceso y pide revisión.

---

## Síntesis final

Modificar infraestructura con Terraform significa gestionar un cambio desde el código hasta una aplicación revisada y verificada.

- Establece una línea de base antes de modificar.
- Haz cambios pequeños y justificables.
- Revisa el diff antes de generar el plan.
- Valida y formatea la configuración.
- Lee todas las acciones del plan.
- Detente ante destrucciones, reemplazos o cambios no explicados.
- Aplica solo en el entorno autorizado y después de la aprobación requerida.
- Verifica el resultado con salidas no sensibles.
- No edites manualmente el estado.
- No compartas estado ni planes binarios.
- En este laboratorio, utiliza solo `terraform_data`.
- No añadas proveedores cloud, credenciales o backends remotos.