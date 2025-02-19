import { Card, CardActionArea, CardContent } from '@mui/material'; // Import necessary components from Material-UI
import styles from './UniversityCard.module.css';
import { useNavigate } from 'react-router-dom';
import { mapIdToImage } from '../../util/utils';

type UniversityCardProps = {
  university: {
    id: string;
    name: string;
    image: string;
  };
};

const UniversityCard = ({ university }: UniversityCardProps) => {
  const navigate = useNavigate();
  return (
    <Card
      elevation={15}
      className={`${styles.universityCard}`}
      style={{
        backgroundImage: `url(${mapIdToImage(university.image)})`,
        height: '310px',
        width: '230px',
        margin: '10px',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: '1px',
        borderRadius: '13px'
      }}
    >
      <CardActionArea
        style={{
          display: 'flex',
          height: 'inherit',
          justifyContent: 'space-between',
          padding: '12px 16px',
          alignItems: 'flex-end'
        }}
        onClick={() => navigate(`/${university.id}`)}
      >
        <CardContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex',
            padding: '0px',
            width: '100%',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word'
          }}
        >
          <p className={styles.universityName}>{university.name}</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UniversityCard;
