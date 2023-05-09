import generateId from "../../utils/generateId";

import sourceImg from "../../icons/icons8-arrow-right-64.png"; // https://icons8.com/icons/set/start
// pack: https://www.flaticon.com/free-icon/take-away_6406139?term=take&page=1&position=3&origin=search&related_id=6406139
// down-arrow: https://www.flaticon.com/free-icon/down-arrow_2989995?term=down+arrow&page=1&position=11&origin=search&related_id=2989995
// up-arrow: https://www.flaticon.com/free-icon/up-arrow_2989972?term=arrow+up&page=1&position=1&origin=style&related_id=2989972
import takeFromStorageImg from "../../icons/takeFromStorage.png";
import putInStorageImg from "../../icons/putInStorage.png";
import queueImg from "../../icons/icons8-queue-50.png"; // https://icons8.com/icon/30324/

import Device from "../common/device";

const Palette = () => {
    const TOP = "top";
    const BOTTOM = "bottom";
    const LEFT = "left";
    const RIGHT = "right";

    const IN = "in";
    const OUT = "out";

    const configDevice = (src, name, ports) => {
        return {
            src,
            name,
            ports: ports.map(([side, entrance]) => ({
                side,
                entrance
            }))
        };
    };

    const devices = [
        configDevice(sourceImg, "source", [[RIGHT, OUT]]),
        configDevice(takeFromStorageImg, "takeFromStorage", [
            [LEFT, IN],
            [RIGHT, OUT]
        ]),
        configDevice(putInStorageImg, "putInStorage", [
            [LEFT, IN],
            [RIGHT, OUT]
        ]),
        configDevice(queueImg, "queue", [
            [LEFT, IN],
            [RIGHT, OUT]
        ])
    ];

    /*
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
            var avatar = dragObject.elem.cloneNode(true); // сюда можно вставить замену аватара элементом
            const left = getCoords(dragObject.elem).left;
            const top = getCoords(dragObject.elem).top;
            if (dragObject.elem.dataset.onMap) {
                dragObject.elem.parentNode?.removeChild(dragObject.elem);
            }
            document.body.appendChild(avatar);
            avatar.style.zIndex = 9999;
            avatar.style.position = "absolute";
            avatar.style.left = left + "px";
            avatar.style.top = top + "px";

            // функция для отмены переноса
            avatar.rollback = function () {
                avatar.parentNode.removeChild(avatar);
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
            dragObject.avatar.style.left = e.pageX - dragObject.shiftX + "px";
            dragObject.avatar.style.top = e.pageY - dragObject.shiftY + "px";

            return false;
        });

        function findDroppable(event) {
            // спрячем переносимый элемент
            dragObject.avatar.hidden = true;

            // получить самый вложенный элемент под курсором мыши
            var elem = document.elementFromPoint(event.clientX, event.clientY);

            // показать переносимый элемент обратно
            dragObject.avatar.hidden = false;

            if (elem == null) {
                // такое возможно, если курсор мыши "вылетел" за границу окна
                return null;
            }

            return elem.closest(".droppable");
        }

        function finishDrag(e) {
            var dropElem = findDroppable(e);

            if (dropElem) {
                const oldLeft = +dragObject.avatar.style.left.slice(0, -2) || 0;
                const oldTop = +dragObject.avatar.style.top.slice(0, -2) || 0;
                dragObject.avatar.parentNode.removeChild(dragObject.avatar);
                dragObject.avatar.style.zIndex = "auto";

                const coords = getCoords(dropElem);
                const left = oldLeft - coords.left;
                const top = oldTop - coords.top;
                dragObject.avatar.style.left = left + "px";
                dragObject.avatar.style.top = top + "px";

                dropElem.appendChild(dragObject.avatar);
                dragObject.avatar.dataset.onMap = true;

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
            }

            // в конце mouseup перенос либо завершился, либо даже не начинался
            // в любом случае очистим "состояние переноса" dragObject
            dragObject = {};
        });
    }, []);
    */

    return (
        <div className="d-flex flex-column">
            {devices.map(device => (
                <div className="paletteCell" key={generateId()}>
                    {/* <Device device={device} /> */}
                </div>
            ))}
        </div>
    );
};

export default Palette;
