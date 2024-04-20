import React from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material'; // Import necessary components from Material-UI
import styles from './UniversityCard.module.css';
import { useNavigate } from 'react-router-dom';

type UniversityCardProps = {
  university: {
    id: number;
    name: string;
    image: string;
  };
};

const UniversityCard = ({ university }: UniversityCardProps) => {
  const navigate = useNavigate();
  const onClick = () => {
    console.log('You clicked on the university card!');
  };
  return (
    <Card
      elevation={2}
      style={{
        backgroundColor: '#D9D9D9',
        backgroundImage: `url(${university.image})`,
        flex: 1,
        height: '310px',
        width: '230px',
        margin: '10px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)'
      }}
    >
      <CardActionArea
        style={{
          display: 'flex',
          height: 'inherit',
          justifyContent: 'space-between',
          padding: '12px 16px',
          marginTop: '30px',
          alignItems: 'flex-end'
        }}
        onClick={() => navigate(`/university/${university.id}`)}
      >
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0px',
            width: '100%',
            textOverflow: 'ellipsis'
          }}
        >
          <p className={styles.universityName}>{university.name}</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UniversityCard;
