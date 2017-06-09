import { observable } from 'mobx';
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
        this.parts.push(new Part(instrument));
    }
    addPhrase(name, length) {
        this.phraseInfos.push({ name, length});
        this.parts.forEach(part => {
            part.phrases.push(Array(length).fill(' '));
        });
    }
    setNote(note, partIndex, phraseIndex, noteIndex) {
        if (partIndex < 0) {
            return false;
        }
        const gamut = [' ', '·'].concat(gamelansStore.gamut(this.scale, this.parts[partIndex].instrument));

        if (gamut.indexOf(note) < 0) {
            return false;
        }
        this.parts[partIndex].phrases[phraseIndex][noteIndex] = note;
        return true;
    }
}

class PiecesStore {
    @observable currentPiece;

    constructor() {
        this.currentPiece = new Piece(
            '',
            'slendro',
            [
                {
                    instrument: 'Saron',
                    isVisible: true,
                    muteSolo: 'mute',
                    phrases: [
                        [' ', ' ', ' ', ' ', '4', '·', '3', '6'],
                        ['2', '·', '2', '·', '2', '·', '2', '·'],
                        ['3', '·', '3', '·', '3', '·', '3', '·']
                    ]
                },
                {
                    instrument: 'Bonang barung',
                    isVisible: true,
                    muteSolo: 'solo',
                    phrases: [
                        [' ', ' ', ' ', ' ', '1', '2', '·', '5'],
                        ['·', '2', '·', '2', '·', '2', '·', '2'],
                        ['·', '3', '·', '3', '·', '3', '·', '3']
                    ]
                },
            ],
            [
                {
                    name: 'buka',
                    length: 8
                },
                {
                    name: 'phrase A',
                    length: 8
                },
                {
                    name: 'phrase B',
                    length: 8
                }
            ]
        );
    }
    new(title, scale) {
        this.currentPiece = new Piece(title, scale, [], []);
    }
    getPieces() {
        return axios.get('/api/pieces')
        .then(res => {
            const pieces = res.data;
            return pieces;
        })
        .catch(Boo.boo);
    }
    save(title) {
        this.currentPiece.title = title;
        axios.post('/api/pieces', {
            piece: this.currentPiece
        })
        .then(result => {
            console.log('save:', result.data.id, result.data.userId);
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
        })
        .catch(Boo.boo);
    }
    open(id) {
        axios.get(`/api/pieces/${id}`)
        .then(result => {
            console.log('result', result);
            this.currentPiece.title = result.data.title;
            this.currentPiece.scale = result.data.scale;
            this.currentPiece.parts = result.data.parts;
            this.currentPiece.phraseInfos = result.data.phraseInfos;
            this.currentPiece.id = result.data.id;
            this.currentPiece.userId = result.data.userId;
        })
        .catch(Boo.boo);
    }
}

const piecesStore = new PiecesStore();
export default piecesStore;
