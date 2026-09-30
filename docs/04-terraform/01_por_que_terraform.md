# ¿Por qué Terraform?

Terraform permite describir infraestructura mediante archivos declarativos y revisar los cambios previstos antes de aplicarlos. Su valor no está simplemente en “crear servidores con código”: ayuda a hacer explícitas las decisiones, repetir operaciones, colaborar mediante control de versiones y reducir cambios manuales difíciles de auditar.

Esta documentación presenta qué problemas resuelve Terraform, cómo funciona su flujo de trabajo, qué compromisos introduce y cuándo conviene utilizarlo. Incluye sesiones prácticas que no requieren cuentas cloud ni modifican infraestructura remota. Los ejemplos usan recursos locales de prueba y deben ejecutarse únicamente en un entorno de laboratorio autorizado.

> **Aviso de seguridad:** el estado, los planes y las credenciales de infraestructura pueden contener información sensible. No los publiques en Git ni en logs. Las sesiones de esta página no requieren credenciales de proveedores ni ejecutan cambios en una nube.

## Esquema de la página

- ## Objetivos y alcance
  - ### Resultados de aprendizaje
  - ### Público y conocimientos previos
  - ### Qué se estudiará
  - ### Qué queda fuera
- ## El problema que resuelve Terraform
  - ### Infraestructura configurada manualmente
  - ### Cambios difíciles de repetir
  - ### Diferencias entre entornos
  - ### Falta de revisión y trazabilidad
- ## Infraestructura como código
  - ### Configuración declarativa
  - ### Código, configuración y documentación
  - ### Versionado y colaboración
  - ### Límites de la infraestructura como código
- ## Qué es Terraform
  - ### HashiCorp Configuration Language
  - ### Proveedores y recursos
  - ### Módulos
  - ### Datos y salidas
  - ### Estado
- ## Cómo funciona Terraform
  - ### Escribir la configuración
  - ### Inicializar el directorio
  - ### Formatear y validar
  - ### Planificar
  - ### Aplicar y comprobar
  - ### Destruir recursos
- ## Por qué elegir Terraform
  - ### Repetibilidad
  - ### Revisión antes del cambio
  - ### Colaboración
  - ### Gestión de dependencias
  - ### Automatización
  - ### Consistencia entre entornos
- ## Qué no resuelve Terraform por sí solo
  - ### Seguridad
  - ### Calidad de la arquitectura
  - ### Cambios manuales fuera de Terraform
  - ### Costes y disponibilidad
  - ### Errores humanos
- ## Terraform frente a alternativas
  - ### Configuración manual
  - ### Scripts imperativos
  - ### Herramientas de gestión de configuración
  - ### Plantillas nativas de proveedores
  - ### Elegir según el problema
- ## El estado y su importancia
  - ### Qué registra el estado
  - ### Estado local y remoto
  - ### Bloqueo y concurrencia
  - ### Sensibilidad y protección
  - ### Deriva de configuración
- ## Colaboración y flujo de equipo
  - ### Repositorio y ramas
  - ### Revisiones de cambios
  - ### Convenciones
  - ### Separación de entornos
  - ### Módulos compartidos
- ## Seguridad y operación
  - ### Credenciales
  - ### Privilegios mínimos
  - ### Backend y controles
  - ### Registro y auditoría
  - ### Copias de seguridad
  - ### Costes y limpieza
- ## Terraform en CI/CD
  - ### Validaciones automáticas
  - ### Planificación en una pipeline
  - ### Aprobación humana
  - ### Aplicación controlada
  - ### Jenkins y Terraform
- ## Ejemplos conceptuales
  - ### Ejemplo de configuración
  - ### Ejemplo de plan
  - ### Ejemplo de deriva
  - ### Ejemplo de variables
  - ### Ejemplo de módulo
- ## Sesiones prácticas
  - ### Comparar un cambio manual con uno versionado
  - ### Inspeccionar una configuración
  - ### Formatear y validar
  - ### Leer un plan local
  - ### Simular una revisión de código
  - ### Investigar el estado
  - ### Dibujar una arquitectura de equipo
  - ### Proyecto integrador
- ## Preguntas, evaluación y referencia
  - ### Preguntas de repaso
  - ### Ejercicio de decisión
  - ### Rúbrica
  - ### Errores comunes
  - ### Glosario
  - ### Síntesis y entrega

---

## Objetivos y alcance

Esta guía explica el propósito de Terraform antes de centrarse en comandos concretos.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar por qué los equipos describen infraestructura en archivos.
- Diferenciar una configuración declarativa de una secuencia imperativa.
- Describir el papel de un proveedor.
- Distinguir recurso, módulo, variable, salida y estado.
- Explicar para qué sirven `init`, `fmt`, `validate`, `plan` y `apply`.
- Describir por qué un plan debe revisarse antes de aplicarlo.
- Explicar por qué el estado debe protegerse.
- Identificar riesgos de una operación manual.
- Comparar Terraform con scripts y otras herramientas.
- Reconocer cuándo Terraform puede ser útil.
- Reconocer cuándo Terraform no es la herramienta adecuada.
- Describir cómo se integra Terraform en un equipo.
- Identificar controles básicos para una pipeline de infraestructura.
- Practicar los conceptos sin acceder a una cuenta cloud.

### Público y conocimientos previos

Esta página está pensada para estudiantes que conocen, al menos de forma básica:

- El uso de archivos de texto.
- La navegación por un repositorio.
- Conceptos elementales de redes y sistemas.
- La diferencia entre desarrollo y producción.
- El uso de una terminal.
- La lectura de mensajes de error.

No se requiere experiencia previa con Terraform.

### Qué se estudiará

La pregunta principal de la guía es:

> ¿Qué problemas intenta resolver Terraform al gestionar infraestructura?

La respuesta incluye:

- Describir el estado deseado en código.
- Hacer los cambios revisables.
- Calcular un plan antes de realizar cambios.
- Compartir convenciones entre personas y equipos.
- Reducir operaciones manuales inconsistentes.
- Mantener una relación explícita entre configuración y recursos.

### Qué queda fuera

Esta guía no es una receta para desplegar infraestructura de producción.

No incluye:

- Una cuenta de proveedor cloud.
- Credenciales reales.
- Un backend de producción.
- Un ejemplo de despliegue público.
- Una autorización para crear recursos.
- Un procedimiento completo de recuperación.
- Una garantía de que cada cambio sea seguro.
- Una guía específica de arquitectura cloud.
- Una decisión sobre qué proveedor debe elegir un equipo.

### Alcance de las sesiones

Las actividades están diseñadas para que el alumnado pueda practicar conceptos sin tener acceso a servicios cloud.

Los ejercicios pueden usar:

- Un repositorio de ejemplo.
- Una configuración local.
- `terraform_data`, cuando la versión de Terraform lo admita.
- Lectura de planes proporcionados por el docente.
- Diagramas y revisión entre pares.

### Entorno de laboratorio

Antes de ejecutar comandos:

- Confirma que estás en un directorio de práctica.
- Comprueba la configuración que vas a usar.
- No copies credenciales de otra persona.
- No apuntes a un backend desconocido.
- No ejecutes `apply` o `destroy` sobre una cuenta compartida.
- Sigue la política del curso.

---

## El problema que resuelve Terraform

Terraform se entiende mejor al comparar la gestión de infraestructura como código con una serie de acciones manuales.

### Infraestructura configurada manualmente

Supongamos que una persona crea una red mediante una consola web.

Puede que recuerde:

- Qué opción seleccionó.
- Qué nombre asignó.
- Qué rangos de red eligió.
- Qué permisos añadió.
- Qué valores dejó por defecto.

Unas semanas después, otra persona necesita repetir la operación.

Puede que la documentación no contenga todos los detalles.

La consola puede haber cambiado.

Una selección accidental puede generar una diferencia difícil de detectar.

### Conocimiento guardado en la memoria

Cuando las instrucciones viven solo en la memoria de una persona:

- Son difíciles de repetir.
- Son difíciles de revisar.
- Se pierden cuando cambia el equipo.
- Pueden no reflejar el estado real.
- No hay una diferencia automática entre lo esperado y lo existente.

La automatización ayuda a externalizar parte de ese conocimiento.

### Cambios difíciles de repetir

Una operación manual puede requerir muchos pasos:

- Crear un recurso.
- Asignarle un nombre.
- Configurar opciones de red.
- Asociar permisos.
- Habilitar registros.
- Revisar etiquetas.
- Ajustar dependencias.

Una segunda persona podría repetirlos en otro orden o con valores distintos.

Terraform permite expresar buena parte de esa intención mediante configuración versionable.

### Diferencias entre entornos

Un equipo puede mantener desarrollo, prueba y producción.

Sin una estrategia común, los entornos pueden divergir:

- Un puerto está abierto en uno, pero no en otro.
- Una variable no coincide.
- Una política fue modificada solo en producción.
- Un recurso tiene una etiqueta obsoleta.
- Una opción por defecto cambió con el tiempo.

La configuración como código puede ayudar a descubrir y controlar diferencias.

