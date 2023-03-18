import history from "../../utils/history";

const Logo = ({ to }) => {
    return (
        <a onClick={() => history.push(to)} className="logo">
            PROCESSIMU
        </a>
    );
};

export default Logo;
