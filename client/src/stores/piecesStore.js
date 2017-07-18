import { computed, observable } from 'mobx';
import gamelansStore from './gamelansStore';
import axios from 'axios';
import Boo from '../Boo';

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
    @observable id;
    @observable userId;

    constructor(title, scale, parts, phraseInfos) {
        this.title = title;
        this.scale = scale;
        this.parts = parts;
        this.phraseInfos = phraseInfos;
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
        if (!name.trim()) {
            Boo.boo({message: "Phrase name cannot be blank"});
            return;
        }
        this.phraseInfos.push({ name, length});
        this.parts.forEach(part => {
            const nHands = gamelansStore
                            .gamelans.find(g => g.scale === this.scale)
                            .instruments.find(i => i.name === part.instrument)
                            .nHands;
            part.phrases.push(Array(nHands).fill(0).map(h => Array(length).fill(' ')));
        });
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
}

class PiecesStore {
    @observable currentPiece;
    @observable savedPiece;

    constructor() {
        this.currentPiece = new Piece(
            '',
            'slendro',
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
    }
    new(title, scale) {
        this.currentPiece = new Piece(title, scale, [], []);
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
            this.savedPiece.id = this.currentPiece.id;
            this.savedPiece.userId = this.currentPiece.userId;
            this.savedPiece.title = this.currentPiece.title;
            this.savedPiece.scale = this.currentPiece.scale;
            this.savedPiece.parts = JSON.parse(JSON.stringify(this.currentPiece.parts));
            this.savedPiece.phraseInfos = JSON.parse(JSON.stringify(this.currentPiece.phraseInfos));
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
            || JSON.stringify(this.currentPiece.phraseInfos) !== JSON.stringify(this.savedPiece.phraseInfos);
    }
}

const piecesStore = new PiecesStore();
const currentPiece = piecesStore.currentPiece;
export { currentPiece, piecesStore };
