# Práctica de integración de Ansible con Jenkins

Esta práctica integra Ansible en un pipeline de Jenkins para validar y ejecutar un playbook de laboratorio. Los ejercicios se limitan al propio workspace del agente: no conectan con servidores remotos, no usan credenciales SSH y no cambian la configuración del sistema.

El alumnado comprobará la versión de Ansible, validará el inventario y la sintaxis, ejecutará el playbook en modo de comprobación y, finalmente, lo ejecutará para crear un archivo de prueba dentro del workspace. También revisará la idempotencia, los logs y los riesgos que aparecen al pasar de un laboratorio local a la automatización de servidores reales.

> **Límite de seguridad:** esta práctica no configura hosts remotos, no usa `become`, no instala paquetes, no reinicia servicios y no utiliza claves SSH. No añadas destinos reales ni credenciales a los ejemplos. Para administrar servidores reales se requiere autorización, inventario aprobado, autenticación protegida y una revisión de cambios.

## Esquema de la página

- ## Objetivos y alcance
  - ### Resultados de aprendizaje
  - ### Qué se construirá
  - ### Qué no se hará
  - ### Requisitos previos
- ## Conceptos de Ansible y Jenkins
  - ### Inventario, playbook y tareas
  - ### Módulos e idempotencia
  - ### Controlador Ansible y agente Jenkins
  - ### Modo de comprobación
- ## Preparación del laboratorio
  - ### Estructura del repositorio
  - ### Inventario local
  - ### Playbook de laboratorio
  - ### Prueba local
- ## Preparar Jenkins
  - ### Agente y herramientas
  - ### Job desde SCM
  - ### Permisos y variables
- ## Construir el pipeline
  - ### Verificar Ansible
  - ### Validar inventario
  - ### Comprobar sintaxis
  - ### Listar hosts
  - ### Ejecutar en modo de comprobación
  - ### Ejecutar el playbook local
  - ### Archivar un resultado seguro
- ## Sesiones prácticas
  - ### Explorar Ansible
  - ### Crear el inventario y el playbook
  - ### Integrar Ansible en Jenkins
  - ### Probar idempotencia y fallos
  - ### Revisar seguridad
  - ### Proyecto integrador
- ## Uso de Ansible en entornos reales
  - ### Acceso remoto
  - ### SSH y credenciales
  - ### Privilegios y `become`
  - ### Inventarios y entornos
  - ### Aprobación y control de cambios
- ## Diagnóstico y evaluación
  - ### Errores habituales
  - ### Checklist
  - ### Rúbrica
  - ### Preguntas y glosario
  - ### Síntesis y entrega

---

## Objetivos y alcance

La práctica muestra cómo Jenkins puede ejecutar comprobaciones y tareas Ansible de forma reproducible dentro de un agente.

### Resultados de aprendizaje

Al completar la práctica, podrás:

- Explicar la función de Ansible en la automatización de sistemas.
- Diferenciar inventario, playbook, play, tarea y módulo.
- Identificar en qué agente se ejecutan los comandos de Ansible.
- Crear un inventario local de laboratorio.
- Escribir un playbook sin acceso remoto.
- Validar la sintaxis de un playbook.
- Comprobar qué hosts selecciona un playbook.
- Utilizar el modo de comprobación cuando sea compatible con las tareas.
- Ejecutar un playbook local dentro del workspace de Jenkins.
- Comprobar idempotencia en una tarea sencilla.
- Interpretar los resultados `ok`, `changed`, `failed` y `skipped`.
- Identificar qué información no debe aparecer en logs.
- Explicar por qué las credenciales SSH deben gestionarse fuera del código.
- Describir controles necesarios antes de automatizar servidores reales.
- Documentar una ejecución sin incluir secretos.

### Qué se construirá

El proyecto tendrá esta estructura:

```text
integracion-ansible/
├── Jenkinsfile
├── README.md
└── ansible/
    ├── inventory/
    │   └── lab.ini
    ├── playbooks/
    │   └── lab.yml
    └── build-output/
```

El pipeline seguirá esta secuencia:

1. Comprobará que Ansible está instalado.
2. Validará el inventario.
3. Comprobará la sintaxis del playbook.
4. Mostrará qué hosts selecciona.
5. Ejecutará el playbook en modo de comprobación.
6. Ejecutará el playbook contra `localhost`.
7. Creará un archivo de laboratorio dentro del workspace.
8. Revisará el resultado.
9. Archivará únicamente el archivo de prueba no sensible.

### Qué no se hará

Esta práctica no:

- Administra servidores remotos.
- Abre conexiones SSH.
- Usa claves privadas.
- Solicita contraseñas.
- Utiliza `become`.
- Instala software en el host Jenkins.
- Cambia configuraciones del sistema.
- Reinicia servicios.
- Gestiona usuarios o permisos del sistema.
- Ejecuta comandos destructivos.
- Guarda inventarios de producción.
- Se conecta a una nube.
- Usa credenciales de producción.

### Requisitos previos

Necesitarás:

- Una cuenta autorizada en Jenkins.
- Una carpeta de laboratorio.
- Permiso para crear o ejecutar jobs.
- Un agente Jenkins con Ansible instalado.
- Git disponible en el agente si el pipeline usa SCM.
- Un repositorio de práctica o autorización para pegar el pipeline desde la interfaz.
- Conocimientos básicos de YAML y shell.
- Un editor de texto.
- Un entorno local de práctica, si el curso lo proporciona.

### Sistemas Unix y Windows

Los ejemplos del pipeline usan `sh` y presuponen un agente Unix o compatible.

En un agente Windows se requieren pasos y comandos adecuados a Windows.

Ansible suele ejecutarse desde un nodo de control Unix-like, aunque puede administrarse de maneras distintas según la plataforma. Confirma el entorno preparado por el curso.

### Laboratorio y producción

Este laboratorio solo escribe dentro de su propio workspace.

Un pipeline que usa Ansible contra servidores reales puede modificar muchos hosts en paralelo. Antes de hacerlo, hay que definir autorización, inventario, límites, credenciales, estrategia de despliegue y plan de recuperación.

---

## Conceptos de Ansible y Jenkins

Ansible describe tareas que se ejecutan sobre hosts seleccionados mediante un inventario.

### Ansible

Ansible es una herramienta de automatización y gestión de configuración.

Puede utilizarse para:

- Configurar sistemas.
- Instalar paquetes.
- Administrar servicios.
- Desplegar aplicaciones.
- Crear archivos.
- Aplicar configuraciones repetibles.
- Ejecutar comprobaciones operativas.

La herramienta realiza acciones según el inventario y el playbook que se le indiquen.

### Inventario

El inventario describe los hosts que Ansible puede seleccionar.

Puede ser:

- Un archivo INI.
- Un archivo YAML.
- Una fuente dinámica.
- Una combinación de grupos y variables.

Para esta práctica, el inventario contiene únicamente `localhost`.

### Grupo de inventario

Un grupo agrupa hosts con características o propósitos comunes.

En el ejemplo se usa el grupo:

```text
local
```

El nombre es ilustrativo y no representa un entorno real.

### Host

Un host es un destino de Ansible.

En esta práctica, el único destino es la máquina local del agente Jenkins:

```text
localhost
```

No añadas direcciones IP de servidores reales al inventario.

### `ansible_connection=local`

Esta variable indica que Ansible debe ejecutar las tareas localmente, sin conectarse por SSH al host.

El agente Jenkins ejecuta el proceso y las tareas escriben dentro del workspace.

### Playbook

Un playbook es un archivo YAML que describe uno o más plays.

Un play determina:

- Qué hosts se seleccionan.
- Si se recopilan facts.
- Qué variables se aplican.
- Qué tareas se ejecutan.
- Qué comportamiento general se utiliza.

### Play

Un play es una sección del playbook que asocia hosts con tareas.

