import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { CardActionArea } from "@mui/material";
import style from "./ProfileCard.module.css";

interface ProfileCardProps {
  QuestionTitle: string;
  QuestionContent: string;
  QuestionYear: string;
  DateCreated: string;
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  QuestionTitle,
  QuestionContent,
  QuestionYear,
  DateCreated
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
            <p className={style.title}>{QuestionTitle}</p>
            <p className={style.date}>{DateCreated}</p>
          </div>
          <div className={style.body}>
            <p className={style.content}>{QuestionContent}</p>
            <p className={style.year}>{QuestionYear}</p>
          </div>
        </CardContent>
      </CardActionArea>

    </Card>
  );
};

export default ProfileCard;
