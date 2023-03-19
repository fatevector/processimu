import React from "react";
import { Link } from "react-router-dom";

import Logo from "./logo";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedIng = true;

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
                    {isLoggedIng ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/creation">
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
