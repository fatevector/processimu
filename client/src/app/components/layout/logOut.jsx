import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { logOut } from "../../store/auth";
import Loader from "../common/loader";

const LogOut = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(logOut());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="m-3">
            <Loader />
        </div>
    );
};

export default LogOut;
