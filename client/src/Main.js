import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import OpenDialog from './OpenDialog';
import SaveDialog from './SaveDialog';
import NewDialog from './NewDialog';
import AddPartDialog from './AddPartDialog';
import AddPhraseDialog from './AddPhraseDialog';
import LoginDialog from './LoginDialog';
import './App.css';
import piecesStore from './stores/piecesStore';
import Part from './Part';
import DropdownMenu from './DropdownMenu';
import displayStuff from './stores/displayStuff';
// import Boo from './Boo';
import account from './stores/accountStore';

import { observer } from 'mobx-react';

@observer
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialogIsVisible: false,
            saveDialogIsVisible: false,
            newDialogIsVisible: false,
            addPartDialogIsVisible: false,
            addPhraseDialogIsVisible: false,
            loginDialogIsVisible: false
        }
    }
    handleClick = (e) => {
        this.setState({
            [`${e.target.name}DialogIsVisible`]: true
        });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleOpen = (id) => {
        this.setState({
            openDialogIsVisible: false
        });
        if (id) {
            piecesStore.open(id);
        }
    }
    handleSave = (title) => {
        this.setState({
            saveDialogIsVisible: false
        });
        if (title) {
            piecesStore.save(title);
        }
    }
    handleNew = (data) => {
        this.setState({
            newDialogIsVisible: false
        });
        if (data) {
            piecesStore.new(data.title, data.scale);
        }
    }
    handleAddPart = (instrument) => {
        this.setState({
            addPartDialogIsVisible: false
        });
        if (instrument) {
            const { currentPiece } = piecesStore;
            const partIndex = currentPiece.parts.length; // index of new part
            currentPiece.addPart(instrument);
            if (partIndex) {
                currentPiece.parts[partIndex].phrases = currentPiece.parts[0].phrases.map(phrase =>
                    Array(phrase.length).fill(' ')
                );
            }
        }
    }
    handleAddPhrase = (data) => {
        this.setState({
            addPhraseDialogIsVisible: false
        });
        if (data) {
            piecesStore.currentPiece.addPhrase(data.name, +data.length);
        }
        displayStuff.setPhraseIndex(piecesStore.currentPiece.phraseInfos.length - 1);
    }
    handleLogin = () => {
        this.setState({
            loginDialogIsVisible: false
        });
    }
    render() {
        const piece = piecesStore.currentPiece;
        const blah = () => {
            const phraseNames = piece.phraseInfos.map(info => info.name);

            if (displayStuff.displayMode === 'compact') {
                return (
                    <div>
                        <div className="part">
                            <div className="left">
                            </div>
                            <div className="right-noborder">
                                <select
                                    onChange={(e) => displayStuff.setDisplayPhraseIndex(e.target.value)}
                                    value={displayStuff.displayPhraseIndex}
                                >
                                    {phraseNames.map((name, i) =>
                                        <option key={i} value={i}>{name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        {piece.parts.map((part, i) =>
                            <Part key={i} part={part} partIndex={i} displayMode='compact' phraseIndex={displayStuff.displayPhraseIndex}/>
                        )}
                    </div>
                );
            }
            else if (displayStuff.displayMode === 'byParts') {
                return (
                    piece.parts.map((part, i) =>
                        <Part key={i} part={part} partIndex={i} displayMode='byParts' phraseNames={phraseNames}/>
                    )
                );
            }
            else { // byPhrases
                return (
                    piece.phraseInfos.map((phraseInfo, i) =>
                        <div key={i}>
                            {phraseInfo.name}
                            {piece.parts.map((part, idx) =>
                                <Part key={idx} part={part} partIndex={idx} displayMode='compact' phraseIndex={i}/>
                            )}
                        </div>
                    )
                );
            }
        }

        return (
            <div>
                <div className="menubar">
                    <DropdownMenu
                        title="Piece"
                        menuItems={[
                            { text: 'New', action: () => this.setState({ newDialogIsVisible: true })},
                            { text: 'Open', action: () => this.setState({ openDialogIsVisible: true })},
                            { text: 'Save', action: () => this.setState({ saveDialogIsVisible: true }), disabled: true },
                            { text: 'Save As', action: () => this.setState({ saveDialogIsVisible: true })},
                        ]}
                    />
                    <DropdownMenu
                        title="Part"
                        menuItems={[
                            { text: 'New', action: () => this.setState({ addPartDialogIsVisible: true })}
                        ]}
                    />
                    <DropdownMenu
                        title="Phrase"
                        menuItems={[
                            { text: 'New', action: () => this.setState({ addPhraseDialogIsVisible: true }), disabled: piece.parts.length === 0 }
                        ]}
                    />
                    <DropdownMenu
                        title="View"
                        menuItems={[
                            { text: 'By Parts', action: () => displayStuff.setDisplayMode('byParts')},
                            { text: 'By Phrases', action: () => displayStuff.setDisplayMode('byPhrases')},
                            { text: 'Compact', action: () => displayStuff.setDisplayMode('compact')},
                        ]}
                    />
                    {account.isLoggedIn ? (
                        <div
                            className="dropdowntitle"
                            onClick={() => account.logOut()}
                        >
                            Log {account.name} Out
                        </div>
                    ) : (
                        <div
                            className="dropdowntitle"
                            onClick={() => this.setState({ loginDialogIsVisible: true })}
                        >
                            Log In
                        </div>
                    )}
                    {account.isAdmin && (
                        <div className="dropdowntitle">
                            <Link to="/admin">Admin</Link>
                        </div>
                    )}
                </div>
                <h1>{piece.title || 'Untitled'} ({piece.scale})</h1>
                <div
                    style={{
                        width: '50%',
                        margin: '0 auto'
                    }}
                >
                    {blah(piece)}
                </div>
                <OpenDialog isVisible={this.state.openDialogIsVisible} onOpen={this.handleOpen}/>
                <SaveDialog isVisible={this.state.saveDialogIsVisible} title={piece.title} onSave={this.handleSave}/>
                <NewDialog isVisible={this.state.newDialogIsVisible} onNew={this.handleNew}/>
                <AddPartDialog isVisible={this.state.addPartDialogIsVisible} scale={piece.scale} onAddPart={this.handleAddPart}/>
                <AddPhraseDialog isVisible={this.state.addPhraseDialogIsVisible} onAddPhrase={this.handleAddPhrase}/>
                <LoginDialog isVisible={this.state.loginDialogIsVisible} onLogin={this.handleLogin}/>
            </div>
        );
    }
}

export default withRouter(Main);
