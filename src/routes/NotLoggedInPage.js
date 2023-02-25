import { useNavigate } from 'react-router-dom'
import "../styles/NotLoggedIn.css"

export default function NotLoggedInPage() {
    const navigate = useNavigate()
    // console.error(error);

    return (
        <div className="not-logged-in-page">
            <h1>Not Logged In!</h1>
            <button onClick={() => { navigate("/login") }}>Go to login page</button>
        </div>

    )
}