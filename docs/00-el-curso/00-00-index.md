# Curso DevOps: Introducción a la Integración Continua y Jenkins

Bienvenido/a a la documentación del **Curso DevOps: Introducción a la Integración Continua y Jenkins**.

En este curso aprenderás los fundamentos de DevOps y a automatizar procesos con **Jenkins**. También trabajarás con **Git**, **Terraform**, **Ansible** y **Docker** mediante explicaciones y ejemplos prácticos.

El recorrido comienza con los conceptos esenciales y avanza hacia la creación de pipelines y la automatización de infraestructura.

**Duración:** 4 días · 20 horas  
**Entorno de referencia:** Ubuntu 24.04.5 LTS  
**Autor:** Guillem Hernández Sola · Agile611

---

## ¿Qué aprenderás?

Al finalizar el curso, tendrás una base práctica para comprender y construir flujos de automatización con Jenkins.

- Explicar qué es DevOps y cómo se relaciona con la colaboración y la mejora continua.
- Diferenciar entre **integración continua**, **entrega continua** y **despliegue continuo**.
- Comprender la arquitectura de Jenkins y el papel de sus nodos y agentes.
- Crear jobs de tipo Freestyle y pipelines.
- Definir pipelines como código mediante un `Jenkinsfile`.
- Utilizar parámetros, variables de entorno y aprobaciones interactivas.
- Gestionar errores, timeouts y notificaciones.
- Integrar Jenkins con repositorios Git.
- Automatizar tareas de infraestructura con Terraform.
- Ejecutar playbooks y tareas de configuración con Ansible.

---

## Contenido de la documentación

El curso está organizado en módulos que avanzan desde los fundamentos hasta la integración de herramientas de automatización.

### 1. El curso

Presentación, objetivos, requisitos previos e instalación de Jenkins.

- [Objetivos del curso](00-01-objetivos.md)
- [Requisitos previos](00-02-requisitos-previos.md)
- [Instalación de Jenkins en Ubuntu](00-03-instalacion-jenkins.md)

### 2. Fundamentos

Conceptos de DevOps, CI/CD y Jenkins, junto con los primeros ejercicios prácticos.

- [¿Quién es DevOps?](../01-fundamentos/01_quien_es_devops.md)
- [CI, entrega continua y despliegue continuo](../01-fundamentos/02_ci_vs_cd_vs_cd.md)
- [Entorno de trabajo](../01-fundamentos/03_entorno_de_trabajo.md)
- [Repositorio de código](../01-fundamentos/04_repositorio_de_codigo.md)
- [Arquitectura e instalación de Jenkins](../01-fundamentos/05_architectura_y_instalacion.md)
- [Conclusiones sobre DevOps y CI/CD](../01-fundamentos/06_conclusiones_devops_y_ci_cd.md)
- [¿Qué es un job de Jenkins?](../01-fundamentos/07_que_es_un_job_de_jenkins.md)
- [El primer job Freestyle](../01-fundamentos/08_el_primer_job_freestyle.md)
- [¿Qué es un agente o nodo de Jenkins?](../01-fundamentos/09_que_es_un_agente_node.md)
- [Conectar un agente](../01-fundamentos/10_conectando_un_agente.md)
- [¿Qué es un pipeline de Jenkins?](../01-fundamentos/11_que_es_un_pipeline.md)
- [El primer pipeline](../01-fundamentos/12_el_primer_pipeline.md)

### 3. Pipelines

Creación y evolución de pipelines, desde la estructura de un `Jenkinsfile` hasta la construcción completa de una aplicación.

- [Anatomía de un Jenkinsfile](../02-pipelines/01_anatomia_de_un_jenkinsfile.md)
- [Pipeline distribuido](../02-pipelines/02_pipeline_distribuido.md)
- [Jenkinsfile y gestión del código fuente (SCM)](../02-pipelines/03_scm_y_jenkinsfile.md)
- [Del entorno local a Jenkins](../02-pipelines/04_de_local_a_jenkins.md)
- [Parámetros y variables de entorno](../02-pipelines/05_parametros_y_variables.md)
- [Pipelines interactivos](../02-pipelines/06_pipeline_interactivo.md)
- [Opciones, acciones posteriores y notificaciones](../02-pipelines/07_options_post_notifications.md)
- [Control de errores y timeouts](../02-pipelines/08_control_de_errores.md)
- [El bloque `script`](../02-pipelines/09_el_bloque_script.md)
- [Captura de datos](../02-pipelines/10_capturando_datos.md)
- [Construcción completa de una aplicación](../02-pipelines/11_construccion_completa.md)

