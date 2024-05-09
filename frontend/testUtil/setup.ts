// @ts-nocheck
import { postResponse, postResponseObject } from "./testUtil"
import API from "../src/util/api"
import { answerId } from "./testIds";
import { writeFileSync } from "fs";


const randomNo = Math.floor(Math.random() * 1000);
const randomYear = Math.floor(Math.random() * 1000) + 2000;


export default async function setup(){
 console.log("start setup")
 console.log("randomNo: " + randomNo)




 const user: CreateUserDTO = {
  authId: randomNo.toString(),
  name: 'testName',
  email: 'testEmail' + randomNo + '@test.com',
  questions: [],
  answers: [],
  watchList: [],
  reported: [],
  upvotedAnswers: [],
  downvotedAnswers: [],
  upvotedComments: [],
  downvotedComments: []
 };
 
 const userId = (await postResponseObject(`${API.createUser}`, user))._id
 console.log(userId)

 const newUni = {
  name: "Uni For Testing" + randomNo,
  courses: []
 };


 const uniId = (await postResponseObject(`${API.postUniversity}`, newUni))._id;
 console.log(uniId)

 // create course
 const newCourse = {
  code: "TEST" + randomNo,
  name: "Test Course Name"
};
 const courseId = (await postResponseObject(`${API.postCourse}/` + uniId, newCourse))._id;
 console.log(courseId)

 // create assessment
 const newAssessment = {
  courseId: courseId,
  type: "Exam",
  year: randomNo,
  semester: "Semester 1",
  questions: [],
  latestContributor: null,
  newestQuestion: null
 };

const assessmentId = (await postResponseObject(`${API.postAssessment}/` + courseId, newAssessment))._id;
console.log(assessmentId)

// create question
const question = {
 number: ['1', 'a'],
 versions: [{
 text: "Version 1",
 author: userId,
 createdAt: new Date(),
 isAnonymous: false
 }],
 answers: [],
 reporters: [],
 comments: [],
 latestContributor: null
}

const questionId = (await postResponseObject(`${API.createQuestion}/` + assessmentId, question))._id;
 console.log(questionId)

 //create answer
 const answer : CreateAnswerDTO = {
  text: 'dummy answer',
  author: userId,
  rating: {
   upvotes: 0,
   downvotes: 0
  },
  comments: [],
  isAnonymous: false,
  question: questionId
 };

 const answerId = (await postResponseObject(`${API.createAnswer}/` + questionId, answer))._id;
 console.log(answerId)

 // create comment
 const createCommentDto = {
  userId: userId,
  answerId: answerId,
  content: 'This is a dummy comment'
 };

 const commentId = (await postResponseObject(`${API.createComment}/`+ answerId, createCommentDto))._id;
 console.log(commentId)
//  console.log(commentId._id)



  // write to testIds
  writeFileSync('./testUtil/testIds.ts', `export const userId = '${userId}';\nexport const universityId = '${uniId}';\nexport const courseId = '${courseId}';\nexport const assessmentId = '${assessmentId}';\nexport const questionId = '${questionId}';\nexport const answerId = '${answerId}';\nexport const commentId = '${commentId}';\n`)
}

