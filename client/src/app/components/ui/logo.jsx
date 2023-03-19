import history from "../../utils/history";

const Logo = ({ to }) => {
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a onClick={() => history.push(to)} className="logo">
            PROCESSIMU
        </a>
    );
};

export default Logo;