### 4. Agentes y Docker

Configuración de agentes efímeros para ejecutar trabajos en entornos aislados.

- [Configuración de agentes efímeros con Docker Cloud](../03-miscelania/01_configuracion_agentes_efimeros.md)

### 5. Prácticas

Ejercicios para poner en práctica la configuración de Jenkins y la integración con otras herramientas.

- [Práctica: configuración básica](../04-practicas/01_practica_configuracion_basica.md)
- [Práctica: creación de pipelines](../04-practicas/02_practica_creacion_pipelines.md)
- [Práctica: integración con Terraform](../04-practicas/03_practica_integracion_terraform.md)
- [Práctica: integración con Ansible](../04-practicas/04_practica_integracion_ansible.md)

### 6. Terraform

Introducción a la infraestructura como código e integración de Terraform en pipelines de Jenkins.

- [¿Por qué Terraform?](../04-terraform/01_por_que_terraform.md)
- [Preparación del entorno](../04-terraform/02_preparacion_del_entorno.md)
- [Gestión de credenciales](../04-terraform/03_gestion_de_credenciales.md)
- [Inicialización y planificación](../04-terraform/04_pipeline_stage_init_plan.md)
- [Creación del plan](../04-terraform/05_creando_el_plan.md)
- [Aplicación del plan con aprobación manual](../04-terraform/06_pipeline_stage_apply_human_approval.md)
- [Modificación de la infraestructura](../04-terraform/07_modificando_la_infraestructura.md)

### 7. Ansible

Automatización de tareas y orquestación mediante playbooks de Ansible.

- [¿Por qué Ansible?](../05-ansible/01_por_que_ansible.md)
- [El primer playbook](../05-ansible/02_el_primer_playbook.md)
- [Orquestación completa](../05-ansible/03_orquestacion_completa.md)

### 8. Referencias

Documentación y recursos complementarios para seguir aprendiendo.

- [Documentación oficial](../06-referencias/01_documentacion_oficial.md)
- [Recursos útiles](../06-referencias/02_recursos_utiles.md)
- [Glosario de términos](../06-referencias/03_glosario_de_terminos.md)

---

## Herramientas principales

Durante el curso se utilizan herramientas habituales en entornos DevOps. Cada una cumple una función dentro del flujo de trabajo.

| **Herramienta** | **Uso en el curso** |
|---|---|
| **Jenkins** | Automatización de jobs y pipelines. |
| **Git y GitHub** | Gestión del código fuente e integración con repositorios. |
| **Docker** | Ejecución de servicios y agentes en contenedores. |
| **Terraform** | Definición y gestión de infraestructura como código. |
| **Ansible** | Automatización de configuración y orquestación. |

---

## Cómo seguir el curso

Para avanzar paso a paso:

1. Revisa los [objetivos](00-01-objetivos.md) y los [requisitos previos](00-02-requisitos-previos.md).
2. Prepara el entorno siguiendo la guía de [instalación de Jenkins](00-03-instalacion-jenkins.md).
3. Estudia los fundamentos de DevOps, CI/CD y Jenkins.
4. Crea tus primeros jobs y pipelines.
5. Profundiza en los `Jenkinsfile`, los agentes y el manejo de errores.
6. Completa las prácticas de integración con Terraform y Ansible.
7. Consulta las referencias y el glosario para ampliar conceptos.

---

## Requisitos previos

Se recomienda tener conocimientos básicos de:

- Administración de Linux o Windows.
- Uso de la línea de comandos.
- Git y control de versiones.
- Archivos YAML.
- Conceptos generales de desarrollo de software.

El entorno de referencia del curso es **Ubuntu 24.04.5 LTS**. No es necesario tener experiencia avanzada con Jenkins, Terraform o Ansible: el curso introduce estas herramientas progresivamente.

---

## Objetivo final

Al completar el curso, deberías poder diseñar un flujo básico de integración continua con Jenkins, conectar el pipeline a un repositorio de código y organizar su ejecución mediante etapas y agentes.

También tendrás una introducción práctica a la automatización de infraestructura y configuración con Terraform y Ansible. El propósito es aprender a utilizar Jenkins y comprender cómo contribuye a una forma de trabajo DevOps basada en colaboración, automatización y mejora continua.

---

## Autoría y licencia

Curso creado por **Guillem Hernández Sola** para **Agile611**.

Distribuido bajo la licencia **CC BY-NC 4.0**. Consulta los términos de la licencia antes de reutilizar o redistribuir el material.