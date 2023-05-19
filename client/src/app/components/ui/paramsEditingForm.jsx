const ParamsEditingForm = ({ selected }) => {
    const getFieldsList = selected => {
        switch (selected.type) {
            case "source":
                switch (selected.params.distribution) {
                    case "exponential":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "lambda", name: "lambda" }
                        ];
                    case "gamma":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "alpha", name: "alpha" },
                            { label: "beta", name: "beta" }
                        ];
                    case "normal":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "mu", name: "mu" },
                            { label: "sigma", name: "sigma" }
                        ];
                    case "pareto":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "alpha", name: "alpha" }
                        ];
                    case "triangular":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "Минимальное значение", name: "lower" },
                            { label: "Максимальное значение", name: "upper" },
                            {
                                label: "Наиболее вероятное значение",
                                name: "mode"
                            }
                        ];
                    case "uniform":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "Минимальное значение", name: "lower" },
                            { label: "Максимальное значение", name: "upper" }
                        ];
                    case "weibull":
                        return [
                            { label: "Распределение", name: "distribution" },
                            { label: "alpha", name: "alpha" },
                            { label: "beta", name: "beta" }
                        ];
                    default:
                        break;
                }
                break;
            case "buffer":
                return [{ label: "Вместимость", name: "capacity" }];
            case "takeFromBuffer":
                return [
                    { label: "Буфер", name: "bufferId" },
                    { label: "Количество", name: "quantity" }
                ];
            case "putInBuffer":
                return [
                    { label: "Буфер", name: "bufferId" },
                    { label: "Количество", name: "quantity" }
                ];
            case "facility":
                return [{ label: "Вместимость", name: "capacity" }];
            case "takeFacility":
                return [
                    { label: "Оборудование", name: "facilityId" },
                    { label: "Продолжительность", name: "duration" }
                ];
            case "delay":
                return [{ label: "Продолжительность", name: "duration" }];
            case "sink":
                return [];
            case "model":
                return [
                    { label: "Зерно", name: "seed" },
                    { label: "Продолжительность симуляции", name: "simTime" }
                ];
            default:
                break;
        }
        return [];
    };

    const fieldsList = getFieldsList(selected);

    return (
        <form>
            {fieldsList.map(field => (
                <label key={Math.random()}>{field.label}</label>
            ))}
        </form>
    );
};

export default ParamsEditingForm;
