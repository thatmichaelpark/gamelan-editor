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
            svgLeft: 0,
            svgWidth: 0
        };
        this.height = 100; // px
        this.margin = 40; // px on left and right
        this.mouseTag = ''; // tag ('svg', 'line', 'circle') of element being moused
        this.mouseCircleIndex = -1; // circle being moused (if tag = 'circle')
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.updateSvgRect();
            setTimeout(this.updateSvgRect, 300);
        }
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

    handleMouseDown = (e) => {
        e.preventDefault();

        this.mouseTag = e.target.tagName;
        if (this.mouseTag === 'circle') {
            this.mouseCircleIndex = e.target.dataset.index;
        }
        else if (this.mouseTag === 'line') {
            if (e.target.dataset.linetype === 'tempoLine') {
                let t = this.x2t(e.clientX);
                let f = this.y2f(e.clientY);
                this.mouseCircleIndex = (function createNewCircle() {
                    const points = currentPiece.tempoPoints.slice();
                    let newIndex = -1;

                    for (let i = 0; i < points.length - 1; ++i) {
                        if (points[i].t < t && t < points[i + 1].t) {
                            newIndex = i + 1;
                            points.splice(newIndex, 0, {t, f});
                            currentPiece.tempoPoints.replace(points);
                            break;
                        }
                    }
                    return newIndex;
                })();
                this.mouseTag = this.mouseCircleIndex >= 0 ? 'circle' : '';
            }
            else {
                this.mouseTag = 'svg';
            }
        }
        else if (this.mouseTag === 'svg') {
            beatStore.stop();
            beatStore.setBeat(this.x2t(e.clientX) * currentPiece.nBeats);
        }
        else {
            this.mouseTag = '';
        }
    }
    handleMouseMove = (e) => {
        if (this.mouseTag === 'circle') {
            let i = Number(this.mouseCircleIndex);
            let t = this.x2t(e.clientX);
            let f = this.y2f(e.clientY);
            if (0.98 <= f && f <= 1.02) {
                f = 1;
            }
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
            this.mouseCircleIndex = i;
            currentPiece.tempoPoints.replace(points);
        }
        else if (this.mouseTag === 'svg') {
            beatStore.setBeat(this.x2t(e.clientX) * currentPiece.nBeats);
        }
    }
    handleMouseUp = (e) => {
        if (this.mouseTag === 'svg') {
            beatStore.start();
        }
        this.mouseTag = '';
    }
    render() {
        if (currentPiece.isUnusable) {
            return <div></div>;
        }
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
                                width: `${currentPiece.phraseInfos.find(p => p.id === id).length / currentPiece.nBeats * 100}%`,
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
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseUp}
                    ref={svgElement => this.svgElement = svgElement}
                >
                    {currentPiece.phrasePlaylist.length !== 0 && currentPiece.tempoPoints.map((pt, i) => 
                        i !== currentPiece.tempoPoints.length - 1 &&
                        <line 
                            className='tempoLine'
                            data-linetype='tempoLine'
                            key={i} 
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
                                data-index={i}
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
                    {currentPiece.phrasePlaylist.length !== 0 && currentPiece.nBeats &&
                        <line 
                            data-linetype='playPosition'
                            x1={this.t2x(beatStore.realBeat / currentPiece.nBeats)} 
                            y1={0}
                            x2={this.t2x(beatStore.realBeat / currentPiece.nBeats)} 
                            y2={this.height} 
                            stroke={'green'}
                            strokeWidth={4}
                        />
                    }
                </svg>
            </div>
        );
    }
}

export default PieceDisplay;