En esta práctica el play apunta al grupo `local`.

### Tarea

Una tarea representa una acción concreta.

Por ejemplo:

- Crear un directorio.
- Copiar contenido a un archivo.
- Comprobar una condición.
- Mostrar un mensaje.

### Módulo

Un módulo implementa una operación de Ansible.

En los ejemplos se usan módulos incluidos con Ansible:

- `ansible.builtin.assert`
- `ansible.builtin.file`
- `ansible.builtin.copy`
- `ansible.builtin.debug`

Se especifica el prefijo `ansible.builtin` para hacer explícito que son módulos incluidos en Ansible.

### Idempotencia

Una tarea idempotente produce el estado deseado sin repetir cambios innecesarios.

Por ejemplo, crear un directorio que ya existe debería dejarlo en el estado esperado sin volver a cambiarlo en cada ejecución.

La idempotencia ayuda a ejecutar automatizaciones de forma segura y previsible.

No garantiza que cualquier playbook sea inocuo.

### `changed`

Ansible informa que una tarea produjo o prevé un cambio.

En modo normal, `changed` indica que la tarea cambió el estado observado según el módulo.

En modo de comprobación, el resultado puede ser una predicción.

### `ok`

La tarea se ejecutó y no necesitó realizar cambios, o el módulo informó que el estado ya era correcto.

### `failed`

La tarea falló.

El playbook puede detenerse en ese host, a menos que exista una política explícita que indique otro comportamiento.

No ocultes un fallo obligatorio solo para obtener una ejecución verde.

### `skipped`

La tarea no se ejecutó, normalmente por una condición o por una configuración que la omitió.

Una tarea omitida no equivale a una validación superada.

### Facts

Los facts son datos recopilados sobre un host.

La recopilación de facts puede ser útil, pero no es necesaria para esta práctica.

Se desactiva con:

```yaml
gather_facts: false
```

### Controlador de Ansible

En el modelo habitual, el nodo donde se ejecuta el comando `ansible` o `ansible-playbook` actúa como controlador.

En esta práctica, ese nodo es el agente Jenkins.

El controlador Jenkins coordina el job, pero no necesariamente ejecuta Ansible por sí mismo.

### Agente Jenkins

El agente asignado al job ejecuta los comandos.

Debe disponer de:

- Ansible.
- Shell compatible con el pipeline.
- Git si Jenkins obtiene el código mediante SCM.
- Acceso al workspace.
- Permisos limitados.

### Workspace

El workspace contiene el checkout, el inventario, los playbooks y los archivos generados.

Los archivos se crean dentro del área asignada al job.

No trates el workspace como almacenamiento permanente.

### Modo de comprobación

Ansible dispone de la opción:

```text
--check
```

Intenta predecir los cambios que producirían las tareas compatibles.

No todas las tareas y módulos soportan el modo de comprobación de la misma manera.

El modo de comprobación no es una garantía absoluta de que una ejecución normal vaya a ser inocua.

### Diferencia entre `--check` y ejecución normal

- `--check`: solicita una simulación o predicción para las tareas compatibles.
- Ejecución normal: realiza las acciones definidas en el playbook.

En esta práctica la ejecución normal solo escribe dentro del workspace local.

### No confundir `--check` con aprobación

Un resultado de `--check` no sustituye:

- Revisión de código.
- Revisión de inventario.
- Aprobación de cambios.
- Autorización del propietario del sistema.
- Comprobaciones posteriores.

---

## Preparación del laboratorio

La configuración de ejemplo limita el alcance a `localhost` y al workspace del job.

### Estructura del repositorio

Crea la estructura:

```text
integracion-ansible/
├── Jenkinsfile
├── README.md
└── ansible/
    ├── inventory/
    │   └── lab.ini
    └── playbooks/
        └── lab.yml
```

El directorio de salida se creará durante la ejecución:

```text
ansible/build-output/
```

### Crear los directorios

```bash
mkdir -p ansible/inventory
mkdir -p ansible/playbooks
```

El comando debe ejecutarse desde el directorio raíz del repositorio.

### Inventario `ansible/inventory/lab.ini`

Crea el archivo:

```ini
[local]
localhost ansible_connection=local
```

El inventario:

- Declara un grupo llamado `local`.
- Incluye solo el host `localhost`.
- Indica una conexión local.
- No requiere SSH.
- No contiene usuarios ni contraseñas.

### Revisar el inventario

Antes de usarlo, comprueba que:

- No aparecen otros hosts.
- No hay direcciones de servidores reales.
- No hay claves ni contraseñas.
- La conexión es local.
- El pipeline usa la ruta de inventario esperada.

### Playbook `ansible/playbooks/lab.yml`

Crea este archivo:

```yaml
---
- name: Práctica local de integración Jenkins y Ansible
  hosts: local
  gather_facts: false
  become: false

  tasks:
    - name: Confirmar que se ejecuta en el host local
      ansible.builtin.assert:
        that:
          - inventory_hostname == "localhost"
          - ansible_connection == "local"
        fail_msg: "El playbook debe ejecutarse únicamente en localhost."
        success_msg: "El destino local del laboratorio está confirmado."

    - name: Crear directorio de salida en el workspace
      ansible.builtin.file:
        path: "{{ playbook_dir }}/../build-output"
        state: directory
        mode: "0755"

    - name: Crear resumen de laboratorio
      ansible.builtin.copy:
        dest: "{{ playbook_dir }}/../build-output/resumen.txt"
        content: |
          Práctica: integración de Jenkins y Ansible
          Alcance: laboratorio local
          Destino: localhost
          Acceso remoto: no utilizado
        mode: "0644"

    - name: Mostrar el resumen de la práctica
      ansible.builtin.debug:
        msg: "El archivo de resumen se creó dentro del workspace."
```

### Qué hace el playbook

- Selecciona el grupo `local`.
- Desactiva la recopilación de facts.
- Desactiva la elevación de privilegios.
- Comprueba que el único destino es `localhost`.
- Crea un directorio bajo `ansible/build-output`.
- Crea un archivo de texto no sensible.
- Muestra un mensaje breve.

### Qué no hace el playbook

No:

- Utiliza SSH.
- Cambia archivos fuera del repositorio.
- Instala software.
- Modifica cuentas.
- Cambia servicios.
- Reinicia máquinas.
- Usa `sudo`.
- Ejecuta `become`.
- Llama a una API externa.

### Por qué se utiliza `playbook_dir`

`playbook_dir` es una variable de Ansible que identifica el directorio del playbook.

El ejemplo construye una ruta relativa al repositorio:

```text
ansible/playbooks/../build-output
```

La ubicación resultante queda dentro de `ansible/build-output`.

No sustituyas esta ruta por una ubicación de sistema.

### Por qué se define `mode`

Los modos de archivo hacen explícito el permiso previsto.

En el ejemplo:

- El directorio usa `0755`.
- El archivo usa `0644`.

Estos permisos son solo para el archivo de laboratorio dentro del workspace.

No los copies de forma automática a configuraciones de sistemas reales.

### Archivo `README.md`

Crea un texto breve:

```text
Práctica de integración de Jenkins y Ansible.
El playbook se ejecuta únicamente en localhost.
Las tareas escriben un archivo dentro del workspace.
No se conectan servidores remotos ni se usan credenciales.
```

### `.gitignore` de laboratorio

Puedes añadir:

```gitignore
ansible/build-output/
*.retry
```

Revisa las políticas del repositorio antes de ampliar este archivo.

### Qué no ignorar sin revisar

No excluyas por defecto:

- Playbooks.
- Inventarios de laboratorio.
- `Jenkinsfile`.
- Archivos de configuración necesarios.
- Archivos de dependencias aprobados.

### No versionar secretos

No añadas al repositorio:

- Claves privadas.
- Contraseñas.
- Tokens.
- Archivos de credenciales.
- Inventarios de producción.
- Variables con secretos.
- Logs con información sensible.