No garantiza que todos los entornos sean idénticos.

### Cambios sin trazabilidad

Si una persona modifica directamente un recurso desde una consola:

- Puede no existir un commit asociado.
- La razón del cambio puede no quedar registrada.
- El cambio puede saltarse una revisión.
- La configuración guardada en Git puede quedar desactualizada.

Terraform proporciona un flujo que conecta configuración, revisión y ejecución.

La trazabilidad depende también de Git, permisos, políticas y registros operativos.

### Múltiples interfaces

Una misma plataforma puede ofrecer:

- Consola web.
- API.
- CLI.
- SDK.
- Herramientas de terceros.

Cada interfaz puede exponer opciones distintas.

La automatización puede reducir la necesidad de repetir cambios a mano en distintas interfaces.

También añade una nueva superficie que hay que proteger: los procesos, credenciales y estados de la herramienta.

### Cambios con dependencias

Algunos recursos dependen de otros.

Por ejemplo:

- Una instancia necesita una red.
- Una regla de acceso necesita un grupo.
- Un servicio depende de una base de datos.
- Un balanceador necesita destinos.

Terraform puede modelar referencias y dependencias para planificar el orden de ciertas operaciones.

No todas las dependencias se detectan automáticamente.

### Cambios con efectos secundarios

Un cambio aparentemente pequeño puede:

- Reemplazar un recurso.
- Interrumpir un servicio.
- Alterar una dirección.
- Cambiar permisos.
- Generar un coste.
- Eliminar datos.

La vista de plan ayuda a revisar algunas de esas consecuencias antes de actuar.

La revisión debe estar a cargo de personas que entiendan el servicio afectado.

### Errores de selección

En una consola, es posible seleccionar por error:

- La cuenta equivocada.
- La región equivocada.
- El proyecto equivocado.
- El entorno equivocado.
- El recurso equivocado.

Una configuración clara y un proceso de ejecución controlado pueden reducir ese riesgo.

No eliminan la posibilidad de seleccionar el workspace, credenciales o backend incorrectos.

### Coordinación de equipos

Varios equipos pueden necesitar modificar infraestructura relacionada.

Sin convenciones comunes, es fácil:

- Crear recursos duplicados.
- Asignar nombres incompatibles.
- Cambiar las mismas opciones por separado.
- Perder de vista quién mantiene cada recurso.
- Repetir soluciones difíciles de mantener.

Terraform puede ayudar a compartir módulos, variables y patrones.

El diseño de ownership y permisos sigue siendo una responsabilidad organizativa.

---

## Infraestructura como código

Infraestructura como código, o IaC, describe recursos y configuración mediante archivos que pueden revisarse y versionarse.

### Configuración declarativa

Una configuración declarativa expresa el resultado deseado.

De forma simplificada, puede indicar:

```text
Debe existir un recurso con estas propiedades.
```

La herramienta compara esa descripción con el estado conocido y calcula acciones posibles.

### Descripción declarativa frente a instrucciones imperativas

Una secuencia imperativa podría decir:

```text
Crea una red.
Luego crea una subred.
Después asocia una regla.
Finalmente etiqueta los recursos.
```

Una descripción declarativa expresa los objetos y sus propiedades.

Terraform calcula parte del orden según las relaciones visibles.

### Declarativo no significa automático ni seguro

Una configuración declarativa no decide por sí sola:

- Si la arquitectura es adecuada.
- Si los permisos son mínimos.
- Si el coste es aceptable.
- Si un cambio necesita aprobación.
- Si el plan afecta a producción.
- Si el recurso se puede interrumpir.

Las personas y las políticas siguen siendo esenciales.

### Código, configuración y documentación

Una configuración de Terraform puede servir como:

- Descripción operativa.
- Registro de intención.
- Fuente revisable de cambios.
- Base para un plan.
- Referencia para el equipo.

No sustituye toda la documentación.

Es posible que hagan falta:

- Diagramas.
- Runbooks.
- Políticas.
- Decisiones arquitectónicas.
- Procedimientos de recuperación.
- Explicaciones de dependencias externas.

### Versionado

Guardar la configuración en un sistema de control de versiones permite:

- Consultar quién propuso un cambio.
- Revisar diferencias.
- Recuperar una versión anterior.
- Relacionar cambios con tickets o decisiones.
- Ejecutar el plan desde un commit concreto.

El control de versiones no impide por sí solo aplicar un cambio inadecuado.

### Revisión por pares

Un cambio IaC puede revisarse antes de aplicarse.

Una revisión debería comprobar:

- Qué recursos se añaden.
- Qué recursos cambian.
- Qué recursos se eliminan.
- Qué variables influyen.
- Qué entorno se seleccionó.
- Si existe impacto de disponibilidad.
- Si los permisos son apropiados.
- Si el coste esperado es aceptable.
- Si el plan corresponde al commit revisado.

### Código ejecutable

Los archivos IaC no son solo documentación pasiva.

Una pipeline puede usarlos para modificar infraestructura.

Por tanto, hay que revisar:

- Quién puede modificarlos.
- Quién puede ejecutarlos.
- Qué credenciales puede usar el job.
- Qué backend selecciona.
- Qué destinos puede alcanzar.
- Qué controles de aprobación aplican.

### Reproducibilidad

La intención de una configuración versionada puede repetirse en distintas ejecuciones.

La reproducibilidad también depende de:

- Versión de Terraform.
- Versiones de proveedores.
- Módulos.
- Variables.
- Backend.
- Estado.
- APIs y servicios externos.
- Configuración del agente.

La frase “está en Git, por tanto es reproducible” es demasiado optimista.

### Cambios explícitos

Un diff de código puede revelar cambios en:

- Valores.
- Nombres.
- Dependencias.
- Versiones.
- Opciones de seguridad.
- Etiquetas.
- Variables.

El plan complementa el diff, porque muestra las acciones calculadas sobre el estado conocido.

### No todo debe convertirse en IaC

Antes de automatizar, pregunta:

- ¿El recurso tiene una API estable?
- ¿Se necesita repetir su configuración?
- ¿Se puede revisar el cambio?
- ¿Quién será responsable del ciclo de vida?
- ¿Hay una herramienta más apropiada?
- ¿La automatización reduce o aumenta el riesgo?
- ¿El equipo puede mantener la solución?

Automatizar algo innecesario también añade mantenimiento.

---

## Qué es Terraform

Terraform es una herramienta que lee archivos de configuración, usa proveedores y compara la configuración con un estado gestionado.

### HashiCorp Configuration Language

Terraform usa HCL, un lenguaje de configuración legible.

Un fragmento sencillo tiene esta forma:

```hcl
resource "terraform_data" "ejemplo" {
  input = {
    nombre = "laboratorio"
  }
}
```

La sintaxis usa bloques, argumentos y expresiones.

Los archivos suelen terminar en `.tf`.

### Bloque `terraform`

El bloque `terraform` puede definir requisitos de versión y configuración de proveedores o backend.

