# Gestión de credenciales

Esta guía explica cómo proteger credenciales utilizadas por Terraform, Jenkins y herramientas de automatización. Describe qué tipos de secretos aparecen en un flujo de infraestructura, dónde almacenarlos, cómo conceder acceso mínimo y cómo evitar que terminen en repositorios, logs, planes o artefactos.

Las prácticas se limitan a ejemplos de laboratorio con valores ficticios. No se necesitan cuentas cloud ni credenciales reales para completar las sesiones. Los nombres de campos y opciones pueden variar según la versión de Jenkins, sus plugins y los sistemas de identidad de la organización.

> **Regla fundamental:** no escribas secretos reales en el código, los ejemplos, los parámetros de texto, el inventario, las capturas o la consola. Un secreto que se haya publicado debe considerarse expuesto: quitarlo del archivo no invalida las copias existentes. Revócalo o rótalo siguiendo el procedimiento del responsable.

---

## Objetivos y alcance

La gestión de credenciales es parte del diseño de una automatización, no un paso accesorio que se añade al final.

### Resultados de aprendizaje

Al terminar esta guía podrás:

- Diferenciar credenciales, identificadores y permisos.
- Reconocer datos sensibles en Terraform, Jenkins y Git.
- Elegir un lugar adecuado para almacenar una credencial.
- Entender el ámbito de una credencial de Jenkins.
- Aplicar el principio de mínimo privilegio.
- Limitar qué jobs y carpetas pueden utilizar una credencial.
- Evitar imprimir secretos en logs.
- Explicar por qué el enmascaramiento de Jenkins no es una frontera de seguridad.
- Distinguir variables ordinarias de secretos.
- Explicar cómo Terraform puede exponer valores mediante estado y planes.
- Identificar archivos que no deben confirmarse.
- Describir qué hacer cuando una credencial se filtra.
- Proponer métodos de autenticación de corta duración.
- Documentar una práctica sin almacenar valores secretos.
- Diseñar pruebas con datos ficticios que no se puedan usar para autenticarse.

### Qué se tratará

La guía cubre credenciales utilizadas por:

- Jenkins.
- Terraform.
- Git y sistemas de control de versiones.
- Agentes de automatización.
- Proveedores cloud.
- Sistemas de gestión de secretos.
- Herramientas de configuración, como Ansible.

### Qué queda fuera

Esta página no:

- Proporciona credenciales cloud funcionales.
- Enseña a extraer secretos de sistemas ajenos.
- Recomienda reutilizar cuentas personales.
- Define una política corporativa completa.
- Configura un proveedor cloud concreto.
- Autoriza el acceso a producción.
- Sustituye las instrucciones del equipo de seguridad.
- Incluye claves, tokens o contraseñas reales.
- Demuestra autenticación contra una cuenta real.

### Entorno de laboratorio

Para practicar, utiliza:

- Valores descriptivos como `CREDENCIAL_FICTICIA`.
- Identificadores de ejemplo que no correspondan a una cuenta.
- Un Jenkins aislado o una carpeta de laboratorio.
- Jobs que no tengan credenciales de producción.
- Un repositorio desechable de prueba.
- Una cuenta sin permisos externos, si el curso requiere probar la interfaz.

No escribas un secreto real aunque el valor se etiquete como “temporal”.

### Responsabilidades

En un entorno administrado, distintas personas pueden ser responsables de:

- Aprobar una credencial.
- Crearla.
- Asignar permisos.
- Revisar su uso.
- Rotarla.
- Revocarla.
- Investigar una exposición.
- Conservar los registros necesarios.

El alumnado debe utilizar las credenciales que el curso autorice y no crear credenciales nuevas sin permiso.

---

## Conceptos esenciales

Comprender qué se protege ayuda a escoger controles adecuados.

### Qué es una credencial

Una credencial es un dato o mecanismo que permite demostrar identidad o conseguir acceso.

Puede contener:

- Nombre de usuario.
- Contraseña.
- Token.
- Clave privada.
- Certificado.
- Clave de API.
- Secreto de una aplicación.
- Datos de una identidad temporal.
- Configuración necesaria para una autenticación.

No toda configuración es secreta.

Pero una configuración puede revelar nombres de usuarios, topología, endpoints o información operativa que igualmente conviene proteger.

### Identificador frente a secreto

Un identificador suele señalar qué credencial usar.

Por ejemplo:

```text
terraform-lab-provider
```

Ese identificador no debería contener el valor de la credencial.

El valor secreto se guarda en el almacén correspondiente.

Un identificador puede ser visible en un `Jenkinsfile`, siempre que no revele información restringida y la política lo permita.

### Identidad

Una identidad representa una persona, un proceso o un servicio que solicita acceso.

Ejemplos:

- Una persona que inicia sesión en Jenkins.
- Un job que consulta un repositorio.
- Un agente que accede a un servicio.
- Una pipeline que solicita un plan de Terraform.

### Autenticación

La autenticación responde a la pregunta:

> ¿Quién o qué está solicitando acceso?

Puede realizarse con:

- Contraseña.
- Token.
- Clave SSH.
- Certificado.
- Identidad federada.
- Credenciales temporales.
- Otro mecanismo autorizado.

### Autorización

La autorización responde a la pregunta:

> ¿Qué acciones puede realizar esa identidad?

Una autenticación correcta no implica que deba concederse acceso amplio.

### Permisos

Los permisos describen qué puede hacer una identidad en un sistema.

Pueden permitir, por ejemplo:

- Leer un repositorio.
- Ejecutar un job.
- Leer un estado de Terraform.
- Escribir en un backend.
- Crear recursos.
- Cambiar una política.
- Administrar otras identidades.

El acceso debe limitarse al trabajo necesario.

### Secreto

Un secreto es un valor cuya divulgación podría permitir acceso, suplantación o abuso.

Puede ser:

- Permanente.
- Temporal.
- De un solo uso.
- Limitado a una API.
- Válido para una cuenta.
- Válido para un entorno.
- Compartido por varios procesos.

### Credencial de automatización

Una credencial de automatización permite que un proceso actúe sin una persona escribiendo la contraseña en cada ejecución.

Ese uso evita introducir el secreto manualmente, pero aumenta la importancia de proteger:

- El job.
- El agente.
- El repositorio.
- El almacén de credenciales.
- Los logs.
- Los permisos de ejecución.

### Credenciales estáticas y temporales

Una credencial estática conserva el mismo valor hasta que se rota o revoca.

Una credencial temporal se emite para una duración o sesión limitada.

Siempre que la plataforma lo permita y la política lo apruebe, las credenciales temporales pueden reducir el riesgo de exposición prolongada.

### Ciclo de vida

Una credencial tiene un ciclo de vida:

1. Solicitud.
2. Aprobación.
3. Creación.
4. Almacenamiento.
5. Asignación de acceso.
6. Uso.
7. Supervisión.
8. Rotación o renovación.
9. Revocación.
10. Eliminación segura y registro.

Un secreto sin propietario ni fecha de revisión tiende a sobrevivir demasiado tiempo.

### Propietario de la credencial

Cada credencial debería tener una persona, equipo o servicio responsable.

El propietario define:

- Para qué se utiliza.
- Qué jobs pueden usarla.
- Qué permisos necesita.
- Cuándo se revisa.
- Cómo se rota.
- Cómo se revoca.
- Qué hacer si se filtra.

### Superficies de exposición

Un secreto puede aparecer en:

- Código.
- Historial de Git.
- Parámetros.
- Variables de entorno.
- Argumentos de procesos.
- Consola de Jenkins.
- Logs del agente.
- Estado de Terraform.
- Planes de Terraform.
- Artefactos.
- Cachés.
- Copias de seguridad.
- Capturas.
- Mensajes de error.
- Herramientas de diagnóstico.

Proteger el lugar donde se guarda no basta.

También hay que controlar dónde se procesa y dónde puede acabar.

---

## Amenazas y exposición accidental

La mayoría de las filtraciones no requiere un ataque sofisticado.

### Errores frecuentes

- Confirmar un archivo `.env`.
- Copiar una clave a un comentario.
- Añadir un token a la URL del repositorio.
- Imprimir el entorno completo.
- Usar interpolación Groovy con un secreto.
- Guardar el estado de Terraform en Git.
- Adjuntar un plan a una tarea pública.
- Compartir una captura con un valor visible.
- Conceder una credencial a todas las carpetas.
- Mantener una clave de acceso después de que ya no sea necesaria.

### Filtración accidental

Un secreto puede filtrarse por error aunque no se publique en Internet.

Por ejemplo, puede llegar a:

- Un log con acceso amplio.
- Un artefacto retenido.
- Una rama privada con muchos colaboradores.
- Un backup compartido.
- Una caché del agente.
- Un issue de soporte.
- Un archivo adjunto.

El hecho de que un repositorio sea privado no convierte cualquier dato en seguro.

### Filtración en herramientas

Las herramientas pueden registrar:

- Comandos completos.
- Variables.
- Argumentos.
- Respuestas de APIs.
- Cambios de configuración.
- Errores con contexto.

Revisa cómo se comporta cada herramienta con datos sensibles.

### Secreto oculto parcialmente

Una salida como esta todavía puede revelar información:

```text
Token: abcd...wxyz
```

Ocultar parte del valor no garantiza que el resto no sirva para identificarlo o usarlo.

No publiques fragmentos de secretos salvo que el procedimiento oficial lo solicite expresamente.

### Valor codificado no significa valor protegido

Codificar un secreto en base64 no lo cifra.

Cambiar el nombre de una variable tampoco lo protege.

Un valor cifrado sin una gestión adecuada de la clave sigue requiriendo un diseño de seguridad.

