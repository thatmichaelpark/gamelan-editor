import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import OpenDialog from './OpenDialog';
import SaveAsDialog from './SaveAsDialog';
import NewDialog from './NewDialog';
import ManagePartsDialog from './ManagePartsDialog';
import ManagePhrasesDialog from './ManagePhrasesDialog';
import ManagePhrasePlaylistDialog from './ManagePhrasePlaylistDialog';
import ManagePiecesDialog from './ManagePiecesDialog';
import LoginDialog from './LoginDialog';
import './App.css';
import { currentPiece, piecesStore } from './stores/piecesStore';
import Part from './Part';
import DropdownMenu from './DropdownMenu';
import displayStuff from './stores/displayStuff';
import Boo from './Boo';
import account from './stores/accountStore';
import InstrumentLoadingProgress from './InstrumentLoadingProgress';
import Transport from './Transport';
import beatStore from './stores/beatStore';

import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

class EditMode {
    @observable editMode = account.isLoggedIn; 
    
    toggle() {
        this.editMode = !this.editMode;
    }
    @computed get isEdit() {
        return account.isLoggedIn ? this.editMode : false;
    }
    @computed get isPlay() {
        return !this.isEdit;
    }
}

const editMode = new EditMode();

@observer
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialogIsVisible: false,
            saveAsDialogIsVisible: false,
            newDialogIsVisible: false,
            managePartsDialogIsVisible: false,
            managePhrasesDialogIsVisible: false,
            managePhrasePlaylistDialogIsVisible: false,
            managePiecesDialogIsVisible: false,
            loginDialogIsVisible: false,
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
        if (id) {
            piecesStore.open(id)
            .then(() => {
                this.setState({ openDialogIsVisible: false });
            })
            .catch(Boo.boo);
        }
        else {
            this.setState({ openDialogIsVisible: false });
        }
    }
    showSaveAsDialog = () => {
        if (!account.isLoggedIn) {
            Boo.boo({ message: 'You must log in before saving'});
            return;
        }
        this.setState({ saveAsDialogIsVisible: true });
    }
    showManagePhrasesDialog = () => {
        if (currentPiece.parts.length === 0) {
            Boo.boo({ message: "Can't add phrases without parts"});
            return;
        }
        this.setState({ managePhrasesDialogIsVisible: true });
    }
    showManagePhrasePlaylistDialog = () => {
        if (currentPiece.phraseInfos.length === 0) {
            Boo.boo({ message: "Add some phrases first"});
            return;
        }
        this.setState({ managePhrasePlaylistDialogIsVisible: true });
    }
    showManagePiecesDialog = () => {
        if (!account.isLoggedIn) {
            Boo.boo({ message: "Must be logged in"});
            return;
        }
        this.setState({ managePiecesDialogIsVisible: true });
    }
    handlePlay = () => {
        beatStore.nBeats = currentPiece.assignBeats();
        beatStore.start();
    }
    toggleEditMode = () => {
        editMode.toggle();
    }
    handleSaveAs = (title) => {
        if (title !== null) {
            if (!title.trim()) {
                Boo.boo({ message: "Title cannot be blank"});
                return;
            }
            piecesStore.saveAs(title)
            .then(() => {
                this.setState({ saveAsDialogIsVisible: false });
            })
            .catch(Boo.boo);
        }
        else {
            this.setState({ saveAsDialogIsVisible: false });
        }
    }
    handleSave = () => {
        piecesStore.save().catch(Boo.boo);
    }
    handleNew = (data) => {
        this.setState({
            newDialogIsVisible: false
        });
        if (data) {
            piecesStore.new(data.title, data.scale);
        }
    }
    handleManageParts = () => {
        this.setState({ managePartsDialogIsVisible: false });
        // list of parts might have changed, so go through the parts
        // and load instruments (already-loaded instruments aren't reloaded)
        currentPiece.loadInstruments();
    }
    handleManagePhrases = () => {
        this.setState({ managePhrasesDialogIsVisible: false });
        currentPiece.updatePhrases();
    }
    handleManagePhrasePlaylist = () => {
        this.setState({ managePhrasePlaylistDialogIsVisible: false });
    }
    handleManagePieces = () => {
        this.setState({ managePiecesDialogIsVisible: false });
    }
    handleLogin = () => {
        this.setState({ loginDialogIsVisible: false });
    }
    render() {
        const blah = () => {
            const phraseNames = currentPiece.phraseInfos.map(info => info.name);

            if (displayStuff.displayMode === 'compact') {
                return (
                    <div>
                        {phraseNames.length > 0 && <div className="part">
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
                        </div>}
                        {currentPiece.parts.map((part, i) =>
                            <Part key={i} part={part} partIndex={i} displayMode='compact' phraseIndex={displayStuff.displayPhraseIndex}/>
                        )}
                    </div>
                );
            }
            else if (displayStuff.displayMode === 'byParts') {
                return (
                    currentPiece.parts.map((part, i) =>
                        <Part key={i} part={part} partIndex={i} displayMode='byParts' phraseNames={phraseNames}/>
                    )
                );
            }
            else { // byPhrases
                return (
                    currentPiece.phraseInfos.map((phraseInfo, i) =>
                        <div key={i}>
                            <div className='part'>
                                <div className='left'>

                                </div>
                                <div className='right-noborder'>
                                    <div className='phraseName'>
                                        {phraseInfo.name}
                                    </div>
                                </div>
                            </div>
                            {currentPiece.parts.map((part, idx) =>
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
                            { text: 'New', action: () => this.setState({ newDialogIsVisible: true }), disabled: editMode.isPlay},
                            { text: 'Open', action: () => this.setState({ openDialogIsVisible: true })},
                            { text: 'Save', action: this.handleSave, disabled: !(piecesStore.modified && currentPiece.id && currentPiece.userId === account.userId) },
                            { text: 'Save As', action: this.showSaveAsDialog, disabled: editMode.isPlay},
                            { text: 'Manage', action: this.showManagePiecesDialog, disabled: editMode.isPlay},
                        ]}
                    />
                    <div
                        className={'dropdowntitle' + (editMode.isPlay ? ' disabled' : '')}
                        onClick={editMode.isEdit && (() => this.setState({ managePartsDialogIsVisible: true }))}
                    >
                        Parts
                    </div>
                    <div
                        className={'dropdowntitle' + (editMode.isPlay ? ' disabled' : '')}
                        onClick={editMode.isEdit && this.showManagePhrasesDialog}
                    >
                        Phrases
                    </div>
                    <div
                        className={'dropdowntitle' + (editMode.isPlay ? ' disabled' : '')}
                        onClick={editMode.isEdit && this.showManagePhrasePlaylistDialog}
                    >
                        PhrasePlaylist
                    </div>
                    <DropdownMenu
                        title="View"
                        menuItems={[
                            { text: 'By Parts', action: () => displayStuff.setDisplayMode('byParts')},
                            { text: 'By Phrases', action: () => displayStuff.setDisplayMode('byPhrases')},
                            { text: 'Compact', action: () => displayStuff.setDisplayMode('compact')},
                        ]}
                    />
                    <div
                        className={'dropdowntitle' + (editMode.isPlay && !account.isLoggedIn ? ' disabled' : '')}
                        onClick={this.toggleEditMode}
                    >
                        {editMode.isEdit ? 'Play' : 'Edit'}
                    </div>
                    {/* <DropdownMenu
                        title="Play"
                        menuItems={[
                            { text: 'Play', action: this.handlePlay},
                            { text: 'Pause', action: beatStore.pause},
                            { text: 'Stop', action: beatStore.stop},
                        ]}
                    /> */}
                    {account.isLoggedIn ? (
                        <div
                            className="dropdowntitle pinright"
                            onClick={() => account.logOut()
                                .then(() => Boo.yeah(`Logged out`))
                                .catch(Boo.boo)
                            }
                        >
                            Log {account.name} Out
                        </div>
                    ) : (
                        <div
                            className="dropdowntitle pinright"
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
                <h1>
                    {currentPiece.title || 'Untitled'}
                    ({currentPiece.scale})
                    {piecesStore.modified ? '*' : ''}
                    [{currentPiece.id}]
                    [{currentPiece.userId}]
                </h1>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: '100px'
                    }}
                >
                    {blah(currentPiece)}
                </div>
                {<Transport isVisible={editMode.isPlay} onPlay={this.handlePlay} onPause={beatStore.pause} onStop={beatStore.stop}/>}
                <OpenDialog isVisible={this.state.openDialogIsVisible} onOpen={this.handleOpen}/>
                <SaveAsDialog isVisible={this.state.saveAsDialogIsVisible} title={currentPiece.title} onSave={this.handleSaveAs}/>
                <NewDialog isVisible={this.state.newDialogIsVisible} onNew={this.handleNew}/>
                <ManagePartsDialog isVisible={this.state.managePartsDialogIsVisible} scale={currentPiece.scale} onManageParts={this.handleManageParts}/>
                <ManagePhrasesDialog isVisible={this.state.managePhrasesDialogIsVisible} onManagePhrases={this.handleManagePhrases}/>
                <ManagePhrasePlaylistDialog isVisible={this.state.managePhrasePlaylistDialogIsVisible} onManagePhrasePlaylist={this.handleManagePhrasePlaylist}/>
                <ManagePiecesDialog isVisible={this.state.managePiecesDialogIsVisible} onManagePieces={this.handleManagePieces}/>
                <LoginDialog isVisible={this.state.loginDialogIsVisible} onLogin={this.handleLogin}/>
                <InstrumentLoadingProgress/>
            </div>
        );
    }
}

export default withRouter(Main);