Ejemplo:

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}
```

El rango debe ajustarse a la política del proyecto.

### Proveedores

Un proveedor traduce la configuración de Terraform en operaciones con una plataforma.

Puede interactuar con:

- Un proveedor cloud.
- Una API de DNS.
- Una plataforma de virtualización.
- Un servicio SaaS.
- Un sistema local o de laboratorio.

Los proveedores son plugins y tienen versiones, dependencias y permisos.

### Requisitos de proveedor

Un proyecto puede declarar fuentes y restricciones de versión para proveedores.

Ejemplo conceptual:

```hcl
terraform {
  required_providers {
    ejemplo = {
      source  = "namespace/ejemplo"
      version = "~> 1.0"
    }
  }
}
```

No añadas una fuente de proveedor desconocida a un repositorio compartido.

### Recursos

Los recursos describen objetos que Terraform administra.

La forma general es:

```hcl
resource "TIPO" "NOMBRE" {
  argumento = "valor"
}
```

El tipo depende de un proveedor o de una funcionalidad integrada.

### Datos de entrada

Los bloques `data` consultan información existente mediante un proveedor.

Un bloque de datos no es lo mismo que un recurso administrado.

Las consultas también pueden revelar información y requieren acceso apropiado.

### Variables

Las variables permiten parametrizar una configuración.

Ejemplo:

```hcl
variable "entorno" {
  description = "Nombre del entorno de laboratorio."
  type        = string
  default     = "laboratorio"
}
```

Una variable no se convierte en secreta automáticamente por declararla en Terraform.

### Valores sensibles

Terraform permite marcar ciertos valores como sensibles en determinadas situaciones.

Esa marca puede ayudar a ocultar valores en algunas salidas.

No convierte por sí sola el estado, los planes ni todos los logs en información segura.

### Salidas

Las salidas exponen valores calculados por la configuración.

Ejemplo:

```hcl
output "nombre_entorno" {
  description = "Entorno seleccionado para el ejemplo."
  value       = var.entorno
}
```

No publiques una salida que incluya valores sensibles.

### Módulos

Un módulo agrupa recursos, variables y salidas.

El directorio raíz de un proyecto es un módulo.

Un proyecto puede llamar módulos locales o descargados.

Los módulos reutilizables necesitan versionado y mantenimiento.

### Archivos `.tf`

Terraform combina archivos `.tf` del mismo directorio como parte de la configuración del módulo.

Separar archivos puede mejorar la legibilidad:

```text
main.tf
variables.tf
outputs.tf
versions.tf
```

La separación de archivos no altera por sí sola el comportamiento.

### Archivo de bloqueo

`.terraform.lock.hcl` registra selecciones de proveedores y sumas de comprobación en los contextos compatibles.

En proyectos con proveedores, suele ser importante revisar y versionar el archivo de bloqueo según la política del equipo.

No lo elimines solo porque parezca generado.

### Directorio `.terraform`

`terraform init` crea archivos y datos de trabajo bajo `.terraform`.

Ese directorio suele ser específico del entorno de trabajo.

Normalmente no se versiona.

### Proveedor integrado `terraform_data`

`terraform_data` es un recurso integrado disponible desde Terraform 1.4.

Puede servir para experimentar con el flujo de planificación sin interactuar con una nube.

No representa una máquina virtual, red ni servicio cloud.

---

## Cómo funciona Terraform

El flujo habitual contiene pasos diferenciados. Cada comando tiene un propósito y un nivel de impacto distinto.

### 1. Escribir la configuración

La persona describe los recursos, variables y relaciones.

La configuración debería:

- Tener nombres comprensibles.
- Declarar requisitos relevantes.
- Evitar secretos literales.
- Usar módulos revisados.
- Mantenerse bajo control de versiones.
- Documentar decisiones no evidentes.

### 2. Inicializar el directorio

El comando:

```bash
terraform init
```

prepara el directorio de trabajo.

Según la configuración, puede:

- Descargar proveedores.
- Preparar módulos.
- Configurar el backend.
- Inicializar datos locales de trabajo.

No ejecutes `init` en una configuración desconocida sin revisar qué backend y fuentes usa.

### `terraform init -backend=false`

En un laboratorio que no debe usar un backend remoto se puede usar:

```bash
terraform init -backend=false -input=false
```

Esto desactiva la inicialización del backend para esa operación.

No configura un backend de producción y no debe interpretarse como una receta para cualquier proyecto.

### 3. Formatear

El comando:

```bash
terraform fmt
```

formatea los archivos Terraform.

Puede modificar archivos.

El cambio debe revisarse como cualquier modificación de código.

### Comprobar formato

```bash
terraform fmt -check -recursive
```

Esta forma comprueba el formato sin realizar la corrección automática.

Puede fallar si los archivos necesitan formatearse.

### 4. Validar

```bash
terraform validate
```

Comprueba la consistencia de la configuración en el contexto inicializado.

No demuestra:

- Que la arquitectura sea segura.
- Que el proveedor permita la operación.
- Que el plan sea aceptable.
- Que no haya costes.
- Que el recurso vaya a quedar disponible.
- Que el backend sea el correcto.

### 5. Planificar

```bash
terraform plan
```

Terraform calcula acciones según la configuración, el estado disponible y la información que puede consultar.

El plan puede indicar que Terraform pretende:

- Crear un recurso.
- Actualizar un recurso.
- Eliminar un recurso.
- Reemplazar un recurso.
- No realizar cambios.

El significado exacto depende del proveedor y del recurso.

### Revisar el plan

Antes de aplicar, revisa:

- Entorno.
- Backend.
- Workspaces.
- Credenciales.
- Commit.
- Recursos creados.
- Recursos modificados.
- Recursos eliminados.
- Reemplazos.
- Cambios de permisos.
- Costes posibles.
- Datos expuestos en la salida.

### 6. Aplicar

```bash
terraform apply
```

puede ejecutar cambios sobre infraestructura.

En muchos flujos Terraform muestra un plan y solicita confirmación interactiva, salvo que se use otra modalidad.

La opción `-auto-approve` elimina esa confirmación interactiva.

No uses `-auto-approve` como atajo en una cuenta real sin controles externos aprobados.

### Plan guardado y aplicación

Una persona puede guardar un plan con `-out` y luego aplicarlo mediante un archivo.

Un plan guardado ayuda a asociar la aplicación con un conjunto de acciones concreto, pero debe protegerse.

El archivo puede contener datos sensibles.

### 7. Comprobar el resultado

Después de una aplicación autorizada, se debe comprobar:

- Que el servicio funciona.
- Que los recursos están en el estado esperado.
- Que los cambios respetan los requisitos de seguridad.
- Que los costes son aceptables.
- Que la documentación y las alertas son correctas.
- Que no se necesita una acción de reversión.

### 8. Destruir recursos

```bash
terraform destroy
```

puede eliminar recursos administrados por la configuración.

Su efecto puede ser irreversible o provocar pérdida de datos.

No lo ejecutes como método de limpieza en una cuenta compartida.

La limpieza debe seguir una política explícita y usar el estado correcto.

### Orden de alto nivel

```text
Escribir
  |
  v
Formatear
  |
  v
Inicializar
  |
  v
Validar
  |
  v
Planificar
  |
  v
Revisar y aprobar
  |
  v
Aplicar, si está autorizado
  |
  v
