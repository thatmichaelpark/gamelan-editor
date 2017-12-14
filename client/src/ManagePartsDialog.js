import React from 'react';
import gamelansStore from './stores/gamelansStore';
import { currentPiece } from './stores/piecesStore';

class AddPartDialog extends React.Component {
    constructor(props) {
        super(props);
        const instruments = gamelansStore.gamelans.find(gamelan => gamelan.scale === props.scale).instruments.map(instrument => instrument.name);
        this.state = {
            instruments,
            instrument: instruments[0]
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            const instruments = gamelansStore.gamelans.find(gamelan => gamelan.scale === nextProps.scale).instruments.map(instrument => instrument.name);

            this.setState({
                instruments,
                instrument: instruments[0]
            });
            this.savedParts = JSON.stringify(currentPiece.parts);
        }
    }
    handleSelect = (e) => {
        this.setState({
            instrument: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'add') {
            currentPiece.addPart(this.state.instrument);
        }
        else if (e.target.name === 'ok') {
            this.props.onManageParts();
        }
        else { // cancel: restore saved parts
            currentPiece.parts = JSON.parse(this.savedParts);
            this.props.onManageParts();
        }
    }
    render() {
        const moveUp = (i) => {
            if (i === 0) {
                return;
            }
            const movingPart = currentPiece.parts[i];
            currentPiece.parts.splice(i, 1);                   // remove ith element
            currentPiece.parts.splice(i - 1, 0, movingPart);   // insert moved element
        }
        const moveDown = (i) => {
            if (i === currentPiece.parts.length - 1) {
                return;
            }
            const movingPart = currentPiece.parts[i];
            currentPiece.parts.splice(i, 1);                   // remove ith element
            currentPiece.parts.splice(i + 1, 0, movingPart);   // insert moved element
        }
        const deleet = (i) => {
            currentPiece.parts.splice(i, 1);                   // remove ith element
        }

        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog dialog-large">
                    <h1>Manage Parts</h1>
                    <div className="dialog-contents">
                        {currentPiece.parts.map((part, partIndex) =>
                            <div key={partIndex}>
                                <button onClick={() => moveUp(partIndex)}>▲</button>
                                <button onClick={() => moveDown(partIndex)}>▼</button>
                                <button onClick={() => deleet(partIndex)}>❌</button> {/* ×❌❎*/}
                                {part.instrument}
                            </div>
                        )}
                    </div>
                    <select onChange={this.handleSelect} value={this.state.instrument}>
                        {this.state.instruments.map((instrument, i) =>
                            <option key={i} value={instrument}>{instrument}</option>
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

export default AddPartDialog;
