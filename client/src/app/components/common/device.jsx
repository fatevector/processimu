const Device = ({ className, device }) => {
    return (
        <div className={className + " device"}>
            <img
                src={device.src}
                alt={device.name}
                width="40"
                height="40"
                draggable={false}
                className=""
            />
            {device.ports.map(port => (
                <div className={port.side + " side"} key={Math.random()} />
            ))}
        </div>
    );
};

export default Device;
