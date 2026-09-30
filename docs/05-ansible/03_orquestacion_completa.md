# 03_orquestacion_completa.md — Orquestación completa con Ansible

Esta guía integra los conceptos fundamentales de Ansible en un flujo de orquestación: inventario, configuración, plantillas, handlers, roles, validaciones, ejecución por etapas y verificación final. El objetivo es aprender a coordinar tareas relacionadas con un orden explícito y un alcance verificable, no lanzar una colección de comandos a ciegas.

El laboratorio utiliza `localhost` y archivos dentro de una carpeta de práctica. Simula una pequeña aplicación mediante plantillas y archivos de texto; **no instala paquetes, no reinicia servicios y no se conecta a otros hosts**. Así se pueden estudiar los mecanismos de orquestación sin necesitar infraestructura externa ni credenciales.

> **Límite del laboratorio:** utiliza únicamente el directorio asignado. Antes de ejecutar un playbook, revisa el inventario, los hosts seleccionados y las rutas de destino. No añadas hosts reales, privilegios elevados ni operaciones destructivas. Las sesiones avanzadas que describen producción son de análisis y diseño; no se ejecutan contra sistemas reales.

---

## Objetivos y alcance

La página muestra cómo diseñar una secuencia completa de tareas Ansible que se pueda entender, revisar y probar.

### Resultados de aprendizaje

Al terminar, podrás:

- Explicar la diferencia entre automatización y orquestación.
- Describir el flujo entre inventario, playbook, roles y tareas.
- Diseñar varias fases relacionadas con un orden claro.
- Usar un inventario local limitado a `localhost`.
- Organizar tareas en roles pequeños y legibles.
- Renderizar una plantilla local de laboratorio.
- Usar un handler para responder a un cambio.
- Verificar un resultado sin instalar servicios.
- Probar un flujo con `--syntax-check`.
- Usar check mode como ayuda de revisión.
- Identificar las limitaciones del modo de comprobación.
- Describir cómo tratar variables y secretos.
- Explicar riesgos de ejecución paralela y fallos parciales.
- Diseñar una pipeline conceptual que ejecute la orquestación.
- Diagnosticar fallos sin ocultar errores.
- Registrar evidencias sin publicar información sensible.

### Qué se construirá

El proyecto simulará una aplicación con tres etapas:

1. Preparar un directorio de laboratorio.
2. Renderizar un archivo de configuración.
3. Verificar el archivo generado y presentar un resumen.

La aplicación simulada no abrirá puertos ni iniciará procesos.

### Qué queda fuera

Esta guía no:

- Configura servidores remotos.
- Instala una aplicación real.
- Reinicia servicios.
- Modifica cuentas de usuario.
- Usa `become`.
- Conecta con cloud.
- Usa credenciales SSH.
- Despliega en producción.
- Configura bases de datos.
- Crea una estrategia real de alta disponibilidad.

### Regla de alcance

Los ejemplos de ejecución se limitan a:

```text
localhost
```

Los archivos de salida se mantienen bajo:

```text
./build/laboratorio
```

Si una variable cambia la ruta, revisa su valor antes de ejecutar.

### Lectores previstos

La guía se dirige a alumnado que ya conoce:

- YAML básico.
- Inventarios de Ansible.
- Playbooks sencillos.
- Git y terminal.
- Uso de módulos incorporados.

La página repasa estos conceptos cuando son necesarios para el flujo completo.

---

## Qué significa orquestar

Orquestar significa coordinar varias operaciones relacionadas con orden, condiciones y comprobaciones.

### Automatización frente a orquestación

Una tarea automatizada puede realizar una sola operación.

Por ejemplo:

- Crear un directorio.
- Copiar un archivo.
- Consultar una versión.

La orquestación coordina varias operaciones para obtener un resultado conjunto.

Por ejemplo:

1. Preparar un directorio.
2. Generar una configuración.
3. Validar la configuración.
4. Notificar un cambio.
5. Comprobar el resultado.

### Flujo, dependencias y orden

El orden importa cuando una etapa necesita el resultado de otra.

En este laboratorio:

- El directorio debe existir antes de escribir archivos.
- La plantilla debe renderizarse antes de comprobar su contenido.
- La verificación debe ejecutarse después de generar el archivo.

### Control de cambios

Un flujo orquestado debería hacer explícito:

- Qué se va a cambiar.
- En qué hosts.
- En qué orden.
- Con qué variables.
- Qué resultado se espera.
- Cómo se detecta un fallo.
- Quién autoriza la ejecución.

### Fallos parciales

Una ejecución puede completar unas tareas y fallar en otras.

El estado final podría ser diferente en cada host o fase.

Por eso conviene:

- Examinar los resultados por host.
- Detener etapas posteriores cuando una dependencia falla.
- Verificar el estado antes de repetir.
- No asumir que un fallo implica que no hubo cambios.

### Repetibilidad

Una orquestación bien diseñada debe poder repetirse con un resultado comprensible.

La repetibilidad depende de:

- Inventario estable.
- Variables controladas.
- Módulos adecuados.
- Dependencias versionadas.
- Entornos identificados.
- Tareas idempotentes cuando sea posible.

---

## Componentes de un proyecto Ansible

El proyecto combina archivos de inventario, playbooks, roles y plantillas.

### Inventario

El inventario define los hosts y grupos disponibles.

En este laboratorio contiene solo `localhost`.

El inventario debe revisarse antes de cada ejecución.

### Configuración

`ansible.cfg` puede establecer valores por defecto para el proyecto.

No debe contener contraseñas ni secretos en texto claro.

### Playbooks

El playbook principal expresa las fases y el orden.

Un playbook puede llamar a otros playbooks o usar roles.

### Roles

Los roles ayudan a separar responsabilidades.

Un proyecto puede incluir roles para:

- Preparar directorios.
- Generar configuración.
- Verificar resultados.

### Colecciones

Las colecciones pueden aportar módulos, plugins o roles.

Instala únicamente colecciones aprobadas.

Fija versiones cuando el proceso del equipo lo requiera.

### Variables

Las variables separan valores de la estructura de las tareas.

Los valores del laboratorio son descriptivos y no sensibles.

### Plantillas

Las plantillas permiten generar archivos con datos variables.

La salida de una plantilla debe revisarse antes de compartirla.

### Handlers

Un handler puede ejecutarse cuando una tarea notifica un cambio.

En este laboratorio el handler solo muestra un mensaje.

No reinicia servicios.

### Relación entre componentes

```text
ansible.cfg
    |
    +--> Inventario
    |
    +--> Playbook principal
              |
              +--> Roles
              |      +--> Tareas
              |      +--> Valores por defecto
              |      +--> Plantillas
              |
              +--> Verificaciones
```

---

## Diseño del laboratorio

El escenario simula una aplicación sencilla sin desplegarla.

### Escenario

El alumnado debe preparar una configuración local de una aplicación ficticia llamada `aula-demo`.

El flujo crea:

- Un directorio de construcción dentro del repositorio.
- Un archivo `app.conf`.
- Un marcador `READY.txt`.
- Un resumen de verificación.

