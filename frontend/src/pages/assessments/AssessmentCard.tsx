import { Button } from '@mui/material';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import styles from './AssessmentCard.module.css';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/UserContext';
import API from '../../util/api';
import {
  UpdateWatchListAction,
  UpdateWatchListDTO,
  WatchListType
} from '@shared/types/models/user/user';
import usePut from '../../hooks/usePut';
import { AxiosError } from 'axios';
import LoginPopup from '../../components/LoginPopup/LoginPopup';

type AssessmentCardProps = {
  assessment: {
    _id?: string;
    type: AssessmentType;
    number?: number;
    year: number;
    semester: SemesterType;
  };
  onClick: () => void;
};

export default function AssessmentCard({
  assessment,
  onClick
}: AssessmentCardProps) {
  const [isStarred, setIsStarred] = useState<boolean>(false);

  const { user: currentUser, userDb, refreshUserDb } = useAuth();
  const { putData: updateWatchList } = usePut<UpdateWatchListDTO, null>(
    `${API.updateWatchList}/${userDb?._id}`
  );

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (assessment) {
      if (userDb) {
        setIsStarred(
          userDb.watchList.find(
            (entry) => entry.watchedId === assessment._id
          ) !== undefined
        );
      }
    }
  }, [userDb]);

  const handleIsStarredChange = async (newValue: boolean) => {
    if (!currentUser || !userDb) {
      setShowLoginPopup(true);
      return;
    }
    setIsStarred(newValue);

    const res = await updateWatchList({
      watchedId: assessment!._id!, // can change this later
      action: newValue
        ? UpdateWatchListAction.WATCH
        : UpdateWatchListAction.UNWATCH,
      watchType: WatchListType.ASSESSMENT
    });

    if (res instanceof AxiosError) {
      console.log((res.response?.data as { error: string }).error);
      return;
    }

    refreshUserDb();
  };

  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          borderRadius: '10px',
          boxShadow: 3,
          backgroundColor: '#d6dbf4',
          '&:hover': {
            backgroundColor: '#BFBFBF',
            scale: '1.05'
          }
        }}
        style={{
          display: 'block',
          width: '200px',
          color: 'black',
          textTransform: 'none',
          margin: '10px'
        }}
      >
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <div>
            <p className={styles.yearText}>{assessment.year}</p>
            <p className={styles.semesterText}> {assessment.semester}</p>
            {assessment.number && (
              <p className={styles.numberText}>Test {assessment.number}</p>
            )}
          </div>
          <div
            onClick={(event) => {
              event.stopPropagation();
              handleIsStarredChange(!isStarred);
            }}
            title={
              !isStarred
                ? 'Add assessment to watchlist'
                : 'Remove assessment from watchlist'
            }
            style={{
              marginLeft: 'auto',
              marginRight: '8px',
              marginTop: 'auto',
              marginBottom: 'auto',
              cursor: 'pointer' // Add cursor style to indicate clickable
            }}
          >
            {isStarred ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
          </div>
        </div>
      </Button>
      <LoginPopup open={showLoginPopup} setOpen={setShowLoginPopup} />
    </>
  );
}
