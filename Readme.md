# Project Title

Real-time Web Application with Express, MongoDB, and Socket.IO

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Socket.IO Events](#socketio-events)
- [Database](#database)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a real-time web application built using Node.js, Express, MongoDB, and Socket.IO. The application allows users to interact with a web interface, submit forms, and receive real-time updates. It also includes a leaderboard feature that ranks users based on their scores.

## Installation

1. Set up MongoDB:

    Make sure you have a MongoDB instance running and update the MongoDB connection string in the code if necessary.
2. Start the server:

    ```sh
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Usage

Once the server is running, you can access the following features:

- Visit `http://localhost:3000` for the home page.
- Use the `/form` route to submit forms.
- Check user information at `/users`.
- Test various functionalities at `/test`.

## Routes

### `GET /`

Renders the home page.

### `GET /form`

Renders the form submission page.

### `POST /form`

Handles form submission.

### `GET /users`

Displays user information.

### `GET /test`

Provides a test page for various functionalities.

## Socket.IO Events

### `connection`

Triggered when a new user connects.

### `answer`

- **Description**: Listens for answers submitted by clients and saves them to MongoDB.
- **Data**: `{ userId, username, score, ... }`
- **Response**: Emits the saved answer back to the client.

### `requestLeaderboard`

- **Description**: Listens for requests to fetch the leaderboard.
- **Response**: Emits the top 10 users sorted by their latest scores.

### `disconnect`

Triggered when a user disconnects.

## Database

The application uses MongoDB to store user data and form submissions. Ensure your MongoDB instance is configured correctly and the connection string is updated in the code.

## Error Handling

The application includes basic error handling:

- 404 errors are caught and forwarded to an error handler.
- The error handler sets local error messages and renders an error page.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
