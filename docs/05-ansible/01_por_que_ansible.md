Por qué usar Ansible

Ansible automatiza tareas de configuración y operación en sistemas: instala paquetes, administra archivos, configura servicios, crea usuarios y coordina acciones en varios hosts. Su modelo basado en inventarios y playbooks permite describir tareas de forma legible y repetible, sin exigir que cada máquina administrada ejecute un agente permanente de Ansible.

Esta guía presenta qué problemas resuelve Ansible, cómo se diferencia de herramientas como Terraform, cuándo conviene usarlo y qué precauciones aplicar. Las prácticas iniciales se ejecutan **solo en `localhost` o en un entorno de laboratorio autorizado**. No se necesitan servidores cloud, cuentas reales ni credenciales de producción.

> **Principio del laboratorio:** empieza por observar y validar. Antes de cambiar un sistema, identifica el host, revisa las tareas, usa modo de comprobación cuando sea compatible y solicita autorización. Nunca ejecutes ejemplos contra equipos ajenos o de producción.

---

## Objetivos y alcance

La guía presenta los fundamentos para decidir cuándo Ansible puede ayudar y cómo empezar a usarlo de manera segura.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar qué tipo de tareas automatiza Ansible.
- Describir la relación entre control node y managed nodes.
- Identificar el papel de un inventario.
- Reconocer un playbook y sus tareas.
- Explicar qué significa idempotencia.
- Diferenciar una tarea declarativa de una secuencia de comandos imperativos.
- Comparar Ansible con Terraform y con scripts.
- Identificar casos de uso adecuados y no adecuados.
- Ejecutar ejemplos de observación en `localhost`.
- Entender por qué el alcance del inventario es un control de seguridad.
- Describir cómo se administran variables y secretos.
- Aplicar prácticas básicas de revisión antes de ejecutar cambios.
- Documentar una práctica sin guardar credenciales.

### Qué se aprenderá

La guía cubre:

- Automatización de configuración.
- Organización de inventarios.
- Playbooks y módulos.
- Idempotencia.
- Gestión de cambios.
- Diferencias con Terraform.
- Riesgos de permisos y credenciales.
- Laboratorios locales sin infraestructura cloud.

### Qué queda fuera

Esta página no:

- Configura servidores de producción.
- Proporciona claves SSH o contraseñas.
- Recomienda conectarse a equipos ajenos.
- Sustituye una política de cambios corporativa.
- Enseña a eludir controles de acceso.
- Configura un despliegue real.
- Define una arquitectura empresarial completa.
- Garantiza que una ejecución sea segura solo por usar Ansible.
- Sustituye la documentación oficial de la versión instalada.

### Público destinatario

El material está pensado para personas que conocen lo básico de:

- Terminal.
- Archivos de texto.
- YAML.
- Git.
- Sistemas operativos.
- Conceptos de automatización.

No es necesario tener experiencia previa con Ansible.

### Regla para las prácticas

Todos los primeros ejercicios deben ejecutarse:

- En `localhost`.
- En una máquina virtual de laboratorio autorizada.
- En un contenedor de práctica aislado, si el curso lo permite.
- Sin credenciales de producción.
- Sin inventarios de equipos reales.
- Sin privilegios elevados salvo aprobación explícita.

---

## El problema que resuelve Ansible

Ansible ayuda a convertir tareas operativas repetidas en procedimientos descritos y ejecutables.

### Tareas repetitivas

En una organización, una misma tarea puede repetirse en muchos equipos:

- Crear un directorio.
- Instalar un paquete.
- Copiar un archivo de configuración.
- Crear una cuenta técnica.
- Ajustar permisos.
- Activar un servicio.
- Comprobar una versión.
- Aplicar una actualización aprobada.

Ejecutar cada tarea manualmente puede consumir tiempo.

También puede producir resultados diferentes en cada host.

### Configuración inconsistente

Una misma aplicación puede necesitar que varios servidores tengan:

- Paquetes compatibles.
- Usuarios definidos.
- Directorios correctos.
- Configuración coherente.
- Servicios en el estado esperado.
- Versiones aprobadas.

Si cada host se configura de una forma distinta, investigar un fallo puede ser más difícil.

Un playbook ayuda a expresar el resultado esperado en un lugar revisable.

### Errores manuales

Las operaciones manuales pueden fallar por:

- Errores tipográficos.
- Pasos omitidos.
- Orden incorrecto.
- Uso de un host equivocado.
- Diferencias entre operadores.
- Falta de registro.
- Cambios no documentados.

La automatización puede reducir algunas de estas variaciones.

No elimina la posibilidad de errores de diseño.

### Escala y coordinación

Una instrucción ejecutada correctamente en un servidor puede necesitar repetirse en muchos otros.

Ansible puede coordinar tareas en varios hosts definidos en un inventario.

El número de hosts no determina por sí solo que el cambio sea seguro.

El alcance debe limitarse y revisarse.

### Cambios difíciles de repetir

Un procedimiento documentado solo como una lista de pasos puede quedar desactualizado.

Un playbook versionado permite revisar:

- Qué se ejecuta.
- En qué orden.
- En qué hosts.
- Con qué variables.
- Qué módulos se utilizan.
- Qué cambio se espera.

### Documentación ejecutable

Un playbook puede funcionar como una forma de documentación ejecutable.

Describe una intención y permite que el procedimiento se aplique de forma repetible.

La documentación ejecutable debe mantenerse como código:

- Revisada.
- Versionada.
- Probada.
- Comentada cuando conviene.
- Alineada con la política del equipo.

### Automatizar no es ocultar el proceso

Un playbook no debería convertir una operación compleja en una caja negra.

Quien revisa debe poder comprender:

- Qué tarea se realizará.
- Qué host recibirá la tarea.
- Qué permisos se usarán.
- Qué datos se modificarán.
- Qué resultado se espera.

---

## Qué es Ansible

Ansible es una herramienta de automatización que coordina tareas a través de inventarios y playbooks.

### Modelo sin agente permanente

En muchos escenarios, Ansible se ejecuta desde un nodo de control y se conecta a sistemas administrados mediante mecanismos existentes, como SSH.

No exige que cada host tenga un agente permanente de Ansible.

La conexión, los requisitos y las excepciones dependen de la plataforma y de la configuración.

### Control node

El **control node** es el sistema desde el que se ejecuta Ansible.

Puede ser:

- Un equipo de administración.
- Un agente de CI.
- Una máquina de laboratorio.
- Una estación de trabajo autorizada.

Debe protegerse porque puede contener:

- Código de automatización.
- Acceso a inventarios.
- Credenciales.
- Claves de conexión.
- Logs.
- Variables.
- Archivos temporales.

### Managed nodes

Los **managed nodes** son los sistemas sobre los que Ansible realiza tareas.

Pueden ser:

- Servidores Linux.
- Equipos de red compatibles.
- Máquinas virtuales.
- Hosts de laboratorio.
- Otros sistemas con una interfaz de administración compatible.

No todos los módulos funcionan en todos los sistemas.

### Inventario

