# NyaySetu Platform

NyaySetu is a modern legal aid platform connecting users with specialized lawyers for online consultations.

## Project Structure

This project follows a professional multi-module startup structure:

*   `backend/`: Spring Boot Java backend application.
*   `frontend/`: React + Vite frontend application.

## Prerequisites

*   Java 17
*   Node.js (v16+)
*   MySQL Server (running on `localhost:3306`, credentials `root`/`root`)

## Automation Scripts

To simplify the development workflow, use the provided PowerShell scripts at the project root:

### `.\start.ps1`
The easiest way to start developing. This script will launch both the Spring Boot backend and the Vite frontend dev server simultaneously in separate windows.

### `.\build_all.ps1`
Prepares the project for deployment. It runs a full clean build of the backend (creating the production JAR) and builds the optimized frontend assets.

## Manual Execution

### Backend
1.  Navigate to `backend/`
2.  Run `.\mvnw spring-boot:run`

### Frontend
1.  Navigate to `frontend/`
2.  Run `npm install` (first time only)
3.  Run `npm run dev`

## Deployment

The backend build process produces an executable JAR at `backend\target\nyaysetu-backend-0.0.1-SNAPSHOT.jar`.
This JAR can be deployed to any standard Java server environment.
