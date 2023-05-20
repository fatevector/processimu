import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getUserModelById } from "../../store/auth";

const ModelStatisticsPage = ({ hidden }) => {
    const { modelId } = useParams();
    const model = useSelector(getUserModelById(modelId));
    return (
        <div className="m-3" hidden={hidden}>
            <h3 className="mb-3 me-2">{model.title}</h3>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column align-items-center shadow p-2 rounded border me-3">
                    <div className="">Устройство 1</div>
                    <div className="">Устройство 2</div>
                    <div className="">Устройство 3</div>
                </div>
                <div className="d-flex flex-column align-items-center shadow p-2 rounded border w-50">
                    <div className="">Свойство 1</div>
                    <div className="">Свойство 2</div>
                </div>
            </div>
        </div>
    );
};

export default ModelStatisticsPage;
