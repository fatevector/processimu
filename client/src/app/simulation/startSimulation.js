import { Sim } from "simjs";

const startSimulation = (modelConfig, seed, simTime) => {
    const sim = new Sim.Sim();
    // const stats = new Sim.Population();
    const random = new Sim.Random(seed);

    const buffers = {};
    // const stores = {}
    const facilities = {};
    const defineResources = resources => {
        resources.forEach(resource => {
            switch (resource.type) {
                case "buffer":
                    buffers[resource.id] = {
                        resource: new Sim.Buffer(
                            resource.id,
                            resource.params.capacity
                        ),
                        id: resource.id,
                        params: resource.params
                    }; // буфер
                    break;
                // case "store":
                //     stores[resource.id] = {
                //         resource: new Sim.Store(resource.params.capacity),
                //         id: resource.id,
                //         params: resource.params
                //     }; // склад
                //     break;
                case "facility":
                    facilities[resource.id] = {
                        resource: new Sim.Facility(
                            resource.id,
                            1,
                            resource.params.capacity
                        ),
                        id: resource.id,
                        params: resource.params
                    }; // оборудование
                    break;

                default:
                    break;
            }
        });
    };
    defineResources(modelConfig.resources);

    // const processes = []
    function defineProcess(config, agentNumber, processNumber) {
        if (config.length === 0) return;
        const currentDevice = config[0];
        const params = currentDevice.params;
        let buffer;
        let facility;
        switch (currentDevice.type) {
            case "source":
                return class extends Sim.Entity {
                    number = 0;

                    start() {
                        const currentAgentNumber = this.number;
                        this.number++;
                        console.log(
                            `Новый агент ${currentAgentNumber} в ${this.time()}`
                        );

                        // установка изначальной емкости склада и буфера
                        if (processNumber === 0 && currentAgentNumber === 0) {
                            for (let bufferId in buffers) {
                                this.putBuffer(
                                    buffers[bufferId].resource,
                                    buffers[bufferId].params.initValue
                                );
                            }
                            // for (let storeId in stores) {
                            //     for (let i = 0; i < stores[storeId].params.initValue; i++)
                            //     this.putStore(stores[storeId].resource, 'pack')
                            // }
                        }

                        defineProcess.call(
                            this,
                            config.slice(1),
                            currentAgentNumber,
                            processNumber
                        );

                        const nextAgentAt = random[params.distribution](
                            // TODO: учесть тип распределения при генерации нового агента
                            params.from,
                            params.to
                        );
                        this.setTimer(nextAgentAt).done(this.start);
                    }
                };

            case "takeFromBuffer":
                buffer = buffers[params.bufferId];
                return this.getBuffer(buffer.resource, params.quantity).done(
                    () => {
                        console.log(
                            `Агент ${agentNumber} взял из буфера в ${this.time()}`
                        );

                        defineProcess.call(
                            this,
                            config.slice(1),
                            agentNumber,
                            processNumber
                        );
                    }
                );

            case "putInBuffer":
                buffer = buffers[params.bufferId];
                return this.putBuffer(buffer.resource, params.quantity).done(
                    () => {
                        console.log(
                            `Агент ${agentNumber} вернул в буфер в ${this.time()}`
                        );

                        defineProcess.call(
                            this,
                            config.slice(1),
                            agentNumber,
                            processNumber
                        );
                    }
                );

            case "takeFacility":
                facility = facilities[params.facilityId];
                return this.useFacility(
                    facility.resource,
                    params.duration
                ).done(() => {
                    console.log(
                        `Агент ${agentNumber} освободил оборудование в ${this.time()}`
                    );

                    defineProcess.call(
                        this,
                        config.slice(1),
                        agentNumber,
                        processNumber
                    );
                });

            case "delay":
                return this.setTimer(params.duration).done(() => {
                    console.log(`Окончание задержки для агента ${agentNumber}`);

                    defineProcess.call(
                        this,
                        config.slice(1),
                        agentNumber,
                        processNumber
                    );
                });

            case "sink":
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
};

export default startSimulation;
