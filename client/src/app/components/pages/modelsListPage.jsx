import { useSelector } from "react-redux";

import { getUserModels } from "../../store/auth";

const ModelsListPage = () => {
    const userModels = useSelector(getUserModels());

    return (
        <div className="m-3">
            <h3>Сохраненные модели</h3>
            {userModels.length === 0 ? (
                <p>Еще не сохранено ни одной модели</p>
            ) : (
                userModels.map(model => <li>{model}</li>)
            )}
        </div>
    );
};

export default ModelsListPage;
