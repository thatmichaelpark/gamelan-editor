import React from 'react';

class SaveDialog extends React.Component {
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
            this.props.onSave(this.state.title);
        }
        else {
            this.props.onSave(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Save</h1>
                    <input onChange={this.handleChange} value={this.state.title}/>
                    <button onClick={this.handleClick} name="save">Save</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default SaveDialog;
