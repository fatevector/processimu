import sourceImg from "../icons/source.png"; // https://icons8.com/icons/set/start
import storageImg from "../icons/storage.png"; // https://www.flaticon.com/free-icon/package_2982580
// pack: https://www.flaticon.com/free-icon/take-away_6406139?term=take&page=1&position=3&origin=search&related_id=6406139
// down-arrow: https://www.flaticon.com/free-icon/down-arrow_2989995?term=down+arrow&page=1&position=11&origin=search&related_id=2989995
// up-arrow: https://www.flaticon.com/free-icon/up-arrow_2989972?term=arrow+up&page=1&position=1&origin=style&related_id=2989972
import takeFromStorageImg from "../icons/takeFromStorage.png";
import putInStorageImg from "../icons/putInStorage.png";
// import delayImg from "../icons/delay.png"; // https://www.flaticon.com/free-icon/clock_2088617?term=clock&page=1&position=1&origin=search&related_id=2088617
import delayImg from "../icons/delay.png"; // https://www.flaticon.com/free-icon/time_3106767?term=clock&page=1&position=37&origin=search&related_id=3106767
// import queueImg from "../icons/icons8-queue-50.png"; // https://icons8.com/icon/30324/
import splitterImg from "../icons/splitter.png"; // https://icons8.com/icon/30324/
import sinkImg from "../icons/sink.png"; // https://www.flaticon.com/free-icon/close_9248474?term=delete&page=1&position=56&origin=search&related_id=9248474

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
            return configDevice(sourceImg, name, [[RIGHT, OUT]]);
        case "storage":
            return configDevice(storageImg, name, []);
        case "takeFromStorage":
            return configDevice(takeFromStorageImg, name, [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);
        case "delay":
            return configDevice(delayImg, name, [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);
        case "putInStorage":
            return configDevice(putInStorageImg, name, [
                [LEFT, IN],
                [RIGHT, OUT]
            ]);
        // case "queue":
        //     return configDevice(queueImg, name, [
        //         [LEFT, IN],
        //         [RIGHT, OUT]
        //     ]);
        case "splitter":
            return configDevice(splitterImg, name, [
                [LEFT, IN],
                [TOP, OUT],
                [RIGHT, OUT],
                [BOTTOM, OUT]
            ]);
        case "sink":
            return configDevice(sinkImg, name, [[LEFT, IN]]);

        default:
            return null;
    }
};

export default getDeviceConfig;
