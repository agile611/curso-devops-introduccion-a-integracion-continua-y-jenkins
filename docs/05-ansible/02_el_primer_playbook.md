# 02_el_primer_playbook.md — Crear y ejecutar el primer playbook de Ansible

Esta guía acompaña al alumnado desde la preparación de un laboratorio local hasta la escritura, revisión y ejecución de un primer playbook. El proyecto se limita a `localhost` y a un directorio temporal de práctica: no requiere servidores remotos, credenciales ni privilegios administrativos.

El objetivo es aprender el flujo completo: identificar el inventario, describir una tarea con YAML, validar la sintaxis, prever el resultado y comprobar qué ocurre al repetir la ejecución. La primera automatización debe ser pequeña y comprensible; la seguridad empieza por saber exactamente **qué host se seleccionó y qué hará cada tarea**.

> **Límite del laboratorio:** ejecuta los ejemplos en `localhost` o en el entorno aislado autorizado por el curso. No añadas hosts reales, credenciales ni tareas de administración del sistema. Los ejemplos de modificación usan una ruta temporal concreta y no necesitan `become`.

---

## Objetivos y alcance

La guía se centra en construir un playbook inicial que sea pequeño, legible y seguro para practicar.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar la estructura básica de un playbook.
- Distinguir inventario, play, tarea y módulo.
- Crear un inventario que seleccione únicamente `localhost`.
- Escribir YAML válido con nombres de tareas descriptivos.
- Ejecutar una tarea de observación con `debug`.
- Crear un directorio dentro de una ruta temporal de laboratorio.
- Ejecutar `ansible-playbook --syntax-check`.
- Limitar una ejecución a un host conocido.
- Interpretar `ok`, `changed`, `skipped` y `failed`.
- Observar idempotencia mediante una segunda ejecución.
- Usar variables para evitar repetir valores.
- Probar check mode y diff mode con precaución.
- Identificar por qué no se deben guardar secretos en el playbook.
- Diagnosticar fallos de inventario, sintaxis y permisos.
- Documentar la práctica sin incluir datos sensibles.

### Qué se construirá

El laboratorio tendrá:

- Un inventario INI local.
- Un archivo `ansible.cfg` sencillo.
- Un playbook de observación.
- Una tarea que asegura un directorio temporal.
- Una variable no sensible.
- Una comprobación de sintaxis.
- Una prueba de idempotencia.
- Una práctica de revisión con check mode.

### Qué queda fuera

Esta página no configura:

- Servidores remotos.
- Hosts de producción.
- Usuarios del sistema.
- Paquetes de sistema.
- Servicios.
- Claves SSH.
- Contraseñas.
- Tokens.
- Escalada de privilegios.
- Despliegues de aplicaciones reales.
- Automatización de cambios de red.

### Entorno recomendado

Usa uno de estos entornos:

- Tu estación de trabajo, solo si el curso autoriza los ejercicios locales.
- Una máquina virtual de laboratorio.
- Un contenedor aislado preparado por el docente.
- Un agente de CI designado para prácticas locales.

No ejecutes los ejemplos en un host compartido sin revisar la política del curso.

### Reglas del laboratorio

- El inventario debe incluir únicamente `localhost`.
- El playbook no debe usar `become`.
- Las tareas de cambio deben permanecer bajo la ruta temporal indicada.
- No agregues hosts de una red real.
- No uses claves ni contraseñas personales.
- Lee cada tarea antes de ejecutar el playbook.
- Revisa los cambios de Git antes de confirmarlos.
- No compartas salidas que revelen rutas o datos restringidos.

---

## Qué es un playbook

Un playbook describe una o varias operaciones que Ansible ejecutará sobre hosts seleccionados.

### Playbooks, plays y tareas

La estructura habitual se entiende así:

```text
Playbook
└── Play
    ├── Selección de hosts
    ├── Variables y opciones
    └── Tareas
        ├── Tarea 1
        ├── Tarea 2
        └── Tarea 3
```

Un playbook puede contener varios plays.

Cada play puede dirigirse a un grupo distinto.

### Playbook

El playbook es el archivo YAML que contiene los plays.

Es común utilizar la extensión:

```text
.yml
```

También es válido encontrar archivos con extensión:

```text
.yaml
```

En esta guía se utiliza `playbook.yml`.

### Play

Un play define el grupo o los hosts de destino y reúne tareas relacionadas.

Puede incluir:

- `name`
- `hosts`
- `connection`
- `gather_facts`
- `vars`
- `tasks`
- `handlers`
- Opciones de privilegio, si están justificadas

### Tarea

Una tarea es una unidad de trabajo.

Una tarea bien nombrada permite entender su propósito sin tener que inferirlo del módulo.

Nombre poco descriptivo:

```yaml
- name: Paso 1
```

Nombre más informativo:

```yaml
- name: Comprobar que el inventario local responde
```

### Módulo

Una tarea invoca normalmente un módulo de Ansible.

Ejemplos del laboratorio:

- `ansible.builtin.debug`: muestra un mensaje de práctica.
- `ansible.builtin.file`: asegura un estado para un archivo o directorio.
- `ansible.builtin.ping`: comprueba que Ansible puede comunicarse con un host.
- `ansible.builtin.template`: renderiza un archivo a partir de una plantilla.

### Inventario

El inventario define los destinos disponibles.

En el laboratorio, el inventario solo contendrá `localhost`.

Comprueba siempre el inventario y la selección antes de ejecutar cambios.

### Variables

Las variables separan los valores configurables de la estructura de las tareas.

Una variable permite cambiar un valor sin editar cada referencia por separado.

No utilices variables corrientes para almacenar secretos.

### Facts

Ansible puede recopilar facts sobre un host.

Los facts pueden incluir información del sistema, como arquitectura o sistema operativo.

Este primer playbook desactiva la recopilación automática de facts para mantener la salida sencilla.

### Idempotencia

Una tarea es idempotente cuando repetirla mantiene el estado deseado sin producir cambios adicionales innecesarios.

Una tarea que asegura que un directorio existe suele ser idempotente:

- En la primera ejecución puede crearlo.
- En una repetición puede informar que no hay cambios.

La idempotencia depende del módulo, los parámetros y el diseño.

### Salidas por tarea

Ansible suele clasificar resultados por host con estados como:

- `ok`: la tarea terminó sin cambios reportados.
- `changed`: la tarea modificó algo o informa un cambio previsto.
- `skipped`: la tarea se omitió.
- `failed`: la tarea falló.
- `unreachable`: Ansible no pudo acceder al host.

La interpretación concreta depende de la tarea y del módulo.

---

## Preparar el laboratorio

La preparación reduce errores de ruta e inventario antes de escribir tareas.

### Requisitos

Se necesita:

- Ansible instalado.
- Python compatible con la instalación elegida.
- Terminal.
- Editor de texto.
- Acceso a un directorio de práctica.
- Permiso para escribir bajo `/tmp/ansible-lab` en un sistema Unix-like.

Si el sistema del curso no utiliza `/tmp`, consulta la ruta aprobada antes de modificar el playbook.

