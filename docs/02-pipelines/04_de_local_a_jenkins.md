# De local a Jenkins

Llevar un proyecto de un entorno local a Jenkins significa hacer que el código, las dependencias y las instrucciones necesarias para validarlo estén disponibles en un entorno de ejecución automatizado. El objetivo no es copiar a Jenkins lo que hay en el portátil de una persona: es definir un proceso repetible que funcione desde un repositorio, en un agente conocido y con requisitos documentados.

Esta unidad acompaña el recorrido completo: preparar un proyecto local, comprobarlo, versionarlo en Git, añadir un `Jenkinsfile`, configurar un job para obtenerlo desde SCM y diagnosticar diferencias entre el equipo local y el agente. Las prácticas usan un proyecto pequeño de texto y shell para que el foco esté en el flujo y no en instalar una aplicación compleja.

> **Uso seguro:** utiliza el repositorio, la instancia de Jenkins y los agentes autorizados por el curso. No introduzcas credenciales de producción. No publiques secretos en Git, en el `Jenkinsfile`, en parámetros ni en logs. Antes de ejecutar código desconocido, revisa qué comandos contiene.

## Contexto y objetivos

El paso de un proyecto local a Jenkins revela si el trabajo depende de una configuración invisible del equipo de quien lo desarrolla.

### Qué significa pasar de local a Jenkins

En el equipo local, una persona puede ejecutar comandos con herramientas, archivos y permisos que ya tiene preparados.

En Jenkins, el código se obtiene desde un repositorio y se ejecuta en un agente configurado para los jobs.

El proceso debe dejar claro:

- Qué revisión del código se utiliza.
- Qué herramientas se requieren.
- Qué pasos se ejecutan.
- Qué archivos se esperan.
- Qué condiciones indican éxito o fallo.
- Qué resultados se conservan.
- Qué permisos necesita la ejecución.

### Diferencia entre «funciona en mi equipo» y «funciona en CI»

Una prueba local puede pasar por razones que no se cumplen en Jenkins:

- Hay un archivo local que no está en Git.
- Existe una herramienta instalada solo en el portátil.
- Una variable de entorno está configurada manualmente.
- El usuario local tiene más permisos.
- El sistema local conserva archivos de una ejecución anterior.
- El agente usa otro sistema operativo.
- La versión de una herramienta es distinta.
- El proceso depende de una ruta absoluta local.

Automatizar ayuda a descubrir esas dependencias.

### Flujo de trabajo general

El recorrido de esta unidad es:

```text
Proyecto local
    |
    v
Prueba local de scripts
    |
    v
Git: revisión y commit
    |
    v
Repositorio remoto autorizado
    |
    v
Jenkins obtiene la revisión
    |
    v
Agente ejecuta el Jenkinsfile
    |
    v
Consola, resultado y artefactos
```

Cada transición puede fallar por causas diferentes.

Por eso conviene revisar cada etapa por separado.

### Objetivos de aprendizaje

Al finalizar la unidad, podrás:

- Preparar un proyecto local pequeño.
- Ejecutar sus validaciones desde una terminal.
- Crear un repositorio Git para el proyecto.
- Revisar y registrar cambios mediante commits.
- Identificar archivos que no deben incluirse en el repositorio.
- Añadir un `Jenkinsfile` declarativo.
- Configurar un job para obtener el pipeline desde SCM.
- Seleccionar un agente o etiqueta autorizada.
- Confirmar qué commit ejecutó Jenkins.
- Comparar las herramientas locales con las del agente.
- Diagnosticar fallos de checkout, rutas y dependencias.
- Archivar un resultado sencillo.
- Documentar los requisitos del proyecto.

### Alcance

Las prácticas utilizan un proyecto de texto con un script de validación.

No incluyen:

- Despliegues.
- Cambios en sistemas de producción.
- Credenciales de publicación.
- Administración de agentes.
- Modificaciones de red.
- Instalación de paquetes en agentes compartidos.
- Publicación de artefactos en servicios externos.

### Requisitos previos

Se recomienda conocer:

- Operaciones básicas de terminal.
- Rutas relativas y absolutas.
- El propósito de Git.
- Qué es un commit.
- Qué es un job de Jenkins.
- La diferencia entre controlador y agente.
- La estructura básica de un pipeline declarativo.

Si alguno de estos conceptos es nuevo, utiliza el glosario al final como referencia.

### Herramientas posibles

En el equipo local podrías necesitar:

- Git.
- Una terminal.
- Bash u otra shell compatible.
- Un editor de texto.
- Acceso al repositorio de laboratorio.
- Un navegador para Jenkins.

En el agente podrías necesitar:

- Git, si Jenkins realiza allí el checkout.
- Bash, para los ejemplos Unix.
- Las herramientas del proyecto.
- Permisos de escritura en el workspace.

La lista real depende del curso.

## Preparar el entorno local

Antes de configurar Jenkins, prepara el proyecto y confirma que las pruebas básicas funcionan localmente.

### Comprueba la ubicación de trabajo

Utiliza un directorio personal de prácticas.

No trabajes en carpetas compartidas sin conocer sus permisos.

Ejemplo para Linux o macOS:

```bash
mkdir -p "$HOME/practicas-devops/de-local-a-jenkins"
cd "$HOME/practicas-devops/de-local-a-jenkins"
pwd
```

En Windows, utiliza una carpeta local de práctica indicada por el curso y una shell compatible con los ejemplos.

### Comprueba las herramientas locales

Consulta solo las herramientas necesarias.

```bash
git --version
```

```bash
bash --version
```

La salida local no demuestra que esas herramientas estén disponibles en el agente de Jenkins.

### Revisa la configuración de Git

Consulta el nombre de usuario y correo configurados:

```bash
git config --get user.name
```

```bash
git config --get user.email
```

No cambies una configuración global compartida sin saber cómo afecta a otros proyectos.

Puedes configurar una identidad local para un único repositorio, si el curso lo autoriza.

### Crear la estructura del proyecto

Desde el directorio de prácticas:

```bash
mkdir -p app scripts
```

La estructura inicial será:

```text
de-local-a-jenkins/
├── app/
└── scripts/
```

### Crear el archivo de entrada

```bash
printf 'Práctica de integración continua con Jenkins\n' > app/mensaje.txt
```

Comprueba su contenido:

```bash
cat app/mensaje.txt
```

El archivo contiene la palabra que buscará la validación.

### Crear un README

Crea `README.md`:

```bash
cat > README.md <<'EOF'
# Proyecto de práctica

Este proyecto demuestra el recorrido desde una validación local
hasta una ejecución en Jenkins.

## Comprobar el contenido

Ejecuta:

```bash
bash scripts/validar.sh
```

El archivo `app/mensaje.txt` debe contener la palabra `Jenkins`.
EOF
```

### Crear el script de validación

Crea `scripts/validar.sh`:

```bash
cat > scripts/validar.sh <<'EOF'
#!/usr/bin/env bash
set -eu

ARCHIVO="app/mensaje.txt"
TEXTO_ESPERADO="Jenkins"

if [ ! -f "$ARCHIVO" ]; then
  echo "ERROR: no existe $ARCHIVO"
  exit 1
fi

if grep -q "$TEXTO_ESPERADO" "$ARCHIVO"; then
  echo "OK: se encontró el texto esperado"
else
  echo "ERROR: no se encontró el texto esperado"
  exit 1
fi
EOF
```

