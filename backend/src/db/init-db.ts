import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
// TODO import your schema here
import University from '../routes/university/university-model';
import Course from '../routes/course/course-model';

// Hardcoded a University list for testing
const university = new University({
  Name: 'University of Auckland',
  Courses: [
    new Course({
      Name: 'Computer Science',
      Image:
        'https://www.utoronto.ca/sites/default/files/2019-01/Computer-Science-Header.jpg'
    })
  ]
});

// This is a standalone program which will populate the database with initial data.
async function run() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);

  // TODO Clear db
  await mongoose.connection.db.dropDatabase();

  await mongoose.connection.db.collection('universities').insertOne(university);

  await mongoose.disconnect();
  console.log('Done!');
}

run();
