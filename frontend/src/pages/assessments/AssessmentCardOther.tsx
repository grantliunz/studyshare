import { Button } from '@mui/material';
import styles from './AssessmentCard.module.css';
import {
  AssessmentType,
  SemesterType
} from '@shared/types/models/assessment/assessment';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import usePut from '../../hooks/usePut';
import { useAuth } from '../../contexts/UserContext';
import {
  UpdateWatchListAction,
  UpdateWatchListDTO,
  WatchListType
} from '@shared/types/models/user/user';
import { useEffect, useState } from 'react';
import API from '../../util/api';
import { AxiosError } from 'axios';
import LoginPopup from '../../components/LoginPopup/LoginPopup';

type AssessmentCardOtherProps = {
  assessment: {
    _id?: string;
    type: AssessmentType;
    number?: number;
    year: number;
    semester: SemesterType;
    name?: string;
  };
  onClick: () => void;
};

export default function AssessmentCardOther({
  assessment,
  onClick
}: AssessmentCardOtherProps) {
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
          backgroundColor: '#d6dbf4',
          '&:hover': {
            backgroundColor: '#BFBFBF',
            scale: '1.05'
          },
          display: 'block',
          width: '300px',
          color: 'black',
          textTransform: 'none',
          margin: '10px'
        }}
        style={{ padding: '10px', textAlign: 'left' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <p className={styles.yearText}>{assessment.name}</p>
            <p className={styles.otherYearText}>{assessment.year}</p>
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
