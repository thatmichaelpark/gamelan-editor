import React from 'react';

class AddPhraseDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            length: 8
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                name: ''
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
            this.props.onAddPhrase(this.state); // name, length
        }
        else {
            this.props.onAddPhrase(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Add Phrase</h1>
                    <input onChange={this.handleChange} name="name" value={this.state.name}/>
                    <input type="number" onChange={this.handleChange} name="length" value={this.state.length}/>
                    <button onClick={this.handleClick} name="add">Add</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default AddPhraseDialog;
