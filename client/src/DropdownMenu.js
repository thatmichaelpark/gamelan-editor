import React from 'react';

class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsVisible: false
        };
    }
    handleClick = (e) => {
        this.setState({
            menuIsVisible: true
        });
        document.addEventListener('click', this.show);
    }
    show = () => {
        this.act();
    }
    act = (action) => {
        this.setState({
            menuIsVisible: false
        });
        document.removeEventListener('click', this.show);
        action && action();
    }
    render() {
        return (
            <div>
                <div
                    onClick={this.handleClick}
                    className={`dropdowntitle ${this.state.menuIsVisible ? 'active' : ''}`}
                >
                    {this.props.title}
                </div>
                {this.state.menuIsVisible &&
                    <div className="dropdownmenu">
                        {this.props.menuItems.map((m, i) =>
                            <div
                                className={`dropdownitem ${m.disabled ? 'disabled' : ''}`}
                                key={i}
                                onClick={!m.disabled && (() => this.act(m.action))}
                            >
                                {m.text}
                            </div>
                        )}
                    </div>
                }
            </div>
        )
    }
}

export default DropdownMenu;
