import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
// TODO import your schema here
import University from '../routes/university/university-model';
import Course from '../routes/course/course-model';
import Question from '../routes/question/question-model';
import Assessment from '../routes/assessment/assessment-model';
import User from '../routes/user/user-model';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';


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
    name: 'University of Auckland',
    image: '1'
  }),
  new University({
    _id: '662f9d24bf818f416fcd1b38',
    name: 'Auckland University of Technology',
    image: '1'
  }),
  new University({
    _id: '662f9d24bf818f416fcd1a38',
    name: 'University of Otago',
    image: '1'
  })
];

const courses = [
  new Course({
    name: 'Software Architecture',
    code: 'SOFTENG325',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Engineering Mechanics',
    code: 'ENGGEN121',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Mathematical Modelling 2',
    code: 'ENGSCI211',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Fundamentals of Database Systems',
    code: 'SOFTENG351',
    university: '662f9cf0c02c023a03c89544',
    assessments: []
  }),
  new Course({
    name: 'Introduction to Artificial Intelligence',
    code: 'COMPSCI320',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  }),
  new Course({
    name: 'Fundamentals of Computer Graphics',
    code: 'COMPSCI373',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  }),
  new Course({
    name: 'Introduction to Computer Networks',
    code: 'COMPSCI377',
    university: '662f9d24bf818f416fcd1b38',
    assessments: []
  })
];

const assessments = [
  new Assessment({
    type: AssessmentType.EXAM,
    year: 2020,
    semester: SemesterType.SEMESTER_1,
    questions: [],
    latestContributor: users[0]._id,
    newestQuestion: null
  }),
  new Assessment({
    type: AssessmentType.TEST,
    year: 2024,
    semester: SemesterType.SEMESTER_1,
    number: 1,
    questions: [],
    latestContributor: users[1]._id,
    newestQuestion: null
  }),
  new Assessment({
    type: AssessmentType.EXAM,
    year: 2019,
    semester: SemesterType.SEMESTER_1,
    questions: []
  }),
  new Assessment({
    type: AssessmentType.OTHER,
    year: 2024,
    semester: SemesterType.SEMESTER_1,
    name: 'Problem Sheet 1',
    questions: [],
    latestContributor: users[2]._id,
    newestQuestion: null
  })
];

const questions = [
  new Question({
    assessment: assessments[0]._id,
    number: ['1', 'a'],
    versions: [
      {
        text: '<p>A typical distributed information system can be structured according to three tiers: client, service, and data. Briefly describe how caching might be employed to improve a three-tier system’s scalability.</p>',
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
    number: ['1', 'b'],
    versions: [
      {
        text: '<p>Describe the term Data Transmission Object (DTO).</p>',
        author: users[0]._id,
        createdAt: new Date()
      },
      {
        text: '<p>Describe the term Data Transmission Object (DTO), and briefly explain when it is appropriate to use DTOs.</p>',
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
    number: ['1', 'c'],
    versions: [
      {
        text: '<p>Many of the technologies used in the course, including JAX-RS, JPA, HTTP and servlet containers, are based on open specifications. Briefly describe the term open specification and name a quality attribute that is promoted through use of open specifications.</p>',
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
    number: ['3', 'a'],
    versions: [
      {
        text: '<p>Describe, using examples, one situation in which an asynchronous communication protocol would be beneficial compared with a traditional request-reply protocol.</p>',
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
    number: ['2', 'a'],
    versions: [ 
      {
        text: '<p>Study the class definition in Figure 1 and the transaction code in Figure 2. If two instances of the transaction in Figure 2 were running concurrently, describe how they could conflict.</p>',
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
    number: ['4'],
    versions: [
      {
        text: '<p>You have been tasked to design a web service allowing users to book vehicle rentals using a website, before coming into a physical caryard to confirm the agreement and pick up the rental. The design brief for this system is given in Appendix B</p>',
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
    number: ['4', 'a'],
    versions: [
      {
        text: '<p>Create an object-oriented domain model, using JPA annotations, that could be used to represent the system described in the design brief. Be sure to include all necessary JPA annotations, but you may omit any getters, setters, and constructors. If you make any assumptions, be sure to state them. Justify all design decisions made.</p>',
        author: users[0]._id,
        createdAt: Date.now()
      }
    ],
    answers: [],
    reporters: [],
    comments: []
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