### Verificar Ansible

```bash
ansible --version
```

```bash
ansible-playbook --version
```

Anota la versión para la entrega.

No actualices Ansible en un agente compartido sin autorización.

### Crear el directorio del proyecto

En Unix-like:

```bash
mkdir -p laboratorio-primer-playbook
cd laboratorio-primer-playbook
```

En PowerShell:

```powershell
New-Item -ItemType Directory -Force laboratorio-primer-playbook
Set-Location laboratorio-primer-playbook
```

### Estructura de archivos

```text
laboratorio-primer-playbook/
├── ansible.cfg
├── inventory.ini
├── playbook.yml
└── README.md
```

Los archivos se crean progresivamente durante las sesiones.

### Archivo `README.md`

Crea una descripción simple:

```text
Primer playbook de Ansible.
El inventario de laboratorio apunta únicamente a localhost.
El ejercicio no utiliza credenciales ni privilegios elevados.
```

### Revisar el directorio actual

En Unix-like:

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Asegúrate de estar en el proyecto de laboratorio antes de crear archivos.

### No trabajar desde un repositorio sensible

No utilices como carpeta de trabajo:

- Un checkout de producción.
- Un repositorio con credenciales.
- Un workspace de otra persona.
- Un directorio compartido cuya limpieza no conozcas.

---

## Crear el inventario local

El inventario determina qué host está disponible para el playbook.

### Inventario INI

Crea `inventory.ini`:

```ini
[local]
localhost ansible_connection=local
```

El grupo `local` contiene únicamente `localhost`.

`ansible_connection=local` solicita una conexión local para este destino.

### Por qué usar `localhost`

`localhost` permite aprender la estructura de un playbook sin conectarse a un servidor remoto.

Aun así, las tareas se ejecutan sobre el sistema local.

Por eso deben seguir limitadas y revisadas.

### No añadir hosts reales

No agregues direcciones IP, nombres DNS o equipos de una red real a esta práctica.

Un inventario incorrecto puede ampliar el alcance de una ejecución.

### Verificar el inventario

```bash
ansible-inventory -i inventory.ini --list
```

Confirma que la salida incluye únicamente el host del laboratorio.

### Mostrar los hosts coincidentes

```bash
ansible -i inventory.ini local --list-hosts
```

El resultado debe indicar solo `localhost`.

### Inventario por defecto

También puedes configurar un inventario por defecto en `ansible.cfg`.

Aun así, en ejercicios y trabajos sensibles es útil pasar `-i inventory.ini` de forma explícita para que el comando deje claro qué inventario utiliza.

---

## Configuración de Ansible

Un archivo local de configuración ayuda a mantener los comandos del laboratorio consistentes.

### Archivo `ansible.cfg`

Crea `ansible.cfg`:

```ini
[defaults]
inventory = ./inventory.ini
host_key_checking = True
```

Esta configuración define el inventario predeterminado de este proyecto.

### Configuración local

Ansible puede leer configuración desde distintos lugares.

La ruta activa depende del entorno y de la versión.

Consulta la salida de:

```bash
ansible --version
```

Revisa cuál es el archivo de configuración utilizado.

### No desactivar controles por comodidad

No desactives comprobaciones de host o controles de seguridad simplemente para eliminar un mensaje.

Primero determina qué control produjo el aviso y por qué.

### Usar `-i` explícitamente

Aunque exista `ansible.cfg`, puedes especificar el inventario en cada comando:

```bash
ansible-playbook -i inventory.ini playbook.yml
```

Esto hace visible la selección del archivo de inventario.

### Comprobar la configuración

Antes de continuar, verifica:

- La ruta del archivo.
- La sintaxis INI.
- El grupo `local`.
- El host `localhost`.
- La conexión local.
- La ausencia de otros destinos.

---

## Primer contacto con Ansible

Antes de crear tareas que modifiquen el sistema, prueba operaciones de observación.

### Verificar el inventario

```bash
ansible-inventory -i inventory.ini --list
```

Comprueba:

- Que la carga termina sin error.
- Que el grupo se llama `local`.
- Que el único host es `localhost`.
- Que la conexión es `local`.

### Listar los hosts seleccionados

```bash
ansible -i inventory.ini local --list-hosts
```

No continúes si el resultado incluye un host inesperado.

### Probar conectividad local

```bash
ansible -i inventory.ini local -m ansible.builtin.ping
```

El módulo `ansible.builtin.ping` comprueba la interacción de Ansible con el host.

No es el `ping` de red del sistema operativo.

### Verificar el módulo con `localhost`

También puedes probar:

```bash
ansible localhost -m ansible.builtin.ping -c local
```

`-c local` solicita el transporte local en esta prueba.

### Consultar ayuda de un módulo

```bash
ansible-doc ansible.builtin.debug
```

```bash
ansible-doc ansible.builtin.file
```

Usa `ansible-doc` para comprobar los parámetros de la versión instalada.

### Consultar opciones de playbook

```bash
ansible-playbook --help
```

Lee las opciones relacionadas con:

- Inventario.
- Límite de hosts.
- Check mode.
- Diff mode.
- Comprobación de sintaxis.

### Leer la salida

En el resumen puede aparecer una tabla de resultados por host.

Para este laboratorio, presta atención a:

- El nombre del host.
- La tarea ejecutada.
- El estado de cada tarea.
- El número total de cambios.
- Los errores de sintaxis o conexión.

### Resultado esperado

La prueba de conectividad debería terminar correctamente para `localhost`.

Si falla:

- Comprueba Ansible.
- Comprueba la ruta al inventario.
- Comprueba la conexión local.
- Comprueba el directorio actual.
- No añadas un host remoto para evitar el error.

---

## Escribir el primer playbook

El primer playbook solo mostrará un mensaje de práctica.

### Crear `playbook.yml`

```yaml
---
- name: Primer playbook local
  hosts: localhost
  connection: local
  gather_facts: false

  tasks:
    - name: Mostrar un mensaje de laboratorio
      ansible.builtin.debug:
        msg: "Ansible ejecuta este playbook en localhost."
```

### Marcador YAML

La línea inicial:

```yaml
---
```

marca el comienzo de un documento YAML.

Se utiliza habitualmente en playbooks.

### Nombre del play

```yaml
name: Primer playbook local
```

El nombre ayuda a identificar el play en la salida.

Elige descripciones claras, no nombres genéricos como `prueba1`.

### Selección de hosts

```yaml
hosts: localhost
```

El play se dirige a `localhost`.

Esta selección se mantiene limitada al objetivo de la práctica.

### Conexión local

```yaml
connection: local
```

Indica que el ejemplo debe ejecutarse localmente.

Confirma que el entorno admite esta conexión.

### Recopilación de facts

```yaml
gather_facts: false
```

Desactiva la recopilación automática de facts en este ejemplo.

Esto reduce información y mantiene breve la práctica.

### Lista de tareas

```yaml
tasks:
```

Las tareas aparecen como elementos de una lista YAML.

