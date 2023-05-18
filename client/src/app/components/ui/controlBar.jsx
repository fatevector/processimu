const ControlBar = ({
    onSaveModelClick,
    onDeleteModelClick,
    onStartModelClick
}) => {
    return (
        <div className="controlBar d-flex flex-row mb-3">
            <button
                className="btn btn-sm btn-dark me-2"
                onClick={onSaveModelClick}
            >
                Сохранить
            </button>
            <button
                className="btn btn-sm btn-dark me-2"
                onClick={onStartModelClick}
            >
                Запуск
            </button>
            <button
                className="btn btn-sm btn-danger"
                onClick={onDeleteModelClick}
            >
                Удалить
            </button>
        </div>
    );
};

export default ControlBar;
