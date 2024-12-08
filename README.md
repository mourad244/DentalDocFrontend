# Dental Management System - Frontend

This repository contains the frontend for **DentalDoc**, a comprehensive dental management system that streamlines clinic operations, such as managing appointments, dental procedures, payments, and inventory.

## Demonstration

### **Key Features**

- **User Management**: Simplifies managing patients and appointments.
- **Inventory Tracking**: Monitors clinic materials and generates purchase orders for restocking.
- **Dynamic Dashboard**: Displays clinic operations in real-time with charts and summaries.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

### **Technologies Used**

- **Vite**: A fast development build tool.
- **React**: For building the user interface.
- **React Router**: For seamless navigation.
- **Axios**: To handle API calls.
- **Tailwind CSS**: For styling and responsive design.
- **Nginx**: For deployment with HTTPS and reverse proxy.
- **AWS**: For hosting the application.

## Project Setup

Follow the steps below to set up the project locally:

### **1. Clone the Repository**

```bash
git clone [Frontend GitHub URL]
cd DentalDocFrontend
npm install
```

### \*\*2. Create .env, .env.production, and .env.development files in the project root and define the following variables:

.env
VITE_API_URL=http://localhost:3900/dentaldoc
VITE_API_IMAGE_URL=http://localhost:3900

---

.env.development
VITE_API_URL=http://localhost:3900/dentaldoc
VITE_API_IMAGE_URL=http://localhost:3900

---

.env.production
VITE_API_URL=<Production-Backend-URL>/dentaldoc
VITE_API_IMAGE_URL=<Production-Backend-URL>

---

### **3. Run the Project**

```bash
npm run dev
```

### **4. Access the Application**

Open your browser and navigate to `http://localhost:3000`.

## **5. Production Deployment**

To deploy the frontend in production, run the following command:

```bash
npm install -g serve
npm run build
npm start
```

The production server runs on port 3001 by default.

<!-- i want to mention that the demo version is deployed in aws instan  give me text -->

## **6. Demo**

A demo version of the application is available at [DentalDoc](https://demo.dentaldocma.com).
