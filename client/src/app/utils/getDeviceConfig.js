import sourceImg from "../icons/source.png"; // https://icons8.com/icons/set/start
import bufferImg from "../icons/buffer.png"; // https://www.flaticon.com/free-icon/package_2982580
// pack: https://www.flaticon.com/free-icon/take-away_6406139?term=take&page=1&position=3&origin=search&related_id=6406139
// down-arrow: https://www.flaticon.com/free-icon/down-arrow_2989995?term=down+arrow&page=1&position=11&origin=search&related_id=2989995
// up-arrow: https://www.flaticon.com/free-icon/up-arrow_2989972?term=arrow+up&page=1&position=1&origin=style&related_id=2989972
import takeFromBufferImg from "../icons/takeFromBuffer.png";
import putInBufferImg from "../icons/putInBuffer.png";
import facilityImg from "../icons/facility.png"; // https://www.flaticon.com/free-icon/tool-box_7352310?term=tools&page=1&position=51&origin=search&related_id=7352310
import takeFacilityImg from "../icons/takeFacility.png"; // https://www.flaticon.com/free-icon/construction-worker_3866706
import delayImg from "../icons/delay.png"; // https://www.flaticon.com/free-icon/time_3106767?term=clock&page=1&position=37&origin=search&related_id=3106767
// import queueImg from "../icons/queue.png"; // https://icons8.com/icon/30324/
// import splitterImg from "../icons/splitter.png"; // https://icons8.com/icon/30324/
import sinkImg from "../icons/sink.png"; // https://www.flaticon.com/free-icon/close_9248474?term=delete&page=1&position=56&origin=search&related_id=9248474

const configDevice = (src, type, ports, params) => {
    return {
        src,
        type,
        ports: ports.map(([side, entrance]) => ({
            side,
            entrance
        })),
        params
    };
};

const getDeviceConfig = type => {
    // const TOP = "top";
    // const BOTTOM = "bottom";
    const LEFT = "left";
    const RIGHT = "right";

    const IN = "in";
    const OUT = "out";
    switch (type) {
        case "source":
            return configDevice(sourceImg, type, [[RIGHT, OUT]], {
                distribution: "uniform",
                lower: 1,
                upper: 1
            });
        case "buffer":
            return configDevice(bufferImg, type, [], {
                capacity: 1
            });
        case "takeFromBuffer":
            return configDevice(
                takeFromBufferImg,
                type,
                [
                    [LEFT, IN],
                    [RIGHT, OUT]
                ],
                {
                    bufferId: null,
                    quantity: 1
                }
            );
        case "putInBuffer":
            return configDevice(
                putInBufferImg,
                type,
                [
                    [LEFT, IN],
                    [RIGHT, OUT]
                ],
                {
                    bufferId: null,
                    quantity: 1
                }
            );
        case "facility":
            return configDevice(facilityImg, type, [], {
                capacity: 1
            });
        case "takeFacility":
            return configDevice(
                takeFacilityImg,
                type,
                [
                    [LEFT, IN],
                    [RIGHT, OUT]
                ],
                {
                    facilityId: null,
                    duration: 1
                }
            );
        case "delay":
            return configDevice(
                delayImg,
                type,
                [
                    [LEFT, IN],
                    [RIGHT, OUT]
                ],
                {
                    duration: 1
                }
            );
        // case "queue":
        //     return configDevice(queueImg, type, [
        //         [LEFT, IN],
        //         [RIGHT, OUT]
        //     ]);
        // case "splitter":
        //     return configDevice(splitterImg, type, [
        //         [LEFT, IN],
        //         [TOP, OUT],
        //         [RIGHT, OUT],
        //         [BOTTOM, OUT]
        //     ]);
        case "sink":
            return configDevice(sinkImg, type, [[LEFT, IN]]);

        default:
            return null;
    }
};

export default getDeviceConfig;
