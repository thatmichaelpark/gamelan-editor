import React from 'react';
import { currentPiece } from './stores/piecesStore';

class ManagePhrasesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            length: 8,
            editPhraseIndex: -1
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                editPhraseIndex: -1,
                name: ''
            });
            this.savedParts = JSON.stringify(currentPiece.parts);
            this.savedPhraseInfos = JSON.stringify(currentPiece.phraseInfos);
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'add') {
            currentPiece.addPhrase(this.state.name, Number(this.state.length));
        }
        else if (e.target.name === 'ok') {
            this.props.onManagePhrases();
        }
        else { // cancel: restore saved parts
            currentPiece.parts = JSON.parse(this.savedParts);
            currentPiece.phraseInfos = JSON.parse(this.savedPhraseInfos);
            this.props.onManagePhrases();
        }
    }
    render() {
        const moveUp = (i) => {
            if (i === 0) {
                return;
            }
            const movingPhraseInfo = currentPiece.phraseInfos[i];
            currentPiece.phraseInfos.splice(i, 1);                        // remove ith element
            currentPiece.phraseInfos.splice(i - 1, 0, movingPhraseInfo);  // insert moved element
            currentPiece.parts.forEach(part => {
                const movingPhrase = part.phrases[i];
                part.phrases.splice(i, 1);                              // remove ith phrase
                part.phrases.splice(i - 1, 0, movingPhrase);            // insert moved phrase
            });
        }
        const moveDown = (i) => {
            if (i === currentPiece.parts.length - 1) {
                return;
            }
            const movingPhraseInfo = currentPiece.phraseInfos[i];
            currentPiece.phraseInfos.splice(i, 1);                        // remove ith element
            currentPiece.phraseInfos.splice(i + 1, 0, movingPhraseInfo);  // insert moved element
            currentPiece.parts.forEach(part => {
                const movingPhrase = part.phrases[i];
                part.phrases.splice(i, 1);                              // remove ith phrase
                part.phrases.splice(i + 1, 0, movingPhrase);            // insert moved phrase
            });
        }
        const deleet = (i) => {
            currentPiece.phraseInfos.splice(i, 1);                // remove ith phraseInfo
            currentPiece.parts.forEach(part => {
                part.phrases.splice(i, 1);                      // remove ith phrase
            });
        }
        const edit = (phraseIndex) => {
            this.setState({ editPhraseIndex: phraseIndex });
        }
        const handleEdit = (e) => {
            currentPiece.phraseInfos[this.state.editPhraseIndex].name = e.target.value;
        }
        const handleBlur = (e) => {
            this.setState({ editPhraseIndex: -1 });
        }

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Manage Phrases</h1>
                    <input onChange={this.handleChange} name="name" value={this.state.name}/>
                    <input type="number" onChange={this.handleChange} name="length" value={this.state.length} style={{ width: '20%' }}/>
                    <button onClick={this.handleClick} name="add">Add</button>
                    <div className="dialog-contents">
                        {currentPiece.phraseInfos.map((phrase, phraseIndex) =>
                            <div key={phraseIndex}>
                                <button onClick={() => moveUp(phraseIndex)}>▲</button>
                                <button onClick={() => moveDown(phraseIndex)}>▼</button>
                                <button onClick={() => deleet(phraseIndex)}>❌</button> {/* ×❌❎*/}
                                {phraseIndex === this.state.editPhraseIndex ? (
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleEdit} value={phrase.name}
                                        ref={x => x && x.focus()}
                                    />
                                ) : (
                                    <span onClick={() => edit(phraseIndex)}>
                                        {phrase.name}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
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
