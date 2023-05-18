import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserModels, removeModel } from "../../store/auth";
import displayDate from "../../utils/displayDate";
import orderBy from "../../utils/orderBy";
import history from "../../utils/history";

import Table from "../common/table/table";

const ModelsListPage = () => {
    const dispatch = useDispatch();
    const userModels = useSelector(getUserModels()) || [];

    const [sortBy, setSortBy] = useState({ path: "updatedAt", order: "desc" });

    const onDeleteButtonClick = id => {
        dispatch(removeModel(id));
    };

    const columns = {
        title: {
            path: "title",
            name: "Название модели"
        },
        createdAt: {
            path: "createdAt",
            name: "Время создания",
            component: model => displayDate(model.createdAt)
        },
        updatedAt: {
            path: "updatedAt",
            name: "Время изменения",
            component: model => displayDate(model.updatedAt)
        },
        deleteButton: {
            name: "",
            component: model => (
                <button
                    className="btn btn-danger"
                    onClick={() => onDeleteButtonClick(model.id)}
                    style={{
                        "--bs-btn-padding-y": ".25rem",
                        "--bs-btn-padding-x": ".5rem",
                        "--bs-btn-font-size": ".75rem"
                    }}
                >
                    Удалить
                </button>
            )
        }
    };

    const handleSort = item => {
        setSortBy(item);
    };

    const onTrClick = (e, id) => {
        if (e.target.classList.contains("btn-danger")) return;
        history.push("/edit/" + id);
    };

    const sortedModels = orderBy(userModels, sortBy.path, sortBy.order);
    const sortedModelsWithOnClick = sortedModels.map(model => ({
        ...model,
        onClick: e => onTrClick(e, model.id)
    }));

    return (
        <div className="m-3">
            <h3>Сохраненные модели</h3>
            {sortedModels.length === 0 ? (
                <p>Еще не сохранено ни одной модели</p>
            ) : (
                <Table
                    onSort={handleSort}
                    selectedSort={sortBy}
                    columns={columns}
                    items={sortedModelsWithOnClick}
                />
            )}
        </div>
    );
};

export default ModelsListPage;
