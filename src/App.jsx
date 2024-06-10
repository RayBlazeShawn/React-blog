import './App.css'
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import authService from "./appwrite/auth.js";
import {login, logout} from "./store/authSlice.js";
import {Footer, Header} from "./components/index.js";

function App() {
    const [loading, setLoading] = React.useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        authService.getCurrentUser()
            .then((userData) => {
                if (userData) {
                    dispatch(login(userData))
                } else {
                    dispatch(logout())
                }
            })
            .finally(() => setLoading(false))
    }, []);

    return !loading ? (
        <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
            <div className='w-full block'>
                <Header />
                <main>
                    {/*TODO:  <Outlet />*/}
                </main>
                <Footer />
            </div>
        </div>
    ) : null
}
export default App
