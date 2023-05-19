import ParamsEditingForm from "./paramsEditingForm";

const ObjectInspector = ({ selected }) => {
    return (
        <div className="objectInspector shadow p-2 rounded border">
            <h5>Инспектор объектов</h5>
            <ParamsEditingForm selected={selected} />
        </div>
    );
};

export default ObjectInspector;
