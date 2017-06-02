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
                tones: [
                    { pitch: '1̣' },
                    { pitch: '2̣' },
                    { pitch: '3̣' },
                    { pitch: '4̣' },
                    { pitch: '5̣' },
                    { pitch: '6̣' },
                    { pitch: '7̣' },
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '4' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '7' }
                ]
            },
            {
                name: 'Bonang panerus',
                tones: [
                    { pitch: '1̣' },
                    { pitch: '2̣' },
                    { pitch: '3̣' },
                    { pitch: '4̣' },
                    { pitch: '5̣' },
                    { pitch: '6̣' },
                    { pitch: '7̣' },
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '4' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '7' }
                ]
            },
            {
                name: 'Gong ageng',
                tones: [
                    { pitch: 'G' }
                ]
            },
            {
                name: 'Gong suwuk',
                tones: [
                    { pitch: 'S' }
                ]
            },
            {
                name: 'Nong',
                tones: [
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '7' }
                ]
            },
            {
                name: 'Pul',
                tones: [
                    { pitch: '1' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '7' }
                ]
            },
            {
                name: 'Saron',
                tones: [
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '4' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '7' }
                ]
            },
            {
                name: 'Tuk',
                tones: [
                    { pitch: 't' }
                ]
            }
        ]),
        new Gamelan('slendro', [
            {
                name: 'Bonang barung',
                tones: [
                    { pitch: '1̣' },
                    { pitch: '2̣' },
                    { pitch: '3̣' },
                    { pitch: '5̣' },
                    { pitch: '6̣' },
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '1̇' },
                    { pitch: '2̇' }
                ]
            },
            {
                name: 'Bonang panerus',
                tones: [
                    { pitch: '1̣' },
                    { pitch: '2̣' },
                    { pitch: '3̣' },
                    { pitch: '5̣' },
                    { pitch: '6̣' },
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '1̇' },
                    { pitch: '2̇' }
                ]
            },
            {
                name: 'Gong ageng',
                tones: [
                    { pitch: 'G' }
                ]
            },
            {
                name: 'Gong suwuk',
                tones: [
                    { pitch: 'S' }
                ]
            },
            {
                name: 'Nong',
                tones: [
                    { pitch: '1̇' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' }

                ]
            },
            {
                name: 'Pul',
                tones: [
                    { pitch: '1̇' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' }
                ]
            },
            {
                name: 'Saron',
                tones: [
                    { pitch: '6̣' },
                    { pitch: '1' },
                    { pitch: '2' },
                    { pitch: '3' },
                    { pitch: '5' },
                    { pitch: '6' },
                    { pitch: '1̇' },
                    { pitch: '2̇' },
                    { pitch: '3̇' }
                ]
            },
            {
                name: 'Tuk',
                tones: [
                    { pitch: 't' }
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
