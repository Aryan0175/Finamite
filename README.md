# Client Task Management Web Application 🚀

## 📖 Project Overview
The Client Task Management Web Application is a full-stack solution designed to help users efficiently track, manage, and organize their daily tasks. Built with modern web development practices, it features secure user authentication, real-time task analytics, debounced search functionality, and a highly responsive user interface.

**Key Features Implemented:**
- **Secure User Authentication:** Registration and Login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Task Management (CRUD):** Create, Read, Update, and Delete tasks seamlessly without page reloads (AJAX/Fetch).
- **Dashboard Analytics:** Real-time summary displaying Total, Pending, and Completed tasks.
- **Smart Search & Filters:** Filter tasks by status and search by title/description using an optimized *Debouncing* algorithm.
- **Overdue Task Indicator (Bonus):** Automatically highlights pending tasks whose due dates have passed in red.
- **Isolated User Environment:** Users can only view and manage their own tasks.

---

## 💻 Technology Stack Used

### Front-End
* **React.js** (Vite Build Tool)
* **Tailwind CSS** (For responsive and modern UI styling)
* **Lucide React** (For SVG Icons)
* **React Router DOM** (For client-side routing)

### Back-End
* **Node.js & Express.js** (RESTful API architecture)
* **Mongoose** (ODM for database modeling)

### Database
* **MongoDB** (NoSQL Database for flexible schema management)

### Security
* **Bcrypt.js** (For securely hashing user passwords)
* **JSON Web Token (JWT)** (For secure API endpoint protection)
* **CORS** (Cross-Origin Resource Sharing protection)

---

## ⚙️ Installation & Setup Steps

Follow these steps to run the application on your local machine.

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Aryan0175/Finamite.git
cd client-task-management-app
\`\`\`

### 2. Back-End Setup
Open a terminal and navigate to the backend folder:
\`\`\`bash
cd backend
npm install
\`\`\`

**Database & Environment Setup:**
Create a `.env` file in the `backend` folder and add the following variables:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
\`\`\`
*Start the backend server:*
\`\`\`bash
npm start
# OR using nodemon
npm run dev
\`\`\`

### 3. Front-End Setup
Open a new terminal and navigate to the frontend folder:
\`\`\`bash
cd frontend
npm install
\`\`\`

**Environment Setup:**
Create a `.env` file in the `frontend` folder and add your backend API URL:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`
*Start the frontend development server:*
\`\`\`bash
npm run dev
\`\`\`

---

## 🔐 Login Credentials (Demo Account)
If you wish to test the application without registering a new account, you can use the following demo credentials:

* **Email:** `finamite@gmail.com.com`
* **Password:** `FINAMITE@1234`



---

## 📌 Assumptions or Limitations
1. **Timezone:** The due date comparison for the "Overdue Indicator" is based on the user's local browser timezone.
2. **Session Management:** The JWT token is stored in the browser's `localStorage`. For a production-grade application, moving this to `HttpOnly` cookies would be recommended for enhanced XSS protection.
3. **Data Deletion:** Deleting a task is a hard delete (permanent removal from the database). Soft deletion is not implemented in this scope.
4. **Attachments:** Currently, the application supports text-based descriptions. File attachments or image uploads are not supported in this version.