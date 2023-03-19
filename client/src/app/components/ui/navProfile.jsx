import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavProfile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
    };

    if (!true) return "Loading...";
    return (
        <div className="dropdown" onClick={toggleMenu}>
            <div className="btn dropdown-toggle d-flex align-items-center text-body">
                <div className="me-2">Name</div>
            </div>
            <div className={"w-100 dropdown-menu " + (isOpen ? "show" : "")}>
                {/* <Link to={`/profile`} className="dropdown-item">
                    Профиль
                </Link> */}
                <Link to="/logout" className="dropdown-item">
                    Выйти
                </Link>
            </div>
        </div>
    );
};

export default NavProfile;
