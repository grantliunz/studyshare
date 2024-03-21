# COMPSCI 732 / SOFTENG 750 project - Team Radiant Raccoons - FRONTEND


This guide will walk you through setting up the frontend for StudyShare.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Node.js: [Download Node.js](https://nodejs.org/en/download/) and follow the installation instructions.

## Configuration


1. Navigate to the frontend directory from main folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the frontend with the following structure:

   ```plaintext
   VITE_API_BASE_URL=http://localhost:3000
   VITE_IMAGE_BASE_URL=http://localhost:3000
   ```

   Update the URLs accordingly if your backend server is running on a different port or host.

## Running the Frontend

To start the frontend development server, run the following command:

```bash
npm run dev
```

This will start the frontend server and you can access it in your browser at the specified address.

## Usage

Once the frontend server is up and running, you can access the StudyShare application in your browser and interact with it.