El inventario define qué hosts o grupos puede administrar Ansible.

Puede contener:

- Nombres de host.
- Direcciones.
- Grupos.
- Variables asociadas.
- Parámetros de conexión.

El inventario es un límite de alcance operativo.

Una entrada mal escrita puede dirigir una tarea al host equivocado.

### Playbook

Un playbook es un archivo YAML que define uno o más plays.

Un play describe, entre otros elementos:

- Los hosts de destino.
- Las variables.
- La escalada de privilegios, si se usa.
- La lista de tareas.
- Los handlers asociados.

### Tareas

Una tarea invoca normalmente un módulo de Ansible.

Ejemplos de objetivos de tarea:

- Consultar un dato.
- Crear un directorio.
- Copiar una plantilla.
- Instalar un paquete.
- Administrar un servicio.

### Módulos

Un módulo implementa una operación concreta.

Cuando existe un módulo específico para una tarea, suele ser más claro que ejecutar un comando de shell genérico.

Los módulos pueden ofrecer:

- Parámetros estructurados.
- Estados deseados.
- Resultados interpretables.
- Mejor control de idempotencia.
- Integración con el sistema objetivo.

### Colecciones

Las colecciones agrupan contenido reutilizable, como:

- Módulos.
- Plugins.
- Roles.
- Documentación.

Comprueba quién mantiene una colección y qué versión se instala.

No instales colecciones desconocidas en un entorno compartido sin revisión.

### Extensibilidad

Ansible puede ampliarse con contenido adicional.

La extensibilidad aporta flexibilidad, pero introduce dependencias que deben gestionarse y auditarse.

---

## Por qué usar Ansible

Ansible puede hacer que tareas de configuración y operación sean más consistentes y revisables.

### Automatizar operaciones

Una tarea recurrente puede convertirse en una ejecución reproducible.

Ejemplos:

- Preparar un entorno de desarrollo.
- Configurar un servicio interno.
- Comprobar versiones.
- Aplicar una plantilla de configuración.
- Recopilar información autorizada.

### Estandarizar configuraciones

Un playbook permite aplicar las mismas reglas a un grupo de hosts.

La estandarización es útil cuando:

- Los hosts tienen funciones similares.
- El cambio está bien definido.
- El inventario es confiable.
- Las diferencias entre entornos están explicitadas.

### Reducir errores manuales

La automatización reduce la repetición manual de pasos.

Puede ayudar a evitar:

- Omisiones.
- Comandos inconsistentes.
- Errores de transcripción.
- Secuencias de pasos distintas.
- Cambios no registrados.

No puede corregir una instrucción equivocada.

### Hacer cambios revisables

Si el playbook está versionado, el equipo puede revisar:

- La intención.
- El alcance.
- Las variables.
- Las tareas.
- Los permisos.
- Los cambios propuestos.

La revisión por código permite detectar errores antes de ejecutar.

### Facilitar repetición

Una tarea bien diseñada puede ejecutarse más de una vez sin producir cambios innecesarios.

Esta característica se relaciona con la idempotencia.

### Coordinar varios hosts

Ansible puede ejecutar tareas sobre un inventario de hosts.

Puede controlar aspectos como:

- Orden.
- Lotes.
- Paralelismo.
- Límites.
- Estrategia de ejecución.

La coordinación debe diseñarse para el impacto del cambio.

### Obtener una salida estructurada

Los módulos devuelven resultados que pueden ayudar a entender:

- Si hubo cambios.
- Si la tarea falló.
- Qué host recibió la tarea.
- Qué resultado se obtuvo.

La salida puede contener información que necesite protección.

### Reutilizar procedimientos

Roles y colecciones permiten organizar tareas reutilizables.

La reutilización evita copiar y pegar, pero también puede propagar un error a muchos proyectos.

### Apoyar el ciclo de vida operativo

Ansible puede utilizarse después de crear infraestructura para:

- Instalar componentes.
- Configurar servicios.
- Distribuir archivos.
- Preparar cuentas.
- Verificar condiciones.
- Ejecutar tareas de mantenimiento.

La elección entre Ansible y otras herramientas depende del problema.

---

## Qué no es Ansible

Entender los límites evita asignar a Ansible responsabilidades que no corresponden.

### No es una garantía de seguridad

Una ejecución puede ser insegura si:

- El inventario contiene hosts incorrectos.
- El playbook ejecuta comandos peligrosos.
- El usuario tiene permisos excesivos.
- Las credenciales se filtran.
- No existe revisión.
- El host de control está comprometido.

La herramienta no sustituye controles de acceso y procedimientos.

### No es un sistema completo de gestión de cambios

Ansible puede participar en una pipeline, pero no crea por sí solo:

- Revisión independiente.
- Aprobación de riesgo.
- Ventana de cambio.
- Plan de comunicación.
- Procedimiento de reversión.
- Auditoría organizativa completa.

### No reemplaza la supervisión

Ansible puede realizar tareas de comprobación, pero no es necesariamente una plataforma de métricas, alertas o observabilidad.

### No reemplaza todas las herramientas de infraestructura

Algunas herramientas están diseñadas para otros ámbitos:

- Aprovisionamiento de recursos cloud.
- Gestión de contenedores.
- Integración continua.
- Secretos.
- Supervisión.
- Gestión de configuración especializada.

Es normal que varias herramientas colaboren.

### No es solo una shell remota

Ansible puede ejecutar comandos, pero su modelo de módulos y estados deseados ofrece más estructura que una lista arbitraria de comandos.

### No elimina la necesidad de comprender YAML

La sintaxis YAML debe ser válida.

La indentación importa.

Un archivo que parece correcto visualmente puede interpretarse de otro modo si la indentación o los tipos son incorrectos.

### No asegura que todas las tareas sean idempotentes

Algunas tareas y comandos pueden producir un cambio cada vez que se ejecutan.

La idempotencia depende del módulo, los parámetros y el diseño del playbook.

### No debe ejecutar comandos arbitrarios sin revisión

Un comando `shell` o `command` puede tener efectos amplios.

Utiliza módulos específicos cuando sea apropiado y revisa cuidadosamente cada comando.

---

## Comparar Ansible con otras herramientas

La elección depende de qué se automatiza y en qué etapa.

### Ansible y tareas manuales

| Aspecto | Tarea manual | Ansible |
|---|---|---|
| Repetición | Depende de cada operador | El procedimiento se codifica |
| Consistencia | Puede variar | Puede repetirse de forma uniforme |
| Revisión | Puede quedar poco rastro | El playbook puede revisarse en Git |
| Errores | Susceptible a omisiones | Reduce pasos manuales, no elimina errores |
| Escala | Requiere repetir acciones | Puede dirigirse a grupos del inventario |

La automatización requiere que el playbook se pruebe antes de ampliarlo.

### Ansible y scripts

Un script puede ser adecuado para una tarea pequeña y concreta.

Ansible puede aportar:

- Inventario.
- Módulos específicos.
- Gestión de resultados por host.
- Variables.
- Roles.
- Handlers.
- Integración con playbooks.

