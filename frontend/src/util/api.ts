const API = {
  getUniversities: '/university/getAllUniversities',
  postUniversity: '/university/createUniversity',
  getUniversityById: '/university',
  getCourses: '/course/getAllCourses',
  getCourse: '/course/getCourse',
  postCourse: '/course/createCourse',
  postAssessment: '/assessment',
  getAssessment: '/assessment',
  getCourseAssessments: '/assessment/getAllAssessments',
  createQuestion: '/question/createQuestion',
  getQuestion: '/question/getQuestion',
  updateQuestion: '/question/updateQuestion',
  createUser: '/user/createUser',
  getUser: '/user/getUser',
  updateUser: '/user/updateUser',
  getAllUsers: '/user/getAllUsers',
  createAnswer: '/answer/createAnswer',
  getAnswer: '/answer/getAnswer',
  createComment: '/comment/createComment'
};

export default API;
