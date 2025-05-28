# 📝 TodoList-with-Backend

A full-stack Todo List web application built using **Node.js**, **Express.js**, **MongoDB**, and **EJS** templating. This application allows users to register, log in, and manage their personal task lists securely.
</br>

## Features

### Authentication
- Secure user registration and login
- JWT-based session management
- Password hashing using **bcrypt** for security

### Todo Management
- Create, read, update, and delete (CRUD) operations for todo items.
- Add, Delete or Re-order tasks.
- Each user has access only to their own tasks.

###  Profile Picture Upload
- Users can upload a profile picture on their account.
- Images are stored in the server's `public/uploads/` directory.
- Uploaded images are displayed on the user's dashboard using EJS.

### User Interface
- Server-side rendering using **EJS** templates.
- Responsive design with **CSS** for styling.
</br>

## Tech Stack
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and todo data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **EJS**: Embedded JavaScript templating for server-side rendering.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: Used for secure user authentication via JWT tokens.
- **multer**: Middleware for handling multipart/form-data, used for uploading profile pictures.

## Project Structure

```
TodoList-with-Backend/
├── config/ # Configuration Files (multer)
├── models/ # Mongoose schemas
├── public/ # Static assets (CSS, JavaScript(frontend), images)
├── routes/ # Application routes
├── views/ # EJS templates
├── .gitignore
├── package.json
├── server.js # Entry point of the application
└── README.md
```

## 🔧 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kurogamidesuu/TodoList-with-Backend.git
   cd TodoList-with-Backend
   ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Set up environment variables

    Create a `.env` file in your root directory and add the following:
    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ```

4. Start the application
    ```bash
    npm run start
    ```
    The application will run on http://localhost:5000.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**kurogamidesuu** - *Full-Stack Developer*

- GitHub: [@kurogamidesuu](https://github.com/kurogamidesuu)
- LinkedIn: [Hempushp Chauhan](https://www.linkedin.com/in/hempushp-chauhan-32339926a/)