### Revisar el script

Abre `scripts/validar.sh` y verifica:

- La ruta relativa.
- El nombre del archivo.
- El texto esperado.
- El mensaje de éxito.
- Los mensajes de error.
- Los códigos de salida.
- La ausencia de credenciales.

### Permiso de ejecución

En Linux o macOS, puedes marcar el script como ejecutable:

```bash
chmod +x scripts/validar.sh
```

El pipeline de ejemplo lo ejecutará con `bash`, por lo que el permiso de ejecución no es estrictamente necesario para esa forma concreta.

El comportamiento de permisos puede variar entre sistemas operativos y configuraciones de Git.

### Probar el script localmente

Desde la raíz del proyecto:

```bash
bash scripts/validar.sh
```

El resultado esperado es:

```text
OK: se encontró el texto esperado
```

### Comprobar el código de salida

En Bash, inmediatamente después de ejecutar el script:

```bash
echo $?
```

Un resultado `0` indica éxito habitual.

Un resultado distinto de `0` indica que el script comunicó un fallo.

El código debe comprobarse antes de ejecutar otro comando que sustituya el valor de salida anterior.

### Probar la ausencia del archivo

Renombra el archivo solo dentro del proyecto de práctica:

```bash
mv app/mensaje.txt app/mensaje.tmp
```

Ejecuta la validación:

```bash
bash scripts/validar.sh
```

El script debería indicar que falta el archivo.

Restaura el nombre:

```bash
mv app/mensaje.tmp app/mensaje.txt
```

### Probar un contenido incorrecto

Cambia el texto:

```bash
printf 'Práctica local sin palabra esperada\n' > app/mensaje.txt
```

Ejecuta:

```bash
bash scripts/validar.sh
```

El resultado debería ser un error porque no aparece `Jenkins`.

Restaura un contenido válido antes de continuar:

```bash
printf 'Práctica de integración continua con Jenkins\n' > app/mensaje.txt
```

### Qué demuestra la prueba local

La prueba local comprueba:

- Que el script se puede ejecutar.
- Que las rutas locales son correctas.
- Que los mensajes son comprensibles.
- Que un error produce un código distinto de cero.
- Que el contenido actual cumple el criterio.

No demuestra todavía que el agente tenga las mismas herramientas o archivos.

## Comparar el entorno local y el agente

Las diferencias entre ambos entornos suelen explicar fallos que solo aparecen en Jenkins.

### Sistema operativo

Un pipeline puede ejecutarse en Linux, Windows o macOS.

Cada sistema puede diferir en:

- Shell.
- Rutas.
- Separadores de directorio.
- Permisos.
- Mayúsculas y minúsculas.
- Herramientas preinstaladas.
- Finales de línea.

Comprueba qué sistema usará el job.

### Herramientas

Anota las herramientas requeridas por el proyecto:

```text
Git:
Bash:
Python:
Java:
Node.js:
Compilador:
Herramienta de pruebas:
```

Incluye solo las herramientas que realmente necesita el ejercicio.

### Versiones

Una herramienta con una versión diferente puede cambiar:

- Sintaxis aceptada.
- Resultado de una prueba.
- Formato de salida.
- Comportamiento de dependencias.
- Compatibilidad del proyecto.

Registra las versiones relevantes cuando afecten a la ejecución.

### Directorio de trabajo

El pipeline trabaja dentro de un workspace en el agente.

No presupongas que la ruta local existe en Jenkins.

Evita rutas absolutas personales como:

```text
/home/ana/proyectos/mi-app
```

Utiliza rutas relativas al repositorio o al workspace.

### Variables de entorno

El equipo local puede tener variables que no existen en Jenkins.

Un script no debería depender silenciosamente de una variable configurada a mano.

Documenta las variables no sensibles que necesita el proyecto.

Guarda las credenciales en el sistema de credenciales autorizado, no en un archivo local versionado.

### Permisos

El agente puede ejecutar pasos con un usuario diferente al de tu equipo.

Ese usuario debe poder:

- Leer el código.
- Escribir en el workspace.
- Ejecutar herramientas necesarias.
- Acceder solo a los servicios autorizados.

No des por supuesto que el agente tiene permisos administrativos.

### Estado residual

El equipo local puede conservar archivos de ejecuciones anteriores.

El agente también puede reutilizar un workspace, según la configuración.

El pipeline debe funcionar a partir de las entradas declaradas y no de residuos accidentales.

### Tabla comparativa

Completa esta tabla durante la práctica:

| Aspecto | Equipo local | Agente Jenkins |
|---|---|---|
| Sistema operativo | | |
| Shell | | |
| Versión de Git | | |
| Usuario | | |
| Directorio de trabajo | | |
| Herramientas necesarias | | |
| Permisos | | |
| Resultado de la validación | | |

## Versionar el proyecto

Git permite que Jenkins obtenga una revisión concreta del proyecto.

### Inicializar Git

Desde la raíz del proyecto:

```bash
git init
```

Comprueba el estado:

```bash
git status
```

Git mostrará los archivos que aún no están bajo seguimiento.

### Preparar los archivos

Añade los archivos de práctica:

```bash
git add README.md app scripts
```

Añade el `Jenkinsfile` cuando lo hayas creado.

Antes de confirmar, revisa exactamente qué se va a incluir:

```bash
git status
```

### Revisar diferencias

Para archivos que todavía no se han preparado:

```bash
git diff
```

Para cambios ya preparados:

```bash
git diff --cached
```

Inspecciona los cambios antes de crear el commit.

### Crear un primer commit

```bash
git commit -m "Añade proyecto de práctica"
```

El mensaje debería resumir el cambio de forma breve y clara.

### Confirmar el commit

```bash
git log -1 --oneline
```

Anota el identificador corto que muestra Git.

Ese identificador ayuda a relacionar el proyecto local con una ejecución de Jenkins.

### Crear un repositorio remoto

El docente puede proporcionar un repositorio remoto.

Antes de configurarlo, confirma:

- Que el repositorio pertenece al curso.
- Que tienes permiso para usarlo.
- Que conoces la URL.
- Que sabes si necesitas credenciales.
- Que no estás apuntando por error a un repositorio real o compartido.

### Revisar los remotos

```bash
git remote -v
```

Si no aparece el remoto esperado, consulta al docente.

No añadas una URL que hayas copiado de una fuente no verificada.

### Añadir un remoto

Solo si el curso te proporciona una URL y el procedimiento:

```bash
git remote add origin URL_DEL_REPOSITORIO_DE_LABORATORIO
```

`URL_DEL_REPOSITORIO_DE_LABORATORIO` es un marcador.

Sustitúyelo únicamente con la URL autorizada.

No incluyas un token o una contraseña en esa URL.

### Enviar cambios

El comando concreto depende de la rama y del procedimiento del repositorio.

El docente indicará si se usa un comando como:

```bash
git push
```

No envíes cambios a un remoto sin revisar `git remote -v`.

### Rama de trabajo

Una rama permite practicar sin modificar directamente la rama principal.

