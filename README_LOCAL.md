# 🛠️ Omnicycle: Localhost Setup Guide
### How to run INDUSTRIAL-CMS-PRO on your local machine

This guide explains how to get the MERN microservices architecture running locally using your original port configuration (**5001-5005**).

---

## 🚀 Step 1: Backend Infrastructure
Before starting the frontend, ensure your backend services are active.

1.  **Start Docker Containers:**
    ```bash
    docker-compose up -d
    ```
2.  **Verify Redis & MongoDB:** Ensure ports `6379` (Redis) and `27017` (MongoDB) are open.

---

## 💻 Step 2: Frontend Localhost Start
Navigate to the frontend directory to launch the React UI.

1.  **Enter Directory:**
    ```bash
    cd frontend
    ```
2.  **Install Packages:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm start
    ```
    *The app will automatically open at: **http://localhost:3000***

---

## 🔑 Step 3: Local Admin Login
Use these credentials to bypass the Auth Gate on your local host:

* **Email:** `admin@icms.com`
* **Password:** `password123`

---

## 📁 Local Logic Map
| Feature | Logic Location |
| :--- | :--- |
| **API Calls** | `frontend/src/App.js` (Targets Gateway on Port 5001) |
| **Auth State** | `frontend/src/store/authSlice.js` |
| **Styling** | `frontend/src/App.css` (Elite SaaS / Glassmorphism) |
| **PDF Logic** | `frontend/src/components/ReportGenerator.js` |

---

## ⚠️ Troubleshooting Localhost
* **CORS Error:** Ensure your `.env` in the `api-gateway` folder allows `http://localhost:3000`.
* **Port Conflict:** If port 3000 is busy, React will ask to run on 3001. Ensure you update the whitelist in your Backend if this happens.
* **Node Version:** Use Node.js **v18 or higher** for compatibility with the microservices.

---
**Maintained by:** Abhishek Kumar Singh