### Archivo privado no significa secreto seguro

Un archivo puede tener permisos restrictivos y aun así copiarse a:

- Un backup.
- Un repositorio.
- Un workspace.
- Un log.
- Un directorio sincronizado.
- Una carpeta compartida.

Los permisos del archivo son un control, no una solución completa.

---

## Credenciales en Terraform y Jenkins

Ambas herramientas pueden acceder a secretos, pero no los protegen automáticamente.

### Credenciales de proveedor

Terraform puede necesitar una identidad para comunicarse con un proveedor.

La identidad puede acceder a operaciones de lectura, creación, modificación o borrado.

Antes de permitir ese acceso, define:

- Proveedor.
- Cuenta o proyecto.
- Entorno.
- Permisos.
- Duración.
- Jobs autorizados.
- Registro.
- Revocación.

### Credenciales de SCM

Jenkins puede necesitar una credencial para leer un repositorio privado.

El acceso debería limitarse a:

- Un repositorio o grupo.
- Una operación de lectura cuando sea suficiente.
- Una carpeta o job.
- Una cuenta técnica aprobada.

No uses una credencial administrativa de Git para permitir un checkout de solo lectura.

### Credenciales de agente

Un agente puede necesitar credenciales para:

- Acceder a un registro de contenedores.
- Consultar un servicio.
- Conectarse a un host.
- Leer un artefacto.
- Obtener módulos o proveedores privados.

No las copies a la imagen del agente de forma permanente.

### Credenciales de despliegue

Una credencial que puede desplegar suele tener más impacto que una credencial de lectura.

Mantén separadas las identidades para:

- Lectura y validación.
- Planificación.
- Aplicación.
- Administración.
- Recuperación de emergencia.

La separación real dependerá de la plataforma y la política.

### Terraform no es un almacén de secretos

Terraform recibe valores para utilizarlos en configuraciones y operaciones.

No debe considerarse un sistema de gestión de secretos.

Los valores pueden aparecer en estado, planes, logs o procesos.

### Jenkins no es automáticamente un almacén perfecto

El almacén de credenciales de Jenkins ayuda a administrar secretos, pero el riesgo también depende de:

- Quién administra Jenkins.
- Quién puede cambiar un `Jenkinsfile`.
- Qué plugins están instalados.
- Qué agente ejecuta el job.
- Qué permisos tiene el job.
- Qué datos imprimen los pasos.
- Qué controles tiene el host de Jenkins.

### Estado de Terraform

El estado puede contener valores que se marcaron como sensibles en la configuración.

El estado requiere protección de acceso y almacenamiento.

No lo publiques como evidencia de una práctica.

### Plan de Terraform

Un plan guardado puede incluir información sensible.

La salida legible del plan también puede mostrar configuraciones internas.

No archives un plan sin necesidad, control de acceso y retención aprobados.

### Logs

Los logs permiten diagnosticar, pero pueden incluir:

- Argumentos.
- Variables.
- Respuestas de proveedor.
- Valores de recursos.
- Salidas de comandos.
- Mensajes de excepción.

La redacción y el enmascaramiento deben revisarse en el contexto real.

---

## Dónde guardar credenciales

La ubicación depende del uso, del ciclo de vida y de la política del equipo.

### Gestor de credenciales de Jenkins

Para jobs Jenkins, el almacén de credenciales puede permitir guardar:

- Usuario y contraseña.
- Secretos de texto.
- Claves SSH.
- Certificados.
- Archivos secretos.
- Credenciales de tipos proporcionados por plugins.

La disponibilidad depende de la instalación.

### Sistemas externos de secretos

Una organización puede utilizar un sistema externo para:

- Emitir credenciales.
- Entregarlas a jobs autorizados.
- Rotarlas.
- Revocarlas.
- Auditar su uso.
- Mantener políticas centralizadas.

El nombre y la implementación dependen del entorno.

No conectes una práctica a un sistema externo sin autorización.

### Identidad federada

La identidad federada puede permitir que un job obtenga acceso basado en su identidad, sin almacenar una clave permanente.

La configuración depende del proveedor y de Jenkins.

Debe validarse:

- Qué job puede asumir la identidad.
- Qué sujeto se acepta.
- Qué permisos recibe.
- Cuánto dura la sesión.
- Cómo se registra el acceso.
- Cómo se revoca la confianza.

### Credenciales temporales

Una credencial temporal limita la ventana de exposición.

Debe tener:

- Alcance conocido.
- Caducidad.
- Renovación controlada.
- Asociación con una identidad.
- Registro de emisión y uso.

Una credencial temporal con permisos excesivos sigue siendo peligrosa mientras está activa.

### Variables de entorno

Las variables de entorno pueden transportar valores a un proceso.

No son un almacén de secretos por sí solas.

Pueden exponerse mediante:

- Logs.
- Depuración.
- Procesos.
- Archivos de diagnóstico.
- Herramientas de observabilidad.
- Jobs con acceso al mismo agente.

### Archivos temporales

Algunos programas solo aceptan credenciales mediante archivos.

En ese caso:

- Crea el archivo usando un mecanismo aprobado.
- Limita los permisos.
- Usa una ruta temporal controlada.
- Evita imprimir el contenido.
- Elimina el archivo al terminar.
- Considera si los backups o caches pueden conservarlo.

### Archivos locales de desarrollo

Para ejercicios locales, usa los mecanismos autorizados del sistema.

No crees un archivo de credenciales en el directorio del proyecto.

No sincronices un archivo secreto con carpetas personales o servicios no aprobados.

### Archivos de ejemplo

Los archivos de ejemplo deben contener solo marcadores que no permitan autenticar.

Ejemplo:

```text
API_TOKEN=VALOR_FICTICIO_NO_UTILIZABLE
```

Aun así, no presentes este patrón como una forma segura de almacenar un token real.

### Gestores de contraseñas

Una persona puede utilizar un gestor de contraseñas aprobado para sus credenciales individuales.

No compartas la base de datos de contraseñas por Git ni exportes secretos a un documento.

---

## Tipos de credencial

Los controles adecuados dependen del tipo de identidad.

### Usuario y contraseña

Un par usuario/contraseña puede ser necesario para servicios antiguos o integraciones concretas.

Riesgos:

- Reutilización.
- Contraseñas humanas.
- Caducidad.
- Acceso demasiado amplio.
- Exposición por formularios.
- Cambios de contraseña que rompen jobs.

Evita utilizar una cuenta personal para automatización.

### Tokens

Un token puede limitarse a un usuario, aplicación, repositorio o API.

Comprueba:

- Alcance.
- Fecha de caducidad.
- Permisos.
- Identidad propietaria.
- Método de revocación.
- Registro de uso.

Un token largo y permanente sigue siendo una credencial sensible.

### Claves SSH

Una clave SSH puede permitir autenticación de una máquina o persona.

Protege:

- Clave privada.
- Frase de contraseña, si existe.
- Clave pública.
- Host keys.
- Usuario remoto.
- Alcance de la clave.
- Permisos y revocación.

No guardes la clave privada en el repositorio.

### Clave pública y clave privada

La clave pública puede distribuirse según el diseño.

La clave privada debe protegerse.

No confundas ambas por sus nombres o extensiones.

### Certificados

Un certificado puede identificar un servicio o cliente.

Protege especialmente:

- Claves privadas.
- Contraseñas de contenedor PKCS#12.
- Archivos que combinen certificado y clave.
- Cadenas de confianza.
- Procedimientos de renovación.

Un certificado público no debe confundirse con la clave privada asociada.

### Secreto de texto

Una credencial de texto puede representar:

- Un token.
- Una contraseña.
- Un secreto de aplicación.
- Un valor secreto usado por un plugin.

No la imprimas ni la incluyas en parámetros visibles.

### Identidad de proveedor cloud

Una identidad cloud puede ser:

- Una clave de acceso.
- Un principal de servicio.
- Una cuenta de servicio.
- Un rol asumido.
- Una identidad federada.
- Una sesión temporal.

El tipo más adecuado depende del proveedor y de la política de la organización.

### Credencial de registro

Un registro de contenedores puede requerir autenticación para descargar o publicar imágenes.

Separa, si es posible:

- Credencial de lectura.
- Credencial de publicación.
- Registro de laboratorio.
- Registro de producción.

### Credencial de base de datos

Puede permitir leer, escribir o administrar una base de datos.

No uses una cuenta de administración para una consulta sencilla.

Define permisos por aplicación y por entorno.

### Credencial de emergencia

Una credencial de emergencia puede tener permisos amplios.

Debe contar con:

- Acceso restringido.
- Custodia documentada.
- Uso justificado.
- Auditoría.
- Renovación.
- Revisión posterior.
- Procedimiento de revocación.

No la uses para una práctica corriente.

---

## Almacén de credenciales de Jenkins

El almacén de Jenkins permite asociar credenciales a jobs y usuarios autorizados.

### Tipos disponibles

Los tipos disponibles pueden incluir:

- Username with password.
- Secret text.
- SSH username with private key.
- Secret file.
- Certificado.
- Tipos añadidos por plugins.

El nombre exacto puede variar por versión.

### Identificador

Cada credencial puede tener un identificador.

Ejemplo de identificador no secreto:

```text
terraform-lab-readonly
```

El identificador se usa para seleccionar la credencial en algunas configuraciones.

No escribas el valor secreto como identificador.

### Descripción

La descripción debería explicar:

- Propósito.
- Entorno.
- Propietario.
- Restricciones.
- Fecha de revisión, si la política lo permite.

No incluyas el secreto en la descripción.

### Ámbito global

Una credencial global puede estar disponible para más jobs o carpetas.

