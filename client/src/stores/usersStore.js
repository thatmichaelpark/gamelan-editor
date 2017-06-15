import { computed, observable } from 'mobx';
import axios from 'axios';
import Boo from '../Boo';

class User {
    @observable userId;
    @observable name;
    constructor(userId, name) {
        this.userId = userId;
        this.name = name;
    }
}

class UsersStore {
    @observable users = [];
    nameById(userId) {
        const u = this.users.find(u => u.userId === userId);
        return u ? u.name : '';
    }
    refresh() {
        axios.get(`/api/users`)
        .then(results => {
            this.users.replace(results.data.map(d => new User(d.id, d.name)));
        })
        .catch(Boo.boo);
    }
}

export default new UsersStore();