Comprobar y documentar
```

### `plan` no es `apply`

`plan` describe acciones previstas.

`apply` puede llevarlas a cabo.

No confundas “el plan terminó correctamente” con “los cambios se aprobaron” o “los cambios son seguros”.

### Resultados cambiantes

Un plan puede cambiar porque:

- Cambió la configuración.
- Cambió el estado.
- Alguien modificó recursos manualmente.
- Cambió una variable.
- Cambió la versión del proveedor.
- Cambió una API remota.
- Cambió el workspace o backend.
- Cambió la cuenta o región seleccionada.

Relaciona siempre el plan con la configuración y el contexto concretos.

---

## Por qué elegir Terraform

Terraform es útil cuando su modelo encaja con el problema y el equipo puede mantener el flujo.

### Repetibilidad

Una configuración versionada puede ejecutarse de nuevo en condiciones conocidas.

Esto ayuda a reducir diferencias causadas por pasos manuales omitidos.

La repetibilidad depende de:

- Versiones fijadas.
- Variables controladas.
- Estado consistente.
- Fuentes confiables.
- Políticas de ejecución.
- Proveedor y API disponibles.

### Revisión antes del cambio

La combinación de Git, plan y revisión permite examinar el efecto previsto.

Esto puede detectar:

- Una eliminación accidental.
- Un reemplazo inesperado.
- Una región incorrecta.
- Un cambio de tamaño.
- Una regla de red demasiado amplia.
- Una modificación de permisos.
- Un cambio no relacionado con el objetivo.

La revisión humana no debe limitarse a leer el resumen final.

### Colaboración

Terraform permite que distintas personas trabajen sobre una configuración compartida.

El repositorio ayuda a:

- Coordinar propuestas.
- Revisar cambios.
- Resolver conflictos.
- Recuperar versiones.
- Documentar el historial.
- Relacionar infraestructura con decisiones.

El estado remoto y los permisos deben diseñarse para permitir esa colaboración sin escrituras incompatibles.

### Gestión de dependencias

Terraform puede representar dependencias mediante referencias entre recursos.

A partir de esas referencias, puede ordenar ciertas operaciones.

Una dependencia no expresada puede hacer que la configuración sea incompleta.

No uses dependencias explícitas innecesarias para ocultar un diseño confuso.

### Comparación de intención y estado conocido

Terraform utiliza un estado para relacionar configuración y objetos gestionados.

El plan puede mostrar diferencias respecto al estado conocido y a la información obtenida del proveedor.

El estado no es una copia perfecta de todo lo que existe en una plataforma.

### Escalabilidad organizativa

Los equipos pueden reutilizar módulos y convenciones.

Esto puede reducir duplicación de patrones.

Sin gobernanza, también puede propagar errores a muchos proyectos.

### Automatización de comprobaciones

Una pipeline puede ejecutar de forma regular:

- Formato.
- Validación.
- Revisión estática.
- Comprobación de políticas.
- Planificación.
- Revisión de dependencias.

Estas comprobaciones detectan algunas clases de error antes de la aplicación.

### Integración con control de versiones

Un flujo basado en pull requests puede conectar:

- Propuesta.
- Diff.
- Revisiones.
- Plan.
- Aprobación.
- Registro de aplicación.

La conexión entre commit y plan debe mantenerse durante todo el proceso.

### Consistencia entre entornos

Módulos y variables pueden compartir patrones entre entornos.

La reutilización debe preservar diferencias legítimas, como:

- Capacidad.
- Disponibilidad.
- Retención.
- Redes.
- Políticas.
- Costes.
- Requisitos regulatorios.

La meta no es que todo sea idéntico, sino que las diferencias sean intencionales y visibles.

### Documentación viva

La configuración puede ayudar a explicar qué se gestiona.

Una configuración comprensible permite a nuevas personas entender parte de la infraestructura.

Los nombres de recursos por sí solos no explican:

- El motivo de una decisión.
- El propietario del servicio.
- El impacto de una interrupción.
- El procedimiento de recuperación.
- Las políticas que aplican.

### Reducción de pasos manuales

Automatizar pasos repetibles reduce la cantidad de decisiones manuales durante una operación.

También convierte errores de configuración en errores reproducibles.

Por eso se deben probar módulos, planes y pipelines antes de confiar en ellos.

### Auditoría

Git, las revisiones de cambios y los registros de ejecución pueden proporcionar una historia más clara.

La auditoría efectiva requiere:

- Identidades individuales.
- Permisos controlados.
- Retención de logs.
- Asociación a commits.
- Registro del entorno.
- Protección frente a modificaciones no autorizadas.

### Beneficio no automático

Terraform ayuda a estructurar un proceso.

No garantiza que:

- El código sea correcto.
- El plan sea seguro.
- El equipo lo revise bien.
- El estado esté protegido.
- Los costes se controlen.
- El proveedor funcione como se espera.

---

## Qué no resuelve Terraform por sí solo

Terraform es una herramienta, no una política de seguridad ni una revisión arquitectónica.

### Seguridad

Terraform puede expresar configuraciones inseguras.

Por ejemplo:

- Reglas demasiado abiertas.
- Permisos excesivos.
- Cifrado omitido.
- Registros deshabilitados.
- Recursos públicos sin justificación.
- Secretos en variables.
- Roles excesivamente amplios.

La herramienta no decide si esas configuraciones cumplen las políticas de la organización.

### Calidad de arquitectura

Una configuración válida puede representar una arquitectura inadecuada.

`terraform validate` no analiza por completo:

- Capacidad.
- Resiliencia.
- Dependencias de negocio.
- Disponibilidad.
- Recuperación.
- Requisitos regulatorios.
- Coste total.
- Efectos de carga.

### Cambios manuales fuera de Terraform

Una persona puede modificar un recurso directamente en la consola.

Eso puede crear deriva entre la configuración, el estado y el recurso real.

Terraform puede detectar parte de esa diferencia durante una planificación, pero el resultado debe revisarse.

### Errores de proveedor

Un proveedor puede:

- Tener defectos.
- Cambiar comportamiento.
- Gestionar un atributo de forma distinta a la esperada.
- Recibir un cambio incompatible.
- No representar todas las capacidades de una API.

Revisa versiones, cambios y documentación del proveedor.

### Errores de servicio externo

La API del proveedor puede cambiar o no estar disponible.

Terraform depende del servicio y de las credenciales durante ciertas operaciones.

Un fallo de servicio externo no siempre puede resolverse cambiando el código.

### Costes

Terraform puede crear recursos costosos.

No calcula siempre el coste completo de una solución.

Usa políticas y herramientas de estimación aprobadas, además de controles de presupuesto y seguimiento.

### Disponibilidad

Un plan puede reemplazar recursos y provocar interrupciones.

La salida debe evaluarse en relación con:

- Ventanas de cambio.
- Redundancia.
- Capacidad.
- Sesiones activas.
- Datos persistentes.
- Dependencias de servicio.

### Recuperación

Volver a una versión anterior de Git no revierte automáticamente un cambio ya aplicado.

La reversión puede requerir:

- Un plan nuevo.
- Recuperación de datos.
- Reconfiguración de servicios.
- Restauración desde copias.
- Intervención manual.
- Aprobación adicional.

### Errores humanos

Una persona puede seleccionar:

- Cuenta equivocada.
- Workspace equivocado.
- Backend equivocado.
- Directorio equivocado.
- Variables de entorno equivocadas.
- Plan obsoleto.

La automatización debe mostrar el contexto y limitar errores de selección.

### Calidad de entrada

Terraform no puede adivinar si los requisitos que recibió son correctos.

Si las variables, módulos o políticas describen una mala decisión, el resultado puede ser una mala infraestructura con excelente formato.

### Seguridad de credenciales

Terraform no reemplaza el gestor de secretos.

Las credenciales pueden filtrarse mediante:

- Archivos.
- Logs.
- Parámetros.
- Estado.
- Planes.
- Variables de entorno.
- Historial de shell.
- Herramientas de diagnóstico.

### Control de cambios

Una pipeline no constituye una aprobación si cualquiera puede ejecutarla contra cualquier entorno.

Se necesitan políticas de identidad, revisión y autorización.

---

## Terraform frente a alternativas

Terraform no es la única manera de automatizar infraestructura.

### Configuración manual

La consola manual puede ser adecuada para:

- Exploración puntual.
- Diagnóstico.
- Tareas excepcionales y autorizadas.
- Una actividad que no justifique automatización.

Puede ser insuficiente para:

- Cambios repetidos.
- Equipos grandes.
- Entornos múltiples.
- Auditoría rigurosa.
- Revisión de cambios.
- Reproducción consistente.

### Scripts imperativos

Un script puede realizar pasos explícitos mediante CLI o API.

Puede ser adecuado cuando:

- La operación es breve.
- El sistema no necesita modelar estado.
- La secuencia es simple.
- El equipo controla el comportamiento.

Los scripts pueden necesitar resolver:

- Reintentos.
- Dependencias.
- Detección del estado actual.
- Idempotencia.
- Errores parciales.
- Compensación de operaciones.
- Autenticación.
- Paralelismo.

### Herramientas de gestión de configuración

Herramientas de gestión de configuración suelen centrarse en configurar sistemas operativos y aplicaciones existentes.

Pueden gestionar:

- Paquetes.
- Usuarios.
- Archivos.
- Servicios.
- Configuración de máquinas.

Terraform suele centrarse en aprovisionar y relacionar recursos gestionados por proveedores.

Los límites se solapan.

### Herramientas nativas de proveedores

Algunos proveedores ofrecen sus propias herramientas declarativas.

Pueden aportar integración estrecha con una plataforma concreta.

La elección depende de:

- Portabilidad.
- Capacidades específicas.
- Gobernanza.
- Habilidades del equipo.
- Operación.
- Ecosistema.
- Requisitos regulatorios.

### Kubernetes y herramientas de plataforma

Un recurso de plataforma puede administrarse con Terraform, herramientas nativas del sistema o controladores declarativos específicos.

No asumas que Terraform debe administrar todos los objetos de una plataforma.

Un diseño puede separar el aprovisionamiento del clúster y la configuración de aplicaciones.

### Elegir según el problema

Pregunta:

- ¿Qué recursos se administran?
- ¿Qué herramienta conocen los responsables?
- ¿Qué formato ofrece el proveedor?
- ¿Cómo se gestiona el estado?
- ¿Cómo se revisan los cambios?
- ¿Qué integración tiene la API?
- ¿Qué riesgos de bloqueo tecnológico existen?
- ¿Qué herramienta podrá mantenerse en varios años?

### Combinación de herramientas

Un equipo puede usar:

- Terraform para recursos de infraestructura.
- Ansible para configuración de sistemas.
- Jenkins para orquestar pipelines.
- Git para revisar cambios.
- Herramientas de políticas para comprobar cumplimiento.
- Herramientas nativas para operaciones específicas.

La combinación debe tener límites claros para evitar que dos herramientas gestionen el mismo objeto de forma contradictoria.

---

## El estado y su importancia

El estado es una pieza central del flujo de Terraform y requiere protección.

### Qué registra el estado

El estado puede contener:

- Identificadores de recursos.
- Atributos.
- Relaciones.
- Datos devueltos por proveedores.
- Valores de variables.
- Información sensible.
- Metadatos de gestión.

El contenido concreto depende de la configuración y del proveedor.

### Estado local

De forma predeterminada, Terraform puede utilizar un archivo local de estado.

Ese archivo suele llamarse:

```text
terraform.tfstate
```

Un archivo local es fácil de perder, copiar o sobrescribir.

No se recomienda compartirlo manualmente entre varias personas.

### Estado remoto

Un backend remoto puede permitir:

- Acceso común controlado.
- Bloqueo.
- Recuperación.
- Cifrado.
- Auditoría.
- Copias de seguridad.
- Coordinación entre equipos.

Estas capacidades dependen del backend y de su configuración.

### Bloqueo de estado

El bloqueo puede impedir determinadas escrituras concurrentes sobre el mismo estado.

Reduce el riesgo de que dos operaciones lo modifiquen de forma incompatible.

No todos los backends ofrecen idénticos mecanismos.

### Concurrencia

Si dos personas ejecutan cambios sobre el mismo estado al mismo tiempo, puede haber conflicto.

La política de ejecución debe impedir o coordinar esa concurrencia.

### Estado no es una copia de seguridad

El archivo de estado no equivale a una copia completa de todos los datos de la infraestructura.

No sustituye copias de seguridad de bases de datos, discos o aplicaciones.

### Estado no es configuración

La configuración declara intención.

El estado registra la relación entre Terraform y objetos gestionados.

No almacenes la única copia de la configuración dentro del estado.

### Proteger el estado

Una política debe considerar:

- Cifrado en tránsito.
- Cifrado en reposo.
- Acceso por identidad.
- Acceso por entorno.
- Registros.
- Copias de seguridad.
- Recuperación.
- Retención.
- Bloqueo.
- Eliminación segura.

### No versionar el estado por defecto

No confirmes en Git:

```text
terraform.tfstate
terraform.tfstate.*
```

El estado puede incluir información sensible y puede cambiar con cada operación.

### Planes guardados

Los archivos de plan también pueden ser sensibles.

No los publiques ni adjuntes sin un proceso de revisión y acceso controlado.

### Estado remoto mal configurado

Un backend mal elegido o mal configurado puede hacer que una ejecución afecte a otro entorno.

Antes de ejecutar, confirma:

- Organización.
- Cuenta.
- Proyecto.
- Región.
- Backend.
- Workspace.
- Identidad.
- Revisión.
- Variables.

---

## Deriva de configuración

La deriva ocurre cuando el estado real cambia fuera del flujo habitual de Terraform.

### Ejemplo de deriva

La configuración espera que una opción esté deshabilitada.

Una persona la cambia manualmente en la consola.

La configuración de Git no refleja ese cambio.

El estado local de Terraform puede no conocerlo hasta que se haga una operación de refresco o planificación pertinente.

### Causas de deriva

Puede aparecer cuando:

- Una persona cambia la consola.
- Otra herramienta administra el mismo recurso.
- Un proceso automático externo actúa.
- Una recuperación modifica recursos.
- Un proveedor cambia valores.
- La configuración fue modificada sin actualizar el repositorio.

### Detectar deriva

Una planificación puede mostrar diferencias entre la configuración, el estado y lo observado por el proveedor.

La información disponible depende del recurso, el proveedor y la operación.

### Gestionar la deriva

Antes de corregirla:

1. Identifica el recurso afectado.
2. Comprueba quién hizo el cambio.
3. Determina si el cambio era intencional.
4. Evalúa el impacto de restaurar la configuración anterior.
5. Actualiza el código o el recurso según la decisión.
6. Revisa el plan.
7. Registra la decisión.

### No aceptar o sobrescribir automáticamente

Un cambio manual puede haber sido:

- Una emergencia.
- Una mitigación.
- Una corrección temporal.
- Un error.
- Una excepción aprobada.

No lo reviertas sin entender el contexto.

### Evitar dos fuentes de verdad

Si Terraform y otro sistema gestionan el mismo campo de un recurso, pueden entrar en conflicto.

Define quién administra cada recurso y cada atributo relevante.

---

## Colaboración y flujo de equipo

Un flujo de equipo necesita convenciones, revisión y control de cambios.

### Repositorio

El repositorio puede organizarse por:

- Servicio.
- Equipo.
- Entorno.
- Plataforma.
- Módulo reutilizable.

La estructura debe reflejar ownership y ciclo de vida.

### Ramas

Una rama de trabajo permite proponer un cambio separado de la rama principal.

La estrategia exacta depende del equipo.

Evita ejecutar cambios de producción desde una rama no revisada.

### Pull request

Una revisión de cambios puede examinar:

- Diff de Terraform.
- Variables.
- Módulos.
- Proveedor.
- Plan.
- Impacto.
- Coste.
- Seguridad.
- Pruebas.

La persona revisora necesita contexto, no solo un indicador verde.

### Asociación de plan y commit

El plan debe corresponder a la configuración revisada.

Si cambia el commit después del plan, puede ser necesario volver a generarlo.

No apliques un plan obsoleto sin confirmar su relación con el código y el estado.

### Convenciones de nombres

Las convenciones pueden facilitar:

- Búsqueda.
- Ownership.
- Cost allocation.
- Inventario.
- Organización de recursos.
- Revisión.

No introduzcas datos personales innecesarios en nombres.

### Variables por entorno

Variables diferentes pueden representar:

- Región.
- Tamaño.
- Número de réplicas.
- Retención.
- Tipo de almacenamiento.

No uses una única variable para esconder diferencias importantes entre entornos.

### Variables sensibles

Los valores sensibles deben llegar al proceso mediante el mecanismo aprobado.

No deben estar en archivos de variables versionados.

### Archivos de variables

Un archivo de variables puede contener:

- Valores de despliegue.
- Selección de entorno.
- Datos sensibles.

Define cuáles se versionan y cuáles se generan o se gestionan aparte.

### Módulos

Un módulo ayuda a reutilizar una estructura.

Debe tener:

- Interfaz clara.
- Variables documentadas.
- Versionado.
- Pruebas.
- Ownership.
- Compatibilidad.
- Proceso de cambio.

Un módulo compartido puede propagar un error a muchos equipos.

### Revisar módulos

Antes de consumir un módulo:

- Comprueba su origen.
- Revisa la versión.
- Examina cambios.
- Verifica las variables.
- Revisa salidas.
- Comprueba recursos creados.
- Evalúa permisos y efectos.
- Confirma su mantenimiento.

### Separar responsabilidades

Define quién:

- Propone cambios.
- Revisa el código.
- Aprueba el plan.
- Ejecuta la aplicación.
- Administra el backend.
- Responde a incidentes.
- Mantiene los módulos.
- Controla costes.

### Cambios de emergencia

Una operación urgente puede requerir un flujo distinto.

Debe tener:

- Autorización adecuada.
- Registro de la decisión.
- Gestión de riesgos.
- Actualización posterior del código.
- Revisión de deriva.
- Seguimiento del impacto.

---

## Seguridad y operación

Terraform administra recursos mediante identidades y APIs con privilegios significativos.

### Credenciales

Las credenciales pueden habilitar cambios amplios.

No las guardes:

- En archivos `.tf`.
- En archivos `*.tfvars` confirmados.
- En `Jenkinsfile`.
- En la URL de un repositorio.
- En logs.
- En parámetros visibles.
- En el historial del shell.

### Mínimo privilegio

La identidad usada por Terraform debe tener solo los permisos necesarios para su tarea y entorno.

Evita usar:

- Cuentas personales con permisos administrativos.
- Credenciales compartidas sin control.
- Roles globales cuando basta un alcance menor.
- La misma identidad para desarrollo y producción sin justificación.

### Credenciales temporales

Cuando una plataforma permita identidades temporales o federadas, el equipo puede preferirlas a claves permanentes.

El método debe ser configurado por la organización.

No improvises autenticación desde una pipeline de práctica.

### Backend y permisos

Limita quién puede:

- Leer estado.
- Escribir estado.
- Bloquear o desbloquear.
- Restaurar versiones.
- Cambiar el backend.
- Acceder a planes.

Los permisos de estado son parte del modelo de seguridad.

### Logs

Los logs ayudan a diagnosticar, pero pueden revelar:

- Valores de recursos.
- IDs.
- Rutas.
- Direcciones.
- Variables.
- Respuestas de APIs.
- Mensajes de proveedor.

Conserva solo lo necesario y protege su acceso.

### Planes y salidas

Un plan detallado puede mostrar configuraciones que no deberían divulgarse.

Revisa quién puede:

- Verlo.
- Descargarlo.
- Conservarlo.
- Compartirlo.
- Aplicarlo.

### Políticas automáticas

Las políticas pueden impedir cambios que incumplan requisitos.

Pueden comprobar, por ejemplo:

- Etiquetas obligatorias.
- Regiones permitidas.
- Cifrado.
- Exposición pública.
- Tipos de recursos.
- Tamaños máximos.
- Nombres.

Una política debe mantenerse, probarse y explicarse.

### Escaneo estático

Las herramientas de análisis estático pueden encontrar ciertos patrones de riesgo.

No reemplazan:

- Revisión del plan.
- Revisión arquitectónica.
- Pruebas.
- Políticas organizativas.
- Análisis de permisos.
- Revisión de proveedores.

### Costes

Los recursos pueden generar costes por:

- Uso.
- Almacenamiento.
- Transferencia.
- Licencias.
- Reservas.
- Servicios auxiliares.
- Recursos olvidados.

Define presupuestos, alertas y ownership.

### Etiquetas de costes

Las etiquetas pueden facilitar la asignación de costes.

Define convenciones para:

- Servicio.
- Equipo.
- Entorno.
- Centro de coste.
- Propietario técnico.

No incluyas datos personales sensibles.

### Disponibilidad y mantenimiento

Los cambios pueden necesitar:

- Ventana de mantenimiento.
- Comunicación con usuarios.
- Plan de reversión.
- Comprobación posterior.
- Seguimiento de métricas.
- Revisión de dependencias.

### Copias de seguridad

El backend y el estado requieren un proceso de recuperación.

Los datos de aplicación también requieren sus propias copias.

No supongas que restaurar estado restaura la infraestructura o los datos.

### Registro de auditoría

Un registro útil puede relacionar:

- Identidad.
- Job.
- Commit.
- Plan.
- Aprobación.
- Entorno.
- Resultado.
- Hora.
- Cambios aplicados.

Los registros deben protegerse contra alteración y acceso no autorizado.

### Acceso a la pipeline

Limita quién puede:

- Cambiar la definición del job.
- Cambiar el `Jenkinsfile`.
- Elegir credenciales.
- Seleccionar un entorno.
- Aplicar un plan.
- Cambiar variables.
- Aprobar una ejecución.

La seguridad de la pipeline depende también de los permisos del repositorio.

---

## Terraform en CI/CD

Una pipeline puede automatizar comprobaciones y facilitar revisiones.

### Validaciones automáticas

Una pipeline de validación puede ejecutar:

```text
terraform fmt -check
terraform init
terraform validate
análisis estático aprobado
comprobaciones de políticas
```

Estas operaciones no equivalen automáticamente a aplicar infraestructura.

`init` puede descargar proveedores o preparar un backend, por lo que debe configurarse con conocimiento del proyecto.

### Planificación en una pipeline

Una pipeline puede generar un plan para revisarlo.

Antes de ejecutar, confirma:

- Cuenta.
- Entorno.
- Backend.
- Workspace.
- Credenciales.
- Commit.
- Versión.
- Variables.

### Plan visible en pull request

Algunos sistemas presentan el plan junto a una revisión de código.

Ese resultado puede ayudar a las personas revisoras.

Hay que protegerlo como dato potencialmente sensible.

### Aprobación humana

Una aprobación debería corresponder a:

- Un commit concreto.
- Un plan concreto.
- Un entorno concreto.
- Una identidad autorizada.
- Un conjunto de cambios revisado.

Si el código cambia, el plan anterior puede dejar de representar la propuesta.

### Aplicación controlada

En un entorno real, la aplicación puede requerir:

- Rama protegida.
- Revisiones obligatorias.
- Credenciales temporales.
- Backend remoto.
- Bloqueo.
- Aprobación.
- Límites de concurrencia.
- Ventana de cambio.
- Registro.
- Verificación posterior.

### Jenkins y Terraform

Jenkins puede:

- Obtener el repositorio.
- Seleccionar un agente.
- Ejecutar Terraform.
- Presentar logs.
- Esperar aprobación.
- Archivar resultados autorizados.
- Registrar el estado de la ejecución.

Jenkins no protege automáticamente el estado ni decide si una identidad tiene permisos suficientes.

### Agente de Terraform

El agente debería tener:

- Versión controlada.
- Herramientas verificadas.
- Acceso limitado al repositorio.
- Credenciales solo durante el tiempo necesario.
- Workspace gestionado.
- Aislamiento apropiado.
- Salida de red aprobada.
- Procedimiento de actualización.

### No ejecutar desde el controlador sin revisar

El agente de build puede ejecutar código del repositorio.

En muchos diseños conviene separar esa ejecución del controlador Jenkins.

Sigue la arquitectura aprobada por el administrador.

### Pipeline de solo validación

Un primer pipeline puede limitarse a:

- Comprobar formato.
- Inicializar sin backend real, si corresponde.
- Validar.
- Ejecutar análisis estático.
- Generar un plan en un entorno de laboratorio sin credenciales.

La validez de `-backend=false` depende del diseño y no es un sustituto de la configuración de producción.

### Pipeline de aplicación

Una pipeline de aplicación tiene mayor impacto.

No la construyas añadiendo simplemente:

```text
terraform apply -auto-approve
```

Se necesita un diseño completo de identidad, revisión, estado, aprobación, límites y recuperación.

---

## Ejemplos conceptuales

Los siguientes ejemplos explican ideas; no configuran infraestructura cloud.

### Ejemplo de configuración local

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "laboratorio" {
  input = {
    nombre   = "prueba"
    entorno  = "laboratorio"
    proposito = "aprender el flujo de planificacion"
  }
}

output "entorno" {
  description = "Entorno de la actividad."
  value       = terraform_data.laboratorio.output.entorno
}
```

