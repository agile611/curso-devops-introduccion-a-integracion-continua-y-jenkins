# 05_creando_el_plan.md — Crear y revisar un plan de Terraform

Crear un plan permite inspeccionar los cambios que Terraform prevé antes de aplicarlos. En esta práctica aprenderás a preparar una configuración local, ejecutar `terraform plan`, interpretar sus acciones y comprobar cómo cambia el resultado cuando cambia la configuración. Los ejemplos usan recursos de laboratorio que no se conectan a una nube.

El plan es una herramienta de revisión, **no una aprobación ni una garantía de seguridad**. En un entorno real, el resultado depende del código, las variables, el estado, el backend, las credenciales, el proveedor y los recursos observados. Los archivos de plan y el estado pueden contener información sensible.

> **Límite del laboratorio:** no se necesitan credenciales de proveedor ni un backend remoto. No ejecutes `terraform apply` ni `terraform destroy`. No subas a Git, a Jenkins ni a una entrega archivos de estado o planes guardados.

## Esquema de la página

- ## Objetivos y alcance
  - ### Resultados de aprendizaje
  - ### Qué se construirá
  - ### Qué queda fuera
- ## Qué es un plan de Terraform
  - ### Configuración, estado y observación
  - ### Planificar no es aplicar
  - ### Acciones previstas
  - ### Plan sin cambios
- ## Preparar el proyecto de laboratorio
  - ### Requisitos de versión
  - ### Estructura del repositorio
  - ### Configuración local
  - ### Archivos generados
- ## Antes de crear un plan
  - ### Confirmar el contexto
  - ### Revisar configuración y variables
  - ### Inicializar el proyecto
  - ### Comprobar formato y sintaxis
- ## Crear un plan en la terminal
  - ### Plan básico
  - ### Opciones de entrada y salida
  - ### Plan detallado
  - ### Códigos de salida
- ## Leer la salida del plan
  - ### Resumen de acciones
  - ### Crear, actualizar, eliminar y reemplazar
  - ### Valores desconocidos y sensibles
  - ### Dependencias y orden
- ## Cambiar la configuración y comparar planes
  - ### Modificar un valor
  - ### Añadir o quitar un recurso local
  - ### Comparar código y plan
  - ### Registrar resultados
- ## Planes guardados
  - ### Crear un archivo de plan
  - ### Mostrarlo
  - ### Relación con el estado
  - ### Protección y eliminación
- ## Revisar un plan de forma responsable
  - ### Identificar el contexto
  - ### Comprobar el impacto
  - ### Preguntas para una revisión
  - ### Criterios de detención
- ## Planificación en Jenkins
  - ### Agente y directorio
  - ### Pipeline de laboratorio
  - ### Tratamiento del resultado detallado
  - ### Consola y artefactos
- ## Opciones y precauciones
  - ### Variables
  - ### `-refresh=false`
  - ### `-target`
  - ### `-replace`
  - ### Planes de destrucción
  - ### Salida JSON
- ## Seguridad, estado y repetibilidad
  - ### Estado local y remoto
  - ### Credenciales
  - ### Concurrencia
  - ### Diferencias entre planes
- ## Diagnóstico
  - ### Errores de sintaxis
  - ### Errores de proveedor
  - ### Errores de variable
  - ### Diferencias inesperadas
  - ### Ficha de diagnóstico
- ## Sesiones prácticas
  - ### Crear el primer plan
  - ### Interpretar acciones
  - ### Cambiar configuración
  - ### Usar `-detailed-exitcode`
  - ### Guardar y revisar un plan ficticio
  - ### Integrar el plan en Jenkins
  - ### Diagnosticar fallos
  - ### Proyecto integrador
- ## Evaluación y referencia
  - ### Checklist
  - ### Rúbrica
  - ### Preguntas de repaso
  - ### Glosario
  - ### Síntesis y entrega

---

## Objetivos y alcance

Esta práctica se centra en la etapa de planificación y en la lectura crítica de su resultado.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar qué calcula `terraform plan`.
- Diferenciar configuración, estado y recursos observados.
- Distinguir un plan de una aplicación.
- Generar un plan de laboratorio desde la terminal.
- Leer un resumen de acciones.
- Reconocer propuestas de creación, cambio, eliminación y reemplazo.
- Identificar valores conocidos, desconocidos y sensibles en una salida.
- Comparar dos planes después de un cambio controlado.
- Explicar el propósito de `-input=false` y `-no-color`.
- Describir qué hace `-out` y por qué protege el archivo resultante.
- Interpretar los códigos de salida de `-detailed-exitcode`.
- Incorporar una etapa de planificación a un Pipeline de Jenkins.
- Diagnosticar fallos sin mostrar secretos.
- Documentar un plan sin adjuntar información sensible.
- Explicar por qué el plan requiere contexto y revisión humana.

### Qué se construirá

Durante la práctica se preparará:

- Una configuración de Terraform local.
- Un recurso `terraform_data` de laboratorio.
- Un plan mostrado en consola.
- Una comparación entre dos configuraciones.
- Un Pipeline de Jenkins que ejecuta `init`, `validate` y `plan`.
- Un informe no sensible de revisión.

### Qué queda fuera

La práctica no:

- Crea infraestructura cloud.
- Usa proveedores cloud.
- Configura credenciales.
- Selecciona una cuenta de producción.
- Usa un backend remoto compartido.
- Ejecuta `terraform apply`.
- Ejecuta `terraform destroy`.
- Aprueba automáticamente cambios.
- Archiva un plan real.
- Enseña a saltarse una revisión.

### Regla de ejecución

Todos los comandos deben ejecutarse:

- Dentro del repositorio de laboratorio.
- En el directorio de configuración indicado.
- Con la versión de Terraform asignada.
- Sin credenciales de proveedor.
- Sin un backend compartido.
- Sin archivos de estado de otro ejercicio.

### Qué registrar

Registra solo la información necesaria:

- Versión de Terraform.
- Ruta relativa del proyecto.
- Rama y commit, si se usa Git.
- Resultado de cada etapa.
- Resumen no sensible de las acciones.
- Número del build de Jenkins, si corresponde.

No registres:

- Credenciales.
- Variables de entorno completas.
- Estado completo.
- Plan binario.
- Datos de recursos restringidos.
- Rutas internas que la política no permita compartir.

---

## Qué es un plan de Terraform

Un plan es una evaluación de los cambios que Terraform considera necesarios en un contexto concreto.

### Configuración, estado y observación

Al planificar, Terraform utiliza información de varias fuentes:

- Archivos `.tf`.
- Valores de variables.
- Estado disponible.
- Requisitos y versiones de proveedores.
- Datos que se puedan consultar.
- Configuración del backend.
- Identidad y permisos disponibles.
- Respuestas del proveedor, si se utiliza uno.

El resultado representa lo que Terraform prevé bajo esas condiciones.

### Configuración

La configuración declara el estado deseado mediante código.

Puede describir:

- Recursos.
- Variables.
- Proveedores.
- Módulos.
- Datos.
- Salidas.
- Dependencias.
- Restricciones de versión.

### Estado

El estado relaciona la configuración con los objetos que Terraform administra.

Puede contener información sensible.

