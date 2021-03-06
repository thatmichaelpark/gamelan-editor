import React from 'react';
import { observer } from 'mobx-react';
import gamelansStore from './stores/gamelansStore';
import { currentPiece } from './stores/piecesStore';
import displayStuff from './stores/displayStuff';
import beatStore from './stores/beatStore';

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
        displayStuff.setSelected(this.props.partIndex, this.props.phraseIndex, this.props.handIndex, this.props.noteIndex);
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
            key = '·'; // n.b. not actually a period
        }
        else if (code === 'Comma') {
            key = ',';
        }
        else if (code === 'Equal' && e.shiftKey) {
            key = '+';
        }
        if (key) {
            const { partIndex, phraseIndex, handIndex, noteIndex } = this.props;
            displayStuff.setSelected(partIndex, phraseIndex, handIndex, noteIndex);
            const success = currentPiece.setNote(key, partIndex, phraseIndex, handIndex, noteIndex);
            if (success) {
                displayStuff.handleArrow('ArrowRight');
            }
            e.preventDefault();
        }
    }
    render() {
        const gamut = [' ', '·'].concat(gamelansStore.gamut(currentPiece.scale, this.props.part.instrument));
        const { part, partIndex, phraseIndex, handIndex, noteIndex, note } = this.props;
        const selected = partIndex === displayStuff.selectedPartIndex &&
                         phraseIndex === displayStuff.selectedPhraseIndex &&
                         handIndex === displayStuff.selectedHandIndex &&
                         noteIndex === displayStuff.selectedNoteIndex;
        const setNote = (e, x) => {
            e.preventDefault();
            displayStuff.setSelected(partIndex, phraseIndex, handIndex, noteIndex);
            currentPiece.setNote(x, partIndex, phraseIndex, handIndex, noteIndex);
            this.setState({
                menuIsVisible: false
            });
        };
        let classes = 'note';
        if (this.state.menuIsVisible) {
            classes += ' active';
        }
        if (part.beatsArray && part.beatsArray.length > 0 && part.beatsArray[phraseIndex][noteIndex].indexOf(beatStore.beat) >= 0) {
            classes += note === ' ' || note === '·' || note === ',' ? '' : ' flash';
        }
        return (
            <div>
                <div
                    className={classes}
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
                    {note}
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