No la elijas por comodidad si el job solo necesita una credencial de carpeta.

### Ámbito de carpeta

Una credencial asociada a una carpeta puede limitar su visibilidad a los jobs permitidos allí.

Comprueba cómo heredan permisos las carpetas.

### Credenciales de sistema

Algunas credenciales se utilizan para que Jenkins acceda a servicios del propio controlador.

No asumas que son apropiadas para un job.

### Permisos de uso

Controla quién puede:

- Ver metadatos.
- Usar una credencial.
- Administrar una credencial.
- Cambiar su alcance.
- Crear jobs que la consuman.

La capacidad de usar una credencial puede ser suficiente para abusar de ella, aunque el usuario no pueda leer su valor directamente.

### Separación de tareas

Siempre que la organización lo permita, separa:

- Administración de credenciales.
- Administración de jobs.
- Revisión de código.
- Aprobación de despliegues.
- Administración de Jenkins.

Evita que una sola cuenta pueda cambiar el código, leer el secreto y aplicar cambios sin revisión.

### No depender del nombre

Un nombre como `readonly` no demuestra que la credencial tenga permisos de solo lectura.

Comprueba los permisos reales en el sistema destino.

### Crear una credencial

La creación debe seguir el procedimiento del administrador.

Para una práctica:

- Usa una instancia aislada.
- Usa un valor ficticio que no autentique.
- Limita su alcance al ejercicio.
- No reutilices contraseñas.
- Elimina la credencial al terminar, si corresponde.

### No pedir al alumno el secreto

En un curso, el docente puede preparar credenciales y limitar qué jobs pueden acceder a ellas.

No solicites a estudiantes que peguen sus contraseñas personales en Jenkins.

### Identificadores estables

Un identificador puede estar referenciado por un job o un pipeline.

Cambiarlo puede romper ejecuciones.

Define nombres que indiquen:

- Servicio.
- Entorno.
- Propósito.
- Tipo de acceso.

Evita incluir usuarios personales.

---

## Ámbitos y permisos

El alcance de una credencial debe coincidir con el alcance del trabajo.

### Credencial de solo lectura

Un checkout de Git suele necesitar lectura, no administración del repositorio.

Solicita el permiso mínimo que permite completar la tarea.

### Credencial de validación

Una pipeline que solo valida Terraform no debería necesitar una credencial capaz de crear infraestructura.

Separa validación y aplicación.

### Credencial de planificación

Una planificación con proveedor puede necesitar leer información remota, según el proveedor y la configuración.

No asumas que “solo plan” no requiere permisos o no tiene efectos secundarios.

### Credencial de aplicación

Una credencial que modifica recursos tiene más impacto.

Limita:

- Quién puede usarla.
- Qué job puede invocarla.
- Qué entorno administra.
- Qué permisos concede.
- Cuánto tiempo está disponible.
- Qué revisión es necesaria.

### Permisos heredados

Una credencial de nivel superior puede quedar disponible en subcarpetas.

Comprueba la herencia y la matriz de permisos.

No compartas una credencial global para evitar diseñar el ámbito.

### Acceso por job

Una configuración puede limitar la credencial a una carpeta o job.

Confirma que el límite funciona con la versión y plugin usados.

### Acceso de las ramas

Un `Jenkinsfile` de una rama determina pasos ejecutables.

Si una credencial está disponible para cualquier rama, una modificación no revisada podría intentar utilizarla.

Limita credenciales sensibles a jobs y ramas de confianza.

### Pull requests externos

No concedas credenciales a código de pull requests no confiables.

La política puede necesitar:

- Jobs separados.
- Agentes aislados.
- Sin secretos.
- Aprobación previa.
- Ejecución solo de validaciones inocuas.

### Evitar credenciales compartidas entre proyectos

Una credencial compartida amplía el impacto de:

- Filtración.
- Error en un job.
- Compromiso de un repositorio.
- Cambio de permisos.
- Mala configuración del agente.

Usa separación razonable según el entorno.

---

## Rotación y revocación

Las credenciales necesitan un proceso de renovación y retirada.

### Rotación

Rotar una credencial implica sustituir un valor por otro nuevo y actualizar los consumidores autorizados.

Planifica:

- Emisión del nuevo valor.
- Actualización del almacén.
- Prueba del job.
- Revocación del valor anterior.
- Revisión de logs.
- Confirmación de que no hay consumidores olvidados.

### Evitar interrupciones

Para evitar una interrupción, algunos servicios permiten un periodo breve en el que dos credenciales coexisten.

Ese periodo debe estar limitado y documentado.

No mantengas credenciales antiguas indefinidamente “por si acaso”.

### Caducidad

Una credencial debería tener una duración razonable.

Una credencial sin caducidad requiere revisión periódica y una razón clara.

### Revocación

Revocar una credencial impide o limita su uso futuro.

Puede ser necesario ante:

- Filtración.
- Fin de una práctica.
- Cambio de propietario.
- Baja de una persona.
- Cambio de servicio.
- Permisos innecesarios.
- Token vencido.
- Sospecha de abuso.

### Rotación no es revocación

Cambiar una contraseña no elimina necesariamente otros tokens, sesiones o claves asociadas a la cuenta.

Revisa todos los métodos de autenticación disponibles.

### Prueba posterior

Tras rotar o revocar:

- Comprueba los jobs autorizados.
- Verifica que no se usa un valor antiguo.
- Confirma que otros jobs no dependían de la credencial.
- Revisa errores de autenticación.
- Conserva el registro del cambio.

### Responsable

Cada credencial debe tener una persona o equipo responsable de aprobar la rotación y la revocación.

No dejes el proceso a la improvisación del último minuto.

---

## Usar credenciales de forma segura

El job debe recibir una credencial solo durante el tiempo y el alcance necesarios.

### Principio de mínimo privilegio

Concede únicamente:

- El permiso requerido.
- En el servicio requerido.
- Para la operación requerida.
- En el entorno requerido.
- Al job requerido.
- Durante el tiempo requerido.

### Evitar acceso administrativo general

No uses una cuenta de administrador para:

- Leer un repositorio.
- Ejecutar `terraform fmt`.
- Ejecutar una validación local.
- Leer un artefacto.
- Consultar una API de solo lectura.

### Revisar cada uso

Antes de añadir una credencial a un job, responde:

- ¿Qué paso la necesita?
- ¿Qué sistema accede?
- ¿Qué permiso exacto requiere?
- ¿Qué identidad se presenta?
- ¿Qué datos pueden registrarse?
- ¿Cómo se revoca?
- ¿Quién puede cambiar el código del job?

### Vincular credenciales en Jenkins Pipeline

La sintaxis depende del tipo de credencial y de los plugins instalados.

Un ejemplo conceptual para una credencial de texto podría ser:

```groovy
withCredentials([
    string(
        credentialsId: 'credencial-laboratorio',
        variable: 'TOKEN_TEMPORAL'
    )
]) {
    sh 'comando-que-necesita-el-token'
}
```

Este ejemplo muestra la estructura, no una configuración lista para producción.

No uses un token real en la práctica.

### Ejemplo de usuario y contraseña

```groovy
withCredentials([
    usernamePassword(
        credentialsId: 'credencial-laboratorio',
        usernameVariable: 'SERVICIO_USUARIO',
        passwordVariable: 'SERVICIO_CLAVE'
    )
]) {
    sh 'comando-que-usa-la-autenticacion'
}
```

No imprimas esas variables.

No las insertes directamente en el texto del comando.

### Ejemplo con clave SSH

```groovy
sshagent(credentials: ['clave-ssh-laboratorio']) {
    sh 'comando-ssh-autorizado'
}
```

El uso real depende del plugin y de las políticas de la instancia.

No añadas hosts reales a esta práctica.

### Credencial de archivo

Algunas integraciones entregan una credencial como archivo temporal.

Un uso conceptual puede tener esta forma:

```groovy
withCredentials([
    file(
        credentialsId: 'archivo-secreto-laboratorio',
        variable: 'RUTA_ARCHIVO_SECRETO'
    )
]) {
    sh 'comando-que-lee-el-archivo'
}
```

No imprimas el archivo ni su contenido.

### Limitar el bloque

Encierra el paso que necesita la credencial en el bloque de uso más pequeño posible.

No mantengas el secreto disponible durante todas las etapas si solo hace falta para una.

### No pasar secretos como parámetros normales

Evita:

```text
Build with Parameters → password como texto corriente
```

Un parámetro puede aparecer en la interfaz, el historial o los metadatos del build.

Utiliza el mecanismo de credenciales aprobado.

### No codificar secretos en Groovy

No escribas:

```groovy
def token = 'valor-secreto'
```

No guardes el valor en:

- Variable local.
- Constante.
- Comentario.
- `environment`.
- `sh`.
- `bat`.
- Un archivo generado y archivado.

### Evitar interpolación Groovy

Evita interpolar una variable secreta de Groovy dentro del comando.

Ejemplo a evitar:

```groovy
sh "herramienta --token ${TOKEN_TEMPORAL}"
```

La interpolación puede colocar el valor en el texto del comando antes de que se ejecute.

### Preferir expansión controlada del shell

Cuando la integración y la política lo permitan, el secreto puede estar disponible como variable de entorno y la shell puede leerlo sin interpolarlo en Groovy.

Ejemplo conceptual:

```groovy
sh 'herramienta --token "$TOKEN_TEMPORAL"'
```

Esto no elimina todos los riesgos de exposición.

La herramienta podría registrar argumentos, y el entorno del proceso puede ser accesible según el sistema.

### Evitar argumentos de línea de comandos

Algunos sistemas muestran argumentos de procesos a otros usuarios o los guardan en logs.

