import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar, { genConfig } from 'react-nice-avatar';
import { Button, Chip, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/UserContext';
import ProfileCard from './ProfileCard';
import API from '../../util/api';
import {
  ProfileCardDTO,
  UserProfileDTO,
  WatchListType
} from '@shared/types/models/user/user';
import useGet from '../../hooks/useGet';

export default function Profile() {
  const { userDb, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: profileData,
    isLoading,
    error
  } = useGet<UserProfileDTO>(`${API.getProfile}/${userDb?._id}`);

  const tags = [
    'Assessment Watchlist',
    'Question Watchlist',
    'Questions Added',
    'Answers'
  ];

  const [selectedTag, setSelectedTag] = useState('Assessment Watchlist');
  const [selectedCardData, setSelectedCardData] = useState<ProfileCardDTO[]>(
    []
  );

  useEffect(() => {
    if (profileData == null) return;
    if (selectedTag === 'Assessment Watchlist') {
      setSelectedCardData(profileData.watchListedAssessments);
    } else if (selectedTag === 'Question Watchlist') {
      setSelectedCardData(profileData.watchListedQuestions);
    } else if (selectedTag === 'Questions Added') {
      setSelectedCardData(profileData.addedQuestions);
    } else if (selectedTag === 'Answers') {
      setSelectedCardData(profileData.answeredQuestions);
    }
  }, [selectedTag, profileData]);

  const logoutUser = () => {
    logout();
    navigate('/universities');
  };

  const navigateToQuestion = (path: string, quest?: string) => {
    navigate(path, { state: { quest } });
  };

  // User avatar configuration
  const config = () => {
    const avatarConfig = genConfig(userDb?.name || '');
    if (avatarConfig.hairStyle === 'womanLong') {
      avatarConfig.hairStyle = 'womanShort';
    } else if (avatarConfig.hairStyle === 'thick') {
      avatarConfig.hairStyle = 'normal';
    }
    return avatarConfig;
  };

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.errorContainer}>
          <h1 className={styles.error}>Error!</h1>
        </div>
      ) : (
        <>
          <div className={styles.profileHeader}>
            <h1 className={styles.title}>Profile</h1>
            <div className={styles.logoutButton}>
              <Button
                variant="contained"
                style={{
                  width: '100px',
                  height: '40px',
                  borderRadius: '5px',
                  color: 'white',
                  backgroundColor: '#41709b',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
                onClick={logoutUser}
              >
                Log out
              </Button>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileContainer}>
              <div className={styles.avatar}>
                <Avatar
                  style={{
                    width: '125px',
                    height: '125px',
                    border: '2px solid black'
                  }}
                  {...config()}
                />
              </div>
              <div className={styles.profileDetails}>
                <h1 className={styles.profileName}>{userDb?.name}</h1>
                <h2 className={styles.profileEmail}>{userDb?.email}</h2>
              </div>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <Typography variant="h6">Assessment Watchlist</Typography>
                <Typography variant="h4">
                  {
                    userDb?.watchList.filter(
                      (i) => i.watchType == WatchListType.ASSESSMENT
                    ).length
                  }
                </Typography>
              </div>
              <div className={styles.stat}>
                <Typography variant="h6">Questions</Typography>
                <Typography variant="h4">{userDb?.questions.length}</Typography>
              </div>
              <div className={styles.stat}>
                <Typography variant="h6">Question Watchlist</Typography>
                <Typography variant="h4">
                  {
                    userDb?.watchList.filter(
                      (i) => i.watchType == WatchListType.QUESTION
                    ).length
                  }
                </Typography>
              </div>

              <div className={styles.stat}>
                <Typography variant="h6">Answers</Typography>
                <Typography variant="h4">{userDb?.answers.length}</Typography>
              </div>
            </div>
          </div>
        </>
      )}
      {isLoading && !error ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      ) : error ? null : (
        <>
          <div className={styles.profileTags}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                color={selectedTag === tag ? 'primary' : 'default'}
                onClick={() => setSelectedTag(tag)}
                style={{
                  backgroundColor: selectedTag === tag ? '#41709b' : '#e0e0e0'
                }}
              />
            ))}
          </div>

          <div className={styles.profileCards}>
            {selectedCardData.length === 0 ? (
              <div>
                <h2 className={styles.noData}>
                  There are no {selectedTag.toLowerCase()} to display
                </h2>
              </div>
            ) : (
              <>
                {selectedCardData.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => navigateToQuestion(card.Path, card.id)}
                  >
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
        </>
      )}
    </div>
  );
}
