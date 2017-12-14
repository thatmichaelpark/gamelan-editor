import React from 'react';
import { observer } from 'mobx-react';
import { currentPiece, piecesStore } from './stores/piecesStore';

class Transport extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="transport">
                Transport
            </div>
        );
    }
}

export default Transport;