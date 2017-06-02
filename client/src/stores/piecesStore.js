import { observable } from 'mobx';
import gamelansStore from './gamelansStore';

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
    @observable pieces;
    @observable currentPiece;
    constructor() {
        this.pieces = [
            new Piece('Ricik Ricik', 'slendro', [], []),
            new Piece('Udan Mas', 'pelog', [], []),
            new Piece('Something Something', 'slendro', [], [])
        ];
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
            ]);
    }
    new(title, scale) {
        this.currentPiece = new Piece(title, scale, [], []);
    }
    save(title) {
        this.currentPiece.title = title;
        this.pieces.push(this.currentPiece);
    }
    open(title) {
        this.currentPiece = this.pieces.find(piece => piece.title === title);
    }
}

const piecesStore = new PiecesStore();
export default piecesStore;