Un script puede seguir siendo mejor para ciertos procesos independientes.

No conviertas cada script en un playbook sin una necesidad clara.

### Ansible y Terraform

Terraform se centra en declarar y administrar recursos de infraestructura mediante proveedores y estado.

Ansible se centra, con frecuencia, en configuración y operación de sistemas.

Ejemplos habituales:

- Terraform puede crear una máquina virtual.
- Ansible puede configurar paquetes y servicios dentro de esa máquina.
- Terraform puede administrar redes y cuentas de recursos.
- Ansible puede configurar una aplicación o sistema operativo.

Esta separación es una pauta común, no una regla absoluta.

### Relación entre Terraform y Ansible

Un flujo podría ser:

```text
Aprovisionar recursos
        |
        v
Preparar hosts
        |
        v
Configurar servicios
        |
        v
Verificar la aplicación
```

Cada herramienta debe tener un alcance explícito.

Evita que dos herramientas intenten administrar el mismo atributo sin coordinación.

### Ansible y contenedores

Los contenedores empaquetan aplicaciones y dependencias en una unidad desplegable.

Ansible puede:

- Preparar hosts que ejecutan contenedores.
- Instalar herramientas autorizadas.
- Configurar un servicio de contenedores.
- Coordinar algunas operaciones.

No sustituye por sí mismo una plataforma de orquestación de contenedores.

### Ansible y herramientas de configuración similares

Hay varias herramientas de gestión de configuración.

La elección depende de:

- Sistemas operativos.
- Ecosistema existente.
- Requisitos de agente.
- Modelo de datos.
- Escala.
- Conocimientos del equipo.
- Auditoría.
- Políticas.
- Integración con CI/CD.

No hay una herramienta universalmente adecuada para todos los casos.

### Regla práctica de selección

Antes de elegir, describe el problema sin mencionar herramientas.

Después pregunta:

- ¿Qué sistema debe cambiarse?
- ¿Qué resultado se busca?
- ¿Qué alcance tiene?
- ¿Quién lo ejecutará?
- ¿Qué controles son necesarios?
- ¿Qué información debe conservarse?

---

## Conceptos esenciales

Estos conceptos explican cómo se organiza una automatización Ansible.

### Declarativo e imperativo

Una tarea declarativa describe el resultado deseado.

Ejemplo conceptual:

```text
El directorio /tmp/lab-ansible debe existir.
```

Una instrucción imperativa describe un paso específico:

```text
Ejecutar un comando para crear el directorio.
```

Cuando hay un módulo adecuado, describir el estado deseado suele facilitar la repetición y la revisión.

### Idempotencia

Una operación es idempotente cuando ejecutarla varias veces deja el sistema en el mismo estado final deseado.

Por ejemplo, pedir que exista un directorio suele ser idempotente.

La primera ejecución puede crearlo.

La segunda puede informar que no hay cambios.

### Idempotencia no significa ausencia de efectos

Una tarea puede cambiar el sistema la primera vez y ser idempotente después.

También puede activar servicios, escribir logs u ocasionar efectos externos.

Revisa cada operación.

### Módulos y idempotencia

Los módulos suelen entender el estado del recurso que administran.

Un comando arbitrario puede no informar si produjo cambios y puede ejecutarse de nuevo sin control.

Prefiere un módulo específico si satisface el objetivo.

### Inventarios y grupos

Un inventario organiza hosts individuales y grupos.

Los grupos permiten expresar un alcance común.

Un error de grupo puede ampliar el alcance de una ejecución.

### Variables

Las variables permiten parametrizar:

- Rutas.
- Nombres.
- Versiones.
- Entornos.
- Valores configurables.

No deberían utilizarse para almacenar secretos de forma improvisada.

### Facts

Ansible puede recopilar información sobre un host y ofrecerla como facts.

Los facts pueden ayudar a tomar decisiones durante el playbook.

También pueden revelar información sobre el sistema y deben tratarse de forma apropiada.

### Handlers

Un handler es una tarea que se ejecuta cuando otra tarea lo notifica.

Se utiliza a menudo para acciones que deben ocurrir al cambiar una configuración, como reiniciar un servicio.

Un reinicio puede interrumpir el servicio y necesita revisión.

### Roles

Un role organiza contenido reutilizable, como tareas, valores predeterminados, plantillas y handlers.

Los roles pueden facilitar la estructura del proyecto.

También requieren control de versiones y revisión de dependencias.

### Tags

Los tags permiten seleccionar subconjuntos de tareas.

Pueden ser útiles durante una operación controlada.

También pueden provocar que se omitan tareas necesarias si se utilizan sin entender el playbook completo.

### Límite por host

Un patrón de selección como `--limit` puede restringir los hosts de una ejecución.

Comprueba que la limitación funciona antes de ejecutar cambios.

No asumas que el nombre de un host coincide con su función o entorno.

### Check mode

El modo de comprobación solicita a Ansible que estime cambios sin aplicarlos, cuando el módulo lo admite.

No todos los módulos implementan el modo de comprobación de la misma forma.

No es una garantía de que no se produzcan efectos.

### Diff mode

El modo diff puede mostrar diferencias de archivos u otros datos.

La salida puede revelar secretos o configuraciones internas.

Revísala antes de compartirla.

---

## Casos de uso

Ansible puede servir para tareas de configuración y operación si el alcance está bien definido.

### Configuración de servidores

Puede automatizar:

- Directorios.
- Paquetes.
- Usuarios técnicos.
- Archivos de configuración.
- Servicios.
- Permisos.
- Requisitos de aplicación.

Las operaciones deben ajustarse al sistema operativo y a la política.

### Gestión de archivos

Se puede utilizar para:

- Crear directorios.
- Distribuir plantillas.
- Copiar archivos aprobados.
- Ajustar propietarios.
- Ajustar permisos.

No distribuyas claves privadas por inventarios generales.

### Instalación de paquetes

Un módulo específico puede instalar un paquete mediante el gestor del sistema.

Comprueba:

- Repositorio.
- Versión.
- Firma o procedencia.
- Dependencias.
- Política de actualización.
- Impacto sobre el sistema.

### Administración de servicios

Ansible puede administrar el estado de algunos servicios.

Antes de reiniciar o detener un servicio:

- Identifica el host.
- Confirma la ventana.
- Comprueba dependencias.
- Comprueba el impacto.
- Confirma el procedimiento de recuperación.

### Despliegue de aplicaciones

Ansible puede participar en despliegues:

- Preparar directorios.
- Distribuir configuraciones.
- Instalar dependencias.
- Activar versiones.
- Reiniciar procesos.
- Verificar respuestas.

Un despliegue debe tener un plan de versión y recuperación.

### Tareas operativas

Puede ayudar a automatizar:

- Inspección de versiones.
- Comprobaciones de espacio.
- Recolección autorizada de información.
- Rotación de configuraciones.
- Preparación de entornos.
- Tareas de mantenimiento programadas.

### Homogeneización de entornos

Se pueden mantener configuraciones parecidas entre:

- Desarrollo.
- Pruebas.
- Preproducción.
- Producción.

