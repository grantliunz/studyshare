# StudyShare

Welcome to StudyShare. A forum application that allows students to collaborate together to find the best answers to past exams and tests. Built with the MERN stack with Firebase authentication. StudyShare allows students to create and post questions from past exams that other students can provide answers to. This allows StudyShare to act as a database for present and future students who wish to find student made answers to past exams.

View the deployed application here: https://se750-studyshare.vercel.app/ 

## Features

StudyShare provides its users with multiple features to help make the process of finding, asking and answering questions as easy as possible.

- Users are able to view different exams from different courses and universities without having to make an account
- Users can create an account or login with Google
- Users can view questions and answers of an assessment
- Users can view the edit history of questions

Once logged in users can:

- Create universities, courses and assessments
- Post questions on exams/assessments
- Edit posted questions
- Answer questions
- Comment on answers
- Upvote/downvote comments and answers
- Add assessments or questions to their watchlist so that they are notified if any questions or answers are posted
- Hide any questions that are not relevant/innapropriate
- View their profile where they can see their watchlisted assessments and questions as well as their asked and answered questions
- Get notified if anyone answers a question they posted or a question they are watching
- Get notified if anyone comments on their answer

## Setup

### Setting up the frontend

#### Prerequisites

Before getting started, ensure you have the following installed on your system:

- Node.js: [Download Node.js](https://nodejs.org/en/download/) and follow the installation instructions.

#### Configuration

1. Navigate to the frontend directory from main folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following structure:

   ```plaintext
   VITE_FB_API_KEY="<value>"
   VITE_FB_AUTH_DOMAIN= "<value>"
   VITE_FB_PROJECT_ID="<value>"
   VITE_FB_STORAGE_BUCKET="<value>"
   VITE_FB_MESSAGING_SENDER_ID="<value>"
   VITE_FB_APP_ID="<value>"
   VITE_BACKEND_URL=http://localhost:3000
   ```

   Update the URLs accordingly if your backend server is running on a different port or host.
   Get the `<value>` of each .env variable from the submitted .env files or get in contact with one of our Team Members from our emails given below.

#### Running the Frontend

To start the frontend development server, run the following command in the frontend directory:

```bash
npm run dev
```

This will start the frontend server and you can access it in your browser at the specified address.

#### Usage

Once the frontend server is up and running, you can access the StudyShare application in your browser and interact with it.

#### Testing the Frontend

To run the frontend tests, run the following command in the frontend directory:

```bash
npm run test
```

This will run all the tests within the frontend folder.

### Setting up the backend

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

   Replace `<password>` with the password obtained from the submitted env files or get in contact with one of our Team Members from our emails given below.

#### Running the Backend

To start the backend server, run the following command:

```bash
npm run dev
```

This will start the backend server on the specified port (default is 3000) and connect it to the MongoDB Atlas database using the provided connection string.

#### Testing the Backend

To run the backend tests, run the following command in the frontend directory while the backend is running:

```bash
npm run route-test
```

This will run all the tests within the backend folder.

#### Usage

Once the backend is up and running, you can start making requests to it from your frontend or API client.

#### File Structure

Each data object is grouped under the routes folder. There will be a route file that declares all the routes, a controller file that contains all the route functionality and the model file that contains the schema.

# Contributing

## Commit conventions

Please use the following convention when creating commits `[type]: [msg]`

### Commit types

- `feat` - Commits that add a new feature

- `fix`- Commits that fixes a bug

- `style` - Commits that do not affect the meaning (white-space, formatting, missing semi-colons, etc)

- `doc` - Commits that affect documentation only

- `refactor` - Commits that rewrite/restructure your code, however does not change any behaviour

- `test` - Commits that add tests or correct existing tests

- `build` - Commits that affect build components like build tool, ci pipeline, dependencies, project version, ...

- `chore` - Miscellaneous commits e.g. modifying `.gitignore`

## Branches

- Branch name should be all lowercase and follow the format ticket ID]-ticket-title _e.g. 2-user-login_

## Pull request conventions

- PR title should be the same as the ticket title, with the ticket ID at the start. e.g. `2-user-login`.

One other member must approve the PR before it can be merged into main.

## Our Team

Team members are:

- Aaron Rodrigues (ardo715@aucklanduni.ac.nz)
- Dhruv Joshi (djos192@aucklanduni.ac.nz)
- Grant Liu (gliu871@aucklanduni.ac.nz)
- Wen Jie See (wsee046@aucklanduni.ac.nz)
- Connor Stevens (cste303@aucklanduni.ac.nz)
- Leander Legaspi (lleg966@aucklanduni.ac.nz)

  ## Screenshots
<img width="500" alt="landing page" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/38ccc0a0-9a9b-4e8e-aafb-dbadca7e5ab7" >
<img width="500" alt="universities page" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/a267ae0b-d929-444f-a59d-99bca5e8e9ae">
<img width="500" alt="courses page" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/857dbcd7-e641-41e1-9aab-52bbaa916391">
<img width="500" alt="assessments page" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/359e77fd-d225-47de-b851-10fb1a18861a">
<img width="500" alt="login" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/44a2e2bc-82ea-4547-b28f-efb9984a3c54">
<img width="500" alt="assessment page" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/1a58940b-8e02-4fc0-8400-f8bd0b9ba0e5">
<img width="500" alt="new question" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/e2e139d7-a6cc-4a70-a9f5-363cfbf55def">
<img width="500" alt="profile" src="https://github.com/UOA-CS732-SE750-Students-2024/project-group-radiant-raccoons/assets/100253339/90d16343-3bd7-4e21-8ef0-e4a278a624a2">



![](./group-image/Radiant%20Raccoons.webp)
