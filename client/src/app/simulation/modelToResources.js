const modelToResources = devices => {
    return devices.filter(
        device => device.type === "buffer" || device.type === "facility"
    );
};

export default modelToResources;
