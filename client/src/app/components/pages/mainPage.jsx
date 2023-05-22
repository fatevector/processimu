import sourceImg from "../../icons/source.png"; // https://icons8.com/icons/set/start
import bufferImg from "../../icons/buffer.png"; // https://www.flaticon.com/free-icon/package_2982580
// pack: https://www.flaticon.com/free-icon/take-away_6406139?term=take&page=1&position=3&origin=search&related_id=6406139
// down-arrow: https://www.flaticon.com/free-icon/down-arrow_2989995?term=down+arrow&page=1&position=11&origin=search&related_id=2989995
// up-arrow: https://www.flaticon.com/free-icon/up-arrow_2989972?term=arrow+up&page=1&position=1&origin=style&related_id=2989972
import takeFromBufferImg from "../../icons/takeFromBuffer.png";
import putInBufferImg from "../../icons/putInBuffer.png";
import facilityImg from "../../icons/facility.png"; // https://www.flaticon.com/free-icon/tool-box_7352310?term=tools&page=1&position=51&origin=search&related_id=7352310
import takeFacilityImg from "../../icons/takeFacility.png"; // https://www.flaticon.com/free-icon/construction-worker_3866706
import delayImg from "../../icons/delay.png"; // https://www.flaticon.com/free-icon/time_3106767?term=clock&page=1&position=37&origin=search&related_id=3106767
// import queueImg from "../../icons/queue.png"; // https://icons8.com/icon/30324/
// import splitterImg from "../../icons/splitter.png"; // https://icons8.com/icon/30324/
import sinkImg from "../../icons/sink.png"; // https://www.flaticon.com/free-icon/close_9248474?term=delete&page=1&position=56&origin=search&related_id=9248474

const MainPage = () => {
    return (
        <div className="m-3">
            <h3>Справка по доступным устройствам</h3>
            <article>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={sourceImg}
                                className=""
                                alt="Источник"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">
                                Источник агентов
                            </h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, из которого появляются новые
                                агенты. Частота появления агентов зависит от
                                распределения и его параметров, указанных в
                                свойствах устройства
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img src={bufferImg} className="" alt="Буфер" />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">Буфер</h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, представляющее из себя хранилище
                                токенов с определенной максимальной емкостью.
                                Любой агент может положить в буфер (взять из
                                него) некоторое количество токенов или же встать
                                в очередь на обработку
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={takeFromBufferImg}
                                className=""
                                alt="Взять из буфера"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">
                                Взять из буфера
                            </h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, позволяющее агенту взять из
                                конкретного буфера определенное количество
                                токенов
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={putInBufferImg}
                                className=""
                                alt="Положить в буфер"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">
                                Положить в буфер
                            </h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, позволяющее агенту положить в
                                конкретный буфер определенное количество токенов
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={facilityImg}
                                className=""
                                alt="Оборудование"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">Оборудование</h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, представляющее из себя
                                совокупность из определенного количества
                                сервисов. Агенты могут занимать (освобождать)
                                сервисы или становиться в очередь на обработку.
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={takeFacilityImg}
                                className=""
                                alt="Занять оборудование"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">
                                Занять оборудование
                            </h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, позволяющее агенту занять
                                оборудование на время, зависящее от
                                распределения и его параметров, указанных в
                                свойствах устройства.
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={delayImg}
                                className=""
                                alt="Задержка"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">Задержка</h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это устройство, позволяющее имитировать
                                задержку, длительность которой зависит от
                                распределения и его параметров, указанных в
                                свойствах устройства.
                            </div>
                        </div>
                    </div>
                </section>
                <section className="card mb-3 overflow-hidden">
                    <div className="d-flex">
                        <div className="rounded-start border-end d-flex align-items-center p-1">
                            <img
                                src={sinkImg}
                                className=""
                                alt="Сток агентов"
                                style={{}}
                            />
                        </div>
                        <div className="d-flex flex-column w-100">
                            <h6 className="card-header col-12">Сток агентов</h6>
                            <div className="card-text ps-3 pt-1 pb-1 pe-3">
                                Это обязательное устройство, заканчивающее
                                бизнесс-процесс. Без него цепочка будет
                                считаться незавершенной и не пройдет через
                                симуляцию.
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
};

export default MainPage;
