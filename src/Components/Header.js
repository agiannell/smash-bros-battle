import {Component} from 'react'
import axios from 'axios';
import Menu from './Menu'
import logo from '../img/smash-logo-white.svg'

class Header extends Component {
    constructor() {
        super();
        this.state = {
            showMenu: false,
            showAllFighters: false,
            allFighters: []
        }
    }

    componentDidMount() {
        this.getAllFighters()
    }

    getAllFighters = () => {
        axios.get('/api/all-fighters')
            .then(res => {
                this.setState({allFighters: res.data});
            })
            .catch(err => console.log(err));
    }

    toggleMenu = () => {
        if (this.state.showMenu === false) {
            this.setState({showMenu: true})
        }else {
            this.setState({
                showMenu: false,
                showAllFighters: false
            })
        }
    }

    toggleAllFighters = () => {
        if (this.state.showAllFighters === false) {
            this.setState({showAllFighters: true})
        }else {
            this.setState({showAllFighters: false})
        }
    }

    render() {
        const {showMenu, showAllFighters, allFighters} = this.state
        const {toggleAllFighters} = this
        return (
            <header className='default'>
                <img src={logo} alt="logo" />
                <button className='menu' onClick={this.toggleMenu}></button>
                {showMenu === true
                    ? (
                        <Menu 
                            allFighters={allFighters[0]}
                            showFighters={showAllFighters}
                            toggleFn={toggleAllFighters} />
                    )
                    : (null)}
            </header>
        )
    }
}

export default Header