No crea ni modifica servicios del sistema.

### Requisitos

Se necesita:

- Ansible instalado.
- Python compatible con la instalación.
- Git.
- Editor de texto.
- Terminal.
- Una carpeta de práctica.
- Permiso de escritura dentro del repositorio.

No se necesita:

- Servidor remoto.
- Cuenta cloud.
- Clave SSH.
- Paquete de aplicación real.
- Privilegios administrativos.
- Acceso a una red externa.

### Estructura del repositorio

```text
orquestacion-completa/
├── ansible.cfg
├── inventory.ini
├── site.yml
├── README.md
├── roles/
│   ├── preparar/
│   │   ├── defaults/
│   │   │   └── main.yml
│   │   └── tasks/
│   │       └── main.yml
│   ├── configurar/
│   │   ├── defaults/
│   │   │   └── main.yml
│   │   ├── handlers/
│   │   │   └── main.yml
│   │   ├── tasks/
│   │   │   └── main.yml
│   │   └── templates/
│   │       └── app.conf.j2
│   └── verificar/
│       └── tasks/
│           └── main.yml
└── build/
    └── laboratorio/
```

El directorio `build/laboratorio` se crea durante la ejecución.

### Crear la estructura

En un terminal Unix-like:

```bash
mkdir -p orquestacion-completa
cd orquestacion-completa
mkdir -p roles/preparar/defaults
mkdir -p roles/preparar/tasks
mkdir -p roles/configurar/defaults
mkdir -p roles/configurar/handlers
mkdir -p roles/configurar/tasks
mkdir -p roles/configurar/templates
mkdir -p roles/verificar/tasks
```

En PowerShell:

```powershell
New-Item -ItemType Directory -Force orquestacion-completa
Set-Location orquestacion-completa
New-Item -ItemType Directory -Force roles\preparar\defaults
New-Item -ItemType Directory -Force roles\preparar\tasks
New-Item -ItemType Directory -Force roles\configurar\defaults
New-Item -ItemType Directory -Force roles\configurar\handlers
New-Item -ItemType Directory -Force roles\configurar\tasks
New-Item -ItemType Directory -Force roles\configurar\templates
New-Item -ItemType Directory -Force roles\verificar\tasks
```

### Verificar la ubicación

En Unix-like:

```bash
pwd
```

En PowerShell:

```powershell
Get-Location
```

Confirma que estás dentro del repositorio de laboratorio.

### Archivos ignorados

El archivo `.gitignore` puede contener:

```gitignore
build/
*.retry
```

Ajusta las reglas según la política del curso.

No ignores archivos fuente que deban revisarse.

### README del laboratorio

```text
Orquestación local con Ansible.
El inventario contiene solo localhost.
El playbook genera archivos dentro de build/laboratorio.
No se instalan servicios ni se modifican hosts remotos.
```

---

## Inventario y configuración

El inventario y el archivo de configuración determinan cómo se ejecuta el proyecto.

### Inventario INI de laboratorio

Crea `inventory.ini`:

```ini
[local]
localhost ansible_connection=local
```

### Verificar los hosts

```bash
ansible-inventory -i inventory.ini --list
```

Comprueba que el inventario solo incluye `localhost`.

### Listar hosts seleccionados

```bash
ansible -i inventory.ini local --list-hosts
```

No continúes si aparece un destino inesperado.

### Inventario YAML alternativo

El mismo inventario se puede expresar en YAML:

```yaml
all:
  children:
    local:
      hosts:
        localhost:
          ansible_connection: local
```

Utiliza un único formato de inventario para este ejercicio.

### Archivo `ansible.cfg`

Crea:

```ini
[defaults]
inventory = ./inventory.ini
roles_path = ./roles
host_key_checking = True
```

La configuración del proyecto puede variar según la versión y el entorno.

### Comprobar configuración activa

```bash
ansible --version
```

Lee la ruta de configuración que muestra la salida.

### Usar inventario explícito

Aunque el archivo de configuración especifique un inventario, para las prácticas puede ser más claro ejecutar:

```bash
ansible-playbook -i inventory.ini site.yml
```

### No almacenar secretos en `ansible.cfg`

No incluyas:

- Contraseñas.
- Tokens.
- Claves privadas.
- Contraseñas de Vault.
- Credenciales de conexión.

### Inventarios de producción

Este laboratorio no debe reutilizarse con inventarios de producción.

No copies inventarios internos a un repositorio de curso.

---

## Primer flujo orquestado

Antes de crear roles, conviene dibujar las fases.

### Fases del proceso

El flujo del laboratorio será:

1. Preparar la carpeta de salida.
2. Renderizar una configuración.
3. Notificar que cambió el archivo.
4. Ejecutar un handler inocuo.
5. Verificar que los archivos esperados existen.
6. Mostrar un resumen no sensible.

### Orden de ejecución

```text
Seleccionar localhost
        |
        v
Preparar carpeta
        |
        v
Renderizar app.conf
        |
        v
Notificar handler si cambia el archivo
        |
        v
Verificar app.conf y READY.txt
```

### Playbook de observación

Antes de realizar cambios, crea `site.yml` con una tarea informativa:

```yaml
---
- name: Comprobar el alcance del laboratorio
  hosts: localhost
  connection: local
  gather_facts: false

  tasks:
    - name: Informar del entorno seleccionado
      ansible.builtin.debug:
        msg: "El flujo se limita a localhost."
```

### Validar sintaxis

```bash
ansible-playbook -i inventory.ini --syntax-check site.yml
```

### Ejecutar el playbook de observación

```bash
ansible-playbook -i inventory.ini site.yml --limit localhost
```

### Salidas esperadas

La ejecución debería:

- Identificar el play.
- Mostrar el nombre de la tarea.
- Mostrar el host `localhost`.
- Terminar sin errores.
- No crear archivos.
- No requerir privilegios elevados.

### Registrar el resultado

```text
Archivo ejecutado:
Inventario:
Hosts seleccionados:
Resultado:
Cambios observados:
```

---

## Preparar una aplicación simulada

La aplicación de laboratorio es un conjunto de archivos de texto.

### Directorio de salida

El proyecto usará:

```text
./build/laboratorio
```

La ruta es relativa al repositorio.

No la sustituyas por una ruta de sistema.

### Variables de aplicación

Crea `roles/configurar/defaults/main.yml`:

```yaml
---
app_nombre: aula-demo
app_entorno: laboratorio
app_puerto_ficticio: 8080
app_mensaje: "Configuracion local para el curso"
app_directorio: "{{ playbook_dir }}/build/laboratorio"
```

El puerto es texto de configuración ficticio.

No se abre ningún puerto.

### Variables de preparación

Crea `roles/preparar/defaults/main.yml`:

```yaml
---
laboratorio_directorio: "{{ playbook_dir }}/build/laboratorio"
laboratorio_modo: "0750"
```

### Plantilla de configuración

Crea `roles/configurar/templates/app.conf.j2`:

