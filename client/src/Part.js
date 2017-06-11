import React from 'react';
import { observer } from 'mobx-react';
import Note from './Note';

@observer
class Part extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         partMenuIsVisible: false,
    //         x: 0,
    //         y: 0
    //     };
    // }
    // handleClick = (e) => {
    //     console.log(e.clientX, e.clientY);
    //     this.setState({
    //         partMenuIsVisible: true,
    //         x: e.pageX,
    //         y: e.pageY
    //     });
    // }
    // handleMenu = (x) => {
    //     this.setState({
    //         partMenuIsVisible: false
    //     });
    // }
    // handleCheck = (e) => {
    //
    // }
    render() {
        const part = this.props.part;
        const phrases = this.props.displayMode === 'byParts' ?
            part.phrases
                :
            [part.phrases.length ? part.phrases[this.props.phraseIndex] : []];

        return (
            <div>
                <div className="part">
                    <div className="left">
                        {part.instrument}
                        {/* <input type="checkbox" onChange={this.handleCheck} checked={part.muteSolo === 'solo'}/>
                        <input type="checkbox" onChange={this.handleCheck} checked={part.muteSolo === 'mute'}/> */}
                    </div>
                    <div className="right">
                        {phrases.map((phrase, phraseIndex) =>
                            <div key={phraseIndex}>
                                <div className="phraseName">
                                    {this.props.displayMode === 'byParts' && this.props.phraseNames[phraseIndex]}
                                </div>
                                {phrase.map((hand, handIndex) =>
                                    <div className="notes" key={handIndex}>
                                        {hand.map((note, noteIndex) =>
                                            <Note
                                                key={noteIndex}
                                                note={note}
                                                handIndex={handIndex}
                                                noteIndex={noteIndex}
                                                part={part}
                                                partIndex={this.props.partIndex}
                                                phraseIndex={this.props.phraseIndex === undefined ? phraseIndex : this.props.phraseIndex}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default Part;
