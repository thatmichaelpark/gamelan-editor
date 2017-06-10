import React from 'react';
import { observer } from 'mobx-react';
import gamelansStore from './stores/gamelansStore';
import piecesStore from './stores/piecesStore';
import displayStuff from './stores/displayStuff';

@observer
class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsVisible: false
        };
    }
    handleClick = (e) => {
        e.preventDefault();
        displayStuff.setSelected(this.props.partIndex, this.props.phraseIndex, this.props.noteIndex);
    }
    handleContextMenu = (e) => {
        e.preventDefault();
        this.handleClick(e);
        this.setState({
            menuIsVisible: true
        });
        document.addEventListener('click', this.hideMenu);
        document.addEventListener('contextmenu', this.hideMenu);
    }
    hideMenu = (e) => {
        e.preventDefault();
        this.setState({
            menuIsVisible: false
        });
        document.removeEventListener('click', this.hideMenu);
        document.removeEventListener('contextmenu', this.hideMenu);
    }
    handleKeyDown = (e) => {
        const code = e.nativeEvent.code;

        if (code.startsWith('Arrow')) {
            displayStuff.handleArrow(code);
            e.preventDefault();
        }
    }
    handleKeyPress = (e) => {
        let key;
        const code = e.nativeEvent.code;

        if (code.startsWith('Key')) {
            key = code.substring(3);
            if (!e.shiftKey) {
                key = key.toLowerCase();
            }
        }
        else if (code.startsWith('Digit')) {
            key = code.substring(5);
            if (e.shiftKey) {
                key += '\u0307';
            }
            if (e.ctrlKey) {
                key += '\u0323';
            }
        }
        else if (code === 'Space') {
            key = ' ';
        }
        else if (code === 'Period') {
            key = '·';
        }
        if (key) {
            displayStuff.setSelected(this.props.partIndex, this.props.phraseIndex, this.props.noteIndex);
            const success = piecesStore.currentPiece.setNote(key, this.props.partIndex, this.props.phraseIndex, this.props.noteIndex);
            if (success) {
                displayStuff.handleArrow('ArrowRight');
            }
            e.preventDefault();
        }
    }
    render() {
        const gamut = [' ', '·'].concat(gamelansStore.gamut(piecesStore.currentPiece.scale, this.props.part.instrument));
        const selected = this.props.partIndex === displayStuff.selectedPartIndex &&
                         this.props.phraseIndex === displayStuff.selectedPhraseIndex &&
                         this.props.noteIndex === displayStuff.selectedNoteIndex;
        const setNote = (e, x) => {
            e.preventDefault();
            displayStuff.setSelected(this.props.partIndex, this.props.phraseIndex, this.props.noteIndex);
            piecesStore.currentPiece.setNote(x, this.props.partIndex, this.props.phraseIndex, this.props.noteIndex);
            this.setState({
                menuIsVisible: false
            });
        };

        return (
            <div>
                <div
                    className={`note ${this.state.menuIsVisible ? 'active' : ''}`}
                    onClick={this.handleClick}
                    onContextMenu={this.handleContextMenu}
                    tabIndex={1}
                    ref={x => {
                        if (x && selected) {
                            x.focus();
                        }
                    }}
                    onKeyDown={this.handleKeyDown}
                    onKeyPress={this.handleKeyPress}
                >
                    {this.props.note}
                </div>
                <div>
                    {this.state.menuIsVisible &&
                        <div className="dropdownmenu">
                            {gamut.map((x, i) =>
                                <div
                                    className={`dropdownitem dropdownitemnote`}
                                    key={i}
                                    onClick={(e) => setNote(e, x)}
                                    onContextMenu={(e) => setNote(e, x)}
                                >
                                    {x}
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Note;