---

## Prueba local de Ansible

Antes de integrar Jenkins, se puede comprobar el proyecto desde una terminal autorizada.

### Comprobar la versión

```bash
ansible --version
```

La salida identifica la versión y parte de la configuración de Ansible.

No es necesario publicar la salida completa si incluye rutas internas.

### Comprobar la versión del ejecutable de playbooks

```bash
ansible-playbook --version
```

Usa la versión aprobada por el curso.

### Validar el inventario

```bash
ansible-inventory \
  -i ansible/inventory/lab.ini \
  --list
```

Comprueba que solo aparece `localhost`.

### Mostrar los hosts del playbook

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --list-hosts
```

La lista debe mostrar únicamente el grupo local y `localhost`.

### Comprobar la sintaxis

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --syntax-check
```

El comando valida la estructura del playbook.

No ejecuta las tareas.

### Ejecutar en modo de comprobación

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --check \
  --diff
```

El modo de comprobación puede mostrar predicciones.

La opción `--diff` puede mostrar diferencias de archivos.

En este laboratorio el contenido es público y no sensible.

### Ejecutar localmente

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml
```

Este comando realiza las tareas definidas.

En el ejemplo, la única escritura es dentro del proyecto de laboratorio.

### Revisar los resultados

Busca las estadísticas finales de Ansible:

```text
ok
changed
unreachable
failed
skipped
rescued
ignored
```

El texto exacto depende de la versión y del formato de salida.

### Revisar el archivo generado

```bash
cat ansible/build-output/resumen.txt
```

Este comando debe utilizarse solo en el workspace de práctica.

### Ejecutar una segunda vez

Vuelve a ejecutar el playbook.

Las tareas de creación de directorio y archivo deberían reconocer que el estado ya coincide, salvo cambios en la versión o en el contenido.

Observa si Ansible informa `changed=0` en una segunda ejecución.

---

## Preparar Jenkins

Jenkins debe tener un agente con Ansible y acceso al repositorio.

### Agente de laboratorio

Identifica el agente aprobado por el curso.

Registra:

```text
Etiqueta:
Sistema operativo:
Versión de Ansible:
Versión de Git:
Carpeta del job:
Política de limpieza:
```

No registres direcciones restringidas ni datos sensibles.

### Herramientas del agente

Comprueba que el agente dispone de:

- `ansible`
- `ansible-playbook`
- `ansible-inventory`
- `git`, si se usa SCM
- Shell compatible con el pipeline

No instales paquetes en un nodo compartido.

### Si Ansible no está instalado

1. Registra el nombre del agente.
2. Guarda el mensaje de error.
3. Verifica la etiqueta solicitada.
4. Consulta al docente o administrador.
5. Usa el agente de laboratorio preparado.
6. No descargues e instales Ansible por tu cuenta.

### Ansible Core y paquetes

Las distribuciones pueden empaquetar Ansible de forma diferente.

En algunos entornos se instala `ansible-core`; en otros, un paquete que incluye más colecciones.

Comprueba que los comandos y módulos usados por el proyecto están disponibles.

### Colecciones

Los módulos `ansible.builtin` pertenecen al conjunto integrado de Ansible.

No se requiere instalar colecciones externas para esta práctica.

Si un playbook real usa una colección, revisa:

- Fuente.
- Versión.
- Firma o integridad, si corresponde.
- Mantenimiento.
- Compatibilidad.
- Aprobación interna.

### Job de Pipeline

El job puede configurarse:

- Desde un script pegado en la interfaz.
- Desde un `Jenkinsfile` en SCM.
- Mediante una plantilla administrada por el curso.

Para entregar y revisar cambios, se recomienda versionar el `Jenkinsfile`.

### Configuración SCM

Comprueba:

- Repositorio correcto.
- Rama correcta.
- Ruta de `Jenkinsfile`.
- Credencial de solo lectura, si se necesita.
- Commit que ejecuta el job.

No incluyas un token en la URL del repositorio.

### Credenciales para este laboratorio

No se necesitan credenciales SSH ni credenciales de servidor.

Si Jenkins te solicita una clave o contraseña para el playbook de laboratorio, detente y verifica la configuración.

### Variables de entorno

No imprimas todas las variables del agente.

Una variable de entorno puede contener información sensible.

Utiliza únicamente los valores no sensibles requeridos por el ejercicio.

### Permisos del job

El job debe tener permisos limitados a:

- Leer el repositorio.
- Ejecutar el pipeline.
- Escribir dentro de su workspace.
- Archivar el resumen de laboratorio, si se solicita.

No requiere permisos administrativos sobre el agente.

---

## Construir el pipeline

El pipeline validará los archivos antes de ejecutar el playbook.

### Etiqueta del agente

El ejemplo utiliza:

```groovy
label 'ansible-lab'
```

Sustitúyela por la etiqueta asignada.

No uses un agente distinto para evitar una cola sin entender sus permisos.

### Pipeline mínimo

```groovy
pipeline {
    agent {
        label 'ansible-lab'
    }

    stages {
        stage('Versión de Ansible') {
            steps {
                sh 'ansible-playbook --version'
            }
        }
    }
}
```

### Añadir timestamps y timeout

```groovy
options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')
}
```

El timeout debe permitir el checkout y la ejecución normal del laboratorio.

### Comprobar el inventario

```groovy
stage('Validar inventario') {
    steps {
        sh '''
            set -eu
            ansible-inventory \
              -i ansible/inventory/lab.ini \
              --list
        '''
    }
}
```

La consola debe mostrar únicamente el host local.

### Comprobar que solo se selecciona `localhost`

```groovy
stage('Listar hosts seleccionados') {
    steps {
        sh '''
            set -eu
            ansible-playbook \
              -i ansible/inventory/lab.ini \
              ansible/playbooks/lab.yml \
              --list-hosts
        '''
    }
}
```

No continúes si aparecen hosts inesperados.

### Comprobar la sintaxis

```groovy
stage('Sintaxis del playbook') {
    steps {
        sh '''
            set -eu
            ansible-playbook \
              -i ansible/inventory/lab.ini \
              ansible/playbooks/lab.yml \
              --syntax-check
        '''
    }
}
```

La etapa no debería realizar cambios.

### Ejecutar en modo de comprobación

```groovy
stage('Modo de comprobación') {
    steps {
        sh '''
            set -eu
            ansible-playbook \
              -i ansible/inventory/lab.ini \
              ansible/playbooks/lab.yml \
              --check \
              --diff
        '''
    }
}
```

Comprueba que el objetivo sigue siendo `localhost`.

### Ejecutar el playbook local

```groovy
stage('Ejecutar playbook local') {
    steps {
        sh '''
            set -eu
            ansible-playbook \
              -i ansible/inventory/lab.ini \
              ansible/playbooks/lab.yml
        '''
    }
}
```

La ejecución normal crea el directorio y el archivo de laboratorio dentro del workspace.

### Comprobar el archivo generado

```groovy
stage('Verificar salida') {
    steps {
        sh '''
            set -eu
            test -f ansible/build-output/resumen.txt
            grep -q "Acceso remoto: no utilizado" \
              ansible/build-output/resumen.txt
        '''
    }
}
```

La comprobación falla si el archivo no existe o no contiene el texto esperado.

### Archivar el resumen

```groovy
stage('Archivar resumen') {
    steps {
        archiveArtifacts(
            artifacts: 'ansible/build-output/resumen.txt',
            fingerprint: true
        )
    }
}
```

El patrón es específico y no incluye el estado del agente ni credenciales.

### Acciones posteriores

```groovy
post {
    success {
        echo 'El playbook local terminó correctamente.'
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
```

### No ocultar fallos

Evita añadir:

```groovy
sh 'ansible-playbook ... || true'
```

Ese patrón puede hacer que el pipeline continúe aunque el playbook haya fallado.

