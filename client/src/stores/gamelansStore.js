// 0̇ 1̇ 2̇ 3̇ 4̇ 5̇ 6̇ 7̇ 8̇ 9̇ 0̣ 1̣ 2̣ 3̣ 4̣ 5̣ 6̣ 7̣ 8̣ 9̣
import { observable } from 'mobx';
import axios from 'axios';
import audioContext from '../audioContext';

class Sample {
    constructor(buffer, destination) {
        this.buffer = buffer;
        this.destination = destination;
    }
    trigger(time) {
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.destination);
        this.source.start(time);
    }
}

class DampedSample {
    constructor(buffer, destination) {
        this.buffer = buffer;
        this.destination = destination;
    }
    trigger(time) {
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.dampGain = audioContext.createGain();
        this.source.connect(this.dampGain);
        this.dampGain.connect(this.destination);
        this.source.start(time);
    }
    damp(time) {
        this.dampGain.gain.setValueAtTime(1, time);
        this.dampGain.gain.linearRampToValueAtTime(0, time + 0.05)
    }
}

class Gamelan {
    @observable scale;          // string
    @observable instruments;    // string
    constructor(scale, instruments) {
        this.scale = scale;
        this.instruments = instruments;
    }
}

class GamelansStore {
    @observable gamelans = [
        new Gamelan('pelog', [
            {
                name: 'Bonang barung',
                nHands: 2,
                damping: false,
                tones: [
                    { pitch: '1̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo1.mp3' },
                    { pitch: '2̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo2.mp3' },
                    { pitch: '3̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo3.mp3' },
                    { pitch: '4̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo4.mp3' },
                    { pitch: '5̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo5.mp3' },
                    { pitch: '6̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo6.mp3' },
                    { pitch: '7̣', sample: null, filename: 'pelog/bonang barung/bonang barung p lo7.mp3' },
                    { pitch: '1', sample: null, filename: 'pelog/bonang barung/bonang barung p1.mp3' },
                    { pitch: '2', sample: null, filename: 'pelog/bonang barung/bonang barung p2.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/bonang barung/bonang barung p3.mp3' },
                    { pitch: '4', sample: null, filename: 'pelog/bonang barung/bonang barung p4.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/bonang barung/bonang barung p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/bonang barung/bonang barung p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/bonang barung/bonang barung p7.mp3' }
                ]
            },
            {
                name: 'Bonang panerus',
                nHands: 2,
                damping: false,
                tones: [
                    { pitch: '1̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo1.mp3' },
                    { pitch: '2̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo2.mp3' },
                    { pitch: '3̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo3.mp3' },
                    { pitch: '4̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo4.mp3' },
                    { pitch: '5̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo5.mp3' },
                    { pitch: '6̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo6.mp3' },
                    { pitch: '7̣', sample: null, filename: 'pelog/bonang panerus/bonang panerus p lo7.mp3' },
                    { pitch: '1', sample: null, filename: 'pelog/bonang panerus/bonang panerus p1.mp3' },
                    { pitch: '2', sample: null, filename: 'pelog/bonang panerus/bonang panerus p2.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/bonang panerus/bonang panerus p3.mp3' },
                    { pitch: '4', sample: null, filename: 'pelog/bonang panerus/bonang panerus p4.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/bonang panerus/bonang panerus p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/bonang panerus/bonang panerus p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/bonang panerus/bonang panerus p7.mp3' }
                ]
            },
            {
                name: 'Gong ageng',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: 'G', sample: null, filename: 'pelog/gong/gong pelog.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: 'S', sample: null, filename: 'pelog/gong/gong suwuk p2.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '1', sample: null, filename: 'pelog/nong/nong p1.mp3' },
                    { pitch: '2', sample: null, filename: 'pelog/nong/nong p2.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/nong/nong p3.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/nong/nong p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/nong/nong p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/nong/nong p7.mp3' }
                ]
            },
            {
                name: 'Peking',
                nHands: 1,
                damping: true,
                tones: [
                    { pitch: '1', sample: null, filename: 'pelog/peking/peking p1.mp3' },
                    { pitch: '2', sample: null, filename: 'pelog/peking/peking p2.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/peking/peking p3.mp3' },
                    { pitch: '4', sample: null, filename: 'pelog/peking/peking p4.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/peking/peking p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/peking/peking p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/peking/peking p7.mp3' }
                ]
            },
            {
                name: 'Pul',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '1', sample: null, filename: 'pelog/pul/pul p1.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/pul/pul p3.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/pul/pul p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/pul/pul p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/pul/pul p7.mp3' }
                ]
            },
            {
                name: 'Saron',
                nHands: 1,
                damping: true,
                tones: [
                    { pitch: '1', sample: null, filename: 'pelog/saron/saron p1.mp3' },
                    { pitch: '2', sample: null, filename: 'pelog/saron/saron p2.mp3' },
                    { pitch: '3', sample: null, filename: 'pelog/saron/saron p3.mp3' },
                    { pitch: '4', sample: null, filename: 'pelog/saron/saron p4.mp3' },
                    { pitch: '5', sample: null, filename: 'pelog/saron/saron p5.mp3' },
                    { pitch: '6', sample: null, filename: 'pelog/saron/saron p6.mp3' },
                    { pitch: '7', sample: null, filename: 'pelog/saron/saron p7.mp3' }
                ]
            },
            {
                name: 'Tuk',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '+', sample: null, filename: 'pelog/tuk pelog.mp3' }
                ]
            }
        ]),
        new Gamelan('slendro', [
            {
                name: 'Bonang barung',
                nHands: 2,
                damping: false,
                tones: [
                    { pitch: '1̣', sample: null, filename: 'slendro/bonang barung/bonang barung s lo1.mp3' },
                    { pitch: '2̣', sample: null, filename: 'slendro/bonang barung/bonang barung s lo2.mp3' },
                    { pitch: '3̣', sample: null, filename: 'slendro/bonang barung/bonang barung s lo3.mp3' },
                    { pitch: '5̣', sample: null, filename: 'slendro/bonang barung/bonang barung s lo5.mp3' },
                    { pitch: '6̣', sample: null, filename: 'slendro/bonang barung/bonang barung s lo6.mp3' },
                    { pitch: '1', sample: null, filename: 'slendro/bonang barung/bonang barung s1.mp3' },
                    { pitch: '2', sample: null, filename: 'slendro/bonang barung/bonang barung s2.mp3' },
                    { pitch: '3', sample: null, filename: 'slendro/bonang barung/bonang barung s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/bonang barung/bonang barung s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/bonang barung/bonang barung s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/bonang barung/bonang barung s hi1.mp3' },
                    { pitch: '2̇', sample: null, filename: 'slendro/bonang barung/bonang barung s hi2.mp3' }
                ]
            },
            {
                name: 'Bonang panerus',
                nHands: 2,
                damping: false,
                tones: [
                    { pitch: '1̣', sample: null, filename: 'slendro/bonang panerus/bonang panerus s lo1.mp3' },
                    { pitch: '2̣', sample: null, filename: 'slendro/bonang panerus/bonang panerus s lo2.mp3' },
                    { pitch: '3̣', sample: null, filename: 'slendro/bonang panerus/bonang panerus s lo3.mp3' },
                    { pitch: '5̣', sample: null, filename: 'slendro/bonang panerus/bonang panerus s lo5.mp3' },
                    { pitch: '6̣', sample: null, filename: 'slendro/bonang panerus/bonang panerus s lo6.mp3' },
                    { pitch: '1', sample: null, filename: 'slendro/bonang panerus/bonang panerus s1.mp3' },
                    { pitch: '2', sample: null, filename: 'slendro/bonang panerus/bonang panerus s2.mp3' },
                    { pitch: '3', sample: null, filename: 'slendro/bonang panerus/bonang panerus s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/bonang panerus/bonang panerus s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/bonang panerus/bonang panerus s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/bonang panerus/bonang panerus s hi1.mp3' },
                    { pitch: '2̇', sample: null, filename: 'slendro/bonang panerus/bonang panerus s hi2.mp3' }
                ]
            },
            {
                name: 'Gong ageng',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: 'G', sample: null, filename: 'slendro/gong/gong ageng slendro.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: 'S', sample: null, filename: 'slendro/gong/gong suwuk s1.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '2', sample: null, filename: 'slendro/nong/nong s2.mp3' },
                    { pitch: '3', sample: null, filename: 'slendro/nong/nong s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/nong/nong s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/nong/nong s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/nong/nong s1̇.mp3' }
                ]
            },
            {
                name: 'Peking',
                nHands: 1,
                damping: true,
                tones: [
                    { pitch: '6̣', sample: null, filename: 'slendro/peking/peking s lo6.mp3' },
                    { pitch: '1', sample: null, filename: 'slendro/peking/peking s1.mp3' },
                    { pitch: '2', sample: null, filename: 'slendro/peking/peking s2.mp3' },
                    { pitch: '3', sample: null, filename: 'slendro/peking/peking s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/peking/peking s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/peking/peking s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/peking/peking s hi1.mp3' }
                ]
            },
            {
                name: 'Pul',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '3', sample: null, filename: 'slendro/pul/pul s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/pul/pul s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/pul/pul s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/pul/pul s1̇.mp3' }
                ]
            },
            {
                name: 'Saron',
                nHands: 1,
                damping: true,
                tones: [
                    { pitch: '6̣', sample: null, filename: 'slendro/saron/saron s lo6.mp3' },
                    { pitch: '1', sample: null, filename: 'slendro/saron/saron s1.mp3' },
                    { pitch: '2', sample: null, filename: 'slendro/saron/saron s2.mp3' },
                    { pitch: '3', sample: null, filename: 'slendro/saron/saron s3.mp3' },
                    { pitch: '5', sample: null, filename: 'slendro/saron/saron s5.mp3' },
                    { pitch: '6', sample: null, filename: 'slendro/saron/saron s6.mp3' },
                    { pitch: '1̇', sample: null, filename: 'slendro/saron/saron s hi1.mp3' },
                    { pitch: '2̇', sample: null, filename: 'slendro/saron/saron s hi2.mp3' },
                    { pitch: '3̇', sample: null, filename: 'slendro/saron/saron s hi3.mp3' }
                ]
            },
            {
                name: 'Tuk',
                nHands: 1,
                damping: false,
                tones: [
                    { pitch: '+', sample: null, filename: 'slendro/tuk slendro.mp3' }
                ]
            }
        ])
    ];
    gamut(scale, instrumentName) {
        const instrument = this.gamelans.find(g => g.scale === scale)
            .instruments.find(instrument => instrument.name === instrumentName);
        const gamut = instrument.tones.map(tone => tone.pitch);
        if (instrument.damping) {
            gamut.push(',');
        }
        return gamut;
    }
    
    @observable nToLoad = 0;
    @observable nLoaded = 0;
    loadInstrument(scale, instrumentName) {
        const gamelan = this.gamelans.find(g => g.scale === scale);
        const instrument = gamelan.instruments.find(inst => inst.name === instrumentName);

        instrument.tones.forEach(tone => {
            if (tone.sample) {
                return; // skip if sample has already been loaded
            }
            this.nToLoad += 1;
            axios.get(`sounds/${tone.filename}`, { responseType: 'arraybuffer' })
            .then(response => {
                audioContext.decodeAudioData(response.data, buffer => {
                    if (instrument.damping) {
                        tone.sample = new DampedSample(buffer/*, gains[zounds[name].gain]*/, audioContext.destination);
                    }
                    else {
                        tone.sample = new Sample(buffer/*, gains[zounds[name].gain]*/, audioContext.destination);
                    }
                    this.nLoaded += 1;
                    if (this.nLoaded === this.nToLoad) {
                        this.nLoaded = this.nToLoad = 0;
                    }
                });
            });
        });
    }
    
    previousSampleMap = new Map(); // (scale, instrumentName) => sample
    
    triggerInstrument(scale, instrumentName, note) {
        const gamelan = this.gamelans.find(g => g.scale === scale);
        const instrument = gamelan.instruments.find(inst => inst.name === instrumentName);
        if (note === ',') {
            this.previousSample = this.previousSampleMap.get(scale + instrumentName);
            if (this.previousSample) {
                this.previousSample.damp(audioContext.currentTime);
                this.previousSampleMap.set(scale + instrumentName);
            }
        }
        else {
            const tone = instrument.tones.find(tone => tone.pitch === note);
            if (instrument.damping) {
                this.previousSample = this.previousSampleMap.get(scale + instrumentName);
                if (this.previousSample) {
                    this.previousSample.damp(audioContext.currentTime);
                }
            }
            tone.sample.trigger(audioContext.currentTime);
            this.previousSampleMap.set(scale + instrumentName, tone.sample);
        }
    }
}

const gamelansStore = new GamelansStore();
export default gamelansStore;
