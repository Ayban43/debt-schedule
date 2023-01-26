import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Navbar.css"
import { FaBars, FaTimes } from "react-icons/fa"
import { IconContext } from "react-icons/lib"
import logo from "./logo.png"
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { GrLogout } from "react-icons/gr";
import { useContext } from 'react';
import { SupabaseContext } from '..';


const Navbar = () => {
    const [click, setClick] = useState(false);
    const navigate = useNavigate()
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [state, setState] = useState({ status: 'loading' });
    const [user, setUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [email, setEmail] = useState('')


    async function signOutUser() {
        const { error } = await supabase.auth.signOut()
        navigate("/debt-schedule/login")
    }

    // const queryResults = useContext(SupabaseContext);

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value => {
                setState({ status: 'loaded' });
                // value.data.user
                if (value.data?.user) {

                    console.log(value.data.user)
                    setEmail(value.data.user.email)
                    setUser(value.data.user)
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            }))
        }
        getUserData();
    }, [])


    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            console.log(event)
            if (event === 'SIGNED_IN') setIsLoggedIn(true);
            if (event === 'SIGNED_OUT') setIsLoggedIn(false);
        })
    })

    return (
        <>
            <IconContext.Provider value={{ color: "#red" }}>
                <nav className="navbar">
                    <div className="navbar-container container">
                        <Link to="/debt-schedule/" className="navbar-logo" onClick={closeMobileMenu}>
                            <img src={logo} alt="Logo" />
                            Debt Schedule
                        </Link>
                        <div className="menu-icon" onClick={handleClick}>
                            {click ? <FaTimes /> : <FaBars />}
                        </div>
                        <ul className={click ? "nav-menu active" : "nav-menu"}>
                            <li className="nav-item">
                                <NavLink
                                    to="/debt-schedule/" className={({ isActive }) =>
                                        "nav-links" + (isActive ? " activated" : "")
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="debt-schedule/debt" className={({ isActive }) =>
                                        "nav-links" + (isActive ? " activated" : "")
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Debt
                                </NavLink>
                            </li>


                            {isLoggedIn? (
                                <>

                                    <li className="nav-item">
                                        <NavLink
                                            className={({ isActive }) =>
                                                "nav-links" + (isActive ? " " : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            {email}
                                            {/* <span onClick={() => signOutUser()}>Logout</span> */}
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink
                                            className={({ isActive }) =>
                                                "nav-links" + (isActive ? " " : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            <GrLogout onClick={() => signOutUser()}/>                                        
                                            </NavLink>
                                    </li>

                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            to="debt-schedule/login" className={({ isActive }) =>
                                                "nav-links" + (isActive ? " activated" : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            )}

                       
                    </ul>
                </div>
            </nav>
        </IconContext.Provider>
        </>
    );
}

export default Navbar
