import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar, { genConfig } from 'react-nice-avatar';
import { Button, Chip, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/UserContext';
import ProfileCard from './ProfileCard';
import API from '../../util/api';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Profile() {
    const { userDb, logout } = useAuth();
    const navigate = useNavigate();

    // User avatar configuration
    const config = genConfig(userDb?.email || '');

    // States to store data
    const [watchlistedAssignments, setWatchlistedAssignments] = useState([] as any[]);
    const [watchlistedQuestions, setWatchlistedQuestions] = useState([] as any[]);
    const [addedQuestions, setAddedQuestions] = useState([] as any[]);
    const [answeredQuestions, setAnsweredQuestions] = useState([] as any[]);

    // Tags and states to manage selected tag and card data
    const tags = ['Watchlisted Assignments', 'Watchlisted Questions', 'Added Questions', 'Answered Questions'];

    const [selectedTag, setSelectedTag] = useState('Watchlisted Assignments');
    const [selectedCardData, setSelectedCardData] = useState([] as any[]);

    // States to manage loading and error
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    // Set profile cards data based on selected tag
    useEffect(() => {
        if (selectedTag === 'Watchlisted Questions') {
            setSelectedCardData(watchlistedQuestions);
        } else if (selectedTag === 'Added Questions') {
            setSelectedCardData(addedQuestions);
        } else if (selectedTag === 'Answered Questions') {
            setSelectedCardData(answeredQuestions);
        }
    }, [selectedTag, watchlistedQuestions, addedQuestions, answeredQuestions]);


    // Fetch user data upon component mount
    useEffect(() => {
        const fetchData = async () => {
            if (!userDb) return;
            setIsLoading(true);
            try {
                const profileData = await axios.get<any>(`${BACKEND_URL}${API.getProfile}/${userDb._id}`);
                console.log(profileData);
                setWatchlistedAssignments(profileData.data.watchListedAssessments);
                setWatchlistedQuestions(profileData.data.watchListedQuestions);
                setAddedQuestions(profileData.data.addedQuestions);
                setAnsweredQuestions(profileData.data.answeredQuestions);
            } catch (error) {
                console.log(error);
                setIsError(true);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [userDb]);

    const logoutUser = () => {
        logout();
        navigate('/universities');
    }

    return (
        <div className={styles.container}>
            {isError ? (
            <div className={styles.errorContainer}>
                <h1 className={styles.error}>Error fetching data</h1>
            </div>
            ) : ( isLoading ? (
            <>
                <div className={styles.loadingContainer}>
                    <CircularProgress />
                </div>
            </>
            ) : (
            <>
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
                    { selectedCardData.length === 0 ? (
                        <div>
                            <h2 className={styles.noData}>There are no {selectedTag.toLowerCase()} to display</h2>
                        </div>
                    ) : (
                    <>
                        {selectedCardData.map((card, index) => (
                            <div key={index} onClick={() => navigate(card.Path)}>
                                <ProfileCard
                                    Title={card.Title}
                                    Content={card.Description}
                                    Year={card.Year}
                                    DateCreated={card.DateCreated}
                                />
                            </div>
                        ))}
                    </>
                    )}
                </div>

                <div className={styles.logoutButton}>
                    <Button variant="contained" style={{ width: '100px', height: '40px', borderRadius: '5px', color: 'white', backgroundColor: '#41709b' }} onClick={logoutUser}>Logout</Button>
                </div>
            </>
            )
        )}
        </div>
    );
}