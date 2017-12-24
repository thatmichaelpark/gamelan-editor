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
        this.height = 100; // px
        this.margin = 40; // px on left and right
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
            svgLeft: left,
            svgWidth: right - left
        });
    }
    t2x = (t) => t * (this.state.svgWidth - 2 * this.margin) + this.margin; // t in [0..1]
    f2y = (f) => this.height - f * 0.5 * this.height;
    x2t = (x) => (x - this.margin) / (this.state.svgWidth - 2 * this.margin);
    y2f = (y) => (this.state.svgTop - y + this.height) / (this.height * 0.5);

    handleClick = (e) => {
        const t = this.x2t(e.clientX);
        if (0 <= t && t <= 1) {
            beatStore.realBeat = t * this.totalBeats;
            beatStore.realBeat0 = beatStore.realBeat1 = beatStore.realBeat;
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
        this.dragging = true;
        e.stopPropagation();
    }
    handleCircleMouseMove = (e, i) => {
        if (this.dragging) {
            let t = this.x2t(e.clientX);
            let f = this.y2f(e.clientY);
            const points = currentPiece.tempoPoints.slice();

            if (i === 0) {
                t = 0;
                f = 1;
            }
            else if (i === points.length - 1) {
                t = 1;
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
        e.stopPropagation();
    }
    handleCircleMouseUp = (e) => {
        this.dragging = false;
        e.stopPropagation();
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
                    height: `${this.height}px`,
                    bottom: this.props.isVisible ? '80px' : '-100px',
                    transition: 'bottom 0.3s ease-in-out',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: `${this.margin}px`,
                        right: `${this.margin}px`,
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
                                background: 'rgb(230, 240, 250)',
                                width: `${currentPiece.phraseInfos.find(p => p.id === id).length / this.totalBeats * 100}%`,
                                height: '100%'
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
                        <g key={i}>
                            <circle
                                className='tempoCircle'
                                cx={this.t2x(pt.t)} 
                                cy={this.f2y(pt.f)}
                                onClick={this.handleCircleClick}
                                onMouseDown={this.handleCircleMouseDown}
                                onMouseMove={(e) => this.handleCircleMouseMove(e, i)}
                                onMouseUp={this.handleCircleMouseUp}
                                onMouseOut={this.handleCircleMouseUp}
                            />
                            <text
                                x={this.t2x(pt.t)} 
                                y={this.f2y(pt.f)}
                                fontSize='12px'
                                dx={-9}
                                dy={4}
                                textAnchor='end'
                            >
                                {Math.round(pt.f * 100) / 100}
                            </text>
                        </g>
                    )}
                    {currentPiece.phrasePlaylist.length !== 0 && this.totalBeats &&
                        <line 
                            x1={this.t2x(beatStore.realBeat / this.totalBeats)} 
                            y1={0}
                            x2={this.t2x(beatStore.realBeat / this.totalBeats)} 
                            y2={this.height} 
                            stroke={'blue'}
                            strokeWidth={5}
                        />
                    }
                </svg>
            </div>
        );
    }
}

export default PieceDisplay;