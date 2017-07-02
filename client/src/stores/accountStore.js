import { observable } from 'mobx';
import axios from 'axios';

class Account {
    @observable isLoggedIn;
    @observable name;
    @observable username;
    @observable userId;
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
        const checkCookies = () => {
            this.isLoggedIn = getCookie('gamelanUsername') !== '';
            this.name = getCookie('gamelanName');
            this.username = getCookie('gamelanUsername');
            this.userId = Number(getCookie('gamelanUserId'));
            this.isAdmin = getCookie('gamelanIsAdmin') === 'true';
        }
        checkCookies();
        setInterval(checkCookies, 5000);
    }
    logIn(username, password) {
        return axios.post('/api/token', { username, password })
        .then((result) => {
            this.isLoggedIn = true;
            this.name = result.data.name;
            this.username = result.data.username;
            this.userId = result.data.userId;
            this.isAdmin = result.data.isAdmin;
            return result;
        });
    }
    logOut() {
        return axios.delete('/api/token')
        .then((result) => {
            this.isLoggedIn = false;
            this.name = '';
            this.username = '';
            this.userId = 0;
            this.isAdmin = false;
        });
    }
}

export default new Account();
