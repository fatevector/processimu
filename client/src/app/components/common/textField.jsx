import React, { useState } from "react";

const TextField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    placeholder
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const getInputClasses = () =>
        "form-control text-body bg-body" + (error ? " is-invalid" : "");

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleChange = ({ target }) => {
        onChange({ name: [target.name], value: target.value });
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="text-body bg-body">
                    {label}
                </label>
            )}
            <div className="input-group has-validation">
                <input
                    type={showPassword ? "text" : type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className={getInputClasses()}
                    placeholder={placeholder}
                />
                {type === "password" && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={toggleShowPassword}
                    >
                        <i
                            className={
                                "bi bi-eye" + (showPassword ? "-slash" : "")
                            }
                        ></i>
                    </button>
                )}
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    );
};

export default TextField;
