import { computed, observable } from 'mobx';
import gamelansStore from './gamelansStore';
import axios from 'axios';
import Boo from '../Boo';
import audioContext from '../audioContext';

class Part {
    @observable instrument;
    @observable phrases;
    constructor(instrument) {
        this.instrument = instrument;
        this.phrases = [];
    }
}

class Piece {
    @observable title;
    @observable scale;
    @observable parts;
    @observable phraseInfos;
    @observable phrasePlaylist;
    @observable id;
    @observable userId;
    
    constructor(title, scale, parts, phraseInfos, phrasePlaylist) {
        this.title = title; // string
        this.scale = scale; // string
        this.parts = parts; // array of Part objects
        this.phraseInfos = phraseInfos; // array of {id, name, length}
        this.phrasePlaylist = phrasePlaylist;   // array of id
    }
    addPart(instrument) {
        const part = new Part(instrument);
        const nParts = this.parts.push(part);

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
            gamelansStore.loadInstrument(this.scale, part.instrument, audioContext);
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
        
        var startBeat = 0;
        this.phrasePlaylist.forEach(phraseId => {
            const phraseIndex = this.phraseInfos.findIndex(phraseInfo => phraseInfo.id === phraseId);
            this.parts.forEach(part => {
                part.beatsArray[phraseIndex].forEach((beats, beatIndex) => {
                    beats.push(startBeat + beatIndex);
                });
            });
            startBeat += this.phraseInfos[phraseIndex].length;
        });
        
        this.parts.forEach(part => {
            part.phrases.forEach((phrase, phraseIndex) => {
                phrase.forEach((hand, handIndex) => {
                    hand.forEach((note, noteIndex) => {
                        console.log(part.instrument, phraseIndex, handIndex, noteIndex, part.beatsArray[phraseIndex][noteIndex]);
                    });
                });
            });
        });
        return startBeat;
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
            []
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

        this.savedPiece = new Piece('', '', [], []);
        this.savedPiece.title = this.currentPiece.title;
        this.savedPiece.scale = this.currentPiece.scale;
        this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts.slice(0)));
        this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos.slice(0)));
        this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
    }
    new(title, scale) {
        this.currentPiece.title = title;
        this.currentPiece.scale = scale;
        this.currentPiece.parts = [];
        this.currentPiece.phraseInfos = [];
        this.currentPiece.phrasePlaylist = [];
        this.savedPiece = new Piece(title, scale, [], []);
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
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
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
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
        });
    }
    open(id) {
        return axios.get(`/api/pieces/${id}`)
        .then(result => {
            this.currentPiece.title = result.data.title;
            this.currentPiece.scale = result.data.scale;
            this.currentPiece.parts = result.data.parts;
            this.currentPiece.phraseInfos = result.data.phraseInfos;
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
            this.currentPiece.phrasePlaylist = result.data.phrasePlaylist || [];
            this.savedPiece.id = this.currentPiece.id;
            this.savedPiece.userId = this.currentPiece.userId;
            this.savedPiece.title = this.currentPiece.title;
            this.savedPiece.scale = this.currentPiece.scale;
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
            this.savedPiece.phrasePlaylist = JSON.parse(JSON.stringify(this.currentPiece.phrasePlaylist));
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
            || JSON.stringify(this.currentPiece.parts) !== JSON.stringify(this.savedPiece.parts)
            || JSON.stringify(this.currentPiece.phraseInfos) !== JSON.stringify(this.savedPiece.phraseInfos)
            || JSON.stringify(this.currentPiece.phrasePlaylist) !== JSON.stringify(this.savedPiece.phrasePlaylist);
    }
}

const piecesStore = new PiecesStore();
const currentPiece = piecesStore.currentPiece;
export { currentPiece, piecesStore };
