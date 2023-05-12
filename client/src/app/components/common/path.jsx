const Path = ({ path, onSelected, selected }) => {
    const a = path.a;
    const b = path.b;

    return (
        <>
            <path
                d={`M${a.left},${a.top} C${a.left + (b.left - a.left) / 2},${
                    a.top
                } ${a.left + (b.left - a.left) / 2},${b.top} ${b.left},${
                    b.top
                }`}
                // d={`M${a.left},${a.top} L${b.left},${b.top}`}
                className={
                    "centerPath" + (selected?.id === path.id ? " selected" : "")
                }
                onClick={() =>
                    onSelected({
                        ...path,
                        elementType: "path"
                    })
                }
            ></path>
            {/* Раскомментировать, чтобы увидеть контрольные точки */}
            {/* <circle
                cx={a.left + (b.left - a.left) / 2}
                cy={a.top}
                r={"0.5"}
            ></circle>
            <circle
                cx={a.left + (b.left - a.left) / 2}
                cy={b.top}
                r={"0.5"}
            ></circle> */}
        </>
    );
};

export default Path;
