import { useCallback, useRef } from "react";

import TextField from "../common/textField";

const ParamsEditingForm = ({ selected, data, handleChange }) => {
    const fieldsList = useRef([]).current;
    const getFieldsList = useCallback(() => {
        fieldsList.length = 0;
        switch (selected.type) {
            case "source":
                // switch (selected.params.distribution) { // TODO: брать параметры не из selected
                //     case "exponential":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "lambda", name: "lambda" }
                //         ];
                //     case "gamma":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "alpha", name: "alpha" },
                //             { label: "beta", name: "beta" }
                //         ];
                //     case "normal":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "mu", name: "mu" },
                //             { label: "sigma", name: "sigma" }
                //         ];
                //     case "pareto":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "alpha", name: "alpha" }
                //         ];
                //     case "triangular":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "Минимальное значение", name: "lower" },
                //             { label: "Максимальное значение", name: "upper" },
                //             {
                //                 label: "Наиболее вероятное значение",
                //                 name: "mode"
                //             }
                //         ];
                //     case "uniform":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "Минимальное значение", name: "lower" },
                //             { label: "Максимальное значение", name: "upper" }
                //         ];
                //     case "weibull":
                //         return [
                //             { label: "Распределение", name: "distribution" },
                //             { label: "alpha", name: "alpha" },
                //             { label: "beta", name: "beta" }
                //         ];
                //     default:
                //         break;
                // }
                break;
            case "buffer":
                fieldsList.push({ label: "Вместимость", name: "capacity" });
                break;
            case "takeFromBuffer":
                fieldsList.push({ label: "Буфер", name: "bufferId" });
                fieldsList.push({ label: "Количество", name: "quantity" });
                break;
            case "putInBuffer":
                fieldsList.push({ label: "Буфер", name: "bufferId" });
                fieldsList.push({ label: "Количество", name: "quantity" });
                break;
            case "facility":
                fieldsList.push({ label: "Вместимость", name: "capacity" });
                break;
            case "takeFacility":
                fieldsList.push({ label: "Оборудование", name: "facilityId" });
                fieldsList.push({
                    label: "Продолжительность",
                    name: "duration"
                });
                break;
            case "delay":
                fieldsList.push({
                    label: "Продолжительность",
                    name: "duration"
                });
                break;
            case "sink":
                break;
            case "model":
                fieldsList.push({ label: "Зерно", name: "seed" });
                fieldsList.push({
                    label: "Продолжительность симуляции",
                    name: "simTime"
                });
                break;
            default:
                break;
        }
        return [];
    }, [fieldsList, selected]);

    getFieldsList();

    return (
        <form>
            {fieldsList.map(
                field => (
                    // <label key={Math.random()}>{field.label}</label>
                    <TextField
                        label={field?.label}
                        name={field?.name}
                        value={data?.[field?.name] || ""}
                        onChange={handleChange}
                        key={field?.name}
                    />
                )
                // console.log(field)
            )}
        </form>
    );
};

export default ParamsEditingForm;