Este ejemplo requiere una versión compatible con `terraform_data`.

No crea una máquina, red ni servicio externo.

### Inspeccionar formato

```bash
terraform fmt -check -recursive
```

Si falla, se puede corregir el formato con:

```bash
terraform fmt -recursive
```

Después, revisa el diff.

### Inicializar en laboratorio

```bash
terraform init -backend=false -input=false
```

La opción de backend es apropiada para un ejercicio que no debe conectarse a estado remoto.

### Validar

```bash
terraform validate
```

Valida la configuración en el contexto inicializado.

### Generar un plan

```bash
terraform plan -input=false
```

Revisa la salida antes de cualquier acción posterior.

En esta práctica no se ejecuta `apply`.

### Ejemplo conceptual de plan

Un plan puede resumir acciones de forma parecida a:

```text
Plan: 1 to add, 0 to change, 0 to destroy.
```

El formato exacto cambia según versión y proveedor.

Ese resumen no basta para aprobar.

Hay que inspeccionar los detalles de cada acción.

### Marcas de plan

En muchos planes se muestran símbolos como:

- `+` para añadir.
- `~` para actualizar.
- `-` para eliminar.
- `-/+` para reemplazar, en ciertos formatos.
- `<=` para leer datos, según el contexto.

Confirma el significado en la salida de tu versión.

