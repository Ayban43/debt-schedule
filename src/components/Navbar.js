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

const Navbar = () => {
    const [click, setClick] = useState(false);
    const navigate = useNavigate()
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('')
    const [showMenuDropDown, setShowMenuDropDown] = useState(false);

    async function signOutUser() {
        const { error } = await supabase.auth.signOut()
        navigate("/login")
    }

    const toggleDropdown = () => {
        setShowMenuDropDown(!showMenuDropDown);
    };

    // const queryResults = useContext(SupabaseContext);

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value => {
                //setState({ status: 'loaded' });
                // value.data.user
                if (value.data?.user) {

                    //console.log(value.data.user)
                    setEmail(value.data.user.email)
                    //setUser(value.data.user)
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
                        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                            <img src={logo} alt="Logo" />
                            Debt Schedule
                        </Link>
                        <div className="menu-icon" onClick={handleClick}>
                            {click ? <FaTimes /> : <FaBars />}
                        </div>
                        <ul className={click ? "nav-menu active" : "nav-menu"}>
                            <li className="nav-item">
                                <NavLink
                                    to="/" className={({ isActive }) =>
                                        "nav-links" + (isActive ? " activated" : "")
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Dashboard
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>

                                    <li className="nav-item">
                                        <NavLink
                                            to="/debt" className={({ isActive }) =>
                                                "nav-links" + (isActive ? " activated" : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            Details
                                        </NavLink>
                                    </li>
                                </>
                            ) : ""}



                            {isLoggedIn ? (
                                <>

                                    {/* <li className="nav-item">
                                        <NavLink
                                            className={({ isActive }) =>
                                                "nav-links" + (isActive ? " " : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            {email}
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink
                                            className={({ isActive }) =>
                                                "nav-links" + (isActive ? " " : "")
                                            }
                                            onClick={closeMobileMenu}
                                        >
                                            <GrLogout onClick={() => signOutUser()} />
                                        </NavLink>
                                    </li> */}

                                    <div className="pl-4 border-l-2 relative  inline-block items-center md:order-2">
                                        <button onClick={toggleDropdown} type="button" className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                            <span className="sr-only">Open user menu</span>
                                            <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo"></img>
                                        </button>
                                        {showMenuDropDown &&

                                            <div className="z-50 absolute right-0 -left-24 mt-2 w-56 origin-top-right text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                                <div className="px-4 py-3">
                                                    {/* <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span> */}
                                                    <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">{email}</span>
                                                </div>
                                                <ul className="py-2" aria-labelledby="user-menu-button">
                                                    <Link to="../edit-profile">
                                                        <li className="divide-y divide-gray-100 rounded-lg">
                                                            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit Profile</span>
                                                        </li>
                                                    </Link>
                                                    <li>
                                                        <span onClick={() => signOutUser()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white hover:cursor-pointer">Sign out</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        }


                                    </div>

                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/login" className={({ isActive }) =>
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