### No usar `catchError` como atajo

`catchError` puede permitir que un pipeline continúe tras un fallo.

No lo uses para convertir un fallo obligatorio en una ejecución verde.

### No imprimir el inventario completo en producción

El inventario del laboratorio no contiene datos sensibles.

En entornos reales, un inventario puede revelar:

- Nombres de servidores.
- Direcciones.
- Grupos.
- Variables.
- Topología.

No publiques ese contenido sin revisar la política aplicable.

---

## Jenkinsfile completo de laboratorio

El siguiente archivo mantiene el alcance local y archiva únicamente un resumen no sensible.

```groovy
pipeline {
    agent {
        label 'ansible-lab'
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
                    ansible --version
                    ansible-playbook --version
                    git --version
                '''
            }
        }

        stage('Validar inventario') {
            steps {
                sh '''
                    set -eu
                    ansible-inventory \
                      -i ansible/inventory/lab.ini \
                      --list
                '''
            }
        }

        stage('Comprobar hosts seleccionados') {
            steps {
                sh '''
                    set -eu
                    ansible-playbook \
                      -i ansible/inventory/lab.ini \
                      ansible/playbooks/lab.yml \
                      --list-hosts
                '''
            }
        }

        stage('Comprobar sintaxis') {
            steps {
                sh '''
                    set -eu
                    ansible-playbook \
                      -i ansible/inventory/lab.ini \
                      ansible/playbooks/lab.yml \
                      --syntax-check
                '''
            }
        }

        stage('Comprobar cambios previstos') {
            steps {
                sh '''
                    set -eu
                    ansible-playbook \
                      -i ansible/inventory/lab.ini \
                      ansible/playbooks/lab.yml \
                      --check \
                      --diff
                '''
            }
        }

        stage('Ejecutar en localhost') {
            steps {
                sh '''
                    set -eu
                    ansible-playbook \
                      -i ansible/inventory/lab.ini \
                      ansible/playbooks/lab.yml
                '''
            }
        }

        stage('Verificar salida') {
            steps {
                sh '''
                    set -eu
                    test -f ansible/build-output/resumen.txt
                    grep -q "Destino: localhost" \
                      ansible/build-output/resumen.txt
                    grep -q "Acceso remoto: no utilizado" \
                      ansible/build-output/resumen.txt
                '''
            }
        }

        stage('Archivar resumen') {
            steps {
                archiveArtifacts(
                    artifacts: 'ansible/build-output/resumen.txt',
                    fingerprint: true
                )
            }
        }
    }

    post {
        success {
            echo 'La integración local de Jenkins y Ansible terminó correctamente.'
        }

        failure {
            echo 'Falló una comprobación o una tarea del playbook.'
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

### Revisar el pipeline completo

Antes de ejecutar, confirma:

- Que `ansible-lab` es la etiqueta autorizada.
- Que el repositorio contiene el inventario y el playbook.
- Que el inventario solo incluye `localhost`.
- Que `become` está desactivado.
- Que no hay claves ni contraseñas.
- Que el patrón de archivado es específico.
- Que el playbook escribe dentro de `ansible/build-output`.
- Que no hay tareas remotas.
- Que no existen comandos de instalación o reinicio.

### Sobre `set -eu`

En los ejemplos de shell:

- `set -e` hace que la shell termine ante ciertos errores.
- `set -u` hace que la shell trate variables no definidas como error.

El comportamiento concreto depende de la shell.

Los comandos del ejemplo no dependen de interpolar parámetros libres.

### Evitar concatenación insegura

No construyas comandos así:

```groovy
sh "ansible-playbook ${params.COMANDO}"
```

Un parámetro de texto puede introducir opciones o comandos inesperados.

Usa argumentos constantes y entradas validadas.

### ¿Por qué se verifica el archivo después?

La etapa de verificación confirma que:

- El playbook se ejecutó.
- La ruta esperada existe.
- El contenido corresponde al laboratorio.
- El artefacto puede archivarse.

La verificación no sustituye la revisión del resultado Ansible.

---

## Idempotencia y repetición

Ejecutar una configuración más de una vez ayuda a comprobar si mantiene el estado sin cambios innecesarios.

### Primera ejecución

En una primera ejecución, el directorio y el archivo quizá no existan.

Es habitual que algunas tareas indiquen `changed`.

### Segunda ejecución

En una segunda ejecución, el directorio y el archivo ya deberían estar presentes.

Si su estado y contenido coinciden con el playbook, las tareas deberían indicar que no hace falta modificarlos.

### Repetir desde Jenkins

1. Ejecuta el job una vez.
2. Anota el resumen final de Ansible.
3. Ejecuta el mismo job de nuevo.
4. Compara los contadores.
5. Comprueba si el workspace se conserva entre ejecuciones.
6. Interpreta los resultados con la política de limpieza del agente.

### Workspace limpio

Algunas configuraciones limpian el workspace antes de cada build.

En ese caso, la segunda ejecución puede volver a crear los archivos porque parte de un checkout limpio.

No concluyas que la tarea no es idempotente sin comprobar si el workspace fue reiniciado.

### Idempotencia del módulo y limpieza del agente

Son dos conceptos distintos:

- **Idempotencia:** el módulo reconoce el estado deseado.
- **Workspace limpio:** Jenkins elimina archivos entre builds.

Un workspace nuevo puede hacer que una tarea idempotente informe `changed` en cada build.

### Comparación justa

Para comprobar idempotencia:

- Ejecuta dos veces dentro del mismo workspace.
- Evita limpiar entre ejecuciones.
- Usa el mismo inventario.
- Usa la misma revisión.
- Usa el mismo agente.
- Compara la salida de las tareas.

Hazlo solo si la política del curso permite reutilizar el workspace.

---

## Sesiones prácticas

Las sesiones progresan desde la inspección del entorno hasta el pipeline completo.

### Preparación común

Antes de empezar:

- Confirma que usas el repositorio de laboratorio.
- Comprueba que el agente está aprobado.
- No añadas hosts remotos.
- No uses credenciales SSH.
- No ejecutes `become`.
- No instales paquetes en un nodo compartido.
- Guarda el número del build.
- Revisa las salidas antes de compartirlas.
- Restaura los cambios de prueba.
- Pide ayuda si el inventario muestra hosts inesperados.

### Sesión 1: identificar componentes

**Objetivo:** dibujar el flujo de ejecución.

#### Actividad

Dibuja:

```text
Repositorio
     |
     v
Jenkins Controller
     |
     v
Agente Jenkins con Ansible
     |
     v
ansible-playbook
     |
     v
localhost del agente
```

#### Preguntas

- ¿Dónde se ejecuta `ansible-playbook`?
- ¿Qué significa `localhost` en esta configuración?
- ¿Qué componente obtiene el código?
- ¿Qué se guarda en el workspace?
- ¿Qué componente muestra la consola?

### Sesión 2: verificar herramientas

**Objetivo:** comprobar el entorno del agente.

Ejecuta en el agente autorizado:

```bash
ansible --version
```

Después:

```bash
ansible-playbook --version
```

#### Instrucciones

1. Registra la versión.
2. Comprueba que los ejecutables están disponibles.
3. No imprimas todo el entorno.
4. No instales versiones por tu cuenta.
5. Informa si la versión no cumple los requisitos del curso.

### Sesión 3: crear el inventario local

**Objetivo:** limitar el playbook a `localhost`.

Crea `ansible/inventory/lab.ini`:

```ini
[local]
localhost ansible_connection=local
```

#### Instrucciones

1. Guarda el archivo en la ruta indicada.
2. Ejecuta `ansible-inventory --list`.
3. Ejecuta `--list-hosts`.
4. Confirma que solo aparece `localhost`.
5. No añadas direcciones de servidores reales.
6. Anota el resultado.

### Sesión 4: inspeccionar el inventario

**Objetivo:** aprender a comprobar los hosts antes de ejecutar.

```bash
ansible-inventory \
  -i ansible/inventory/lab.ini \
  --list
