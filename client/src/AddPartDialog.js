import React from 'react';
import gamelansStore from './stores/gamelansStore';

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
        }
    }
    handleSelect = (e) => {
        this.setState({
            instrument: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'add') {
            this.props.onAddPart(this.state.instrument);
        }
        else {
            this.props.onAddPart(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Add Part</h1>
                    <select onChange={this.handleSelect} value={this.state.instrument}>
                        {this.state.instruments.map((instrument, i) =>
                            <option key={i} value={instrument}>{instrument}</option>
                        )}
                    </select>
                    <button onClick={this.handleClick} name="add">Add</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default AddPartDialog;
