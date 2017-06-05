import React from 'react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    render() {
        return (
            <div>
                <h1>Admin Page</h1>
                <Link to="/">Home</Link>
            </div>
        );
    }
}

export default Login;
