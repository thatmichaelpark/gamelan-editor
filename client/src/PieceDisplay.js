import React from 'react';
import { observer } from 'mobx-react';
import { currentPiece } from './stores/piecesStore';
import beatStore from './stores/beatStore';

@observer
class PieceDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            svgHeight: 0,
            svgWidth: 0
        };
    }
    scaleX = (x) => x * (this.state.svgWidth - 80) + 40; // x in [0..1]
    componentDidMount() {
        const svgWidth = this.svgElement.clientWidth;
        const svgHeight = this.svgElement.clientHeight;
        this.setState({ svgWidth, svgHeight })
        console.log(svgWidth, svgHeight);
    }
    render() {
        const totalBeats = currentPiece.phrasePlaylist.reduce((acc, id) => acc + currentPiece.phraseInfos.find(p => p.id === id).length, 0);

        return (
            <div
                style={{
                    position: 'fixed',
                    width: '100%',
                    height: '100px',
                    bottom: this.props.isVisible ? '100px' : '-100px',
                    transition: 'bottom 0.3s ease-in-out'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '40px',
                        right: '40px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    {currentPiece.phrasePlaylist.map((id, i) => 
                        <div
                            key={i}
                            style={{
                                boxSizing: 'border-box',
                                border: '1px solid gray',
                                background: 'rgba(230, 240, 250, 0.9)',
                                width: `${currentPiece.phraseInfos.find(p => p.id === id).length / totalBeats * 100}%`,
                                height: '80px'
                            }}
                        >
                            {currentPiece.phraseInfos.find(p => p.id === id).name}
                        </div>
                    )}
                </div>
                <svg
                    width='100%'
                    height='100%'
                    ref={(svgElement => this.svgElement = svgElement)}
                >
                    {totalBeats &&
                        <circle cx={this.scaleX(beatStore.realBeat / totalBeats)} cy={90} r={5} fill='green'/>
                    }
                </svg>
            </div>
        );
    }
}

export default PieceDisplay;