### Ejemplo de pregunta de revisión

Antes de aprobar un plan, pregunta:

- ¿Qué se crea?
- ¿Qué se cambia?
- ¿Qué se elimina?
- ¿Hay reemplazos?
- ¿A qué entorno corresponde?
- ¿Qué coste puede generar?
- ¿Qué permisos necesita?
- ¿El plan corresponde al último commit?

### Ejemplo de deriva

Configuración versionada:

```hcl
resource "terraform_data" "ejemplo" {
  input = "valor-declarado"
}
```

Estado real observado:

```text
El objeto fue modificado fuera del flujo habitual.
```

Una futura planificación puede detectar diferencias según los datos disponibles.

La acción correcta depende de si el cambio manual era intencional.

### Ejemplo de variable no secreta

```hcl
variable "entorno" {
  description = "Nombre del entorno."
  type        = string
  default     = "laboratorio"
}
```

La variable evita repetir el mismo valor en múltiples lugares.

No debe confundirse con una credencial.

### Ejemplo de salida

```hcl
output "entorno_actual" {
  description = "Entorno utilizado por la práctica."
  value       = var.entorno
}
```

Las salidas pueden aparecer en la consola.

No publiques valores sensibles como salidas.

### Ejemplo de módulo conceptual

```text
root/
├── main.tf
├── variables.tf
└── modules/
    └── componente/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

Un módulo local se mantiene dentro del repositorio.

Un módulo remoto debe tener origen, versión y mantenimiento revisados.

### Ejemplo de flujo de revisión

```text
Propuesta de código
        |
        v
Revisión del diff
        |
        v
Validaciones automáticas
        |
        v
Plan asociado al commit
        |
        v
Revisión del plan
        |
        v
Aprobación apropiada
        |
        v
Aplicación autorizada
        |
        v
Comprobación posterior
```

Este esquema describe un proceso conceptual.

No autoriza a aplicar cambios reales.

---

## Sesiones prácticas

Las sesiones permiten aprender por observación, comparación y revisión sin una cuenta cloud.

### Preparación común

Antes de empezar:

- Usa un directorio de laboratorio.
- Comprueba la versión de Terraform.
- No configures un proveedor cloud.
- No añadas credenciales.
- No inicialices un backend desconocido.
- No ejecutes `apply`.
- No ejecutes `destroy`.
- Anota los comandos y resultados.
- Revisa los archivos antes de confirmarlos.
- Consulta al docente si aparece un destino externo.

### Sesión 1: inventariar operaciones manuales

**Objetivo:** identificar dónde puede perderse información al crear infraestructura manualmente.

#### Actividad

Imagina que un equipo crea un entorno de pruebas desde una consola.

Escribe diez decisiones que tendría que tomar.

Incluye, por ejemplo:

- Nombre.
- Región.
- Red.
- Acceso.
- Capacidad.
- Etiquetas.
- Registro.
- Retención.
- Propietario.
- Coste.

#### Preguntas

- ¿Qué decisiones quedarían registradas?
- ¿Cuáles podrían olvidarse?
- ¿Qué tendría que saber otra persona para repetirlo?
- ¿Qué podría salir mal si se omite un paso?

#### Entregable

Entrega una lista de decisiones y una explicación de qué información convendría versionar.

### Sesión 2: construir un procedimiento manual

**Objetivo:** practicar la documentación de una operación antes de automatizarla.

#### Instrucciones

1. Escoge una actividad ficticia de laboratorio.
2. Escríbela como una secuencia de pasos manuales.
3. Indica entradas y resultados.
4. Añade precondiciones.
5. Añade comprobaciones posteriores.
6. Marca los pasos que dependen de una persona.
7. No conectes con una plataforma real.

#### Preguntas

- ¿Qué pasos son ambiguos?
- ¿Qué pasos se repiten?
- ¿Qué resultado debería ser verificable?
- ¿Qué datos no conviene poner en el documento?

### Sesión 3: convertir intención en declaraciones

**Objetivo:** diferenciar una descripción de estado de una secuencia de acciones.

#### Actividad

Convierte estas instrucciones en una descripción conceptual:

```text
Crea un elemento de laboratorio.
Asigna un nombre.
Indica su propósito.
Comprueba el resultado.
```

No necesitas escribir un recurso de proveedor.

#### Discusión

- ¿Qué datos describen el estado deseado?
- ¿Qué datos son solo pasos de procedimiento?
- ¿Qué parte debería convertirse en una variable?
- ¿Qué parte debe seguir siendo documentación?

### Sesión 4: leer un archivo Terraform

**Objetivo:** identificar bloques y argumentos.

Usa este ejemplo:

```hcl
terraform {
  required_version = ">= 1.4.0, < 2.0.0"
}

