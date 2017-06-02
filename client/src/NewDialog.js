import React from 'react';

class NewDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            scale: 'pelog'
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                title: '',
                scale: 'pelog'
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            title: e.target.value
        });
    }
    handleSelect = (e) => {
        this.setState({
            scale: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'new') {
            this.props.onNew(this.state); // title, scale
        }
        else {
            this.props.onNew(null);
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>New</h1>
                    <input onChange={this.handleChange} value={this.state.title}/>
                    <select onChange={this.handleSelect} value={this.state.scale}>
                        <option value="pelog">Pelog</option>
                        <option value="slendro">Slendro</option>
                    </select>
                    <button onClick={this.handleClick} name="new">New</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            </div>
        );
    }
}

export default NewDialog;