Cada elemento empieza con un guion.

### Nombre de tarea

```yaml
- name: Mostrar un mensaje de laboratorio
```

El nombre explica lo que se intenta hacer.

### Módulo `debug`

```yaml
ansible.builtin.debug:
```

El nombre totalmente cualificado identifica el módulo incorporado.

### Parámetro `msg`

```yaml
msg: "Ansible ejecuta este playbook en localhost."
```

El mensaje es texto de práctica y no contiene información sensible.

### Reglas de indentación

- Usa espacios, no tabulaciones.
- Mantén la indentación consistente.
- Anida cada parámetro bajo la tarea correspondiente.
- Revisa cada nivel antes de ejecutar.
- No alinees YAML con tabulaciones.

### Buenas prácticas de nombres

Los nombres deberían explicar:

- Qué comprueba la tarea.
- Qué recurso asegura.
- Qué acción se realiza.
- Qué alcance tiene.

Evita usar nombres que oculten una acción, como `Preparación` para una tarea que borra archivos.

---

## Validar y ejecutar

Valida el archivo antes de ejecutarlo.

### Comprobación de sintaxis

```bash
ansible-playbook -i inventory.ini --syntax-check playbook.yml
```

Una comprobación satisfactoria indica que Ansible pudo interpretar la estructura básica.

No confirma que las tareas sean seguras.

### Ejecutar con límite explícito

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

Usar `--limit localhost` refuerza el alcance en este ejercicio.

### Ejecutar con mayor verbosidad

No aumentes la verbosidad por defecto.

Una ejecución más detallada puede mostrar información adicional.

Si se necesita diagnosticar, sigue el procedimiento del curso y revisa la salida antes de compartirla.

### Interpretar `ok`

`ok` indica que la tarea terminó correctamente sin informar un cambio.

En una tarea de `debug`, es normal que no haya un cambio de sistema.

### Interpretar `changed`

`changed` indica que la tarea informa un cambio o un cambio previsto.

No concluyas que la ejecución es incorrecta solo porque aparece `changed`.

Comprueba qué tarea lo produjo.

### Interpretar `skipped`

`skipped` indica que la tarea no se ejecutó por una condición, una etiqueta o una selección.

Revisa la configuración para entender por qué se omitió.

### Interpretar `failed`

`failed` indica que una tarea no se completó correctamente.

Identifica el host y el nombre de tarea antes de decidir cómo continuar.

### Interpretar `unreachable`

`unreachable` indica que Ansible no pudo llegar al host seleccionado.

En esta práctica, comprueba primero el inventario y la conexión local.

### Repetir la ejecución

Vuelve a ejecutar:

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

El playbook de solo observación debería poder ejecutarse repetidamente.

### Registrar la ejecución

Anota:

- Versión de Ansible.
- Nombre del playbook.
- Inventario utilizado.
- Host seleccionado.
- Resultado general.
- Número de errores.
- Mensaje mostrado.

No copies salidas largas si contienen rutas internas o datos no requeridos.

---

## Añadir una tarea de cambio local

Después de comprobar la sintaxis, se puede añadir una tarea de bajo impacto en una ruta temporal concreta.

### Alcance de la tarea

La siguiente tarea administra únicamente:

```text
/tmp/ansible-lab
```

No cambies la ruta a un directorio del sistema.

### Añadir el módulo `file`

Incluye la siguiente tarea en `tasks`:

```yaml
    - name: Asegurar que existe el directorio temporal del laboratorio
      ansible.builtin.file:
        path: /tmp/ansible-lab
        state: directory
        mode: "0750"
```

### Qué hace `path`

`path` señala el directorio de práctica.

Comprueba el valor antes de ejecutar.

### Qué hace `state: directory`

Solicita que el objeto sea un directorio.

Si no existe, Ansible puede crearlo.

Si existe con el estado adecuado, la tarea normalmente no necesita modificarlo.

### Qué hace `mode`

`mode` define permisos para el directorio.

Se escribe como una cadena para evitar interpretaciones ambiguas de YAML.

### No utilizar privilegios elevados

El directorio `/tmp/ansible-lab` normalmente se puede crear sin privilegios administrativos, sujeto a la configuración del sistema.

No añadas:

```yaml
become: true
```

para resolver un error sin entenderlo.

### Ejecutar la tarea

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

Lee la salida y confirma que la tarea afectó al destino previsto.

### Comprobar el directorio

En Unix-like:

```bash
test -d /tmp/ansible-lab && echo "Directorio presente"
```

En PowerShell, esta ruta y el módulo pueden no ser adecuados.

Utiliza una práctica Windows preparada por el curso si el sistema no es Unix-like.

### Comprobar permisos

En Unix-like:

```bash
stat -c '%a %n' /tmp/ansible-lab
```

La sintaxis de `stat` puede variar entre distribuciones.

Si no está disponible, usa una herramienta de inspección aprobada.

---

## Verificar idempotencia

La repetición permite observar si el módulo mantiene el estado deseado.

### Primera ejecución

En la primera ejecución:

- El directorio podría no existir.
- Ansible podría crearlo.
- La tarea podría aparecer como `changed`.

### Segunda ejecución

Ejecuta el mismo playbook otra vez.

Si el directorio ya cumple el estado solicitado, la tarea normalmente aparecerá como `ok`.

### Comparar resultados

Registra:

```text
Primera ejecución:
Segunda ejecución:
Tarea que informó cambios:
Estado observado del directorio:
```

### Qué no demuestra la idempotencia

Una segunda ejecución sin cambios no demuestra que:

- Todas las tareas del playbook sean idempotentes.
- No haya efectos externos.
- El playbook sea seguro en otros hosts.
- Los permisos sean correctos para producción.
- No existan errores en otras tareas.

### Tareas no idempotentes

Un comando que añade una línea cada vez que se ejecuta puede producir duplicados.

Un comando que reinicia un servicio siempre puede generar interrupciones repetidas.

Antes de incluir una acción, comprueba su comportamiento ante ejecuciones repetidas.

### Módulos y estados deseados

El módulo `file` recibe un estado deseado explícito.

Esto facilita que Ansible evalúe si el directorio existe con las condiciones solicitadas.

### Resultado por host

El resumen de la ejecución ayuda a comprobar el resultado del host.

Lee el nombre del host y no te limites al número total de cambios.

---

## Limpiar solo el recurso del laboratorio

La limpieza debe ser exacta y deliberada.

### Confirmar la ruta

Antes de limpiar, confirma que la tarea creó únicamente:

```text
/tmp/ansible-lab
```

No utilices una variable sin revisar su valor.

### Limpieza manual supervisada

Si el curso solicita retirar el directorio, utiliza el mecanismo indicado por el docente y verifica la ruta antes de confirmar.

No ejecutes comandos de borrado con rutas variables o ambiguas.

### Tarea de limpieza opcional

Una tarea para retirar un directorio temporal **solo se muestra para análisis**:

```yaml
    - name: Retirar el directorio temporal del laboratorio
      ansible.builtin.file:
        path: /tmp/ansible-lab
        state: absent
```