resource "terraform_data" "laboratorio" {
  input = {
    nombre  = "prueba"
    entorno = "laboratorio"
  }
}

output "nombre_entorno" {
  value = terraform_data.laboratorio.output.entorno
}
```

#### Instrucciones

1. Identifica el bloque `terraform`.
2. Identifica el requisito de versión.
3. Identifica el tipo de recurso.
4. Identifica el nombre local del recurso.
5. Identifica los datos de entrada.
6. Identifica la salida.
7. Explica por qué no se crea una máquina virtual.

### Sesión 5: crear un directorio seguro

**Objetivo:** trabajar con Terraform sin proveedor cloud.

#### Instrucciones

1. Crea un directorio temporal de laboratorio.
2. Confirma que no contiene archivos de otro proyecto.
3. Guarda el ejemplo con `terraform_data`.
4. Comprueba la versión disponible.
5. No copies credenciales al directorio.
6. Anota la ruta de trabajo sin publicarla si es interna.

### Sesión 6: ejecutar `terraform fmt`

**Objetivo:** observar el formato estándar.

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
2. Examina qué archivo cambió.
3. Revisa el diff.
4. Ejecuta la comprobación.
5. Explica la diferencia entre formatear y validar.

### Sesión 7: ejecutar `terraform validate`

**Objetivo:** comprender el alcance de la validación.

#### Instrucciones

1. Inicializa el directorio de laboratorio sin backend.
2. Ejecuta `terraform validate`.
3. Registra el resultado.
4. En una copia, introduce un error sintáctico controlado.
5. Ejecuta de nuevo.
6. Compara los mensajes.
7. Restaura la configuración.

#### Preguntas

- ¿Qué comprobó Terraform?
- ¿Qué no comprobó?
- ¿La validación demuestra que el plan será aceptable?

### Sesión 8: inspeccionar un plan local

**Objetivo:** practicar lectura de acciones previstas.

#### Comandos

```bash
terraform init -backend=false -input=false
```

```bash
terraform plan -input=false
```

#### Instrucciones

1. Ejecuta solo en el directorio local del ejercicio.
2. Lee el resumen.
3. Identifica acciones de creación, cambio o destrucción.
4. Explica qué objeto se representa.
5. No continúes a `apply`.
6. Cierra el ejercicio con una nota sobre su alcance local.

### Sesión 9: comparar dos configuraciones

**Objetivo:** relacionar un diff de código con un plan.

#### Instrucciones

1. Guarda una copia de la configuración inicial.
2. Cambia un valor no sensible.
3. Revisa el diff de Git.
4. Ejecuta `terraform plan`.
5. Describe la relación entre el cambio de texto y el cambio previsto.
6. No apliques los cambios.

### Sesión 10: reconocer reemplazos

**Objetivo:** identificar por qué un plan puede tener más impacto del esperado.

#### Actividad

El docente proporciona una salida de plan ficticia que incluye un reemplazo.

#### Instrucciones

1. Busca el recurso afectado.
2. Identifica qué atributo fuerza o acompaña el reemplazo.
3. Explica qué posible interrupción implicaría en un caso real.
4. Indica qué preguntas harías antes de aprobarlo.
5. No ejecutes el ejemplo.

### Sesión 11: revisar una salida de plan

**Objetivo:** redactar una revisión breve.

#### Plantilla

```text
Commit:
Entorno:
Backend:
Recursos a crear:
Recursos a modificar:
Recursos a eliminar:
Reemplazos:
Riesgos:
Preguntas pendientes:
Decisión:
```

#### Instrucciones

1. Usa una salida ficticia proporcionada por el curso.
2. No inventes una aprobación.
3. Separa hechos y supuestos.
4. Indica qué información falta.
5. Explica qué persona debería revisar el cambio.

### Sesión 12: investigar el estado

**Objetivo:** entender qué representa el estado sin compartir un estado real.

#### Actividad

1. Lee una descripción proporcionada por el docente.
2. Identifica los tipos de dato que podría guardar el estado.
3. Marca los datos potencialmente sensibles.
4. Propón controles de acceso.
5. Explica por qué el estado no se confirma en Git.
6. No abras ni compartas un estado de producción.

### Sesión 13: simular una deriva

**Objetivo:** discutir cambios externos a Terraform.

#### Escenario

Un recurso fue cambiado manualmente durante una intervención urgente.

La configuración versionada no contiene ese cambio.

#### Preguntas

- ¿El cambio fue autorizado?
- ¿Hay un ticket o registro?
- ¿Se debe conservar la modificación?
- ¿Qué actualizarías: recurso, configuración o ambas?
- ¿Qué riesgo hay en restaurar automáticamente el valor anterior?
- ¿Qué revisarías antes de generar un plan?

#### Entregable

Escribe un procedimiento de decisión, no un comando de aplicación.

### Sesión 14: debatir módulos

**Objetivo:** evaluar cuándo compartir una abstracción.

#### Actividad

Un equipo crea un módulo para una configuración que otros tres equipos podrían usar.

Debatid:

- Qué entradas necesita.
- Qué valores deberían tener defaults.
- Qué salidas hacen falta.
- Cómo se versiona.
- Quién mantiene el módulo.
- Cómo se prueban cambios incompatibles.
- Qué riesgos tendría un error propagado.

### Sesión 15: comparar herramientas

**Objetivo:** escoger una herramienta según la tarea.

Clasifica estos ejemplos de manera razonada:

- Crear redes.
- Configurar paquetes en servidores existentes.
- Ejecutar una operación puntual mediante una API.
- Desplegar una aplicación en un clúster.
- Configurar un recurso exclusivo de un proveedor.
- Repetir una configuración de máquinas.

#### Entregable

Para cada caso, indica:

- Herramienta candidata.
- Motivo.
- Riesgo.
- Información adicional necesaria.

No hay una respuesta única para todos los escenarios.

### Sesión 16: diseñar un flujo de equipo

**Objetivo:** relacionar código, plan y aprobación.

#### Actividad

Dibuja un proceso que incluya:

- Propuesta.
- Revisión de código.
- Validaciones.
- Plan.
- Revisión del plan.
- Aprobación.
- Aplicación autorizada.
- Comprobación posterior.
- Registro.

#### Preguntas

- ¿Quién puede aprobar?
- ¿Qué datos necesita esa persona?
- ¿Qué ocurre si el código cambia después del plan?
- ¿Cómo se demuestra qué commit se aplicó?

### Sesión 17: analizar un backend

**Objetivo:** identificar requisitos de estado remoto.

El docente presenta una descripción ficticia de backend.

#### Instrucciones

1. Identifica quién puede leer.
2. Identifica quién puede escribir.
3. Identifica si hay bloqueo.
4. Identifica cómo se cifra.
5. Identifica cómo se recupera.
6. Identifica qué logs existen.
7. No configures un backend real.

### Sesión 18: encontrar riesgos en un pipeline

**Objetivo:** analizar un flujo peligroso.

Revisa este diseño conceptual:

```text
Cualquier rama
  |
  v
Credencial administrativa permanente
  |
  v
terraform apply -auto-approve
  |
  v
