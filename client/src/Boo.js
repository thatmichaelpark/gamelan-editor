import { notify } from 'react-notify-toast';

const timeout = 2222;

export default {
    boo: (err) => {
        const msg = err.response ? err.response.data : err.message;
        console.log(`Boo-boo! ${msg}\n${err.message}\n${err.stack}`);
        notify.show(`Boo-boo! ${msg}`, 'error', timeout);
    },
    yeah: (message) => {
        notify.show(message, 'success', timeout);
    }
};
