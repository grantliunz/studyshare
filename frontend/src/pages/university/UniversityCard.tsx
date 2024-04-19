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
        margin: '10px'
      }}
    >
      <CardActionArea
        style={{
          display: 'flex',
          height: 'inherit',
          justifyContent: 'space-between',
          padding: '12px 16px'
        }}
        onClick={() => navigate(`/university/${university.id}`)}
      >
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'flex-end',
            padding: '0px'
          }}
        >
          <Button
            onClick={onClick}
            variant="contained"
            style={{
              fontSize: '1.5rem',
              backgroundColor: 'white',
              color: 'black',
              maxLines: 2
            }}
          >
            {university.name}
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UniversityCard;
