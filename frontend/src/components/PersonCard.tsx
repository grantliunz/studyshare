import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import React from 'react';

type PersonCardProps = {
  name: string;
  avatarPos?: 'top' | 'bottom' | 'left' | 'right';
  avatarSize?: string;
  style?: React.CSSProperties;
};

const posMap: {
  [key: string]: 'column' | 'column-reverse' | 'row' | 'row-reverse';
} = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse'
};

const PersonCard = ({
  name,
  avatarPos = 'top',
  avatarSize = '24px',
  style
}: PersonCardProps) => {
  return (
    <div
      style={{
        display: 'flex',
        placeItems: 'center',
        flexDirection: posMap[avatarPos],
        ...style
      }}
    >
      <AccountCircleOutlinedIcon style={{ fontSize: avatarSize }} />
      <p
        style={{
          margin: '0px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          wordWrap: 'break-word',
          maxLines: '3'
        }}
      >
        {name}
      </p>
    </div>
  );
};

export default PersonCard;
