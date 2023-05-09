const Device = ({ className, device, left, top }) => {
    const style = {
        left,
        top
    };
    return (
        <div
            className={(className ? className : "") + " draggable device"}
            style={style}
        >
            <img
                src={device.src}
                alt={device.name}
                width="40"
                height="40"
                draggable={false}
                className=""
            />
            {device.ports.map(port => (
                <div className={port.side + " side"} key={port.id} />
            ))}
        </div>
    );
};

export default Device;
