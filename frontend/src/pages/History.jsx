import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import HistoryPage from "../modules/History/component/HistoryPage";


export default function History() {
    const [user] = useAuthState(auth);
    return (
        <>
            <HistoryPage />
        </>
    );
}