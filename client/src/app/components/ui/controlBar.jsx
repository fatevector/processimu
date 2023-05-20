const ControlBar = ({
    onSaveModelClick,
    savingDisabled,
    onDeleteModelClick,
    onStartModelClick
}) => {
    return (
        <div className="controlBar d-flex flex-row mb-3 ms-1">
            <button
                className="btn btn-sm btn-dark me-2"
                onClick={onSaveModelClick}
                disabled={savingDisabled}
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
