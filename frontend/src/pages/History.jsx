import SidebarLayout from "../components/SidebarLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import HistoryPage from "../components/HistoryPage";


export default function History() {
    const [user] = useAuthState(auth);
    return (
        <>
            <HistoryPage />
        </>
    );
}