```

Después:

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --list-hosts
```

#### Preguntas

- ¿Qué hosts selecciona el playbook?
- ¿Qué ocurriría si el inventario incluyera más hosts?
- ¿Por qué conviene comprobar el alcance antes de ejecutar?

### Sesión 5: crear un playbook mínimo

**Objetivo:** ejecutar una tarea de solo lectura.

Crea `ansible/playbooks/lab.yml`:

```yaml
---
- name: Práctica local
  hosts: local
  gather_facts: false
  become: false

  tasks:
    - name: Mostrar mensaje de laboratorio
      ansible.builtin.debug:
        msg: "Ansible se ejecutó desde el agente Jenkins."
```

#### Instrucciones

1. Revisa indentación YAML.
2. Ejecuta `--syntax-check`.
3. Ejecuta el playbook con el inventario local.
4. Comprueba la salida.
5. Explica qué hace `debug`.
6. Confirma que no se escribió ningún archivo.

### Sesión 6: validar sintaxis

**Objetivo:** diferenciar sintaxis de ejecución.

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --syntax-check
```

#### Instrucciones

1. Ejecuta con el YAML válido.
2. Anota el resultado.
3. En una copia temporal, cambia la indentación de una tarea.
4. Repite la comprobación.
5. Lee el archivo y la línea del error.
6. Restaura la indentación correcta.

### Sesión 7: listar hosts antes de ejecutar

**Objetivo:** comprobar el alcance de un playbook.

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --list-hosts
```

#### Instrucciones

1. Comprueba que solo aparece `localhost`.
2. Comprueba que el playbook apunta al grupo `local`.
3. Registra la salida sin copiar datos innecesarios.
4. No ejecutes si aparece un destino inesperado.
5. Consulta al docente si el inventario no coincide.

### Sesión 8: añadir una aserción de seguridad

**Objetivo:** comprobar que el destino sigue siendo local.

Añade como primera tarea:

```yaml
    - name: Confirmar que se ejecuta en el host local
      ansible.builtin.assert:
        that:
          - inventory_hostname == "localhost"
          - ansible_connection == "local"
        fail_msg: "El playbook debe ejecutarse únicamente en localhost."
```

#### Instrucciones

1. Ejecuta `--syntax-check`.
2. Ejecuta el playbook.
3. Confirma que la aserción se supera.
4. En una copia aislada, cambia temporalmente el host.
5. Comprueba que la aserción falla.
6. Restaura `localhost`.

### Sesión 9: crear el directorio de salida

**Objetivo:** crear una carpeta dentro del workspace.

Añade:

```yaml
    - name: Crear directorio de salida
      ansible.builtin.file:
        path: "{{ playbook_dir }}/../build-output"
        state: directory
        mode: "0755"
```

#### Instrucciones

1. Ejecuta el playbook en modo `--check`.
2. Observa la predicción.
3. Ejecuta normalmente.
4. Comprueba la carpeta.
5. Confirma que no se creó nada fuera del proyecto.

### Sesión 10: crear un archivo local

**Objetivo:** escribir un archivo inocuo dentro del workspace.

Añade:

```yaml
    - name: Crear resumen de laboratorio
      ansible.builtin.copy:
        dest: "{{ playbook_dir }}/../build-output/resumen.txt"
        content: |
          Práctica: integración de Jenkins y Ansible
          Alcance: laboratorio local
          Destino: localhost
          Acceso remoto: no utilizado
        mode: "0644"
```

#### Instrucciones

1. Comprueba que el destino está dentro del repositorio.
2. Ejecuta en modo de comprobación.
3. Ejecuta normalmente.
4. Lee el archivo.
5. Comprueba los permisos si el sistema lo permite.
6. No añadas información personal ni secretos.

### Sesión 11: comprobar `--check`

**Objetivo:** observar la predicción de cambios.

```bash
ansible-playbook \
  -i ansible/inventory/lab.ini \
  ansible/playbooks/lab.yml \
  --check \
  --diff
```

#### Instrucciones

1. Ejecuta antes de la ejecución normal.
2. Revisa qué tareas predicen cambios.
3. Ejecuta el playbook normalmente en el workspace de laboratorio.
4. Vuelve a ejecutar `--check`.
5. Compara los resultados.
6. Anota qué tareas soportan el modo de comprobación.

### Sesión 12: comprobar idempotencia

**Objetivo:** comparar dos ejecuciones normales en el mismo workspace.

#### Instrucciones

1. Ejecuta el playbook.
2. Anota `changed` y `ok`.
3. Ejecuta el mismo playbook otra vez sin limpiar.
4. Compara el resumen.
5. Revisa que el contenido del archivo no cambió.
6. Explica por qué una limpieza de workspace modifica el resultado observado.

### Sesión 13: introducir un error YAML

**Objetivo:** diagnosticar sintaxis inválida.

#### Instrucciones

1. Crea una copia temporal del playbook.
2. Cambia una indentación o una clave de forma controlada.
3. Ejecuta `--syntax-check`.
4. Registra el diagnóstico.
5. No confirmes el archivo roto en la rama compartida.
6. Corrige el YAML.
7. Vuelve a validar.

### Sesión 14: provocar un fallo de aserción

**Objetivo:** comprobar que una condición obligatoria detiene la ejecución.

#### Instrucciones

1. Trabaja en una copia aislada.
2. Cambia la condición de la aserción para que sea falsa.
3. Ejecuta el playbook.
4. Identifica la tarea que falló.
5. Observa si las tareas posteriores se ejecutan.
6. Restaura la condición correcta.

### Sesión 15: comprobar el inventario en Jenkins

**Objetivo:** validar el inventario desde un agente.

#### Instrucciones

1. Añade una etapa de `ansible-inventory --list`.
2. Ejecuta el job.
3. Confirma que el agente usa el repositorio esperado.
4. Confirma que el inventario es el del proyecto.
5. Registra la etiqueta del agente.
6. No copies inventarios de otras prácticas.

### Sesión 16: añadir `--syntax-check` al pipeline

**Objetivo:** hacer que Jenkins valide el YAML antes de ejecutar tareas.

#### Instrucciones

1. Añade una etapa `Sintaxis del playbook`.
2. Utiliza la ruta relativa del repositorio.
3. Ejecuta el job.
4. Cambia temporalmente una copia del YAML.
5. Comprueba que la etapa falla antes de la ejecución.
6. Restaura y confirma el archivo válido.

### Sesión 17: añadir modo de comprobación

**Objetivo:** mostrar cambios previstos antes de la ejecución normal.

#### Instrucciones

1. Añade la etapa `Modo de comprobación`.
2. Ejecuta con `--check --diff`.
3. Comprueba la salida.
4. Confirma que no hay un destino remoto.
5. Ejecuta después la etapa local normal.
6. Compara ambos resultados.

### Sesión 18: integrar el Jenkinsfile completo

**Objetivo:** ejecutar el pipeline de extremo a extremo.

#### Instrucciones

1. Crea el `Jenkinsfile`.
2. Usa la etiqueta asignada.
3. Comprueba todas las rutas.
4. Guarda el archivo en SCM.
5. Ejecuta el job.
6. Revisa cada etapa.
7. Comprueba el resumen archivado.
8. Registra el número del build.

### Sesión 19: probar un inventario con destino inesperado

**Objetivo:** demostrar por qué el inventario debe revisarse.

Esta sesión se hace solo con un inventario de ejemplo suministrado por el docente.

#### Instrucciones

1. No añadas una IP real.
2. Utiliza una entrada ficticia autorizada.
3. Ejecuta únicamente `--list-hosts`.
4. Comprueba qué hosts aparecen.
5. No ejecutes el playbook.
6. Restaura el inventario local.
7. Explica qué control impidió una ejecución fuera de alcance.

