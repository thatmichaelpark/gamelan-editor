import React from 'react';
import { currentPiece } from './stores/piecesStore';

class RetitleDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                title: currentPiece.title
            });
            this.shouldSetFocus = true;
        }
    }
    setFocus = (x) => {
        if (x && this.shouldSetFocus) {
            x.focus();
            this.shouldSetFocus = false;
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'ok') {
            currentPiece.title = this.state.title;
        }
        // the other target is cancel
        this.props.onRetitle();
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Change Title</h1>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            onChange={this.handleChange}
                            ref={x => this.setFocus(x)}
                            value={this.state.title}
                        />
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

export default RetitleDialog;
