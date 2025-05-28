# Alice Copilot – Monorepo

This repository contains both the **frontend** and **backend** for Alice, an internal AI-powered copilot designed to assist with documentation, workflow automation, and personalized queries across Jira and other systems.

---

## 🗂 Project Structure

```
copilot/
├── frontend/          # React + Tailwind UI (Vite, managed in Cursor)
├── backend/           # Azure Functions backend (C#, Isolated Worker)
├── shared/            # (Optional) Shared models or constants
├── .gitignore
├── README.md
```

---

## 🧑‍💻 Development Setup

### Frontend (React + Tailwind)

- Open the `frontend/` folder in **Cursor** (or VS Code).
- Run:

    cd frontend
    npm install
    npm run dev

- Local dev runs on http://localhost:5173/

- Make sure `vite.config.js` includes a proxy to your backend:

    server: {
      proxy: {
        '/api': 'http://localhost:7071',
      },
    }

---

### Backend (Azure Functions)

- Open the `copilot.sln` file in **Visual Studio**.
- Run the Azure Functions project locally:

    cd backend
    func start

- The API will run on http://localhost:7071/api/

---

## 🔄 Connecting Frontend to Backend

From the frontend, you can call your API like this:

    fetch('/api/GetUserTasks')

Thanks to Vite’s proxy, this will forward to the Azure Function running locally.

---

## 🚀 Deployment Overview

- **Frontend**: Deploy via Azure Static Web Apps, Blob Storage, or any static host.
- **Backend**: Deploy via Azure Functions (standard deployment).
- Use `.env` files to set the appropriate base URLs or secrets in each environment.

---

## 🧠 Tools Used

- React + Tailwind (Vite) — Frontend
- Azure Functions (.NET 7 Isolated Worker) — Backend
- Cursor — Frontend development IDE
- Visual Studio — Backend development IDE

---

## 🧾 TODOs

- [ ] Wire up authentication
- [ ] Add shared type definitions (e.g., Ticket, UserProfile)
- [ ] Connect to Jira APIs
- [ ] Add Cognitive Search or RAG fallback
- [ ] Polish UI with loading states and error handling
