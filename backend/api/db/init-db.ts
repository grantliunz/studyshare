import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
// TODO import your schema here
import University from '../routes/university/university-model';
import Course from '../routes/course/course-model';
import Question from '../routes/question/question-model';
import Assessment from '../routes/assessment/assessment-model';
import {
  AssessmentType,
  SemesterType
} from '../routes/assessment/assessment-enums';
import User from '../routes/user/user-model';

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

const users = [
  new User({
    authId: 'CyRFTFlO7PeMbFHhvl4CUTl403f1',
    name: 'Aaron Rodrigues',
    email: 'aaron@gmail.com',
    questions: [],
    answers: [],
    watchList: [],
    reported: [],
    upvotedAnswers: [],
    downvotedAnswers: [],
    upvotedComments: [],
    downvotedComments: []
  }),
  new User({
    authId: 'izYApPkEVxSFo7enwag01kkmfq13',
    name: 'Connor Stevens',
    email: 'connor@gmail.com',
    questions: [],
    answers: [],
    watchList: [],
    reported: [],
    upvotedAnswers: [],
    downvotedAnswers: [],
    upvotedComments: [],
    downvotedComments: []
  }),
  new User({
    authId: 'AwDUcnfnQ7Psct8k4XXVTBNkQxt1',
    name: 'Grant Liu',
    email: 'grant@gmail.com',
    questions: [],
    answers: [],
    watchList: [],
    reported: [],
    upvotedAnswers: [],
    downvotedAnswers: [],
    upvotedComments: [],
    downvotedComments: []
  })
];

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

const assessments = [
  new Assessment({
    type: AssessmentType.EXAM,
    year: 2024,
    semester: SemesterType.FIRST,
    questions: [],
    latestContributor: users[0]._id,
    newestQuestion: null
  }),
  new Assessment({
    type: AssessmentType.TEST,
    year: 2024,
    semester: SemesterType.FIRST,
    number: 1,
    questions: [],
    latestContributor: users[1]._id,
    newestQuestion: null
  }),
  new Assessment({
    type: AssessmentType.EXAM,
    year: 2023,
    semester: SemesterType.FIRST,
    questions: []
  }),
  new Assessment({
    type: AssessmentType.OTHER,
    year: 2024,
    semester: SemesterType.FIRST,
    name: 'Problem Sheet 1',
    questions: [],
    latestContributor: users[2]._id,
    newestQuestion: null
  })
];

const questions = [
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'a', 'i'],
    versions: [
      {
        text: '<p>How can I be like Penqor</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[0]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'a', 'ii'],
    versions: [
      {
        text: '<p>How long did</p>',
        author: users[0]._id,
        createdAt: new Date()
      },
      {
        text: '<p>How long did Penqor ?</p>',
        author: users[1]._id,
        createdAt: new Date()
      },
      {
        text: '<p>How long did Penqor spend at green place?</p>',
        author: users[2]._id,
        createdAt: new Date()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[1]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'a', 'iii'],
    versions: [
      {
        text: '<p>What is green place?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[2]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'b', 'i'],
    versions: [
      {
        text: '<p>Friend help?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[0]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'b', 'ii'],
    versions: [
      {
        text: '<p>What sound does a monkey make?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[1]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'b', 'iii'],
    versions: [
      {
        text: '<p>How much can a gorilla deadlift?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[2]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['2', 'a'],
    versions: [
      {
        text: '<p>How much did Penqor deadlift last week?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: []
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['2', 'b'],
    versions: [
      {
        text: '<p>How much can you deadlift?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[1]._id
  }),
  new Question({
    assessment: assessments[0]._id,
    number: ['3'],
    versions: [
      {
        text: '<p>Where is ardo?</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: [],
    latestContributor: users[1]._id
  })
];

// This is a standalone program which will populate the database with initial data.
async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);

    // TODO Clear db
    await mongoose.connection.db.dropDatabase();

    for (const user of users) {
      await user.save();
    }

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

    for (const assessment of assessments) {
      assessment.course = courses[0]._id;
      await assessment.save();
      courses[0].assessments.push(assessment._id);
      await courses[0].save();
    }

    for (const question of questions) {
      await question.save();
      assessments[0].questions.push(question._id);
      await assessments[0].save();
      users[0].questions.push(question.id);
      await users[0].save();
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.log(error);
  }
}

run();
