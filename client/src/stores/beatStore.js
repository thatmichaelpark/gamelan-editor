import { observable } from 'mobx';

class BeatStore {
    @observable beat;

    constructor() {
        this.beat = -1;
    }

    advance() {
        this.beat += 1;
    }
}

export default new BeatStore();
