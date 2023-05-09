const Device = ({ className, device, left, top, zIndex }) => {
    const style = {
        left,
        top,
        zIndex
    };
    // console.log(left, top);
    return (
        <div
            className={(className ? className : "") + " draggable device"}
            style={style}
            data-id={device.id}
            draggable={false}
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
                <div
                    className={port.side + " point"}
                    key={port.side}
                    draggable={false}
                />
            ))}
        </div>
    );
};

export default Device;
