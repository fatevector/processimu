import TextField from "./textField";

const EditableTitle = ({ initData, mode }) => {
    const [data, setData] = useState(initData);
    return mode ? <TextField /> : <h3>{data.value}</h3>;
};

export default EditableTitle;