### Sesión 20: revisar salida de Ansible

**Objetivo:** interpretar el resumen de ejecución.

Registra:

```text
ok:
changed:
unreachable:
failed:
skipped:
```

#### Instrucciones

1. Identifica una tarea que haya cambiado.
2. Identifica una tarea que no haya cambiado.
3. Explica si el modo era normal o `--check`.
4. No interpretes `skipped` como `ok`.
5. Comprueba el resultado global de Jenkins.

### Sesión 21: revisar el artefacto

**Objetivo:** comprobar que Jenkins conserva solo una salida no sensible.

#### Instrucciones

1. Abre el build.
2. Localiza el artefacto `resumen.txt`.
3. Comprueba que contiene datos del laboratorio.
4. Confirma que no se archivó el inventario completo.
5. Confirma que no se archivaron credenciales.
6. Registra la política de retención indicada por el curso.

### Sesión 22: revisar variables y logs

**Objetivo:** evitar exposición accidental de datos.

#### Instrucciones

1. Revisa el `Jenkinsfile`.
2. Busca `env`.
3. Busca `printenv`.
4. Busca contraseñas o tokens.
5. Busca parámetros insertados en comandos.
6. Revisa la consola del build.
7. Elimina cualquier dato innecesario antes de compartir.

### Sesión 23: comparar tarea imperativa y módulo declarativo

**Objetivo:** valorar el comportamiento idempotente de los módulos.

#### Actividad

Compara conceptualmente:

- Una llamada a shell que crea un archivo.
- El módulo `ansible.builtin.copy`.
- El módulo `ansible.builtin.file`.

#### Preguntas

- ¿Qué información conoce Ansible sobre el estado deseado?
- ¿Qué salida ofrece un módulo?
- ¿Qué puede salir mal si se ejecuta un comando shell a ciegas?
- ¿Por qué se prefieren módulos para tareas soportadas?

No introduzcas comandos de sistema que modifiquen el host del agente.

### Sesión 24: revisión por parejas

**Objetivo:** revisar claridad y seguridad del pipeline.

La persona autora explica:

- Qué inventario utiliza.
- Qué grupo selecciona.
- Qué tareas realiza.
- Dónde se escribe el archivo.
- Qué comprueba `--check`.
- Qué salida archiva Jenkins.

La persona revisora comprueba:

- Solo `localhost` en el inventario.
- `become: false`.
- Sin tareas remotas.
- Sin credenciales.
- Rutas dentro del workspace.
- Sin comandos de instalación.
- Patrón de artefactos específico.
- Errores visibles.

### Sesión 25: proyecto integrador

**Objetivo:** entregar una integración segura de Ansible y Jenkins.

#### Requisitos

- Inventario de laboratorio.
- Playbook local.
- `Jenkinsfile` versionado.
- Etapa de herramientas.
- Etapa de inventario.
- Etapa de sintaxis.
- Etapa de comprobación.
- Ejecución local.
- Comprobación de salida.
- Artefacto no sensible.
- Prueba de éxito.
- Prueba de fallo controlado.
- Sin hosts remotos.
- Sin SSH.
- Sin `become`.
- Sin credenciales.
- Sin cambios fuera del workspace.

#### Entrega

Incluye:

- Identificador del repositorio.
- Rama y commit.
- Número del build exitoso.
- Número del build fallido.
- Versión de Ansible.
- Etiqueta del agente.
- Resumen de hosts seleccionados.
- Resultado de las tareas.
- Riesgo identificado.
- Explicación de por qué el ejercicio se limita a `localhost`.

---

## Uso de Ansible en entornos reales

El paso de `localhost` a servidores remotos aumenta considerablemente el impacto potencial.

### Inventario remoto

Un inventario real puede incluir:

- Nombres DNS.
- Direcciones de red.
- Grupos por entorno.
- Variables de conexión.
- Variables de aplicación.
- Información operativa.

El acceso al inventario debe limitarse.

No lo publiques si contiene información restringida.

### Revisar el alcance antes de ejecutar

Antes de una ejecución real, comprueba:

- Inventario.
- Grupo seleccionado.
- Patrón de hosts.
- Playbook.
- Rama y commit.
- Usuario de conexión.
- Privilegios solicitados.
- Número de hosts afectados.
- Comportamiento esperado.

`--list-hosts` puede ayudar a confirmar el alcance, pero no sustituye una revisión.

### SSH

Ansible suele usar SSH para administrar hosts Unix remotos.

Una integración real requiere:

- Identidad aprobada.
- Gestión de claves.
- Verificación de host.
- Red autorizada.
- Usuario limitado.
- Permisos definidos.
- Revocación documentada.

Esta práctica no configura SSH.

### No desactivar la verificación de host

No uses opciones como:

```text
host_key_checking = False
```

como solución general para errores de SSH.

La comprobación de host ayuda a verificar que la conexión llega al destino esperado.

La política de claves conocidas debe seguir el procedimiento de la organización.

### Claves privadas

No guardes claves privadas en:

- Git.
- `Jenkinsfile`.
- Inventario.
- Workspace permanente.
- Consola.
- Artefactos.
- Variables sin protección.

Usa el almacén de credenciales aprobado y limita el acceso al job.

### Plugin SSH Agent

Algunas instancias usan un plugin o integración para exponer una clave SSH durante un bloque de pipeline.

La sintaxis depende del plugin y de la política local.

No copies una clave en el repositorio ni ejecutes el ejemplo con servidores reales sin autorización.

### Host keys

La clave pública del host remoto debe verificarse según el procedimiento aprobado.

No aceptes automáticamente cualquier host key.

### `become`

`become` permite elevar privilegios en el host administrado.

Puede utilizarse con `sudo` u otros métodos, según la configuración.

No lo habilites por defecto.

Antes de usarlo:

- Identifica tareas que requieren privilegios.
- Limita el alcance.
- Usa cuentas aprobadas.
- Aplica el mínimo privilegio.
- Define cómo se auditan las acciones.
- Asegura que las credenciales no aparezcan en logs.

### `become: true`

Una opción como:

```yaml
become: true
```

puede ampliar el impacto de cada tarea.

No la uses como solución genérica a errores de permisos.

### Instalación de paquetes

Instalar paquetes puede cambiar el host y acceder a repositorios.

Una tarea de instalación real requiere revisar:

- Paquete y versión.
- Repositorio.
- Política de actualización.
- Ventana de cambio.
- Impacto sobre el servicio.
- Método de reversión.

No se practica aquí.

### Gestión de servicios

Reiniciar o recargar servicios puede interrumpir usuarios.

No añadas tareas de servicio a un inventario real sin autorización explícita.

### Concurrencia

Una ejecución Ansible puede actuar sobre varios hosts en paralelo.

Controles como `serial` pueden limitar el número de hosts atendidos simultáneamente, pero deben diseñarse para el servicio concreto.

No ajustes concurrencia a ciegas.

### Ejecuciones por etapas

En un entorno controlado, puede ser necesario separar:

- Validación.
- Planificación o inspección.
- Aplicación en desarrollo.
- Revisión.
- Aplicación en producción.
- Verificación posterior.

La política depende de la organización y del impacto del sistema.

### Aprobación humana

Una aprobación útil debería especificar:

- Entorno.
- Hosts.
- Commit.
- Playbook.
- Resultado de comprobaciones.
- Cambio esperado.
- Persona autorizada.
- Ventana de ejecución.

Una pausa genérica en Jenkins no sustituye una revisión informada.

### Diferentes entornos

Desarrollo, pruebas y producción deben tener inventarios y permisos diferenciados.

No uses la misma credencial para todos los entornos si la política exige separación.

### Variables sensibles de Ansible

Ansible Vault puede cifrar variables, pero no elimina la necesidad de proteger:

- Contraseñas de Vault.
- Archivos descifrados.
- Logs.
- Variables en tiempo de ejecución.
- Acceso del job.
- Copias del repositorio.

Usa el procedimiento corporativo aprobado.

### `no_log`

`no_log: true` puede ocultar parte de la salida de una tarea.

No es un sustituto de una buena gestión de secretos.

Comprueba qué mensajes siguen apareciendo y evita que el playbook genere datos sensibles.

### Revisión de roles y colecciones

Antes de utilizar roles o colecciones externos, revisa:

- Origen.
- Mantenimiento.
- Versión.
- Dependencias.
- Cambios.
- Permisos.
- Integridad.
- Compatibilidad.

No descargues colecciones desconocidas en un agente compartido.

### Ansible Lint

`ansible-lint` puede detectar problemas de estilo y patrones potencialmente riesgosos.

Su disponibilidad y reglas dependen de la versión y configuración.

Si se usa, fija una versión aprobada y trata las advertencias según la política del proyecto.

### No convertir lint en una excusa para ignorar seguridad

Un pipeline verde después de omitir reglas no demuestra que el playbook sea seguro.

Documenta las excepciones y revisa su motivo.

---

## Diagnóstico de errores frecuentes

Los fallos pueden originarse en Jenkins, el agente, YAML, inventario o una tarea Ansible.

### `ansible-playbook` no encontrado

Comprueba:

- Etiqueta del agente.
- PATH.
- Versión de Ansible.
- Imagen del agente.
- Configuración de herramientas.
- Que el paso se ejecuta en el agente esperado.

No instales Ansible sin autorización.

### `ansible-inventory` no encontrado

Comprueba si el agente dispone de `ansible-core` o de la distribución aprobada.

Registra el error y consulta al administrador.

### Error de YAML

Comprueba:

- Indentación.
- Espacios.
- Dos puntos.
- Guiones de lista.
- Comillas.
- Claves duplicadas.
- Bloques correctamente anidados.

YAML utiliza espacios; no sustituyas indentación por tabuladores.

### Playbook no encontrado

Comprueba:

- Ruta relativa.
- Checkout.
- Rama.
- Nombre exacto.
- Mayúsculas y minúsculas.
- Directorio actual del shell.

### Inventario no encontrado

Comprueba:

- Ruta en el `-i`.
- Checkout del archivo.
- Nombre del directorio.
- Rama.
- Directorio desde el que se ejecuta el comando.

### No se selecciona ningún host

Comprueba:

- Nombre del grupo.
- Cláusula `hosts` del play.
- Sintaxis del inventario.
- Archivo especificado con `-i`.
- Salida de `--list-hosts`.

No cambies a `all` como solución rápida sin comprobar el alcance.

### Aparece un host inesperado

Detén la ejecución.

Comprueba:

- Inventario efectivo.
- Archivos de configuración.
- Variables de entorno.
- Fuentes dinámicas.
- Ruta de trabajo.
- Parámetros del job.

No ejecutes tareas sobre un destino desconocido.

### Fallo de conexión inesperado

En este laboratorio no debería haber una conexión remota.

Comprueba:

- Que el inventario tiene `ansible_connection=local`.
- Que el playbook usa el grupo local.
- Que no hay opciones SSH en el job.
- Que el inventario ejecutado es el del repositorio.

### Error de permiso en el archivo

Comprueba:

- Ruta real.
- Workspace.
- Usuario del agente.
- Propietario y permisos.
- Política de limpieza.
- Que no se usa una ruta del sistema.

No uses `chmod 777` para resolverlo.

### Error con `playbook_dir`

Comprueba:

- Ubicación del playbook.
- Relación entre directorios.
- Ruta relativa resultante.
- Workspace actual.
- Permisos de escritura.

No cambies a una ruta absoluta de un equipo personal.

### `--check` muestra `changed`

En modo de comprobación, `changed` puede indicar un cambio previsto.

Revisa el módulo y la salida.

No concluyas que se escribió el archivo sin comprobar el modo y el resultado.

### `--check` no predice una tarea

No todos los módulos predicen cambios correctamente en modo de comprobación.

Consulta la documentación del módulo y revisa su soporte.

No interpretes la ausencia de `changed` como prueba absoluta de que la ejecución normal no modificaría nada.

### La segunda ejecución vuelve a mostrar `changed`

Comprueba:

- Si Jenkins limpió el workspace.
- Si el contenido varía.
- Si el modo de archivo cambia.
- Si se está usando el mismo agente.
- Si la ruta es estable.
- Si el módulo es idempotente.

### `unreachable`

Indica que Ansible no alcanzó un host.

En esta práctica, el único destino debe ser local.

Si aparece, revisa inventario, conexión y comando invocado.

No agregues credenciales para “arreglarlo” sin comprender la causa.

### Tarea fallida

Busca:

- La tarea concreta.
- El módulo utilizado.
- La ruta.
- El mensaje de error.
- El host.
- Las tareas anteriores.
- El estado final del play.

No te limites al mensaje final del build.

### Build verde pese a un fallo Ansible

Busca:

- `|| true`.
- `returnStatus` no comprobado.
- `ignore_errors`.
- `failed_when` demasiado permisivo.
- `block` y `rescue` que cambian el flujo.
- Un script que termina con código cero.
- Un resultado convertido manualmente.

### El artefacto no aparece

Comprueba:

- Que el archivo se creó.
- Que el patrón de `archiveArtifacts` es correcto.
- Que la etapa de archivo se ejecutó.
- Que el build no falló antes.
- Que Jenkins permite archivar en esa carpeta.

### Consola demasiado extensa

Limita la salida a lo necesario.

No uses `-vvv` como configuración predeterminada.

La verbosidad alta puede exponer datos de conexión, variables o detalles internos.

### Ficha de diagnóstico

```text
Job:
Número de build:
Rama:
Commit:
Agente:
Versión Ansible:
Inventario utilizado:
Hosts seleccionados:
Playbook:
Primera tarea fallida:
Mensaje relevante:
Resultado:
Hipótesis:
Próxima comprobación:
```

### Diferenciar observación e hipótesis

Ejemplo:

```text
Observación:
--list-hosts muestra un host distinto de localhost.

Hipótesis:
Jenkins está utilizando otro inventario o una fuente dinámica.

Comprobación:
Revisar el argumento -i, la ruta y la configuración efectiva.
```

La hipótesis debe confirmarse antes de cambiar el job.

---

## Checklist de seguridad y calidad

### Inventario

- [ ] El inventario de práctica contiene solo `localhost`.
- [ ] Se declara `ansible_connection=local`.
- [ ] No hay direcciones de servidores reales.
- [ ] No hay contraseñas ni claves.
- [ ] `--list-hosts` se ejecutó antes del playbook.

### Playbook

- [ ] Se utiliza `gather_facts: false` cuando no hacen falta facts.
- [ ] Se utiliza `become: false`.
- [ ] Las tareas escriben dentro del workspace.
- [ ] No hay instalaciones de paquetes.
- [ ] No hay reinicios ni gestión de servicios.
- [ ] No hay comandos destructivos.
- [ ] Los módulos se identifican con `ansible.builtin`.
- [ ] Las tareas críticas fallan de forma visible.

### Jenkins

- [ ] El job usa el agente autorizado.
- [ ] Ansible está instalado en el agente.
- [ ] No se imprimen variables de entorno completas.
- [ ] No se almacenan credenciales en el repositorio.
- [ ] La consola no incluye datos sensibles.
- [ ] Los artefactos tienen patrones específicos.
- [ ] El timeout es razonable.
- [ ] La ejecución se probó con éxito y fallo controlado.

### Repositorio

- [ ] El `Jenkinsfile` está versionado.
- [ ] El inventario pertenece al laboratorio.
- [ ] No se incluyen inventarios de producción.
- [ ] No se incluyen claves SSH.
- [ ] No se incluyen archivos de Vault sin el proceso aprobado.
- [ ] Los archivos generados están excluidos si corresponde.
- [ ] Se revisa `git status` antes de confirmar cambios.

