import Grid from "../ui/grid";

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
            <Grid data={data} />
        </div>
    );
};

export default ModelCreationPage;