```jinja2
# Archivo generado por el laboratorio de Ansible.
# No corresponde a un servicio real.

nombre={{ app_nombre }}
entorno={{ app_entorno }}
puerto_ficticio={{ app_puerto_ficticio }}
mensaje={{ app_mensaje }}
```

### Valores de plantilla

La plantilla inserta variables en un archivo.

No uses variables sensibles en esta plantilla.

### Archivo marcador

El role de verificación creará:

```text
READY.txt
```

El archivo solo indica que la secuencia local terminó.

### Evitar una aplicación real

No añadas al ejercicio:

- Un servicio real.
- Un servidor web.
- Una conexión a una base de datos.
- Un proceso en segundo plano.
- Una tarea que abra un puerto.
- Un despliegue en una cuenta cloud.

---

## Organizar tareas con roles

Los roles separan responsabilidades y permiten que el playbook principal sea fácil de leer.

### Role `preparar`

El role crea el directorio de salida.

Crea `roles/preparar/tasks/main.yml`:

```yaml
---
- name: Crear el directorio local de construcción
  ansible.builtin.file:
    path: "{{ laboratorio_directorio }}"
    state: directory
    mode: "{{ laboratorio_modo }}"
```

### Role `configurar`

El role renderiza el archivo de configuración.

Crea `roles/configurar/tasks/main.yml`:

```yaml
---
- name: Renderizar la configuración ficticia de la aplicación
  ansible.builtin.template:
    src: app.conf.j2
    dest: "{{ app_directorio }}/app.conf"
    mode: "0640"
  notify: Registrar cambio de configuración
```

### Handler de `configurar`

Crea `roles/configurar/handlers/main.yml`:

```yaml
---
- name: Registrar cambio de configuración
  ansible.builtin.debug:
    msg: "La plantilla local cambió; el handler fue notificado."
```

El handler no reinicia un servicio.

Solo muestra un mensaje de laboratorio.

### Valores por defecto de `configurar`

Los valores por defecto se guardan en:

```text
roles/configurar/defaults/main.yml
```

Son valores no sensibles para esta práctica.

### Role `verificar`

Crea `roles/verificar/tasks/main.yml`:

```yaml
---
- name: Comprobar que existe el archivo de configuración
  ansible.builtin.stat:
    path: "{{ app_directorio }}/app.conf"
  register: resultado_app_conf

- name: Asegurar que la configuración está presente
  ansible.builtin.assert:
    that:
      - resultado_app_conf.stat.exists
      - resultado_app_conf.stat.isreg
    fail_msg: "No se encontró el archivo de configuración del laboratorio."
    success_msg: "El archivo de configuración existe."
```

### Crear el marcador

Añade al role `verificar`:

```yaml
- name: Crear el marcador de finalización del laboratorio
  ansible.builtin.copy:
    dest: "{{ app_directorio }}/READY.txt"
    content: "La orquestacion local termino.\n"
    mode: "0640"
```

Añade la tarea a la lista de `tasks/main.yml`.

### Orden de las tareas de verificación

La comprobación del archivo de configuración debe ejecutarse después del role que la crea.

El marcador se genera después de la comprobación.

### Roles pequeños

Un role debería tener una responsabilidad comprensible.

Evita crear un role distinto para cada línea si no mejora la estructura.

### Dependencias de roles

Si un role depende de otro, expresa el orden en el playbook o documenta la dependencia.

No confíes en que el orden de los nombres de carpeta controle la ejecución.

---

## Orquestar con playbooks

El playbook principal coordina roles y fases.

### Playbook `site.yml`

```yaml
---
- name: Orquestar la aplicación simulada en local
  hosts: localhost
  connection: local
  gather_facts: false

  roles:
    - role: preparar
    - role: configurar
    - role: verificar

  tasks:
    - name: Mostrar un resumen no sensible
      ansible.builtin.debug:
        msg:
          - "Aplicacion: {{ app_nombre }}"
          - "Entorno: {{ app_entorno }}"
          - "Salida: {{ app_directorio }}"
```

### Orden explícito

Los roles aparecen en el orden en que deben ejecutarse.

La orquestación no depende del orden alfabético de carpetas.

### Separar fases en varios plays

En proyectos más complejos, varios plays pueden representar fases separadas.

Por ejemplo:

```yaml
---
- name: Preparar la salida local
  hosts: localhost
  connection: local
  gather_facts: false
  roles:
    - preparar

- name: Configurar la aplicación simulada
  hosts: localhost
  connection: local
  gather_facts: false
  roles:
    - configurar

- name: Verificar la salida
  hosts: localhost
  connection: local
  gather_facts: false
  roles:
    - verificar
```

### Cuándo usar varios plays

Varios plays pueden ser útiles cuando:

- Cambia el grupo de hosts.
- Cambia la estrategia.
- Se necesita una frontera visible entre fases.
- Se requiere una configuración distinta.
- La revisión se beneficia de esa separación.

No los añadas solo para aumentar el número de archivos.

### `import_playbook`

Un playbook principal puede incluir otros playbooks mediante importaciones estáticas.

Ejemplo conceptual:

```yaml
---
- import_playbook: fases/preparar.yml
- import_playbook: fases/configurar.yml
- import_playbook: fases/verificar.yml
```

La ruta debe corresponder a archivos revisados del repositorio.

### Variables entre fases

Las variables deben tener origen claro.

Pueden venir de:

- Defaults de roles.
- Variables del play.
- Inventario.
- Archivos de variables.
- Parámetros de ejecución.

No introduzcas valores secretos en parámetros visibles.

### Fallo de una fase

Si una fase falla, revisa qué tareas anteriores pudieron haber cambiado archivos.

No asumas que el flujo completo se revirtió automáticamente.

### Flujo de producción

Un flujo real puede separar:

- Validación.
- Preparación.
- Cambio.
- Verificación.
- Aprobación.
- Recuperación.

Este laboratorio simula solo una parte de ese diseño.

---

## Plantillas y handlers

Las plantillas generan archivos a partir de variables, y los handlers reaccionan a notificaciones.

### Renderizar una plantilla

El módulo `template` combina:

- Archivo `.j2`.
- Variables disponibles.
- Ruta de destino.
- Permisos del archivo resultante.

### Notificar un handler

La tarea puede incluir:

```yaml
notify: Registrar cambio de configuración
```

El handler solo se ejecuta si la tarea notifica un cambio.

### Cuándo se ejecuta un handler

Los handlers se ejecutan normalmente al final del bloque de tareas correspondiente, si fueron notificados.

La posición del handler en su archivo no representa una tarea ordinaria en la secuencia principal.

### Evitar acciones innecesarias

Un handler puede evitar ejecutar una acción repetidamente cuando no cambió el archivo.

En producción, un handler podría reiniciar un servicio.

Ese efecto requiere revisión y autorización.

### Handler de laboratorio

El handler de este ejercicio usa `debug`.

No realiza reinicios ni operaciones del sistema.

### Verificar el archivo generado

El role `verificar` comprueba que `app.conf` exista y sea un archivo regular.

