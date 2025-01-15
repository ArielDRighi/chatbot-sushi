# Chatbot para Pedir Sushi

Este proyecto es un chatbot que ayuda a la gente a pedir sushi. Está desarrollado utilizando Node.js para el backend, MongoDB para guardar productos y pedidos, y React para una interfaz simple de prueba.

## Requisitos

- Node.js
- MongoDB
- React

## Instalación

1. Clona el repositorio:

```bash
 git clone https://github.com/ArielDRighi/chatbot-sushi.git
 cd chatbot-sushi
```

2. Renombra el archivo [.env.example](http://_vscodecontentref_/1) a [.env](http://_vscodecontentref_/2) y llena las variables de entorno con tus propios valores:

```bash
 MONGO_URI=yourMongoDBUri
 JWT_SECRET=yourSecretKey
```

3. Instala las dependencias:

```bash
 npm install
```

4. Carga los datos iniciales en la base de datos:

```bash
 npx ts-node src/populate-database.ts (desde /backend)
```

### Usuario inyectado a la base de datos:

- Email: "ariel.righi@example.com"
- Password: "password123"

5. Inicia el servidor:

```bash
 npm run start:dev (/backend/src)
```

6. Inicia la aplicacion:

```bash
 npm start (/frontend/src)
```

## Ejemplos de Mensajes que Entiende el Bot

- "Mostrar menú"
- "Quiero hacer un pedido"
- "¿Están abiertos?"
- "Estado de mi orden"
- "Ayuda"
- "Hola"
- "Gracias"
- "Adios"

## Endpoints Disponibles

### Autenticación

- `POST /auth/signup`: Registrar un nuevo usuario.

  - Body:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "role": "customer"
    }
    ```

- `POST /auth/signin`: Iniciar sesión.
  - Body:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

### Chatbot

- `POST /chatbot`: Manejar mensajes del chatbot.
  - Body:
    ```json
    {
      "message": "Quiero 2 sushi de salmón"
    }
    ```

### Menú

- `GET /menu`: Obtener todos los ítems del menú.
- `GET /menu/:id`: Obtener un ítem del menú por ID.
- `POST /menu`: Crear un nuevo ítem del menú.
  - Body:
    ```json
    {
      "name": "Sushi de Salmón",
      "description": "Delicioso sushi de salmón",
      "price": 10.99,
      "available": true
    }
    ```
- `PUT /menu/:id`: Actualizar un ítem del menú por ID.
  - Body:
    ```json
    {
      "name": "Sushi de Salmón",
      "description": "Delicioso sushi de salmón",
      "price": 10.99,
      "available": true
    }
    ```
- `DELETE /menu/:id`: Eliminar un ítem del menú por ID.

### Órdenes

- `POST /orders`: Crear una nueva orden.
  - Body:
    ```json
    {
      "customerName": "John Doe",
      "items": [
        {
          "productId": "60d21b4667d0d8992e610c85",
          "quantity": 2
        }
      ],
      "userId": "60d21b4667d0d8992e610c85",
      "total": 21.98
    }
    ```
- `GET /orders`: Obtener todas las órdenes.
- `GET /orders/:id`: Obtener una orden por ID.
- `PUT /orders/:id`: Actualizar una orden por ID.
  - Body:
    ```json
    {
      "customerName": "John Doe",
      "items": [
        {
          "productId": "60d21b4667d0d8992e610c85",
          "quantity": 2
        }
      ],
      "total": 21.98
    }
    ```
- `DELETE /orders/:id`: Eliminar una orden por ID.
- `DELETE /orders/:id/cancel`: Cancelar una orden por ID.

### Usuarios

- `POST /users`: Crear un nuevo usuario.
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- `GET /users`: Obtener todos los usuarios.
- `GET /users/:id`: Obtener un usuario por ID.
- `PUT /users/:id`: Actualizar un usuario por ID.
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
  - `DELETE /users/:id`: Eliminar un usuario por ID.

## Documentación de la API

La API está configurada con Swagger. Puedes acceder a la documentación interactiva de la API en [http://localhost:3000/api](http://localhost:3000/api).

## Base de Datos

### Cómo Cargar los Datos Iniciales

Para cargar los datos iniciales en la base de datos, ejecuta el siguiente comando desde /backend:

```bash
npx ts-node src/populate-database.ts
```

Para eliminar todos los datos de la base de datos, ejecuta el siguiente comando desde /backend:

```bash
npx ts-node src/clear-database.ts
```

# Ejecución de Tests

Para ejecutar los tests, utiliza el siguiente comando:

```bash
npm test
```

Casos que Analiza Backend

## AuthService:

- signup: Verifica el registro exitoso de un usuario, manejo de errores cuando el email ya está registrado y manejo de errores inesperados.
- signin: Verifica el inicio de sesión exitoso, manejo de errores cuando la contraseña es incorrecta y manejo de errores cuando el usuario no tiene una contraseña definida.

## UserService:

- findOneByEmail: Verifica la obtención de un usuario por email, manejo de errores cuando no se encuentra el usuario y manejo de errores inesperados.
- findOneById: Verifica la obtención de un usuario por ID y manejo de errores cuando no se encuentra el usuario.
- update: Verifica la actualización de un usuario por ID y manejo de errores inesperados.
- delete: Verifica la eliminación de un usuario por ID y manejo de errores cuando no se encuentra el usuario.
- getAllUsers: Verifica la obtención de todos los usuarios.

## OrderService:

- create: Verifica la creación de una orden, manejo de errores cuando no se encuentra un ítem del menú y manejo de errores inesperados.
- getAllOrders: Verifica la obtención de todas las órdenes.
- getOrderById: Verifica la obtención de una orden por ID y manejo de errores cuando no se encuentra la orden.
- updateOrder: Verifica la actualización de una orden por ID y manejo de errores cuando no se encuentra un ítem del menú.
- deleteOrder: Verifica la eliminación de una orden por ID y manejo de errores cuando no se encuentra la orden.

## MenuService:

- getAllItems: Verifica la obtención de todos los ítems del menú.
- create: Verifica la creación de un ítem del menú y manejo de errores inesperados.
- update: Verifica la actualización de un ítem del menú por ID y manejo de errores inesperados.
- delete: Verifica la eliminación de un ítem del menú por ID y manejo de errores inesperados.