### Ejecución

- [ ] La salida de `--list-hosts` es la esperada.
- [ ] La sintaxis pasa.
- [ ] El modo de comprobación fue inspeccionado.
- [ ] La ejecución normal afecta solo al workspace.
- [ ] La idempotencia se evaluó con el workspace correcto.
- [ ] Se revisó el resultado de Jenkins.
- [ ] Se restauraron los cambios de prueba.

---

## Evaluación

La evaluación considera que el alumnado pueda explicar el alcance y demostrar el resultado.

### Evidencias mínimas

Entrega:

- Estructura del repositorio.
- Inventario local.
- Playbook.
- `Jenkinsfile`.
- Versión de Ansible.
- Salida resumida de `--list-hosts`.
- Build exitoso.
- Build fallido controlado.
- Artefacto de resumen.
- Informe de diagnóstico.
- Revisión de seguridad.

### Rúbrica

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Inventario | No está claro el alcance | Solo usa `localhost` | Justifica la validación de alcance |
| Playbook | Sintaxis incompleta | Tareas correctas y locales | Tareas idempotentes y bien documentadas |
| Jenkins | Pipeline incompleto | Etapas ordenadas | Pipeline fácil de diagnosticar |
| Comprobación | Ejecuta sin revisar | Usa syntax-check y check mode | Explica límites de las comprobaciones |
| Seguridad | Expone datos o permisos | No usa credenciales ni hosts remotos | Identifica riesgos de transición a producción |
| Diagnóstico | Solo informa “falló” | Señala la primera causa | Propone una comprobación verificable |
| Entrega | Evidencias insuficientes | Incluye builds y archivos | Es reproducible y no contiene datos sensibles |

### Preguntas de evaluación

1. ¿Qué diferencia hay entre inventario y playbook?
2. ¿Qué hace `ansible_connection=local`?
3. ¿Qué significa `hosts: local` en el playbook?
4. ¿Qué diferencia hay entre tarea y módulo?
5. ¿Qué significa `changed`?
6. ¿Qué diferencia hay entre modo de comprobación y ejecución normal?
7. ¿Por qué el modo de comprobación no garantiza seguridad absoluta?
8. ¿Dónde se ejecuta Ansible dentro de Jenkins?
9. ¿Qué archivos deben quedar dentro del workspace?
10. ¿Por qué se desactiva `become` en esta práctica?
11. ¿Qué comprobarías si aparece un host inesperado?
12. ¿Por qué no se deben almacenar claves SSH en Git?
13. ¿Qué riesgos aparecen al usar un inventario de producción?
14. ¿Qué podría revelar una salida con `-vvv`?
15. ¿Qué significa que una segunda ejecución sea idempotente?

### Ejercicio de revisión

Revisa esta configuración conceptual y lista al menos seis riesgos:

```text
Inventario: todos los servidores de la empresa
Playbook: instala paquetes y reinicia servicios
Credencial: clave SSH privada en el repositorio
Pipeline: ejecuta con become
Validación: no usa --list-hosts
Logs: modo verbose alto
Permisos: acceso compartido a todos los jobs
```

#### Respuestas orientativas

- Alcance del inventario demasiado amplio.
- Posible impacto sobre sistemas reales.
- Clave privada expuesta en Git.
- Privilegios elevados sin justificación.
- No se comprueban los hosts seleccionados.
- Verbosidad que puede revelar datos internos.
- Permisos compartidos y difíciles de auditar.
- No hay separación de entornos.
- No se describe aprobación.
- No hay plan de reversión.
- No se demuestra idempotencia.
- No se identifica propietario de los servicios.

---

## Glosario

- **Agente Jenkins:** nodo donde Jenkins ejecuta pasos.
- **Ansible:** herramienta para automatizar configuración y tareas sobre hosts.
- **Ansible Controller:** nodo desde el que se ejecuta Ansible.
- **Inventario:** lista de hosts y grupos disponibles.
- **Host:** destino seleccionado por Ansible.
- **Grupo:** conjunto de hosts con una etiqueta común.
- **Playbook:** archivo YAML que describe plays y tareas.
- **Play:** sección que asocia hosts y tareas.
- **Tarea:** acción individual del playbook.
- **Módulo:** implementación de una operación Ansible.
- **Facts:** datos que Ansible puede recopilar sobre un host.
- **Idempotencia:** propiedad por la que repetir una operación mantiene el estado deseado sin cambios innecesarios.
- **`localhost`:** host local del nodo que ejecuta Ansible en esta práctica.
- **`ansible_connection=local`:** configuración para ejecutar tareas localmente.
- **`become`:** mecanismo para ejecutar acciones con privilegios elevados.
- **`--check`:** opción que solicita una predicción de cambios para tareas compatibles.
- **`--diff`:** opción que muestra diferencias para tareas compatibles.
- **`--syntax-check`:** opción que comprueba la sintaxis del playbook.
- **`--list-hosts`:** opción que muestra los hosts seleccionados.
- **`ok`:** tarea ejecutada sin cambios necesarios, según el módulo.
- **`changed`:** tarea que realizó o prevé un cambio.
- **`failed`:** tarea fallida.
- **`unreachable`:** host que Ansible no pudo alcanzar.
- **`skipped`:** tarea que no se ejecutó.
- **Workspace:** directorio de trabajo asignado por Jenkins.
- **Colección:** paquete de módulos, roles y contenido Ansible.
- **Ansible Vault:** mecanismo de cifrado de datos utilizado por Ansible.
- **Host key:** clave que ayuda a verificar la identidad de un host SSH.
- **`ansible-lint`:** herramienta de análisis de estilo y patrones Ansible.
- **Credencial:** identidad o secreto administrado por Jenkins o por un sistema aprobado.

---

## Plantillas de documentación

### Ficha del proyecto

```text
Nombre del proyecto:
Repositorio:
Rama:
Commit:
Ruta del inventario:
Ruta del playbook:
Agente:
Versión de Ansible:
```

### Ficha de ejecución

```text
Job:
Número de build:
Agente:
Hosts seleccionados:
Modo: syntax-check / check / ejecución normal
Resultado Jenkins:
Resultado Ansible:
Artefacto generado:
```

### Ficha de diagnóstico

```text
Observación:
Primera tarea afectada:
Mensaje relevante:
Hipótesis:
Comprobación realizada:
Resultado:
Acción correctiva:
Prueba posterior:
```

### Ficha de seguridad

```text
¿Se usan hosts remotos?:
¿Se usan credenciales?:
¿Se usa become?:
¿El inventario es de laboratorio?:
¿Qué escribe el playbook?:
¿Dónde queda el resultado?:
¿Se archiva información sensible?:
```

### Ficha de revisión por parejas

```text
Inventario limitado:
Playbook local:
Sin become:
Sin SSH:
Sin secretos:
Sin tareas destructivas:
Rutas dentro del workspace:
Errores visibles:
Artefacto limitado:
```

---

## Síntesis final

La integración de Ansible con Jenkins comienza por comprender qué inventario se utiliza, qué playbook se ejecuta y en qué agente ocurren las tareas.

- El inventario define los destinos.
- El playbook define las tareas.
- El agente Jenkins ejecuta Ansible.
- `--list-hosts` ayuda a revisar el alcance.
- `--syntax-check` comprueba la sintaxis.
- `--check` predice algunos cambios, pero no garantiza que toda tarea sea inocua.
- Los módulos idempotentes suelen ser más claros y seguros que comandos imperativos sin control.
- Las credenciales y claves privadas nunca deben guardarse en el repositorio o la consola.
- `become` y las conexiones remotas requieren autorización y permisos mínimos.
- En esta práctica, Ansible solo se ejecuta contra `localhost`