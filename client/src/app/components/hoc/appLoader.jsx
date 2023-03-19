import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCurrentUserId,
    getDataStatus,
    getIsLoggedIn,
    loadUser
} from "../../store/auth";

import Loader from "../common/loader";

const AppLoader = ({ children }) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn());
    const userId = useSelector(getCurrentUserId());
    const userDataIsLoaded = useSelector(getDataStatus());

    useEffect(() => {
        if (isLoggedIn && !userDataIsLoaded) {
            dispatch(loadUser(userId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userDataIsLoaded, userId]);

    if (isLoggedIn && !userDataIsLoaded) return <Loader />;
    return children;
};

export default AppLoader;