No se debe tratar como un archivo de texto inocuo ni adjuntarse como evidencia de una práctica.

### Observación del proveedor

En una configuración con proveedores, Terraform puede consultar APIs para observar objetos o atributos.

El acceso requerido depende del proveedor y del diseño.

El plan puede realizar consultas, aunque no aplique cambios.

### Contexto de un plan

Un plan pertenece a un contexto específico:

- Una configuración.
- Una revisión de código.
- Un directorio.
- Un conjunto de variables.
- Un estado.
- Un backend.
- Un workspace.
- Un proveedor.
- Una identidad.
- Una versión de Terraform.

Si cambia el contexto, el resultado puede cambiar.

### Planificar no es aplicar

`terraform plan` calcula y muestra acciones previstas.

`terraform apply` puede ejecutar cambios.

Un plan correcto no significa:

- Que el cambio esté aprobado.
- Que la configuración sea segura.
- Que los permisos sean adecuados.
- Que el coste sea aceptable.
- Que el entorno seleccionado sea el correcto.
- Que el servicio vaya a permanecer disponible.

### Planificar no es validar

`terraform validate` comprueba aspectos de la configuración.

`terraform plan` calcula acciones con la información disponible.

Una configuración puede pasar la validación y aun así producir un plan que deba rechazarse.

### Planificar no es probar una aplicación

Un plan no comprueba por completo:

- Que una aplicación funcione.
- Que la arquitectura cumpla todos los requisitos.
- Que no haya errores de proveedor.
- Que no se produzcan costes.
- Que los recursos estén disponibles.
- Que los cambios sean reversibles.

### Acciones previstas

Terraform puede proponer acciones como:

- Crear un objeto.
- Modificar un objeto existente.
- Eliminar un objeto.
- Reemplazar un objeto.
- Leer información.
- No hacer cambios.

La salida precisa depende de la versión y el proveedor.

### Plan sin cambios

Un plan sin cambios indica que Terraform no propone acciones en ese contexto.

No demuestra que la infraestructura esté libre de problemas.

Puede haber limitaciones de lectura, atributos que no se observan o cambios que no pertenecen al ámbito de Terraform.

### Plan de laboratorio

El proyecto de esta guía usa `terraform_data`, un recurso integrado disponible desde Terraform 1.4.

No crea máquinas virtuales, redes ni servicios cloud.

Permite observar el flujo de planificación sin credenciales de proveedor.

---

## Preparar el proyecto de laboratorio

El proyecto debe ser pequeño, local y fácil de revisar.

### Requisitos de versión

El ejemplo necesita Terraform 1.4 o posterior.

Comprueba la versión del agente antes de ejecutar el plan:

```bash
terraform version
```

El requisito también queda declarado en la configuración.

### Estructura del repositorio

```text
creando-plan/
├── README.md
├── .gitignore
├── Jenkinsfile
└── terraform/
    ├── main.tf
    └── outputs.tf
```

El archivo `Jenkinsfile` es opcional para la primera sesión local.

### Crear los directorios

En Unix-like:

```bash
mkdir -p creando-plan/terraform
cd creando-plan
```

En PowerShell:

```powershell
New-Item -ItemType Directory -Force creando-plan\terraform
Set-Location creando-plan
```

Comprueba el directorio actual antes de continuar.

### Archivo `terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "plan_laboratorio" {
  input = {
    proyecto = "creando-plan"
    entorno  = "laboratorio"
    objetivo = "estudiar el plan sin proveedor cloud"
  }
}
```

### Archivo `terraform/outputs.tf`

```hcl
output "resumen_laboratorio" {
  description = "Información no sensible del ejercicio local."
  value       = terraform_data.plan_laboratorio.output
}
```

### Archivo `README.md`

```text
Práctica de creación y revisión de un plan Terraform.
Se utiliza terraform_data y no se crean recursos cloud.
No se usan credenciales ni un backend remoto.
El ejercicio no aplica cambios.
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

Adapta el archivo a la política del curso.

### Revisar el proyecto

Antes de planificar, comprueba:

- Que el directorio actual sea `terraform/`.
- Que `main.tf` y `outputs.tf` estén guardados.
- Que `required_version` corresponda al agente.
- Que no exista un bloque de backend inesperado.
- Que no haya proveedores cloud.
- Que no haya módulos externos.
- Que no haya credenciales.
- Que Git no vaya a incluir archivos temporales.

### Archivos creados durante la inicialización

`terraform init` puede crear:

```text
.terraform/
```

También puede crear o actualizar:

```text
.terraform.lock.hcl
```

La aparición del lockfile depende de la configuración.

### Archivos de estado

Una operación que guarda estado puede crear archivos como:

```text
terraform.tfstate
terraform.tfstate.backup
```

No los confirmes en Git ni los compartas.

### No reutilizar otros proyectos

No copies al laboratorio:

- Estado de un ejercicio anterior.
- Archivos de variables privados.
- Planes antiguos.
- Configuración de proveedor personal.
- Archivos de backend de otra cuenta.

---

## Antes de crear un plan

Una revisión breve del contexto evita planificar desde un directorio o estado equivocado.

### Confirmar el directorio

En Unix-like:

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Confirma que estás en el directorio `terraform` del proyecto de laboratorio.

### Confirmar la configuración

Lista los archivos del módulo.

En Unix-like:

```bash
find . -maxdepth 1 -type f
```

En PowerShell:

```powershell
Get-ChildItem -File
```

Comprueba que los archivos `.tf` son los esperados.

### Confirmar Git

Si el proyecto usa Git:

```bash
git status --short
```

Comprueba rama y revisión:

```bash
git branch --show-current
```

```bash
git log -1 --oneline
```

No incluyas datos personales innecesarios en la entrega.

### Revisar variables

Comprueba si hay variables declaradas y de dónde se obtienen.

No ejecutes `env` ni `printenv` para buscar valores.

No escribas secretos como argumentos para “probar”.

### Revisar backend

Lee la configuración de Terraform y confirma que no contiene un backend remoto no autorizado.

En el laboratorio se inicializará con:

```text
-backend=false
```

### Revisar proveedor

La configuración local no requiere un proveedor cloud.

Si aparece un proveedor no previsto:

1. Detén la práctica.
2. Identifica dónde se declara.
3. Comprueba el commit.
4. Consulta al docente.
5. No añadas credenciales para continuar.

### Revisar módulos

Comprueba si existen bloques `module`.

No descargues módulos externos desconocidos para completar el ejercicio.

### Comprobar formato

```bash
terraform fmt -check -recursive
```

Si falla, formatea localmente:

```bash
terraform fmt -recursive
```

Después revisa el diff.

### Inicializar el directorio

Desde la carpeta `terraform`:

```bash
terraform init -backend=false -input=false -no-color
```

La opción `-backend=false` se utiliza porque el laboratorio no debe configurar un backend remoto.

### Validar la configuración

```bash
terraform validate -no-color
```

La validación no sustituye la revisión del plan.

### Comprobar que el entorno no requiere credenciales

En este ejercicio:

- No se autentica con una nube.
- No se consulta una cuenta cloud.
- No se usa una identidad de proveedor.
- No se lee un estado de producción.
- No se usa un backend compartido.