Las diferencias entre entornos deben ser explícitas y protegidas.

### Cumplimiento y configuración base

Un playbook puede ayudar a aplicar configuraciones base.

No sustituye una auditoría ni demuestra por sí solo que se cumple una norma.

---

## Cuándo elegir Ansible

El ajuste depende de la tarea, el entorno y el equipo.

### Señales de buen encaje

Ansible puede ser una opción razonable cuando:

- Hay tareas repetidas sobre hosts administrados.
- Se necesita una configuración uniforme.
- El equipo conoce YAML y automatización.
- La conexión a los hosts está aprobada.
- El cambio se puede expresar mediante módulos.
- Se necesita revisar el procedimiento como código.
- La organización ya opera Ansible.
- Se requiere coordinar acciones en grupos de equipos.

### Señales de mal encaje

Puede no ser la mejor opción cuando:

- El problema es solo crear recursos cloud y ya existe una herramienta adecuada para ello.
- La tarea requiere una operación transaccional que Ansible no proporciona.
- La plataforma ofrece un mecanismo nativo mejor controlado.
- El equipo no puede mantener el inventario.
- No existe una forma segura de autenticar al host.
- No se pueden probar los cambios.
- La ejecución depende de comandos opacos y difíciles de auditar.
- La operación requiere una interfaz especializada.

### Preguntas de selección

Antes de adoptar Ansible, pregunta:

- ¿Qué estado final se quiere conseguir?
- ¿Qué hosts participan?
- ¿Qué permisos necesita el operador?
- ¿Cómo se prueba el cambio?
- ¿Cómo se limita el alcance?
- ¿Cómo se registra la ejecución?
- ¿Qué pasa si una tarea falla a mitad?
- ¿Cómo se revierte?
- ¿Qué secretos intervienen?
- ¿Cómo se actualizará el contenido?

### Coste de mantenimiento

Cada playbook necesita mantenimiento:

- Actualizar módulos.
- Revisar colecciones.
- Actualizar variables.
- Probar distintas versiones.
- Mantener inventarios.
- Revisar permisos.
- Actualizar documentación.

La automatización reduce esfuerzo repetitivo, pero no elimina el trabajo de operación.

---

## Arquitectura y flujo de ejecución

Comprender la ruta de ejecución ayuda a identificar dónde controlar el acceso.

### Control node

El nodo de control:

- Lee inventario y playbooks.
- Resuelve variables.
- Carga colecciones.
- Inicia conexiones.
- Ejecuta el flujo.
- Recoge resultados.
- Presenta logs.

Protege el nodo de control como parte de la infraestructura de automatización.

### Conexiones y transporte

Para hosts Linux, SSH es un mecanismo habitual.

Otros sistemas pueden utilizar transportes distintos.

Usa únicamente protocolos y credenciales autorizados.

### Inventario y alcance

Antes de ejecutar, verifica:

- Qué inventario se cargó.
- Qué grupo selecciona el play.
- Qué hosts resultan seleccionados.
- Si existe un límite adicional.
- Si la selección corresponde al entorno previsto.

### Ejecución de un playbook

De manera simplificada:

1. Ansible interpreta el YAML.
2. Selecciona hosts según el inventario.
3. Evalúa variables.
4. Ejecuta tareas.
5. Recibe resultados.
6. Procesa handlers cuando corresponde.
7. Resume éxito y fallos por host.

### Ejecución paralela

Ansible puede procesar más de un host a la vez.

La concurrencia influye en:

- Carga.
- Orden.
- Ventanas de mantenimiento.
- Riesgo de cambios simultáneos.
- Capacidad de recuperación.

### Fallo parcial

Una ejecución puede terminar con unos hosts correctos y otros fallidos.

No asumas que todo el inventario quedó en el mismo estado.

Identifica qué hosts completaron cada tarea.

### Check mode y ejecución normal

Check mode puede estimar qué cambiaría.

La ejecución normal aplica operaciones compatibles.

La salida de check mode puede no reflejar todos los efectos de los módulos.

### Registro

Los resultados de una ejecución pueden guardarse en:

- Consola.
- Logs de CI.
- Sistemas de auditoría.
- Sistemas de control de cambios.

No guardes secretos en esos registros.

---

## Seguridad y operación responsable

La automatización puede concentrar permisos; por eso necesita controles proporcionales.

### Alcance mínimo

Limita cada ejecución a:

- Los hosts necesarios.
- El grupo correcto.
- La tarea aprobada.
- El entorno apropiado.
- El tiempo necesario.
- La identidad autorizada.

### Inventario como control de seguridad

Un inventario no es solo una lista cómoda.

Define el conjunto de sistemas que el playbook puede alcanzar.

Revísalo antes de cualquier cambio.

### Credenciales

No escribas en un playbook:

- Contraseñas.
- Tokens.
- Claves privadas.
- Secretos de servicios.
- Credenciales personales.

Utiliza el mecanismo aprobado para el entorno.

### Ansible Vault

Ansible Vault puede cifrar archivos o valores según el flujo utilizado.

No convierte automáticamente una credencial en segura.

Protege también:

- La contraseña de Vault.
- Las copias descifradas.
- Los logs.
- Los argumentos.
- Las variables.
- Los archivos temporales.
- El acceso al repositorio.

### Privilege escalation

La escalada de privilegios puede permitir modificar partes sensibles del sistema.

Usa `become` solo cuando sea necesario y autorizado.

No ejecutes todo un play con privilegios elevados por comodidad.

### Comandos de shell

Los módulos `shell` y `command` pueden ejecutar acciones potentes.

Antes de utilizarlos:

- Revisa exactamente qué ejecutan.
- Comprueba si pueden repetirse.
- Evita concatenar entradas no confiables.
- Limita privilegios.
- Registra el resultado.
- Evalúa si existe un módulo específico.

### Check mode

Usa check mode cuando sea compatible y útil:

```bash
ansible-playbook --check playbook.yml
```

No asumas que todas las tareas son inocuas en check mode.

Revisa la documentación de módulos relevantes.

### Diff mode

El modo diff puede ayudar a revisar cambios:

```bash
ansible-playbook --check --diff playbook.yml
```

No lo utilices si la salida pudiera revelar secretos o configuraciones restringidas.

### Logs

Evita:

- Imprimir variables sensibles.
- Usar depuración excesiva.
- Compartir consola sin revisión.
- Guardar salidas completas en lugares públicos.
- Mostrar contenido de archivos secretos.

### Revisión de cambios

Antes de ejecutar un playbook:

- Revisa el diff de Git.
- Revisa el inventario.
- Revisa hosts seleccionados.
- Revisa variables.
- Revisa módulos y colecciones.
- Revisa permisos.
- Revisa las tareas con `become`.
- Comprueba el plan de recuperación.

### Control de cambios

En entornos de equipo, utiliza el proceso aprobado para:

- Solicitar cambios.
- Revisar código.
- Aprobar ejecuciones.
- Registrar quién ejecutó.
- Comunicar ventanas.
- Recuperar ante fallos.