También puede comprobar que `READY.txt` exista.

### Inspeccionar contenido de laboratorio

En la carpeta del proyecto:

```bash
cat build/laboratorio/app.conf
```

En PowerShell:

```powershell
Get-Content build/laboratorio/app.conf
```

Estas órdenes se limitan al archivo de texto ficticio del laboratorio.

### No mostrar archivos sensibles

No utilices `cat` o `Get-Content` para inspeccionar credenciales, claves o configuraciones de producción.

### Plantillas y datos

Los valores de plantilla pueden aparecer en:

- El archivo generado.
- La salida de Ansible.
- El diff.
- Los artefactos de CI.

No insertes secretos en una plantilla de práctica.

---

## Estrategias de ejecución

Ansible ofrece opciones para coordinar la ejecución en varios hosts. En el laboratorio solo se utiliza `localhost`.

### Ejecución secuencial

Las tareas de un play se ejecutan en el orden del playbook para cada host según la estrategia activa.

Aun así, la ejecución puede tener concurrencia entre hosts.

### Paralelismo

El parámetro `forks` controla cuántos hosts puede procesar Ansible en paralelo, según la configuración.

Más paralelismo puede:

- Reducir duración.
- Aumentar carga.
- Amplificar un cambio defectuoso.
- Afectar servicios de forma simultánea.

### `serial`

`serial` divide los hosts en lotes.

Puede ayudar a implementar cambios graduales.

No se usa en este laboratorio porque solo existe `localhost`.

### `throttle`

`throttle` puede limitar la concurrencia de una tarea concreta.

Su efecto depende de la estrategia y de la estructura del play.

### `run_once`

`run_once` ejecuta una tarea una vez dentro del contexto aplicable.

Puede ser útil para operaciones comunes, pero también puede dirigir una acción al host no esperado si se interpreta mal.

### Delegación

`delegate_to` ejecuta una tarea en otro host, en lugar del host de destino habitual.

Puede cambiar el alcance real del play.

No se utiliza en esta guía.

### Orden de hosts

No dependas del orden de hosts como sustituto de una estrategia documentada.

Si el orden importa, exprésalo y pruébalo de manera explícita.

### Estrategia de ejecución

Ansible permite estrategias de ejecución distintas.

Comprueba la estrategia activa antes de diseñar dependencias entre tareas.

### Fallos durante una ejecución por lotes

En varios hosts, una tarea puede completarse en algunos y fallar en otros.

Diseña:

- Qué hacer con los hosts ya modificados.
- Cómo detener lotes siguientes.
- Cómo verificar el estado.
- Cómo registrar fallos.
- Quién decide la recuperación.

---

## Validación y verificación

La validación debe ocurrir antes y después de la ejecución.

### Comprobar sintaxis

```bash
ansible-playbook -i inventory.ini --syntax-check site.yml
```

Esta comprobación no verifica que el cambio sea seguro.

### Listar tareas

```bash
ansible-playbook -i inventory.ini site.yml --list-tasks
```

Revisa el conjunto de tareas antes de ejecutar.

### Listar hosts

```bash
ansible-playbook -i inventory.ini site.yml --list-hosts
```

Comprueba el alcance.

### Ejecutar check mode

```bash
ansible-playbook -i inventory.ini site.yml --limit localhost --check
```

Check mode intenta estimar cambios, si las tareas lo admiten.

### Ejecutar diff mode

```bash
ansible-playbook -i inventory.ini site.yml --limit localhost --check --diff
```

El resultado puede incluir contenido de archivos.

Revisa la salida antes de compartirla.

### Verificar archivos con `stat`

El módulo `stat` permite consultar metadatos de un archivo.

Registra el resultado con una variable y compruébalo con `assert`.

### Verificar condiciones con `assert`

Una tarea `assert` puede comprobar condiciones explícitas.

Ejemplos de comprobación:

- El archivo existe.
- El archivo es regular.
- El directorio está presente.
- Una variable tiene un valor admitido.

### Verificar contenido

El contenido puede comprobarse mediante:

- Una salida revisada.
- Una búsqueda limitada.
- Una aserción compatible.
- Un test específico del laboratorio.

No imprimas el contenido completo de datos sensibles.

### Verificación posterior

Una verificación útil debe responder:

- ¿El archivo esperado existe?
- ¿La ruta es la correcta?
- ¿Los valores no sensibles coinciden?
- ¿El play terminó sin fallos?
- ¿Se modificó solo el alcance previsto?

### Verificación no es garantía total

Una comprobación local no demuestra que una aplicación real funcione.

Para un servicio real se necesitan pruebas propias del servicio y del entorno.

---

## Variables, secretos y configuración

La orquestación debe separar valores, lógica y secretos.

### Precedencia de variables

Ansible dispone de varias fuentes de variables con prioridades distintas.

La prioridad efectiva puede ser compleja.

Documenta el origen del valor que afecta a una tarea.

### Defaults de role

Los defaults de un role ofrecen valores iniciales sustituibles.

Se guardan normalmente en:

```text
roles/<role>/defaults/main.yml
```

No uses defaults para credenciales.

### Variables del play

Las variables del play son visibles junto al flujo que las utiliza.

Son útiles para valores pequeños y no sensibles del laboratorio.

### Variables de inventario

Las variables del inventario pueden asociarse a hosts o grupos.

No incluyas secretos en un inventario versionado.

### Parámetros de ejecución

Los parámetros como `-e` pueden aparecer en historial o registros.

No los uses para pasar secretos.

### Variables de entorno

Una variable de entorno no es automáticamente segura.

Puede quedar expuesta a procesos, logs o herramientas del agente.

### Ansible Vault

Vault puede cifrar datos utilizados por Ansible.

Antes de usarlo en otro proyecto, define:

- Quién puede obtener la contraseña.
- Cómo se protege la contraseña.
- Cómo se limita el acceso.
- Cómo se evita imprimir valores.
- Cómo se gestionan copias temporales.
- Cómo se rota el material asociado.

### No almacenar secretos en defaults

Los archivos `defaults/main.yml` suelen quedar en el repositorio.

No coloques allí contraseñas, tokens ni claves privadas.

### Datos sensibles en plantillas

Una plantilla puede generar un archivo sensible aunque el archivo fuente no contenga el valor literal.

Revisa el resultado y el manejo de archivos generados.

### Separación por entorno

Desarrollo, pruebas y producción pueden necesitar distintos valores.

La selección del entorno debe ser explícita y revisada.

No confíes solo en un nombre de variable para proteger un entorno.

---

## Seguridad y límites de ejecución

La orquestación coordina tareas; también puede amplificar el impacto de un error.

### Inventario como límite

El inventario define los posibles hosts de destino.

Antes de ejecutar:

- Revisa qué archivo se carga.
- Lista los hosts.
- Revisa grupos.
- Comprueba límites.
- Confirma el entorno.

### Privilege escalation

No uses `become` en el flujo de laboratorio.

En un caso real:

- Limita la escalada a tareas concretas.
- Usa la identidad aprobada.
- Solicita permisos mínimos.
- Revisa el impacto.
- Evita elevación global por conveniencia.

### Tareas destructivas

`state: absent`, comandos de borrado y operaciones equivalentes pueden eliminar datos.

No incluyas tareas destructivas en el flujo principal de práctica.

Revisa cuidadosamente rutas y variables.

### Comandos arbitrarios

Los módulos `shell` y `command` pueden alterar el host.

Usa módulos específicos cuando existan.

No concatene entradas no confiables en comandos.

### Contenido externo

Los roles y colecciones de terceros pueden ejecutar código.

Comprueba:

- Origen.
- Mantenedor.
- Versión.
- Historial.
- Permisos.
- Requisitos.
- Licencia y política interna.

### Control de acceso

Limita quién puede:

- Modificar el inventario.
- Cambiar el playbook.
- Ejecutar el job.
- Aprobar una ejecución.
- Administrar credenciales.
- Descargar logs y artefactos.

### Revisión del diff

Antes de ejecutar, revisa el diff de Git.

Comprueba que no haya:

- Cambios ocultos.
- Hosts añadidos.
- Nuevas dependencias.
- Tareas de borrado.
- Escalada de privilegios.
- Secretos.

### Logs y artefactos

Protege logs que puedan contener:

- Facts.
- Rutas.
- Datos de host.
- Variables.
- Contenido de plantilla.
- Errores internos.

No archives todo el workspace por defecto.

---

## Orquestación en CI/CD

Una pipeline puede validar el código y ejecutar playbooks bajo controles definidos.

### Etapas de una pipeline

Un flujo conceptual puede incluir:

1. Checkout.
2. Comprobación de versión.
3. Validación de sintaxis.
4. Inspección de inventario.
5. Check mode.
6. Revisión humana, si procede.
7. Ejecución autorizada.
8. Verificación.
9. Registro y limpieza.

### Jenkins como ejemplo conceptual

El siguiente ejemplo solo valida sintaxis y enumera tareas.

No ejecuta cambios:

```groovy
pipeline {
    agent {
        label 'ansible-lab'
    }

    stages {
        stage('Comprobar versión') {
            steps {
                sh 'ansible-playbook --version'
            }
        }

        stage('Validar sintaxis') {
            steps {
                sh 'ansible-playbook -i inventory.ini --syntax-check site.yml'
            }
        }

        stage('Listar hosts') {
            steps {
                sh 'ansible-playbook -i inventory.ini site.yml --list-hosts'
            }
        }

        stage('Listar tareas') {
            steps {
                sh 'ansible-playbook -i inventory.ini site.yml --list-tasks'
            }
        }
    }
}
```

### No usar credenciales para validar YAML

La comprobación de sintaxis local no debería necesitar credenciales de hosts.

Si el job pide secretos en esta etapa, revisa su configuración.

### Check mode en CI

Una etapa de check mode puede aportar información preliminar.

No la presentes como garantía de que la ejecución normal no tendrá efectos.

### Aprobación humana

Un cambio real puede requerir aprobación antes de la ejecución normal.

La aprobación debe identificar:

- Build.
- Commit.
- Inventario.
- Grupos seleccionados.
- Objetivo.
- Riesgos.
- Resultado del check mode.

### Ramas no confiables

No entregues credenciales a código de pull requests no revisado.

Limita los jobs de validación a pasos que no necesiten secretos.

### Artefactos

No archives por defecto:

- Inventarios privados.
- Archivos Vault descifrados.
- Logs completos.
- Facts completos.
- Configuraciones sensibles.
- Archivos generados con secretos.

### Ejecuciones concurrentes

Dos jobs pueden actuar sobre los mismos hosts.

Define:

- Exclusión mutua.
- Lotes.
- Orden.
- Gestión de ventanas.
- Bloqueo del proceso.
- Procedimiento para conflictos.

### Registro

Asocia cada ejecución con:

- Commit.
- Build.
- Actor.
- Inventario.
- Hosts seleccionados.
- Resultado.
- Aprobación.
- Versión de Ansible.

---

## Sesiones prácticas

Las sesiones utilizan la aplicación ficticia y amplían el proyecto paso a paso.

### Preparación común

Antes de cada sesión:

- Revisa la ruta del repositorio.
- Ejecuta `ansible --version`.
- Comprueba el inventario.
- Confirma que solo se selecciona `localhost`.
- Lee el playbook y los roles.
- No añadas credenciales.
- No utilices `become`.
- No ejecutes tareas destructivas.
- Revisa los archivos generados antes de compartirlos.

### Sesión 1: dibujar el flujo

**Objetivo:** representar el orden de la orquestación.

Dibuja:

```text
Inventario
    |
    v
Preparar directorio
    |
    v
Renderizar configuración
    |
    v
Notificar handler
    |
    v
Verificar archivos
    |
    v
Mostrar resumen
```

Responde:

- ¿Qué tarea depende de la creación del directorio?
- ¿Cuándo puede ejecutarse el handler?
- ¿Qué comprueba el role de verificación?
- ¿Qué paso se detendría si falla la generación?

### Sesión 2: revisar el inventario

**Objetivo:** verificar el alcance antes de cualquier cambio.

Pasos:

1. Abre `inventory.ini`.
2. Comprueba el grupo `local`.
3. Confirma que aparece solo `localhost`.
4. Ejecuta `ansible-inventory --list`.
5. Ejecuta `--list-hosts`.
6. Detente si aparece otro host.

### Sesión 3: validar configuración

**Objetivo:** comprobar la configuración Ansible activa.

Pasos:

1. Ejecuta `ansible --version`.
2. Identifica `ansible.cfg`.
3. Comprueba `roles_path`.
4. Confirma que el inventario está disponible.
5. No cambies opciones de seguridad para silenciar avisos.
6. Anota la versión.

### Sesión 4: ejecutar el playbook de observación

**Objetivo:** probar un play sin modificar archivos.

Pasos:

1. Ejecuta `--syntax-check`.
2. Ejecuta `--list-hosts`.
3. Ejecuta `--list-tasks`.
4. Ejecuta el playbook con `--limit localhost`.
5. Comprueba que no aparece una tarea de cambio.
6. Registra el resultado.

### Sesión 5: crear el directorio

**Objetivo:** ejecutar el role `preparar`.

Pasos:

1. Revisa el valor de `laboratorio_directorio`.
2. Comprueba que se encuentra bajo el proyecto.
3. Revisa `state: directory`.
4. Ejecuta check mode.
5. Revisa el cambio previsto.
6. Ejecuta normalmente solo con autorización del docente.
7. Comprueba que el directorio existe.

### Sesión 6: renderizar la plantilla

**Objetivo:** crear `app.conf` con datos ficticios.

Pasos:

1. Revisa `app.conf.j2`.
2. Comprueba que no contiene secretos.
3. Revisa `app_directorio`.
4. Valida la sintaxis.
5. Ejecuta check mode.
6. Ejecuta el playbook local autorizado.
7. Inspecciona solo el archivo de laboratorio.

