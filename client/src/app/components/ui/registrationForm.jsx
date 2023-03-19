import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { validator } from "../../utils/validator";
import history from "../../utils/history";
import { getAuthErrors, signUp } from "../../store/auth";

import TextField from "../common/textField";

const RegistrationForm = () => {
    const dispatch = useDispatch();
    const authError = useSelector(getAuthErrors());

    const [data, setData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = target => {
        setData(prevState => ({
            ...prevState,
            [target.name]: target.value
        }));
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Электронная почта введена некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязательно для заполнения"
            }
        },
        password: {
            isRequired: { message: "Пароль обязателен для заполнения" },
            isCapitalSymbol: {
                message: "Пароль должен содержать хотя бы одну заглавную букву"
            },
            isDigit: {
                message: "Пароль должен содержать хотя бы одну цифру"
            },
            minLength: {
                message: "Пароль должен состоять минимум из 8 символов",
                value: 8
            }
        }
    };

    const isValid = Object.keys(errors).length === 0;

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        validate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleSubmit = e => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const redirect = history.location.state
            ? history.location.state.from.pathname
            : "/";
        dispatch(signUp({ payload: data, redirect }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Электронная почта"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
            />
            <TextField
                label="Имя"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
            />
            <TextField
                label="Пароль"
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                error={errors.password}
            />
            {authError && <p className="text-danger">{authError}</p>}
            <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
            >
                Зарегистрироваться
            </button>
        </form>
    );
};

export default RegistrationForm;