---

## Preparar un laboratorio

Los ejercicios iniciales utilizan solamente `localhost`.

### Requisitos

Se necesita:

- Ansible instalado o disponible en el agente de laboratorio.
- Python compatible con la instalación utilizada.
- Un editor de texto.
- Terminal.
- Un directorio de práctica.
- Permiso para ejecutar el laboratorio local.

No se necesita:

- Servidor remoto.
- Clave SSH.
- Cuenta cloud.
- Contraseña real.
- Privilegios de administrador.
- Inventario corporativo.

### Comprobar la instalación

```bash
ansible --version
```

```bash
ansible-playbook --version
```

Las versiones exactas dependen del paquete instalado.

No instales una versión en un equipo compartido sin autorización.

### Estructura de archivos

```text
laboratorio-ansible/
├── ansible.cfg
├── inventory.ini
├── playbook.yml
└── README.md
```

### Archivo `inventory.ini`

```ini
[local]
localhost ansible_connection=local
```

Este inventario limita la práctica a la máquina local.

No agregues hosts reales a esta sesión.

### Archivo `ansible.cfg`

```ini
[defaults]
inventory = ./inventory.ini
host_key_checking = True
```

La configuración exacta puede variar según el curso.

No desactives comprobaciones de host para resolver errores sin entender el motivo.

### Archivo `README.md`

```text
Laboratorio introductorio de Ansible.
El inventario apunta únicamente a localhost.
No se utilizan credenciales ni hosts remotos.
```

### Comprobar el inventario

```bash
ansible-inventory --list
```

Comprueba que solo se muestra `localhost`.

### Ejecutar un módulo de observación

```bash
ansible local -m ansible.builtin.ping
```

El módulo `ping` de Ansible comprueba la comunicación con el host administrado.

No es el comando de red `ping`.

### Limitar explícitamente al laboratorio

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

Comprueba siempre que el límite coincide con el objetivo de la práctica.

---

## Sesiones prácticas

Las sesiones avanzan desde la observación hasta la automatización controlada.

### Preparación común

Antes de cada sesión:

- Comprueba que el inventario apunta a `localhost`.
- Revisa el directorio actual.
- No añadas hosts reales.
- No uses credenciales.
- No ejecutes tareas con `become`.
- Lee el playbook antes de ejecutarlo.
- Guarda el diff si cambias archivos.
- No publiques datos personales.

### Sesión 1: explorar la instalación

**Objetivo:** conocer las herramientas instaladas.

#### Instrucciones

1. Ejecuta `ansible --version`.
2. Ejecuta `ansible-playbook --version`.
3. Anota la versión.
4. Identifica la ruta de configuración mostrada.
5. No compartas rutas personales si el curso no lo permite.
6. Compara la instalación local con la del agente, si hay Jenkins.

#### Preguntas

- ¿Qué versión se usa?
- ¿Qué archivo de configuración está activo?
- ¿Por qué conviene registrar la versión?

### Sesión 2: crear el inventario local

**Objetivo:** configurar un destino de laboratorio.

#### Instrucciones

1. Crea `inventory.ini`.
2. Añade solamente `localhost`.
3. Configura la conexión local.
4. Ejecuta `ansible-inventory --list`.
5. Comprueba que no hay otros hosts.
6. Guarda el archivo en la carpeta de práctica.

### Sesión 3: ejecutar el módulo `ping`

**Objetivo:** comprobar que Ansible puede ejecutar una tarea local.

```bash
ansible local -m ansible.builtin.ping
```

#### Instrucciones

1. Ejecuta el comando desde el directorio del inventario.
2. Revisa el resultado.
3. Explica por qué el módulo se llama `ping`.
4. Confirma que no se usó una conexión remota.
5. Registra la versión de Ansible.

### Sesión 4: observar facts

**Objetivo:** ver que Ansible puede recopilar información del host.

```bash
ansible localhost -m ansible.builtin.setup
```

#### Instrucciones

1. Ejecuta en `localhost`.
2. No copies la salida completa a un repositorio público.
3. Identifica tres tipos de información observada.
4. Explica por qué los facts pueden revelar detalles del sistema.
5. Utiliza una consulta más acotada si el curso lo permite.

### Sesión 5: escribir el primer playbook

**Objetivo:** crear una tarea de observación.

Archivo `playbook.yml`:

```yaml
---
- name: Observación local de laboratorio
  hosts: localhost
  connection: local
  gather_facts: false

  tasks:
    - name: Mostrar un mensaje no sensible
      ansible.builtin.debug:
        msg: "Ansible se ejecuta en el laboratorio local."
```

#### Instrucciones

1. Guarda el archivo.
2. Comprueba la indentación.
3. Ejecuta el playbook.
4. Lee el mensaje.
5. Confirma que no modifica archivos.

### Sesión 6: ejecutar el playbook con límite

**Objetivo:** hacer explícito el alcance de la ejecución.

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

#### Instrucciones

1. Ejecuta desde el directorio del proyecto.
2. Revisa el host del resumen.
3. Confirma que el único destino es `localhost`.
4. No elimines `--limit` en ejercicios con varios hosts.
5. Documenta el alcance.

### Sesión 7: crear un directorio temporal

**Objetivo:** observar una tarea idempotente en un espacio seguro.

Añade esta tarea al playbook:

```yaml
    - name: Asegurar que existe el directorio del laboratorio
      ansible.builtin.file:
        path: /tmp/ansible-lab
        state: directory
        mode: "0750"
```

#### Instrucciones

1. Lee la ruta antes de ejecutar.
2. Confirma que solo afecta al directorio de práctica.
3. Ejecuta en `localhost`.
4. Revisa si Ansible informa un cambio.
5. Ejecuta el playbook una segunda vez.
6. Compara el resultado.

No reemplaces la ruta por un directorio del sistema.

### Sesión 8: comprobar idempotencia

**Objetivo:** observar la diferencia entre una primera ejecución y una repetición.

#### Instrucciones

1. Ejecuta la tarea de creación del directorio.
2. Anota el contador de cambios.
3. Ejecuta otra vez el mismo playbook.
4. Anota el contador de cambios.
5. Explica por qué la segunda ejecución podría no modificar nada.
6. Investiga por qué un módulo concreto podría comportarse de otra forma.

### Sesión 9: usar una variable de laboratorio

**Objetivo:** parametrizar un valor no sensible.

Añade:

```yaml
  vars:
    nombre_directorio: /tmp/ansible-lab
```

Y úsala en la tarea:

```yaml
        path: "{{ nombre_directorio }}"
```

#### Instrucciones

1. Añade la variable bajo el play correcto.
2. Comprueba la indentación.
3. Ejecuta el playbook.
4. Revisa el valor sin imprimir variables sensibles.
5. Cambia el valor a otra ruta temporal aprobada, si el docente lo permite.
6. Observa el efecto.

### Sesión 10: comprobar YAML

**Objetivo:** diagnosticar errores de sintaxis.

#### Instrucciones

