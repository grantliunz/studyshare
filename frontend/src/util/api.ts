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
  getNotifications: '/user/getNotifications',
  updateWatchList: '/user/updateWatchList',
  createAnswer: '/answer/createAnswer',
  getAnswer: '/answer/getAnswer',
  updateAnswer: '/answer/updateAnswer',
  voteAnswer: '/answer/voteAnswer',
  createComment: '/comment/createComment',
  getComment: '/comment/getComment',
  voteComment: '/comment/voteComment'
};

export default API;
