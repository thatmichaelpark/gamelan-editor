import React from 'react';
import piecesStore from './stores/piecesStore';
import account from './stores/accountStore';
import { observer } from 'mobx-react';

@observer
class ManagePiecesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieces: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            piecesStore.getPieces()
            .then(pieces => {
                console.log(pieces, account.userId);
                this.setState({
                    pieces: pieces.filter(p => p.userId === account.userId),
                    selectedPieceId: null
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
        if (e.target.name === 'add') {
        }
        else if (e.target.name === 'ok') {
            this.props.onManagePieces();
        }
        else { // cancel
            this.props.onManagePieces();
        }
    }
    render() {
        const rename = () => {

        }
        const deleet = () => {

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
                                className={ piece.id === this.state.selectedPieceId ? 'selected' : '' }
                                key={i}
                                onClick={() => this.handleSelect(piece.id)}
                            >
                                <button onClick={() => rename()}>Rename</button> {/* ×❌❎*/}
                                <button onClick={() => deleet()}>❌</button> {/* ×❌❎*/}
                                {piece.title}
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