Si la herramienta admite entrada segura por archivo, descriptor o mecanismo federado, sigue la documentación y la política aprobadas.

No inventes métodos de ocultación.

### No imprimir el secreto

No uses:

```groovy
echo "${TOKEN_TEMPORAL}"
```

No uses:

```groovy
sh 'printf "%s\n" "$TOKEN_TEMPORAL"'
```

No uses comandos de depuración que muestren el valor.

### No confiar solo en el enmascaramiento

Jenkins puede ocultar algunos valores conocidos en la consola.

El enmascaramiento:

- Puede no cubrir todas las formas codificadas.
- Puede fallar con transformaciones.
- Puede no cubrir artefactos.
- No impide que un proceso use o transmita el valor.
- No protege contra código malicioso en el job.
- No reemplaza los permisos.

### Consola y errores

Los mensajes de error pueden incluir:

- URL completa.
- Usuario.
- Argumentos.
- Respuesta del proveedor.
- Contenido del archivo.
- Fragmentos de variables.

Revisa los logs antes de compartirlos.

### Archivos temporales

Si se necesita un archivo:

- Usa la vinculación de credenciales aprobada.
- Evita escribirlo en el repositorio.
- Limita permisos.
- No lo archives.
- No imprimas su ruta si es sensible.
- Elimina el archivo al terminar si el mecanismo no lo hace.
- Considera el riesgo de workspace persistente.

### Compartir agentes

En un agente compartido, otro proceso puede tener acceso a determinados recursos locales según la configuración.

No ejecutes jobs sensibles en agentes compartidos sin aislamiento y revisión adecuados.

### Herramientas de depuración

Evita:

```text
set -x
```

si hay credenciales en el entorno.

Evita modos de depuración verbosos hasta entender qué registran.

### Variables de entorno

No ejecutes:

```bash
env
```

ni:

```bash
printenv
```

en un job que pueda tener secretos.

Muestra solo variables no sensibles necesarias.

### Limpieza

Al terminar una operación:

- Cierra la sesión o bloque de credencial.
- Elimina archivos temporales cuando corresponda.
- No guardes valores en caches.
- Evita dejar procesos en segundo plano.
- Revisa que el job no archive archivos secretos.
- Sigue la política de limpieza del agente.

---

## Terraform y secretos

Terraform puede utilizar secretos, pero sus mecanismos no equivalen a un gestor de secretos completo.

### Variables de entrada

Una variable puede recibir un valor desde:

- Un archivo.
- Una variable de entorno.
- Una opción de línea de comandos.
- Un sistema de gestión de credenciales.
- Un proveedor o backend.

El método debe limitar exposiciones.

### Variable marcada como sensible

Ejemplo:

```hcl
variable "valor_laboratorio" {
  description = "Valor ficticio para estudiar variables."
  type        = string
  sensitive   = true
}
```

El atributo `sensitive` ayuda a ocultar determinados valores en algunas salidas.

No elimina el valor del estado ni de todos los logs.

### No usar una variable sensible como almacén

La declaración:

```hcl
sensitive = true
```

no cifra el valor por sí sola.

No sustituye un gestor de secretos.

### `TF_VAR_`

Terraform puede leer variables de entorno con nombres como:

```text
TF_VAR_nombre_variable
```

No escribas un secreto real en un script versionado para definir esa variable.

No imprimas el entorno.

### Argumentos `-var`

Pasar valores con:

```text
-var="nombre=valor"
```

puede exponerlos en historial, logs o listados de procesos.

Evita usar este patrón con secretos salvo que exista un mecanismo aprobado y revisado.

### Archivos de variables

Un archivo `.tfvars` puede ser útil para valores no secretos.

Si contiene secretos:

- No lo confirmes.
- Limita permisos.
- Evita copiarlo a workspaces compartidos.
- Evalúa su retención.
- Sigue la política del equipo.

### Variables en planes

Un plan puede incorporar valores usados durante la planificación.

Aunque algunos valores se oculten en la salida, el archivo del plan puede conservar información sensible.

Protege el plan.

### Valores en estado

Terraform puede guardar valores en el estado aunque se hayan marcado como sensibles.

El estado debe tratarse como información potencialmente confidencial.

### Valores en salidas

Una salida puede mostrar valores en consola.

No uses outputs para imprimir credenciales.

Revisa también los outputs que consumen otros módulos o jobs.

### Proveedores

Los proveedores pueden leer credenciales desde:

- Variables de entorno.
- Archivos de configuración.
- Roles o identidades.
- Credenciales temporales.
- Configuración específica del proveedor.

Sigue la documentación oficial y las políticas de la organización.

### Identidad de la máquina

Un agente podría obtener una identidad desde su entorno.

No asumas que esa identidad es apropiada solo porque está disponible.

Comprueba:

- Qué recursos puede modificar.
- Qué jobs comparten el agente.
- Cómo se audita.
- Cómo se revoca.
- Si el job puede salir de su contexto previsto.

### Backend y credenciales

Un backend remoto puede necesitar una identidad distinta de la del proveedor.

Separa las credenciales cuando corresponda.

Limita el acceso al estado a las personas y jobs que lo necesitan.

---

## Repositorios y control de versiones

Los secretos no deben confundirse con configuración pública ni con valores de ejemplo.

### Archivos que nunca se confirman

Como regla general, no confirmes sin revisión:

- Claves privadas.
- Tokens.
- Contraseñas.
- Archivos `.env` con secretos.
- Configuración personal de proveedor.
- Credenciales de herramientas.
- Estados Terraform.
- Planes guardados.
- Logs potencialmente sensibles.
- Certificados que incluyen claves privadas.
- Backups de credenciales.
- Ficheros temporales de autenticación.

La política concreta puede ser aún más estricta.

### `.gitignore`

Un `.gitignore` puede excluir patrones:

```gitignore
*.tfstate
*.tfstate.*
*.tfplan
.env
.env.*
```

Adáptalo al proyecto.

No ignores todo el directorio con archivos necesarios ni confíes únicamente en estos patrones.

### `.gitignore` no es un control de acceso

El archivo ayuda a evitar que determinados archivos se añadan por error.

No:

- Cifra archivos.
- Elimina un archivo ya confirmado.
- Protege copias locales.
- Revoca credenciales.
- Evita que alguien fuerce su inclusión.
- Asegura que un artefacto de Jenkins no lo publique.

### Revisar antes de añadir

Antes de ejecutar `git add`:

```bash
git status
```

Después, revisa:

```bash
git diff --cached
```

No confirmes archivos que no hayas inspeccionado.

### Buscar patrones de riesgo

Puedes revisar nombres de archivos y cambios en busca de:

- `password`
- `token`
- `secret`
- `private_key`
- `access_key`
- `client_secret`
- `credential`

Una búsqueda por palabras no sustituye una revisión completa.

Un secreto puede tener un nombre inesperado.

### Herramientas de detección

Las herramientas de escaneo de secretos pueden detectar patrones conocidos.

No garantizan que todos los secretos se encuentren.

Revisa:

- Qué repositorios escanean.
- Si examinan historial.
- Cómo tratan falsos positivos.
- Quién recibe alertas.
- Cómo se bloquea una confirmación.
- Qué hacer con una detección real.

### Secretos en el historial

Eliminar el archivo en un commit nuevo no quita el secreto de commits anteriores.

Puede seguir en:

- Historial de Git.
- Forks.
- Clones locales.
- Pull requests.
- Cachés.
- Backups.
- Logs.
- Índices de búsqueda.

### Secreto confirmado accidentalmente

Si se confirma un secreto real:

1. No lo publiques más.
2. Avísale al responsable según la política.
3. Revoca o rota la credencial.
4. Comprueba el alcance y los permisos.
5. Revisa logs y accesos.
6. Identifica ramas, forks y artefactos.
7. Trata la limpieza del historial como una tarea posterior.
8. No asumas que reescribir Git invalida la credencial.
9. Documenta el incidente de forma autorizada.

### No borrar solo para ocultar

Eliminar el archivo sin informar puede impedir una respuesta adecuada.

La prioridad es invalidar el secreto y comprender la exposición.

### Repositorios privados

Un repositorio privado puede incluir:

- Muchos usuarios.
- Bots.
- Integraciones.
- Copias.
- Mirrors.
- Backups.

“Privado” no significa “apto para secretos”.

### Archivos de ejemplo

Utiliza marcadores inequívocos:

```text
VALOR_FICTICIO_NO_UTILIZABLE
```

Evita usar patrones que parezcan credenciales reales.

No utilices valores copiados de documentación de terceros si pudieran ser tokens activos.

---

## Credenciales en entornos de equipo

La separación evita que una credencial de prueba llegue a producción o que un job de validación obtenga permisos de aplicación.

### Desarrollo, prueba y producción

Usa identidades separadas por entorno cuando la política lo requiera.

Evita que un job de desarrollo pueda acceder automáticamente a producción.

### Nombres claros

Los identificadores pueden reflejar:

- Servicio.
- Entorno.
- Operación.
- Nivel de acceso.

Ejemplos no secretos:

```text
scm-read-lab
terraform-plan-test
provider-deploy-development
```

Estos nombres son ilustrativos.

No reflejan valores de credenciales.

### Identidades por job

Una identidad por job o por función ayuda a:

- Limitar permisos.
- Revisar uso.
- Revocar un consumidor.
- Atribuir acciones.
- Separar entornos.

No es necesario crear una identidad nueva para cada paso si la plataforma y el flujo no lo justifican; el alcance debe diseñarse.

### Identidades compartidas

Las identidades compartidas reducen trazabilidad y dificultan revocaciones selectivas.

