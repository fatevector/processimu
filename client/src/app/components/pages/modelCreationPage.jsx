import { useEffect, useState } from "react";

import generateId from "../../utils/generateId";
// import sourceImg from "../../icons/icons8-arrow-right-64.png"; // https://icons8.com/icons/set/start
import getDeviceConfig from "../../utils/getDeviceConfig";

import Grid from "../ui/grid";
import Palette from "../ui/palette";
import Device from "../common/device";

const ModelCreationPage = () => {
    const mapWidth = 600;
    const mapHeight = 600;
    const [devices, setDevices] = useState([]);
    // const [selected, setSelected] = useState(null);
    // const [paths, setPaths] = useState();

    const removeDevice = id => {
        // TODO: сначала удалить все ссылки на это устройство у других устройств
        setDevices(prev => prev.filter(d => d.id !== id));
    };

    const addDevice = (config, left, top) => {
        const newDevice = {
            ...config,
            id: generateId(),
            position: {
                left,
                top,
                zIndex: 1
            },
            parent: "doc"
        };
        setDevices(prev => {
            const arr = [...prev];
            arr.push(newDevice);
            return arr;
        });
        return newDevice;
    };

    const editDevicePosition = (id, left, top, zIndex) => {
        setDevices(prev =>
            prev.map(d => {
                return d.id !== id
                    ? d
                    : {
                          ...d,
                          position: {
                              left,
                              top,
                              zIndex
                          }
                      };
            })
        );
    };

    const editDeviceParent = (id, parent) => {
        setDevices(prev =>
            prev.map(d => {
                return d.id !== id
                    ? d
                    : {
                          ...d,
                          parent
                      };
            })
        );
    };

    useEffect(() => {
        let dragObject = {};

        document.addEventListener("mousedown", e => {
            if (e.button !== 0) {
                // если клик не левой кнопкой мыши
                return; // то он не запускает перенос
            }

            const elem = e.target.closest(".draggable");
            if (!elem) return;

            // запомнить переносимый объект
            dragObject.elem = elem;

            // запомнить координаты, с которых начат перенос объекта
            dragObject.downX = e.pageX;
            dragObject.downY = e.pageY;

            if (
                Array.from(e.target.classList).find(c => c === "paletteElement")
            ) {
                const type = e.target.dataset.type;
                const newDeviceConfig = getDeviceConfig(type);
                if (!newDeviceConfig) return;
                const coords = getCoords(dragObject.elem);
                const { id } = addDevice(
                    newDeviceConfig,
                    coords.left - 1,
                    coords.top - 1
                );
                dragObject.fromPalette = true;
                dragObject.id = id;
            } else {
                dragObject.id = elem.dataset.id;
            }
        });

        function getCoords(elem) {
            // кроме IE8-
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        }

        function createAvatar(e) {
            const target = e.target;

            // если схватили за точку крепления
            if (Array.from(target.classList).find(c => c === "point"))
                return null;

            let avatar;
            if (dragObject.fromPalette) {
                // если только что созданное устройство с палитры
                const elem = document.elementFromPoint(e.clientX, e.clientY);
                avatar = elem.closest(".draggable");
                dragObject.fromPalette = false;
            } else {
                avatar = dragObject.elem;
            }
            const id = avatar.dataset.id;
            editDeviceParent(id, "doc");

            // функция для отмены переноса
            avatar.rollback = function () {
                removeDevice(id);
            };

            return avatar;
        }

        document.addEventListener("mousemove", e => {
            if (!dragObject.elem) return; // элемент не зажат

            if (!dragObject.avatar) {
                // если перенос не начат,
                // то посчитать дистанцию, на которую переместился курсор мыши
                var moveX = e.pageX - dragObject.downX;
                var moveY = e.pageY - dragObject.downY;
                if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                    return; // ничего не делать, мышь не передвинулась достаточно далеко
                }

                dragObject.avatar = createAvatar(e); // захватить элемент
                if (!dragObject.avatar) {
                    dragObject = {}; // аватар создать не удалось, отмена переноса
                    return; // возможно, нельзя захватить за эту часть элемента
                }

                // аватар создан успешно
                // создать вспомогательные свойства shiftX/shiftY
                var coords = getCoords(dragObject.avatar);
                dragObject.shiftX = dragObject.downX - coords.left;
                dragObject.shiftY = dragObject.downY - coords.top;
            }

            // отобразить перенос объекта при каждом движении мыши
            const id = dragObject.avatar.dataset.id;
            editDevicePosition(
                id,
                e.pageX - dragObject.shiftX,
                e.pageY - dragObject.shiftY,
                1
            );

            // запоминаем последнюю позицию устройства
            dragObject.lastPosition = {
                left: e.pageX - dragObject.shiftX,
                top: e.pageY - dragObject.shiftY
            };

            return false;
        });

        function findDroppable(event) {
            if (!dragObject.lastPosition) return null;
            const map = document.querySelector(".map");
            const field = document.querySelector(".field");
            const fieldCoords = field.getBoundingClientRect();

            // верхний левый угол устройства над полем?
            if (
                fieldCoords.left <= dragObject.lastPosition.left &&
                fieldCoords.right >= dragObject.lastPosition.left &&
                fieldCoords.top <= dragObject.lastPosition.top &&
                fieldCoords.bottom >= dragObject.lastPosition.top
            )
                return map;
            return null;
        }

        function finishDrag(e) {
            var dropElem = findDroppable(e);

            if (dropElem) {
                const id = dragObject.avatar.dataset.id;
                const oldLeft = dragObject.lastPosition.left;
                const oldTop = dragObject.lastPosition.top;

                const coords = getCoords(dropElem);
                const left = oldLeft - coords.left;
                const top = oldTop - coords.top;
                editDevicePosition(id, left, top, "auto");
                editDeviceParent(id, "map");

                // расширяем карту
                const width = dropElem.getBoundingClientRect().width;
                const height = dropElem.getBoundingClientRect().height;
                let oldStyle = dropElem.getAttribute("style");
                if (left + 42 > width - 100) {
                    dropElem.setAttribute(
                        "style",
                        `${oldStyle} width:${width + 100}px;`
                    );
                }
                // снова присваиваем на случай, если уже изменили ширину
                oldStyle = dropElem.getAttribute("style");
                if (top + 42 > height - 100) {
                    dropElem.setAttribute(
                        "style",
                        `${oldStyle} height:${height + 100}px`
                    );
                }
            } else {
                dragObject.avatar.rollback();
            }
        }

        document.addEventListener("mouseup", e => {
            // обрабываем конец переноса, если он идёт
            if (dragObject.avatar) {
                finishDrag(e);
            } else {
                // если кликнули на устройство из палитры,
                // но не двигали его, то удалим его (палитра вне поля)
                if (dragObject.fromPalette) {
                    removeDevice(dragObject.id);
                }
            }

            // в конце mouseup перенос либо завершился, либо даже не начинался
            // в любом случае очистим "состояние переноса" dragObject
            dragObject = {};
        });
    }, []);

    return (
        <div className="m-3">
            <h3>Создание модели</h3>
            <div className="controlBar"></div>
            <div className="d-flex flex-row justify-content-evenly">
                <Palette />
                <Grid
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                    devices={devices}
                />
            </div>
            {devices
                .filter(d => d.parent === "doc")
                .map(device => (
                    <Device
                        device={device}
                        key={device.id}
                        left={device.position.left}
                        top={device.position.top}
                        zIndex={device.position.zIndex}
                    />
                ))}
        </div>
    );
};

export default ModelCreationPage;