Producción
```

#### Preguntas

- ¿Quién puede modificar el código?
- ¿Qué revisión existe?
- ¿Qué limita los permisos?
- ¿Cómo se verifica el entorno?
- ¿Qué plan se aplica?
- ¿Qué registro queda?
- ¿Qué pasa ante un cambio accidental?
- ¿Qué controles deberían añadirse?

No ejecutes un pipeline de este tipo.

### Sesión 19: construir una pipeline de validación

**Objetivo:** especificar comprobaciones sin aplicar infraestructura.

#### Actividad

Escribe una lista de etapas para una pipeline de validación:

1. Checkout.
2. Versión.
3. Formato.
4. Inicialización apropiada.
5. Validación.
6. Análisis estático aprobado.
7. Plan de laboratorio o revisión controlada.

#### Entregable

Justifica por qué cada etapa está en ese orden.

No añadas credenciales cloud ni `apply`.

### Sesión 20: revisión por parejas

**Objetivo:** evaluar una configuración y un plan ficticios.

La persona autora explica:

- Qué problema intenta resolver.
- Qué recursos administra.
- Qué backend usaría.
- Qué riesgos identifica.
- Qué personas deberían revisar.
- Qué debería ocurrir antes de aplicar.

La persona revisora comprueba:

- Nombres claros.
- Variables justificadas.
- Versiones controladas.
- Módulos revisados.
- Estado protegido.
- Plan asociado al commit.
- Impacto y costes considerados.
- Ausencia de secretos en código.

### Sesión 21: preparar un ADR breve

**Objetivo:** documentar una decisión sobre Terraform.

Escribe un registro de decisión con:

```text
Título:
Contexto:
Opciones consideradas:
Decisión:
Motivos:
Riesgos:
Consecuencias:
Revisión futura:
```

#### Actividad

Describe por qué un equipo usaría Terraform para un conjunto de recursos y no para toda su plataforma.

Incluye al menos una limitación.

### Sesión 22: ejercicio de coste y ownership

**Objetivo:** entender que un recurso también necesita responsable.

#### Actividad

Para un proyecto ficticio, define:

- Propietario técnico.
- Equipo de soporte.
- Entorno.
- Etiquetas de coste.
- Presupuesto.
- Alertas.
- Fecha de revisión.
- Procedimiento de limpieza.

#### Preguntas

- ¿Quién detecta recursos olvidados?
- ¿Quién paga el coste?
- ¿Quién decide su eliminación?
- ¿Qué recurso podría tener datos que no deben borrarse?

### Sesión 23: ejercicio de recuperación

**Objetivo:** distinguir restaurar código de recuperar un servicio.

#### Escenario

Un cambio aplicado provoca un problema de disponibilidad.

#### Preguntas

- ¿Revertir Git revierte automáticamente la infraestructura?
- ¿El plan de reversión crea otra modificación?
- ¿Hay datos persistentes?
- ¿Se requiere restaurar una copia de seguridad?
- ¿Quién autoriza la acción?
- ¿Cómo se verifica la recuperación?

#### Entregable

Redacta una lista de comprobaciones previas a una reversión.

### Sesión 24: redactar una política de laboratorio

**Objetivo:** establecer límites claros para el uso académico.

Incluye reglas sobre:

- Cuentas.
- Credenciales.
- Backends.
- Proveedores.
- Costes.
- Planes.
- Aplicaciones.
- Destrucciones.
- Almacenamiento de estado.
- Registro de resultados.
- Supervisión docente.

### Sesión 25: proyecto integrador

**Objetivo:** demostrar comprensión del propósito y los límites de Terraform.

#### Requisitos

- Un diagrama de flujo.
- Una configuración local de laboratorio.
- Una validación de formato.
- Una validación de sintaxis.
- Un plan no aplicado.
- Una revisión escrita del plan.
- Un análisis breve del estado.
- Una comparación con otra herramienta.
- Una propuesta de controles para producción.
- Ninguna credencial real.
- Ninguna aplicación de infraestructura cloud.

#### Entrega

Incluye:

- Archivos de laboratorio.
- Versión de Terraform utilizada.
- Comandos ejecutados.
- Resumen del plan.
- Revisión de cambios.
- Riesgo identificado.
- Decisión razonada de no aplicar.
- Limitaciones del ejemplo.
- Una pregunta pendiente para el equipo de plataforma.

---

## Errores comunes

### “Terraform automatiza, así que es seguro”

Automatizar hace que una operación pueda repetirse.

También puede repetir rápidamente un error.

### “Si `validate` pasa, el diseño es correcto”

`validate` comprueba coherencia estructural.

No revisa todos los requisitos de seguridad, disponibilidad o coste.

### “Si `plan` pasa, ya se puede aplicar”

Un plan correcto a nivel técnico puede ser inaceptable por impacto, permisos, coste o calendario.

### “El estado solo contiene nombres de recursos”

El estado puede contener valores sensibles y atributos detallados.

### “El estado se puede guardar en Git”

El estado puede ser sensible, mutable y compartido de forma insegura mediante Git.

### “Una etiqueta sensible protege el valor en todas partes”

Una marca de sensibilidad no convierte todos los archivos, planes y logs en seguros.

### “El plan es solo texto”

Un plan guardado puede ser un archivo binario con datos importantes.

### “Volver a Git revierte la infraestructura”

Git revierte archivos.

No ejecuta por sí mismo un cambio inverso sobre recursos ya aplicados.

### “Una consola manual siempre es peor”

La consola puede ser apropiada para exploración o diagnóstico autorizado.

El problema aparece cuando cambios importantes no se registran, revisan o reproducen.

### “Todo recurso debe administrarse con Terraform”

Administrar con Terraform requiere ownership y mantenimiento.

Si otra herramienta es más adecuada o ya administra el recurso, añadir Terraform puede crear conflictos.

### “El proveedor aplica siempre exactamente lo que dice el código”

Los proveedores tienen versiones y limitaciones.

La API puede producir comportamientos distintos a los esperados.

### “El plan no tiene coste”

La planificación puede consultar APIs y requerir operaciones, permisos o límites.

El coste depende del proveedor y del servicio.

### “El bloqueo de estado resuelve todos los conflictos”

El bloqueo ayuda con operaciones concurrentes sobre estado.

No impide cambios manuales, permisos incorrectos ni errores de arquitectura.

### “Un módulo reutilizable siempre es mejor”

Un módulo puede añadir abstracción innecesaria o propagar un defecto.

La reutilización debe aportar valor y tener ownership.

---

## Preguntas de repaso

1. ¿Qué diferencia hay entre configurar manualmente y describir infraestructura en código?
2. ¿Qué significa que Terraform sea declarativo?
3. ¿Qué función tiene un proveedor?
4. ¿Qué diferencia hay entre recurso y módulo?
5. ¿Qué hace `terraform init`?
6. ¿Qué diferencia hay entre `terraform fmt` y `terraform validate`?
7. ¿Qué muestra `terraform plan`?
8. ¿Qué riesgo introduce `terraform apply`?
9. ¿Por qué el estado puede ser sensible?
10. ¿Qué ventaja ofrece un backend remoto?
11. ¿Qué significa deriva de configuración?
12. ¿Qué problemas resuelve Git en un flujo IaC?
13. ¿Por qué el plan debe asociarse a un commit concreto?
14. ¿Qué limitaciones tiene `--check` o una validación automatizada, en general?
15. ¿Por qué una configuración válida puede seguir siendo insegura?
16. ¿Qué información debe revisar una persona antes de aprobar un plan?
17. ¿Qué diferencia hay entre Terraform y una herramienta de gestión de configuración?
18. ¿Por qué no conviene que dos herramientas administren el mismo atributo?
19. ¿Qué ocurre si se selecciona el backend o workspace equivocado?
20. ¿Por qué volver a una versión anterior de Git no garantiza una reversión?
21. ¿Qué responsabilidades tiene el propietario de un módulo?
22. ¿Qué permisos necesita una identidad de automatización?
23. ¿Por qué los costes deben formar parte de la revisión?
24. ¿Qué parte de la información de Terraform podría aparecer en logs?
25. ¿Qué controles implementarías antes de usar Terraform en producción?

---

## Ejercicio de decisión

Para cada caso, decide si Terraform parece adecuado, inadecuado o si falta información.

Explica tu respuesta y el riesgo principal.

### Caso A: crear una red repetida

Un equipo crea redes de laboratorio con opciones similares cada semana.

Debe poder revisar los cambios y eliminar los entornos al finalizar.

Pregunta si Terraform ayudaría a describir y repetir la configuración.

### Caso B: cambiar un valor una sola vez

Una persona necesita consultar un dato y modificar temporalmente una opción durante un incidente.

No existe aún un flujo de IaC aprobado.

Explica qué controles deberían aplicarse antes y después de la acción.

### Caso C: configurar paquetes del sistema

Un equipo necesita instalar paquetes y administrar archivos en un conjunto de máquinas existentes.

Compara Terraform con una herramienta de gestión de configuración.

### Caso D: aplicar un plan desde cualquier rama

Una pipeline usa credenciales con permisos de administrador y aplica automáticamente cualquier cambio.

Identifica los riesgos y los controles que faltan.

### Caso E: estado en un repositorio público

Un estudiante propone subir `terraform.tfstate` a Git para compartirlo con el grupo.

Explica por qué no es una buena práctica y propone alternativas conceptuales.

### Caso F: módulo remoto sin versión fija

Un proyecto utiliza un módulo remoto que puede cambiar sin revisar el código local.

Identifica riesgos de mantenimiento y reproducibilidad.

### Caso G: recurso gestionado por dos sistemas

Terraform y otra herramienta modifican los mismos atributos del mismo recurso.

Describe qué conflictos pueden aparecer y cómo definir ownership.

### Caso H: plan con reemplazo

Un plan propone reemplazar una base de datos.

Escribe las preguntas que deben contestarse antes de aprobar.

### Caso I: cambio manual de emergencia

Una persona modifica una regla para restablecer el servicio.

Explica cómo registrar, revisar y reconciliar ese cambio con la configuración IaC.

### Caso J: entorno sin backend remoto

Un proyecto pequeño de laboratorio usa un único equipo y no administra infraestructura real.

Explica qué riesgos siguen existiendo y qué prácticas conviene mantener.