Si se necesitan, deben tener:

- Propietario.
- Justificación.
- Ámbito definido.
- Revisión periódica.
- Registro de uso.
- Procedimiento de retiro.

### Cuentas personales

Evita utilizar credenciales personales permanentes para jobs.

Una baja, cambio de puesto o rotación personal podría interrumpir automatizaciones o dejar acceso sin revisar.

### Credenciales de corta duración

Las credenciales temporales reducen la vida útil de un valor expuesto.

Comprueba:

- Duración de la sesión.
- Renovación.
- Jobs autorizados.
- Trazabilidad.
- Permisos.
- Comportamiento ante reintentos.

### Tokens de solo lectura

Para checkout o consulta, utiliza permisos de lectura si son suficientes.

No concedas escritura al repositorio para una tarea que solo necesita descargar código.

### Identidades federadas

Una identidad federada puede permitir que un job reciba acceso basado en su identidad y contexto.

Define:

- Emisor confiable.
- Audiencia.
- Sujeto.
- Rama o entorno.
- Permisos.
- Duración.
- Logs.
- Procedimiento de revocación.

### Aprobaciones

Una acción con credenciales de modificación puede requerir aprobación.

La aprobación debe identificar:

- Qué se cambiará.
- En qué entorno.
- Qué credencial se usará.
- Qué commit se ejecuta.
- Quién aprueba.
- Cómo se revisó el plan.

### Segregación de funciones

En actividades de alto impacto, puede convenir separar:

- Quien escribe el cambio.
- Quien lo revisa.
- Quien aprueba.
- Quien administra las credenciales.
- Quien ejecuta la aplicación.

El diseño depende de las políticas organizativas.

### Auditoría

Registra lo necesario para responder:

- Quién inició la ejecución.
- Qué job se ejecutó.
- Qué identidad se utilizó.
- Qué commit se procesó.
- Qué entorno se seleccionó.
- Qué resultado hubo.
- Quién aprobó.
- Cuándo se revocó o rotó la credencial.

No registres el valor del secreto para conseguir auditoría.

---

## Integración con CI/CD

La integración segura tiene que proteger tanto la credencial como el código que puede invocarla.

### Jenkins

Jenkins puede almacenar credenciales y proporcionarlas a jobs.

La seguridad depende de:

- Permisos de usuarios.
- Permisos de carpetas.
- Plugins.
- Agentes.
- Repositorios.
- Definición del pipeline.
- Consolas.
- Artefactos.
- Almacén de credenciales.

### Código del pipeline

El `Jenkinsfile` puede ejecutar comandos arbitrarios en el agente.

Por eso, quien puede modificarlo puede intentar:

- Leer variables.
- Copiar archivos.
- Mostrar información.
- Enviar datos a otro destino.
- Usar permisos disponibles.

Revisa cambios de pipeline con el nivel de confianza apropiado.

### Pull requests no confiables

No concedas credenciales a un pipeline que ejecuta código de un pull request externo no revisado.

Opciones habituales de diseño pueden incluir:

- Validaciones sin credenciales.
- Agentes aislados.
- Jobs separados.
- Aprobación antes de acceder a secretos.
- Revisión de cambios.
- Limitación de red.

La configuración específica debe definirla el administrador.

### Agentes

Un agente que recibe una credencial puede convertirse en una superficie de exposición.

Considera:

- Si comparte sistema con otros jobs.
- Si conserva workspaces.
- Si permite acceso interactivo.
- Si corre código de varios niveles de confianza.
- Si mantiene procesos después del job.
- Si tiene acceso de red amplio.
- Si elimina archivos temporales.

### Logs de Pipeline

Antes de compartir una consola:

- Busca valores expuestos.
- Busca argumentos completos.
- Revisa mensajes de proveedor.
- Revisa URLs.
- Revisa rutas internas.
- Comprueba artefactos adjuntos.
- Oculta datos no necesarios.
- Usa el canal aprobado.

### Archivos de estado y plan

No archives por defecto:

```text
terraform.tfstate
terraform.tfstate.*
*.tfplan
```

Un archivo de plan puede contener información sensible.

El estado necesita un backend y permisos diseñados para ese uso.

### Variables de Jenkins

Una variable de entorno no es automáticamente segura.

Su seguridad depende de:

- Cómo se establece.
- Quién puede leer el job.
- Qué procesos pueden inspeccionarla.
- Si se imprime.
- Si se conserva.
- Si se propaga a procesos hijos.
- Cómo se limpia.

### Parámetros de Pipeline

No uses parámetros de texto normal para contraseñas o tokens.

Un parámetro puede quedar visible en la interfaz, historial o logs.

Utiliza el almacén de credenciales.

### No ejecutar `env`

Este paso puede revelar secretos:

```groovy
sh 'env'
```

Si necesitas diagnosticar, muestra únicamente variables no sensibles y específicas.

### No activar trazas sin revisar

Comandos como:

```bash
set -x
```

pueden imprimir comandos expandidos y valores.

No actives trazas en bloques donde haya credenciales.

### Herramientas externas

Un plugin o una herramienta auxiliar puede registrar argumentos y datos.

Antes de pasar secretos:

- Revisa documentación.
- Revisa logs.
- Confirma la forma de autenticación.
- Prueba con valores ficticios.
- Consulta al administrador.

### Jenkins y Terraform

Una pipeline que solo ejecuta:

```text
terraform fmt
terraform validate
```

normalmente no necesita credenciales de proveedor.

Si la validación las requiere, revisa la configuración: puede estar inicializando un backend o un proveedor que no forma parte del ejercicio.

### Aplicación en CI

Una pipeline de `apply` necesita un diseño específico que incluya:

- Identidad aprobada.
- Backend remoto protegido.
- Plan asociado a un commit.
- Revisión y aprobación.
- Separación de entornos.
- Control de concurrencia.
- Límites de permisos.
- Logs protegidos.
- Verificación posterior.

No añadas `apply` a una práctica de credenciales sin autorización.

### Ansible y otras herramientas

El mismo principio se aplica a Ansible y herramientas similares:

- No guardes claves SSH en Git.
- Usa un almacén de credenciales aprobado.
- Limita hosts.
- Limita permisos.
- No imprimas variables.
- No uses `become` sin justificación.
- Revisa logs y artefactos.

---

## Ejemplos de uso seguro en Jenkins

Los ejemplos muestran estructuras, no credenciales funcionales.

### Vincular un secreto de texto

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Ejemplo con secreto ficticio') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'secreto-ficticio',
                        variable: 'TOKEN_TEMPORAL'
                    )
                ]) {
                    sh '''
                        set +x
                        herramienta --modo-comprobacion
                    '''
                }
            }
        }
    }
}
```

El comando no utiliza el valor para autenticarse.

El ejemplo ilustra que el secreto no debe imprimirse.

### Limitar el bloque

El bloque `withCredentials` contiene solo el paso que necesita la credencial.

No envuelvas el pipeline entero si basta con un bloque pequeño.

### Referenciar la variable sin imprimirla

Si una herramienta aprobada exige una variable de entorno, utiliza su método documentado.

No añadas una línea `echo` para “comprobar” el valor.

La presencia del identificador y el éxito de la autenticación se comprueban con una operación inocua autorizada.

### Interpolación que se debe evitar

```groovy
withCredentials([
    string(
        credentialsId: 'secreto-ficticio',
        variable: 'TOKEN_TEMPORAL'
    )
]) {
    sh "herramienta --token ${TOKEN_TEMPORAL}"
}
```

Groovy puede interpolar el valor antes de ejecutar el comando.

Eso puede exponerlo en la representación del proceso, logs u otros diagnósticos.

### Patrón con shell

```groovy
withCredentials([
    string(
        credentialsId: 'secreto-ficticio',
        variable: 'TOKEN_TEMPORAL'
    )
]) {
    sh '''
        set +x
        herramienta --modo-comprobacion
    '''
}
```

La shell recibe la variable en el entorno del bloque.

La variable sigue siendo sensible y no debe imprimirse.

### Archivo de credencial

```groovy
withCredentials([
    file(
        credentialsId: 'archivo-ficticio',
        variable: 'ARCHIVO_CREDENCIAL'
    )
]) {
    sh '''
        set +x
        herramienta --config "$ARCHIVO_CREDENCIAL"
    '''
}
```

No uses `cat` para mostrar el archivo.

No archives la ruta ni su contenido.

### Usuario y contraseña

```groovy
withCredentials([
    usernamePassword(
        credentialsId: 'usuario-ficticio',
        usernameVariable: 'SERVICIO_USUARIO',
        passwordVariable: 'SERVICIO_CLAVE'
    )
]) {
    sh '''
        set +x
        herramienta --modo-comprobacion
    '''
}
```

El ejemplo no usa la contraseña.

En un job real, sigue la forma de autenticación que recomiende el sistema.

### Clave SSH

```groovy
sshagent(credentials: ['clave-ficticia']) {
    sh 'comando-de-prueba-sin-host-real'
}
```

La sintaxis depende de que el plugin correspondiente esté instalado.

No ejecutes conexiones remotas en esta práctica.

### Resultado que no debe añadirse

No añadas líneas como:

```groovy
echo "$TOKEN_TEMPORAL"
```

```groovy
sh 'printenv'
```

```groovy
sh 'cat "$ARCHIVO_CREDENCIAL"'
```

Estas acciones pueden revelar secretos.

---

## Sesiones prácticas

Las sesiones utilizan valores ficticios y enseñan a reconocer las exposiciones más comunes.

### Preparación común

Antes de practicar:

- Utiliza una instancia Jenkins aislada o una carpeta de laboratorio.
- No uses una credencial real.
- No crees una clave válida.
- No utilices una cuenta cloud.
- No modifiques credenciales compartidas.
- No añadas secretos al repositorio.
- No compartas la consola sin revisarla.
- Sigue las instrucciones del docente.
- Elimina los datos de prueba al finalizar cuando corresponda.

### Sesión 1: clasificar información

**Objetivo:** distinguir datos públicos, internos y secretos.

Clasifica cada elemento como **público**, **interno** o **secreto**, según el contexto del curso:

```text
Nombre de un job
ID de credencial de Jenkins
Token de API
Ruta local del workspace
Clave privada SSH
Nombre de una carpeta de laboratorio
Estado de Terraform
Plan binario
URL de un repositorio público
URL de un repositorio privado
Versión de Terraform
Contraseña de una cuenta
Certificado público
Clave privada asociada al certificado
```

#### Preguntas

- ¿Puede un identificador revelar información interna?
- ¿Qué datos deberían omitirse de una captura?
- ¿Qué archivos pueden contener secretos aunque el nombre no lo indique?
- ¿Por qué el estado puede ser sensible?

#### Entregable

Entrega la clasificación y explica dos casos en los que la sensibilidad dependa del entorno.

### Sesión 2: dibujar el flujo de una credencial

**Objetivo:** identificar dónde puede aparecer un secreto durante una ejecución.

Dibuja:

```text
Almacén de credenciales
          |
          v
