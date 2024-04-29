import * as dotenv from 'dotenv';
dotenv.config();

import mongoose, { mongo } from 'mongoose';
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

const universities = [
  new University({
    _id: '662f9cf0c02c023a03c89544',
    name: 'Monkey',
    image: '1'
  }),
  new University({
    _id: '662f9d24bf818f416fcd1b38',
    name: 'Gorilla',
    image: '1'
  })
];

const courses = [
  new Course({
    name: 'Introduction to Swinging',
    code: 'MONKEY184',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Fundamentals of Swinging',
    code: 'MONKEY284',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Fundamentals of Swinging 2',
    code: 'MONKEY384',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Introduction to Gorilla',
    code: 'GORRILLA101',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  }),
  new Course({
    name: 'Fundamentals of Chest Beating',
    code: 'GORRILLA206',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  }),
  new Course({
    name: 'How to Gorilla',
    code: 'GORRILLA306',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  })
];

// This is a standalone program which will populate the database with initial data.
async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);

    // TODO Clear db
    await mongoose.connection.db.dropDatabase();

    for (const uni of universities) {
      await uni.save(); // save() will input timestamps
    }

    for (const course of courses) {
      await course.save();
      const relatedUni = universities.find(
        (uni) => (uni._id = course.university)
      );
      relatedUni?.courses.push(course._id);
      await relatedUni?.save();
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.log(error);
  }
}

run();
