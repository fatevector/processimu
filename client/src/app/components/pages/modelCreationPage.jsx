import Grid from "../ui/grid";
import Palette from "../ui/palette";

const ModelCreationPage = () => {
    const mapWidth = 750;
    const mapHeight = 750;

    return (
        <div className="m-3">
            <h3>Создание модели</h3>
            <div className="controlBar"></div>
            <div className="d-flex flex-row justify-content-around">
                <Palette />
                <Grid mapWidth={mapWidth} mapHeight={mapHeight} />
            </div>
        </div>
    );
};

export default ModelCreationPage;
