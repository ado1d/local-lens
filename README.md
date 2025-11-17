# LocalLens

This project implements a basic community posting platform where users can register with their neighbourhood (area), create posts automatically tagged with their area, and view a feed of posts only from their selected neighbourhood.

## Technology stack

- Node.js with Express framework
- MySQL (via `mysql2` library)
- EJS templates for server‑side rendering
- Bootstrap 5 for styling

## Setup instruction

1. **Install dependencies** :

   ```sh
   cd local_area_app
   npm install express ejs mysql2 express-session body-parser bcryptjs connect-flash 
   ```

2. **Configure database credentials and session secret:**

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
   DB_NAME=locallensforum

   # CORS_ORIGIN and JWT settings are optional
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=replace_with_a_long_random_string
   JWT_EXPIRES_IN=2d
   ```

3. **Start the server:**

   ```sh
   node src/app.js
   ```

   ***Start development Server (Do this to test feature live)***
   ```sh
   nodemon src/app.js
   ```
   ***Or***
   ```sh
      npm run okk
   ```

4. **Navigate to `http://localhost:3000`** to access the application.

## Notes on architecture

follows MVC arch

- **Routes** define the endpoints and delegate to controllers.
- **Controllers** contain the business logic and interact with models.
- **Models** encapsulate database access, abstracting SQL queries away from controllers.
- **Views** (EJS templates) handle UI rendering and include partials for header and footer.
- **Middleware** attaches the current user to the response locals so that templates can easily access authentication state.
