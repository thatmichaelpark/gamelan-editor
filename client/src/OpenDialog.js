import React from 'react';
import piecesStore from './stores/piecesStore';
import usersStore from './stores/usersStore';
import { observer } from 'mobx-react';

@observer
class OpenDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPieceId: -1,
            pieces: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            usersStore.refresh();
            piecesStore.getPieces()
            .then(pieces => {
                this.setState({
                    pieces,
                    selectedPieceId: -1
                });
            });
        }
    }
    handleSelect = (id) => {
        this.setState({
            selectedPieceId: id
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'open') {
            this.props.onOpen(Number(this.state.selectedPieceId));
        }
        else {
            this.props.onOpen(null);
        }
    }
    render() {
        const sortedPieces = this.state.pieces ? this.state.pieces.slice(0) : [];

        sortedPieces.sort((a, b) => {
            const aName = usersStore.nameById(a.userId);
            const bName = usersStore.nameById(b.userId);

            return aName < bName ? -1 : aName > bName ? 1 : 0;
        })
        .sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Open</h1>
                    <div className="dialog-contents dialog-contents-large">
                        {sortedPieces.map((piece, i) =>
                            <p
                                className={ piece.id === this.state.selectedPieceId ? 'selected' : '' }
                                key={i}
                                onClick={() => this.handleSelect(piece.id)}
                            >
                                {`${piece.title} (${usersStore.nameById(piece.userId)})`}
                            </p>
                        )}
                    </div>
                    <div className="dialog-buttonrow">
                        {this.state.selectedPieceId &&
                            <button className="dialog-button ok" onClick={this.handleClick} name="open">Open</button>
                        }
                        <button className="dialog-button cancel" onClick={this.handleClick} name="cancel">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default OpenDialog;
