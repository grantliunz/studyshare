import { Button, Fade, Modal } from "@mui/material";
import styles from "./NotificationsWindow.module.css";
import { NotificationDTO } from "@shared/types/models/notification/NotificationDTO";  
import NotificationCard from "./NotificationCard/NotificationCard";

interface NotificationsWindowProps {
    open: boolean;
    onClose: () => void;
}

export default function NotificationsWindow ({
  open,
  onClose,
}: NotificationsWindowProps) {

    const notifications = fakeNotificationData();

    function navigateToProfilePage() {
        //TODO: navigate to profile page
    }

    return (
        <Modal 
        open={open}
        onClose={onClose}
        aria-labelledby="add-university-modal"
        aria-describedby="add-university-modal-description"
        >
            <div className={styles.modal}>
                {notifications.slice(0, 8).map((notificationObj) => (
                    <NotificationCard notification={notificationObj} />
                ))}
                {notifications.length > 8 && 
                <Button
                onClick={() => {navigateToProfilePage}}
                variant="contained"
                sx={{
                borderRadius: '5px',
                boxShadow: 0,
                }}
                style={{
                backgroundColor: '#FFFFFF',
                color: 'black',
                textTransform: 'none',
                margin: '5px',
                padding:'2px',
                width: '100%'
                }}>
                    view more notifications
                </Button>}
            </div>
                   
        </Modal>
    );
};

function fakeNotificationData(): NotificationDTO[] { // remove when backend is connected
    return [
        {
            questionID: "1",
            commenterName: "John",
            questionSummary: "How to use React hooks?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "2",
            commenterName: "Jane",
            questionSummary: "What is the best CSS framework?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "3",
            commenterName: "Mike",
            questionSummary: "How to optimize website performance?",
            timestamp: new Date("2024-04-28T22:00:00"),
        },
        {
            questionID: "4",
            commenterName: "Sarah",
            questionSummary: "What are the best practices for writing clean code and maintaining code quality in a large codebase?",
            timestamp: new Date("2024-04-27T22:00:00"),
        },
        {
            questionID: "1",
            commenterName: "John",
            questionSummary: "How to use React hooks?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "2",
            commenterName: "Jane",
            questionSummary: "What is the best CSS framework?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "3",
            commenterName: "Mike",
            questionSummary: "How to optimize website performance?",
            timestamp: new Date("2024-04-28T22:00:00"),
        },
        {
            questionID: "4",
            commenterName: "Sarah",
            questionSummary: "What are the best practices for writing clean code and maintaining code quality in a large codebase?",
            timestamp: new Date("2024-04-27T22:00:00"),
        },
        {
            questionID: "1",
            commenterName: "John",
            questionSummary: "How to use React hooks?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "2",
            commenterName: "Jane",
            questionSummary: "What is the best CSS framework?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "3",
            commenterName: "Mike",
            questionSummary: "How to optimize website performance?",
            timestamp: new Date("2024-04-28T22:00:00"),
        },
        {
            questionID: "4",
            commenterName: "Sarah",
            questionSummary: "What are the best practices for writing clean code and maintaining code quality in a large codebase?",
            timestamp: new Date("2024-04-27T22:00:00"),
        },{
            questionID: "1",
            commenterName: "John",
            questionSummary: "How to use React hooks?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "2",
            commenterName: "Jane",
            questionSummary: "What is the best CSS framework?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "3",
            commenterName: "Mike",
            questionSummary: "How to optimize website performance?",
            timestamp: new Date("2024-04-28T22:00:00"),
        },
        {
            questionID: "4",
            commenterName: "Sarah",
            questionSummary: "What are the best practices for writing clean code and maintaining code quality in a large codebase?",
            timestamp: new Date("2024-04-27T22:00:00"),
        },
    ];
}