1. En una copia, cambia temporalmente la indentación.
2. Ejecuta `ansible-playbook --syntax-check`.
3. Lee el error.
4. Restaura la indentación.
5. Vuelve a ejecutar la comprobación.
6. No cambies la estructura sin revisar el error.

### Sesión 11: usar check mode

**Objetivo:** revisar una posible modificación antes de aplicarla.

```bash
ansible-playbook --check -i inventory.ini playbook.yml --limit localhost
```

#### Instrucciones

1. Ejecuta el playbook en modo check.
2. Revisa si el módulo informa un cambio previsto.
3. Comprueba qué tareas admiten check mode.
4. Explica por qué check mode no es una garantía completa.
5. No useslo como sustituto de revisión.

### Sesión 12: usar diff mode

**Objetivo:** observar diferencias sin mostrar datos sensibles.

```bash
ansible-playbook --check --diff -i inventory.ini playbook.yml --limit localhost
```

#### Instrucciones

1. Ejecuta el modo diff solo en el laboratorio.
2. Comprueba qué tareas producen salida.
3. Revisa si se muestra contenido.
4. No uses diff con archivos secretos.
5. Documenta qué salida sería necesario proteger.

### Sesión 13: comparar un módulo y un comando

**Objetivo:** entender por qué se prefieren módulos específicos.

#### Actividad

Compara:

- El módulo `ansible.builtin.file`.
- Un comando de shell hipotético que crea el mismo directorio.

#### Preguntas

- ¿Cuál expresa mejor el estado deseado?
- ¿Cuál informa cambios con más claridad?
- ¿Qué ocurre si el comando se repite?
- ¿Qué riesgos introduce la shell?
- ¿Qué entrada podría afectar al comando?

No ejecutes comandos destructivos.

### Sesión 14: usar una plantilla conceptual

**Objetivo:** reconocer una forma de generar configuración.

El docente puede proporcionar una plantilla de texto inocua.

#### Instrucciones

1. Lee la plantilla.
2. Identifica variables.
3. Comprueba si hay valores personales o secretos.
4. Ejecuta solo sobre un archivo temporal de laboratorio.
5. Revisa el diff antes de reemplazar contenido.
6. No escribas en archivos de sistema.

### Sesión 15: observar un handler

**Objetivo:** entender cuándo se ejecuta un handler sin reiniciar servicios.

#### Actividad

1. Lee un ejemplo ficticio de tarea que notifica un handler.
2. Identifica el evento que lo activa.
3. Explica por qué los handlers evitan reinicios repetidos.
4. No configures un servicio real.
5. No ejecutes `systemctl` en esta sesión.

### Sesión 16: revisar `become`

**Objetivo:** reconocer una tarea que requiere privilegios elevados.

#### Instrucciones

1. Busca `become` en el ejemplo suministrado.
2. Identifica qué tarea lo solicita.
3. Explica por qué eleva el impacto.
4. No añadas `become: true` a tu laboratorio.
5. Enumera las aprobaciones que necesitaría en un entorno real.

### Sesión 17: limitar un playbook a un host

**Objetivo:** comprobar el efecto del inventario y `--limit`.

#### Instrucciones

1. Revisa el inventario local.
2. Ejecuta con `--limit localhost`.
3. Revisa el resumen de hosts.
4. Comprueba que no hay otros destinos.
5. Describe cómo verificarías el alcance de un inventario remoto autorizado.
6. No añadas hosts reales.

### Sesión 18: revisar variables y secretos

**Objetivo:** identificar patrones inseguros.

Busca en un ejemplo ficticio:

- Contraseña literal.
- Token en YAML.
- Clave privada en una variable.
- Parámetro de shell que imprime un secreto.
- Archivo de variables confirmado en Git.

Para cada patrón, describe una alternativa aprobada.

No crees valores que parezcan credenciales reales.

### Sesión 19: comparar tarea manual y playbook

**Objetivo:** evaluar beneficios y límites de la automatización.

#### Instrucciones

1. Elige una tarea inocua, como asegurar un directorio temporal.
2. Describe cómo se haría manualmente.
3. Describe cómo se expresa con un módulo Ansible.
4. Compara repetición y revisión.
5. Identifica qué errores aún son posibles.
6. Indica qué controles deben preceder a la ejecución.

### Sesión 20: revisar una salida con fallos

**Objetivo:** diagnosticar una ejecución con éxito parcial.

El docente entrega una salida ficticia con dos hosts y una tarea fallida.

#### Instrucciones

1. Identifica qué hosts tuvieron éxito.
2. Identifica cuál falló.
3. Localiza la tarea causante.
4. Determina qué tareas posteriores se ejecutaron.
5. Explica cómo comprobar el estado actual.
6. No vuelvas a ejecutar contra sistemas ajenos.

### Sesión 21: revisar un inventario ficticio

**Objetivo:** detectar errores de alcance.

#### Instrucciones

1. Revisa nombres de grupos.
2. Revisa variables asociadas.
3. Identifica hosts ambiguos.
4. Señala entradas duplicadas.
5. Busca datos sensibles.
6. Propón controles de revisión.
7. No conectes el inventario a hosts reales.

### Sesión 22: revisar una colección

**Objetivo:** valorar una dependencia de Ansible.

Completa:

```text
Nombre de colección:
Origen:
Versión:
Mantenedor:
Módulos usados:
Permisos requeridos:
Método de instalación:
Riesgo de actualización:
Revisión realizada:
```

No instales colecciones desconocidas en un entorno compartido.

### Sesión 23: documentar una tarea de observación

**Objetivo:** crear un procedimiento claro y repetible.

Documenta:

- Objetivo.
- Inventario.
- Hosts.
- Comando.
- Resultado esperado.
- Datos que no deben compartirse.
- Cómo se detecta un fallo.
- Cómo se detiene la práctica.

La tarea debe limitarse a consulta en `localhost`.

### Sesión 24: diseño de un caso de uso

**Objetivo:** decidir si Ansible es adecuado para un problema.

Elige un escenario ficticio:

- Asegurar un directorio temporal.
- Consultar una versión.
- Preparar un entorno de desarrollo.
- Instalar un paquete en varios servidores.
- Crear un recurso cloud.
- Construir una imagen de contenedor.

Para cada uno, explica:

- Si Ansible es buen encaje.
- Qué inventario necesitaría.
- Qué permisos requeriría.
- Qué riesgo tendría.
- Qué otra herramienta podría participar.

### Sesión 25: proyecto integrador

**Objetivo:** presentar un playbook local seguro y revisable.

#### Requisitos

- Inventario que incluya solo `localhost`.
- Playbook con tareas inocuas.
- Uso de módulos específicos.
- Variables no sensibles.
- Sin `become`.
- Sin credenciales.
- Comprobación de sintaxis.
- Ejecución limitada a localhost.
- Prueba de idempotencia.
- Evidencia de check mode.
- Documentación del alcance.
- Sin cambios en servicios o archivos del sistema.

#### Entrega

Incluye:

