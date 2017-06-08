import { observable } from 'mobx';
import axios from 'axios';
import Boo from '../Boo';

class Account {
    @observable isLoggedIn;
    @observable name;
    @observable username;
    @observable isAdmin;

    constructor() {
        // Retrieve cookie value by name
        // https://www.w3schools.com/js/js_cookies.asp
        function getCookie(cname) {
            const name = cname + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');

            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        this.isLoggedIn = getCookie('gamelanUsername') !== '';
        this.name = getCookie('gamelanName');
        this.username = getCookie('gamelanUsername');
        this.isAdmin = getCookie('gamelanIsAdmin') === 'true';
    }
    logIn(username, password) {
        axios.post('/api/token', { username, password })
        .then((result) => {
            Boo.yeah(`Logged in as ${result.data.name}`);
            this.isLoggedIn = true;
            this.name = result.data.name;
            this.username = result.data.username;
            this.isAdmin = result.data.isAdmin;
        })
        .catch(Boo.boo);
    }
    logOut() {
        axios.delete('/api/token')
        .then((result) => {
            Boo.yeah(`Logged out`);
            this.isLoggedIn = false;
            this.name = '';
            this.username = '';
            this.isAdmin = false;
        })
        .catch(Boo.boo);
    }
}

export default new Account();
