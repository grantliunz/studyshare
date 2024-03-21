# COMPSCI 732 / SOFTENG 750 project - Team Radiant Raccoons - BACKEND

1. Navigate to the backend directory from main folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the backend with the following structure:

   ```plaintext
   PORT=3000
   MONGODB_CONNECTION_STRING=mongodb+srv://StudyShare:<password>@studyshare.fhntujg.mongodb.net/
   ```

   Replace `<password>` with the password obtained from Discord server.

## Running the Backend

To start the backend server, run the following command:

```bash
npm run dev
```

This will start the backend server on the specified port (default is 3000) and connect it to the MongoDB Atlas database using the provided connection string.

## Usage

Once the backend is up and running, you can start making requests to it from your frontend or API client.