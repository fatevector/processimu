// eslint-disable-next-line
import * as Sim from "simjs"; // без этого Webpack не подгружает библиотеку вообще
// библиотека используется не через импорт, она модифицирует объект window

const startSimulation = (modelConfig, seed, simTime) => {
    const sim = new window.Sim.Sim();
    // const stats = new Sim.Population();
    const random = new window.Sim.Random(seed);

    const buffers = {};
    // const stores = {}
    const facilities = {};
    const defineResources = resources => {
        resources.forEach(resource => {
            switch (resource.type) {
                case "buffer":
                    buffers[resource.id] = {
                        resource: new window.Sim.Buffer(
                            resource.id,
                            resource.params.capacity
                        ),
                        id: resource.id,
                        type: resource.type,
                        params: resource.params,
                        stats: [
                            {
                                time: 0,
                                value: resource.params.initValue
                            }
                        ]
                    }; // буфер
                    break;
                // case "store":
                //     stores[resource.id] = {
                //         resource: new window.Sim.Store(resource.params.capacity),
                //         id: resource.id,
                //         params: resource.params
                //     }; // склад
                //     break;
                case "facility":
                    facilities[resource.id] = {
                        resource: new window.Sim.Facility(
                            resource.id,
                            1,
                            resource.params.capacity
                        ),
                        id: resource.id,
                        type: resource.type,
                        params: resource.params,
                        stats: []
                    }; // оборудование
                    break;

                default:
                    break;
            }
        });
    };
    defineResources(modelConfig.resources);

    function defineProcess(config, agentNumber, processNumber) {
        if (config.length === 0) return;

        const getDurationByDistribution = (random, params, distribution) => {
            switch (distribution) {
                case "exponential":
                    return random[params.distribution](params.lambda);
                case "gamma":
                    return random[params.distribution](
                        params.alpha,
                        params.beta
                    );
                case "normal":
                    return random[params.distribution](params.mu, params.sigma);
                case "pareto":
                    return random[params.distribution](params.alpha);
                case "triangular":
                    return random[params.distribution](
                        params.lower,
                        params.upper,
                        params.mode
                    );
                case "uniform":
                    return random[params.distribution](
                        params.lower,
                        params.upper
                    );
                case "weibull":
                    return random[params.distribution](
                        params.alpha,
                        params.beta
                    );
                default:
                    return;
            }
        };

        const currentDevice = config[0];
        const params = currentDevice.params;
        let buffer;
        let facility;
        let duration;
        switch (currentDevice.type) {
            case "source":
                return class extends window.Sim.Entity {
                    number = 0;

                    start() {
                        const currentAgentNumber = this.number;
                        this.number++;

                        if (currentAgentNumber === 0) {
                            currentDevice.stats = {
                                departured: 0
                            };
                        }

                        console.log(
                            `Новый агент ${currentAgentNumber} процесса ${processNumber} в ${this.time()}`
                        );

                        // установка изначальной емкости склада и буфера
                        if (processNumber === 0 && currentAgentNumber === 0) {
                            for (let bufferId in buffers) {
                                this.putBuffer(
                                    buffers[bufferId].resource,
                                    buffers[bufferId].params.initValue // TODO: сделать параметр initValue
                                );
                            }
                            // for (let storeId in stores) {
                            //     for (let i = 0; i < stores[storeId].params.capacity; i++)
                            //     this.putStore(stores[storeId].resource, 'pack')
                            // }
                        }

                        defineProcess.call(
                            this,
                            config.slice(1),
                            currentAgentNumber,
                            processNumber
                        );

                        // TODO: Добавить валидацию всех числовых полей
                        const nextAgentAt = getDurationByDistribution(
                            random,
                            params,
                            params.distribution
                        );

                        if (!nextAgentAt)
                            throw new Error(
                                "Некорректные данные распределения"
                            );

                        currentDevice.stats.departured += 1;
                        this.setTimer(nextAgentAt).done(this.start);
                    }
                };

            case "takeFromBuffer":
                if (agentNumber === 0) {
                    currentDevice.stats = {
                        entered: 0,
                        departured: 0,
                        measurements: {}
                    };
                }
                currentDevice.stats.entered += 1;
                currentDevice.stats.measurements[agentNumber] = {
                    enteredAt: this.time(),
                    departuredAt: undefined
                };

                buffer = buffers[params.bufferId];
                return this.getBuffer(buffer.resource, params.quantity).done(
                    () => {
                        console.log(
                            `Агент ${agentNumber} процесса ${processNumber} взял из буфера в ${this.time()}`
                        );
                        currentDevice.stats.departured += 1;
                        currentDevice.stats.measurements[
                            agentNumber
                        ].departuredAt = this.time();
                        buffer.stats.push({
                            time: this.time(),
                            value: buffer.resource.current()
                        });

                        defineProcess.call(
                            this,
                            config.slice(1),
                            agentNumber,
                            processNumber
                        );
                    }
                );

            case "putInBuffer":
                if (agentNumber === 0) {
                    currentDevice.stats = {
                        entered: 0,
                        departured: 0,
                        measurements: {}
                    };
                }
                currentDevice.stats.entered += 1;
                currentDevice.stats.measurements[agentNumber] = {
                    enteredAt: this.time(),
                    departuredAt: undefined
                };

                buffer = buffers[params.bufferId];
                return this.putBuffer(buffer.resource, params.quantity).done(
                    () => {
                        console.log(
                            `Агент ${agentNumber} процесса ${processNumber} вернул в буфер в ${this.time()}`
                        );
                        currentDevice.stats.departured += 1;
                        currentDevice.stats.measurements[
                            agentNumber
                        ].departuredAt = this.time();
                        buffer.stats.push({
                            time: this.time(),
                            value: buffer.resource.current()
                        });

                        defineProcess.call(
                            this,
                            config.slice(1),
                            agentNumber,
                            processNumber
                        );
                    }
                );

            case "takeFacility":
                if (agentNumber === 0) {
                    currentDevice.stats = {
                        entered: 0,
                        departured: 0,
                        measurements: {}
                    };
                }
                currentDevice.stats.entered += 1;
                currentDevice.stats.measurements[agentNumber] = {
                    enteredAt: this.time(),
                    departuredAt: undefined
                };

                facility = facilities[params.facilityId];
                duration = getDurationByDistribution(
                    random,
                    params,
                    params.distribution
                );
                return this.useFacility(facility.resource, duration).done(
                    () => {
                        console.log(
                            `Агент ${agentNumber} процесса ${processNumber} освободил оборудование в ${this.time()}`
                        );
                        currentDevice.stats.departured += 1;
                        currentDevice.stats.measurements[
                            agentNumber
                        ].departuredAt = this.time();
                        facility.stats.push({
                            from: this.time() - duration,
                            to: this.time()
                        });

                        defineProcess.call(
                            this,
                            config.slice(1),
                            agentNumber,
                            processNumber
                        );
                    }
                );

            case "delay":
                if (agentNumber === 0) {
                    currentDevice.stats = {
                        entered: 0,
                        departured: 0
                    };
                }
                currentDevice.stats.entered += 1;

                duration = getDurationByDistribution(
                    random,
                    params,
                    params.distribution
                );

                return this.setTimer(duration).done(() => {
                    console.log(
                        `Окончание задержки для агента ${agentNumber} процесса ${processNumber}`
                    );
                    currentDevice.stats.departured += 1;

                    defineProcess.call(
                        this,
                        config.slice(1),
                        agentNumber,
                        processNumber
                    );
                });

            case "sink":
                if (agentNumber === 0) {
                    currentDevice.stats = {
                        entered: 0
                    };
                }
                currentDevice.stats.entered += 1;
                return null;

            default:
                break;
        }
    }

    const defineProcessesList = processesConfigs => {
        processesConfigs.forEach((config, processNumber) => {
            const newProcess = defineProcess(config, 0, processNumber);
            sim.addEntity(newProcess);
        });
    };
    defineProcessesList(modelConfig.processesConfigs);

    sim.simulate(simTime); // симуляция будет идти от 0 по simTime

    const statistics = [];
    Object.keys(buffers).forEach(bufferId => {
        const buffer = buffers[bufferId];
        const stats = buffer.stats;
        let weightedSumOfCapacity = 0;
        for (let i = 0; i < stats.length - 1; i++) {
            weightedSumOfCapacity +=
                (stats[i + 1].time - stats[i].time) * stats[i].value;
        }
        weightedSumOfCapacity /= simTime;
        const averageEmployment =
            1 - weightedSumOfCapacity / buffer.params.capacity;
        statistics.push({
            id: buffer.id,
            type: buffer.type,
            name: buffer.params.name,
            stats: [
                {
                    label: "Среднее использование",
                    name: "averageEmployment",
                    value: `${(averageEmployment * 100).toFixed(0)}%`
                }
            ]
        });
    });
    Object.keys(facilities).forEach(facilityId => {
        const facility = facilities[facilityId];
        const stats = facility.stats;
        console.log(stats);
        let fullDurationOfUsage = 0;
        for (let i = 0; i < stats.length; i++) {
            fullDurationOfUsage += stats[i].to - stats[i].from;
        }

        // проверка на то, что какой-то агент еще занимает оборудование и не вышел
        let takeFacilityDevices = [];
        modelConfig.processesConfigs.forEach(process => {
            takeFacilityDevices = [
                ...takeFacilityDevices,
                ...process.filter(device => device.type === "takeFacility")
            ];
        });
        takeFacilityDevices = takeFacilityDevices.filter(
            device => device.params.facilityId === facilityId
        );
        for (let i = 0; i < takeFacilityDevices.length; i++) {
            if (
                takeFacilityDevices[i].stats.entered >
                takeFacilityDevices[i].stats.departured
            ) {
                fullDurationOfUsage += simTime - stats[stats.length - 1].to;
                break;
            }
        }

        const durationForOneStream =
            fullDurationOfUsage / facility.params.capacity;
        const averageEmployment = durationForOneStream / simTime;
        statistics.push({
            id: facility.id,
            type: facility.type,
            name: facility.params.name,
            stats: [
                {
                    label: "Среднее использование",
                    name: "averageEmployment",
                    value: `${(averageEmployment * 100).toFixed(0)}%`
                }
            ]
        });
    });
    modelConfig.processesConfigs.forEach(process => {
        process.forEach(device => {
            const stats = [];
            const measurements = device.stats.measurements;
            if (measurements) {
                let servedCount = 0;
                let totalWaitingTime = 0;
                let unservedCount = 0;
                for (const i in measurements) {
                    const measurement = measurements[i];
                    if (measurement.departuredAt) {
                        totalWaitingTime +=
                            measurement.departuredAt - measurement.enteredAt;
                        servedCount += 1;
                    } else {
                        unservedCount += 1;
                    }
                }
                const averageWaitingTime = totalWaitingTime / servedCount;
                stats.push({
                    label: "Среднее время ожидания в очереди",
                    name: "averageWaitingTime",
                    value: `${averageWaitingTime.toFixed(3)}`
                });
                stats.push({
                    label: "Агентов, не успевших обслужиться",
                    name: "unservedCount",
                    value: `${unservedCount}`
                });
            }
            if (device.stats.entered) {
                stats.push({
                    label: "Вошло агентов",
                    name: "entered",
                    value: `${device.stats.entered}`
                });
            }
            if (device.stats.departured) {
                stats.push({
                    label: "Вышло агентов",
                    name: "departured",
                    value: `${device.stats.departured}`
                });
            }
            statistics.push({
                id: device.id,
                type: device.type,
                name: device.params.name,
                stats
            });
        });
    });

    return statistics;
};

export default startSimulation;
