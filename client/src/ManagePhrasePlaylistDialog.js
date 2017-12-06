import React from 'react';
import { currentPiece } from './stores/piecesStore';
import { observer } from 'mobx-react';

@observer
class ManagePhraseListDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPhraseId: null
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                selectedPhraseId: currentPiece.phraseInfos[0].id
            });
            this.savedPhrasePlaylist = JSON.stringify(currentPiece.phrasePlaylist);
        }
    }
    handleSelect = (e) => {
        this.setState({
            selectedPhraseId: Number(e.target.value)
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'add') {
            currentPiece.phrasePlaylist.push(this.state.selectedPhraseId);
        }
        else if (e.target.name === 'ok') {
            this.props.onManagePhrasePlaylist();
        }
        else { // cancel: restore saved phrasePlaylist
            currentPiece.phrasePlaylist = JSON.parse(this.savedPhrasePlaylist);
            this.props.onManagePhrasePlaylist();
        }
    }
    render() {
        const moveUp = (i) => {
            if (i === 0) {
                return;
            }
            const movingPhraseId = currentPiece.phrasePlaylist[i];
            currentPiece.phrasePlaylist.splice(i, 1);                   // remove ith element
            currentPiece.phrasePlaylist.splice(i - 1, 0, movingPhraseId);   // insert moved element
        }
        const moveDown = (i) => {
            if (i === currentPiece.phrasePlaylist.length - 1) {
                return;
            }
            const movingPhraseId = currentPiece.phrasePlaylist[i];
            currentPiece.phrasePlaylist.splice(i, 1);                   // remove ith element
            currentPiece.phrasePlaylist.splice(i + 1, 0, movingPhraseId);   // insert moved element
        }
        const deleet = (i) => {
            currentPiece.phrasePlaylist.splice(i, 1);                   // remove ith element
        }

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Manage Parts</h1>
                    <div className="dialog-contents">
                        {currentPiece.phrasePlaylist.map((phraseId, i) =>
                            <div key={i}>
                                <button onClick={() => moveUp(i)}>▲</button>
                                <button onClick={() => moveDown(i)}>▼</button>
                                <button onClick={() => deleet(i)}>❌</button> {/* ×❌❎*/}
                                {currentPiece.phraseInfos.find(p => p.id === phraseId).name}
                            </div>
                        )}
                    </div>
                    <select onChange={this.handleSelect} value={this.state.selectedPhraseId}>
                        {currentPiece.phraseInfos.map((phraseInfo, i) =>
                            <option key={i} value={phraseInfo.id}>{phraseInfo.name}</option>
                        )}
                    </select>
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

export default ManagePhraseListDialog;
