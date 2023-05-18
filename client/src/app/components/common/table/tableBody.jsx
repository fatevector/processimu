import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

const TableBody = ({ items, columns }) => {
    const renderContent = (item, column) => {
        if (columns[column].component) {
            const component = columns[column].component;
            if (typeof component === "function") {
                return component(item);
            }
            return component;
        }
        return get(item, columns[column].path);
    };

    return (
        <tbody>
            {items.map(item => (
                <tr key={item.id} onClick={item.onClick}>
                    {Object.keys(columns).map(column => (
                        <td key={column}>{renderContent(item, column)}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

TableBody.propTypes = {
    items: PropTypes.array.isRequired,
    columns: PropTypes.object.isRequired
};

export default TableBody;
