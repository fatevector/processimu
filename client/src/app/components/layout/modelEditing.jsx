import { useState } from "react";
import { useParams } from "react-router-dom";

import history from "../../utils/history";

import ModelStatisticsPage from "../pages/modelStatisticsPage";
import ModelEditingPage from "../pages/modelEditingPage";

const ModelEditing = () => {
    const { statistics } = useParams();
    const { modelId } = useParams();
    const [statisticsData, setStatisticsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const goToEditor = () => {
        history.push(`/edit/${modelId ? modelId : "new"}`);
    };

    const goToStatistics = () => {
        history.push(`/edit/${modelId ? modelId : "new"}/statistics`);
    };

    return (
        <>
            <ul className="nav nav-tabs ">
                <li className="nav-item col-6">
                    <button
                        className={`nav-link ${
                            !statistics ? "active" : ""
                        } col-12`}
                        onClick={goToEditor}
                    >
                        Модель
                    </button>
                </li>
                <li className="nav-item col-6">
                    <button
                        className={`nav-link ${
                            statistics === "statistics" ? "active" : ""
                        } col-12`}
                        onClick={goToStatistics}
                    >
                        Статистика
                    </button>
                </li>
            </ul>
            <ModelStatisticsPage
                hidden={statistics !== "statistics"}
                statisticsData={statisticsData}
                loading={loading}
            />
            <ModelEditingPage
                hidden={statistics === "statistics"}
                loading={loading}
                setLoading={setLoading}
                setStatisticsData={setStatisticsData}
            />
        </>
    );
};

export default ModelEditing;
