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

    const notificationsBeforeSorting = fakeNotificationData();
    console.log(notificationsBeforeSorting);
    const notifications = notificationsBeforeSorting.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    console.log("after")
    console.log(notifications);

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
            questionID: "5",
            commenterName: "Alex",
            questionSummary: "How to debug JavaScript code effectively?",
            timestamp: new Date("2024-04-30T22:00:00"),
        },
        {
            questionID: "6",
            commenterName: "Emily",
            questionSummary: "How to create responsive web designs?",
            timestamp: new Date("2024-04-30T22:00:00"),
        },
        {
            questionID: "7",
            commenterName: "David",
            questionSummary: "What are the best practices for API design?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "8",
            commenterName: "Olivia",
            questionSummary: "How to implement authentication in a web application?",
            timestamp: new Date("2024-04-28T22:00:00"),
        },
        {
            questionID: "9",
            commenterName: "Sophia",
            questionSummary: "What are the benefits of using TypeScript?",
            timestamp: new Date("2024-05-01T20:00:00"),
        },
        {
            questionID: "10",
            commenterName: "Liam",
            questionSummary: "How to optimize database queries?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "11",
            commenterName: "Emma",
            questionSummary: "What are the best practices for version control?",
            timestamp: new Date("2024-04-30T22:00:00"),
        },
        {
            questionID: "12",
            commenterName: "Noah",
            questionSummary: "How to deploy a web application to a server?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "13",
            commenterName: "Ava",
            questionSummary: "How to write efficient JavaScript code?",
            timestamp: new Date("2024-05-01T21:00:00"),
        },
        {
            questionID: "14",
            commenterName: "William",
            questionSummary: "What are the best practices for error handling in JavaScript?",
            timestamp: new Date("2024-04-29T22:00:00"),
        },
        {
            questionID: "15",
            commenterName: "Mia",
            questionSummary: "How to improve website accessibility?",
            timestamp: new Date("2024-05-01T22:00:00"),
        },
        {
            questionID: "16",
            commenterName: "James",
            questionSummary: "What are the advantages of using a front-end framework?",
            timestamp: new Date("2024-04-30T22:00:00"),
        },
    ];
}

