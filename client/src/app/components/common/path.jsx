const Path = ({ path, onSelected, selected }) => {
    const a = path.a;
    const b = path.b;

    return (
        <>
            <path
                // d={`M${a.left},${a.top} C50,${a.top} 50 ${b.top} ${b.left} ${b.top}`}
                d={`M${a.left},${a.top} L${b.left},${b.top}`}
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
        </>
    );
};

export default Path;
