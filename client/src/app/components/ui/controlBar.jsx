const ControlBar = ({ onSaveModelClick }) => {
    return (
        <div className="controlBar d-flex flex-row mb-3">
            <button className="btn btn-sm btn-dark" onClick={onSaveModelClick}>
                Сохранить
            </button>
        </div>
    );
};

export default ControlBar;
