import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import editImg from "../../icons/edit.png"; // https://www.flaticon.com/free-icon/pen_1250615?term=edit&page=1&position=13&origin=search&related_id=1250615
import okImg from "../../icons/ok.png"; // https://www.flaticon.com/free-icon/tick_447147?term=ok&page=1&position=12&origin=search&related_id=447147
import refuseImg from "../../icons/refuse.png"; // https://www.flaticon.com/free-icon/cross_8637512?term=refuse&page=1&position=27&origin=search&related_id=8637512

import modelToProcessesConfigs from "../../simulation/modelToProcessesConfigs";
import modelToResources from "../../simulation/modelToResources";
import startSimulation from "../../simulation/startSimulation";

import generateId from "../../utils/generateId";
import getDeviceConfig from "../../utils/getDeviceConfig";
import history from "../../utils/history";

import {
    addModel,
    editModel,
    removeModel,
    getUserModelById
} from "../../store/auth";

import TextField from "../common/textField";
import ControlBar from "../ui/controlBar";
import Palette from "../ui/palette";
import Grid from "../ui/grid";
import ObjectInspector from "../ui/objectInspector";
import Device from "../common/device";

const ModelEditingPage = () => {
    const { modelId } = useParams();
    const model = useSelector(getUserModelById(modelId));

    let initMapWidth = 600;
    let initMapHeight = 600;
    let initDevices = [];
    let initPaths = [];
    let initTitle = "Новая модель";
    let initModelParams = {
        seed: 1,
        simTime: 10,
        devicesCounters: {
            source: 0,
            buffer: 0,
            takeFromBuffer: 0,
            putInBuffer: 0,
            facility: 0,
            takeFacility: 0,
            delay: 0,
            sink: 0
        }
    };
    if (model) {
        initMapWidth = model.mapWidth;
        initMapHeight = model.mapHeight;
        initDevices = model.devices;
        initPaths = model.paths;
        initTitle = model.title;
        initModelParams = model.modelParams;
    }

    // для очистки состояний при изменении modelId
    useEffect(() => {
        if (model) {
            setMapWidth(model.mapWidth);
            setMapHeight(model.mapHeight);
            setDevices(model.devices);
            setPaths(model.paths);
            setTitle({
                name: "modelName",
                initValue: model.title,
                value: model.title,
                editingMode: false
            });
            setModelParams(model.modelParams);
        } else {
            setMapWidth(initMapWidth);
            setMapHeight(initMapHeight);
            setDevices(initDevices);
            setPaths(initPaths);
            setTitle({
                name: "modelName",
                initValue: initTitle,
                value: initTitle,
                editingMode: false
            });
            setModelParams(initModelParams);
        }
        setSelected({
            type: "model",
            elementType: "model"
        });
        setStartConnection(null);
        setDragObject({});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelId]);

    const dispatch = useDispatch();
    const [mapWidth, setMapWidth] = useState(initMapWidth);
    const [mapHeight, setMapHeight] = useState(initMapHeight);
    const [devices, setDevices] = useState(initDevices);
    const [selected, setSelected] = useState({
        type: "model",
        elementType: "model"
    });
    const [paths, setPaths] = useState(initPaths);
    const [startConnection, setStartConnection] = useState(null);
    const [dragObject, setDragObject] = useState({});
    const [title, setTitle] = useState({
        name: "modelName",
        initValue: initTitle,
        value: initTitle,
        editingMode: false
    });
    const [modelParams, setModelParams] = useState(initModelParams);
    const [buffers, setBuffers] = useState([]);
    const [facilities, setFacilities] = useState([]);

    const setDeviceCounter = (type, count) => {
        setModelParams(prev => ({
            ...prev,
            devicesCounters: {
                ...prev.devicesCounters,
                [type]: count
            }
        }));
    };

    const removePath = id => {
        // проверяем, не выбрано ли то, что удалится
        if (selected && selected?.id === id)
            setSelected({
                type: "model",
                elementType: "model"
            });

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

    const getDeviceParams = id => {
        return devices.find(device => device.id === id)?.params;
    };

    const setDeviceParams = useCallback(
        id => params => {
            setDevices(prev =>
                prev.map(d => {
                    return d.id !== id
                        ? d
                        : {
                              ...d,
                              params: {
                                  ...d.params,
                                  ...params
                              }
                          };
                })
            );
        },
        [setDevices]
    );

    const setModelParamsTroughPrevState = useCallback(
        params => {
            console.log("setModelParamsTroughPrevState", params);
            setModelParams(prev => ({
                ...prev,
                ...params
            }));
        },
        [setModelParams]
    );

    const removeDevice = id => {
        // проверяем, не выбрано ли то, что удалится
        if (selected) {
            if (selected?.id === id)
                setSelected({
                    type: "model",
                    elementType: "model"
                });
            else {
                const pathsToRemove = paths.filter(
                    path => path.a.deviceId === id || path.b.deviceId === id
                );
                if (pathsToRemove.find(path => path.id === selected?.id))
                    setSelected({
                        type: "model",
                        elementType: "model"
                    });
            }
        }

        // удаляем все соединения устройства
        setPaths(prev =>
            prev.filter(
                path => path.a.deviceId !== id && path.b.deviceId !== id
            )
        );

        setDevices(prev => prev.filter(d => d.id !== id));
        setDevices(prev =>
            prev.map(d => {
                const params = d.params;
                if (params.bufferId === id) {
                    return {
                        ...d,
                        params: {
                            ...params,
                            bufferId: null
                        }
                    };
                } else if (params.facilityId === id) {
                    return {
                        ...d,
                        params: {
                            ...params,
                            facilityId: null
                        }
                    };
                }
                return d;
            })
        );
        // setFacilities(prev => prev.filter(f => f.id !== id));
        // setBuffers(prev => prev.filter(b => b.id !== id));
    };

    const addDevice = (config, left, top) => {
        const sameDevicesCount = modelParams?.devicesCounters?.[config.type];
        const params = config?.params || {};
        const newDevice = {
            ...config,
            id: generateId(),
            position: {
                left,
                top,
                zIndex: 1
            },
            parent: "doc",
            params: {
                ...params,
                name: `${config.type} ${sameDevicesCount + 1}` // TODO: изменить наименования на русские
            }
        };
        setDeviceCounter(config.type, sameDevicesCount + 1);

        setDevices(prev => {
            const arr = [...prev];
            arr.push(newDevice);
            return arr;
        });

        // if (config.type === "buffer") {
        //     setBuffers(prev => [
        //         ...prev,
        //         {
        //             id: newDevice.id,
        //             name: newDevice.params.name
        //         }
        //     ]);
        // } else if (config.type === "facility") {
        //     setFacilities(prev => [
        //         ...prev,
        //         {
        //             id: newDevice.id,
        //             name: newDevice.params.name
        //         }
        //     ]);
        // }

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
        const deviceId = elem?.dataset?.id;
        const side = elem?.dataset?.side;
        const entrance = elem?.dataset?.entrance;

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
            if (startConnection.entrance === elem?.dataset?.entrance) return;

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
        if ((e.shiftKey && e.key === "Backspace") || e.key === "Delete") {
            if (selected) {
                if (selected.elementType === "path") {
                    removePath(selected.id);
                    setSelected({
                        type: "model",
                        elementType: "model"
                    });
                } else if (selected.elementType === "device") {
                    removeDevice(selected.id);
                    setSelected({
                        type: "model",
                        elementType: "model"
                    });
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
            const type = e.target?.dataset?.type;
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
                id: elem?.dataset?.id
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
        const id = avatar?.dataset?.id;
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
        const id = avatar?.dataset?.id;
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
            const id = dragObject.avatar?.dataset?.id;
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

    const onTitleChange = ({ name, value }) => {
        setTitle(prev => ({
            ...prev,
            name,
            value
        }));
    };

    const onEditTitleClick = () => {
        setTitle(prev => ({
            ...prev,
            editingMode: true
        }));
    };

    const onAcceptTitleClick = () => {
        setTitle(prev => {
            if (prev.value.trim() === "") {
                return {
                    ...prev,
                    value: prev.initValue,
                    editingMode: false
                };
            } else {
                return {
                    ...prev,
                    initValue: prev.value,
                    editingMode: false
                };
            }
        });
    };

    const onRefuseTitleClick = () => {
        setTitle(prev => ({
            ...prev,
            value: prev.initValue,
            editingMode: false
        }));
    };

    const onSaveModelClick = () => {
        if (!model) {
            dispatch(
                addModel({
                    id: generateId(),
                    title: title.value,
                    devices,
                    paths,
                    mapWidth,
                    mapHeight,
                    modelParams
                })
            );
        } else {
            dispatch(
                editModel({
                    id: model.id,
                    title: title.value,
                    devices,
                    paths,
                    mapWidth,
                    mapHeight,
                    modelParams
                })
            );
        }
    };

    const onDeleteModelClick = () => {
        if (model) {
            dispatch(removeModel(model.id));
        }
        history.push("/models");
    };

    const onStartModelClick = () => {
        const resources = modelToResources(devices);
        const processesConfigs = modelToProcessesConfigs(devices, paths);
        const modelConfig = {
            resources,
            processesConfigs
        };
        startSimulation(modelConfig, modelParams.seed, modelParams.simTime);
    };

    const onSelectMap = e => {
        if (e.target.id === "svg")
            onSelected({
                type: "model",
                elementType: "model"
            });
    };

    // useEffect для контроля списков буферов и оборудования
    useEffect(() => {
        const buffers = devices
            .filter(device => device.type === "buffer")
            .map(device => ({
                id: device.id,
                name: device.params.name
            }));
        setBuffers(buffers);
        const facilities = devices
            .filter(device => device.type === "facility")
            .map(device => ({
                id: device.id,
                name: device.params.name
            }));
        setFacilities(facilities);
    }, [devices]);

    return (
        <div
            className="modelPage m-3"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            onMouseDown={e => onMouseDown(e, dragObject, setDragObject)}
            onMouseMove={e => onMouseMove(e, dragObject, setDragObject)}
            onMouseUp={() => onMouseUp(dragObject, setDragObject)}
            onClick={onSelectMap}
        >
            <div className="d-flex align-items-baseline">
                {title.editingMode ? (
                    <>
                        <TextField
                            {...title}
                            onChange={onTitleChange}
                            className="mb-2 me-2"
                        />
                        <img
                            src={refuseImg}
                            alt="Отменить"
                            width={17}
                            height={17}
                            onClick={onRefuseTitleClick}
                            className="me-2"
                        />
                        <img
                            src={okImg}
                            alt="Принять"
                            width={20}
                            height={20}
                            onClick={onAcceptTitleClick}
                        />
                    </>
                ) : (
                    <>
                        <h3 className="mb-3 me-2">{title.value}</h3>
                        <img
                            src={editImg}
                            alt="Изменить"
                            width={20}
                            height={20}
                            onClick={onEditTitleClick}
                        />
                    </>
                )}
            </div>
            <ControlBar
                onSaveModelClick={onSaveModelClick}
                savingDisabled={title.editingMode}
                onStartModelClick={onStartModelClick}
                onDeleteModelClick={onDeleteModelClick}
            />
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
                <ObjectInspector
                    selected={selected}
                    modelParams={modelParams}
                    setModelParamsTroughPrevState={
                        setModelParamsTroughPrevState
                    }
                    getDeviceParams={getDeviceParams}
                    setDeviceParams={setDeviceParams}
                    buffers={buffers}
                    facilities={facilities}
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

export default ModelEditingPage;
