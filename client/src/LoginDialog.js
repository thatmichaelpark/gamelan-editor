import React from 'react';
import account from './stores/accountStore';
import Boo from './Boo';

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
        if (e.target.name === 'login') {
            account.logIn(this.state.username, this.state.password)
            .then((result) => {
                Boo.yeah(`Logged in as ${result.data.name}`);
                this.props.onLogin();
            })
            .catch(Boo.boo);
        }
        else { // cancel
            console.log(this.activeElement);
            this.props.onLogin();
        }
    }
    render() {
        return this.props.isVisible && (
            <div className="dialogparent">
                <div className="dialog">
                    <h1>Log In</h1>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            onChange={this.handleChange}
                            ref={x => this.setFocus(x)}
                            value={this.state.username}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            onChange={this.handleChange}
                            type="password"
                            value={this.state.password}
                        />
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
