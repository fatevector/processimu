import { useEffect, useState } from "react";
import Grid from "../ui/grid";
import Palette from "../ui/palette";
import sourceImg from "../../icons/icons8-arrow-right-64.png"; // https://icons8.com/icons/set/start

const ModelCreationPage = () => {
    const mapWidth = 600;
    const mapHeight = 600;
    const [devices, setDevices] = useState([
        {
            src: sourceImg,
            name: "source",
            id: Math.random(),
            ports: [
                {
                    id: Math.random(),
                    side: "right",
                    entrance: "out"
                }
            ],
            position: {
                left: 40,
                top: 80
            }
        }
    ]);
    // const [selected, setSelected] = useState(null);
    // const [paths, setPaths] = useState();

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
        </div>
    );
};

export default ModelCreationPage;