### Sesión 7: observar el handler

**Objetivo:** comprobar que el handler responde a una notificación.

Pasos:

1. Revisa la tarea de plantilla.
2. Localiza `notify`.
3. Revisa el nombre del handler.
4. Ejecuta por primera vez.
5. Observa si el handler se ejecutó.
6. Ejecuta de nuevo sin cambios.
7. Compara la salida.

### Sesión 8: modificar un valor de plantilla

**Objetivo:** observar el efecto de cambiar una variable no sensible.

Pasos:

1. Cambia `app_mensaje`.
2. Revisa el diff.
3. Ejecuta `--syntax-check`.
4. Ejecuta check mode con diff mode.
5. Comprueba la salida del handler.
6. Aplica solo en el laboratorio.
7. Verifica el archivo generado.

### Sesión 9: probar la idempotencia

**Objetivo:** comparar dos ejecuciones equivalentes.

Pasos:

1. Ejecuta el flujo completo.
2. Anota los cambios.
3. Ejecuta otra vez sin editar archivos.
4. Anota los cambios.
5. Identifica qué tareas fueron `ok`.
6. Explica cualquier tarea que siga apareciendo como `changed`.

### Sesión 10: ejecutar el role de verificación

**Objetivo:** comprobar que la configuración existe.

Pasos:

1. Revisa el uso de `stat`.
2. Revisa la variable `register`.
3. Revisa las condiciones de `assert`.
4. Ejecuta la verificación después de configurar.
5. Comprueba el mensaje de éxito.
6. En una copia controlada, analiza el mensaje de fallo sin eliminar archivos compartidos.

### Sesión 11: separar tareas en roles

**Objetivo:** mantener responsabilidades diferentes.

Pasos:

1. Identifica tareas de preparación.
2. Identifica tareas de configuración.
3. Identifica tareas de verificación.
4. Coloca cada tarea en el role correspondiente.
5. Comprueba nombres de archivos.
6. Ejecuta `--syntax-check`.
7. Revisa el diff.

### Sesión 12: introducir un fallo de plantilla controlado

**Objetivo:** ver cómo falla una referencia incorrecta.

Pasos:

1. En una copia, escribe el nombre de una variable incorrectamente.
2. Ejecuta el playbook en `localhost`.
3. Identifica la fase fallida.
4. Comprueba qué archivos previos pudieron haberse creado.
5. Corrige la variable.
6. Repite la validación.
7. No ocultes el error con una condición que lo ignore.

### Sesión 13: limitar tareas con tags

**Objetivo:** analizar la ejecución parcial.

Pasos:

1. Añade un tag a una tarea inocua.
2. Consulta las etiquetas con la opción apropiada de Ansible.
3. Ejecuta solo esa etiqueta en el laboratorio.
4. Comprueba qué tareas se omitieron.
5. Explica si esas tareas eran dependencias.
6. No uses tags para saltarte controles de seguridad.

### Sesión 14: usar `--start-at-task` en análisis

**Objetivo:** entender el inicio desde una tarea concreta.

Pasos:

1. Lee la ayuda de `ansible-playbook`.
2. Identifica qué opción selecciona una tarea de inicio.
3. Analiza qué preparación podría omitirse.
4. No la uses para saltarte validaciones del flujo.
5. Ejecuta solo si el docente lo autoriza.
6. Compara el resultado con la ejecución completa.

### Sesión 15: probar check mode

**Objetivo:** identificar qué predice Ansible.

Pasos:

1. Ejecuta el playbook con `--check`.
2. Registra las tareas con cambios previstos.
3. Identifica tareas que el módulo no simula.
4. Compara la predicción con una ejecución local autorizada.
5. Explica por qué no es una garantía total.
6. No uses check mode como única aprobación.

### Sesión 16: revisar diff mode

**Objetivo:** interpretar diferencias sin divulgar contenido.

Pasos:

1. Ejecuta `--check --diff`.
2. Identifica qué archivo o campo se compara.
3. Confirma que los datos son ficticios.
4. Marca qué salida no debería compartirse en otro entorno.
5. No incluyas secretos en la plantilla.
6. Guarda solo un resumen no sensible.

### Sesión 17: simular dos grupos

**Objetivo:** diseñar grupos sin añadir hosts reales.

Pasos:

1. Lee un inventario ficticio proporcionado por el docente.
2. Identifica grupos de desarrollo y pruebas.
3. No añadas los grupos a la práctica activa.
4. Explica cómo se seleccionaría cada grupo.
5. Describe qué controles evitarían elegir producción por error.
6. Presenta el resultado como análisis.

### Sesión 18: analizar `serial`

**Objetivo:** entender un despliegue gradual a nivel conceptual.

Pasos:

1. Lee un ejemplo ficticio con `serial`.
2. Explica el significado de los lotes.
3. Identifica qué ocurre si falla un lote.
4. Propón comprobaciones entre lotes.
5. No ejecutes en varios hosts.
6. No confundas `serial` con una garantía de disponibilidad.

### Sesión 19: analizar `delegate_to` y `run_once`

**Objetivo:** detectar cambios de alcance.

Pasos:

1. Revisa ejemplos teóricos de delegación.
2. Identifica qué host ejecutaría cada tarea.
3. Explica el efecto de `run_once`.
4. Indica por qué estas opciones pueden confundir el alcance.
5. No añadas delegación en el playbook del laboratorio.

### Sesión 20: revisar una ejecución parcial

**Objetivo:** describir un fallo entre fases.

El docente proporciona una salida ficticia donde la configuración termina y la verificación falla.

Pasos:

1. Identifica las tareas completadas.
2. Identifica la tarea fallida.
3. Determina qué archivos podrían existir.
4. Explica por qué Ansible no revierte automáticamente todas las tareas anteriores.
5. Propón verificaciones antes de repetir.
6. Registra el análisis.

### Sesión 21: comparar dos commits

**Objetivo:** asociar una ejecución con código revisado.

Pasos:

1. Registra el commit actual.
2. Cambia una variable de laboratorio.
3. Genera un segundo commit en la rama de práctica.
4. Ejecuta ambos commits o analiza sus salidas.
5. Compara los resultados.
6. Indica qué commit corresponde a la salida entregada.

### Sesión 22: ejecutar comprobaciones en Jenkins

**Objetivo:** validar un repositorio Ansible desde CI.

Pasos:

1. Usa el job de laboratorio.
2. Comprueba versión.
3. Ejecuta `--syntax-check`.
4. Lista hosts.
5. Lista tareas.
6. No uses credenciales.
7. No conectes a hosts remotos.
8. Revisa la consola antes de adjuntarla.

### Sesión 23: revisar permisos de pipeline

**Objetivo:** identificar quién puede cambiar el playbook y ejecutarlo.

Pasos:

1. Identifica quién puede modificar el repositorio.
2. Identifica quién puede ejecutar el job.
3. Identifica quién puede cambiar el inventario.
4. Identifica quién puede ver la consola.
5. No cambies permisos de la instancia.
6. Propón un diseño de mínimo acceso.

