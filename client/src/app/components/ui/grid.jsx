import { useEffect } from "react";

import Device from "../common/device";
import Path from "../common/path";

const Grid = ({ mapWidth, mapHeight, devices, paths, makeConnection }) => {
    //перетаскивание сетки
    useEffect(() => {
        let dragObject = {};

        document.addEventListener("mousedown", e => {
            if (e.button !== 0) {
                // если клик не левой кнопкой мыши
                return; // то он не запускает перенос
            }

            const device = e.target.closest(".draggable");
            if (device) return; // выходим, если схватили устройство на карте

            const elem = e.target.closest(".map");

            if (!elem) return; // не нашли, клик вне draggable-объекта

            // запомнить переносимый объект
            dragObject.elem = elem;

            // запомнить координаты, с которых начат перенос объекта
            dragObject.downX = e.pageX;
            dragObject.downY = e.pageY;
            dragObject.initIndentX =
                +dragObject.elem.style.left.slice(0, -2) || 0;
            dragObject.initIndentY =
                +dragObject.elem.style.top.slice(0, -2) || 0;

            // задаем доступные границы перетаскивания
            const field = e.target.closest(".field");
            const fieldWidth = field.getBoundingClientRect().width;
            const fieldHeight = field.getBoundingClientRect().height;
            dragObject.minLeft =
                fieldWidth - elem.getBoundingClientRect().width;
            dragObject.minTop =
                fieldHeight - elem.getBoundingClientRect().height;
            dragObject.maxLeft = 0;
            dragObject.maxTop = 0;
        });

        document.addEventListener("mousemove", e => {
            if (!dragObject.elem) return; // элемент не зажат

            const moveX = e.pageX - dragObject.downX;
            const moveY = e.pageY - dragObject.downY;

            // отображаем перенос объекта при каждом движении мыши
            // не позволяем перемещать за границы поля
            let newLeft = dragObject.initIndentX + moveX;
            if (newLeft < dragObject.minLeft) newLeft = dragObject.minLeft;
            if (newLeft > dragObject.maxLeft) newLeft = dragObject.maxLeft;
            dragObject.elem.style.left = newLeft + "px";

            let newTop = dragObject.initIndentY + moveY;
            if (newTop < dragObject.minTop) newTop = dragObject.minTop;
            if (newTop > dragObject.maxTop) newTop = dragObject.maxTop;
            dragObject.elem.style.top = newTop + "px";

            return false;
        });

        document.addEventListener("mouseup", e => {
            // очистим "состояние переноса" dragObject
            dragObject = {};
        });
    }, []);

    useEffect(() => {
        const mapNode = document.querySelector(".map");
        if (mapNode) {
            mapNode.setAttribute(
                "style",
                `width:${mapWidth}px; height:${mapHeight}px;`
            );
        }
    }, [mapWidth, mapHeight]);

    return (
        <div className="field">
            <div className="map">
                {devices
                    .filter(d => d.parent === "map")
                    .map(device => (
                        <Device
                            device={device}
                            key={device.id}
                            left={device.position.left}
                            top={device.position.top}
                            zIndex={device.position.zIndex}
                            makeConnection={makeConnection}
                        />
                    ))}
                <svg id="svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {paths.map(path => (
                        <Path path={path} key={path.id}></Path>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default Grid;
