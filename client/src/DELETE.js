import React from 'react';
import gamelansStore from './stores/gamelansStore';
import piecesStore from './stores/piecesStore';

class NoteMenu extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            console.log('blah', gamelansStore.gamut(piecesStore.currentPiece.scale, this.props.part.instrument));
            document.addEventListener('click', this.show);
        }
    }
    show = (e) => {
        this.props.onClick();
        console.log('remove');
        document.removeEventListener('click', this.show);
    }
    handleClick = (e) => {
        this.props.onClick();
    }
    render() {
        return this.props.isVisible && (
            // <div className="dialogparent">
                <div style={{
                    background: 'lightgray',
                    position: 'absolute',
                    left: `${this.props.x}px`,
                    top: `${this.props.y}px`,
                    width: '200px',
                    height: '200px',
                    zIndex: 1000
                }}>
                    <h1>Menu</h1>
                    <button onClick={this.handleClick} name="add">Add</button>
                    <button onClick={this.handleClick} name="cancel">Cancel</button>
                </div>
            // </div>
        );
    }
}

export default NoteMenu;