### Sesión 24: revisión por parejas

**Objetivo:** revisar la orquestación completa.

La persona autora explica:

- El inventario.
- La configuración.
- El orden de roles.
- El uso de la plantilla.
- El handler.
- La verificación.
- Los límites del laboratorio.

La persona revisora comprueba:

- Solo `localhost`.
- Sin `become`.
- Sin secretos.
- Rutas dentro del proyecto.
- Sintaxis válida.
- Orden explícito.
- Verificaciones posteriores.
- Sin tareas destructivas.
- Sin contenido externo no revisado.

### Sesión 25: proyecto integrador

**Objetivo:** entregar una orquestación local completa y verificable.

Requisitos:

- Inventario local.
- `ansible.cfg` revisado.
- Playbook principal.
- Role de preparación.
- Role de configuración.
- Plantilla no sensible.
- Role de verificación.
- Handler inocuo.
- Comprobación de sintaxis.
- Comprobación de hosts y tareas.
- Ejecución con límite a `localhost`.
- Prueba de idempotencia.
- Uso de check mode.
- Sin credenciales.
- Sin escalada de privilegios.
- Sin hosts remotos.
- Sin tareas destructivas.

---

## Diagnóstico y recuperación

Una ejecución que falla puede haber dejado cambios parciales.

### Errores de inventario

Comprueba:

- Archivo utilizado.
- Grupo.
- Nombre de host.
- `--limit`.
- Configuración activa.
- Inventarios dinámicos.
- Directorio actual.

Detén la ejecución si aparece un host inesperado.

### Errores de sintaxis

Comprueba:

- Indentación.
- Dos puntos.
- Guiones de listas.
- Comillas.
- Ubicación de `tasks`.
- Referencias a roles.
- Nombre de módulo.
- Ruta de plantilla.

Ejecuta `--syntax-check` antes de volver a lanzar el playbook.

### Role no encontrado

Comprueba:

- `roles_path`.
- Estructura de carpetas.
- Nombre del role.
- Archivo `tasks/main.yml`.
- Ruta relativa del proyecto.
- Colección o dependencia requerida.

### Plantilla no encontrada

Comprueba:

- Directorio `templates`.
- Nombre del archivo.
- Nombre del role.
- Extensión `.j2`.
- Ubicación del archivo.
- Ruta del proyecto.

### Variable indefinida

Comprueba:

- Nombre declarado.
- Nombre utilizado.
- Archivo de defaults.
- Playbook activo.
- Precedencia de variables.
- Indentación.

No imprimas el entorno completo para buscarla.

### Handler no se ejecuta

Comprueba:

- Que el nombre de `notify` coincide.
- Que la tarea informó un cambio.
- Que el handler se encuentra en `handlers/main.yml`.
- Que el role cargó el handler.
- Que la tarea no se omitió.

Un handler no ejecutado no implica necesariamente un error.

### Verificación falla

Comprueba:

- Si la tarea de configuración se ejecutó.
- Si la ruta es correcta.
- Si el archivo es regular.
- Si el role se invocó después de configurar.
- Si una variable sobrescribió la ruta.
- Si hubo un fallo anterior.

### Idempotencia inesperada

Comprueba:

- Cambios en plantilla.
- Permisos.
- Propietario.
- Ruta.
- Variables.
- Diferencias de contenido.
- Comportamiento del módulo.
- Archivos modificados manualmente.

### Fallos parciales

Antes de repetir:

1. Lee la salida completa de la ejecución autorizada.
2. Identifica los hosts y tareas que terminaron.
3. Comprueba los archivos del laboratorio.
4. Revisa qué etapas faltan.
5. No borres datos para forzar un resultado.
6. Consulta al docente si el estado no está claro.

### Datos sensibles en la salida

Si una consola muestra un secreto:

- Limita la difusión.
- Notifica al responsable.
- Sigue el procedimiento del equipo.
- Revisa artefactos y copias.
- No pegues el valor en un ticket.

### Ficha de diagnóstico

```text
Proyecto:
Build:
Commit:
Versión de Ansible:
Archivo de configuración:
Inventario:
Grupo o límite:
Play:
Role:
Tarea:
Host:
Primer error relevante:
Cambios previos:
Resultado observado:
Hipótesis:
Comprobación siguiente:
Acción autorizada:
```

No incluyas contraseñas, tokens, claves privadas ni contenido sensible.

---

## Buenas prácticas

Una orquestación clara reduce la incertidumbre antes y durante la ejecución.

### Estructura

- Mantén el playbook principal fácil de leer.
- Divide tareas por responsabilidad.
- Usa roles cuando mejoren comprensión o reutilización.
- No fragmentes el proyecto sin motivo.
- Guarda plantillas en los directorios convencionales.
- Mantén defaults no sensibles junto al role que los usa.

### Nombres y documentación

- Usa nombres que describan la acción.
- Documenta el objetivo del proyecto.
- Explica el inventario.
- Identifica variables requeridas.
- Anota los límites de ejecución.
- Describe acciones que requieren aprobación.

### Revisión

- Revisa cambios con Git.
- Comprueba inventario y hosts.
- Ejecuta `--syntax-check`.
- Lista hosts y tareas.
- Revisa la salida de check mode.
- No apruebes una ejecución que no entiendas.

### Pruebas

- Empieza en un host local o de prueba.
- Compara ejecuciones repetidas.
- Prueba fallos controlados.
- Verifica el resultado.
- Comprueba qué tareas no admiten check mode.
- Mantén las pruebas fuera de producción hasta aprobarlas.

### Dependencias

- Revisa roles y colecciones.
- Fija versiones según la política.
- Evita dependencias innecesarias.
- Comprueba el origen del contenido.
- Registra actualizaciones.

### Operación

- Limita el inventario.
- Reduce privilegios.
- Evita secretos en logs.
- Define ventanas de cambio.
- Controla concurrencia.
- Registra build, commit y actor.
- Define qué hacer tras un fallo parcial.

### Módulos antes que comandos

Prefiere módulos que expresen el estado deseado.

Usa comandos solo si:

- El módulo apropiado no existe.
- La operación está bien documentada.
- El comando está limitado.
- Se sabe cómo se comporta al repetirse.
- Se comprueba su código de salida.

---

## Checklist

### Proyecto

- [ ] La estructura de archivos es clara.
- [ ] El inventario contiene solo destinos autorizados.
- [ ] `ansible.cfg` corresponde al proyecto.
- [ ] Las plantillas son no sensibles.
- [ ] Las variables tienen origen documentado.
- [ ] Los roles tienen responsabilidades entendibles.

### Orquestación

- [ ] El orden de fases está explícito.
- [ ] Cada fase tiene un propósito.
- [ ] Las dependencias están comprobadas.
- [ ] Los handlers tienen un uso claro.
- [ ] La verificación se ejecuta después de configurar.
- [ ] Los fallos no se ocultan.
- [ ] Los resultados parciales se pueden identificar.

### Seguridad

