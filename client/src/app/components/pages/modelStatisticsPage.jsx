import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getUserModelById } from "../../store/auth";

const ModelStatisticsPage = ({ hidden, statisticsData, loading }) => {
    const { modelId } = useParams();
    const model = useSelector(getUserModelById(modelId));
    const [selected, setSelected] = useState(null);
    const selectedDevice = statisticsData?.find(
        device => device.id === selected
    );

    return (
        <div className="m-3" hidden={hidden}>
            {/* TODO: сделать подхват изменения названия не только после сохранения */}
            <h3 className="mb-3 me-2">{model?.title || "Новая модель"}</h3>
            <div className="d-flex flex-row justify-content-center">
                {loading ? (
                    <h5 className="d-flex flex-column align-items-center">
                        Пожалуйста, подождите. Идет симуляция.
                    </h5>
                ) : statisticsData &&
                  Array.isArray(statisticsData) &&
                  statisticsData.length !== 0 ? (
                    <>
                        <div className="d-flex flex-column shadow p-2 rounded border me-3 col-4">
                            {statisticsData.map(device => (
                                <div
                                    className={`d-flex justify-content-center p-1 border rounded overflow-hidden mb-1 ${
                                        selected === device.id
                                            ? "border-primary"
                                            : ""
                                    }`}
                                    key={device.id}
                                    onClick={() => setSelected(device.id)}
                                >
                                    {device.name}
                                </div>
                            ))}
                        </div>
                        <div className="d-flex flex-column align-items-start shadow p-3 rounded border w-50">
                            {selectedDevice?.stats?.map(s => (
                                <h6 className="" key={s.name}>
                                    {s.label}: {s.value}
                                </h6>
                            )) || (
                                <h5>
                                    Выберите устройство для просмотра статистики
                                </h5>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        <h5>Нет данных статистики.</h5>
                        <h5>
                            Чтобы собрать данные, запустите симуляцию модели.
                        </h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModelStatisticsPage;
