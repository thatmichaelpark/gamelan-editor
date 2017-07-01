import React from 'react';
import account from './stores/accountStore';

class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.setState({
                username: '',
                password: ''
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleClick = (e) => {
        if (e.target.name === 'login') {
            account.logIn(this.state.username, this.state.password);
        }
        this.props.onLogin();
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Log In</h1>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input onChange={this.handleChange} value={this.state.username} id="username" name="username"/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input onChange={this.handleChange} value={this.state.password} name="password" type="password"/>
                    </div>
                    <div className="dialog-buttonrow">
                        <button className="dialog-button ok" onClick={this.handleClick} name="login">Log In</button>
                        <button className="dialog-button cancel" onClick={this.handleClick} name="cancel">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginDialog;
