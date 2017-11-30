import React from 'react';
import gamelansStore from './stores/gamelansStore';
import { observer } from 'mobx-react';

@observer
class InstrumentLoadingProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsVisible: false
        };
    }
    render() {
        return gamelansStore.nToLoad > 0 && (
            <div
                style={{
                    backgroundColor: "blue",
                    position: 'absolute',
                    bottom: 0,
                    height: "20px",
                    left: 0,
                    width: gamelansStore.nLoaded * 100 / gamelansStore.nToLoad + "%"
                }}
            >
            </div>
        );
    }
}

export default InstrumentLoadingProgress;
