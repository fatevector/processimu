const generateAuthError = message => {
    switch (message) {
        case "EMAIL_EXISTS":
            return "Пользователь с такой электронной почтой уже существует";
        case "INVALID_PASSWORD":
            return "Почта или пароль введены некорректно";
        case "EMAIL_NOT_FOUND":
            return "Почта или пароль введены некорректно";
        default:
            return "Слишком много попыток входа. Попробуйте позднее";
    }
};

export default generateAuthError;