No la añadas al playbook principal sin autorización.

### Riesgo de `state: absent`

`state: absent` solicita eliminar el objeto.

En el caso de un directorio, la eliminación puede afectar a su contenido.

Comprueba cuidadosamente:

- Ruta.
- Host.
- Inventario.
- Variable.
- Permisos.
- Alcance.

### Evitar rutas amplias

No uses rutas como:

```text
/
```

```text
/home
```

```text
/tmp
```

como objetivo de una tarea de limpieza.

### Comprobar después de limpiar

Verifica que solo se retiró el recurso de laboratorio esperado.

No uses la limpieza como método para eliminar archivos ajenos.

---

## Variables y plantillas

Las variables facilitan reutilizar tareas sin repetir valores.

### Definir una variable en el play

El playbook puede incluir:

```yaml
  vars:
    directorio_laboratorio: /tmp/ansible-lab
```

Coloca `vars` al mismo nivel que `hosts` y `tasks`.

### Referenciar una variable

En una tarea YAML:

```yaml
        path: "{{ directorio_laboratorio }}"
```

Ansible evalúa la expresión y pasa el valor al módulo.

### Playbook con variable

```yaml
---
- name: Primer playbook local
  hosts: localhost
  connection: local
  gather_facts: false

  vars:
    directorio_laboratorio: /tmp/ansible-lab

  tasks:
    - name: Asegurar que existe el directorio de práctica
      ansible.builtin.file:
        path: "{{ directorio_laboratorio }}"
        state: directory
        mode: "0750"
```

### No interpolar sin necesidad

Usa la variable donde corresponda y evita construir rutas o comandos con concatenaciones difíciles de revisar.

### Variables de inventario

Las variables también pueden asociarse a hosts o grupos.

En un laboratorio inicial, mantener la variable dentro del playbook puede facilitar la comprensión.

### Variables en archivos externos

Los archivos externos de variables pueden ser útiles en proyectos más grandes.

Deben estar versionados o ignorados según su contenido y la política del equipo.

### Valores no sensibles

Las variables de este ejercicio son datos descriptivos y rutas temporales.

No contienen claves ni contraseñas.

### Secretos

No escribas secretos en:

- `playbook.yml`.
- Inventario.
- `ansible.cfg`.
- Archivos de ejemplo.
- Scripts.
- Logs.
- Parámetros visibles.

Utiliza el sistema de secretos autorizado para el curso.

### Ansible Vault

Ansible Vault puede cifrar datos para determinados flujos.

No sustituye la gestión del acceso a:

- Contraseña de Vault.
- Archivos temporales descifrados.
- Logs.
- Repositorio.
- Agente que ejecuta Ansible.

No se necesita Vault en esta guía.

---

## Inventario y alcance

El inventario determina los hosts que un playbook puede seleccionar.

### Inventario INI del laboratorio

```ini
[local]
localhost ansible_connection=local
```

Este archivo es la opción recomendada para las primeras sesiones.

### Inventario YAML de laboratorio

El inventario también puede representarse en YAML:

```yaml
all:
  children:
    local:
      hosts:
        localhost:
          ansible_connection: local
```

Utiliza un solo formato por archivo y comprueba su sintaxis.

### Grupos

El grupo `local` permite seleccionar el host con:

```yaml
hosts: local
```

En este ejemplo el grupo contiene solo `localhost`.

### `hosts: localhost`

Un play también puede dirigirse directamente a:

```yaml
hosts: localhost
```

La selección debe coincidir con el inventario activo.

### Inventario explícito

Para hacer visible qué archivo se utiliza:

```bash
ansible-playbook -i inventory.ini playbook.yml
```

### Límite explícito

Para restringir la selección:

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

El límite reduce la selección de hosts de esa ejecución.

No corrige un playbook con tareas inseguras.

### Mostrar los hosts seleccionados

```bash
ansible -i inventory.ini local --list-hosts
```

Usa esta comprobación antes de ejecutar tareas de cambio.

### Revisar inventarios de equipo

En un entorno administrado, revisa:

- Nombre del inventario.
- Grupos.
- Hosts.
- Variables.
- Entorno.
- Duplicados.
- Límites.
- Origen de los datos.

### Inventarios dinámicos

Un inventario dinámico puede obtener hosts desde un sistema externo.

No lo conectes durante el laboratorio.

Comprueba su alcance, credenciales y datos devueltos antes de usarlo en otro contexto.

---

## Módulos habituales para el primer playbook

Los ejemplos utilizan módulos incorporados y operaciones limitadas.

### `ansible.builtin.debug`

Muestra un mensaje o valor de diagnóstico.

Ejemplo:

```yaml
- name: Mostrar una nota de práctica
  ansible.builtin.debug:
    msg: "Tarea de observación, sin cambios en el sistema."
```

No lo uses para imprimir secretos.

### `ansible.builtin.file`

Administra estado de archivos y directorios.

Ejemplo:

```yaml
- name: Asegurar un directorio temporal
  ansible.builtin.file:
    path: /tmp/ansible-lab
    state: directory
    mode: "0750"
```

Comprueba la ruta y el host antes de ejecutarlo.

### `ansible.builtin.copy`

Copia contenido o un archivo de origen a un destino.

Puede modificar archivos del sistema.

En esta guía no se copia una configuración de sistema.

### `ansible.builtin.template`

Renderiza una plantilla a un archivo.

El contenido resultante puede incluir valores sensibles.

Revisa el diff antes de compartirlo.

### `ansible.builtin.command`

Ejecuta un comando sin la interpretación completa de una shell.

Aun así, el comando puede modificar el sistema.

Úsalo solo con un propósito claro y revisado.

### `ansible.builtin.shell`

Ejecuta instrucciones a través de una shell.

Puede interpretar operadores, sustituciones y metacaracteres.

Evítalo si un módulo específico ofrece el mismo resultado.

### `ansible.builtin.ping`

Comprueba que Ansible puede comunicarse con el host administrado.

No es una comprobación ICMP de red.

### Nombre totalmente cualificado

Usar nombres como:

```yaml
ansible.builtin.file:
```

indica la colección y el módulo.

Puede mejorar claridad y evitar ambigüedades.

### Consultar documentación

```bash
ansible-doc ansible.builtin.file
```

La documentación local corresponde a la instalación activa.

---

## Check mode y diff mode

Estos modos pueden ayudar a revisar una ejecución antes de cambiar el sistema.

### Ejecutar check mode

```bash
ansible-playbook \
  -i inventory.ini \
  playbook.yml \
  --limit localhost \
  --check
```

El modo check intenta predecir cambios sin aplicarlos, cuando el módulo lo admite.

### Qué puede mostrar

El resultado puede indicar:

- Que no se esperan cambios.
- Que un cambio podría realizarse.
- Que la tarea se omitió.
- Que el módulo no puede simular la operación.
- Que faltan datos para predecir el resultado.

### Limitaciones del check mode

Check mode no garantiza que:

