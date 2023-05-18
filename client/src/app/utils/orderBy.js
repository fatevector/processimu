const orderBy = (items = [], field, order) => {
    const array = [...items];
    if (typeof array[0][field] === "string")
        return order === "asc"
            ? array.sort(
                  (a, b) =>
                      (a[field].toUpperCase() > b[field].toUpperCase()) -
                      (a[field].toUpperCase() < b[field].toUpperCase())
              )
            : array.sort(
                  (a, b) =>
                      (a[field].toUpperCase() < b[field].toUpperCase()) -
                      (a[field].toUpperCase() > b[field].toUpperCase())
              );
    return order === "asc"
        ? array.sort((a, b) => a[field] - b[field])
        : array.sort((a, b) => b[field] - a[field]);
};

export default orderBy;
