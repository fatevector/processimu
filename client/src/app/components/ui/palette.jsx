import sourceImg from "../../icons/icons8-arrow-right-64.png"; //https://icons8.com/icons/set/start
import queueImg from "../../icons/icons8-queue-50.png"; // https://icons8.com/icon/30324/queue

const Palette = () => {
    const elements = [
        {
            src: sourceImg,
            alt: "source"
        },
        {
            src: queueImg,
            alt: "queue"
        }
    ];

    return (
        <div className="d-flex flex-column">
            {elements.map(el => (
                <div className="paletteCell" key={Math.random()}>
                    <img
                        src={el.src}
                        alt={el.alt}
                        width="40"
                        height="40"
                        draggable={false}
                        className="draggable"
                    />
                </div>
            ))}
        </div>
    );
};

export default Palette;
