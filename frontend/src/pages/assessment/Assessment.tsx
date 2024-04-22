import { useParams } from 'react-router-dom';
import styles from './Assessment.module.css';
import { useState } from 'react';
import QuestionPanel from './QuestionPanel';
import QuestionNumber from './QuestionNumber';

export type Question = {
  number: string;
  content?: {
    image?: string;
    text: string;
    answers: Answer[]; // temp
    watchers: string[]; // temp
    comments: string[]; // temp
    timestamp: string;
    author: string;
  };
  subquestions?: Question[];
};

export type Answer = {
  image?: string;
  text?: string;
  author: string;
  rating: Rating;
  comments: Comment[];
  timestamp: string;
};

export type Comment = {
  image?: string;
  text?: string;
  author: string;
  rating: Rating;
};

export type Rating = {
  id: string;
  upvotes: number;
  downvotes: number;
};

export type Assessment = {
  type: 'Exam' | 'Test' | 'Lab' | 'Assignment' | 'Other';
  number?: number;
  year: number;
  semester: 'S1' | 'S2' | 'Summer School';
  questions: Question[];
};

const dummyAssessment: Assessment = {
  type: 'Exam',
  year: 2023,
  semester: 'S1',
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
    }
  ]
};

export type QuestionWithFullNumber = {
  question: Question;
  fullNumber: string;
};

const Assessment = () => {
  const { id } = useParams();
  console.log(id);

  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithFullNumber>();

  const handleQuestionChange = (newQuestion: QuestionWithFullNumber) => {
    setCurrentQuestion(newQuestion);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
      }}
    >
      <div
        style={{
          backgroundColor: '#E8E9EC',
          minHeight: '100vh',
          padding: '12px 8px'
        }}
      >
        {dummyAssessment.questions.map((question) => (
          <QuestionNumber
            key={question.number}
            question={question}
            parentNumber={question.number}
            setQuestion={setCurrentQuestion}
            currentQuestion={currentQuestion}
          />
        ))}
      </div>
      <div className={styles.questionContainer} style={{ flexGrow: 1 }}>
        {currentQuestion ? (
          <QuestionPanel questionWithFullNumber={currentQuestion} />
        ) : (
          <p>Click a question to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Assessment;