Si aparece una solicitud de credenciales, detén la actividad y verifica la configuración.

---

## Crear un plan en la terminal

La forma básica de crear el plan es ejecutar `terraform plan`.

### Plan básico

Desde el directorio `terraform`:

```bash
terraform plan
```

El comando puede mostrar preguntas si la configuración necesita valores de entrada.

Para automatización no interactiva se utiliza `-input=false`.

### Plan recomendado para el laboratorio

```bash
terraform plan -input=false -no-color
```

Las opciones hacen que la operación sea no interactiva y que la salida no incluya códigos de color.

### Opción `-input=false`

Evita que Terraform espere una respuesta en la terminal.

Si falta un valor necesario, el comando debería fallar con un diagnóstico.

No resuelvas la falta de una variable introduciendo una credencial real.

### Opción `-no-color`

Hace la salida más fácil de leer en logs de CI.

No reduce la sensibilidad de la salida.

### Plan con variables no sensibles

Si el ejercicio declara una variable no sensible, puede proporcionarse mediante un archivo de laboratorio revisado.

No uses esta práctica para almacenar contraseñas o tokens en archivos de variables.

### Plan guardado

Terraform permite guardar la salida estructurada del plan:

```bash
terraform plan -input=false -no-color -out=tfplan
```

Este laboratorio no necesita guardar el archivo.

Un plan guardado puede incluir valores sensibles y debe tratarse como información protegida.

### Plan de consola frente a plan guardado

Un plan mostrado en consola:

- Se registra potencialmente en logs.
- Puede ser visible para personas autorizadas al job.
- Puede incluir información de recursos.
- Puede quedar retenido según la configuración de Jenkins.

Un plan guardado:

- Se escribe como archivo.
- Puede ser necesario en algunos flujos controlados.
- Puede contener datos sensibles.
- Puede copiarse o descargarse.
- Requiere política de acceso y retención.

### No archivar el archivo `tfplan`

No añadas automáticamente:

```groovy
archiveArtifacts artifacts: 'terraform/tfplan'
```

Antes de archivar un plan hay que definir acceso, retención y uso.

### Crear planes repetibles

Para comparar planes, conserva contexto idéntico:

- Mismo commit.
- Misma versión.
- Mismo directorio.
- Mismas variables.
- Mismo backend.
- Mismo estado.
- Mismo proveedor.
- Mismo agente o entorno equivalente.

### Plan en un workspace limpio

Un workspace nuevo puede no contener estado local previo.

El resultado puede diferir de una ejecución en un workspace persistente.

No compares dos planes sin saber si el estado y el workspace son los mismos.

### No ejecutar `apply`

La secuencia de esta guía termina en `plan`.

No continúes a una aplicación de recursos.

---

## Leer la salida del plan

La salida se debe leer como una propuesta de acciones, no como una simple marca de éxito.

### Resumen de acciones

Un plan puede incluir un resumen parecido a:

```text
Plan: 1 to add, 0 to change, 0 to destroy.
```

El texto exacto puede variar según Terraform y el proveedor.

Lee también los detalles de cada recurso.

### Crear

Una acción de creación indica que Terraform prevé añadir un recurso al modelo gestionado.

En la salida puede representarse con un símbolo de creación.

Comprueba:

- Tipo.
- Nombre.
- Entorno.
- Atributos.
- Dependencias.
- Posible coste en proyectos reales.

### Actualizar

Una acción de actualización indica que Terraform prevé modificar atributos de un recurso.

Comprueba:

- Qué atributos cambian.
- Si el proveedor cambia valores adicionales.
- Si el cambio puede interrumpir el servicio.
- Si se necesita una ventana de mantenimiento.

### Eliminar

Una acción de eliminación indica que Terraform prevé quitar un recurso administrado.

No interpretes la eliminación como una limpieza trivial.

Puede implicar:

- Interrupción.
- Pérdida de datos.
- Cambio de direccionamiento.
- Eliminación de dependencias.
- Costes de recuperación.
- Impacto sobre otros servicios.

### Reemplazar

Un reemplazo puede implicar eliminar un recurso y crear otro.

Comprueba qué atributo provoca el reemplazo.

En un entorno real, evalúa:

- Disponibilidad.
- Datos persistentes.
- Direcciones o identificadores.
- Dependencias.
- Ventana de cambio.
- Reversión.
- Coste.

### Lecturas de datos

Algunas configuraciones consultan datos existentes.

Una lectura no es necesariamente una modificación.

Aun así, puede requerir permisos y conectividad.

### Valores conocidos

Un valor conocido está disponible durante la planificación.

Comprueba si es apropiado que aparezca en consola o en una revisión.

### Valores desconocidos

Algunos valores solo se conocen durante una fase posterior o después de una operación con el proveedor.

La salida puede señalar valores como desconocidos hasta que exista más información.

No deduzcas un valor exacto que el plan no muestra.

### Valores sensibles

Terraform puede ocultar ciertos valores en la salida.

La marca de sensibilidad no garantiza que el valor desaparezca del estado o del plan guardado.

### Dependencias

Terraform usa referencias entre objetos para determinar parte del orden de las acciones.

Revisa dependencias implícitas y explícitas.

Una dependencia no expresada puede producir resultados inesperados.

### Acciones encadenadas

Un cambio en un recurso puede provocar cambios en otros.

Revisa el plan completo, no solo el recurso que se pretendía modificar.

### No leer solo el resumen

El resumen ayuda a orientarse.

No sustituye la lectura de:

- Recursos.
- Atributos.
- Reemplazos.
- Eliminaciones.
- Valores sensibles.
- Dependencias.
- Mensajes de advertencia.

---

## Cambiar la configuración y comparar planes

Un cambio controlado ayuda a ver cómo responde Terraform.

### Preparar una copia

Antes de modificar:

- Guarda el estado del repositorio.
- Confirma que trabajas en una rama de laboratorio.
- Anota el commit.
- No cambies archivos de otros proyectos.

### Modificar un valor

En `terraform/main.tf`, cambia un dato de laboratorio, por ejemplo:

```hcl
entorno = "laboratorio"
```

por:

```hcl
entorno = "practica"
```

El valor es descriptivo y no sensible.

### Ejecutar formato y validación

```bash
terraform fmt -check -recursive
```

```bash
terraform validate -no-color
```

### Generar el nuevo plan

```bash
terraform plan -input=false -no-color
```

Compara qué cambia en la salida.

### Revisar el diff de Git

```bash
git diff
```

Relaciona:

- La línea cambiada.
- El recurso afectado.
- La acción prevista.
- Los valores que se actualizan.

### No asumir una relación uno a uno

Un cambio en una línea puede influir en:

- Varios atributos.
- Recursos dependientes.
- Un reemplazo.
- Un módulo completo.
- Valores calculados.

El plan refleja el contexto completo, no una traducción literal de cada línea.

### Añadir un segundo recurso local

Solo si el docente lo autoriza, se puede añadir otro recurso `terraform_data`.

Antes de hacerlo:

- Comprueba que la versión es compatible.
- Usa nombres claros.
- Mantén datos no sensibles.
- No añadas un proveedor externo.

### Eliminar un recurso local de prueba

Una eliminación de configuración puede producir una propuesta de eliminación del objeto correspondiente, según el estado y el contexto.

