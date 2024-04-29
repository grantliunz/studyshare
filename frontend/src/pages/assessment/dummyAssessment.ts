import { Assessment } from '../../types/assessment';

export const dummyAssessment2 = {
  courseId: '662c8fc218556c7b26bf7971',
  type: 'Exam',
  year: 2023,
  semester: 'First'
};
export const dummyAssessment1: Assessment = {
  courseId: '662c8fc218556c7b26bf7971',
  _id: '1',
  type: 'Exam',
  year: 2023,
  semester: 'First',
  questions: [
    {
      number: '1',
      subquestions: [
        {
          number: 'b',
          content: {
            text: 'What are the main factors influencing [specific topic]?',
            answers: [],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        },
        {
          number: 'c',
          content: {
            text: 'What are some potential solutions to address [issue]?',
            answers: [],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        }
      ]
    },
    {
      number: '2',
      subquestions: [
        {
          number: 'a',
          content: {
            text: 'What are the key principles underlying [theory/concept]?',
            answers: [],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        },
        {
          number: 'b',
          content: {
            text: 'How does [theory/concept] differ from other similar approaches?',
            answers: [],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        }
      ]
    },
    {
      number: '3',
      subquestions: [
        {
          number: 'a',
          content: {
            text: 'What are some real-life examples illustrating the application of [theory/concept]?',
            answers: [
              {
                text: 'After careful consideration, I conclude the answer is 18',
                author: 'Mia Anderson',
                rating: {
                  id: '10',
                  upvotes: 22,
                  downvotes: 9
                },
                comments: [],
                timestamp: '19/04/2024'
              }
            ],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        },
        {
          number: 'b',
          content: {
            text: 'How can [specific approach] be implemented effectively?',
            answers: [
              {
                text: 'I believe the answer is 5',
                author: 'Aaron Rodrigues',
                rating: {
                  id: '1',
                  upvotes: 10,
                  downvotes: 100
                },
                comments: [
                  {
                    text: 'I agree',
                    author: 'Connor Rizz Stevens',
                    rating: {
                      id: '1',
                      upvotes: 10,
                      downvotes: 100
                    }
                  },
                  {
                    text: 'I also agree',
                    author: 'Granetta Liu fdsffsdfdsfdsfsdfsdf',
                    rating: {
                      id: '2',
                      upvotes: 10,
                      downvotes: 0
                    }
                  }
                ],
                timestamp: '19/04/2024'
              },
              {
                text: 'I think the answer is 7',
                author: 'Emma Smith',
                rating: {
                  id: '2',
                  upvotes: 15,
                  downvotes: 5
                },
                comments: [],
                timestamp: '19/04/2024'
              },
              {
                text: 'Based on my research, the answer is 42',
                author: 'Michael Johnson',
                rating: {
                  id: '3',
                  upvotes: 20,
                  downvotes: 2
                },
                comments: [
                  {
                    text: 'Your research is false',
                    author: 'Connor Rizz Stevens',
                    rating: {
                      id: '1',
                      upvotes: 10,
                      downvotes: 100
                    }
                  }
                ],
                timestamp: '19/04/2024'
              },
              {
                text: 'My analysis suggests the answer is 12',
                author: 'Sophia Lee',
                rating: {
                  id: '4',
                  upvotes: 8,
                  downvotes: 3
                },
                comments: [],
                timestamp: '19/04/2024'
              }
            ],
            watchers: [],
            comments: [],
            timestamp: '19/04/2024',
            author: 'Connor Rizz Stevens'
          }
        }
      ]
    },
    {
      number: '4',
      subquestions: [
        {
          number: 'a',
          subquestions: [
            {
              number: 'i',
              content: {
                text: 'this is a question i want to die',
                answers: [],
                watchers: [],
                comments: [],
                timestamp: '23/04/2024',
                author: 'Aaron Stevens'
              }
            }
          ]
        },
        {
          number: 'b',
          content: {
            text: 'this is another question i want to sleep',
            answers: [],
            watchers: [],
            comments: [],
            timestamp: '23/04/2024',
            author: 'Aaron Stevens'
          }
        }
      ]
    }
  ]
};
