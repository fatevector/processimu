import sourceImg from "../icons/icons8-arrow-right-64.png"; // https://icons8.com/icons/set/start
// pack: https://www.flaticon.com/free-icon/take-away_6406139?term=take&page=1&position=3&origin=search&related_id=6406139
// down-arrow: https://www.flaticon.com/free-icon/down-arrow_2989995?term=down+arrow&page=1&position=11&origin=search&related_id=2989995
// up-arrow: https://www.flaticon.com/free-icon/up-arrow_2989972?term=arrow+up&page=1&position=1&origin=style&related_id=2989972
import takeFromStorageImg from "../icons/takeFromStorage.png";
import putInStorageImg from "../icons/putInStorage.png";
import queueImg from "../icons/icons8-queue-50.png"; // https://icons8.com/icon/30324/

const configDevice = (src, name, ports) => {
    return {
        src,
        name,
        ports: ports.map(([side, entrance]) => ({
            side,
            entrance
        }))
    };
};

const getDeviceConfig = name => {
    const TOP = "top";
    const BOTTOM = "bottom";
    const LEFT = "left";
    const RIGHT = "right";

    const IN = "in";
    const OUT = "out";
    switch (name) {
        case "source":
            return configDevice(sourceImg, "source", [[RIGHT, OUT]]);
        case "takeFromStorage":
            return configDevice(takeFromStorageImg, "takeFromStorage", [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);
        case "putInStorage":
            return configDevice(putInStorageImg, "putInStorage", [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);
        case "queue":
            return configDevice(queueImg, "queue", [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);

        default:
            return null;
    }
};

export default getDeviceConfig;