Esta actividad debe limitarse al recurso local de laboratorio.

No uses la técnica con recursos reales.

### Registrar comparación

Usa una ficha:

```text
Commit inicial:
Cambio realizado:
Commit nuevo:
Acción inicial:
Acción después del cambio:
Atributos afectados:
Diferencias:
Preguntas pendientes:
```

### Restaurar el proyecto

Al terminar:

1. Revisa el diff.
2. Restaura la configuración requerida.
3. Confirma que no se añadieron archivos sensibles.
4. Comprueba de nuevo el formato.
5. Registra el resultado del ejercicio.

---

## Planes guardados

Guardar un plan puede ser útil en flujos controlados, pero añade riesgos.

### Crear un archivo de plan

La forma general es:

```bash
terraform plan -input=false -no-color -out=tfplan
```

No ejecutes esta operación sobre un backend o entorno no autorizado.

### Protección del archivo

Trata `tfplan` como potencialmente sensible.

No:

- Lo confirmes en Git.
- Lo subas a una tarea pública.
- Lo adjuntes a un correo.
- Lo archives en un job abierto.
- Lo copies a una carpeta compartida.
- Lo conserves indefinidamente.

### Mostrar un plan guardado

La forma general de mostrarlo es:

```bash
terraform show tfplan
```

La salida puede incluir valores de configuración.

Revisa el contexto antes de compartirla.

### Salida JSON

La forma general de convertir una representación del plan a JSON es:

```bash
terraform show -json tfplan
```

La salida JSON puede contener muchos detalles y datos sensibles.

No la trates como una versión más segura del plan.

### Plan y estado posterior

Un plan guardado corresponde a un contexto de planificación concreto.

Si cambian:

- Configuración.
- Estado.
- Variables.
- Backend.
- Workspace.
- Proveedor.
- Permisos.
- Recursos remotos.

El plan puede dejar de representar correctamente la situación actual.

### Asociación con el commit

En un flujo real, documenta:

- Commit.
- Job.
- Entorno.
- Identidad.
- Versión.
- Plan.
- Aprobación.
- Hora de generación.

No apliques un plan cuya relación con el código no puedas demostrar.

### Aplicación de un plan guardado

Terraform dispone de flujos que aplican un archivo de plan.

Esta guía no los utiliza.

No ejecutes un archivo de plan de producción como parte de una sesión de laboratorio.

### Eliminación del archivo

Sigue el procedimiento aprobado para limpiar el workspace.

No borres rutas amplias ni directorios compartidos.

Comprueba que el archivo no se archive de forma automática.

---

## Revisar un plan de forma responsable

Una revisión debe considerar contexto, impacto y evidencia.

### Identificar el contexto

Antes de revisar, confirma:

- Repositorio.
- Rama.
- Commit.
- Directorio Terraform.
- Versión de Terraform.
- Backend.
- Workspace.
- Entorno.
- Variables.
- Identidad usada.
- Número de build.

### Comprobar el alcance

Pregunta:

- ¿Qué recursos aparecen?
- ¿Qué proveedor los administra?
- ¿Qué entorno es?
- ¿Qué cuenta o proyecto se seleccionó?
- ¿Qué región se utiliza?
- ¿Qué recursos quedan fuera?
- ¿El inventario de módulos y proveedores es el esperado?

### Comprobar el impacto

Pregunta:

- ¿Hay eliminaciones?
- ¿Hay reemplazos?
- ¿Cambian permisos?
- ¿Cambian redes o exposición?
- ¿Cambian datos persistentes?
- ¿Puede interrumpirse un servicio?
- ¿Hay costes nuevos?
- ¿Afecta a recursos dependientes?
- ¿Se necesita una ventana de cambio?

### Comprobar la intención

Pregunta:

- ¿El cambio responde al objetivo del ticket?
- ¿Hay cambios no relacionados?
- ¿Los nombres y etiquetas son correctos?
- ¿Las variables corresponden al entorno?
- ¿El plan está asociado al commit revisado?
- ¿Las advertencias se han investigado?

### Comprobar la reversibilidad

Pregunta:

- ¿Qué ocurre si el cambio falla?
- ¿Existe una copia de seguridad?
- ¿Se puede volver al estado anterior?
- ¿Hay que migrar datos?
- ¿La reversión requiere otro cambio?
- ¿Quién puede aprobarla?

### Criterios de detención

Detén la revisión si:

- El entorno no está claro.
- El backend no está identificado.
- El commit del plan no coincide con el cambio revisado.
- Aparecen recursos inesperados.
- El plan propone destrucciones no justificadas.
- Se detecta información sensible en la consola.
- El agente usa credenciales no previstas.
- La configuración incluye proveedores o módulos no aprobados.
- No existe información suficiente para estimar el impacto.

---

## Planificación en Jenkins

Jenkins puede ejecutar los comandos y presentar el plan en el contexto del build.

### Agente

Selecciona un agente con Terraform instalado.

Una etiqueta como esta es ilustrativa:

```groovy
label 'terraform-lab'
```

Usa la etiqueta que asigne el curso.

### Directorio

La configuración de ejemplo se encuentra en:

```text
terraform/
```

Cada comando debe ejecutarse dentro de esa carpeta.

### Pipeline mínimo

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