- [ ] El laboratorio se limita a `localhost`.
- [ ] No se usan credenciales reales.
- [ ] No se utiliza `become`.
- [ ] No hay tareas destructivas.
- [ ] No se instala contenido externo desconocido.
- [ ] Los logs no imprimen secretos.
- [ ] Los archivos generados no se archivan sin revisión.

### Entrega

- [ ] La sintaxis pasa.
- [ ] Los hosts están verificados.
- [ ] Las tareas están enumeradas.
- [ ] La primera ejecución está documentada.
- [ ] La segunda ejecución se compara.
- [ ] Check mode se interpreta con prudencia.
- [ ] No se publican datos restringidos.

---

## Evaluación

La evaluación mide si la orquestación es comprensible, acotada y verificable.

### Evidencias mínimas

Entrega:

- `inventory.ini`.
- `ansible.cfg`, si se utiliza.
- `site.yml`.
- Estructura de roles.
- Plantilla.
- Resultado de `--syntax-check`.
- Resultado de `--list-hosts`.
- Resultado de `--list-tasks`.
- Resultado de la primera ejecución.
- Resultado de la repetición.
- Resumen de check mode.
- Explicación del alcance y de los límites.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Orquestación | Lista tareas sin explicar dependencias | Organiza fases con orden claro | Justifica fases, límites y recuperación |
| Estructura | Todo está en un archivo ambiguo | Usa roles con responsabilidades claras | Diseña reutilización y dependencias mantenibles |
| Inventario | No verifica destinos | Limita a `localhost` | Demuestra controles para selección y entorno |
| Plantillas | Mezcla valores o rutas | Renderiza una plantilla no sensible | Controla cambios, salida y exposición |
| Handlers | No comprende notificaciones | Implementa un handler inocuo | Explica condiciones y efectos en producción |
| Seguridad | Usa privilegios o secretos | Mantiene el laboratorio local | Identifica riesgos de CI, inventario y logs |
| Verificación | Solo mira el código de salida | Comprueba archivos esperados | Diseña comprobaciones posteriores verificables |
| Diagnóstico | Repite la ejecución | Identifica la tarea fallida | Analiza efectos parciales y recuperación |

### Preguntas de evaluación

1. ¿Qué diferencia hay entre automatización y orquestación?
2. ¿Qué contiene el inventario?
3. ¿Qué responsabilidad corresponde al playbook principal?
4. ¿Por qué separar tareas en roles?
5. ¿Qué propósito cumple una plantilla?
6. ¿Cuándo se ejecuta un handler?
7. ¿Qué comprueba el role de verificación?
8. ¿Qué puede quedar modificado después de un fallo parcial?
9. ¿Qué diferencia hay entre `--check` y una validación completa?
10. ¿Qué datos puede revelar `--diff`?
11. ¿Por qué el inventario limita el alcance de seguridad?
12. ¿Qué riesgos introduce `delegate_to`?
13. ¿Qué controla `serial`?
14. ¿Por qué no se debe usar `become` globalmente?
15. ¿Cómo se comprueba la idempotencia?
16. ¿Qué información debe asociarse con una ejecución de CI?
17. ¿Qué diferencia hay entre un playbook y un role?
18. ¿Qué harías si aparecen hosts no previstos?
19. ¿Qué evidencia demuestra que el resultado se verificó?
20. ¿Qué necesitaría cambiar antes de adaptar el diseño a producción?

---

## Glosario

- **Ansible:** herramienta de automatización de configuración y operaciones.
- **Control node:** sistema desde el que se ejecuta Ansible.
- **Managed node:** host sobre el que Ansible realiza tareas.
- **Inventario:** lista o estructura que define hosts, grupos y variables.
- **Playbook:** archivo YAML que coordina uno o varios plays.
- **Play:** conjunto de tareas dirigido a determinados hosts.
- **Role:** estructura reutilizable de tareas, valores, handlers y plantillas.
- **Colección:** paquete de módulos, plugins, roles y contenido relacionado.
- **Tarea:** unidad de trabajo ejecutada mediante un módulo o acción.
- **Módulo:** componente que realiza una operación estructurada.
- **Variable:** valor configurable utilizado por un play o role.
- **Template:** plantilla procesada para producir un archivo.
- **Handler:** tarea que se ejecuta al recibir una notificación.
- **Fact:** información recopilada sobre un host.
- **Idempotencia:** propiedad por la que repetir una tarea conserva el estado deseado sin cambios innecesarios.
- **Check mode:** modo que intenta predecir cambios sin aplicarlos, si el contenido lo admite.
- **Diff mode:** modo que muestra diferencias compatibles.
- **`become`:** mecanismo de escalada de privilegios.
- **`serial`:** opción para procesar hosts por lotes.
- **`throttle`:** opción que limita la concurrencia de una tarea.
- **`run_once`:** opción que ejecuta una tarea una vez en el contexto aplicable.
- **`delegate_to`:** opción que dirige una tarea a otro host.
- **Inventario dinámico:** inventario generado desde una fuente externa.
- **Orquestación:** coordinación ordenada de tareas relacionadas.
- **Fallo parcial:** situación en la que algunas tareas o hosts terminan y otros fallan.
- **`assert`:** módulo para comprobar condiciones y fallar si no se cumplen.
- **`stat`:** módulo para consultar metadatos de un archivo o ruta.

---

## Plantilla de entrega

```text
Nombre del proyecto:
Versión de Ansible:
Inventario activo:
Hosts seleccionados:
Archivo de configuración:
Playbook principal:
Roles:
Plantillas:
Variables no sensibles:
Resultado de syntax-check:
Resultado de list-hosts:
Resultado de list-tasks:
Resultado de primera ejecución:
Resultado de ejecución repetida:
Resultado de check mode:
Verificación posterior:
Riesgo identificado:
Conclusión:
```

No incluyas credenciales, inventarios privados, facts completos ni logs sensibles.

### Plantilla de revisión previa

```text
¿El inventario es el esperado?:
¿El playbook selecciona los hosts correctos?:
¿Las fases están en el orden correcto?:
¿Se entienden todos los roles?:
¿Las plantillas son no sensibles?:
¿El handler tiene efectos externos?:
¿Se usa become?:
¿Hay tareas destructivas?:
¿Se ha probado check mode?:
¿Hay un plan ante fallos parciales?:
Decisión:
```

---

## Síntesis final

Orquestar con Ansible consiste en coordinar tareas relacionadas de manera explícita, verificable y acotada.

- El inventario define el alcance posible.
- El playbook expresa el flujo.
- Los roles separan responsabilidades.
- Las plantillas generan configuraciones a partir de variables.
- Los handlers reaccionan a cambios notificados.
- Las verificaciones confirman el resultado esperado.
- La repetición ayuda a estudiar idempotencia.
- Check mode es una ayuda, no una garantía.
- La ejecución puede dejar cambios parciales.
- Los secretos y logs requieren protección.
- En el laboratorio, solo se utiliza `localhost`.
- No se necesitan credenciales ni privilegios elevados.