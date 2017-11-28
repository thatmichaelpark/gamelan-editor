// 0̇ 1̇ 2̇ 3̇ 4̇ 5̇ 6̇ 7̇ 8̇ 9̇ 0̣ 1̣ 2̣ 3̣ 4̣ 5̣ 6̣ 7̣ 8̣ 9̣
import { observable } from 'mobx';

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
                    { pitch: '1̣', sample: 'pelog/bonang barung/bonang barung p lo1.mp3' },
                    { pitch: '2̣', sample: 'pelog/bonang barung/bonang barung p lo2.mp3' },
                    { pitch: '3̣', sample: 'pelog/bonang barung/bonang barung p lo3.mp3' },
                    { pitch: '4̣', sample: 'pelog/bonang barung/bonang barung p lo4.mp3' },
                    { pitch: '5̣', sample: 'pelog/bonang barung/bonang barung p lo5.mp3' },
                    { pitch: '6̣', sample: 'pelog/bonang barung/bonang barung p lo6.mp3' },
                    { pitch: '7̣', sample: 'pelog/bonang barung/bonang barung p lo7.mp3' },
                    { pitch: '1', sample: 'pelog/bonang barung/bonang barung p1.mp3' },
                    { pitch: '2', sample: 'pelog/bonang barung/bonang barung p2.mp3' },
                    { pitch: '3', sample: 'pelog/bonang barung/bonang barung p3.mp3' },
                    { pitch: '4', sample: 'pelog/bonang barung/bonang barung p4.mp3' },
                    { pitch: '5', sample: 'pelog/bonang barung/bonang barung p5.mp3' },
                    { pitch: '6', sample: 'pelog/bonang barung/bonang barung p6.mp3' },
                    { pitch: '7', sample: 'pelog/bonang barung/bonang barung p7.mp3' }
                ]
            },
            {
                name: 'Bonang panerus',
                nHands: 2,
                tones: [
                    { pitch: '1̣', sample: 'pelog/bonang panerus/bonang panerus p lo1.mp3' },
                    { pitch: '2̣', sample: 'pelog/bonang panerus/bonang panerus p lo2.mp3' },
                    { pitch: '3̣', sample: 'pelog/bonang panerus/bonang panerus p lo3.mp3' },
                    { pitch: '4̣', sample: 'pelog/bonang panerus/bonang panerus p lo4.mp3' },
                    { pitch: '5̣', sample: 'pelog/bonang panerus/bonang panerus p lo5.mp3' },
                    { pitch: '6̣', sample: 'pelog/bonang panerus/bonang panerus p lo6.mp3' },
                    { pitch: '7̣', sample: 'pelog/bonang panerus/bonang panerus p lo7.mp3' },
                    { pitch: '1', sample: 'pelog/bonang panerus/bonang panerus p1.mp3' },
                    { pitch: '2', sample: 'pelog/bonang panerus/bonang panerus p2.mp3' },
                    { pitch: '3', sample: 'pelog/bonang panerus/bonang panerus p3.mp3' },
                    { pitch: '4', sample: 'pelog/bonang panerus/bonang panerus p4.mp3' },
                    { pitch: '5', sample: 'pelog/bonang panerus/bonang panerus p5.mp3' },
                    { pitch: '6', sample: 'pelog/bonang panerus/bonang panerus p6.mp3' },
                    { pitch: '7', sample: 'pelog/bonang panerus/bonang panerus p7.mp3' }
                ]
            },
            {
                name: 'Gong ageng',
                nHands: 1,
                tones: [
                    { pitch: 'G', sample: 'pelog/gong/gong pelog.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                tones: [
                    { pitch: 'S', sample: 'pelog/gong/gong suwuk p2.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
                tones: [
                    { pitch: '1', sample: 'pelog/nong/long p1.mp3' },
                    { pitch: '2', sample: 'pelog/nong/long p2.mp3' },
                    { pitch: '3', sample: 'pelog/nong/long p3.mp3' },
                    { pitch: '5', sample: 'pelog/nong/long p5.mp3' },
                    { pitch: '6', sample: 'pelog/nong/long p6.mp3' },
                    { pitch: '7', sample: 'pelog/nong/long p7.mp3' }
                ]
            },
            {
                name: 'Peking',
                nHands: 1,
                tones: [
                    { pitch: '1', sample: 'pelog/peking/peking p1.mp3' },
                    { pitch: '2', sample: 'pelog/peking/peking p2.mp3' },
                    { pitch: '3', sample: 'pelog/peking/peking p3.mp3' },
                    { pitch: '4', sample: 'pelog/peking/peking p4.mp3' },
                    { pitch: '5', sample: 'pelog/peking/peking p5.mp3' },
                    { pitch: '6', sample: 'pelog/peking/peking p6.mp3' },
                    { pitch: '7', sample: 'pelog/peking/peking p7.mp3' }
                ]
            },
            {
                name: 'Pul',
                nHands: 1,
                tones: [
                    { pitch: '1', sample: 'pelog/pul/pul p1.mp3' },
                    { pitch: '3', sample: 'pelog/pul/pul p3.mp3' },
                    { pitch: '5', sample: 'pelog/pul/pul p5.mp3' },
                    { pitch: '6', sample: 'pelog/pul/pul p6.mp3' },
                    { pitch: '7', sample: 'pelog/pul/pul p7.mp3' }
                ]
            },
            {
                name: 'Saron',
                nHands: 1,
                tones: [
                    { pitch: '1', sample: 'pelog/saron/saron p1.mp3' },
                    { pitch: '2', sample: 'pelog/saron/saron p2.mp3' },
                    { pitch: '3', sample: 'pelog/saron/saron p3.mp3' },
                    { pitch: '4', sample: 'pelog/saron/saron p4.mp3' },
                    { pitch: '5', sample: 'pelog/saron/saron p5.mp3' },
                    { pitch: '6', sample: 'pelog/saron/saron p6.mp3' },
                    { pitch: '7', sample: 'pelog/saron/saron p7.mp3' }
                ]
            },
            {
                name: 'Tuk',
                nHands: 1,
                tones: [
                    { pitch: '+', sample: 'pelog/tuk pelog.mp3' }
                ]
            }
        ]),
        new Gamelan('slendro', [
            {
                name: 'Bonang barung',
                nHands: 2,
                tones: [
                    { pitch: '1̣', sample: 'slendro/bonang barung/bonang barung s lo1.mp3' },
                    { pitch: '2̣', sample: 'slendro/bonang barung/bonang barung s lo2.mp3' },
                    { pitch: '3̣', sample: 'slendro/bonang barung/bonang barung s lo3.mp3' },
                    { pitch: '5̣', sample: 'slendro/bonang barung/bonang barung s lo5.mp3' },
                    { pitch: '6̣', sample: 'slendro/bonang barung/bonang barung s lo6.mp3' },
                    { pitch: '1', sample: 'slendro/bonang barung/bonang barung s1.mp3' },
                    { pitch: '2', sample: 'slendro/bonang barung/bonang barung s2.mp3' },
                    { pitch: '3', sample: 'slendro/bonang barung/bonang barung s3.mp3' },
                    { pitch: '5', sample: 'slendro/bonang barung/bonang barung s5.mp3' },
                    { pitch: '6', sample: 'slendro/bonang barung/bonang barung s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/bonang barung/bonang barung s hi1.mp3' },
                    { pitch: '2̇', sample: 'slendro/bonang barung/bonang barung s hi2.mp3' }
                ]
            },
            {
                name: 'Bonang panerus',
                nHands: 2,
                tones: [
                    { pitch: '1̣', sample: 'slendro/bonang panerus/bonang panerus s lo1.mp3' },
                    { pitch: '2̣', sample: 'slendro/bonang panerus/bonang panerus s lo2.mp3' },
                    { pitch: '3̣', sample: 'slendro/bonang panerus/bonang panerus s lo3.mp3' },
                    { pitch: '5̣', sample: 'slendro/bonang panerus/bonang panerus s lo5.mp3' },
                    { pitch: '6̣', sample: 'slendro/bonang panerus/bonang panerus s lo6.mp3' },
                    { pitch: '1', sample: 'slendro/bonang panerus/bonang panerus s1.mp3' },
                    { pitch: '2', sample: 'slendro/bonang panerus/bonang panerus s2.mp3' },
                    { pitch: '3', sample: 'slendro/bonang panerus/bonang panerus s3.mp3' },
                    { pitch: '5', sample: 'slendro/bonang panerus/bonang panerus s5.mp3' },
                    { pitch: '6', sample: 'slendro/bonang panerus/bonang panerus s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/bonang panerus/bonang panerus s hi1.mp3' },
                    { pitch: '2̇', sample: 'slendro/bonang panerus/bonang panerus s hi2.mp3' }
                ]
            },
            {
                name: 'Gong ageng',
                nHands: 1,
                tones: [
                    { pitch: 'G', sample: 'slendro/gong/gong ageng slendro.mp3' }
                ]
            },
            {
                name: 'Gong suwuk',
                nHands: 1,
                tones: [
                    { pitch: 'S', sample: 'slendro/gong/gong suwuk s1.mp3' }
                ]
            },
            {
                name: 'Nong',
                nHands: 1,
                tones: [
                    { pitch: '2', sample: 'slendro/nong/nong s2.mp3' },
                    { pitch: '3', sample: 'slendro/nong/nong s3.mp3' },
                    { pitch: '5', sample: 'slendro/nong/nong s5.mp3' },
                    { pitch: '6', sample: 'slendro/nong/nong s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/nong/nong s1̇.mp3' }
                ]
            },
            {
                name: 'Peking',
                nHands: 1,
                tones: [
                    { pitch: '6̣', sample: 'slendro/peking/peking s lo6.mp3' },
                    { pitch: '1', sample: 'slendro/peking/peking s1.mp3' },
                    { pitch: '2', sample: 'slendro/peking/peking s2.mp3' },
                    { pitch: '3', sample: 'slendro/peking/peking s3.mp3' },
                    { pitch: '5', sample: 'slendro/peking/peking s5.mp3' },
                    { pitch: '6', sample: 'slendro/peking/peking s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/peking/peking s hi1.mp3' }
                ]
            },
            {
                name: 'Pul',
                nHands: 1,
                tones: [
                    { pitch: '3', sample: 'slendro/pul/pul s3.mp3' },
                    { pitch: '5', sample: 'slendro/pul/pul s5.mp3' },
                    { pitch: '6', sample: 'slendro/pul/pul s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/pul/pul s1̇.mp3' }
                ]
            },
            {
                name: 'Saron',
                nHands: 1,
                tones: [
                    { pitch: '6̣', sample: 'slendro/saron/saron s lo6.mp3' },
                    { pitch: '1', sample: 'slendro/saron/saron s1.mp3' },
                    { pitch: '2', sample: 'slendro/saron/saron s2.mp3' },
                    { pitch: '3', sample: 'slendro/saron/saron s3.mp3' },
                    { pitch: '5', sample: 'slendro/saron/saron s5.mp3' },
                    { pitch: '6', sample: 'slendro/saron/saron s6.mp3' },
                    { pitch: '1̇', sample: 'slendro/saron/saron s hi1.mp3' },
                    { pitch: '2̇', sample: 'slendro/saron/saron s hi2.mp3' },
                    { pitch: '3̇', sample: 'slendro/saron/saron s hi3.mp3' }
                ]
            },
            {
                name: 'Tuk',
                nHands: 1,
                tones: [
                    { pitch: '+', sample: 'slendro/tuk slendro.mp3' }
                ]
            }
        ])
    ];
    gamut(scale, instrument) {
        return this.gamelans.find(g => g.scale === scale)
            .instruments.find(inst => inst.name === instrument)
            .tones.map(tone => tone.pitch);
    }
}

export default new GamelansStore();
