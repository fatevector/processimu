import { useState } from "react";
import { useParams } from "react-router-dom";

import RegistrationForm from "../ui/registrationForm";

const Auth = () => {
    const { type } = useParams();
    const [formType, setFormType] = useState(
        type === "registration" ? type : "login"
    );

    const handleToggleFormType = () => {
        setFormType(prevState =>
            prevState === "login" ? "registration" : "login"
        );
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {formType === "registration" ? (
                        <>
                            <h3 className="mb-4">Регистрация</h3>
                            <RegistrationForm />
                            <p className="d-flex align-items-baseline">
                                Уже имеете аккаунт?
                                <button
                                    className="btn btn-link"
                                    onClick={handleToggleFormType}
                                >
                                    Войти
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="mb-4">Вход</h3>
                            {/* <LoginForm /> */}
                            <p className="d-flex align-items-baseline">
                                Нет аккаунта?
                                <button
                                    className="btn btn-link"
                                    onClick={handleToggleFormType}
                                >
                                    Зарегистрироваться
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
