import { useParams } from 'react-router-dom';
import styles from './Assessment.module.css';
import { SyntheticEvent, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import TabPanel from '../../components/TabPanel';
import QuestionPanel from './QuestionPanel';

export type Question = {
  number: string[];
  image?: string;
  text: string;
  answers: Answer[]; // temp
  watchers: string[]; // temp
  comments: string[]; // temp
  timestamp: string;
  author: string;
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

const dummyAssessment: {
  type: 'Exam' | 'Test' | 'Lab' | 'Assignment' | 'Other';
  number?: number;
  year: number;
  semester: 'S1' | 'S2' | 'Summer School';
  questions: Question[];
} = {
  type: 'Exam',
  year: 2023,
  semester: 'S1',
  questions: [
    {
      number: ['1', 'b'],
      text: 'What are the main factors influencing [specific topic]?',
      answers: [],
      watchers: [],
      comments: [],
      timestamp: '19/04/2024',
      author: 'Connor Rizz Stevens'
    },
    {
      number: ['1', 'c'],
      text: 'What are some potential solutions to address [issue]?',
      answers: [],
      watchers: [],
      comments: [],
      timestamp: '19/04/2024',
      author: 'Connor Rizz Stevens'
    },
    {
      number: ['2', 'a'],
      text: 'What are the key principles underlying [theory/concept]?',
      answers: [],
      watchers: [],
      comments: [],
      timestamp: '19/04/2024',
      author: 'Connor Rizz Stevens'
    },
    {
      number: ['2', 'b'],
      text: 'How does [theory/concept] differ from other similar approaches?',
      answers: [],
      watchers: [],
      comments: [],
      timestamp: '19/04/2024',
      author: 'Connor Rizz Stevens'
    },
    {
      number: ['3', 'a'],
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
    },
    {
      number: ['3', 'b'],
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
          comments: [],
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
  ]
};

const Assessment = () => {
  const { id } = useParams();
  console.log(id);

  const [currentQuestion, setCurrentQuestion] = useState<string>(
    dummyAssessment.questions[0].number.join('')
  );

  const handleQuestionChange = (event: SyntheticEvent, newQuestion: string) => {
    setCurrentQuestion(newQuestion);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        border: '1px solid black',
        width: '100vw'
      }}
    >
      <Tabs
        value={currentQuestion}
        onChange={handleQuestionChange}
        orientation="vertical"
        style={{
          minWidth: 'fit-content',
          backgroundColor: '#5D707F'
        }}
        TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
      >
        {dummyAssessment.questions.map((question) => (
          <Tab
            key={question.number.join('')}
            label={question.number.join('')}
            style={
              { textTransform: 'none' } &&
              currentQuestion === question.number.join('')
                ? { color: '#5D707F', backgroundColor: 'white' }
                : { color: 'white', backgroundColor: '#5D707F' }
            }
            value={question.number.join('')}
          />
        ))}
      </Tabs>
      <div
        className={styles.questionContainer}
        style={{
          border: '1px solid black',
          flexGrow: 1
        }}
      >
        {dummyAssessment.questions.map((question) => (
          <TabPanel
            key={question.number.join('')}
            selectedValue={currentQuestion}
            value={question.number.join('')}
          >
            <QuestionPanel question={question} />
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default Assessment;
