import { useCallback, useRef } from "react";

import TextField from "../common/textField";
import SelectField from "../common/selectField";

const ParamsEditingForm = ({
    selected,
    data,
    handleChange,
    buffers,
    facilities
}) => {
    const fieldsList = useRef([]).current;
    const getFieldsList = useCallback(() => {
        fieldsList.length = 0;
        const setFieldsForDistribution = distribution => {
            switch (distribution) {
                case "exponential":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({ label: "λ", name: "lambda" });
                    break;
                case "gamma":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({ label: "α", name: "alpha" });
                    fieldsList.push({ label: "β", name: "beta" });
                    break;
                case "normal":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({ label: "μ", name: "mu" });
                    fieldsList.push({ label: "σ", name: "sigma" });
                    break;
                case "pareto":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({ label: "α", name: "alpha" });
                    break;
                case "triangular":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({
                        label: "Минимальное значение",
                        name: "lower"
                    });
                    fieldsList.push({
                        label: "Максимальное значение",
                        name: "upper"
                    });
                    fieldsList.push({
                        label: "Наиболее вероятное значение",
                        name: "mode"
                    });
                    break;
                case "uniform":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({
                        label: "Минимальное значение",
                        name: "lower"
                    });
                    fieldsList.push({
                        label: "Максимальное значение",
                        name: "upper"
                    });
                    break;
                case "weibull":
                    fieldsList.push({
                        label: "Распределение",
                        name: "distribution"
                    });
                    fieldsList.push({ label: "α", name: "alpha" });
                    fieldsList.push({ label: "β", name: "beta" });
                    break;
                default:
                    break;
            }
        };
        switch (selected.type) {
            case "source":
                setFieldsForDistribution(data.distribution);
                break;
            case "buffer":
                fieldsList.push({ label: "Вместимость", name: "capacity" });
                fieldsList.push({
                    label: "Начальная емкость",
                    name: "initValue"
                });
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
                setFieldsForDistribution(data.distribution);
                break;
            case "delay":
                setFieldsForDistribution(data.distribution);
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
    }, [fieldsList, selected, data]);

    getFieldsList();

    const availableBuffers = buffers.map(buffer => ({
        label: buffer.name,
        value: buffer.id
    }));
    const availableFacilities = facilities.map(facility => ({
        label: facility.name,
        value: facility.id
    }));
    const availableDistributions = [
        // TODO: через этот массив можно сделать значения по умолчанию
        {
            label: "Экспоненциальное",
            value: "exponential"
        },
        {
            label: "Гамма",
            value: "gamma"
        },
        {
            label: "Нормальное",
            value: "normal"
        },
        {
            label: "Парето",
            value: "pareto"
        },
        {
            label: "Триангулярное",
            value: "triangular"
        },
        {
            label: "Равномерное",
            value: "uniform"
        },
        {
            label: "Вейбулла",
            value: "weibull"
        }
    ];

    return (
        <form>
            <label>Выбранный элемент:</label>
            <div>{data?.name ?? "model"}</div>
            {selected?.type !== "model" && (
                <TextField
                    label={"Название"}
                    name={"name"}
                    value={data?.name || ""}
                    onChange={handleChange}
                    key={"name"}
                />
            )}
            {fieldsList.map(field => {
                if (field.name === "distribution") {
                    return (
                        <SelectField
                            label={field?.label}
                            name={field?.name}
                            value={data?.[field?.name] || ""}
                            onChange={handleChange}
                            defaultOption="Выберите распределение..."
                            options={availableDistributions}
                            key={field?.name}
                        />
                    );
                }
                if (field.name === "bufferId") {
                    return (
                        <SelectField
                            label={field?.label}
                            name={field?.name}
                            value={data?.[field?.name] || ""}
                            onChange={handleChange}
                            defaultOption="Выберите буфер..."
                            options={availableBuffers}
                            key={field?.name}
                        />
                    );
                }
                if (field.name === "facilityId") {
                    return (
                        <SelectField
                            label={field?.label}
                            name={field?.name}
                            value={data?.[field?.name] || ""}
                            onChange={handleChange}
                            defaultOption="Выберите оборудование..."
                            options={availableFacilities}
                            key={field?.name}
                        />
                    );
                }
                return (
                    <TextField
                        label={field?.label}
                        name={field?.name}
                        value={data?.[field?.name] || ""}
                        onChange={handleChange}
                        key={field?.name}
                    />
                );
            })}
        </form>
    );
};

export default ParamsEditingForm;
