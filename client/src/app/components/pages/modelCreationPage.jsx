import { useEffect, useState } from "react";

import generateId from "../../utils/generateId";
import getDeviceConfig from "../../utils/getDeviceConfig";

import Grid from "../ui/grid";
import Palette from "../ui/palette";
import Device from "../common/device";

const ModelCreationPage = () => {
    // const mapWidth = 600; // TODO: сделать через usf
    // const mapHeight = 600;
    const [mapWidth, setMapWidth] = useState(600);
    const [mapHeight, setMapHeight] = useState(600);
    const [devices, setDevices] = useState([]);
    const [selected, setSelected] = useState(null);
    const [paths, setPaths] = useState([]);
    const [startConnection, setStartConnection] = useState(null);
    const [dragObject, setDragObject] = useState({});

    const removePath = id => {
        // проверяем, не выбрано ли то, что удалится
        if (selected && selected?.id === id) setSelected(null);

        setPaths(prev => prev.filter(p => p.id !== id));
    };

    const addPath = (a, b) => {
        const newPath = {
            id: generateId(),
            a,
            b
        };
        setPaths(prev => {
            const arr = [...prev];
            arr.push(newPath);
            return arr;
        });
        return newPath;
    };

    const removeDevice = id => {
        // проверяем, не выбрано ли то, что удалится
        if (selected) {
            if (selected?.id === id) setSelected(null);
            else {
                const pathsToRemove = paths.filter(
                    path => path.a.deviceId === id || path.b.deviceId === id
                );
                if (pathsToRemove.find(path => path.id === selected?.id))
                    setSelected(null);
            }
        }

        // удаляем все соединения устройства
        setPaths(prev =>
            prev.filter(
                path => path.a.deviceId !== id && path.b.deviceId !== id
            )
        );

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

    const htmlPxToSvgPx = (n, a, b, _a, _b) => {
        let d = b - a; // == svgCoords.width or height
        let _d = _b - _a; // 100 = 100 - 0
        let u = _d / d; // 100 / svgCoords.width or height
        return _a + n * u; // 0 + init left or top * (100 / svg width or height)
    };

    const makeConnection = e => {
        // если клик не левой кнопкой мыши, то прерываем
        if (e.button !== 0) {
            return;
        }

        const elem = e.target.closest(".point");
        if (!elem) return;
        const deviceId = elem.dataset.id;
        const side = elem.dataset.side;
        const entrance = elem.dataset.entrance;

        // TODO: сделать отображение недоступных для подключения портов
        const comparePoints = (point, deviceId, side) =>
            point.deviceId === deviceId && point.side === side;
        const checkPointForOccupationInPath = (path, deviceId, side) =>
            comparePoints(path.a, deviceId, side) ||
            comparePoints(path.b, deviceId, side);
        const checkPointForOccupation = (paths, deviceId, side) =>
            paths.find(path =>
                checkPointForOccupationInPath(path, deviceId, side)
            );
        if (checkPointForOccupation(paths, deviceId, side)) return;

        const bcr = elem.getBoundingClientRect();
        const svg = document.querySelector("#svg");
        const svgCoords = svg.getBoundingClientRect();

        const newPoint = {
            deviceId,
            side,
            entrance,
            left: htmlPxToSvgPx(
                bcr.left - svgCoords.left + bcr.width / 2,
                svgCoords.left,
                svgCoords.left + svgCoords.width,
                0,
                100
            ),
            top: htmlPxToSvgPx(
                bcr.top - svgCoords.top + bcr.height / 2,
                svgCoords.top,
                svgCoords.top + svgCoords.height,
                0,
                100
            )
        };

        if (!startConnection) {
            setStartConnection(newPoint);
        } else {
            if (startConnection.deviceId === deviceId) return;
            if (startConnection.entrance === elem.dataset.entrance) return;

            // добавляем путь от out точки к in точке
            if (entrance === "in") addPath(startConnection, newPoint);
            else addPath(newPoint, startConnection);

            setStartConnection(null);
        }
    };

    const onSelected = data => {
        setSelected(data);
    };

    const onKeyDown = e => {
        if (e.key === "Backspace" || e.key === "Delete") {
            if (selected) {
                if (selected.elementType === "path") {
                    removePath(selected.id);
                    setSelected(null);
                } else if (selected.elementType === "device") {
                    removeDevice(selected.id);
                    setSelected(null);
                }
            }
        }
        if (e.key === "Escape") {
            if (startConnection) setStartConnection(null);
        }
    };

    const getCoords = elem => {
        // кроме IE8-
        const box = elem.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset
        };
    };

    const onMouseDown = (e, dragObject, setDragObject) => {
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

        if (Array.from(e.target.classList).find(c => c === "paletteElement")) {
            const type = e.target.dataset.type;
            const newDeviceConfig = getDeviceConfig(type);
            if (!newDeviceConfig) return;
            const coords = getCoords(elem);
            const { id } = addDevice(
                newDeviceConfig,
                coords.left - 1,
                coords.top - 1
            );
            setDragObject({
                elem, // запомнить переносимый объект
                downX: e.pageX, // запомнить координаты, с которых начат перенос объекта
                downY: e.pageY,
                fromPalette: true,
                id
            });
        } else {
            setDragObject({
                elem, // запомнить переносимый объект
                downX: e.pageX, // запомнить координаты, с которых начат перенос объекта
                downY: e.pageY,
                id: elem.dataset.id
            });
        }
    };

    const createAvatar = (e, dragObject) => {
        // если схватили за точку крепления
        if (
            Array.from(e.target.classList).find(c => c === "point") &&
            !dragObject.fromPalette
        )
            return null;

        let avatar;
        if (dragObject.fromPalette) {
            // если только что созданное устройство с палитры
            const elem = document.elementFromPoint(e.clientX, e.clientY);
            avatar = elem.closest(".draggable");
            setDragObject(prev => ({
                ...prev,
                fromPalette: false
            }));
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
    };

    const onMouseMove = (e, dragObject, setDragObject) => {
        if (!dragObject.elem) return; // элемент не зажат

        let avatar = dragObject.avatar;
        let shiftX = dragObject.shiftX;
        let shiftY = dragObject.shiftY;
        if (!avatar) {
            // если перенос не начат,
            // то посчитать дистанцию, на которую переместился курсор мыши
            const moveX = e.pageX - dragObject.downX;
            const moveY = e.pageY - dragObject.downY;
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return; // ничего не делать, мышь не передвинулась достаточно далеко
            }

            avatar = createAvatar(e, dragObject); // захватить элемент
            if (!avatar) {
                setDragObject({}); // аватар создать не удалось, отмена переноса
                return; // возможно, нельзя захватить за эту часть элемента
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            const coords = getCoords(avatar);
            shiftX = dragObject.downX - coords.left;
            shiftY = dragObject.downY - coords.top;
            setDragObject(prev => ({
                ...prev,
                avatar,
                shiftX,
                shiftY
            }));
        }

        // отобразить перенос объекта при каждом движении мыши
        const id = avatar.dataset.id;
        editDevicePosition(
            id,
            e.pageX - shiftX,
            e.pageY - shiftY,
            2 // был 1
        );

        // запоминаем последнюю позицию устройства
        setDragObject(prev => ({
            ...prev,
            lastPosition: {
                left: e.pageX - dragObject.shiftX,
                top: e.pageY - dragObject.shiftY
            }
        }));
    };

    const findDroppable = dragObject => {
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
    };

    const finishDrag = dragObject => {
        const dropElem = findDroppable(dragObject);

        if (dropElem) {
            const id = dragObject.avatar.dataset.id;
            const oldLeft = dragObject.lastPosition.left;
            const oldTop = dragObject.lastPosition.top;

            const coords = getCoords(dropElem);
            const left = oldLeft - coords.left;
            const top = oldTop - coords.top;
            editDevicePosition(id, left, top, 2);
            editDeviceParent(id, "map");

            // расширяем карту
            const width = dropElem.getBoundingClientRect().width;
            const height = dropElem.getBoundingClientRect().height;
            if (left + 43 > width - 100) {
                setMapWidth(width + 100);
            }
            // снова присваиваем на случай, если уже изменили ширину
            if (top + 43 > height - 100) {
                setMapHeight(height + 100);
            }
        } else {
            dragObject.avatar.rollback();
        }
    };

    const onMouseUp = (dragObject, setDragObject) => {
        // обрабываем конец переноса, если он идёт
        if (dragObject.avatar) {
            finishDrag(dragObject);
        } else {
            // если кликнули на устройство из палитры,
            // но не двигали его, то удалим его (палитра вне поля)
            if (dragObject.fromPalette) {
                removeDevice(dragObject.id);
            }
        }

        // в конце mouseup перенос либо завершился, либо даже не начинался
        // в любом случае очистим "состояние переноса" dragObject
        setDragObject({});
    };

    // useEffect для перемещения связей
    useEffect(() => {
        const svg = document.querySelector("#svg");
        const svgCoords = svg.getBoundingClientRect();
        setPaths(prev => {
            return prev.map(path => {
                let point = path.a;
                let deviceId = point.deviceId;
                let side = point.side;
                let entrance = point.entrance;
                let pointNode = document.querySelector(
                    `[data-id="${deviceId}"] [data-side="${side}"]`
                );
                let bcr = pointNode.getBoundingClientRect();
                const newPointA = {
                    deviceId,
                    side,
                    entrance,
                    left: htmlPxToSvgPx(
                        bcr.left - svgCoords.left + bcr.width / 2,
                        svgCoords.left,
                        svgCoords.left + svgCoords.width,
                        0,
                        100
                    ),
                    top: htmlPxToSvgPx(
                        bcr.top - svgCoords.top + bcr.height / 2,
                        svgCoords.top,
                        svgCoords.top + svgCoords.height,
                        0,
                        100
                    )
                };

                point = path.b;
                deviceId = point.deviceId;
                side = point.side;
                entrance = point.entrance;
                pointNode = document.querySelector(
                    `[data-id="${deviceId}"] [data-side="${side}"]`
                );
                bcr = pointNode.getBoundingClientRect();
                const newPointB = {
                    deviceId,
                    side,
                    entrance,
                    left: htmlPxToSvgPx(
                        bcr.left - svgCoords.left + bcr.width / 2,
                        svgCoords.left,
                        svgCoords.left + svgCoords.width,
                        0,
                        100
                    ),
                    top: htmlPxToSvgPx(
                        bcr.top - svgCoords.top + bcr.height / 2,
                        svgCoords.top,
                        svgCoords.top + svgCoords.height,
                        0,
                        100
                    )
                };

                return {
                    id: path.id,
                    a: newPointA,
                    b: newPointB
                };
            });
        });
    }, [devices]);

    return (
        <div
            className="modelPage m-3"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            onMouseDown={e => onMouseDown(e, dragObject, setDragObject)}
            onMouseMove={e => onMouseMove(e, dragObject, setDragObject)}
            onMouseUp={() => onMouseUp(dragObject, setDragObject)}
        >
            <h3>Создание модели</h3>
            <div className="controlBar"></div>
            <div className="d-flex flex-row justify-content-evenly">
                <Palette />
                <Grid
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                    devices={devices}
                    paths={paths}
                    makeConnection={makeConnection}
                    onSelected={onSelected}
                    selected={selected}
                    startConnection={startConnection}
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
                        makeConnection={makeConnection}
                        onSelected={onSelected}
                        selected={selected}
                        startConnection={startConnection}
                    />
                ))}
        </div>
    );
};

export default ModelCreationPage;
