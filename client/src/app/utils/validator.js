export const validator = (data, config) => {
    const errors = {};
    const validate = (validateMethod, data, config) => {
        let validationFailed = false;
        switch (validateMethod) {
            case "isRequired": {
                if (typeof data === "boolean") {
                    validationFailed = !data;
                } else if (typeof data === "number") {
                    validationFailed = !data;
                } else {
                    validationFailed = data.trim() === "";
                }
                break;
            }
            case "isEmail": {
                const emailRegExp = /^\S+@\S+\.\S+$/g;
                validationFailed = !emailRegExp.test(data);
                break;
            }
            case "isCapitalSymbol": {
                const capitalRegExp = /[A-Z]+/g;
                validationFailed = !capitalRegExp.test(data);
                break;
            }
            case "isDigit": {
                const digitRegExp = /\d+/g;
                validationFailed = !digitRegExp.test(data);
                break;
            }
            case "isPrice": {
                const priceRegExp = /^\d+([.,](\d){1,2})?$/g;
                validationFailed = !priceRegExp.test(data);
                break;
            }
            case "minLength": {
                validationFailed = data.length < config.value;
                break;
            }
            default:
                break;
        }
        if (validationFailed) return config.message;
    };
    for (const fieldName in data) {
        for (const validateMethod in config[fieldName]) {
            const error = validate(
                validateMethod,
                data[fieldName],
                config[fieldName][validateMethod]
            );
            if (error) {
                errors[fieldName] = error;
                break;
            }
        }
    }
    return errors;
};
