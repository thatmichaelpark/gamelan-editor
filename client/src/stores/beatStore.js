import { observable } from 'mobx';
import { currentPiece } from './piecesStore';
import interpolator from '../interpolator';

class BeatStore {
    realBeat; // floating-point beat [0..nBeats)
    @observable beat; // integer part of realBeat or -1 if not playing
    @observable nBeats; // length of piece in beats
    prevTimestamp = 0;
    rafRequest = 0; // current requestAnimationFrame request
    @observable isPlaying = false;
    
    constructor() {
        this.beat = -1;
        this.realBeat = 0;
    }

    pointsList = [
        {x: 0, y: 1},
        {x: 0.8, y: 1},
        {x: 1, y: 0.5},
    ];
    bpm = 120;
    
    tick = (timestamp) => {
        const dt = 0.001 * (this.prevTimestamp ? timestamp - this.prevTimestamp : 0);
        this.prevTimestamp = timestamp;

        const timeScaler = interpolator(this.pointsList, this.realBeat / this.nBeats);

        this.realBeat += dt * timeScaler * this.bpm / 60;
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
            this.beat = -1;
            this.realBeat = 0;
            this.prevTimestamp = 0;
        }
    }
}

export default new BeatStore();
