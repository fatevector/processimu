import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getIsLoggedIn } from "../../store/auth";

import Logo from "./logo";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedIn = useSelector(getIsLoggedIn());

    return (
        <nav className="navbar mb-3 border border-secondary-subtle">
            <div className="container-fluid">
                <ul className="nav d-flex align-items-baseline">
                    <li className="nav-item">
                        <Logo to="/" />
                    </li>
                </ul>
                <ul className="d-flex align-items-baseline nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            Главная
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/edit/new">
                                    Создать
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/models">
                                    Модели
                                </Link>
                            </li>
                            <li className="nav-item">
                                <NavProfile />
                            </li>
                        </>
                    ) : (
                        <Link className="nav-link" to="/login">
                            Войти
                        </Link>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