Ejemplo:

```bash
git switch -c practica/primer-pipeline
```

Si tu versión de Git no admite `git switch`, utiliza el comando enseñado en el curso.

Comprueba la rama actual:

```bash
git branch --show-current
```

### Commit no equivale a push

Un commit se crea en el repositorio local.

Un push envía commits al repositorio remoto.

Jenkins solo puede obtener una revisión que sea accesible desde la fuente SCM configurada.

### Revisión antes de enviar

Antes de enviar cambios:

- Comprueba la rama.
- Revisa el remoto.
- Revisa los archivos preparados.
- Busca secretos.
- Confirma que el `Jenkinsfile` es el esperado.
- Comprueba que no incluyes archivos temporales.
- Comprueba que el commit tiene un mensaje claro.

### `.gitignore`

Un `.gitignore` evita que ciertos archivos se añadan accidentalmente al repositorio.

Ejemplo sencillo para un proyecto de práctica:

```text
*.log
.DS_Store
Thumbs.db
.env
```

Este ejemplo no sustituye una política completa de exclusión.

Revisa cada patrón para comprobar que no oculta archivos necesarios para el pipeline.

### Evitar excluir el `Jenkinsfile`

Asegúrate de que el `Jenkinsfile` no coincide con una regla de exclusión.

Comprueba el estado con:

```bash
git status
```

Si Git no muestra el archivo, revisa las reglas de `.gitignore`.

### Secretos y `.gitignore`

Excluir un archivo local puede ayudar a evitar una confirmación accidental.

No convierte el archivo en un almacén seguro de secretos.

No guardes credenciales personales en un archivo del proyecto aunque esté excluido.

### Si un secreto llegó a Git

Borrar el archivo en un commit posterior no garantiza que el secreto desaparezca del historial.

Sigue el procedimiento del responsable:

- Informa de la exposición.
- Solicita revocación o rotación.
- Evita compartir más el repositorio afectado.
- No reescribas el historial compartido sin autorización.
- Revisa el alcance de la exposición.

## Añadir el Jenkinsfile

El `Jenkinsfile` describe las acciones que Jenkins ejecutará sobre el proyecto.

### Nombre y ubicación

El nombre habitual es:

```text
Jenkinsfile
```

La ruta más común es la raíz del repositorio.

Jenkins puede configurarse para buscarlo en una subcarpeta.

Confirma el nombre y la ruta en la configuración del job.

### Pipeline mínimo

Crea el archivo:

```groovy
pipeline {
    agent any

    stages {
        stage('Mensaje') {
            steps {
                echo 'Proyecto ejecutado en Jenkins'
            }
        }
    }
}
```

Este ejemplo no valida el proyecto.

Solo comprueba que Jenkins puede leer la definición y ejecutar un paso.

### Leer el pipeline mínimo

- `pipeline` inicia la definición declarativa.
- `agent any` solicita un agente disponible.
- `stages` agrupa las etapas.
- `stage` define una etapa con nombre.
- `steps` agrupa las acciones.
- `echo` escribe un mensaje en la consola.

### Pipeline para validar el proyecto local

Amplía el archivo:

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar estructura') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Ejecutar validación') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }

    post {
        success {
            echo 'La validación ha terminado correctamente.'
        }

        failure {
            echo 'La validación ha fallado. Consulta la consola.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

El ejemplo utiliza comandos Unix y presupone un agente compatible.

### Qué hace el pipeline

Primero comprueba que existen los archivos esperados.

Después ejecuta el script de validación.

Al final comunica si el pipeline terminó correctamente o falló.

### Qué no hace

Este pipeline no:

- Compila una aplicación.
- Instala dependencias.
- Publica un paquete.
- Despliega a un entorno.
- Usa credenciales.
- Garantiza que todas las pruebas del proyecto estén cubiertas.

### Añadir mensajes de progreso

Puedes incluir mensajes breves para hacer más legible la consola:

```groovy
stage('Comprobar estructura') {
    steps {
        echo 'Comprobando los archivos requeridos.'
        sh 'test -f README.md'
        sh 'test -f app/mensaje.txt'
    }
}
```

Los mensajes deben describir la tarea real.

No imprimas todos los archivos o variables del entorno sin necesidad.

### Entorno Windows

En un agente Windows, `sh` puede no estar disponible.

La variante del comando y del script dependerá de la shell configurada, por ejemplo `bat` o PowerShell.

No conviertas comandos Unix a Windows de manera improvisada en una instancia compartida.

Solicita la variante del curso.

## Conectar Jenkins al repositorio

Jenkins debe poder obtener el código y localizar el pipeline.

### Opciones de configuración

La interfaz puede ofrecer:

- Job Pipeline.
- Pipeline desde SCM.
- Job Multibranch.
- Otra configuración definida por el curso.

Utiliza el tipo indicado para la práctica.

### Pipeline escrito en la interfaz

Algunas prácticas permiten pegar el código en la configuración del job.

Es útil para una primera demostración.

En esta modalidad, el pipeline puede no estar versionado con el proyecto.

### Pipeline desde SCM

Un job configurado para SCM puede solicitar:

- Tipo de repositorio.
- URL.
- Credencial.
- Rama.
- Ruta del `Jenkinsfile`.

Comprueba los valores con cuidado antes de guardar.

### URL del repositorio

La URL debe corresponder al repositorio de laboratorio.

No la modifiques para añadir credenciales.

Si Jenkins no puede acceder, revisa el mensaje y consulta al responsable.

### Credencial SCM

Un repositorio privado puede requerir una credencial de lectura.

Selecciona solo la credencial que el curso autorice.

No copies su valor en el pipeline ni en la consola.

### Rama y archivo

Asegúrate de que:

- La rama existe.
- El `Jenkinsfile` está en esa rama.
- La ruta coincide con la configuración.
- Los archivos que valida el pipeline también están en el commit.
- El job no apunta a una rama distinta de la esperada.

### Checkout

El checkout obtiene una revisión del repositorio.

Puede ocurrir al cargar el `Jenkinsfile`, dentro del pipeline o mediante ambos mecanismos, según el job.

Comprueba qué componente realiza cada operación y dónde queda el workspace.

### `checkout scm`

En contextos compatibles, `checkout scm` utiliza la definición SCM asociada al job.

Ejemplo:

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validar archivos') {
            steps {
                sh 'test -f README.md'
            }
        }
    }
}
```

La disponibilidad y el comportamiento dependen del tipo de job.

No añadas un segundo checkout sin revisar qué hace ya la configuración.

### Job Multibranch

Un job Multibranch puede descubrir ramas elegibles con un `Jenkinsfile`.

Cada rama puede tener una definición distinta del pipeline.

Esto facilita validar cambios por rama, pero requiere revisar los permisos y la confianza asignados.

### Diferencias entre ramas

Una rama puede contener cambios en:

- Código.
- Scripts.
- Dependencias.
- `Jenkinsfile`.
- Configuración de pruebas.

Jenkins ejecuta la revisión que obtiene, no la copia de tu equipo local.

### Primera ejecución

Después de configurar el job:

1. Guarda la configuración.
2. Inicia una ejecución manual.
3. Revisa el checkout.
4. Confirma el commit.
5. Observa el agente.
6. Revisa las etapas.
7. Consulta la consola.
8. Registra el resultado.

## De local a CI: una secuencia recomendada

La secuencia gradual facilita distinguir problemas de código, SCM y Jenkins.

### Paso 1: probar el script localmente

Ejecuta la validación en la raíz del proyecto.

```bash
bash scripts/validar.sh
```

Confirma el resultado esperado.

### Paso 2: probar el fallo localmente

Cambia una condición de manera controlada.

Confirma que el script devuelve un error.

Después restaura un estado válido.

### Paso 3: revisar el proyecto

Comprueba:

- Archivos presentes.
- Rutas relativas.
- README.
- Scripts.
- Dependencias.
- Ausencia de secretos.
- Resultado de Git.

### Paso 4: crear un commit

Añade y revisa los cambios.

Crea un commit descriptivo.

Registra su identificador.

### Paso 5: enviar la revisión al repositorio autorizado

Sigue el procedimiento del curso.

Confirma que la revisión aparece en la rama remota.

### Paso 6: configurar o utilizar el job

Comprueba:

- Repositorio.
- Rama.
- Ruta del `Jenkinsfile`.
- Credencial.
- Agente.
- Etiqueta.

### Paso 7: ejecutar

Inicia la ejecución y registra:

- Job.
- Número.
- Rama.
- Commit.
- Agente.
- Estado.

### Paso 8: diagnosticar

Si falla, determina primero si el problema ocurrió en:

- Checkout.
- Asignación de agente.
- Sintaxis.
- Herramientas.
- Comando.
- Prueba.
- Archivado.

### Paso 9: corregir en local

Haz el cambio localmente y vuelve a probarlo.

Evita editar directamente el job para corregir una definición que está versionada, salvo que el docente lo indique.

### Paso 10: registrar y enviar la corrección

Revisa el diff.

Crea un commit.

Envía el cambio al repositorio aprobado.

### Paso 11: repetir

Confirma que Jenkins obtiene la revisión corregida.

Comprueba que la etapa pasa.

Registra el resultado final.

## Artefactos e informes

Un proyecto puede producir archivos que conviene conservar como parte de una ejecución.

### Crear una salida

Añade una etapa que prepare una copia:

```groovy
stage('Preparar resultado') {
    steps {
        sh 'mkdir -p salida'
        sh 'cp app/mensaje.txt salida/mensaje.txt'
    }
}
```

La etapa debe ejecutarse después de comprobar la entrada.

### Archivar el archivo

```groovy
archiveArtifacts artifacts: 'salida/mensaje.txt',
                 fingerprint: true
