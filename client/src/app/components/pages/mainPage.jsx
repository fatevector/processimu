import { useSelector } from "react-redux";

import { getDataStatus } from "../../store/auth";

const MainPage = () => {
    const isDataLoaded = useSelector(getDataStatus());
    return (
        <div className="m-3">
            <h3>Главная страница</h3>
            <article>
                <h5>Схема использования сервиса:</h5>
                <ol>
                    {!isDataLoaded && <li>Авторизуйтесь</li>}
                    <li>
                        Создайте модель, либо откройте сохраненную модель, либо
                        импортируйте файл конфигурации модели
                    </li>
                    <li>Измените модель (по желанию)</li>
                    <li>Запустите симуляцию модели</li>
                    <li>
                        Просмотрите статистику симуляции и при желании
                        эспортируйте файл статистики
                    </li>
                </ol>
            </article>
        </div>
    );
};

export default MainPage;
