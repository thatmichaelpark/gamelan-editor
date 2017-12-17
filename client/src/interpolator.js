function integrator(pointsList, t) {
    // pointsList: [{t0, f0}, {t1, f1}...] describing a piecewise-linear curve
    // returns f on curve at given t

    for (let i = 0; i < pointsList.length - 1; ++i) {
        const t0 = pointsList[i].t;
        const f0 = pointsList[i].f;
        const t1 = pointsList[i + 1].t;
        const f1 = pointsList[i + 1].f;
        if (t0 <= t && t <= t1) {
            const f = f0 + (f1 - f0) * (t - t0) / (t1 - t0);
            return f;
        }
    }
}

export default integrator;