```

El patrón debe coincidir con una ruta real en el workspace.

### Pipeline con archivado

```groovy
pipeline {
    agent any

    stages {
        stage('Validar') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Preparar resultado') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }
}
```

### Artefacto y repositorio

Un archivo archivado por Jenkins no se añade automáticamente a Git.

Un commit de Git tampoco equivale a un artefacto de una ejecución.

Cada mecanismo sirve para necesidades distintas.

### Retención de artefactos

La retención depende de la configuración del job y de Jenkins.

No supongas que el artefacto se conserva indefinidamente.

Conserva solo las salidas útiles para pruebas, diagnóstico o entrega.

### Informes de pruebas

Si el proyecto genera informes, la instancia puede publicarlos mediante pasos o plugins compatibles.

Comprueba:

- Formato.
- Ruta.
- Si el informe se crea.
- Qué ocurre si no hay resultados.
- Si incluye datos sensibles.
- Qué política de retención aplica.

## Diagnóstico: lo local funciona, Jenkins falla

La diferencia entre entornos requiere comparar evidencia, no adivinar.

### El script no se encuentra

Comprueba:

- Que el script está en Git.
- Que el commit lo contiene.
- Que Jenkins obtuvo la rama correcta.
- Que la ruta coincide.
- Que la etapa ejecuta en el workspace esperado.
- Que el nombre respeta mayúsculas y minúsculas.

### Falta una herramienta

Comprueba:

- Qué agente se asignó.
- Qué herramienta falta.
- Si el agente la tiene instalada.
- Si aparece en el `PATH`.
- Si la etiqueta representa esa capacidad.
- Si el job se ejecutó en el sistema esperado.

No instales herramientas en un agente compartido sin autorización.

### Diferencia de shell

Un comando que funciona en Bash puede fallar en otra shell.

Comprueba:

- Shell del agente.
- Intérprete usado por `sh`.
- Disponibilidad de Bash.
- Sintaxis del script.
- Finales de línea.

### Diferencia de sistema operativo

Comprueba:

- Rutas.
- Permisos.
- Sensibilidad a mayúsculas.
- Comandos disponibles.
- Formato de archivos.
- Herramientas del sistema.

### Diferencia de versión

Compara las versiones locales y del agente de las herramientas relevantes.

No imprimas información sensible para hacerlo.

### Diferencia de usuario o permisos

Consulta el usuario del proceso solo en un job de diagnóstico autorizado.

Comprueba si el agente puede leer y escribir en las rutas necesarias.

No resuelvas permisos con comandos amplios como `chmod -R` sobre carpetas desconocidas.

### Variable no definida

Comprueba:

- Dónde se define la variable.
- Si Jenkins la recibe.
- Si se refiere a ella desde Groovy o desde shell.
- Si su nombre coincide exactamente.
- Si el valor es seguro para mostrar.

No imprimas todas las variables del entorno como primera comprobación.

### Archivo local no versionado

Un archivo puede existir en el portátil y faltar en Jenkins porque no se añadió al repositorio.

Comprueba:

```bash
git status
```

Comprueba si el archivo está preparado:

```bash
git diff --cached
```

Confirma el commit que procesó Jenkins.

### El commit no es el esperado

Comprueba:

- Rama configurada.
- Commit mostrado en consola.
- Push realizado.
- Subjob de Multibranch.
- Evento que inició la ejecución.
- Momento del checkout.

### El checkout falla

Posibles causas:

- URL incorrecta.
- Credencial equivocada.
- Falta de permisos.
- Problema de red.
- Error TLS.
- Rama inexistente.
- Servicio SCM no disponible.

No incluyas tokens en la URL para resolver el fallo.

### El job queda en cola

Puede deberse a:

- Falta de agente.
- Etiqueta incorrecta.
- Nodo desconectado.
- Ejecutores ocupados.
- Restricciones del job.
- Agente temporal que tarda en iniciarse.

Un job en cola no implica que el código esté mal.

### Pipeline fallido antes de la primera etapa

Puede haber fallado en:

- Lectura del `Jenkinsfile`.
- Checkout.
- Validación de sintaxis.
- Búsqueda del agente.
- Preparación del workspace.

Busca el primer mensaje de error y su contexto.

### Pipeline verde, pero no se ejecutó la prueba esperada

Comprueba:

- Que la etapa no se omitió por una condición.
- Que el script realmente devuelve error ante un fallo.
- Que el archivo probado pertenece al commit actual.
- Que la ruta está bien escrita.
- Que la etapa aparece como ejecutada.
- Que el resultado final no oculta fallos.

## Seguridad y calidad

Llevar un proyecto a Jenkins también implica revisar qué permisos tiene el código y qué información produce.

### Revisar el código antes de ejecutarlo

El `Jenkinsfile` y los scripts pueden ejecutar comandos en el agente.

Antes de ejecutar un cambio:

- Lee el `Jenkinsfile`.
- Lee los scripts invocados.
- Comprueba comandos de borrado o modificación.
- Identifica accesos de red.
- Localiza referencias a credenciales.
- Confirma el agente elegido.

### Mínimo privilegio

Un pipeline de validación debería tener solo lo necesario para:

- Leer el repositorio.
- Escribir en el workspace.
- Ejecutar las herramientas del proyecto.
- Archivar resultados aprobados.

No necesita automáticamente:

- Permisos de administrador.
- Credenciales de producción.
- Escritura en repositorios.
- Acceso a redes ajenas al proyecto.

### Código de ramas externas

Una rama externa puede cambiar el `Jenkinsfile`.

No expongas credenciales a esa ejecución sin un diseño de seguridad aprobado.

Utiliza agentes aislados cuando lo exija la política.

### Protección de credenciales

No guardes credenciales en:

- `Jenkinsfile`.
- Scripts.
- README.
- `.env` versionado.
- Parámetros de texto comunes.
- URLs.
- Logs.
- Capturas.

Utiliza el almacén de credenciales autorizado.

### Revisar salida y logs

Antes de compartir una consola, revisa si aparecen:

- Tokens.
- Contraseñas.
- Rutas internas.
- Nombres de usuarios.
- Direcciones privadas.
- Datos personales.
- Mensajes de sistemas externos.

Comparte solo el fragmento necesario.

### Calidad del commit

Utiliza mensajes que expliquen el cambio.

Ejemplos:

```text
Añade validación del mensaje de práctica
```

```text
Documenta los pasos de ejecución local
```

Evita mensajes ambiguos como:

```text
cambios
```

```text
arreglo
```

```text
final
```

### Calidad del pipeline

Un buen pipeline debe:

- Tener etapas con nombres claros.
- Validar entradas antes de utilizarlas.
- Fallar cuando una condición esencial no se cumple.
- Mostrar mensajes útiles.
- Usar rutas relativas.
- Evitar dependencias invisibles.
- Documentar herramientas necesarias.
- Conservar solo resultados útiles.

## Sesiones prácticas para alumnos

Las actividades avanzan desde el trabajo local hasta una ejecución completa en Jenkins.

### Sesión 1: mapa del recorrido

**Objetivo:** identificar las etapas de local a Jenkins.

#### Actividad

Dibuja el flujo con estos elementos:

- Proyecto local.
- Validación local.
- Git local.
- Repositorio remoto.
- Job Jenkins.
- Agente.
- Ejecución.
- Artefacto o informe.

#### Añade flechas

Para cada flecha, anota qué ocurre:

- ¿Se guarda un archivo?
- ¿Se crea un commit?
- ¿Se envía un cambio?
- ¿Se obtiene una revisión?
- ¿Se ejecutan comandos?
- ¿Se conserva una salida?

#### Preguntas

- ¿En qué momento Git conoce el cambio?
- ¿En qué momento Jenkins obtiene el commit?
- ¿Dónde se ejecuta el script?
- ¿Qué parte puede depender de credenciales?
- ¿Qué información ayuda a reproducir la ejecución?

### Sesión 2: crear el proyecto local

**Objetivo:** construir una aplicación mínima verificable.

#### Instrucciones

1. Crea un directorio personal de prácticas.
2. Crea `app/` y `scripts/`.
3. Añade `app/mensaje.txt`.
4. Añade `scripts/validar.sh`.
5. Añade `README.md`.
6. Ejecuta el script.
7. Anota la salida y el código de retorno.

#### Criterios de finalización

- El script encuentra el archivo.
- El contenido incluye la palabra esperada.
- Un archivo ausente produce error.
- Un contenido incorrecto produce error.
- No hay secretos en los archivos.

### Sesión 3: documentar requisitos del proyecto

**Objetivo:** identificar qué necesita Jenkins.

#### Completa la ficha

```text
Lenguaje o formato:
Sistema operativo esperado:
Shell:
Herramientas:
Archivos de entrada:
Comandos de validación:
Archivos de salida:
Credenciales requeridas:
Acceso de red:
Agente esperado:
```

En esta práctica, el campo de credenciales debería quedar vacío o indicar que no se requieren.

#### Preguntas

- ¿Qué herramientas son imprescindibles?
- ¿Cuáles son opcionales?
- ¿Qué archivos deben llegar desde Git?
- ¿Qué rutas no deberían ser absolutas?
- ¿Qué debería documentarse para otra persona?

### Sesión 4: inicializar y revisar Git

**Objetivo:** versionar el proyecto de manera consciente.

#### Instrucciones

1. Inicializa Git.
2. Consulta `git status`.
3. Añade los archivos del proyecto.
4. Revisa `git diff --cached`.
5. Confirma los archivos incluidos.
6. Busca secretos y archivos temporales.
7. Crea un commit.
8. Anota su identificador.

#### Hoja de registro

```text
Rama:
Commit:
Mensaje:
Archivos incluidos:
Archivos excluidos:
Secreto detectado:
Resultado de la revisión:
```

### Sesión 5: añadir el `Jenkinsfile`

**Objetivo:** versionar la automatización junto con el proyecto.

#### Crear el pipeline

Utiliza:

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar archivos') {
            steps {
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validar contenido') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }
    }
}
```

#### Instrucciones

1. Guarda el archivo con nombre `Jenkinsfile`.
2. Revísalo línea por línea.
3. Confirma que el agente es adecuado.
4. Comprueba las rutas.
5. Comprueba que los pasos son compatibles con el sistema esperado.
6. Añádelo a Git.
7. Revisa el diff.
8. Crea un commit.

### Sesión 6: configurar el job desde SCM

**Objetivo:** permitir que Jenkins obtenga el proyecto y su pipeline.

#### Preparación

El docente proporciona o confirma:

- URL del repositorio.
- Rama de laboratorio.
- Tipo de job.
- Credencial autorizada, si hace falta.
- Ruta del `Jenkinsfile`.
- Etiqueta de agente.

#### Instrucciones

1. Abre la configuración del job.
2. Selecciona el tipo indicado.
3. Añade el repositorio.
4. Selecciona la credencial aprobada.
5. Configura la rama.
6. Indica la ruta del `Jenkinsfile`.
7. Guarda.
8. Inicia una ejecución manual.
9. Revisa checkout y consola.
10. Anota el commit y el agente.

#### No hacer

- No incluyas credenciales en la URL.
- No cambies permisos globales.
- No selecciones un agente de producción.
- No envíes cambios a otro repositorio.
- No ejecutes código que no hayas revisado.

### Sesión 7: comparar resultados locales y remotos

**Objetivo:** determinar si el mismo código se comporta igual en ambos entornos.

#### Compara

- Texto esperado.
- Resultado del script.
- Código de salida.
- Ruta de trabajo.
- Versión de herramientas.
- Commit.
- Sistema operativo.
- Usuario del proceso, si está permitido consultarlo.

#### Completa la tabla

| Comprobación | Local | Jenkins | Diferencia |
|---|---|---|---|
| Archivo existe | | | |
| Contenido válido | | | |
| Shell disponible | | | |
| Git disponible | | | |
| Resultado final | | | |

#### Reflexión

- ¿Qué diferencia afectó al resultado?
- ¿Qué diferencia no fue relevante?
- ¿Qué información faltaría para reproducirlo?
- ¿Qué cambio debería quedar versionado?

### Sesión 8: fallo controlado por contenido

**Objetivo:** comprender cómo un cambio versionado afecta a Jenkins.

#### Instrucciones

1. Cambia `app/mensaje.txt` para eliminar la palabra `Jenkins`.
2. Ejecuta el script localmente.
3. Comprueba que falla.
4. Revisa `git diff`.
5. Crea un commit en la rama de práctica.
6. Envía el cambio solo por el procedimiento autorizado.
7. Ejecuta Jenkins.
8. Confirma el commit procesado.
9. Identifica la etapa fallida.
10. Restaura el contenido válido.

#### Preguntas

- ¿Qué validación falló?
- ¿Jenkins procesó el commit esperado?
- ¿El fallo provino del script o de SCM?
- ¿Qué mensaje ayudó a localizar la causa?
- ¿Cómo confirmaste la corrección?

### Sesión 9: fallo controlado por archivo ausente

**Objetivo:** detectar dependencias locales que no se han versionado.

#### Instrucciones

1. Mueve temporalmente `app/mensaje.txt` fuera del directorio del repositorio.
2. Comprueba el estado de Git.
3. Ejecuta la validación local.
4. Observa el fallo.
5. Restaura el archivo.
6. Comprueba que vuelve a estar bajo seguimiento.
7. No elimines archivos en un repositorio compartido.

#### Preguntas

- ¿Qué mensaje mostró el script?
- ¿Git indicó que el archivo faltaba?
- ¿Qué habría ocurrido si el archivo existiera solo en el portátil?
- ¿Cómo habría ayudado revisar el commit?

### Sesión 10: revisar una diferencia de herramienta

**Objetivo:** entender el efecto de una herramienta ausente o incompatible.

#### Escenario

El script funciona localmente, pero en Jenkins falla porque no encuentra una herramienta.

#### Actividad

1. Identifica el nombre de la herramienta.
2. Confirma el agente.
3. Comprueba si la herramienta está documentada para ese agente.
4. Revisa si existe otra etiqueta autorizada.
5. Formula una solicitud al administrador.
6. No instales el paquete en el agente compartido.

#### Preguntas

- ¿Por qué una instalación local no ayuda al agente?
- ¿Qué política debería definir las herramientas del agente?
- ¿Conviene instalar la herramienta o seleccionar otro agente?
- ¿Qué cambio debería quedar documentado?

### Sesión 11: añadir una salida archivada

**Objetivo:** conservar un resultado de Jenkins asociado a la ejecución.

#### Añade una etapa

```groovy
stage('Preparar salida') {
    steps {
        sh 'mkdir -p salida'
        sh 'cp app/mensaje.txt salida/mensaje.txt'
        archiveArtifacts artifacts: 'salida/mensaje.txt',
                         fingerprint: true
    }
}
```

#### Instrucciones

1. Coloca la etapa después de la validación.
2. Revisa que el archivo de entrada existe.
3. Guarda el cambio en Git.
4. Ejecuta Jenkins.
5. Localiza el artefacto.
6. Registra el número de ejecución.
7. Comprueba que no se archivaron archivos ajenos.

### Sesión 12: investigar un checkout incorrecto

**Objetivo:** separar un error de SCM de un error del pipeline.

#### Escenario

La consola muestra un commit o una rama distintos de los esperados.

#### Revisa

- URL del repositorio.
- Rama de la configuración.
- Rama local.
- Push realizado.
- Tipo de job.
- Job de rama seleccionado.
- Commit mostrado.
- Ruta del `Jenkinsfile`.
- Trigger que inició el job.

#### Informe de investigación

```text
Job:
Rama esperada:
Rama observada:
Commit esperado:
Commit observado:
Ruta del Jenkinsfile:
Evento de inicio:
Hipótesis:
Acción propuesta:
```

### Sesión 13: revisar el `Jenkinsfile` antes de ejecutar

**Objetivo:** aplicar una revisión básica de seguridad.

#### Inspecciona

- Agente solicitado.
- Shell y comandos.
- Scripts llamados.
- Rutas modificadas.
- Acceso a red.
- Referencias a credenciales.
- Operaciones de borrado.
- Publicación o despliegue.
- Condiciones que omiten pruebas.

#### Actividad por parejas

Una persona explica el pipeline.

La otra pregunta:

- ¿Qué ejecuta?
- ¿Dónde se ejecuta?
- ¿Qué archivos modifica?
- ¿Qué información imprime?
- ¿Qué permisos necesita?
- ¿Qué resultado indica éxito?

Intercambiad los roles.

### Sesión 14: escribir un informe de ejecución

**Objetivo:** comunicar una ejecución de forma reproducible.

#### Plantilla

```text
Nombre del proyecto:
Job:
Ejecución:
Repositorio:
Rama:
Commit:
Jenkinsfile:
Agente:
Etapas:
Resultado:
Artefactos:
Diferencias local/Jenkins:
Error, si aplica:
Corrección:
```

#### Revisión antes de entregar

- Elimina credenciales.
- Oculta datos internos no autorizados.
- Incluye solo fragmentos pertinentes.
- Indica el commit.
- Distingue hipótesis de hechos observados.
- No afirmes que el proyecto está libre de defectos por una sola prueba.

## Pipeline final de la práctica

El pipeline final realiza un checkout, verifica archivos, ejecuta el script y archiva una salida.

### Jenkinsfile integrador

```groovy
pipeline {
    agent any

    stages {
        stage('Comprobar checkout') {
            steps {
                checkout scm
                sh 'test -f README.md'
                sh 'test -f app/mensaje.txt'
                sh 'test -f scripts/validar.sh'
            }
        }

        stage('Validar proyecto') {
            steps {
                sh 'bash scripts/validar.sh'
            }
        }

        stage('Preparar resultado') {
            steps {
                sh 'mkdir -p salida'
                sh 'cp app/mensaje.txt salida/mensaje.txt'
            }
        }

        stage('Archivar resultado') {
            steps {
                archiveArtifacts artifacts: 'salida/mensaje.txt',
                                 fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'El proyecto local pasó la validación en Jenkins.'
        }

        failure {
            echo 'La ejecución falló. Revisa checkout, agente y validaciones.'
        }

        always {
            echo 'Fin de la ejecución.'
        }
    }
}
```

### Revisar antes de ejecutarlo

Confirma:

- Que el job está configurado con el repositorio correcto.
- Que `checkout scm` es apropiado para el tipo de job.
- Que el agente puede ejecutar Bash.
- Que el agente dispone de Git si realiza el checkout.
- Que los archivos están en la revisión remota.
- Que el patrón del artefacto es correcto.
- Que no hay credenciales en el código.

### Ejecutar

1. Revisa el estado de Git.
2. Confirma que los cambios están en el commit esperado.
3. Confirma la rama.
4. Inicia el job.
5. Revisa el checkout.
6. Registra el agente.
7. Revisa cada etapa.
8. Localiza el artefacto.
9. Anota el número de ejecución.
10. Guarda el resultado en la ficha del curso.

### Provocar un fallo de forma controlada

Modifica el archivo de entrada para que el texto no cumpla la validación.

Prueba primero localmente.

Después crea una revisión de práctica y ejecuta Jenkins.

Comprueba que:

- El checkout obtiene la revisión modificada.
- La validación falla.
- El mensaje identifica la causa.
- El resultado final no afirma éxito.
- La etapa posterior no genera una salida válida por accidente.

### Recuperar el estado correcto

Restaura el contenido.

Crea un commit correctivo.

Envía el cambio al repositorio de laboratorio mediante el procedimiento autorizado.

Vuelve a ejecutar Jenkins.

Confirma que la ejecución utiliza el commit corregido.

## Plantillas de referencia

Estas plantillas ayudan a registrar requisitos y resultados.

### Ficha del proyecto local

```text
Nombre:
Directorio local:
Sistema operativo:
Lenguaje o formato:
Herramientas:
Cómo se ejecuta localmente:
Archivos de entrada:
Archivos de salida:
Pruebas:
Credenciales requeridas:
Responsable:
```

### Ficha de SCM

```text
Repositorio:
Proveedor:
Rama:
Ruta del Jenkinsfile:
Acceso requerido:
Credencial referenciada:
Método de trigger:
Política de revisión:
Responsable:
```

No escribas el valor de una credencial.

### Ficha del job Jenkins

```text
Nombre del job:
Tipo de job:
Repositorio:
Rama:
Commit de referencia:
Ruta del Jenkinsfile:
Agente:
Etiqueta:
Credencial referenciada:
Trigger:
Artefactos:
Retención:
Responsable:
```

### Ficha de diagnóstico

```text
Job:
Ejecución:
Rama:
Commit:
Agente:
Etapa:
Primer error:
Resultado esperado:
Resultado observado:
Comprobaciones realizadas:
Hipótesis:
Próximo paso:
```

### Ficha de comparación de entornos

```text
Herramienta:
Versión local:
Versión del agente:
Sistema local:
Sistema del agente:
Diferencia:
Impacto:
Evidencia:
Acción propuesta:
```

## Buenas prácticas de transición a CI

### Automatizar la misma validación

El comando del pipeline debería validar el mismo proyecto que se desarrolla localmente.

Evita mantener dos procedimientos que divergen sin motivo.

### Documentar el comando local

El README debería explicar cómo ejecutar las validaciones.

Esto ayuda a reproducir un fallo antes de enviarlo a Jenkins.

### Versionar scripts

Los scripts invocados por el pipeline deberían estar bajo control de versiones.

Así, Jenkins y el resto del equipo utilizan la misma revisión.

### Usar rutas relativas

Las rutas relativas hacen que el proyecto sea más portable entre equipos y agentes.

### Declarar dependencias

Indica qué herramientas se requieren y qué versiones son importantes.

No confíes en instalaciones casuales del equipo local.

### Revisar el commit

Relaciona la ejecución con un commit concreto.

Una rama puede avanzar; el commit identifica la revisión exacta.

### Separar configuración y secretos

La configuración no sensible puede documentarse.

Los secretos deben almacenarse por mecanismos protegidos.

### Hacer fallar las pruebas de verdad

Una prueba debe devolver un resultado de error cuando la condición esencial no se cumple.

No fuerces un código de éxito para silenciar un problema.

### Usar agentes apropiados

Selecciona el agente que ofrezca las herramientas y el aislamiento requeridos.

No uses el controlador como agente de forma automática.

### Mantener el pipeline legible

Nombra las etapas según su propósito.

Extrae lógica extensa a scripts versionados.

### Conservar evidencia útil

Archiva informes o paquetes necesarios.

No archives todo el workspace sin revisar qué contiene.

### Revisar cambios en el pipeline

Un cambio en el `Jenkinsfile` puede alterar el proceso de construcción.

Revísalo como código ejecutable.

## Errores frecuentes

### El proyecto pasa localmente, pero Jenkins no encuentra los archivos

Posibles causas:

- Archivos no añadidos a Git.
- Commit no enviado.
- Rama incorrecta.
- Ruta mal escrita.
- Checkout en otro directorio.
- Diferencias de mayúsculas.
- Cambio de agente sin transferencia.

### La validación local pasa, pero en Jenkins falla

Compara:

- Commit.
- Sistema operativo.
- Shell.
- Usuario.
- Herramientas.
- Versiones.
- Variables.
- Rutas.
- Permisos.

### El pipeline no se actualiza después del commit

Comprueba:

- Si el commit se envió al remoto.
- Si el job procesa la rama correcta.
- Si el evento inició una ejecución nueva.
- Si se ejecutó un job de rama distinto.
- Qué commit muestra la consola.

### Jenkins no encuentra el `Jenkinsfile`

Comprueba:

- Nombre exacto.
- Ruta configurada.
- Rama.
- Commit.
- Estado del archivo en Git.
- Reglas de `.gitignore`.

### Fallo de checkout

Comprueba:

- URL.
- Credencial.
- Permisos.
- Red.
- Certificados.
- Rama.
- Estado del repositorio remoto.

### Comando no encontrado

Comprueba:

- Agente.
- Sistema operativo.
- Shell.
- Herramienta instalada.
- `PATH`.
- Etiqueta.
- Versión.

### Permiso denegado

Comprueba:

- Usuario del proceso.
- Permisos del archivo.
- Propietario.
- Workspace.
- Política del agente.

No soluciones el problema elevando permisos de forma general.

### Artefacto ausente

Comprueba:

- Que el archivo se generó.
- Que la ruta es correcta.
- Que la etapa alcanzó el archivado.
- Que el patrón coincide.
- Que el artefacto no se limpió antes.

### Fallo antes de iniciar una etapa

Puede haber fallado:

- El checkout.
- La lectura del `Jenkinsfile`.
- La validación declarativa.
- La asignación del agente.
- La inicialización del workspace.

Busca el primer error útil, no solo el resumen final.

## Checklist final

### Antes de pasar el proyecto a Jenkins

- [ ] El proyecto tiene estructura clara.
- [ ] La validación se ejecuta localmente.
- [ ] El script devuelve error cuando corresponde.
- [ ] El comando local está documentado.
- [ ] Las herramientas necesarias están identificadas.
- [ ] Las rutas son relativas.
- [ ] No hay secretos en los archivos.
- [ ] `.gitignore` está revisado.
- [ ] El `Jenkinsfile` está en la ruta prevista.
- [ ] El proyecto está registrado en Git.

### Antes de crear un commit

- [ ] Estoy en la rama correcta.
- [ ] El remoto, si existe, es el autorizado.
- [ ] Revisé `git status`.
- [ ] Revisé `git diff`.
- [ ] Revisé `git diff --cached`.
- [ ] No añadí credenciales.
- [ ] No añadí archivos temporales.
- [ ] El mensaje del commit describe el cambio.

### Antes de ejecutar Jenkins

- [ ] El job apunta al repositorio correcto.
- [ ] La rama existe.
- [ ] La ruta del `Jenkinsfile` es correcta.
- [ ] El agente está autorizado.
- [ ] La etiqueta es real y adecuada.
- [ ] La credencial es de mínimo privilegio.
- [ ] Los comandos son compatibles con el agente.
- [ ] Sé cómo identificar el commit ejecutado.

### Después de ejecutar

- [ ] Anoté job y número de ejecución.
- [ ] Registré rama y commit.
- [ ] Confirmé el agente.
- [ ] Revisé checkout y etapas.
- [ ] Identifiqué los artefactos.
- [ ] Revisé logs antes de compartirlos.
- [ ] Registré la causa de fallos.
- [ ] Confirmé si la corrección llegó al remoto.

## Preguntas de repaso

1. ¿Qué diferencia hay entre el entorno local y el agente?
2. ¿Qué relación hay entre Git y Jenkins?
3. ¿Qué registra un commit?
4. ¿Por qué una rama no identifica necesariamente una revisión inmutable?
5. ¿Qué archivo contiene normalmente la definición del pipeline?
6. ¿Qué información necesita Jenkins para encontrar un `Jenkinsfile` en SCM?
7. ¿Por qué conviene probar el script localmente?
8. ¿Qué puede provocar que un archivo exista localmente, pero no en Jenkins?
9. ¿Qué diferencia hay entre un commit y un push?
10. ¿Por qué se deben revisar `git diff` y `git status`?
11. ¿Qué información relaciona Jenkins con una ejecución concreta?
12. ¿Qué puede causar que el pipeline falle antes de su primera etapa?
13. ¿Qué herramienta o configuración debería verificarse ante un comando ausente?
14. ¿Por qué no se debe incluir un token en la URL del repositorio?
15. ¿Qué significa el principio de mínimo privilegio para un job?
16. ¿Qué diferencia hay entre un artefacto y un archivo del workspace?
17. ¿Por qué el `Jenkinsfile` debe revisarse como código?
18. ¿Qué datos incluirías en un informe de diagnóstico?
19. ¿Qué significa que una prueba local no sea reproducible?
20. ¿Qué cambio harías para que tu proyecto dependa menos de la configuración manual?

## Ejercicio de evaluación

Clasifica cada afirmación como **correcta**, **incorrecta** o **necesita más información**.

### Afirmación 1

«Jenkins ejecuta necesariamente el proyecto en el ordenador de quien lo desarrolla».

### Afirmación 2

«El agente puede tener un sistema operativo distinto del equipo local».

### Afirmación 3

«Un commit y un push son la misma operación».

### Afirmación 4

«El `Jenkinsfile` puede versionarse junto con el código».

### Afirmación 5

«Un archivo local que no está en Git puede faltar en Jenkins».

### Afirmación 6

«Una ruta absoluta del portátil es normalmente la forma más portable de localizar un archivo».

### Afirmación 7

«El commit ayuda a identificar exactamente qué revisión ejecutó Jenkins».

### Afirmación 8

«Un repositorio privado permite guardar tokens en el `Jenkinsfile` sin riesgo».

### Afirmación 9

«Una ejecución puede fallar antes de que empiece la primera etapa».

### Afirmación 10

«El agente debe disponer de las herramientas que necesita el pipeline».

### Afirmación 11

«Si el script pasa localmente, queda demostrado que pasará en cualquier agente».

### Afirmación 12

«Archivar un archivo en Jenkins equivale a incorporarlo a Git».

### Afirmación 13

«Una credencial de checkout debería tener permisos limitados».

### Afirmación 14

«El `Jenkinsfile` puede cambiar los comandos ejecutados en un agente».

### Afirmación 15

«Un log debe revisarse antes de compartirse».

## Respuestas orientativas

### Afirmación 1

**Incorrecta.** Jenkins ejecuta normalmente en un agente configurado.

### Afirmación 2

**Correcta.** El agente puede utilizar otro sistema operativo.

### Afirmación 3

**Incorrecta.** El commit registra cambios localmente; el push los envía al remoto.

### Afirmación 4

**Correcta.** Es una práctica habitual.

### Afirmación 5

**Correcta.** Jenkins obtiene la revisión del repositorio, no todos los archivos locales.

### Afirmación 6

**Incorrecta.** Una ruta absoluta personal suele depender del equipo concreto.

### Afirmación 7

**Correcta.** El commit representa una revisión específica.

### Afirmación 8

**Incorrecta.** Un repositorio privado no es un almacén de secretos.

### Afirmación 9

**Correcta.** Puede fallar el checkout, la lectura del pipeline o la asignación del agente.

### Afirmación 10

**Correcta.** Las herramientas deben estar en el agente donde se ejecuta el paso.

### Afirmación 11

**Incorrecta.** Los entornos pueden tener herramientas, permisos y rutas diferentes.

### Afirmación 12

**Incorrecta.** Git y el archivado de Jenkins son mecanismos distintos.

### Afirmación 13

**Correcta.** Es parte del mínimo privilegio.

### Afirmación 14

**Correcta.** El pipeline contiene instrucciones ejecutables.

### Afirmación 15

**Correcta.** Los logs pueden incluir información sensible o interna.

## Glosario

- **Agente:** sistema donde se ejecutan los pasos de un pipeline.
- **Artefacto:** archivo generado y asociado a una ejecución.
- **Commit:** registro de una revisión en Git.
- **Checkout:** obtención de una revisión del repositorio.
- **CI:** integración continua; validación automatizada de cambios.
- **Credencial:** dato de autenticación gestionado para acceder a un recurso.
- **Jenkinsfile:** archivo que define un pipeline de Jenkins.
- **Job:** configuración de Jenkins que puede iniciar una ejecución.
- **Pipeline:** flujo automatizado de etapas y pasos.
- **Rama:** línea de desarrollo en un repositorio.
- **Repositorio:** archivos del proyecto y su historial.
- **Repositorio remoto:** copia accesible desde otro sistema.
- **SCM:** gestión de código fuente.
- **Workspace:** directorio de trabajo de una ejecución en un agente.
- **`.gitignore`:** archivo que indica patrones que Git debe ignorar.
- **Diff:** representación de las diferencias entre versiones.
- **Push:** envío de commits al repositorio remoto.
- **Trigger:** evento o programación que inicia una ejecución.
- **Mínimo privilegio:** principio de otorgar solo los permisos necesarios.
- **Reproducibilidad:** capacidad de repetir o entender una ejecución usando sus entradas y configuración.

## Síntesis final

Pasar de local a Jenkins consiste en hacer explícito lo que antes podía depender de tu equipo.

- Prepara el proyecto y prueba sus validaciones localmente.
- Versiona el código, los scripts y el `Jenkinsfile`.
- Revisa los cambios antes de crear un commit.
- Envía solo al repositorio autorizado.
- Configura Jenkins con la URL, rama y ruta correctas.
- Comprueba qué agente ejecuta los pasos.
- Registra el commit y el número de ejecución.
- Compara herramientas, sistema operativo, rutas y permisos.
- Diagnostica checkout, asignación y comandos como problemas distintos.
- Mantén credenciales fuera del código y de los logs.