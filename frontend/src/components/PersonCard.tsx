import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Avatar, { genConfig } from 'react-nice-avatar';
import React from 'react';

type PersonCardProps = {
  name: string;
  avatarPos?: 'top' | 'bottom' | 'left' | 'right';
  avatarSize?: string;
  style?: React.CSSProperties;
  anonymous?: boolean;
};

const posMap: {
  [key: string]: 'column' | 'column-reverse' | 'row' | 'row-reverse';
} = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse'
};

const config = (name: string) => {
  const avatarConfig = genConfig(name || '');
  if (avatarConfig.hairStyle === 'womanLong') {
    avatarConfig.hairStyle = 'womanShort';
  } else if (avatarConfig.hairStyle === 'thick') {
    avatarConfig.hairStyle = 'normal';
  }
  return avatarConfig;
}

const PersonCard = ({
  name,
  avatarPos = 'top',
  avatarSize = '24px',
  style,
  anonymous = false
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
      {anonymous ? (
         <AccountCircleOutlinedIcon style={{ fontSize: avatarSize }} />
      ) :
        <Avatar
          style={{ width: avatarSize, height: avatarSize }}
          {...config(name)}
        />
      }
     
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
