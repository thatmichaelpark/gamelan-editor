import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import OpenDialog from './OpenDialog';
import SaveAsDialog from './SaveAsDialog';
import NewDialog from './NewDialog';
import ManagePartsDialog from './ManagePartsDialog';
import ManagePhrasesDialog from './ManagePhrasesDialog';
import ManagePiecesDialog from './ManagePiecesDialog';
import LoginDialog from './LoginDialog';
import './App.css';
import piecesStore from './stores/piecesStore';
import Part from './Part';
import DropdownMenu from './DropdownMenu';
import displayStuff from './stores/displayStuff';
import Boo from './Boo';
import account from './stores/accountStore';

import { observer } from 'mobx-react';

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
            managePiecesDialogIsVisible: false,
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
    showSaveAsDialog = () => {
        if (!account.isLoggedIn) {
            Boo.boo({ message: 'You must log in before saving'});
            return;
        }
        this.setState({ saveAsDialogIsVisible: true });
    }
    showManagePhrasesDialog = () => {
        if (piecesStore.currentPiece.parts.length === 0) {
            Boo.boo({ message: "Can't add phrases without parts"});
            return;
        }
        this.setState({ managePhrasesDialogIsVisible: true });
    }
    showManagePiecesDialog = () => {
        if (!account.isLoggedIn) {
            Boo.boo({ message: "Must be logged in"});
            return;
        }
        this.setState({ managePiecesDialogIsVisible: true });
    }
    handleSaveAs = (title) => {
        if (title !== null) {
            piecesStore.saveAs(title, () => {
                this.setState({ saveAsDialogIsVisible: false });
            });
        }
        else {
            this.setState({ saveAsDialogIsVisible: false });
        }
    }
    handleSave = () => {
        piecesStore.save();
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
    }
    handleManagePhrases = () => {
        this.setState({ managePhrasesDialogIsVisible: false });
    }
    handleManagePieces = () => {
        this.setState({ managePiecesDialogIsVisible: false });
    }
    handleLogin = () => {
        this.setState({ loginDialogIsVisible: false });
    }
    render() {
        const piece = piecesStore.currentPiece;
        const blah = () => {
            const phraseNames = piece.phraseInfos.map(info => info.name);

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
                            <div className='part'>
                                <div className='left'>

                                </div>
                                <div className='right-noborder'>
                                    <div className='phraseName'>
                                        {phraseInfo.name}
                                    </div>
                                </div>
                            </div>
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
                            { text: 'Save', action: this.handleSave, disabled: !(piecesStore.modified && piece.id && piece.userId === account.userId) },
                            { text: 'Save As', action: this.showSaveAsDialog},
                            { text: 'Manage', action: this.showManagePiecesDialog},
                        ]}
                    />
                    <div
                        className="dropdowntitle"
                        onClick={() => this.setState({ managePartsDialogIsVisible: true })}
                    >
                        Parts
                    </div>
                    <div
                        className="dropdowntitle"
                        onClick={this.showManagePhrasesDialog}
                    >
                        Phrases
                    </div>
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
                <h1>
                    {piece.title || 'Untitled'}
                    ({piece.scale})
                    {piecesStore.modified ? '*' : ''}
                    [{piece.id}]
                    [{piece.userId}]
                </h1>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {blah(piece)}
                </div>
                <OpenDialog isVisible={this.state.openDialogIsVisible} onOpen={this.handleOpen}/>
                <SaveAsDialog isVisible={this.state.saveAsDialogIsVisible} title={piece.title} onSave={this.handleSaveAs}/>
                <NewDialog isVisible={this.state.newDialogIsVisible} onNew={this.handleNew}/>
                <ManagePartsDialog isVisible={this.state.managePartsDialogIsVisible} scale={piece.scale} onManageParts={this.handleManageParts}/>
                <ManagePhrasesDialog isVisible={this.state.managePhrasesDialogIsVisible} onManagePhrases={this.handleManagePhrases}/>
                <ManagePiecesDialog isVisible={this.state.managePiecesDialogIsVisible} onManagePieces={this.handleManagePieces}/>
                <LoginDialog isVisible={this.state.loginDialogIsVisible} onLogin={this.handleLogin}/>
            </div>
        );
    }
}

export default withRouter(Main);
