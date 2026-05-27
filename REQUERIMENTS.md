# Atomic Goals

## Descripcion general

Herramienta de software para la productividad

# El problema

A la hora de completar objetivos, siempre es bueno tener una herramienta que tenga registrado cuales son todas las metas que se quieren cumplir. Esas metas para lograrlas hay que dividirlas en pequeñas tareas o pasos, para luego tener datos que permitan saber cual es el progreso de cada meta. Estadisticas y analiticas.

## Requerimientos funcionales

### Auth

1. Un usuario puede crear su cuenta
2. Un usuario puede inciar sesión
3. un usuario puede cerrar sesión

### Categoria

1. Un usuario puede crear varias categorias
2. Un usuario puede borrar una categoria
3. Un usuario puede actualizar los datos de una categoria
4. Un usuario puede ver sus categorias

### Metas

1. Un usuario puede crear varias metas
2. Un usuario puede borrar una meta
3. Un usuario puede actualizar los datos de una meta
4. Un usuario puede ver sus metas

### Pasos

1. Un usuario puede crear un paso asociado a una meta
2. Un usuario puede actualizar los datos de un paso
3. Un usuario puede borrar un paso
4. Un usuario puede ver sus pasos y el progreso

### Dashbord

### Definicion de requerimientos funcionales

1. Una catefgoria puede contener varias metas ejemplo (Trabajo, Desarrollo personal, Finanzas). Funcionan como workspaces.
2. Una meta debe tener un nombre, descripcion y debe contener varios pasos para poder cumplirse, las metas pueden ser ciclicas (cada 1 mes, cada 1 año, ejemplo "lectura mensual" ) o puede ser conclusiva (se completa un a sola vez, ejemplo "crear mi landing page"). El porcentaje de progreso de la meta es determinado por los pasos
3. los pasos debe tener un titulo, puede tener una descripcion, y un progreso este progreso puede ser reprentado de varias formas
   1. Barra de progreso
   2. Check para que sea Por hacer y finalizado
   3. Status, se pueden crear diferentes status y asignarle un porcentaja a cada estatus
   4. Un contador, se puede crear un numero maximo y anadirle cantidad o restarle cantidad ( por ejemplo para un ahorro, o la lectura de un libro e inidicar que pagina se va)
4. Se puede poner tiempo que toma una tarea o paso y fecha de inicio y fin para luego poder llevar un cronograma

## Tecnologías

### Frontend

1. Nextjs
2. React-hook-form
3. Zustand

### Backend

1. NestJS
2. TypeORM
3. JWT

### DB

1. Postgres
2. Docker