- No se produzca ningún efecto.
- Todos los módulos simulen completamente.
- La ejecución normal se comporte igual.
- El inventario sea correcto.
- Las credenciales estén protegidas.
- Los cambios sean adecuados.

### Ejecutar diff mode

```bash
ansible-playbook \
  -i inventory.ini \
  playbook.yml \
  --limit localhost \
  --check \
  --diff
```

Diff mode puede mostrar diferencias de contenido.

### Revisar la salida de diff

Antes de compartir la salida, comprueba que no incluya:

- Tokens.
- Contraseñas.
- Claves privadas.
- Configuración interna.
- Rutas sensibles.
- Datos personales.

### No usar check mode como única aprobación

La revisión debe incluir:

- Inventario.
- Playbook.
- Variables.
- Módulos.
- Hosts seleccionados.
- Cambios previsibles.
- Permisos.
- Ventana de ejecución, si corresponde.

### Comparar check y ejecución normal

En la práctica local, compara las salidas de check mode y una ejecución autorizada.

Explica qué predijo correctamente y qué no mostró.

No ejecutes una tarea remota para comprobarlo.

---

## Primer playbook completo

Este ejemplo muestra una versión de observación y otra que crea un directorio temporal.

### Versión de observación

```yaml
---
- name: Observar la ejecución local
  hosts: localhost
  connection: local
  gather_facts: false

  tasks:
    - name: Mostrar un mensaje del laboratorio
      ansible.builtin.debug:
        msg: "Este playbook se limita a localhost."

    - name: Mostrar el propósito de la práctica
      ansible.builtin.debug:
        msg: "El objetivo es aprender inventario, YAML y tareas."
```

### Ejecutar la versión de observación

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

### Versión con directorio temporal

```yaml
---
- name: Preparar un directorio temporal de práctica
  hosts: localhost
  connection: local
  gather_facts: false

  vars:
    directorio_laboratorio: /tmp/ansible-lab

  tasks:
    - name: Mostrar el alcance del ejercicio
      ansible.builtin.debug:
        msg: "Solo se administrará el directorio temporal del laboratorio."

    - name: Asegurar que existe el directorio de práctica
      ansible.builtin.file:
        path: "{{ directorio_laboratorio }}"
        state: directory
        mode: "0750"
```

### Explicación por tareas

La primera tarea solo presenta un mensaje.

La segunda tarea pide que exista el directorio.

La variable evita repetir la ruta dentro de la lógica de la tarea.

El play se limita a `localhost`.

No se utiliza escalada de privilegios.

### Salida esperada

La salida puede incluir:

- El nombre del play.
- El nombre de cada tarea.
- El resultado por host.
- Un resumen de `ok`, `changed`, `unreachable` y `failed`.

El detalle exacto puede variar según la versión de Ansible.

### Repetir el playbook

Después de la primera ejecución, vuelve a ejecutar:

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

Compara el resultado de la tarea `file`.

### Confirmar el destino

Comprueba que el directorio de práctica existe.

No inspecciones directorios de otros usuarios.

---

## Sesiones prácticas

Las sesiones siguen una secuencia gradual: observar, escribir, validar y modificar un recurso temporal.

### Preparación común

Antes de comenzar cada sesión:

- Comprueba la ruta del proyecto.
- Comprueba la versión de Ansible.
- Revisa el inventario.
- Confirma que solo contiene `localhost`.
- Lee el playbook completo.
- No añadas `become`.
- No añadas credenciales.
- No uses un host remoto.
- No copies salidas sensibles a la entrega.

### Sesión 1: explorar la instalación

**Objetivo:** conocer la versión y la configuración activa.

#### Pasos

1. Ejecuta `ansible --version`.
2. Ejecuta `ansible-playbook --version`.
3. Anota la versión.
4. Identifica la ruta de configuración.
5. Compara con la versión indicada por el docente.
6. No actualices paquetes del sistema sin permiso.

#### Preguntas

- ¿Qué versión de Ansible aparece?
- ¿Qué Python utiliza?
- ¿Qué archivo de configuración reconoce?
- ¿Por qué esta información ayuda al diagnóstico?

### Sesión 2: crear el proyecto

**Objetivo:** construir la estructura mínima de archivos.

#### Pasos

1. Crea la carpeta de práctica.
2. Crea `inventory.ini`.
3. Crea `ansible.cfg`.
4. Crea `README.md`.
5. Comprueba `pwd` o `Get-Location`.
6. Lista los archivos.
7. No utilices una carpeta compartida desconocida.

### Sesión 3: revisar el inventario

**Objetivo:** confirmar que el único destino es `localhost`.

#### Comandos

```bash
ansible-inventory -i inventory.ini --list
```

```bash
ansible -i inventory.ini local --list-hosts
```

#### Pasos

1. Ejecuta ambos comandos.
2. Revisa el nombre del grupo.
3. Revisa el host.
4. Revisa la conexión.
5. Comprueba que no aparecen otros destinos.
6. Registra el resultado.

### Sesión 4: probar `ansible.builtin.ping`

**Objetivo:** comprobar la comunicación local de Ansible.

#### Comando

```bash
ansible -i inventory.ini local -m ansible.builtin.ping
```

#### Pasos

1. Ejecuta desde la carpeta de práctica.
2. Lee el resultado por host.
3. Explica por qué no se prueba ICMP.
4. Comprueba que no se conectó a un servidor remoto.
5. Anota el resultado sin copiar información innecesaria.

### Sesión 5: escribir el primer YAML

**Objetivo:** crear un play de observación.

#### Pasos

1. Copia el ejemplo de la versión de observación.
2. Conserva la indentación.
3. Añade un nombre de play descriptivo.
4. Añade una tarea `debug`.
5. Ejecuta `--syntax-check`.
6. Corrige cualquier diagnóstico.
7. No añadas comandos de shell.

### Sesión 6: ejecutar un mensaje de práctica

**Objetivo:** ver la salida de una tarea de `debug`.

