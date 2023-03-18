import React from "react";
import { Link } from "react-router-dom";

import Logo from "./logo";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedIng = false;

    return (
        <nav className="navbar mb-3 border border-secondary-subtle">
            <div className="container-fluid">
                <ul className="nav d-flex align-items-baseline">
                    <li className="nav-item">
                        <Logo to="/" />
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            Создать
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/models">
                            Модели
                        </Link>
                    </li>
                </ul>
                <ul className="d-flex align-items-baseline nav">
                    {isLoggedIng ? (
                        <>
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
