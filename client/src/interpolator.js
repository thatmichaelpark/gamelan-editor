function integrator(pointsList, x) {
    // pointsList: [{x0, y0}, {x1, y1}...] describing a piecewise-linear curve
    // returns y on curve at given x

    for (let i = 0; i < pointsList.length - 1; ++i) {
        const x0 = pointsList[i].x;
        const y0 = pointsList[i].y;
        const x1 = pointsList[i + 1].x;
        const y1 = pointsList[i + 1].y;
        if (x0 <= x && x <= x1) {
            const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0);
            return y;
        }
    }
}

export default integrator;