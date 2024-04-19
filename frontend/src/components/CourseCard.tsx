import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import style from './CourseCard.module.css';

interface CourseCardProps {
  courseName: string;
  courseCode: string;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseName,
  courseCode,
  onClick
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#d9d9d9',
        borderRadius: 5,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
        minWidth: 800,
        cursor: 'pointer',
        outline: 'none',
        maxHeight: 70,
        marginBottom: 1
      }}
      onClick={onClick}
    >
      <CardActionArea>
        <CardContent className={style.cardContent}>
          <p className={style.courseCode}>{courseCode}</p>
          <p className={style.courseName}>{courseName}</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;