#### Comando

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost
```

#### Pasos

1. Ejecuta el playbook.
2. Identifica el nombre del play.
3. Identifica el nombre de la tarea.
4. Busca `localhost` en el resumen.
5. Explica el estado de la tarea.
6. Comprueba que no cambió un archivo.

### Sesión 7: añadir una segunda tarea de observación

**Objetivo:** reconocer la estructura de una lista de tareas.

#### Pasos

1. Añade otra tarea `debug`.
2. Dale un nombre distinto.
3. Mantén la indentación dentro de `tasks`.
4. Ejecuta la comprobación de sintaxis.
5. Ejecuta el playbook.
6. Comprueba el orden de salida.

### Sesión 8: provocar un error YAML controlado

**Objetivo:** aprender a leer un error de sintaxis.

#### Pasos

1. En una copia, cambia temporalmente una indentación.
2. Ejecuta `ansible-playbook --syntax-check`.
3. Lee la línea indicada.
4. Corrige la indentación.
5. Ejecuta de nuevo.
6. Restaura el archivo original si la práctica lo solicita.

### Sesión 9: añadir el directorio temporal

**Objetivo:** usar el módulo `file` de forma limitada.

#### Pasos

1. Añade la tarea de creación del directorio.
2. Confirma la ruta `/tmp/ansible-lab`.
3. Confirma que el play se dirige a `localhost`.
4. Ejecuta `--syntax-check`.
5. Ejecuta el playbook.
6. Comprueba que la tarea terminó.
7. No cambies la ruta a un directorio del sistema.

### Sesión 10: comparar primera y segunda ejecución

**Objetivo:** observar idempotencia.

#### Pasos

1. Ejecuta el playbook una vez.
2. Anota `changed` y `ok`.
3. Ejecuta el mismo playbook otra vez.
4. Anota de nuevo los resultados.
5. Compara ambos resúmenes.
6. Explica por qué podrían diferir.

### Sesión 11: introducir una variable

**Objetivo:** parametrizar la ruta del laboratorio.

#### Pasos

1. Añade `vars` al play.
2. Define `directorio_laboratorio`.
3. Sustituye la ruta literal por `{{ directorio_laboratorio }}`.
4. Ejecuta `--syntax-check`.
5. Ejecuta el playbook.
6. Confirma el destino.
7. No uses variables secretas.

### Sesión 12: cambiar una variable no sensible

**Objetivo:** observar el efecto de un valor de configuración.

#### Pasos

1. Cambia la ruta a otra ubicación temporal aprobada.
2. Revisa el YAML antes de ejecutar.
3. Comprueba el resultado de sintaxis.
4. Ejecuta en `localhost`.
5. Verifica qué ruta se usó.
6. Restaura la ruta acordada.

No selecciones una ruta amplia o compartida.

### Sesión 13: usar check mode

**Objetivo:** predecir cambios en el directorio temporal.

#### Comando

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost --check
```

#### Pasos

1. Ejecuta en check mode.
2. Identifica la tarea `file`.
3. Observa si predice un cambio.
4. Explica qué significa el resultado.
5. Revisa el soporte del módulo.
6. No concluyas que el modo garantiza ausencia total de efectos.

### Sesión 14: usar diff mode

**Objetivo:** ver qué información muestra diff mode.

#### Comando

```bash
ansible-playbook -i inventory.ini playbook.yml --limit localhost --check --diff
```

#### Pasos

1. Ejecuta solo sobre el laboratorio.
2. Revisa la salida.
3. Identifica si aparece contenido.
4. Explica qué datos no deben compartirse.
5. No utilices archivos secretos para esta prueba.
6. Registra el comportamiento del módulo.

### Sesión 15: consultar documentación del módulo

**Objetivo:** aprender a utilizar documentación local.

#### Comandos

```bash
ansible-doc ansible.builtin.file
```

```bash
ansible-doc ansible.builtin.debug
```

#### Pasos

1. Busca los parámetros utilizados.
2. Revisa los valores admitidos.
3. Identifica una opción que no uses.
4. Explica por qué es importante conocerla.
5. No cambies el playbook para probar opciones de borrado.

### Sesión 16: distinguir módulo y comando

**Objetivo:** explicar por qué el módulo `file` es apropiado.

#### Pasos

1. Describe la intención de `state: directory`.
2. Imagina una solución basada en shell.
3. Compara la legibilidad.
4. Compara el comportamiento al repetir.
5. Señala los riesgos de interpretar entradas de shell.
6. No ejecutes el comando hipotético.

### Sesión 17: revisar una limpieza opcional

**Objetivo:** analizar una tarea destructiva sin ejecutarla.

#### Pasos

1. Lee la tarea con `state: absent`.
2. Identifica la ruta.
3. Describe qué podría eliminar.
4. Explica por qué se omite del playbook principal.
5. Propón una confirmación previa.
6. No añadas la tarea al proyecto sin permiso.

### Sesión 18: revisar nombres de tareas

**Objetivo:** mejorar legibilidad.

#### Pasos

1. Identifica nombres genéricos.
2. Sustitúyelos por nombres descriptivos.
3. Asegúrate de no ocultar acciones.
4. Ejecuta `--syntax-check`.
5. Revisa el diff.
6. Compara la salida del playbook.

### Sesión 19: comprobar el límite

**Objetivo:** reforzar la selección del host.

#### Pasos

1. Ejecuta `--list-hosts`.
2. Ejecuta con `--limit localhost`.
3. Comprueba el resumen de hosts.
4. Verifica que el inventario no cambió.
5. Explica qué papel cumplen inventario y límite.
6. No agregues hosts remotos.

### Sesión 20: revisar una salida ficticia

**Objetivo:** identificar estados por tarea y host.

El docente entrega una salida con resultados de ejemplo.

#### Pasos

1. Localiza las tareas.
2. Identifica `ok`, `changed` y `failed`.
3. Identifica los hosts afectados.
4. Determina si hubo cambios parciales.
5. Propón la comprobación siguiente.
6. No vuelvas a ejecutar la salida de ejemplo.

### Sesión 21: revisar una variable indefinida

**Objetivo:** diagnosticar una referencia incorrecta.

#### Pasos

1. En una copia, cambia el nombre de una variable en una sola ubicación.
2. Ejecuta `--syntax-check` y el playbook solo si el docente lo permite.
3. Identifica el diagnóstico.
4. Compara el nombre declarado y el referenciado.
5. Restaura el archivo.
6. No imprimas variables de entorno.

### Sesión 22: revisar los permisos sin escalada

**Objetivo:** comprender el papel de `become`.

#### Pasos

1. Busca si el playbook contiene `become`.
2. Confirma que el ejemplo no lo necesita.
3. Describe por qué los privilegios aumentan el impacto.
4. No añadas `become: true`.
5. Anota qué aprobación se necesitaría en un caso real.

### Sesión 23: inspeccionar el estado de Git

**Objetivo:** evitar confirmar archivos generados.

#### Pasos

1. Ejecuta `git status --short`.
2. Revisa los archivos del proyecto.
3. Identifica salidas temporales.
4. Comprueba que no hay secretos.
5. Ejecuta `git diff`.
6. Confirma solo los archivos fuente autorizados.

### Sesión 24: revisión por parejas

**Objetivo:** obtener una segunda revisión del playbook.

La persona autora explica:

- Qué host se selecciona.
- Qué tareas se ejecutan.
- Qué ruta puede modificarse.
- Por qué se usa `file`.
- Cómo se comprueba idempotencia.
- Qué datos aparecen en la salida.

La persona revisora comprueba:

- El inventario contiene solo `localhost`.
- El play no usa `become`.
- La ruta es temporal y concreta.
- Los nombres de tareas son descriptivos.
- No hay credenciales.
- La sintaxis es válida.
- No hay tareas de borrado en el flujo principal.
- La salida no contiene datos innecesarios.

### Sesión 25: proyecto integrador

**Objetivo:** presentar un primer playbook seguro y comprobable.

#### Requisitos

