import { Fade, Modal } from "@mui/material";
import styles from "./NotificationsWindow.module.css";
import { NotificationDTO } from "@shared/types/models/notification/NotificationDTO";  

interface NotificationsWindowProps {
    open: boolean;
    onClose: () => void;
}

export default function NotificationsWindow ({
  open,
  onClose,
}: NotificationsWindowProps) {
    return (
        <Modal 
        open={open}
        onClose={onClose}
        aria-labelledby="add-university-modal"
        aria-describedby="add-university-modal-description"
        >
            <div className={styles.modal}>
                asd
            </div>

            
        </Modal>
    );
};

function fakeNotificationData(): NotificationDTO[] {
    return [
        {
            questionID: "1",
            commenterName: "John",
            questionSummary: "How to use React hooks?",
            timestamp: new Date(),
        },
        {
            questionID: "2",
            commenterName: "Jane",
            questionSummary: "What is the best CSS framework?",
            timestamp: new Date(),
        },
        {
            questionID: "3",
            commenterName: "Mike",
            questionSummary: "How to optimize website performance?",
            timestamp: new Date(),
        },
    ];
}