- `inventory.ini`.
- `playbook.yml`.
- `ansible.cfg`, si se utiliza.
- Versión de Ansible.
- Resultado de sintaxis.
- Resultado de primera ejecución.
- Resultado de repetición.
- Resultado de check mode.
- Explicación de por qué Ansible es adecuado para la tarea.
- Una limitación o riesgo identificado.

---

## Buenas prácticas

Un playbook mantenible debe ser claro, limitado y revisable.

### Legibilidad

- Usa nombres de plays descriptivos.
- Usa nombres de tareas que indiquen su propósito.
- Mantén una indentación consistente.
- Evita abreviaturas ambiguas.
- Usa nombres de variables que expresen significado.
- Divide playbooks largos en componentes razonables.
- Añade comentarios cuando expliquen una decisión no obvia.

### Reutilización

- Reutiliza roles cuando aporten estructura.
- Evita duplicar bloques extensos.
- Versiona roles y colecciones.
- Documenta las entradas requeridas.
- Explica qué sistemas soporta el contenido.
- No reutilices contenido sin revisar sus permisos y efectos.

### Revisión y pruebas

- Ejecuta `--syntax-check`.
- Comprueba el inventario.
- Revisa el diff.
- Usa check mode cuando sea apropiado.
- Prueba en un host aislado.
- Revisa la idempotencia.
- Comprueba el comportamiento ante fallos.
- No saltes directamente a todos los hosts.

### Entornos y cambios

- Separa desarrollo, pruebas y producción.
- Utiliza inventarios y variables controlados.
- Protege ramas.
- Revisa cambios antes de ejecutar.
- Usa aprobaciones cuando el impacto lo requiera.
- Limita el alcance con grupos y opciones.
- Registra build, commit y operador.
- Define un procedimiento de recuperación.

### Gestión de versiones

Registra:

- Versión de Ansible.
- Versión de Python, cuando corresponda.
- Versión de colecciones.
- Sistema operativo del control node.
- Requisitos de los managed nodes.
- Cambios de configuración.

### Preferir módulos específicos

Un módulo especializado suele ser más legible que un comando genérico.

Antes de usar `shell` o `command`, comprueba si existe un módulo adecuado.

### Controlar cambios repetidos

No asumas que una tarea es idempotente.

Prueba una ejecución inicial y otra posterior en un entorno seguro.

### Revisión del inventario

Antes de una ejecución de cambio:

- Revisa el nombre del inventario.
- Comprueba grupos y patrones.
- Comprueba límites.
- Identifica el entorno.
- Verifica que no hay hosts añadidos accidentalmente.

---

## Errores frecuentes

### Inventario equivocado

El playbook puede ejecutarse sobre hosts distintos a los previstos.

Comprueba el inventario y la selección antes de lanzar una tarea.

### Play dirigido a un grupo demasiado amplio

Un patrón amplio puede incluir más hosts de los esperados.

Usa grupos explícitos y revisa el resultado de la selección.

### YAML con indentación incorrecta

YAML depende de la indentación.

Ejecuta `--syntax-check` y revisa la línea indicada.

### Variable indefinida

Comprueba:

- Nombre.
- Alcance.
- Archivo de variables.
- Grupo.
- Host.
- Valor por defecto.

No imprimas secretos para depurar variables.

### Módulo desconocido

Comprueba:

- Nombre totalmente calificado.
- Colección instalada.
- Versión de Ansible.
- Documentación del módulo.
- Compatibilidad con el host.

### Tarea no idempotente

Un comando puede producir cambios en cada ejecución.

Comprueba si existe un módulo que describa el estado deseado.

### Uso de `shell` sin necesidad

La shell puede interpretar metacaracteres y entradas.

Revisa el comando y el origen de sus valores.

### `become` demasiado amplio

La escalada global puede dar más permisos de los necesarios.

Limita `become` a las tareas que realmente lo necesitan.

### Check mode malinterpretado

Un resultado sin cambios en check mode no demuestra que la ejecución normal no tenga efectos.

Comprueba el soporte del módulo.

### Diff con datos sensibles

El modo diff puede mostrar contenido de archivos.

No publiques la salida sin revisarla.

### Hechos recopilados en exceso

Recopilar todos los facts puede aumentar duración y exposición de datos.

Solicita solo lo necesario cuando el diseño lo permita.

### Colección sin revisar

Una colección puede introducir módulos y código de terceros.

Verifica origen, versión, mantenedor y política.

### Fallo parcial

Una tarea puede fallar en un host y tener éxito en otros.

Identifica el resultado por host antes de volver a ejecutar.

---

## Diagnóstico

Empieza por identificar el playbook, el inventario, el host seleccionado y la tarea fallida.

### Ansible no está instalado

Comprueba:

```bash
ansible --version
```

Verifica el control node y el entorno virtual.

No instales paquetes en un agente compartido sin permiso.

### No se encuentra el inventario

Comprueba:

- Directorio actual.
- Opción `-i`.
- Configuración activa.
- Ruta del archivo.
- Permisos de lectura.

### El host no aparece

Comprueba:

- Sintaxis del inventario.
- Nombre del grupo.
- Nombre del host.
- Configuración seleccionada.
- Si el inventario es dinámico o estático.

### Fallo de conexión

En el laboratorio local, revisa que el inventario especifique conexión local.

En entornos remotos, consulta al administrador y no cambies el método de autenticación sin autorización.

### Error de autenticación

No copies la clave o contraseña al log.

Comprueba con el responsable:

- Identidad.
- Permisos.
- Vigencia.
- Método aprobado.
- Host objetivo.
- Política de acceso.

### Error de permisos

Una operación puede necesitar privilegios adicionales.

No actives `become` automáticamente.

Confirma qué permiso exacto se necesita y quién puede autorizarlo.

### Error de sintaxis

Ejecuta:

```bash
ansible-playbook --syntax-check playbook.yml
```

Revisa YAML, nombres de módulos e indentación.

### Tarea marcada como fallida

Localiza:

- Host.
- Tarea.
- Mensaje.
- Módulo.
- Parámetros no sensibles.
- Cambios previos en el mismo host.

No repitas la ejecución hasta comprender si las tareas anteriores modificaron el sistema.

### Check mode difiere de ejecución normal

Revisa el soporte del módulo y su comportamiento documentado.

Check mode puede no modelar todas las consecuencias.

### Ficha de diagnóstico

```text
Proyecto:
Playbook:
Inventario:
Grupo o límite:
Host:
Versión de Ansible:
Tarea:
Módulo:
Resultado observado:
Primer error relevante:
Cambios previos:
Hipótesis:
Comprobación siguiente:
Acción autorizada:
```

No incluyas contraseñas, claves privadas, tokens ni contenido de archivos secretos.

---

## Checklist de seguridad

### Antes de ejecutar

- [ ] El directorio actual es el esperado.
- [ ] El inventario está revisado.
- [ ] Los hosts seleccionados son correctos.
- [ ] El playbook está revisado.
- [ ] Las variables son conocidas.
- [ ] Los módulos y colecciones están identificados.
- [ ] El impacto está entendido.
- [ ] La ejecución está autorizada.
- [ ] El procedimiento de recuperación está claro si corresponde.

