import React from 'react';
import { observer } from 'mobx-react';
import { currentPiece } from './stores/piecesStore';

@observer
class Transport extends React.Component {
    handleBpmChange = (e) => {
        currentPiece.bpm = e.target.value;
    }
    handleLevelChange = (part, value) => {
        part.level = value / 100;
        part.gainNode.gain.value = part.level;
    };
    render() {
        // const buttonStyle = {
        //     height: '50px',
        //     width: '50px',
        //     borderRadius: '50%'
        // };
        return (
            <div className="transport" style={{ bottom: this.props.isVisible ? 0 : '-100px' }}>
                <button onClick={this.props.onPlay} value='play'>play</button>
                <button onClick={this.props.onPause} value='pause'>pause</button>
                <button onClick={this.props.onStop} value='stop'>stop</button>
                <div className="tempo">
                    <div style={{ fontSize: '50%' }}>Tempo</div>
                    <div>{currentPiece.bpm}</div>
                    <input type="range" min="40" max="300" style={{ width: '180px' }} value={currentPiece.bpm} onChange={this.handleBpmChange}/>
                </div>
                {currentPiece.parts.map((part, i) =>
                    <div className="level" key={i}>
                        <div style={{ textAlign: 'center '}}>{part.instrument}</div>
                        <input 
                            type="range" 
                            name={part.instrument} 
                            min="0" 
                            max="100" 
                            value={part.level * 100}
                            onChange={(e) => this.handleLevelChange(part, e.target.value)}
                        />
                    </div>
                )}
            </div>
            // <div style={{
            // 	position: 'fixed',
            // 	bottom: '0',
            // 	left: '0',
            // 	right: '0',
            // 	height: '80px',
            // 	background: 'rgba(190, 190, 190, 0.9)',
            // }}>
            //     <div style={{
            //         display: 'flex',
            //         flexDirection: 'row',
            //         position: 'absolute',
            //         bottom: 0,
            //         left: 0,
            //         top: 0,
            //         width: '120px',
            //         background: 'red'
            //     }}>
            //         <button style={buttonStyle}>
            //             Play
            //         </button>
            //         <button style={buttonStyle}>
            //             Stop
            //         </button>
            //     </div>
            // </div>
        );
    }
}

export default Transport;