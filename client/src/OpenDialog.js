import React from 'react';
import piecesStore from './stores/piecesStore';
import usersStore from './stores/usersStore';
import { observer } from 'mobx-react';

@observer
class OpenDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPieceId: '',
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
                    selectedPieceId: pieces[0] ? pieces[0].id : null
                });
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            selectedPieceId: e.target.value
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
        const sortedPieces = this.state.pieces.slice(0);

        sortedPieces.sort((a, b) => {
            const aName = usersStore.nameById(a.userId);
            const bName = usersStore.nameById(b.userId);

            return aName < bName ? -1 : aName > bName ? 1 : 0;
        })
        .sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Open</h1>
                    {this.state.pieces.length > 0 ?
                        (
                            <select onChange={this.handleChange} value={this.state.selectedPieceId}>
                                {sortedPieces.map((piece, i) =>
                                    <option key={i} value={piece.id}>{`${piece.title} (${usersStore.nameById(piece.userId)})`}</option>
                                )}
                            </select>
                        ) : (
                            <p>No saved pieces</p>
                        )
                    }
                    {this.state.pieces.length > 0 &&
                        <button onClick={this.handleClick} name="open">Open</button>
                    }
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default OpenDialog;
