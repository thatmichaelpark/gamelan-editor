import { computed, observable } from 'mobx';
import gamelansStore from './gamelansStore';
import axios from 'axios';
import Boo from '../Boo';
import audioContext from '../audioContext';

class Piece {
    @observable title;
    @observable scale;
    @observable parts;
    @observable phraseInfos;
    @observable phrasePlaylist;
    @observable id;
    @observable userId;
    @observable bpm;
    @observable tempoPoints;
    
    constructor(title, scale, parts, phraseInfos, phrasePlaylist, bpm, tempoPoints) {
        this.title = title; // string
        this.scale = scale; // string
        this.parts = parts; // array of Part objects
        this.phraseInfos = phraseInfos; // array of {id, name, length}
        this.phrasePlaylist = phrasePlaylist;   // array of id
        this.bpm = bpm;
        this.tempoPoints = tempoPoints;
    }
    addPart(instrument) {
        const id = this.parts.reduce((maxId, part) => Math.max(maxId, part.id), -1) + 1;
        const level = 0.5;
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = level;
        const part = { 
            id, 
            instrument, 
            phrases: observable([]), 
            gainNode,
            level
        };
        const nParts = this.parts.push(part);
        this.parts[nParts - 1].beatsArray = []; // add non-observable array
        console.log(this.parts);;;
        console.log(this.parts.toJS());;;
        const nHands = gamelansStore
                        .gamelans.find(g => g.scale === this.scale)
                        .instruments.find(i => i.name === instrument)
                        .nHands;
        if (nParts > 1) {
            this.parts[0].phrases.forEach(phrase => {
                const length = phrase[0].length;
                part.phrases.push(Array(nHands).fill(0).map(h => Array(length).fill(' ')));
            });
        }
    }
    addPhrase(name, length) {
        name = name.trim();
        if (!name) {
            Boo.boo({message: "Phrase name cannot be blank"});
            return;
        }
        let id = -1;
        for (const phraseInfo of this.phraseInfos) {
            if (phraseInfo.name === name) {
                Boo.boo({message: "Cannot have duplicate phrase names"});
                return;
            }
            id = Math.max(id, phraseInfo.id);
        }
        id += 1;
        this.phraseInfos.push({ id, name, length});
        
        // Add new phrase id to phrasePlaylist:
        this.phrasePlaylist.push(id);
        
        // Add new phrase to each part:
        this.parts.forEach(part => {
            const nHands = gamelansStore
                            .gamelans.find(g => g.scale === this.scale)
                            .instruments.find(i => i.name === part.instrument)
                            .nHands;
            part.phrases.push(Array(nHands).fill(0).map(h => Array(length).fill(' ')));
        });
    }
    updatePhrases() {
        this.phrasePlaylist = this.phrasePlaylist.filter(id => this.phraseInfos.find(pi => pi.id === id));
    }
    setNote(note, partIndex, phraseIndex, handIndex, noteIndex) {
        if (partIndex < 0) {
            return false;
        }
        const gamut = [' ', '·'].concat(gamelansStore.gamut(this.scale, this.parts[partIndex].instrument));

        if (gamut.indexOf(note) < 0) {
            return false;
        }
        this.parts[partIndex].phrases[phraseIndex][handIndex][noteIndex] = note;
        return true;
    }
    loadInstruments() {
        this.parts.forEach(part => {
            gamelansStore.loadInstrument(this.scale, part.instrument);
        });
    }
    assignBeats() {
        // A part might have phrases like zo:
        //         phrases: [
        //             [ //  phrase 0
        //                 ['1', '2', '1', '2'],
        //                 ['·', '2', '·', '2']
        //             ],
        //             [ // phrase 1
        //                 ['·', '1', '·', '1', '·', '1', '·', '1'],
        //                 ['·', '2', '·', '2', '·', '2', '·', '2']
        //             ]
        //         ]
        // We're going to build a beatsArray like zo:
        //         beatsArray: [
        //             [a, b, c, d],            // beats for phrase 0 (all hands) 
        //             [e, f, g, h, i, j, k, l] // beats for phrase 1 (all hands)
        //          ]
        // where a, b, etc are arrays of beats #s (e.g. [0, 8] indicating beats 0 and 8)
        // for the corresponding notes in the phrase/hand.
        //
        // At the same time, we'll build a noteList which will have a noteNode for each
        // beat, each noteNode indicating which part(s)/note(s) to play on that beat
        
        this.parts.forEach(part => {
            part.beatsArray = [];
            part.phrases.forEach((phrase, phraseIndex) => {
                const beats = [];
                phrase[0].forEach((note, noteIndex) => {
                    beats.push([]);
                });
                part.beatsArray.push(beats);
            });
        });
        
        let startBeat = 0;
        this.noteList = [];

        this.phrasePlaylist.forEach(phraseId => {
            const phraseIndex = this.phraseInfos.findIndex(phraseInfo => phraseInfo.id === phraseId);

            this.parts.forEach(part => {
                part.beatsArray[phraseIndex].forEach((beats, beatIndex) => {
                    beats.push(startBeat + beatIndex);
                });
            });

            for (let beat = startBeat; beat < startBeat + this.phraseInfos[phraseIndex].length; ++beat) {
                const noteNode = [];
                
                this.parts.forEach(part => { // eslint-disable-line no-loop-func
                    part.phrases[phraseIndex].forEach(hand => {
                        hand.forEach((note, noteIndex) => {
                            if (noteIndex + startBeat === beat && note !== ' ' && note !== '.') {
                                noteNode.push({ part, note });
                            }
                        });
                    });
                });
                this.noteList.push(noteNode);
            }
            startBeat += this.phraseInfos[phraseIndex].length;
        });
        // now startBeat is the length of the piece in beats.
        return startBeat;
    }
    playBeat(beat) {
        const notes = this.noteList[beat];
        notes.forEach(note => {
            gamelansStore.triggerInstrument(note.part, this.scale, note.note);
        });
    }
}