- Inventario local.
- Playbook YAML válido.
- Host `localhost`.
- Conexión local.
- Nombre de play descriptivo.
- Al menos una tarea de observación.
- Una tarea de directorio temporal, si está autorizada.
- Variable no sensible.
- Check de sintaxis.
- Ejecución con `--limit localhost`.
- Comparación entre primera y segunda ejecución.
- Evidencia de check mode.
- Sin privilegios elevados.
- Sin hosts reales.
- Sin credenciales.

#### Entrega

Incluye:

- `inventory.ini`.
- `ansible.cfg`, si se utiliza.
- `playbook.yml`.
- `README.md`.
- Versión de Ansible.
- Resultado de sintaxis.
- Resultado de ejecución inicial.
- Resultado de ejecución repetida.
- Resumen de check mode.
- Explicación del alcance.

---

## Seguridad y buenas prácticas

La automatización debe tener límites claros antes de ejecutarse.

### Alcance mínimo

Selecciona solo:

- El inventario requerido.
- El grupo requerido.
- Los hosts necesarios.
- Las tareas del cambio.
- La duración necesaria.

### Revisar antes de ejecutar

Comprueba:

- Inventario activo.
- Directorio actual.
- Playbook ejecutado.
- Variables.
- Módulos.
- Hosts seleccionados.
- Permisos.
- Efectos potenciales.

### Credenciales

No guardes secretos en:

- `playbook.yml`.
- `inventory.ini`.
- `ansible.cfg`.
- README.
- Historial de comandos.
- Salida de `debug`.
- Logs de Jenkins.
- Capturas de pantalla.

### Credenciales temporales

En un sistema real, prefiere mecanismos aprobados y de alcance limitado cuando estén disponibles.

No inventes un método de autenticación ni copies claves entre equipos.

### Ansible Vault

Vault puede ayudar a cifrar ciertos datos.

No compartas su contraseña.

No confirmes copias descifradas.

No imprimas valores almacenados en Vault.

### Privilege escalation

No añadas `become` globalmente por comodidad.

Si una tarea necesita privilegios:

- Justifica el requisito.
- Limita la escalada a la tarea.
- Usa la identidad autorizada.
- Revisa el impacto.
- Define quién aprueba.

### Módulos antes que comandos

Prefiere módulos específicos cuando son adecuados.

Los comandos de shell pueden:

- Modificar datos de forma repetida.
- Interpretar caracteres especiales.
- Ocultar efectos.
- Producir resultados difíciles de analizar.

### Logs

Los logs deben mostrar lo suficiente para diagnosticar, no todo lo que el proceso conoce.

Revisa antes de compartir:

- Rutas.
- Hostnames.
- Facts.
- Variables.
- Contenido de archivos.
- Identificadores internos.

### Control de versiones

Versiona playbooks y configuraciones revisables.

No confirmes:

- Secretos.
- Archivos descifrados.
- Inventarios privados no autorizados.
- Datos temporales.
- Salidas de diagnóstico sensibles.

### Revisión de cambios

Utiliza una revisión antes de ampliar:

- Hosts.
- Privilegios.
- Módulos.
- Colecciones.
- Operaciones.
- Dependencias.
- Variables sensibles.

---

## Diagnóstico

Identifica el primer error y el contexto antes de cambiar la configuración.

### Ansible no se encuentra

Comprueba:

```bash
ansible --version
```

Revisa:

- Entorno virtual.
- `PATH`.
- Agente seleccionado.
- Instalación del entorno.

No instales paquetes en una máquina compartida sin autorización.

### No se encuentra el inventario

Comprueba:

- Directorio actual.
- Opción `-i`.
- Nombre del archivo.
- Permisos de lectura.
- Ruta configurada en `ansible.cfg`.

### No se reconoce el grupo

Comprueba:

- Nombre del grupo.
- Sintaxis INI.
- Archivo realmente cargado.
- Mayúsculas y minúsculas.
- Resultado de `--list-hosts`.

### El playbook no selecciona hosts

Comprueba:

- `hosts`.
- Inventario.
- Grupo.
- `--limit`.
- Nombre del host.
- Configuración activa.

No añadas un host real solo para evitar un mensaje de “no hosts matched”.

### Error de YAML

Comprueba:

- Indentación.
- Espacios frente a tabulaciones.
- Dos puntos.
- Comillas.
- Guiones de la lista.
- Nombres de claves.
- Nivel de `tasks`.

Usa:

```bash
ansible-playbook -i inventory.ini --syntax-check playbook.yml
```

### Módulo no encontrado

Comprueba:

- Nombre totalmente cualificado.
- Versión de Ansible.
- Colección instalada.
- Compatibilidad.
- Documentación local.

No instales una colección desconocida sin revisar su origen.

### Variable indefinida

Comprueba:

- Nombre declarado.
- Nombre referenciado.
- Ubicación de `vars`.
- Indentación.
- Fuente del valor.
- Archivo de variables.

No muestres el entorno completo para depurar.

### Permiso denegado

Comprueba:

- Ruta.
- Propietario.
- Permisos.
- Usuario que ejecuta.
- Si el ejercicio debe requerir privilegios.
- Si la ruta es realmente temporal.

No añadas `become` como respuesta automática.

### El directorio no se crea

Comprueba:

- Módulo.
- Ruta.
- Conexión local.
- Host seleccionado.
- Permisos.
- Resultado de la tarea.
- Sistema operativo.

### La segunda ejecución muestra `changed`

Comprueba:

- Si cambió la ruta.
- Si cambió el modo.
- Si otra tarea modifica el directorio.
- Si el módulo informa cambios por diseño.
- Si el playbook realmente es el mismo.

### La salida muestra hosts inesperados

Detén la ejecución.

Comprueba:

- Inventario.
- Grupo.
- Configuración activa.
- `--limit`.
- Nombre del play.
- Inventario dinámico.
- Variables de entorno que seleccionan archivos.

### Ficha de diagnóstico

```text
Proyecto:
Versión de Ansible:
Archivo de configuración:
Inventario:
Grupo seleccionado:
Playbook:
Host:
Tarea fallida:
Módulo:
Primer error relevante:
Resultado observado:
Hipótesis:
Comprobación siguiente:
Acción autorizada:
```

No incluyas contraseñas, claves, tokens ni datos privados.

---

## Checklist

### Preparación

- [ ] Ansible está disponible.
- [ ] El directorio de trabajo es el correcto.
- [ ] La configuración activa está identificada.
- [ ] El inventario contiene solo `localhost`.
- [ ] El playbook está revisado.
- [ ] La versión está registrada.

### Playbook

- [ ] El YAML usa espacios y tiene indentación coherente.
- [ ] Los nombres de plays son descriptivos.
- [ ] Los nombres de tareas explican su propósito.
- [ ] Se utilizan módulos adecuados.
- [ ] Las variables no contienen secretos.
- [ ] No se utiliza `become`.
- [ ] La ruta de cambio es temporal y concreta.

### Ejecución

- [ ] La sintaxis pasa.
- [ ] Los hosts seleccionados son los esperados.
- [ ] Se usa `--limit localhost`.
- [ ] La primera ejecución se revisa.
- [ ] La segunda ejecución se compara.
- [ ] Check mode se interpreta con cautela.
- [ ] Los fallos se investigan antes de repetir.

