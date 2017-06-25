import React from 'react';
import piecesStore from './stores/piecesStore';

class ManagePhrasesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            length: 8
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                name: ''
            });
            this.piece = piecesStore.currentPiece;
            this.savedParts = JSON.stringify(this.piece.parts);
            this.savedPhraseInfos = JSON.stringify(this.piece.phraseInfos);
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'add') {
            this.piece.addPhrase(this.state.name, Number(this.state.length));
        }
        else if (e.target.name === 'ok') {
            this.props.onManagePhrases();
        }
        else { // cancel: restore saved parts
            this.piece.parts = JSON.parse(this.savedParts);
            this.piece.phraseInfos = JSON.parse(this.savedPhraseInfos);
            this.props.onManagePhrases();
        }
    }
    render() {
        const moveUp = (i) => {
            if (i === 0) {
                return;
            }
            const movingPhraseInfo = this.piece.phraseInfos[i];
            this.piece.phraseInfos.splice(i, 1);                        // remove ith element
            this.piece.phraseInfos.splice(i - 1, 0, movingPhraseInfo);  // insert moved element
            this.piece.parts.forEach(part => {
                const movingPhrase = part.phrases[i];
                part.phrases.splice(i, 1);                              // remove ith phrase
                part.phrases.splice(i - 1, 0, movingPhrase);            // insert moved phrase
            });
        }
        const moveDown = (i) => {
            if (i === this.piece.parts.length - 1) {
                return;
            }
            const movingPhraseInfo = this.piece.phraseInfos[i];
            this.piece.phraseInfos.splice(i, 1);                        // remove ith element
            this.piece.phraseInfos.splice(i + 1, 0, movingPhraseInfo);  // insert moved element
            this.piece.parts.forEach(part => {
                const movingPhrase = part.phrases[i];
                part.phrases.splice(i, 1);                              // remove ith phrase
                part.phrases.splice(i + 1, 0, movingPhrase);            // insert moved phrase
            });
        }
        const deleet = (i) => {
            this.piece.phraseInfos.splice(i, 1);                // remove ith phraseInfo
            this.piece.parts.forEach(part => {
                part.phrases.splice(i, 1);                      // remove ith phrase
            });
        }

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Manage Phrases</h1>
                    <div className="dialog-contents">
                        {this.piece.phraseInfos.map((phrase, phraseIndex) =>
                            <div key={phraseIndex}>
                                <button onClick={() => moveUp(phraseIndex)}>▲</button>
                                <button onClick={() => moveDown(phraseIndex)}>▼</button>
                                <button onClick={() => deleet(phraseIndex)}>❌</button> {/* ×❌❎*/}
                                {phrase.name}
                            </div>
                        )}
                    </div>
                    <input onChange={this.handleChange} name="name" value={this.state.name}/>
                    <input type="number" onChange={this.handleChange} name="length" value={this.state.length}/>
                    <button onClick={this.handleClick} name="add">Add</button>
                    <div className="dialog-buttonrow">
                        <button className="dialog-button ok" onClick={this.handleClick} name="ok">OK</button>
                        <button className="dialog-button cancel" onClick={this.handleClick} name="cancel">Cancel</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default ManagePhrasesDialog;
