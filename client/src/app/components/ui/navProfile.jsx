import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getCurrentUserData } from "../../store/auth";

const NavProfile = () => {
    const currentUser = useSelector(getCurrentUserData());

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
    };

    if (!true) return "Loading...";
    return (
        <div className="dropdown" onClick={toggleMenu}>
            <div className="btn dropdown-toggle d-flex align-items-center text-body">
                <div className="me-2">{currentUser.name}</div>
            </div>
            <div className={"w-100 dropdown-menu " + (isOpen ? "show" : "")}>
                <Link to="/logout" className="dropdown-item">
                    Выйти
                </Link>
            </div>
        </div>
    );
};

export default NavProfile;
