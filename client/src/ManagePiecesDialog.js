import React from 'react';
import piecesStore from './stores/piecesStore';
import account from './stores/accountStore';
import { observer } from 'mobx-react';

@observer
class ManagePiecesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieces: [],
            selectedPieceId: -1,
            tempTitle: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            piecesStore.getPieces()
            .then(pieces => {
                this.setState({
                    pieces: pieces.filter(p => p.userId === account.userId),
                    selectedPieceId: -1,
                    tempTitle: ''
                });
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'ok') {
            this.props.onManagePieces();
        }
        else { // cancel
            this.props.onManagePieces();
        }
    }
    render() {
        const rename = (piece) => {
            this.setState({
                selectedPieceId: piece.id,
                tempTitle: piece.title
            });
        }
        const deleet = () => {

        }
        const handleBlur = (piece) => {
            piece.title = this.state.tempTitle;
            piecesStore.savePiece(piece, () => {
                piecesStore.getPieces()
                .then(pieces => {
                    this.setState({
                        pieces: pieces.filter(p => p.userId === account.userId),
                        selectedPieceId: -1,
                        tempTitle: ''
                    });
                });
            });
        }
        const sortedPieces = this.state.pieces ? this.state.pieces.slice(0) : [];

        sortedPieces.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Manage Pieces</h1>
                    <div className="dialog-contents dialog-contents-large">
                        {sortedPieces.map((piece, i) =>
                            <p
                                // className={ piece.id === this.state.selectedPieceId ? 'selected' : '' }
                                key={i}
                            >
                                <button onClick={() => deleet()}>❌</button> {/* ×❌❎*/}
                                {piece.id === this.state.selectedPieceId ? (
                                    <input
                                        name="tempTitle"
                                        onBlur={() => handleBlur(piece)}
                                        onChange={this.handleChange}
                                        ref={x => x && x.focus()}
                                        value={this.state.tempTitle}
                                    />
                                ) : (
                                    <span onClick={() => rename(piece)}
                                    >
                                        {piece.title}
                                    </span>
                                )}
                            </p>
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

export default ManagePiecesDialog;