### Durante la práctica

- [ ] La ejecución se limita a `localhost`.
- [ ] No se usan credenciales reales.
- [ ] No se usa `become`.
- [ ] No se modifican servicios del sistema.
- [ ] Se comprueba sintaxis antes de ejecutar.
- [ ] Se revisa check mode cuando procede.
- [ ] Se revisa diff antes de compartir.

### Después de ejecutar

- [ ] Se registra el resultado.
- [ ] Se revisa el estado por host.
- [ ] Se comprueba idempotencia cuando procede.
- [ ] No se publican logs sensibles.
- [ ] No quedan archivos temporales con secretos.
- [ ] La entrega contiene solo datos no sensibles.

---

## Rúbrica de evaluación

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Conceptos | Confunde inventario y playbook | Describe sus funciones | Explica el flujo completo de ejecución |
| Idempotencia | Asume que todo módulo es idempotente | Identifica tareas repetibles | Prueba y justifica el comportamiento |
| Selección de herramienta | Propone Ansible para cualquier tarea | Compara usos habituales | Justifica límites y colaboración entre herramientas |
| Seguridad | Usa hosts o credenciales sin revisar | Limita la práctica a localhost | Diseña controles de inventario, permisos y revisión |
| Playbook | Escribe tareas ambiguas | Usa módulos adecuados | Organiza variables, handlers y roles con criterio |
| Diagnóstico | Repite comandos sin revisar | Identifica host y tarea | Separa hechos, hipótesis y comprobaciones |
| Documentación | Omite alcance y resultado | Registra versiones y ejecución | Documenta sin exponer información sensible |

### Evidencias mínimas

Entrega:

- Inventario local.
- Playbook de observación.
- Comprobación de sintaxis.
- Resultado de ejecución.
- Comparación de dos ejecuciones.
- Resultado de check mode.
- Explicación de alcance.
- Identificación de un riesgo y su control.

---

## Preguntas de repaso

1. ¿Qué problema intenta resolver Ansible?
2. ¿Qué es un control node?
3. ¿Qué es un managed node?
4. ¿Qué información define un inventario?
5. ¿Qué diferencia hay entre un play y una tarea?
6. ¿Qué es un módulo?
7. ¿Qué significa idempotencia?
8. ¿Por qué un comando de shell puede ser menos fácil de repetir que un módulo?
9. ¿Cuándo puede ser útil un handler?
10. ¿Qué papel tienen las colecciones?
11. ¿Qué diferencia general hay entre Ansible y Terraform?
12. ¿Qué riesgos introduce un inventario demasiado amplio?
13. ¿Qué controla `--limit`?
14. ¿Qué hace el check mode?
15. ¿Por qué check mode no garantiza que no haya efectos?
16. ¿Qué puede revelar diff mode?
17. ¿Cuándo debería utilizarse `become`?
18. ¿Por qué no deben guardarse secretos en un playbook?
19. ¿Qué datos conviene registrar en una ejecución?
20. ¿Qué hacer ante un fallo parcial?
21. ¿Qué condiciones hacen que Ansible sea buen encaje?
22. ¿Qué condiciones sugieren que otra herramienta sería más adecuada?
23. ¿Por qué el control node debe protegerse?
24. ¿Qué evidencia demuestra que la práctica se limitó a `localhost`?
25. ¿Qué parte de un playbook debe revisarse antes de ejecutarlo?

---

## Glosario

- **Ansible:** herramienta de automatización para tareas de configuración y operación.
- **Control node:** sistema desde el que se ejecutan playbooks.
- **Managed node:** host administrado por Ansible.
- **Inventario:** lista o estructura que define hosts, grupos y variables.
- **Playbook:** archivo YAML que describe plays y tareas.
- **Play:** conjunto de tareas dirigido a un grupo de hosts.
- **Tarea:** unidad de trabajo dentro de un play.
- **Módulo:** componente que ejecuta una operación estructurada.
- **Colección:** paquete de módulos, plugins, roles y contenido relacionado.
- **Role:** estructura reutilizable para organizar automatización Ansible.
- **Handler:** tarea que se ejecuta cuando recibe una notificación.
- **Fact:** dato recopilado sobre un host.
- **Idempotencia:** propiedad por la que repetir una tarea conserva el estado deseado sin cambios adicionales innecesarios.
- **Check mode:** modo que intenta mostrar cambios previstos sin aplicarlos, cuando el módulo lo admite.
- **Diff mode:** modo que muestra diferencias de contenido compatibles.
- **`become`:** mecanismo de escalada de privilegios.
- **YAML:** formato de serialización legible utilizado por muchos playbooks.
- **Inventario estático:** inventario escrito directamente en un archivo.
- **Inventario dinámico:** inventario generado o consultado desde una fuente externa.
- **Límite (`--limit`):** restricción de los hosts seleccionados para una ejecución.
- **Despliegue:** proceso de poner una versión de aplicación o configuración en un entorno.
- **Módulo de shell:** módulo que ejecuta instrucciones mediante una shell.
- **Módulo command:** módulo que ejecuta un comando sin interpretar necesariamente una shell.
- **Ansible Vault:** función para cifrar datos mediante el mecanismo de Ansible.
- **Configuración como código:** práctica de mantener configuraciones y automatizaciones en archivos revisables y versionados.

---

## Plantilla de diseño de un playbook

```text
Nombre:
Objetivo:
Inventario:
Grupos seleccionados:
Hosts incluidos:
Sistema operativo:
Versión de Ansible:
Variables:
Módulos:
¿Usa become?:
¿Usa credenciales?:
Modo de prueba:
Cambio esperado:
Comprobación posterior:
Procedimiento de detención:
Responsable:
```

No escribas valores secretos en esta ficha.

---

## Plantilla de revisión previa

```text
¿El inventario es el correcto?:
¿Los hosts seleccionados son los esperados?:
¿El playbook está revisado?:
¿Se entienden todos los módulos?:
¿Hay tareas con shell o command?:
¿Se usa become?:
¿Hay secretos o archivos sensibles?:
¿Se probó en un entorno aislado?:
¿Se revisó check mode?:
¿Existe autorización?:
Decisión:
Motivo:
```

Si el alcance o el impacto no están claros, no ejecutes el playbook.

---

## Síntesis final

Ansible puede convertir tareas repetitivas de configuración y operación en procedimientos revisables y reproducibles.

- Usa inventarios para definir el alcance.
- Usa playbooks para describir tareas.
- Prefiere módulos específicos cuando se ajusten al objetivo.
- Diseña tareas idempotentes siempre que sea posible.
- Comprueba la idempotencia mediante pruebas, no por suposición.
- Revisa hosts, variables, permisos y cambios antes de ejecutar.
- Trata el nodo de control y sus credenciales como activos sensibles.
- Usa check mode como ayuda, no como garantía.
- Distingue Ansible de Terraform y de otras herramientas.
- Empieza en `localhost` y escala solo con autorización.
- Mantén playbooks, inventarios y dependencias bajo revisión.
- No confundas automatización con aprobación o seguridad automática.