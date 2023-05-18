const modelToProcessesConfigs = (devices, paths) => {
    const tempDevices = [...devices];
    const tempPaths = [...paths];
    const sources = tempDevices.filter(device => device.type === "source");

    const findNextDevice = (currProcess, devices, paths) => {
        const currDevice = currProcess[currProcess.length - 1];
        if (currDevice.type === "sink") return;
        const currDevicePath = paths.find(
            path => path.a.deviceId === currDevice.id
        );
        if (!currDevicePath) return;
        const nextDevice = devices.find(
            device => device.id === currDevicePath.b.deviceId
        );
        if (!nextDevice) return;
        currProcess.push(nextDevice);
        const newDevices = devices.filter(
            device => device.id !== nextDevice.id
        );
        const newPaths = paths.filter(path => path.id !== currDevicePath.id);
        findNextDevice(currProcess, newDevices, newPaths);
    };

    const preliminaryProcesses = sources.map(source => {
        const currProcess = [source];
        findNextDevice(currProcess, tempDevices, tempPaths);
        return currProcess;
    });

    return preliminaryProcesses.filter(
        process => process[process.length - 1].type === "sink"
    );
};

export default modelToProcessesConfigs;
