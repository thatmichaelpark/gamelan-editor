import React from 'react';
import { piecesStore } from './stores/piecesStore';
import account from './stores/accountStore';
import { observer } from 'mobx-react';
import Boo from './Boo';

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phase: 0
        };
    }
    click = (e) => {
        if (this.state.phase === 0) {
            this.setState({ phase: 1 });
            setTimeout(() => {
                this.setState({ phase: 0 });
            }, 3333);
        }
        else {
            this.props.onClick(e);
        }
    }
    render() {
        return (
            <button
                onClick={this.click}
                style={{
                    overflow: 'hidden',
                    transition: '0.2s',
                    width: `${this.state.phase * 35 + 30}px`
                }}
            >
                {/* {['❌', '❌ Sure?'][this.state.phase]} */}
                ❌&nbsp;&nbsp;&nbsp;Sure?
            </button>
        )
    }
}

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
        const deleet = (id) => {
            piecesStore.delete(id)
            .then(() => {
                return piecesStore.getPieces();
            })
            .then(pieces => {
                this.setState({
                    pieces: pieces.filter(p => p.userId === account.userId),
                    selectedPieceId: -1,
                    tempTitle: ''
                });
            })
            .catch(Boo.boo);
        }
        const handleBlur = (piece) => {
            if (this.state.tempTitle.trim() === '') {
                Boo.boo({ message: "Title can't be blank"});
                // this.setState({ tempTitle: piece.title });
                return;
            }
            piece.title = this.state.tempTitle.trim();
            piecesStore.savePiece({
                id: piece.id,
                title: piece.title
            })
            .then(() => {
                return piecesStore.getPieces();
            })
            .then(pieces => {
                this.setState({
                    pieces: pieces.filter(p => p.userId === account.userId),
                    selectedPieceId: -1,
                    tempTitle: ''
                });
            })
            .catch(Boo.boo);
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
                                <DeleteButton onClick={() => deleet()}/>
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
