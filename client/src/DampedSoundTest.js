import axios from 'axios';
import React from 'react';
import { observer } from 'mobx-react';
import RowStore from './stores/store';

const rowStore = new RowStore([10, 11, 12]);

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
context.createOscillator(); // Chrome bug: needs this to start audio clock.

class Sample {
    constructor(ctx, buffer, destination) {
        this.context = ctx;
        this.buffer = buffer;
        this.destination = destination;
    }
    trigger(time) {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.destination);
        this.source.start(time);
    }
}

class DampedSample {
    constructor(ctx, buffer, destination) {
        this.context = ctx;
        this.buffer = buffer;
        this.destination = destination;
    }
    trigger(time) {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.dampGain = this.context.createGain();
        this.source.connect(this.dampGain);
        this.dampGain.connect(this.destination);
        this.source.start(time);
    }
    damp(time) {
        this.dampGain.gain.setValueAtTime(1, time);
        this.dampGain.gain.linearRampToValueAtTime(0, time + 0.05)
    }
}

class DampedInstrument {
    constructor(samples) {
        this.samples = samples;
        this.playingSample = null;
    }
    trigger(sampleIndex, time) {
        if (this.playingSample) {
            this.playingSample.damp(time);
            this.playingSample = null;
        }
        this.playingSample = this.samples[sampleIndex].sample;
        this.playingSample.trigger(time);
    }
}

const samples = [
    { filename: '/sounds/slendro/peking/peking s1.mp3' },
    { filename: '/sounds/slendro/peking/peking s2.mp3' },
    { filename: '/sounds/slendro/peking/peking s3.mp3' },
];

let n = samples.length;
let peking;

samples.forEach(sample => {
    axios.get(sample.filename, { responseType: 'arraybuffer' })
    .then((response) => { // eslint-disable-line no-loop-func
        context.decodeAudioData(response.data, (buffer) => {
            sample.sample = new DampedSample(context, buffer, context.destination);
            if (--n === 0) {
                console.log('done');
                peking = new DampedInstrument(samples);
                const t = context.currentTime;
                peking.trigger(0, t);
                peking.trigger(1, t + 1);
            }
        });
    });
});

@observer
class Square extends React.Component {
    handleClick = (index) => {
        peking.trigger(index, context.currentTime);;;
        this.props.note.note += 1;
        console.log(this.element.getBoundingClientRect());
    }
    render() {
        return (
            <div onClick={() => this.handleClick(this.props.index)} ref={x => this.element = x}>
                {this.props.note.note}
            </div>
        )
    }
}
@observer
class App extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <div>
                {rowStore.notes.map((n, i) => <Square key={i} index={i} note={n}/>)}
                {rowStore.notes.map(n => n.note).join(', ')}
            </div>
        );
    }
}

export default App;
