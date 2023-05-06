const Grid = ({ mapWidth, mapHeight }) => {
    let dragObject = {};

    document.onmousedown = e => {
        if (e.button !== 0) {
            // если клик не левой кнопкой мыши
            return; // то он не запускает перенос
        }

        const elem = e.target.closest(".draggable");

        if (!elem) return; // не нашли, клик вне draggable-объекта

        // запомнить переносимый объект
        dragObject.elem = elem;

        // запомнить координаты, с которых начат перенос объекта
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
        dragObject.initIndentX = +dragObject.elem.style.left.slice(0, -2) || 0;
        dragObject.initIndentY = +dragObject.elem.style.top.slice(0, -2) || 0;

        // задаем доступные границы перетаскивания
        const field = e.target.closest(".droppable");
        const fieldWidth = field.getBoundingClientRect().width;
        const fieldHeight = field.getBoundingClientRect().height;
        dragObject.minLeft = fieldWidth - mapWidth;
        dragObject.minTop = fieldHeight - mapHeight;
        dragObject.maxLeft = 0;
        dragObject.maxTop = 0;
    };

    document.onmousemove = function (e) {
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
    };

    document.onmouseup = function (e) {
        // очистим "состояние переноса" dragObject
        dragObject = {};
    };

    return (
        <div className="field droppable">
            <div
                className="map draggable"
                style={{ width: mapWidth, height: mapHeight }}
            ></div>
        </div>
    );
};

export default Grid;