class PiecesStore {
    @observable currentPiece;
    @observable savedPiece;

    constructor() {
        this.currentPiece = new Piece(
            '',
            'slendro',
            [],
            [],
            [],
            120,
            [{t: 0, f: 1}, {t: 1, f: 1}]
            // [
            //     {
            //         instrument: 'Saron',
            //         isVisible: true,
            //         muteSolo: 'mute',
            //         phrases: [
            //             [[' ', ' ', ' ', ' ', '4', '·', '3', '6']],
            //             [['2', '·', '2', '·', '2', '·', '2', '·']],
            //             [['5', '·', '5', '·', '5', '·', '5', '·']]
            //         ]
            //     },
            //     {
            //         instrument: 'Bonang barung',
            //         isVisible: true,
            //         muteSolo: 'solo',
            //         phrases: [
            //             [
            //                 [' ', ' ', ' ', ' ', '1', '2', '·', '5']
            //             ],
            //             [
            //                 ['1', '2', '1', '2', '1', '2', '1', '2'],
            //                 ['·', '2', '·', '2', '·', '2', '·', '2']
            //             ],
            //             [
            //                 ['·', '1', '·', '1', '·', '1', '·', '1'],
            //                 ['·', '2', '·', '2', '·', '2', '·', '2']
            //             ]
            //         ]
            //     },
            // ],
            // [
            //     {
            //         name: 'buka',
            //         length: 8
            //     },
            //     {
            //         name: 'phrase A',
            //         length: 8
            //     },
            //     {
            //         name: 'phrase B',
            //         length: 8
            //     }
            // ]
        );

        this.savedPiece = new Piece('', '', [], [], 120, [{t: 0, f: 1}, {t: 1, f: 1}]);
        this.savedPiece.title = this.currentPiece.title;
        this.savedPiece.scale = this.currentPiece.scale;
        this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts.slice(0)));
        this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos.slice(0)));
        this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
        this.savedPiece.tempoPoints = JSON.parse(JSON.stringify(this.currentPiece.tempoPoints));
    }
    new(title, scale) {
        this.currentPiece.title = title;
        this.currentPiece.scale = scale;
        this.currentPiece.parts = [];
        this.currentPiece.parts.toJSON = function () {
            // Need to hide beatsArray property inside parts array elements
            // because we use JSON stringify/parse to determine if anything's
            // changed (see modified() below) and beatsArray is not a salient change.
            const result = [];
            const that = this.slice();

            for (let x of that) {
                x = JSON.parse(JSON.stringify(x));

                if (!x.instrument) {
                    continue;
                }
                const o = {};
                for (let prop in x) {
                    if (prop !== "beatsArray") {
                        o[prop] = x[prop];
                    }
                }
                result.push(o);
            }
            return result;
        };
        this.currentPiece.phraseInfos = [];
        this.currentPiece.phrasePlaylist = [];
        this.currentPiece.bpm = 120;
        this.savedPiece = new Piece(title, scale, [], [], 120, [{t: 0, f: 1}, {t: 1, f: 1}]);
    }
    getPieces() {
        return axios.get('/api/pieces')
        .then(res => {
            const pieces = res.data;
            return pieces;
        })
        .catch(Boo.boo);
    }
    saveAs(title) {
        this.currentPiece.title = title;
        return axios.post('/api/pieces', {
            piece: this.currentPiece
        })
        .then(result => {
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
            this.savedPiece.id = this.currentPiece.id;
            this.savedPiece.userId = this.currentPiece.userId;
            this.savedPiece.title = this.currentPiece.title;
            this.savedPiece.scale = this.currentPiece.scale;
            this.savedPiece.bpm = this.currentPiece.bpm;
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
            this.savedPiece.tempoPoints = JSON.parse(JSON.stringify(this.currentPiece.tempoPoints));
        });
    }
    savePiece(piece) {
        return axios.patch(`/api/pieces/${piece.id}`, { piece });
    }
    save() {
        return this.savePiece(this.currentPiece)
        .then((result) => {
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
            this.savedPiece.id = this.currentPiece.id;
            this.savedPiece.userId = this.currentPiece.userId;
            this.savedPiece.title = this.currentPiece.title;
            this.savedPiece.scale = this.currentPiece.scale;
            this.savedPiece.bpm = this.currentPiece.bpm;
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
            this.savedPiece.tempoPoints = JSON.parse(JSON.stringify(this.currentPiece.tempoPoints));
        });
    }
    open(id) {
        return axios.get(`/api/pieces/${id}`)
        .then(result => {
            this.currentPiece.title = result.data.title;
            this.currentPiece.scale = result.data.scale;
            result.data.parts.forEach(part => {
                part.gainNode = audioContext.createGain();
                part.gainNode.connect(audioContext.destination);
                part.gainNode.gain.value = part.level;
            });
            this.currentPiece.parts = result.data.parts;
            this.currentPiece.parts.forEach(part => {
                part.beatsArray = []; // add non-observable array
                console.log('after', part.beatsArray);
            })
            this.currentPiece.parts.toJSON = function () {
                // Need to hide beatsArray property inside parts array elements
                // because we use JSON stringify/parse to determine if anything's
                // changed (see modified() below) and beatsArray is not a salient change.
                const result = [];
                const that = this.slice();

                for (let x of that) {
                    x = JSON.parse(JSON.stringify(x));

                    if (!x.instrument) {
                        continue;
                    }
                    const o = {};
                    for (let prop in x) {
                        if (prop !== "beatsArray") {
                            o[prop] = x[prop];
                        }
                    }
                    result.push(o);
                }
                return result;
            };
            this.currentPiece.phraseInfos = result.data.phraseInfos;
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
            this.currentPiece.bpm = result.data.bpm;
            this.currentPiece.phrasePlaylist = result.data.phrasePlaylist;
            this.currentPiece.tempoPoints = result.data.tempoPoints;
            this.savedPiece.id = this.currentPiece.id;
            this.savedPiece.userId = this.currentPiece.userId;
            this.savedPiece.title = this.currentPiece.title;
            this.savedPiece.scale = this.currentPiece.scale;
            this.savedPiece.bpm = this.currentPiece.bpm;
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
            this.savedPiece.tempoPoints = JSON.parse(JSON.stringify(this.currentPiece.tempoPoints));
            this.currentPiece.loadInstruments();
        });
    }
    delete(id) {
        return axios.delete(`/api/pieces/${id}`);
    }
    @computed get modified() {
        return this.currentPiece.title !== this.savedPiece.title
            || this.currentPiece.scale !== this.savedPiece.scale
            || this.currentPiece.id !== this.savedPiece.id
            || this.currentPiece.userId !== this.savedPiece.userId
            || this.currentPiece.bpm !== this.savedPiece.bpm
            || JSON.stringify(this.currentPiece.parts) !== JSON.stringify(this.savedPiece.parts)
            || JSON.stringify(this.currentPiece.phraseInfos) !== JSON.stringify(this.savedPiece.phraseInfos)
            || JSON.stringify(this.currentPiece.phrasePlaylist) !== JSON.stringify(this.savedPiece.phrasePlaylist)
            || JSON.stringify(this.currentPiece.tempoPoints) !== JSON.stringify(this.savedPiece.tempoPoints);
    }
}

const piecesStore = new PiecesStore();
const currentPiece = piecesStore.currentPiece;
export { currentPiece, piecesStore };
