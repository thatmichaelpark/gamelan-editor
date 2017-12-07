import { observable } from 'mobx';

class BeatStore {
    realBeat; // floating-point beat [0..nBeats) or -1 if not playing
    @observable beat; // integer part of realBeat or -1 if not playing
    @observable nBeats; // length of piece in beats

    constructor() {
        this.beat = -1;
        this.realBeat = -1;
    }

    advance(dt) {
        this.realBeat += dt;
        this.beat = Math.floor(this.realBeat);
        if (this.realBeat >= this.nBeats) {
            this.stop();
        }
    }
    
    start() {
        this.advance(1);
        this.timer = setInterval(() => {
            this.advance(1);
        }, 100);
    }
    
    pause() {
        
    }
    
    stop() {
        clearInterval(this.timer);
        this.beat = -1;
        this.realBeat = -1;
        console.log('stopped');;;
    }
}

export default new BeatStore();
