import generateId from "../../utils/generateId";
import getDeviceConfig from "../../utils/getDeviceConfig";

const Palette = () => {
    const devices = [
        getDeviceConfig("source"),
        getDeviceConfig("takeFromStorage"),
        getDeviceConfig("putInStorage"),
        getDeviceConfig("queue")
    ];

    return (
        <div className="d-flex flex-column" draggable={false}>
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
