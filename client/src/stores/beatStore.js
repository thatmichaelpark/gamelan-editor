import { observable } from 'mobx';
import { currentPiece } from './piecesStore';
import audioContext from '../audioContext';

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

const initialTimestamp = -2; // gives requestAnimationFrame a few frames to warm up

class BeatStore {
    @observable realBeat; // floating-point beat [0..nBeats)
    @observable beat; // integer part of realBeat or -1 if not playing
    @observable nBeats; // length of piece in beats (probably should live on currentPiece)
    prevTimestamp = initialTimestamp;
    rafRequest = 0; // current requestAnimationFrame request
    @observable isPlaying = false;
    
    constructor() {
        this.beat = -1;
        this.realBeat = 0;  // based on raf
        this.realBeat0 = 0;
        this.realBeat1 = 0;
        this.lookaheadTime = 0.3; // seconds
    }

    tick = (timestamp) => {
        const audioTime = audioContext.currentTime;
        
        if (this.prevTimestamp < 0) {
            ++this.prevTimestamp;
            this.rafRequest = requestAnimationFrame(this.tick);
            return;
        }
        if (!this.prevTimestamp) {
            this.prevTimestamp = timestamp;
        }
        const dt = 0.001 * (timestamp - this.prevTimestamp);
        this.prevTimestamp = timestamp;
        if (dt >= this.lookaheadTime) {
            console.log(Math.round(dt * 1000), 'ms');;;
        }
        
        const timeScaler = interpolator(currentPiece.tempoPoints, this.realBeat / this.nBeats)
                            * currentPiece.bpm / 60;
        // #seconds * timeScaler => #beats
        this.realBeat += dt * timeScaler;
        if (this.realBeat >= this.nBeats) {
            this.stop();
            return;
        }

        this.realBeat1 = this.realBeat + this.lookaheadTime * timeScaler;
        this.realBeat1 = Math.max(this.realBeat0, this.realBeat1); // just in case time went backwards

        // for integer beats b in [realBeat0..realBeat1) playBeat(b)
        for (let b = Math.ceil(this.realBeat0); b < this.realBeat1; ++b) {
            const t = (b - this.realBeat) / timeScaler;
            currentPiece.playBeat(b, audioTime + t);
        }
        
        this.realBeat0 = this.realBeat1;
        this.beat = Math.floor(this.realBeat);
        // const newBeat = Math.floor(this.realBeat);
        // if (this.beat !== newBeat) {
        //     this.beat = newBeat;
        //     currentPiece.playBeat(this.beat);
        // }
        this.rafRequest = requestAnimationFrame(this.tick);
    }
    
    start = () => {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.prevTimestamp = initialTimestamp;
            this.realBeat0 = this.realBeat1 = this.realBeat;
            this.rafRequest = requestAnimationFrame(this.tick);
        }
    }
    
    pause = () => {
        if (this.isPlaying) {
            this.isPlaying = false;
            cancelAnimationFrame(this.rafRequest);
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
    }
}

export default new BeatStore();
