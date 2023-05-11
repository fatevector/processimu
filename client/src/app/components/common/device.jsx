const Device = ({
    className,
    device,
    left,
    top,
    zIndex,
    makeConnection,
    onSelected,
    selected
}) => {
    const style = {
        left,
        top,
        zIndex
    };
    const onClick = e => {
        if (Array.from(e.target.classList).find(c => c === "point")) return;
        onSelected({
            ...device,
            elementType: "device"
        });
    };
    return (
        <div
            className={
                (className ? className : "") +
                " draggable device" +
                (selected?.id === device.id ? " selected" : "")
            }
            style={style}
            data-id={device.id}
            draggable={false}
            onClick={onClick}
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
                    className={
                        port.side +
                        " point" +
                        (selected?.id === device.id ? " selected" : "")
                    }
                    key={port.side}
                    draggable={false}
                    data-id={device.id}
                    data-side={port.side}
                    data-entrance={port.entrance}
                    onClick={makeConnection}
                />
            ))}
        </div>
    );
};

export default Device;
