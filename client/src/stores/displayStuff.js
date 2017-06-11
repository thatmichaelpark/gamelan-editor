import { computed, observable } from 'mobx';
import piecesStore from './piecesStore';

class DisplayStuff {
    @observable displayMode = 'byParts' // byParts | byPhrases | compact
    @observable displayPhraseIndex = 0; // for compact mode
    @observable selectedPartIndex = 0;
    @observable selectedPhraseIndex = 0;
    @observable selectedHandIndex = 0;
    @observable selectedNoteIndex = 0;

    @computed get numParts() {
        return piecesStore.currentPiece.parts.length;
    }

    @computed get numPhrases() {
        return piecesStore.currentPiece.parts.length ? piecesStore.currentPiece.parts[0].phrases.length : 0;
    }

    setDisplayMode(displayMode) {
        this.displayMode = displayMode;
        if (displayMode === 'compact' && this.selectedPhraseIndex >= 0) {
            this.displayPhraseIndex = this.selectedPhraseIndex;
            const i = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
            this.selectedHandIndex = Math.min(i, this.selectedHandIndex);
        }
    }
    setDisplayPhraseIndex(displayPhraseIndex) {
        this.displayPhraseIndex = Number(displayPhraseIndex);
        if (this.selectedPhraseIndex >= 0) {
            this.selectedPhraseIndex = this.displayPhraseIndex;
            const i = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
            this.selectedHandIndex = Math.min(i, this.selectedHandIndex);
        }
    }
    setSelected(partIndex, phraseIndex, handIndex, noteIndex) {
        this.selectedPartIndex = partIndex;
        this.selectedPhraseIndex = phraseIndex;
        this.selectedHandIndex = handIndex;
        this.selectedNoteIndex = noteIndex;
    }
    handleArrow(arrow) {
        if (this.selectedPartIndex < 0) {
            return;
        }
        if (arrow === 'ArrowLeft') {
            if (--this.selectedNoteIndex < 0) {
                const partIndex = this.selectedPartIndex;
                const phraseIndex = this.selectedPhraseIndex;
                const handIndex = this.selectedHandIndex;

                this.handleArrow('ArrowUp');
                if (partIndex === this.selectedPartIndex
                    && phraseIndex === this.selectedPhraseIndex
                    && handIndex === this.selectedHandIndex) { // Arrow had no effect
                    this.selectedNoteIndex = 0;
                }
                else {
                    this.selectedNoteIndex = piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex][0].length - 1;
                }
            }
        }
        else if (arrow === 'ArrowRight') {
            const partIndex = this.selectedPartIndex;
            const phraseIndex = this.selectedPhraseIndex;
            const handIndex = this.selectedHandIndex;

            if (++this.selectedNoteIndex >= piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex][0].length) {
                this.handleArrow('ArrowDown');
                if (partIndex === this.selectedPartIndex
                    && phraseIndex === this.selectedPhraseIndex
                    && handIndex === this.selectedHandIndex) { // Arrow had no effect
                    this.selectedNoteIndex = piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex][0].length - 1;
                }
                else {
                    this.selectedNoteIndex = 0;
                }
            }
        }
        else if (arrow === 'ArrowUp') {
            switch (this.displayMode) {
                case 'byParts':
                    if (--this.selectedHandIndex < 0) {
                        this.selectedHandIndex = 0;
                        if (--this.selectedPhraseIndex < 0) {
                            this.selectedPhraseIndex = this.numPhrases - 1;
                            if (--this.selectedPartIndex < 0) {
                                this.selectedPhraseIndex = 0;
                                this.selectedPartIndex = 0;
                                break;
                            }
                        }
                        this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                    }
                    break;
                case 'byPhrases':
                    if (--this.selectedHandIndex < 0) {
                        this.selectedHandIndex = 0;
                        if (--this.selectedPartIndex < 0) {
                            this.selectedPartIndex = this.numParts - 1;
                            if (--this.selectedPhraseIndex < 0) {
                                this.selectedPhraseIndex = 0;
                                this.selectedPartIndex = 0;
                                break;
                            }
                        }
                        this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                    }
                    break;
                default: // compact
                    if (this.selectedHandIndex) {
                        --this.selectedHandIndex;
                    }
                    else {
                        if (this.selectedPartIndex) {
                            --this.selectedPartIndex;
                            this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                        }
                        else {
                            this.selectedPartIndex = 0;
                        }
                    }
            }
        }
        else if (arrow === 'ArrowDown') {
            switch (this.displayMode) {
                case 'byParts':
                    if (++this.selectedHandIndex >= piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length) {
                        this.selectedHandIndex = 0;
                        if (++this.selectedPhraseIndex >= this.numPhrases) {
                            this.selectedPhraseIndex = 0;
                            if (++this.selectedPartIndex >= this.numParts) {
                                --this.selectedPartIndex;
                                this.selectedPhraseIndex = this.numPhrases - 1;
                                this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                            }
                        }
                    }
                    break;
                case 'byPhrases':
                    if (++this.selectedHandIndex >= piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length) {
                        this.selectedHandIndex = 0;
                        if (++this.selectedPartIndex >= this.numParts) {
                            this.selectedPartIndex = 0;
                            if (++this.selectedPhraseIndex >= this.numPhrases) {
                                --this.selectedPhraseIndex;
                                this.selectedPartIndex = this.numParts - 1;
                                this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                            }
                        }
                    }
                    break;
                default: // compact
                    if (++this.selectedHandIndex >= piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length) {
                        this.selectedHandIndex = 0;
                        if (++this.selectedPartIndex >= piecesStore.currentPiece.parts.length) {
                            this.selectedPartIndex = piecesStore.currentPiece.parts.length - 1;
                            this.selectedHandIndex = piecesStore.currentPiece.parts[this.selectedPartIndex].phrases[this.selectedPhraseIndex].length - 1;
                        }
                    }
            }
        }
    }
}

export default new DisplayStuff();
