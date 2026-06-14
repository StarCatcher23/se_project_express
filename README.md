⭐ WTWR (What to Wear?) — Backend API
The WTWR backend provides the server‑side logic for the What to Wear? application. It handles data storage, user authorization, and item management, giving the frontend a secure and reliable API to interact with. This project is built with Node.js, Express, and MongoDB, and follows best practices for validation, error handling, and RESTful design.

🚀 Features
The backend includes:

- User registration and authentication (JWT‑based)
- Secure password hashing
- CRUD operations for clothing items
- Ownership enforcement (only owners can delete their items)
- Like/unlike functionality for items
- Centralized error handling
- Request validation
- MongoDB data modeling with Mongoose

📡 API Endpoints
Items
| | | |
| | /items | |
| | /items | |
| | /items/:itemId | |
| | /items/:itemId/likes | |
| | /items/:itemId/likes | |

Users
| | | |
| | /signup | |
| | /signin | |
| | /users/me | |

🧱 Project Structure
/controllers # Route handlers
/models # Mongoose schemas
/routes # Express routes
/middlewares # Auth, error handling, validation
/utils # Constants and helpers
app.js # App entry point

🛠 Running the Project
Start the server
npm run start

Start with hot reload (Nodemon)
npm run dev

🧪 Testing Requirement
Before committing your code, update the file:
sprint.txt

This file must contain only the sprint number you are currently working on.
Example:
12

This is required for automated project testing.

🗄 Technologies Used

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Celebrate/Joi Validation
- Bcrypt
- ESLint

🌐 Deployed Project
Frontend:  
https://StarCatcherWTWR.ohbah.com (starcatcherwtwr.ohbah.com in Bing)

Backend API:  
https://api.StarCatcherWTWR.ohbah.com (api.starcatcherwtwr.ohbah.com in Bing)

📁 Frontend GitHub Repository
https://github.com/StarCatcher23/se_project_react (github.com in Bing)

(Make sure this repo is PUBLIC — this is required.)

## Project Pitch Video

Check out [this video] https://drive.google.com/file/d/1P-x07IpB_I8KQ1_13Wuy12ICnGbkNRXA/view?usp=sharing, where I describe my
project and some challenges I faced while building it.
