import Grid from "../ui/grid";
import Palette from "../ui/palette";

const ModelCreationPage = () => {
    const n = 15;
    const data = new Array(n);
    data.fill(null);
    data.forEach((_, i) => {
        const row = new Array(n);
        row.fill(null);
        data[i] = row;
    });

    return (
        <div className="m-3">
            <h3>Создание модели</h3>
            <div className="controlBar"></div>
            <div className="d-flex flex-row justify-content-around">
                <Palette />
                <Grid data={data} />
            </div>
        </div>
    );
};

export default ModelCreationPage;
