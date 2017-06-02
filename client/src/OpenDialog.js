import React from 'react';
import piecesStore from './stores/piecesStore';

class OpenDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            titles: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            const titles = piecesStore.pieces
                .map(piece => piece.title)
                .sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            this.setState({
                titles,
                title: titles[0] || ''
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            title: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'open') {
            this.props.onOpen(this.state.title);
        }
        else {
            this.props.onOpen(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Open</h1>
                    <select onChange={this.handleChange} value={this.state.title}>
                        {this.state.titles.map((title, i) =>
                            <option key={i} value={title}>{title}</option>
                        )}
                    </select>
                    <button onClick={this.handleClick} name="open">Open</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default OpenDialog;
