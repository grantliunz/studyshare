import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { Button, Chip, Typography } from '@mui/material';
import Avatar, { genConfig } from 'react-nice-avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/UserContext';
import ProfileCard from './ProfileCard';
import API from '../../util/api';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Profile() {
    const { userDb, logout } = useAuth();
    const navigate = useNavigate();

    const config = genConfig(userDb?.email || '');

    const tags = ['Watchlisted Questions', 'Added Questions', 'Answered Questions'];

    // States to store data
    const [watchlistedQuestions, setWatchlistedQuestions] = useState([] as any[]);
    const [addedQuestions, setAddedQuestions] = useState([] as any[]);
    const [answeredQuestions, setAnsweredQuestions] = useState([] as any[]);

    // State to manage selected tag
    const [selectedTag, setSelectedTag] = useState('Watchlisted Questions');
    const [selectedCardData, setSelectedCardData] = useState([] as any[]);

    // States to manage loading and error
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    // Set the selected card data based on the selected tag
    useEffect(() => {
        if (selectedTag === 'Watchlisted Questions') {
            setSelectedCardData(watchlistedQuestions);
        } else if (selectedTag === 'Added Questions') {
            setSelectedCardData(addedQuestions);
        } else if (selectedTag === 'Answered Questions') {
            setSelectedCardData(answeredQuestions);
        }
    }, [selectedTag, watchlistedQuestions, addedQuestions, answeredQuestions]);


    useEffect(() => {
        const fetchData = async () => {
            if (!userDb) return;
            setIsLoading(true);
            try {

                // Get all questions watchlisted by the user
                let watchlistedQuestions: any[] = [];
                if (userDb?.watchList) {

                    for (let watchList of userDb?.watchList) {
                        if (watchList.watchType === 'QUESTION') {
                            watchlistedQuestions.push(await getQuestionData(watchList.watchedId));
                        }
                    }
                }
                setWatchlistedQuestions(watchlistedQuestions);
                console.log(watchlistedQuestions);

                let addedQuestions: any[] = [];
                if (userDb?.questions) {
                    for (let questionId of userDb?.questions) {
                        addedQuestions.push(await getQuestionData(questionId));
                    }
                    console.log(addedQuestions);
                }
                setAddedQuestions(addedQuestions);

    
                // Get all questions answered by the user
                let answeredQuestions: any[] = [];
                if (userDb?.answers) {
                    for (let answerId of userDb?.answers) {

                        const answer = await axios.get<any>(`${BACKEND_URL}${API.getAnswer}/${answerId}`);
                        
                        const dateCreated = new Date(answer.data.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        });

                        const question = await getQuestionData(answer.data.question);
                        answeredQuestions.push({
                            Title: question.Content,
                            Content: answer.data.text,
                            Year: question.Year,
                            DateCreated: dateCreated,
                            Path: question.Path
                        });
                    }
                }
                setAnsweredQuestions(answeredQuestions);
                console.log(answeredQuestions);


            } catch (error) {
                console.log(error);
                setIsError(true);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [userDb]);


    async function getQuestionData(questionId: string) {
        const question = await axios.get<any>(`${BACKEND_URL}${API.getQuestion}/${questionId}`);
        const dateCreated = new Date(question.data.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const assessment = await axios.get<any>(`${BACKEND_URL}${API.getAssessment}/${question.data.assessment}`);
        const course = await axios.get<any>(`${BACKEND_URL}${API.getCourse}/${assessment.data.course}`);
        const year = course.data.code + " " + assessment.data.type + " " + assessment.data.semester + " " + "SEMESTER" + " " + assessment.data.year;
        const path = "/" + course.data.university + "/" + assessment.data.course + "/" + assessment.data._id;
        const regex = /(<([^>]+)>)/ig;


        return {
            Title: question.data.number.join('.'),
            Content: question.data.versions[question.data.versions.length - 1].text.replace(regex, ''),
            Year: year,
            DateCreated: dateCreated,
            Path: path
        };
    }

    const logoutUser = () => {
        logout();
        navigate('/universities');
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Profile</h1>

            <div className={styles.profileInfo}>

                <div className={styles.profileContainer}>
                    <div className={styles.avatar}>
                        <Avatar style={{ width: '125px', height: '125px' }} {...config} />
                    </div>
                    <div className={styles.profileDetails}>
                        <h1 className={styles.profileName}>{userDb?.name}</h1>
                        <h2 className={styles.profileEmail}>{userDb?.email}</h2>
                    </div>
                </div>

                <div className={styles.profileStats}>
                    <div className={styles.stat}>
                        <Typography variant="h6">Watchlisted</Typography>
                        <Typography variant="h4">{userDb?.watchList.length}</Typography>
                    </div>
                    <div className={styles.stat}>
                        <Typography variant="h6">Added</Typography>
                        <Typography variant="h4">{userDb?.questions.length}</Typography>
                    </div>
                    <div className={styles.stat}>
                        <Typography variant="h6">Answers</Typography>
                        <Typography variant="h4">{userDb?.answers.length}</Typography>
                    </div>
                </div>
            </div>

            <div className={styles.profileTags}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        color={selectedTag === tag ? 'primary' : 'default'}
                        onClick={() => setSelectedTag(tag)}
                        style={{ backgroundColor: selectedTag === tag ? '#41709b' : '#e0e0e0' }}
                    />
                ))}
            </div>

            <div className={styles.profileCards}>
                {selectedCardData.map((card, index) => (
                    <div key={index} onClick={() => navigate(card.Path)}>
                        <ProfileCard
                            Title={card.Title}
                            Content={card.Content}
                            Year={card.Year}
                            DateCreated={card.DateCreated}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.logoutButton}>
                <Button variant="contained" style={{ width: '100px', height: '40px', borderRadius: '5px', color: 'white', backgroundColor: '#41709b' }} onClick={logoutUser}>Logout</Button>
            </div>
        </div>
    );
}
