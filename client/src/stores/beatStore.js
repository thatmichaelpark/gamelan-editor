import { observable } from 'mobx';
import { currentPiece } from './piecesStore';

function interpolator(pointsList, t) {
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

class BeatStore {
    @observable realBeat; // floating-point beat [0..nBeats)
    @observable beat; // integer part of realBeat or -1 if not playing
    @observable nBeats; // length of piece in beats
    prevTimestamp = 0;
    rafRequest = 0; // current requestAnimationFrame request
    @observable isPlaying = false;
    
    constructor() {
        this.beat = -1;
        this.realBeat = 0;
    }

    tick = (timestamp) => {
        if (!this.prevTimestamp) {
            this.prevTimestamp = timestamp;
        }
        const dt = 0.001 * (timestamp - this.prevTimestamp);

        this.prevTimestamp = timestamp;
        
        const timeScaler = interpolator(currentPiece.tempoPoints, this.realBeat / this.nBeats);

        this.realBeat += dt * timeScaler * currentPiece.bpm / 60;
        if (this.realBeat >= this.nBeats) {
            this.stop();
            return;
        }
        
        const newBeat = Math.floor(this.realBeat);
        if (this.beat !== newBeat) {
            this.beat = newBeat;
            currentPiece.playBeat(this.beat);
        }
        this.rafRequest = requestAnimationFrame(this.tick);
    }
    
    start = () => {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.rafRequest = requestAnimationFrame(this.tick);
        }
    }
    
    pause = () => {
        if (this.isPlaying) {
            this.isPlaying = false;
            cancelAnimationFrame(this.rafRequest);
            this.prevTimestamp = 0;
        }
        else {
            this.start();
        }
    }

    stop = () => {
        if (this.isPlaying) {
            this.isPlaying = false;
            cancelAnimationFrame(this.rafRequest);
        }
        this.beat = -1;
        this.realBeat = 0;
        this.prevTimestamp = 0;
    }
}

export default new BeatStore();