### Entrega

- [ ] Incluye los archivos fuente necesarios.
- [ ] No incluye credenciales.
- [ ] No incluye inventarios privados.
- [ ] No incluye logs completos innecesarios.
- [ ] Documenta el alcance.
- [ ] Describe la idempotencia observada.

---

## Evaluación

La evaluación valora claridad, seguridad, comprensión del alcance y capacidad de diagnóstico.

### Evidencias mínimas

Entrega:

- Inventario local.
- Playbook inicial.
- Resultado de `--syntax-check`.
- Resultado de ejecución.
- Comparación de la primera y segunda ejecución.
- Resultado de check mode.
- Breve explicación de los módulos utilizados.
- Confirmación de que no se ejecutó en hosts reales.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Estructura | Confunde play y tarea | Organiza un playbook válido | Explica y organiza varios componentes |
| Inventario | No revisa los hosts | Limita a `localhost` | Verifica selección e interpreta límites |
| YAML | Necesita correcciones frecuentes | Usa sintaxis válida | Diagnostica errores y explica su causa |
| Módulos | Usa comandos sin necesidad | Escoge módulos apropiados | Justifica idempotencia y efectos |
| Seguridad | Amplía alcance o privilegios | Mantiene el laboratorio local | Identifica riesgos de inventario, permisos y logs |
| Diagnóstico | Repite comandos | Identifica error y contexto | Formula comprobaciones verificables |
| Documentación | No registra resultados | Documenta versión y ejecución | Entrega evidencia clara y no sensible |

### Criterios de aprobación

Para completar la práctica, el alumnado debe:

- Mostrar que el inventario solo apunta a `localhost`.
- Validar la sintaxis.
- Explicar cada tarea.
- Ejecutar el playbook con un límite explícito.
- Interpretar la repetición.
- Reconocer una limitación del check mode.
- Evitar credenciales y privilegios elevados.

---

## Preguntas de repaso

1. ¿Qué contiene un playbook?
2. ¿Qué diferencia hay entre un play y una tarea?
3. ¿Qué función tiene el inventario?
4. ¿Por qué se incluye `connection: local`?
5. ¿Qué hace `gather_facts: false`?
6. ¿Qué hace el módulo `debug`?
7. ¿Qué comprueba `ansible.builtin.ping`?
8. ¿Qué diferencia hay entre `ok` y `changed`?
9. ¿Qué significa `unreachable`?
10. ¿Qué se comprueba con `--syntax-check`?
11. ¿Qué garantiza y qué no garantiza check mode?
12. ¿Qué información puede revelar diff mode?
13. ¿Por qué el módulo `file` es apropiado para crear un directorio?
14. ¿Qué significa idempotencia?
15. ¿Por qué se utiliza una ruta temporal concreta?
16. ¿Qué diferencia hay entre inventario y `--limit`?
17. ¿Por qué no se debe añadir `become` sin justificación?
18. ¿Qué riesgos introduce `shell`?
19. ¿Por qué no se guardan secretos en un playbook?
20. ¿Qué comprobarías si se seleccionan hosts inesperados?
21. ¿Qué harías ante un fallo parcial?
22. ¿Qué debe incluir un informe de práctica?
23. ¿Qué archivos no deberían compartirse?
24. ¿Cuándo sería adecuado usar Ansible?
25. ¿Qué controles se necesitarían antes de ejecutar en hosts reales?

---

## Glosario

- **Ansible:** herramienta de automatización de tareas operativas y configuración.
- **Control node:** máquina desde la que se ejecuta Ansible.
- **Managed node:** máquina administrada por Ansible.
- **Inventario:** lista o estructura que identifica hosts y grupos.
- **Playbook:** archivo YAML con uno o más plays.
- **Play:** conjunto de tareas dirigido a determinados hosts.
- **Tarea:** unidad de trabajo dentro de un play.
- **Módulo:** componente que ejecuta una operación estructurada.
- **`ansible.builtin.debug`:** módulo incorporado para mostrar mensajes o valores de diagnóstico.
- **`ansible.builtin.file`:** módulo incorporado para administrar archivos y directorios.
- **`ansible.builtin.ping`:** módulo que comprueba la interacción de Ansible con un host.
- **Variable:** valor reutilizable que parametriza una configuración.
- **Fact:** dato recopilado sobre un host.
- **Idempotencia:** propiedad por la que repetir una tarea mantiene el estado deseado sin cambios innecesarios.
- **Check mode:** modo que intenta predecir cambios sin aplicarlos, si el módulo lo admite.
- **Diff mode:** modo que presenta diferencias compatibles.
- **`become`:** mecanismo para elevar privilegios.
- **YAML:** formato de datos utilizado por los playbooks.
- **Colección:** paquete de contenido Ansible, como módulos y roles.
- **Role:** estructura reutilizable para organizar contenido Ansible.
- **Handler:** tarea ejecutada tras una notificación.
- **`--limit`:** opción para restringir los hosts seleccionados.
- **`--syntax-check`:** opción para comprobar la sintaxis básica del playbook.
- **`ansible.cfg`:** archivo de configuración de Ansible.
- **`ansible-inventory`:** herramienta para inspeccionar un inventario.
- **`ansible-doc`:** herramienta para consultar documentación local.

---

## Plantilla de entrega

```text
Nombre de la práctica:
Versión de Ansible:
Archivo de configuración:
Inventario:
Hosts seleccionados:
Playbook:
Módulos utilizados:
Resultado de syntax-check:
Resultado de primera ejecución:
Resultado de segunda ejecución:
Resultado de check mode:
¿Se modificó algún archivo?:
Ruta autorizada:
Riesgo identificado:
Conclusión:
```

No añadas credenciales, claves, datos personales ni logs completos.

### Plantilla de revisión

```text
¿El inventario contiene solo localhost?:
¿El play selecciona el host esperado?:
¿Se entienden todas las tareas?:
¿Se usa un módulo específico?:
¿La ruta de cambio es concreta?:
¿Se requiere become?:
¿Se usan secretos?:
¿Se revisó la sintaxis?:
¿Se probó check mode?:
¿La salida puede divulgar datos?:
Decisión:
Observaciones:
```

---

## Síntesis final

El primer playbook debe enseñar a pensar antes de automatizar: comprobar el inventario, leer la tarea, validar el YAML y observar el resultado.

- El inventario define qué hosts están disponibles.
- El play decide a qué hosts dirigirse.
- Las tareas invocan módulos para realizar operaciones.
- Los nombres claros facilitan la revisión.
- `localhost` permite practicar sin un servidor remoto.
- `file` puede describir el estado deseado de un directorio.
- La segunda ejecución ayuda a observar idempotencia.
- Check mode es útil, pero no garantiza que una ejecución normal carezca de efectos.
- No uses credenciales ni privilegios elevados en este laboratorio.
- No amplíes el inventario sin autorización.
- Revisa logs y diffs antes de compartirlos.