### Pipeline con validaciones

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
        stage('Version') {
            steps {
                sh 'terraform version'
            }
        }

        stage('Format') {
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
            echo 'La planificación local terminó correctamente.'
        }

        failure {
            echo 'El pipeline falló. Revisa la primera etapa fallida.'
        }

        always {
            echo "Resultado final: ${currentBuild.currentResult}"
        }
    }
}
```

### Salida en consola

El plan aparece en la consola del build.

Comprueba quién puede ver la consola antes de ejecutar una configuración que pueda mostrar información interna.

### No imprimir el entorno

No añadas:

```groovy
sh 'env'
```

Las variables de entorno pueden contener credenciales.

### No ignorar fallos

Evita:

```groovy
sh 'terraform plan -input=false -no-color || true'
```

Ese patrón puede hacer que un plan fallido parezca exitoso.

### No archivar el plan automáticamente

No añadas una etapa para archivar `tfplan` sin definir:

- Quién puede acceder.
- Cuánto tiempo se retiene.
- Qué información contiene.
- Cómo se relaciona con el commit.
- Qué política autoriza su uso.

### Registrar una salida resumida

En la entrega académica, puede bastar con registrar:

- Build.
- Commit.
- Versión.
- Etapa.
- Resultado.
- Resumen no sensible.

No pegues la salida completa si incluye datos restringidos.

---

## Tratamiento de `-detailed-exitcode`

La opción `-detailed-exitcode` permite distinguir entre errores, ausencia de cambios y cambios propuestos.

### Códigos de salida

Con `-detailed-exitcode`, Terraform utiliza estas convenciones:

- `0`: planificación correcta y sin cambios previstos.
- `1`: error durante la planificación.
- `2`: planificación correcta con cambios previstos.

### Precaución en Jenkins

Jenkins suele interpretar cualquier código distinto de cero como fallo para un paso `sh`.

Por tanto, si el plan devuelve `2`, un `sh` normal puede marcar el build como fallido aunque la planificación haya terminado correctamente con cambios.

### Capturar el código de salida

Un patrón conceptual de Pipeline es:

```groovy
stage('Plan con código detallado') {
    steps {
        dir('terraform') {
            script {
                int codigo = sh(
                    returnStatus: true,
                    script: 'terraform plan -input=false -no-color -detailed-exitcode'
                )

                if (codigo == 0) {
                    echo 'Plan correcto: no se prevén cambios.'
                } else if (codigo == 2) {
                    echo 'Plan correcto: se prevén cambios.'
                } else {
                    error "La planificación falló con código ${codigo}."
                }
            }
        }
    }
}
```

### Interpretar el estado del build

En el ejemplo anterior:

- El código `0` se interpreta como plan correcto sin cambios.
- El código `2` se interpreta como plan correcto con cambios.
- Otros códigos provocan error.

La organización puede tener convenciones distintas para el estado visual de un build con cambios.

### No convertir cambios en aprobación

El código `2` significa que existen cambios previstos.

No significa que esos cambios sean aceptables.

### Probar ambos casos

La configuración local puede producir distintos resultados según el estado y la ejecución.

Prueba el comportamiento solo en el laboratorio.

No alteres un estado compartido para forzar un código de salida.

---

## Opciones y precauciones

Las opciones de `plan` modifican el alcance o la información utilizada. No son intercambiables.

### Variables

Las variables pueden modificar el resultado del plan.

Registra qué fuentes de variables utiliza el proyecto, sin publicar valores sensibles.

### Archivos `tfvars`

Un archivo de variables puede incluir valores de entorno.

Comprueba si es apropiado versionarlo.

No confirmes archivos con secretos.

### `-var`

Pasar un valor con `-var` puede exponerlo en argumentos, historial o logs.

No uses esta opción para secretos sin una integración aprobada.

### `TF_VAR_`

Terraform puede leer variables de entorno con el prefijo `TF_VAR_`.

No imprimas todas las variables para comprobarlas.

No asumas que una variable de entorno es secreta por defecto.

### `-refresh=false`

Esta opción evita parte de la actualización de información del estado durante la planificación.

Puede producir un plan desactualizado o incompleto.

No la uses como atajo para corregir problemas de acceso o rendimiento.

### `-target`

`-target` limita la atención a ciertos recursos o módulos.

Es una herramienta excepcional para contextos específicos, no una forma habitual de reducir un plan grande.

Puede omitir dependencias o cambios que merecen atención.

No la utilices en las sesiones de esta guía.

### `-replace`

`-replace` solicita reemplazar un recurso concreto durante el plan.

Puede causar interrupciones o pérdida de datos en un entorno real.

No se utiliza en el laboratorio.

### Planes de destrucción

Terraform puede crear planes orientados a eliminar recursos.

No se usan en esta práctica.

Cualquier acción de destrucción necesita revisión y autorización separadas.

### Salida JSON

`terraform show -json` puede producir una representación detallada.

Esa salida puede revelar valores, atributos, IDs y configuración interna.

No es un formato de salida “seguro” para compartir.

### `-compact-warnings`

Puede cambiar la forma de mostrar advertencias según la versión.

No omitas una advertencia que no hayas entendido.

### `-lock-timeout`

Puede permitir que Terraform espere a obtener un bloqueo en contextos compatibles.

No es una solución a bloqueos abandonados sin investigar su origen.

### `-parallelism`

Controla ciertos aspectos del paralelismo de operaciones.

No lo cambies para ocultar un problema de proveedor ni para acelerar operaciones sin revisar impacto.

### Opciones específicas de una versión

Comprueba la documentación de la versión instalada.

No asumas que todas las opciones existen o se comportan igual en todas las versiones.

---

## Seguridad, estado y repetibilidad

La calidad de un plan depende tanto de la configuración como del contexto en que se genera.

### Estado local

El estado local se guarda en el directorio de trabajo según el flujo utilizado.

Puede quedar en el workspace de Jenkins o en el equipo del estudiante.

No lo uses como almacenamiento compartido.

### Estado remoto

Un backend remoto puede facilitar colaboración y bloqueo, pero debe configurarse con controles adecuados.

No conectes el laboratorio a un backend real.

### Plan y estado

Un plan puede depender del estado y contener valores derivados de la configuración.

Protege ambos como datos potencialmente sensibles.

### Credenciales

La práctica no necesita credenciales cloud.

Una etapa de validación y un plan de `terraform_data` no deberían requerir autenticación de proveedor.

Si Jenkins solicita credenciales, comprueba backend, proveedor, variables y directorio.

### Agente Jenkins

El agente puede heredar identidades o variables del entorno.

No asumas que un agente de laboratorio carece de acceso externo.

El administrador debe controlar sus permisos.

### Concurrencia

Dos ejecuciones sobre el mismo estado pueden entrar en conflicto.

En un entorno real, define bloqueo y reglas de concurrencia.

### Repetibilidad

Para repetir el plan, controla:

- Versión de Terraform.
- Versiones de proveedores.
- Versiones de módulos.
- Variables.
- Commit.
- Backend.
- Estado.
- Workspace.
- Identidad.
- Agente.

### Diferencias entre planes

Un plan distinto no demuestra automáticamente un error.

Compara el contexto y busca:

- Cambio en código.
- Cambio en variables.
- Cambio en estado.
- Cambio en proveedor.
- Cambio en módulo.
- Cambio manual.
- Diferencia de versión.
- Diferencia de workspace.
- Diferencia de entorno.

### Seguridad del lockfile

En proyectos con proveedores, revisa cambios en `.terraform.lock.hcl`.

No actualices dependencias sin explicar el cambio.

### Datos de salida

No publiques logs, JSON o planes completos sin revisar su sensibilidad.

### Revisión de acceso

Confirma quién puede ver:

- Build.
- Consola.
- Artefactos.
- Workspace.
- Repositorio.
- Estado.
- Backend.

---

## Diagnóstico

Cuando el plan falla, identifica primero la etapa, el directorio y el contexto.

### Error de sintaxis

Comprueba:

- Archivo señalado.
- Línea y columna.
- Llaves.
- Comillas.
- Tipos.
- Referencias.
- Formato.
- Versión requerida.

Ejecuta `terraform fmt` solo después de comprender qué debe corregirse.

### Error de inicialización

Si falta inicializar, revisa:

- Directorio.
- Ejecución de `init`.
- Backend.
- Proveedores.
- Módulos.
- Configuración del checkout.

No ejecutes `init` desde otra carpeta por ensayo.

### Error de proveedor

Comprueba:

- Fuente.
- Versión.
- Archivo de bloqueo.
- Registro autorizado.
- Conectividad del agente.
- Requisito declarado en el proyecto.

No añadas credenciales cloud para resolver una descarga de proveedor.

### Error de variable

Comprueba:

- Declaración.
- Tipo.
- Valor por defecto.
- Fuente configurada.
- Nombre.
- Entorno.
- Parámetro del job, si corresponde.

No publiques el valor para pedir ayuda.

### Error de backend

Comprueba:

- Bloque `backend`.
- Directorio actual.
- Variables.
- Identidad del agente.
- Cuenta.
- Permisos.
- Estado seleccionado.

Detén el job si se conecta a un backend no autorizado.

### Error de autenticación

Comprueba primero si la configuración debería autenticarse.

Si el ejercicio es local, detente y revisa por qué se solicitan credenciales.

No imprimas tokens.

### Error de permisos

Puede que la identidad no tenga permiso para leer un dato o acceder al backend.

Solicita el permiso mínimo necesario mediante el proceso aprobado.

No eleves a administrador como primera solución.

### El plan propone un cambio inesperado

Comprueba:

- Commit.
- Directorio.
- Variables.
- Backend.
- Workspace.
- Estado.
- Proveedor.
- Recursos cambiados manualmente.
- Módulos.
- Versión.

No continúes hacia una aplicación.

### El build queda en espera

Comprueba:

- Agente.
- Etiqueta.
- Ejecutores.
- Timeout.
- Solicitudes interactivas.
- `-input=false`.
- Estado del checkout.

### El Pipeline informa fallo con código `2`

Si se usa `-detailed-exitcode`, el código `2` significa que se prevén cambios.

Comprueba que el Jenkinsfile maneja explícitamente los códigos `0`, `1` y `2`.

### Ficha de diagnóstico

```text
Job:
Número de build:
Rama:
Commit:
Agente:
Versión Terraform:
Directorio:
Etapa:
Comando:
Primer mensaje relevante:
Código de salida:
Resultado observado:
Hipótesis:
Comprobación siguiente:
```

No añadas credenciales, estado, planes o variables completas.

---

## Sesiones prácticas

Las sesiones avanzan desde un plan local hasta una pipeline de revisión.

### Preparación común

Antes de cada sesión:

- Confirma que usas la carpeta de laboratorio.
- Comprueba el commit.
- Ejecuta `terraform version`.
- Revisa backend y proveedores.
- No configures credenciales.
- No uses estado compartido.
- No ejecutes `apply` ni `destroy`.
- Inspecciona logs antes de compartirlos.
- Registra los cambios realizados.
- Restaura las modificaciones de prueba.

### Sesión 1: localizar el directorio correcto

**Objetivo:** evitar crear un plan desde otro módulo.

#### Instrucciones

1. Abre una terminal.
2. Cambia al directorio `terraform`.
3. Ejecuta `pwd` o `Get-Location`.
4. Lista los archivos `.tf`.
5. Comprueba `git status`.
6. Anota la ruta relativa, no una ruta personal completa.

#### Preguntas

- ¿Qué comando confirma la carpeta actual?
- ¿Qué archivos determinan el módulo?
- ¿Qué problema puede causar ejecutar `plan` desde la carpeta incorrecta?

### Sesión 2: comprobar versión y requisito

**Objetivo:** verificar compatibilidad antes de planificar.

#### Instrucciones

1. Ejecuta `terraform version`.
2. Lee `required_version`.
3. Comprueba el agente asignado.
4. Anota si la versión cumple.
5. Consulta al docente si no coincide.
6. No cambies la instalación compartida.

### Sesión 3: comprobar la configuración

**Objetivo:** confirmar que solo hay archivos de laboratorio.

#### Instrucciones

1. Lista los archivos `.tf`.
2. Busca bloques de proveedor.
3. Busca bloques de backend.
4. Busca módulos externos.
5. Revisa variables.
6. Detente si aparece una cuenta o entorno no esperado.
7. Documenta solo nombres de archivos y hallazgos no sensibles.

### Sesión 4: ejecutar `terraform fmt`

**Objetivo:** garantizar formato estándar antes del plan.

#### Comandos

```bash
terraform fmt -recursive
```

```bash
terraform fmt -check -recursive
```

#### Instrucciones

1. Formatea la configuración de laboratorio.
2. Revisa el diff.
3. Ejecuta la comprobación.
4. Comprueba el código de salida.
5. Confirma que no se han modificado otros directorios.

### Sesión 5: inicializar sin backend remoto

**Objetivo:** preparar el módulo local.

#### Comando

```bash
terraform init -backend=false -input=false -no-color
```

#### Instrucciones

1. Ejecuta desde `terraform/`.
2. Lee los mensajes.
3. Comprueba si se descargó algún componente.
4. Comprueba si apareció `.terraform/`.
5. Revisa si cambió el lockfile.
6. No archives esos archivos temporales.

### Sesión 6: validar la configuración

**Objetivo:** ejecutar una comprobación previa al plan.

```bash
terraform validate -no-color
```

#### Instrucciones

1. Ejecuta la validación.
2. Registra el resultado.
3. En una copia, introduce un error controlado.
4. Ejecuta la validación de nuevo.
5. Identifica el diagnóstico.
6. Restaura el archivo válido.

### Sesión 7: crear el primer plan

**Objetivo:** obtener un plan en consola.

```bash
terraform plan -input=false -no-color
```

#### Instrucciones

1. Ejecuta desde el módulo.
2. Identifica el recurso `terraform_data`.
3. Lee las acciones propuestas.
4. Registra el resumen.
5. Confirma que no aparece un proveedor cloud.
6. Detente en el plan.

### Sesión 8: interpretar el resumen

**Objetivo:** leer acciones, no solo el resultado final.

#### Instrucciones

1. Busca el número de recursos que se añadirían.
2. Busca cambios.
3. Busca destrucciones.
4. Busca reemplazos.
5. Explica cada acción con palabras propias.
6. Indica qué parte del plan no demuestra seguridad.

### Sesión 9: cambiar un valor

**Objetivo:** observar el impacto de un cambio controlado.

#### Instrucciones

1. Cambia un valor descriptivo de `main.tf`.
2. Ejecuta `terraform fmt -check`.
3. Ejecuta `terraform validate`.
4. Ejecuta `terraform plan`.
5. Revisa `git diff`.
6. Relaciona el cambio con la salida.
7. Restaura la configuración al finalizar.

### Sesión 10: comparar dos planes

**Objetivo:** detectar diferencias entre resultados.

#### Instrucciones

1. Guarda el resumen del primer plan.
2. Cambia un valor local.
3. Genera un segundo plan.
4. Compara acciones y atributos.
5. Confirma que commit y versión están identificados.
6. Explica qué otras condiciones podrían haber cambiado el plan.

### Sesión 11: revisar una eliminación ficticia

**Objetivo:** practicar una detención segura.

El docente entrega una salida ficticia de plan con una eliminación.

#### Instrucciones

1. Localiza el recurso afectado.
2. Identifica el entorno indicado.
3. Señala la razón conocida, si existe.
4. Lista información que falta.
5. Escribe “detener y revisar” como decisión provisional.
6. No ejecutes comandos de aplicación o destrucción.

### Sesión 12: revisar un reemplazo ficticio

**Objetivo:** reconocer un cambio potencialmente disruptivo.

#### Instrucciones

1. Identifica el atributo asociado al reemplazo.
2. Explica por qué reemplazar puede tener más impacto que actualizar.
3. Enumera dependencias.
4. Indica qué revisarías sobre datos y disponibilidad.
5. Propón qué persona debería aprobar.
6. No ejecutes el plan proporcionado.

### Sesión 13: comparar plan y diff de Git

**Objetivo:** combinar revisión de código y revisión del plan.

#### Instrucciones

1. Lee `git diff`.
2. Lee el plan generado.
3. Identifica cambios esperados.
4. Busca cambios no relacionados.
5. Comprueba el commit.
6. Escribe una conclusión breve y razonada.

### Sesión 14: probar `-detailed-exitcode`

**Objetivo:** interpretar los códigos de salida del plan.

#### Instrucciones

1. Ejecuta el plan con `-detailed-exitcode` solo en el laboratorio.
2. Registra el código de salida.
3. Distingue `0`, `1` y `2`.
4. Explica por qué Jenkins podría marcar `2` como fallo por defecto.
5. No uses `|| true` para ocultarlo.
6. Revisa el ejemplo de `returnStatus`.

### Sesión 15: añadir la etapa `Plan` a Jenkins

**Objetivo:** ejecutar un plan local desde un agente.

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

1. Comprueba la etiqueta del agente.
2. Comprueba la ruta.
3. Guarda el `Jenkinsfile`.
4. Ejecuta el build.
5. Revisa la consola.
6. Registra el número del build.

### Sesión 16: revisar `init`, `validate` y `plan`

**Objetivo:** completar el flujo en el orden esperado.

#### Instrucciones

1. Ejecuta `init`.
2. Ejecuta `validate`.
3. Ejecuta `plan`.
4. Comprueba el orden en Jenkins.
5. Provoca un fallo controlado de validación.
6. Confirma que no se presenta un plan correcto después de la validación fallida.
7. Restaura la configuración.

### Sesión 17: investigar una ruta incorrecta

**Objetivo:** distinguir errores de Jenkins de errores de Terraform.

#### Instrucciones

1. En una copia temporal, cambia la carpeta de `dir`.
2. Ejecuta el job.
3. Identifica si falla antes de iniciar Terraform.
4. Registra la primera etapa fallida.
5. Restaura la ruta.
6. Vuelve a ejecutar.

### Sesión 18: inspeccionar un plan guardado sin producir uno real

**Objetivo:** comprender el ciclo y el riesgo de `-out`.

#### Instrucciones

1. Lee el comando documentado `terraform plan -out=tfplan`.
2. Explica qué archivo generaría.
3. Indica por qué podría contener datos sensibles.
4. Revisa el `.gitignore`.
5. Revisa los patrones de `archiveArtifacts`.
6. No ejecutes ni compartas un plan de producción.

### Sesión 19: revisar el workspace de Jenkins

**Objetivo:** identificar archivos temporales.

#### Instrucciones

1. Revisa los archivos del proyecto dentro de tu propio workspace autorizado.
2. Identifica `.terraform/`.
3. Identifica estado o planes si existen.
4. Comprueba el estado de Git.
5. No abras ni copies artefactos de otros jobs.
6. Sigue las instrucciones de limpieza del curso.

### Sesión 20: comparar builds

**Objetivo:** evaluar reproducibilidad.

#### Instrucciones

1. Ejecuta dos veces el mismo commit.
2. Compara versión y agente.
3. Compara `init`.
4. Compara el plan.
5. Comprueba si el workspace fue limpiado.
6. Identifica posibles causas de diferencias.
7. Registra la comparación sin copiar detalles sensibles.

### Sesión 21: diagnosticar un backend inesperado

**Objetivo:** detener una inicialización fuera del alcance previsto.

#### Escenario

`init` muestra que está configurando un backend remoto.

#### Instrucciones

1. Detén el job.
2. No proporciones credenciales.
3. Comprueba el directorio.
4. Revisa los archivos `.tf`.
5. Comprueba el commit y la rama.
6. Informa al docente.
7. Documenta la observación sin publicar el nombre del backend si es restringido.

### Sesión 22: diagnóstico de variable ausente

**Objetivo:** resolver un fallo de entrada sin exponer valores.

#### Instrucciones

1. Identifica el nombre de la variable en el error.
2. Revisa su declaración.
3. Determina si debería existir en el laboratorio.
4. Comprueba la fuente permitida.
5. No pegues el valor en el comando.
6. Consulta al docente si requiere una credencial.

### Sesión 23: revisar una salida con valores sensibles

**Objetivo:** decidir qué puede compartirse.

El docente proporciona un log ficticio con valores marcados como sensibles.

#### Instrucciones

1. Señala fragmentos que no deberían publicarse.
2. Prepara un resumen sin esos valores.
3. Conserva el mensaje de error y etapa relevantes.
4. No adjuntes el plan completo.
5. Explica qué sistema debe proteger el log.

### Sesión 24: revisión por parejas

**Objetivo:** revisar el Pipeline y el plan.

La persona autora explica:

- Qué commit se planificó.
- Qué directorio se usó.
- Qué hizo `init`.
- Qué acciones mostró `plan`.
- Qué opción deshabilitó el backend remoto.
- Qué archivos no deben archivarse.

La persona revisora comprueba:

- Versión compatible.
- Orden correcto.
- Variables controladas.
- Salida revisada.
- Sin credenciales.
- Sin estado compartido.
- Sin `apply` ni `destroy`.
- Sin plan binario publicado.

### Sesión 25: proyecto integrador

**Objetivo:** entregar un Pipeline de planificación de laboratorio.

#### Requisitos

- Proyecto Terraform local.
- `required_version` apropiado.
- Recurso `terraform_data`.
- `.gitignore`.
- Etapa de versión.
- Etapa de formato.
- `init -backend=false`.
- `validate`.
- `plan -input=false -no-color`.
- Manejo correcto de errores.
- Evidencia de una ejecución.
- Evidencia de un fallo controlado.
- Sin credenciales.
- Sin backend remoto.
- Sin `apply` ni `destroy`.
- Sin plan binario archivado.

#### Entrega

Incluye:

- `Jenkinsfile`.
- Archivos Terraform.
- Rama y commit.
- Agente y versión observados.
- Número del build.
- Resumen no sensible del plan.
- Diagnóstico del fallo.
- Lista de archivos temporales.
- Explicación de por qué el plan no se aplicó.

---

## Checklist de creación y revisión

### Contexto

- [ ] El directorio actual es el módulo esperado.
- [ ] El commit está identificado.
- [ ] La versión de Terraform es compatible.
- [ ] El backend es el esperado.
- [ ] El workspace es el correcto.
- [ ] El agente es el autorizado.
- [ ] No hay credenciales innecesarias.

### Configuración

- [ ] El formato pasa.
- [ ] La inicialización termina correctamente.
- [ ] La validación termina correctamente.
- [ ] No hay módulos o proveedores inesperados.
- [ ] Las variables están identificadas.
- [ ] Los valores sensibles no aparecen en archivos confirmados.

### Plan

- [ ] El plan corresponde al código revisado.
- [ ] El entorno está identificado.
- [ ] Las acciones de creación están revisadas.
- [ ] Las actualizaciones están revisadas.
- [ ] Las eliminaciones están revisadas.
- [ ] Los reemplazos están revisados.
- [ ] Los valores desconocidos se han entendido.
- [ ] Los valores sensibles no se han divulgado.
- [ ] No se confundió `plan` con aprobación.

### Jenkins

- [ ] La etiqueta del agente es correcta.
- [ ] Las rutas son relativas al repositorio.
- [ ] `init` precede a `plan`.
- [ ] `validate` precede a `plan`.
- [ ] Los códigos de salida se interpretan correctamente.
- [ ] No se ocultan errores.
- [ ] No se archiva el workspace completo.
- [ ] No se archiva un plan sin autorización.

---

## Rúbrica de evaluación

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Concepto de plan | Lo confunde con aplicar | Distingue planificación y aplicación | Explica dependencia del contexto y del estado |
| Lectura | Usa solo el resumen | Identifica acciones principales | Evalúa dependencias, impacto y valores |
| Comandos | Omite opciones de CI | Usa `-input=false` y salida apropiada | Justifica opciones y limitaciones |
| Jenkins | Ejecuta comandos sin rutas claras | Usa agente y directorio adecuados | Propaga errores y registra contexto |
| Seguridad | Publica archivos temporales | Protege estado y plan | Define acceso, retención y asociación al commit |
| Diagnóstico | Copia todo el log | Identifica etapa y error | Separa observación, hipótesis y comprobación |
| Reproducibilidad | No registra versiones | Identifica commit y agente | Compara contextos y explica diferencias |
| Límites | Añade `apply` por defecto | Termina en `plan` | Justifica revisión y evita automatización insegura |

### Evidencias mínimas

Entrega:

- Configuración local.
- Pipeline.
- Resultado de formato.
- Resultado de `init`.
- Resultado de `validate`.
- Resumen del plan.
- Commit y número de build.
- Fallo controlado documentado.
- Confirmación de que no se aplicaron cambios.
- Confirmación de que no se compartió estado o plan binario.

---

## Preguntas de repaso

1. ¿Qué fuentes utiliza Terraform para crear un plan?
2. ¿Qué diferencia hay entre estado y configuración?
3. ¿Qué diferencia hay entre `validate` y `plan`?
4. ¿Qué diferencia hay entre `plan` y `apply`?
5. ¿Qué significa que un plan proponga un reemplazo?
6. ¿Por qué no basta con leer el resumen de acciones?
7. ¿Qué información define el contexto de un plan?
8. ¿Por qué dos planes pueden diferir con el mismo archivo HCL?
9. ¿Qué hace `-input=false`?
10. ¿Qué hace `-no-color`?
11. ¿Qué riesgos tiene guardar un plan con `-out`?
12. ¿Qué significa el código `2` con `-detailed-exitcode`?
13. ¿Por qué Jenkins puede tratar ese código como error?
14. ¿Qué hace `-backend=false` en el laboratorio?
15. ¿Por qué no se debe usar automáticamente en producción?
16. ¿Qué puede cambiar si se usa `-refresh=false`?
17. ¿Por qué `-target` no debería ser la forma normal de reducir un plan?
18. ¿Qué revisarías ante una propuesta de destrucción?
19. ¿Por qué un plan puede requerir permisos aunque no aplique cambios?
20. ¿Qué datos pueden aparecer en la consola?
21. ¿Qué relación debe existir entre plan y commit?
22. ¿Qué información guardarías en un informe de plan?
23. ¿Por qué no se archiva el workspace completo?
24. ¿Qué comprobaciones deben preceder a una revisión?
25. ¿Qué evidencia demuestra que la práctica terminó en planificación?

---

## Glosario

- **Agente Jenkins:** nodo donde se ejecuta el comando Terraform.
- **Backend:** mecanismo de almacenamiento y coordinación del estado.
- **Build:** ejecución de un job de Jenkins.
- **Commit:** revisión identificable del código en Git.
- **Configuración:** archivos Terraform que describen intención.
- **`terraform init`:** comando que prepara el directorio de trabajo.
- **`terraform validate`:** comando que valida estructura y coherencia de configuración.
- **`terraform plan`:** comando que calcula acciones previstas.
- **`terraform apply`:** comando que puede aplicar cambios a recursos.
- **Estado:** registro que relaciona configuración y recursos gestionados.
- **Plan guardado:** archivo creado con la opción `-out`.
- **Módulo:** conjunto reutilizable de configuración Terraform.
- **Proveedor:** plugin que permite a Terraform interactuar con una plataforma.
- **Recurso:** objeto descrito y gestionado por Terraform.
- **Deriva:** diferencia entre configuración declarada y estado observado.
- **`-backend=false`:** opción de inicialización que evita configurar el backend para esa operación.
- **`-input=false`:** opción que evita entradas interactivas.
- **`-no-color`:** opción que elimina códigos de color de la salida.
- **`-out`:** opción que guarda el plan en un archivo.
- **`-detailed-exitcode`:** opción que distingue error, ausencia de cambios y cambios previstos mediante códigos de salida.
- **`-refresh=false`:** opción que evita determinadas actualizaciones de información durante el plan.
- **`-target`:** opción que limita operaciones a recursos seleccionados; no es un flujo habitual recomendado.
- **`-replace`:** opción que solicita reemplazar un recurso.
- **Valor desconocido:** valor que no puede determinarse durante el plan con la información disponible.
- **Valor sensible:** valor que Terraform puede ocultar en ciertas salidas, sin dejar de existir en otros datos.
- **Workspace:** contexto de trabajo asociado a una selección de estado en Terraform.
- **Artefacto:** archivo guardado por Jenkins como resultado de una ejecución.
- **Idempotencia:** propiedad por la que repetir una operación mantiene el estado deseado sin cambios innecesarios.

---

## Plantilla de informe de plan

```text
Job:
Número de build:
Repositorio:
Rama:
Commit:
Agente:
Versión de Terraform:
Directorio Terraform:
Backend:
Workspace:
Resultado de init:
Resultado de validate:
Resultado de plan:
Resumen no sensible:
Acciones que requieren revisión:
¿Se aplicaron cambios?: No
Observaciones:
```

No incluyas el estado, un plan binario ni valores sensibles.

---

## Síntesis final

Crear un plan es una etapa clave para comprender los cambios que Terraform propone, pero no convierte una operación en segura por sí sola.

- Comprueba el directorio, el commit, la versión y el entorno.
- Inicializa con el backend apropiado para el contexto.
- Valida antes de planificar.
- Lee las acciones concretas, no solo el resumen.
- Revisa especialmente eliminaciones, reemplazos, permisos y dependencias.
- Trata estado, consola y planes guardados como potencialmente sensibles.
- No uses opciones como `-target` o `-refresh=false` para ocultar problemas.
- En Jenkins, selecciona el agente y la ruta correctos.
- No ocultes errores ni archives el workspace completo.
- La práctica termina con `plan`: no se ejecutan `apply` ni `destroy`.

---

## Actividad de cierre

Entrega un resumen que responda:

1. ¿Qué configuración se planificó?
2. ¿Qué versión de Terraform se usó?
3. ¿Qué agente ejecutó el job?
4. ¿Qué hizo `init`?
5. ¿Qué acciones mostró `plan`?
6. ¿Qué cambio controlado comparaste?
7. ¿Qué diferencia viste entre las dos salidas?
8. ¿Qué datos del plan podrían ser sensibles?
9. ¿Qué error controlado diagnosticastes?
10. ¿Qué evidencia confirma que no se aplicaron cambios?

No incluyas credenciales, estados, planes binarios, logs completos ni datos de infraestructura restringidos.