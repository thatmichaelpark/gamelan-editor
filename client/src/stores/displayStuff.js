import { computed, observable } from 'mobx';
import piecesStore from './piecesStore';

class DisplayStuff {
    @observable displayMode = 'byParts' // byParts | byPhrases | compact
    @observable displayPhraseIndex = 0; // for compact mode
    @observable selectedPartIndex = 0;
    @observable selectedPhraseIndex = 0;
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
        }
    }
    setDisplayPhraseIndex(displayPhraseIndex) {
        this.displayPhraseIndex = Number(displayPhraseIndex);
        if (this.selectedPhraseIndex >= 0) {
            this.selectedPhraseIndex = this.displayPhraseIndex;
        }
    }
    setSelected(partIndex, phraseIndex, noteIndex) {
        this.selectedPartIndex = partIndex;
        this.selectedPhraseIndex = phraseIndex;
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
                this.handleArrow('ArrowUp');
                if (partIndex === this.selectedPartIndex && phraseIndex === this.selectedPhraseIndex) {
                    this.selectedNoteIndex = 0;
                }
                else {
                    this.selectedNoteIndex = piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex].length - 1;
                }
            }
        }
        else if (arrow === 'ArrowRight') {
            const partIndex = this.selectedPartIndex;
            const phraseIndex = this.selectedPhraseIndex;

            if (++this.selectedNoteIndex >= piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex].length) {
                this.handleArrow('ArrowDown');
                if (partIndex === this.selectedPartIndex && phraseIndex === this.selectedPhraseIndex) {
                    this.selectedNoteIndex = piecesStore.currentPiece.parts[partIndex].phrases[phraseIndex].length - 1;
                }
                else {
                    this.selectedNoteIndex = 0;
                }
            }
        }
        else if (arrow === 'ArrowUp') {
            switch (this.displayMode) {
                case 'byParts':
                    if (--this.selectedPhraseIndex < 0) {
                        this.selectedPhraseIndex = this.numPhrases - 1;
                        if (--this.selectedPartIndex < 0) {
                            this.selectedPhraseIndex = 0;
                            this.selectedPartIndex = 0;
                        }
                    }
                    break;
                case 'byPhrases':
                    if (--this.selectedPartIndex < 0) {
                        this.selectedPartIndex = this.numParts - 1;
                        if (--this.selectedPhraseIndex < 0) {
                            this.selectedPhraseIndex = 0;
                            this.selectedPartIndex = 0;
                        }
                    }
                    break;
                default: // compact
                    if (--this.selectedPartIndex < 0) {
                        this.selectedPartIndex = 0;
                    }
            }
        }
        else if (arrow === 'ArrowDown') {
            switch (this.displayMode) {
                case 'byParts':
                    if (++this.selectedPhraseIndex >= this.numPhrases) {
                        this.selectedPhraseIndex = 0;
                        if (++this.selectedPartIndex >= this.numParts) {
                            --this.selectedPartIndex;
                            this.selectedPhraseIndex = this.numPhrases - 1;
                        }
                    }
                    break;
                case 'byPhrases':
                    if (++this.selectedPartIndex >= this.numParts) {
                        this.selectedPartIndex = 0;
                        if (++this.selectedPhraseIndex >= this.numPhrases) {
                            --this.selectedPhraseIndex;
                            this.selectedPartIndex = this.numParts - 1;
                        }
                    }
                    break;
                default: // compact
                    if (++this.selectedPartIndex >= piecesStore.currentPiece.parts.length) {
                        this.selectedPartIndex = piecesStore.currentPiece.parts.length - 1;
                    }
            }
        }
    }
}

export default new DisplayStuff();