Jenkins
          |
          v
Agente
          |
          v
Proceso que necesita autenticación
          |
          +--> salida o logs
          +--> archivos temporales
          +--> artefactos
```

#### Preguntas

- ¿Quién puede administrar la credencial?
- ¿Qué job puede usarla?
- ¿Qué usuario puede cambiar el `Jenkinsfile`?
- ¿Qué ocurre si el agente conserva el workspace?
- ¿Qué registros deben revisarse?

### Sesión 3: inspeccionar un repositorio ficticio

**Objetivo:** identificar archivos que no deben confirmarse.

El docente proporciona un repositorio de ejemplo con archivos ficticios.

#### Instrucciones

1. Inspecciona los nombres de archivo.
2. Revisa el estado de Git.
3. Localiza estados, planes y archivos de variables.
4. No abras valores marcados como secretos.
5. Identifica patrones que debería cubrir `.gitignore`.
6. Documenta hallazgos sin copiar secretos.

#### Entregable

```text
Archivo sospechoso:
Motivo:
Acción recomendada:
¿Debe confirmarse?:
```

### Sesión 4: crear un `.gitignore`

**Objetivo:** excluir archivos locales sensibles o temporales.

Añade, para el ejercicio:

```gitignore
.env
.env.*
*.tfstate
*.tfstate.*
*.tfplan
*.pem
*.key
```

#### Instrucciones

1. Guarda el archivo.
2. Crea archivos de prueba sin secretos.
3. Comprueba el estado de Git.
4. Verifica qué archivos quedan ignorados.
5. Comprueba que los archivos fuente siguen visibles.
6. No crees claves reales para probar los patrones.

#### Preguntas

- ¿Qué evita `.gitignore`?
- ¿Qué no evita?
- ¿Qué pasa si el archivo ya estaba confirmado?
- ¿Qué otros controles hacen falta?

### Sesión 5: detectar un secreto ficticio antes del commit

**Objetivo:** revisar el staging.

#### Instrucciones

1. Añade un archivo de prueba con un marcador no utilizable.
2. Ejecuta `git status`.
3. Ejecuta `git diff --cached`.
4. Comprueba que el archivo no se añadirá.
5. Retira el archivo de prueba.
6. Explica por qué esta comprobación debe repetirse antes de cada commit.

### Sesión 6: crear una credencial ficticia en Jenkins

**Objetivo:** reconocer los campos de un almacén sin guardar valores reales.

Esta sesión requiere una instancia aislada o supervisión del docente.

#### Instrucciones

1. Abre la sección de credenciales.
2. Comprueba qué tipos están disponibles.
3. Crea, si el docente lo permite, una credencial con un marcador claramente ficticio.
4. Utiliza un identificador como `secreto-ficticio-lab`.
5. No uses una contraseña real ni un token válido.
6. Limita el ámbito a la carpeta de laboratorio.
7. Revisa qué roles pueden usarla.
8. Elimínala al terminar si así lo indica el curso.

### Sesión 7: comparar ámbitos de credenciales

**Objetivo:** comprender el efecto de global y carpeta.

#### Instrucciones

1. Consulta la documentación local de la instancia.
2. Distingue credencial global y credencial de carpeta.
3. Dibuja qué jobs podrían ver cada una.
4. Identifica el impacto de un acceso demasiado amplio.
5. No cambies credenciales existentes.
6. Presenta una recomendación de alcance mínimo.

### Sesión 8: usar un `withCredentials` de prueba

**Objetivo:** comprobar el flujo sin imprimir el valor.

Usa solo la credencial ficticia del ejercicio:

```groovy
pipeline {
    agent {
        label 'laboratorio'
    }

    stages {
        stage('Comprobar binding') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'secreto-ficticio-lab',
                        variable: 'VALOR_FICTICIO'
                    )
                ]) {
                    sh '''
                        set +x
                        test -n "$VALOR_FICTICIO"
                        echo "La variable ficticia está disponible."
                    '''
                }
            }
        }
    }
}
```

#### Instrucciones

1. Comprueba que el identificador coincide.
2. Ejecuta solo en el job de laboratorio.
3. Revisa la consola.
4. Confirma que el valor no aparece.
5. Elimina la credencial al terminar si lo indica el docente.

### Sesión 9: buscar interpolación insegura

**Objetivo:** reconocer patrones peligrosos en Pipeline.

Revisa:

```groovy
sh "herramienta --token ${TOKEN}"
```

#### Instrucciones

1. Explica qué hace Groovy antes de ejecutar `sh`.
2. Identifica dónde podría aparecer el valor.
3. Propón una estructura con `withCredentials`.
4. Evita probar con secretos reales.
5. Revisa la consola del ejemplo de laboratorio.

### Sesión 10: revisar una credencial de SCM

**Objetivo:** limitar el acceso al repositorio.

#### Escenario

Un job necesita clonar un repositorio privado.

#### Instrucciones

1. Determina si basta con acceso de lectura.
2. Identifica la credencial que debería proporcionar el administrador.
3. Revisa si el token tiene acceso a otros repositorios.
4. No pegues el token en la URL.
5. Describe cómo asociarías la credencial al job.
6. Indica cómo revocarías el acceso al terminar el curso.

### Sesión 11: comparar secreto de texto y archivo secreto

**Objetivo:** escoger el tipo de credencial según la integración.

#### Actividad

Completa:

```text
Tipo de secreto:
Herramienta que lo consume:
¿Necesita texto o archivo?:
¿Se crea archivo temporal?:
¿Puede quedar en el workspace?:
¿Se imprime en consola?:
Cómo se limita el acceso:
```

No crees archivos con credenciales reales.

### Sesión 12: observar el efecto de una variable

**Objetivo:** entender que las variables de entorno pueden ser sensibles.

#### Instrucciones

1. Usa una variable ficticia.
2. Comprueba que el job puede evaluar si está definida.
3. No imprimas su contenido.
4. Evita `env` y `printenv`.
5. Revisa la consola.
6. Explica qué mecanismos podrían leer la variable en el agente.

### Sesión 13: analizar estado y plan

**Objetivo:** clasificar artefactos de Terraform por sensibilidad potencial.

Clasifica:

```text
main.tf
variables.tf
terraform.tfvars
terraform.tfstate
terraform.tfstate.backup
.terraform.lock.hcl
.terraform/
plan.tfplan
salida legible del plan
```

#### Preguntas

- ¿Qué archivos suelen versionarse?
- ¿Cuáles pueden contener valores sensibles?
- ¿Qué debería quedar excluido?
- ¿Qué política define la retención?
- ¿Qué diferencias hay entre el lockfile y el estado?

### Sesión 14: revisar un log ficticio

**Objetivo:** practicar la revisión de logs antes de compartirlos.

El docente proporciona una consola de ejemplo con valores ficticios.

#### Instrucciones

1. Busca tokens, contraseñas o argumentos.
2. Busca URLs con parámetros.
3. Busca variables y rutas.
4. Busca IDs de recursos o cuentas.
5. Marca información que debería ocultarse.
6. Redacta una versión mínima útil para soporte.

### Sesión 15: simular una rotación

**Objetivo:** describir un cambio de credencial sin manejar un secreto real.

#### Escenario

Una credencial ficticia debe renovarse antes de caducar.

#### Instrucciones

Escribe un procedimiento con:

1. Persona responsable.
2. Aprobación.
3. Emisión del valor nuevo.
4. Actualización del almacén.
5. Prueba del job.
6. Revocación del valor anterior.
7. Revisión de logs.
8. Registro del cambio.

No generes un token funcional.

### Sesión 16: simular una revocación urgente

**Objetivo:** responder ante una credencial sospechosa.

#### Escenario

El equipo recibe una alerta de que una credencial de laboratorio puede haberse expuesto.

#### Instrucciones

1. Identifica quién debe ser notificado.
2. Prioriza la revocación.
3. Lista los jobs que podrían utilizarla.
4. Indica qué logs se revisarían.
5. Evita copiar el valor en el informe.
6. Describe cómo probar que la credencial ya no se utiliza.
7. Registra acciones sin incluir el secreto.

### Sesión 17: revisar ramas y credenciales

**Objetivo:** relacionar confianza del código con acceso a secretos.

#### Actividad

Compara:

- Rama protegida revisada.
- Pull request de una persona del equipo.
- Pull request externo.
- Job manual de producción.
- Job de validación sin credenciales.

Para cada caso, decide si debería recibir una credencial y justifica el alcance.

### Sesión 18: comprobar el agente

**Objetivo:** identificar riesgos del entorno que recibe una credencial.

#### Instrucciones

1. Averigua si el agente es compartido o dedicado.
2. Revisa si conserva workspaces.
3. Comprueba quién puede modificar jobs.
4. Identifica la política de limpieza.
5. No inspecciones procesos o archivos de otros jobs.
6. Presenta controles recomendados.

### Sesión 19: revisar credenciales de Terraform

**Objetivo:** separar validación, planificación y aplicación.

Clasifica qué tipo de acceso podría requerir cada etapa:

```text
terraform fmt
terraform validate
terraform init
terraform plan
terraform apply
```

#### Preguntas

- ¿Qué etapa puede no necesitar credenciales de proveedor?
- ¿Qué etapa puede consultar una API?
- ¿Qué etapa puede modificar recursos?
- ¿Por qué la identidad de `apply` debería tener permisos limitados?
- ¿Qué credenciales necesita un backend?

### Sesión 20: construir una política mínima

**Objetivo:** redactar reglas aplicables a una carpeta de laboratorio.

Incluye reglas para:

- Creación de credenciales.
- Ámbito.
- Tipos permitidos.
- Prohibición de secretos personales.
- Uso en pull requests.
- Logs.
- Artefactos.
- Rotación.
- Revocación.
- Retirada al finalizar el curso.

### Sesión 21: revisión por parejas

**Objetivo:** revisar un Pipeline sin revelar secretos.

La persona autora explica:

- Qué credencial utilizaría un job real.
- Qué paso la necesita.
- Qué permisos requiere.
- Qué usuarios pueden modificar el `Jenkinsfile`.
- Qué salida podría revelar el valor.
- Cómo se rota y revoca.

La persona revisora comprueba:

- No hay valores literales.
- No hay parámetros de texto para secretos.
- El binding tiene alcance pequeño.
- No se usa interpolación insegura.
- No se imprime el entorno completo.
- El job y la carpeta tienen permisos adecuados.
- No se archivan archivos sensibles.

### Sesión 22: proyecto integrador

**Objetivo:** entregar un diseño de credenciales para una pipeline ficticia.

#### Escenario

Una pipeline de laboratorio necesita:

- Leer un repositorio privado.
- Validar una configuración Terraform.
- Generar un plan de prueba.
- No aplicar cambios.

#### Requisitos de la propuesta

- Credencial de SCM con permisos mínimos.
- Sin credenciales cloud para validación local.
- Almacén de Jenkins definido.
- Ámbito de carpeta propuesto.
- Acceso para ramas no confiables definido.
- Logs y artefactos revisados.
- Rotación descrita.
- Respuesta ante filtración documentada.
- Ningún secreto funcional en la entrega.

#### Entrega

Incluye:

```text
Propósito:
Identidad:
Tipo de credencial:
Permisos:
Ámbito Jenkins:
Jobs autorizados:
Datos que pueden aparecer en logs:
Retención:
Rotación:
Revocación:
Respuesta a exposición:
```

---

## Respuesta a incidentes

Si un secreto puede haberse expuesto, actúa según la política del equipo y no intentes ocultar el incidente.

### Secreto expuesto en Git

1. No vuelvas a compartir el archivo.
2. Notifica al responsable.
3. Revoca o rota la credencial.
4. Determina qué permisos tenía.
5. Comprueba quién pudo acceder al repositorio.
6. Revisa ramas, forks, clones y copias.
7. Revisa logs y artefactos.
8. Elimina o depura el historial según el procedimiento aprobado.
9. Verifica que el secreto anterior ya no funciona.
10. Documenta el incidente sin incluir el valor.

### Secreto expuesto en Jenkins

Comprueba:

- Consola.
- Historial del job.
- Artefactos.
- Parámetros.
- Workspace.
- Logs del controlador.
- Logs del agente.
- Copias de seguridad.

Revoca primero el secreto afectado si el riesgo lo requiere.

### No confiar en borrado

Borrar una línea del log o un archivo no invalida una credencial.

Puede existir una copia en:

- Backups.
- Exportaciones.
- Descargas.
- Cachés.
- Replicas.
- Correo.
- Herramientas de búsqueda.

### Prioridades

La prioridad habitual es:

1. Evitar uso adicional.
2. Revocar o rotar.
3. Identificar alcance.
4. Revisar actividad.
5. Notificar al responsable.
6. Limpiar copias conforme a la política.
7. Mejorar controles.
8. Registrar decisiones.

La prioridad concreta la define el procedimiento de incidentes.

### No recopilar el secreto en el informe

No incluyas el valor expuesto en:

- Tickets.
- Mensajes.
- Capturas.
- Informes.
- Comentarios.
- Logs adicionales.

Usa un identificador de credencial o una referencia aprobada.

### Notificación

Avisa a:

- Administrador de Jenkins.
- Propietario de la credencial.
- Equipo de seguridad, si corresponde.
- Responsable del servicio afectado.
- Docente, en el entorno académico.

Sigue el canal oficial y comparte solo la información necesaria.

---

## Diagnóstico y errores frecuentes

### No encuentro la credencial

Comprueba:

- Identificador escrito correctamente.
- Carpeta del job.
- Ámbito.
- Permiso de uso.
- Tipo esperado por el plugin.
- Si la credencial fue retirada.

No cambies el identificador para adivinar credenciales.

### Jenkins no permite usarla

Comprueba:

- Permisos del usuario.
- Permisos de la carpeta.
- Tipo de binding.
- Plugin necesario.
- Alcance de la credencial.
- Configuración del job.

No copies el valor secreto a una variable literal como alternativa.

### La consola muestra el valor

Detén la publicación de la consola.

Sigue el procedimiento del equipo:

- Revoca o rota la credencial.
- Limita el acceso al log.
- Notifica al responsable.
- Revisa artefactos y copias.
- Corrige el pipeline.
- Valida que la salida ya no revela el valor.

No te limites a editar la captura.

### El enmascaramiento no funciona

El enmascaramiento depende de la forma exacta del valor y del contenido de salida.

Comprueba si el valor fue transformado, fragmentado o codificado.

Trata la credencial como expuesta y sigue el procedimiento de respuesta.

### Variable no definida

Comprueba:

- `credentialsId`.
- Nombre de variable.
- Tipo de credencial.
- Alcance de `withCredentials`.
- Sintaxis.
- Plugin instalado.
- Permiso de uso.

No ejecutes `env` para buscarla.

### Error de autenticación

Comprueba sin revelar el valor:

- Caducidad.
- Revocación.
- Permisos.
- Identidad.
- Entorno.
- Endpoint.
- Reloj del sistema, si afecta certificados.
- Restricciones de red.
- Asociación de la credencial.

### Error tras una rotación

Comprueba:

- Que Jenkins tiene el valor nuevo.
- Que el job usa el identificador correcto.
- Que el sistema destino acepta la credencial.
- Que el valor anterior se revocó en el momento previsto.
- Que otros jobs no dependían de la credencial.

### El job funciona en una rama y no en otra

Comprueba:

- Permisos de la rama.
- Credenciales disponibles para esa carpeta.
- Configuración del multibranch.
- Confianza del pull request.
- Reglas de protección.
- Agente seleccionado.

No amplíes acceso a secretos para hacer pasar una rama no confiable.

### Terraform solicita credenciales inesperadas

Detén el job.

Comprueba:

- Backend.
- Proveedor.
- Variables.
- Perfil activo.
- Directorio de trabajo.
- Archivos `.tf`.
- `terraform init`.
- Credenciales heredadas del agente.

No introduzcas credenciales reales sin confirmar el contexto.

### Estado o plan en un artefacto

Restringe el acceso según la política y avisa al responsable.

Evalúa:

- Qué contiene.
- Quién pudo acceder.
- Cuánto tiempo estuvo disponible.
- Si hay credenciales derivadas.
- Si se requiere rotación.
- Cómo eliminar copias retenidas.

### Git detecta un secreto

No ignores automáticamente el resultado.

Comprueba el hallazgo con el responsable, sin copiar el valor a un canal inseguro.

Si es real, trata la credencial como expuesta.

### Ficha de diagnóstico

```text
Job o repositorio:
Identidad del job o repositorio:
Entorno:
Identificador de credencial (nunca el valor):
Tipo de dato expuesto:
Dónde apareció:
Quién pudo acceder:
Acción inmediata:
Revocación o rotación:
Verificaciones realizadas:
Responsable notificado:
Próximo paso:
```

### Distinguir hechos de hipótesis

Registra por separado lo que se observó y lo que todavía debe confirmarse.

```text
Hecho:
La consola del build muestra un fragmento de un valor que parece ser un token.

