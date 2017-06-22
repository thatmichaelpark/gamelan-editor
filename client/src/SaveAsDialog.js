import React from 'react';

class SaveAsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                title: nextProps.title
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            title: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'save') {
            this.props.onSave(this.state.title.trim().replace(/\s+/g,' '));
        }
        else {
            this.props.onSave(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Save As</h1>
                    <input onChange={this.handleChange} value={this.state.title}/>
                    <div className="dialog-buttonrow">
                        <button className="dialog-button ok" onClick={this.handleClick} name="save">Save</button>
                        <button className="dialog-button cancel" onClick={this.handleClick} name="cancel">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaveAsDialog;
