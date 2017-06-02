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
    render() {
        const gamut = [' ', '·'].concat(gamelansStore.gamut(piecesStore.currentPiece.scale, this.props.part.instrument));
        const selected = this.props.partIndex === displayStuff.selectedPartIndex &&
                         this.props.phraseIndex === displayStuff.selectedPhraseIndex &&
                         this.props.noteIndex === displayStuff.selectedNoteIndex;
        const setNote = (e, x) => {
            e.preventDefault();
            piecesStore.currentPiece.setNote(x, displayStuff.selectedPartIndex, displayStuff.selectedPhraseIndex, displayStuff.selectedNoteIndex);
            this.setState({
                menuIsVisible: false
            });
        };

        return (
            <div>
                <div
                    className={`note ${this.state.menuIsVisible ? 'active' : ''} ${selected ? 'selected' : ''}`}
                    onClick={this.handleClick}
                    onContextMenu={this.handleContextMenu}
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
