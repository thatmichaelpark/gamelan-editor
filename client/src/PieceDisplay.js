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
    componentDidMount() {
        const svgWidth = this.svgElement.clientWidth;
        const svgHeight = this.svgElement.clientHeight;
        this.setState({ svgWidth, svgHeight })
        this.bcr = this.parentElement.getBoundingClientRect();
        this.svgLeft = 40;
    }
    t2x = (t) => t * (this.state.svgWidth - 80) + 40; // t in [0..1]
    f2y = (f) => 80 - f * 40; // t in [0..1]
    x2t = (x) => (x - 40) / (this.state.svgWidth - 80);
    y2f = (y) => (this.svgTop - y + 80) / 40;

    handleClick = (e) => {
    }
    handleLineClick = (e) => {
        this.svgTop = this.svgElement.getBoundingClientRect().top;
        const tempoPoints = currentPiece.tempoPoints.slice();
        tempoPoints.push({ t: this.x2t(e.clientX), f: this.y2f(e.clientY) });
        tempoPoints.sort((a, b) => a.t - b.t);
        currentPiece.tempoPoints.replace(tempoPoints);
    }
    handleCircleClick = (e) => {
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
                    transition: 'bottom 0.3s ease-in-out',
                }}
                ref={(parentElement => this.parentElement = parentElement)}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '40px',
                        right: '40px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        zIndex: -1
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
                    onClick={this.handleClick}
                    ref={svgElement => this.svgElement = svgElement}
                    style={{
                    }}
                >
                    {currentPiece.tempoPoints.map((pt, i) => 
                        i !== currentPiece.tempoPoints.length - 1 &&
                        <line 
                            className='tempoLine'
                            key={i} 
                            onClick={this.handleLineClick}
                            // onMouseDown={this.handleMouseDown}
                            // onMouseMove={this.handleMouseMove}
                            // onMouseUp={this.handleMouseUp}
                            x1={this.t2x(pt.t)} 
                            y1={this.f2y(pt.f)} 
                            x2={this.t2x(currentPiece.tempoPoints[i + 1].t)} 
                            y2={this.f2y(currentPiece.tempoPoints[i + 1].f)}
                        />
                    )}
                    {currentPiece.tempoPoints.map((pt, i) =>
                        <circle
                            key={i} 
                            // i={i}
                            cx={this.t2x(pt.t)} 
                            cy={this.f2y(pt.f)}
                            r={5}
                            fill='green'
                            // moveDot={this.moveDot}
                        />
                    )}
                    {totalBeats &&
                        <circle 
                            cx={this.t2x(beatStore.realBeat / totalBeats)} 
                            cy={90} 
                            r={10} 
                            fill='green'
                            onClick={this.handleCircleClick}
                        />
                    }
                </svg>
            </div>
        );
    }
}

export default PieceDisplay;