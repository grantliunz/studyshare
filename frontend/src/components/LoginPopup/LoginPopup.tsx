import { useState } from "react"
import LoginCard from "../LoginCard/LoginCard"
import { Fade, Modal } from "@mui/material"
import styles from './LoginPopup.module.css'

interface LoginPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function LoginPopup({ open, setOpen }: LoginPopupProps) {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >   
            <div className={styles.modal}>
                <LoginCard />
            </div>
                
        </Modal>
    )
}