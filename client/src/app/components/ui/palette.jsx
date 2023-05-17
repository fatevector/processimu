import generateId from "../../utils/generateId";
import getDeviceConfig from "../../utils/getDeviceConfig";

const Palette = () => {
    const devices = [
        getDeviceConfig("source"),
        getDeviceConfig("buffer"),
        getDeviceConfig("takeFromBuffer"),
        getDeviceConfig("putInBuffer"),
        getDeviceConfig("facility"),
        getDeviceConfig("takeFacility"),
        getDeviceConfig("delay"),
        // getDeviceConfig("queue"),
        // getDeviceConfig("splitter"),
        getDeviceConfig("sink")
    ];

    return (
        <div
            className="d-flex flex-column align-items-center"
            // className="d-flex flex-column align-items-center border border-secondary rounded p-1"
            draggable={false}
        >
            <h5>Палитра</h5>
            {devices.map(device => (
                <div
                    className="paletteCell"
                    key={generateId()}
                    draggable={false}
                >
                    <img
                        src={device.src}
                        alt={device.name}
                        width="40"
                        height="40"
                        draggable={false}
                        className="paletteElement draggable"
                        data-type={device.name}
                    />
                </div>
            ))}
        </div>
    );
};

export default Palette;
