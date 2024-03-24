import Button from "@mui/material/Button";
import { User } from "firebase/auth";
import { logout } from "../../util/firebase";

export default function Landing({ user }: { user: User | null }) {
    return (
        <div>
            <h1>Landing Page</h1>
            {!user ? (
                <Button variant="contained" color="primary" href="/login">
                    Login
                </Button>
            ) : (
                <>
                    <p>{user.email}</p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={logout}
                    >
                        Log out
                    </Button>
                </>
            )}
        </div>
    );
}
