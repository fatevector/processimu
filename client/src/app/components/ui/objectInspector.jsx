import { useCallback, useEffect, useState } from "react";

import ParamsEditingForm from "./paramsEditingForm";

const ObjectInspector = ({
    selected,
    modelParams,
    setModelParamsTroughPrevState,
    getDeviceParams,
    setDeviceParams
}) => {
    const [formData, setFormData] = useState({});

    const setData = useCallback(
        () =>
            selected.elementType === "model"
                ? setModelParamsTroughPrevState
                : selected.elementType === "device"
                ? setDeviceParams(selected?.id)
                : null,
        [selected, setDeviceParams, setModelParamsTroughPrevState]
    );

    let data =
        selected.elementType === "model"
            ? modelParams
            : selected.elementType === "device"
            ? getDeviceParams(selected?.id)
            : null;

    useEffect(() => {
        setFormData(data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    const handleChange = useCallback(
        target => {
            console.log({ [target.name[0]]: target.value });
            setData()({ [target.name[0]]: target.value });
            setFormData(prev => ({
                ...prev,
                [target.name[0]]: target.value
            }));
        },
        [setData, setFormData]
    );

    if (!setData() || !data)
        return (
            <div className="objectInspector shadow p-2 rounded border">
                <h5>Инспектор объектов</h5>
            </div>
        );

    return (
        <div className="objectInspector shadow p-2 rounded border">
            <h5>Инспектор объектов</h5>
            <ParamsEditingForm
                selected={selected}
                data={formData}
                handleChange={handleChange}
            />
        </div>
    );
};

export default ObjectInspector;
