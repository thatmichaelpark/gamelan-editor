import React from 'react';
import { observer } from 'mobx-react';
import { currentPiece } from './stores/piecesStore';

@observer
class Transport extends React.Component {
    handleLevelChange = (part, value) => {
        part.level = value / 100;
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
                    <span>{123}</span>
                    <input type="range" min="40" max="150" value={123}/>
                </div>
                {currentPiece.parts.map((part, i) =>
                    <div className="level" key={i}>
                        <span>{part.instrument}</span>
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