import { observable } from 'mobx';
import { currentPiece } from './piecesStore';
import interpolator from '../interpolator';

class BeatStore {
    realBeat; // floating-point beat [0..nBeats)
    @observable beat; // integer part of realBeat or -1 if not playing
    @observable nBeats; // length of piece in beats

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
    
    advance(dt) {
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
    }
    
    start() {
        this.advance(0);
        this.timer = setInterval(() => {
            this.advance(0.050);
        }, 50);
    }
    
    pause() {
        
    }
    
    stop() {
        clearInterval(this.timer);
        this.beat = -1;
        this.realBeat = 0;
    }
}

export default new BeatStore();
