# Objetivos del curso

El objetivo de este curso es introducir los principios de **DevOps** y la **integración continua** mediante el uso práctico de Jenkins. A lo largo de la formación, aprenderás a crear y organizar pipelines, conectar Jenkins con repositorios de código e incorporar herramientas de automatización como Terraform y Ansible.

La meta es que puedas comprender cómo encajan estas herramientas en un flujo de trabajo automatizado y construir una base sólida para seguir profundizando en CI/CD.

---

## Objetivo general

Al finalizar el curso, el alumnado podrá diseñar y ejecutar un flujo básico de integración continua con Jenkins, desde la obtención del código fuente hasta la ejecución de tareas automatizadas en un pipeline.

También comprenderá cómo ampliar ese flujo mediante agentes y cómo incorporar, a nivel introductorio, Terraform y Ansible para automatizar infraestructura y configuración.

---

## Objetivos específicos

Al completar el curso, podrás:

### Comprender los fundamentos de DevOps y CI/CD

- Explicar los principios generales de la cultura DevOps.
- Identificar cómo la colaboración, la automatización y la retroalimentación contribuyen al ciclo de desarrollo y entrega de software.
- Diferenciar entre **integración continua**, **entrega continua** y **despliegue continuo**.
- Reconocer el papel de Jenkins en la automatización de procesos de desarrollo y operaciones.

### Trabajar con Jenkins

- Describir los componentes básicos de la arquitectura de Jenkins.
- Comprender la función de los nodos y agentes en la ejecución de trabajos.
- Crear y configurar un job de tipo Freestyle.
- Crear pipelines básicos y comprender cómo se organizan mediante etapas y pasos.
- Reconocer las diferencias entre configurar un job desde la interfaz y definir un pipeline como código.

### Crear y mantener pipelines

- Interpretar la estructura de un `Jenkinsfile`.
- Conectar un pipeline con un repositorio de código mediante un sistema de gestión del código fuente (SCM).
- Utilizar parámetros y variables de entorno en un pipeline.
- Incorporar opciones, condiciones y pasos de aprobación manual cuando sean necesarios.
- Gestionar errores y límites de tiempo.
- Añadir acciones posteriores a la ejecución y notificaciones.
- Comprender el propósito del bloque `script` y usarlo en ejemplos de pipelines.

### Introducir herramientas de automatización

- Comprender el propósito de Terraform como herramienta de infraestructura como código.
- Seguir un flujo básico de inicialización y planificación con Terraform desde Jenkins.
- Reconocer la importancia de gestionar las credenciales de forma segura.
- Comprender cómo Ansible utiliza playbooks para automatizar tareas.
- Ejecutar tareas de automatización y orquestación desde un flujo de trabajo con Jenkins.
- Identificar el uso de Docker para ejecutar servicios o agentes en entornos aislados.

---

## Resultados de aprendizaje

Al terminar la formación, deberías poder realizar las siguientes tareas:

- Explicar de forma general cómo Jenkins participa en un proceso de integración continua.
- Crear un job sencillo y un pipeline básico.
- Leer y modificar un `Jenkinsfile` introductorio.
- Conectar un pipeline con un repositorio de código.
- Organizar la ejecución de un pipeline mediante etapas y agentes.
- Añadir parámetros, variables de entorno, control de errores y notificaciones básicas.
- Reconocer las fases habituales de un pipeline que utiliza Terraform.
- Ejecutar un playbook de Ansible desde un proceso automatizado, siguiendo los ejemplos del curso.

!!! note "Alcance del curso"
    Estos resultados corresponden a una formación introductoria y práctica. No sustituyen la documentación oficial ni cubren todos los escenarios de seguridad, escalabilidad y operación que pueden darse en entornos de producción.

---

## Cómo se relacionan los objetivos con el curso

Los objetivos se trabajan de forma progresiva. Primero se presentan los fundamentos de DevOps, CI/CD y Jenkins; después se practican jobs y pipelines; finalmente se introducen las integraciones con Terraform y Ansible.

| **Área** | **Competencia que se desarrolla** |
|---|---|
| DevOps y CI/CD | Comprender los conceptos y el propósito de la automatización. |
| Jenkins | Crear jobs, entender agentes y ejecutar pipelines. |
| Jenkinsfile | Definir pipelines como código y conectarlos con un repositorio. |
| Terraform | Introducir flujos de infraestructura como código en Jenkins. |
| Ansible | Automatizar tareas y orquestar acciones mediante playbooks. |
| Docker | Comprender el uso de contenedores y agentes aislados. |

---

## Criterio de aprovechamiento

Se considerará que has alcanzado los objetivos principales si puedes explicar el flujo de un pipeline básico, identificar sus componentes y seguir los ejercicios del curso para ejecutarlo y modificarlo.

La práctica es una parte esencial del aprendizaje: leer las explicaciones ayuda a entender los conceptos, pero construir y revisar pipelines permite ver cómo se relacionan en un entorno real.