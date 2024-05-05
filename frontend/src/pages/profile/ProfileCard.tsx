import React from "react";
import { Card, CardContent } from "@mui/material";
import { CardActionArea } from "@mui/material";
import style from "./ProfileCard.module.css";

interface ProfileCardProps {
  Title: string;
  Content: string;
  Year: string;
  DateCreated: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  Title,
  Content,
  Year,
  DateCreated,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f0f0",
        borderRadius: 1,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
        minWidth: "100%",
        marginBottom: '10px',
      }}
    >
      <CardActionArea>
        <CardContent className={style.cardContent}>
          <div className={style.header}>
            <p className={style.title}>{Title}</p>
            <p className={style.date}>{DateCreated}</p>
          </div>
          <div className={style.body}>
            <p className={style.content}>{Content}</p>
            <p className={style.year}>{Year}</p>
          </div>
        </CardContent>
      </CardActionArea>

    </Card>
  );
};

export default ProfileCard;