Hipótesis:
El valor podría corresponder a una credencial activa.

Comprobación:
El propietario de la credencial verifica el identificador en el almacén y
confirma su estado sin copiar el valor al informe.
```

No afirmes que una credencial está revocada hasta que el responsable lo haya comprobado.

---

## Checklist de seguridad

Utiliza esta lista antes de integrar una credencial con un job.

### Almacenamiento

- [ ] La credencial se guarda en un almacén aprobado.
- [ ] No aparece en archivos `.tf`, `Jenkinsfile` ni scripts.
- [ ] No aparece en archivos de variables versionados.
- [ ] No aparece en Git, capturas, tickets o documentación.
- [ ] El identificador no contiene el valor secreto.
- [ ] El propietario y el propósito están definidos.
- [ ] La duración y la rotación están documentadas.

### Acceso

- [ ] La credencial concede únicamente los permisos necesarios.
- [ ] El alcance coincide con el proyecto y el entorno.
- [ ] El job puede usarla solo cuando corresponde.
- [ ] Las ramas no confiables no reciben acceso.
- [ ] Los usuarios autorizados están identificados.
- [ ] La identidad es distinta de una cuenta personal, cuando corresponde.
- [ ] La credencial de lectura no tiene permisos de escritura innecesarios.

### Uso en Jenkins

- [ ] El binding existe solo durante los pasos que lo necesitan.
- [ ] El pipeline no interpola el secreto en Groovy.
- [ ] No se ejecutan `env`, `printenv` ni equivalentes con secretos presentes.
- [ ] No se activa trazado de comandos en el bloque sensible.
- [ ] Los argumentos no exponen el valor.
- [ ] Los archivos temporales se manejan según la política.
- [ ] El job no archiva archivos de credenciales.
- [ ] El agente tiene el aislamiento requerido.

### Terraform

- [ ] La validación local no recibe credenciales de proveedor innecesarias.
- [ ] El backend está identificado y autorizado.
- [ ] El estado se almacena en el lugar aprobado.
- [ ] Los planes se tratan como potencialmente sensibles.
- [ ] Las salidas no muestran secretos.
- [ ] Las variables sensibles no se consideran automáticamente protegidas.
- [ ] No se ejecuta `apply` sin un flujo autorizado.

### Respuesta

- [ ] Existe un responsable de la credencial.
- [ ] Se sabe cómo revocarla.
- [ ] Se sabe cómo rotarla.
- [ ] Los incidentes se comunican por el canal establecido.
- [ ] El informe no contiene el valor expuesto.
- [ ] Se revisan logs y artefactos después de una exposición.
- [ ] La rotación se verifica sin revelar el valor.

---

## Rúbrica de evaluación

La evaluación mide comprensión, prevención y capacidad de respuesta. No se premia haber manipulado secretos reales.

| Criterio | Inicial | Adecuado | Avanzado |
|---|---|---|---|
| Clasificación | Confunde identificadores con secretos | Reconoce los tipos principales | Explica cómo cambia la sensibilidad según el contexto |
| Almacenamiento | Propone guardar el valor en el código | Usa un almacén aprobado | Justifica almacenamiento, ámbito y ciclo de vida |
| Permisos | Asigna permisos amplios | Aplica permisos necesarios | Separa identidades por operación y entorno |
| Pipeline | Imprime o amplía el alcance del secreto | Usa un binding limitado | Explica riesgos de código, agente, logs y ramas |
| Terraform | Considera `sensitive` una protección completa | Reconoce riesgos de estado y planes | Describe controles para estado, backend y planes |
| Repositorio | Confía solo en `.gitignore` | Revisa staging y diffs | Distingue prevención, detección, revocación y limpieza |
| Incidentes | Intenta borrar la evidencia | Notifica y rota según el procedimiento | Prioriza revocación, alcance, registros y mejora |
| Documentación | Incluye valores o datos innecesarios | Registra identificadores y acciones | Presenta evidencia útil sin ampliar la exposición |

### Evidencias mínimas

La entrega debe incluir:

- Clasificación de datos de la sesión 1.
- Diagrama del flujo de una credencial.
- `.gitignore` de laboratorio revisado.
- Ejemplo de pipeline con valores ficticios.
- Revisión de una consola ficticia.
- Procedimiento de rotación.
- Procedimiento de respuesta ante exposición.
- Diseño de permisos para el proyecto integrador.
- Confirmación explícita de que no se utilizaron credenciales reales.

### Preguntas de evaluación

1. ¿Qué diferencia hay entre identificador, identidad, autenticación y autorización?
2. ¿Por qué un secreto puede quedar expuesto aunque no se imprima directamente?
3. ¿Qué protege y qué no protege el almacén de credenciales de Jenkins?
4. ¿Por qué el enmascaramiento de consola no es una garantía de seguridad?
5. ¿Qué riesgos introduce la interpolación de Groovy en un comando?
6. ¿Por qué no se deben usar parámetros de texto corrientes para contraseñas?
7. ¿Qué diferencia hay entre una credencial de lectura y una de aplicación?
8. ¿Qué permisos necesita un job que solo obtiene código de Git?
9. ¿Qué puede contener el estado de Terraform?
10. ¿Por qué un plan guardado se trata como potencialmente sensible?
11. ¿Qué protege `.gitignore` y qué no protege?
12. Si se confirma un token por error, ¿cuál es la prioridad?
13. ¿Por qué borrar el archivo del último commit no basta?
14. ¿Qué riesgos se deben revisar en un agente Jenkins compartido?
15. ¿Por qué una rama de pull request no confiable no debería recibir secretos?
16. ¿Qué ventaja puede ofrecer una credencial de corta duración?
17. ¿Qué debe registrarse durante una rotación sin guardar el valor?
18. ¿Qué parte de una operación de Terraform podría requerir credenciales?
19. ¿Por qué una variable marcada como `sensitive` no es un almacén de secretos?
20. ¿Qué información debe incluir un informe de exposición?

---

## Glosario

- **Almacén de credenciales:** sistema autorizado para almacenar y entregar credenciales a usuarios o procesos.
- **Autenticación:** proceso que comprueba la identidad de una persona o servicio.
- **Autorización:** definición de las acciones permitidas para una identidad.
- **Agente Jenkins:** nodo que ejecuta los pasos de una pipeline.
- **Ámbito:** límite que determina qué usuarios, carpetas o jobs pueden utilizar una credencial.
- **Binding:** mecanismo de Jenkins que pone una credencial a disposición de un paso del Pipeline.
- **Backend:** mecanismo donde Terraform guarda el estado.
- **Certificado:** documento digital utilizado, entre otros fines, para identificar o autenticar un sistema.
- **Credencial:** dato o mecanismo que permite demostrar identidad o acceder a un servicio.
- **Credencial temporal:** credencial válida durante una sesión o período limitado.
- **Identidad:** persona, proceso o servicio que solicita acceso.
- **Identidad federada:** identidad cuyo acceso se establece mediante una relación de confianza entre sistemas.
- **Identificador de credencial:** nombre que permite seleccionar una credencial en Jenkins; no es el secreto.
- **Jenkinsfile:** archivo que define los pasos de una pipeline.
- **Clave privada:** parte de una clave criptográfica que debe mantenerse protegida.
- **Clave pública:** parte que puede distribuirse según el diseño de autenticación.
- **Mínimo privilegio:** principio que limita los permisos a los necesarios para una tarea.
- **Plan de Terraform:** representación de los cambios que Terraform prevé realizar.
- **Rotación:** sustitución de una credencial por otra nueva.
- **Revocación:** acción que invalida o retira una credencial.
- **Secreto:** dato cuyo acceso no autorizado puede permitir suplantación o uso indebido.
- **Token:** valor que permite autenticar o autorizar una operación en un sistema.
- **`withCredentials`:** paso de Jenkins Pipeline que vincula una credencial a un bloque de ejecución.
- **`sensitive`:** atributo de Terraform que ayuda a ocultar ciertos valores en algunas salidas; no garantiza que desaparezcan del estado.
- **Estado de Terraform:** registro que relaciona configuración y recursos gestionados.
- **Workspace:** directorio de trabajo de una ejecución Jenkins.
- **`gitignore`:** archivo que indica a Git qué patrones no debe incluir por defecto.
- **Exposición:** divulgación de una credencial a usuarios, sistemas o ubicaciones que no deberían acceder a ella.
- **Trazabilidad:** capacidad de relacionar una acción con una identidad, un job y un cambio.
- **Pull request no confiable:** propuesta de código cuyo origen o contenido no ha sido aprobado para acceder a secretos.
- **Artefacto:** archivo conservado por Jenkins como resultado de un build.
- **Mínimo alcance:** restricción de una credencial al servicio, job, entorno u operación requeridos.
- **Gestor de secretos:** sistema especializado en custodiar, entregar, auditar y, en algunos casos, rotar secretos.

---

## Plantilla de diseño de credenciales

Completa esta ficha para cada credencial propuesta, sin escribir su valor.

```text
Nombre identificador:
Propósito:
Sistema de destino:
Tipo:
Propietario:
Entorno:
Permisos necesarios:
Jobs autorizados:
Carpetas autorizadas:
Ramas autorizadas:
Método de entrega:
Duración:
Fecha de revisión:
Procedimiento de rotación:
Procedimiento de revocación:
Datos que podrían aparecer en logs:
Controles de acceso:
```

Si no puedes identificar un propietario, propósito o método de revocación, la credencial no está lista para incorporarse a una pipeline.

---

## Síntesis final

Una credencial debe estar protegida durante todo su ciclo de vida, no solo mientras se guarda en un almacén.

- Guarda los secretos únicamente en sistemas aprobados.
- Separa el identificador del valor secreto.
- Aplica el principio de mínimo privilegio.
- Limita el uso a jobs, carpetas, ramas y entornos autorizados.
- No escribas secretos en el código, Git, parámetros corrientes o logs.
- Usa bindings de alcance reducido y evita interpolar secretos en comandos.
- No confíes exclusivamente en el enmascaramiento de Jenkins.
- Trata el estado y los planes de Terraform como información potencialmente sensible.
- No consideres `sensitive = true` un sustituto de un gestor de secretos.
- Rota y revoca las credenciales mediante un procedimiento documentado.
- Si un secreto se expone, prioriza su revocación y notifica al responsable.
- Practica con valores ficticios; no uses credenciales reales para completar esta guía.