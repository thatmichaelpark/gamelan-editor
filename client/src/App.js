import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Notifications from 'react-notify-toast';

import Main from './Main';
import Admin from './Admin';

class App extends React.Component {
    // checkLoggedIn(nextState, replace) {
    //     if (!loginStore.isLoggedIn) {
    //         replace({
    //             pathname: '/'
    //         });
    //     }
    // }
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/admin" component={Admin}/>
                        <Route path="/" component={Main}/>
                    </Switch>
                </Router>
                <Notifications/>
            </div>
        );
    }
}

export default App;
