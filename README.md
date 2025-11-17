# Local Area App

This project implements a basic community posting platform where users can register with their neighbourhood (area), create posts automatically tagged with their area, and view a feed of posts only from their selected neighbourhood.

## Features

- **User registration and login** with area selection.
- **Area-specific feed**: users only see posts from others in the same area.
- **Post creation**: posts are auto‑tagged with the user’s area and limited to simple categories (issue, event, recommendation, general).
- **Upvote/downvote system** (database schema provided; backend logic included).
- **Session management** using cookies (in‑memory store; use a persistent store in production).
- **Flash messages** for simple error handling.
- **Bootstrap styling** for responsive UI.

## Technology stack

- Node.js with Express framework
- MySQL (via `mysql2` library)
- EJS templates for server‑side rendering
- Bootstrap 5 for styling

## Project structure

```
local_area_app/
├── db/
│   └── schema.sql           # SQL script to create and seed the database
├── public/
│   └── css/
│       └── styles.css      # Custom CSS overrides
├── src/
│   ├── app.js             # Express entry point
│   ├── config/
│   │   └── db.js          # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── area.js
│   │   ├── post.js
│   │   ├── user.js
│   │   └── vote.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   └── views/
│       ├── 404.ejs
│       ├── index.ejs
│       ├── auth/
│       │   ├── login.ejs
│       │   └── register.ejs
│       ├── partials/
│       │   ├── footer.ejs
│       │   └── header.ejs
│       └── posts/
│           └── new.ejs
└── README.md
```

## Setup instructions

1. **Create a MySQL database:**
   
   ```sql
   CREATE DATABASE local_area_db;
   ```

2. **Run the SQL schema script** to create tables and seed initial areas:
   
   ```sh
   mysql -u your_user -p local_area_db < db/schema.sql
   ```

3. **Install dependencies** (requires internet access):

   ```sh
   cd local_area_app
   npm install express ejs mysql2 express-session body-parser bcryptjs connect-flash
   ```

4. **Configure database credentials and session secret:**

   Create a `.env` file based on the provided `.env.example` and adjust values for your environment. The application reads configuration from this file using `process.env`.

   Example `.env`:

   ```env
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=change_this_secret

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=local_area_db

   # CORS_ORIGIN and JWT settings are optional
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=replace_with_a_long_random_string
   JWT_EXPIRES_IN=2d
   ```

5. **Start the server:**

   ```sh
   node src/app.js
   ```

6. **Navigate to `http://localhost:3000`** to access the application.

## Notes on architecture

This project follows a simple separation of concerns:

- **Routes** define the endpoints and delegate to controllers.
- **Controllers** contain the business logic and interact with models.
- **Models** encapsulate database access, abstracting SQL queries away from controllers.
- **Views** (EJS templates) handle UI rendering and include partials for header and footer.
- **Middleware** attaches the current user to the response locals so that templates can easily access authentication state.

The code aims to be modular and easy to extend. For example, you could replace the in‑memory session store with `express‑mysql‑session` by installing it and configuring it in `src/app.js`.
