import React from 'react';
import { observer } from 'mobx-react';
import { currentPiece } from './stores/piecesStore';
import beatStore from './stores/beatStore';

@observer
class PieceDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            svgTop: 0,
            svgRight: 0,
            svgBottom: 0,
            svgLeft: 0
        };
    }
    componentDidMount() {
        this.updateSvgRect();
        window.addEventListener('resize', this.updateSvgRect);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSvgRect);
    }
    updateSvgRect = () => {
        const { top, right, bottom, left } = this.svgElement.getBoundingClientRect();
        this.setState({ 
            svgTop: top,
            svgRight: right,
            svgBottom: bottom,
            svgLeft: left
        });
    }
    t2x = (t) => t * (this.state.svgRight - this.state.svgLeft - 80) + 40; // t in [0..1]
    f2y = (f) => 80 - f * 40; // t in [0..1]
    x2t = (x) => (x - 40) / (this.state.svgRight - this.state.svgLeft - 80);
    y2f = (y) => (this.svgTop - y + 80) / 40;

    handleClick = (e) => {
        const t = this.x2t(e.clientX);
        if (0 <= t && t <= 1) {
            beatStore.realBeat = t * this.totalBeats;
        }
    }
    handleLineClick = (e) => {
        const tempoPoints = currentPiece.tempoPoints.slice();
        tempoPoints.push({ t: this.x2t(e.clientX), f: this.y2f(e.clientY) });
        tempoPoints.sort((a, b) => a.t - b.t);
        currentPiece.tempoPoints.replace(tempoPoints);
        e.stopPropagation();
    }
    handleCircleClick = (e) => {
        e.stopPropagation();
    }
    handleCircleMouseDown = (e) => {
        this.svgTop = this.svgElement.getBoundingClientRect().top;
        this.dragging = true;
    }
    handleCircleMouseMove = (e, i) => {
        if (this.dragging) {
            let t = this.x2t(e.clientX);
            let f = this.y2f(e.clientY);
            const points = currentPiece.tempoPoints.slice();

            if (i === 0) {
                t = points[i].t;
            }
            else if (i === points.length - 1) {
                t = points[i].t;
            }
            else if (points[i].t <= points[i - 1].t) {
                points.splice(i - 1, 1);
                i -= 1;
            }
            else if (points[i].t >= points[i + 1].t) {
                points.splice(i + 1, 1);
            }
            points[i] = {t, f};
            currentPiece.tempoPoints.replace(points);
        }
    }
    handleCircleMouseUp = (e) => {
        this.dragging = false;
    }
    render() {
        if (currentPiece.isUnusable) {
            return <div></div>;
        }
        this.totalBeats = currentPiece.phrasePlaylist.reduce((acc, id) => acc + currentPiece.phraseInfos.find(p => p.id === id).length, 0);

        return (
            <div
                style={{
                    position: 'fixed',
                    width: '100%',
                    height: '100px',
                    bottom: this.props.isVisible ? '100px' : '-100px',
                    transition: 'bottom 0.3s ease-in-out',
                }}
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
                                width: `${currentPiece.phraseInfos.find(p => p.id === id).length / this.totalBeats * 100}%`,
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
                    {currentPiece.phrasePlaylist.length !== 0 && currentPiece.tempoPoints.map((pt, i) => 
                        i !== currentPiece.tempoPoints.length - 1 &&
                        <line 
                            className='tempoLine'
                            key={i} 
                            onClick={this.handleLineClick}
                            x1={this.t2x(pt.t)} 
                            y1={this.f2y(pt.f)} 
                            x2={this.t2x(currentPiece.tempoPoints[i + 1].t)} 
                            y2={this.f2y(currentPiece.tempoPoints[i + 1].f)}
                        />
                    )}
                    {currentPiece.phrasePlaylist.length !== 0 && currentPiece.tempoPoints.map((pt, i) =>
                        <circle
                            key={i} 
                            cx={this.t2x(pt.t)} 
                            cy={this.f2y(pt.f)}
                            r={5}
                            fill='green'
                            onClick={this.handleCircleClick}
                            onMouseDown={this.handleCircleMouseDown}
                            onMouseMove={(e) => this.handleCircleMouseMove(e, i)}
                            onMouseUp={this.handleCircleMouseUp}
                            onMouseOut={this.handleCircleMouseUp}
                        />
                    )}
                    {currentPiece.phrasePlaylist.length !== 0 && this.totalBeats &&
                        <circle 
                            cx={this.t2x(beatStore.realBeat / this.totalBeats)} 
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