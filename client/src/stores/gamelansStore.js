// 0̇ 1̇ 2̇ 3̇ 4̇ 5̇ 6̇ 7̇ 8̇ 9̇ 0̣ 1̣ 2̣ 3̣ 4̣ 5̣ 6̣ 7̣ 8̣ 9̣
import { observable } from 'mobx';
import axios from 'axios';

class Sample {
    constructor(ctx, buffer, destination) {
        this.audioContext = ctx;
        this.buffer = buffer;
        this.destination = destination;
    }
    trigger(time) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.destination);
        this.source.start(time);
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
                tones: [
                    { pitch: 'G', sample: null, filename: 'pelog/gong/gong pelog.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                tones: [
                    { pitch: 'S', sample: null, filename: 'pelog/gong/gong suwuk p2.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
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
                tones: [
                    { pitch: '+', sample: null, filename: 'pelog/tuk pelog.mp3' }
                ]
            }
        ]),
        new Gamelan('slendro', [
            {
                name: 'Bonang barung',
                nHands: 2,
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
                tones: [
                    { pitch: 'G', sample: null, filename: 'slendro/gong/gong ageng slendro.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                tones: [
                    { pitch: 'S', sample: null, filename: 'slendro/gong/gong suwuk s1.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
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
                tones: [
                    { pitch: '+', sample: null, filename: 'slendro/tuk slendro.mp3' }
                ]
            }
        ])
    ];
    gamut(scale, instrument) {
        return this.gamelans.find(g => g.scale === scale)
            .instruments.find(inst => inst.name === instrument)
            .tones.map(tone => tone.pitch);
    }
    
    @observable nToLoad = 0;
    @observable nLoaded = 0;
    loadInstrument(scale, instrumentName, audioContext) {
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
                    tone.sample = new Sample(audioContext, buffer/*, gains[zounds[name].gain]*/);
                    this.nLoaded += 1;
                    if (this.nLoaded === this.nToLoad) {
                        this.nLoaded = this.nToLoad = 0;
                    }
                });
            });
        });
    }
}

const gamelansStore = new GamelansStore();
export default gamelansStore;
