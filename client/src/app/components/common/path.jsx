const Path = ({ path }) => {
    const a = path.a;
    const b = path.b;
    return (
        <path
            // d={`M${a.left},${a.top} C50,${a.top} 50 ${b.top} ${b.left} ${b.top}`}
            d={`M${a.left},${a.top} L${b.left},${b.top}`}
            onClick={() => console.log("path")}
        ></path>
    );
};

export default Path;
