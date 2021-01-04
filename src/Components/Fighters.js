import {Component} from 'react';
import axios from 'axios';

class Fighters extends Component {
    constructor() {
        super();
        this.state = {
            allFighters: []
        }
    }

    componentDidMount() {

    }

    getFighters = () => {
        axios.get('/api/fighters')
            .then(res => {
                this.setState({allFighters: res.data})
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <section>
                <h1>Fighters</h1>
            </section>
        )
    }
}

export default Fighters;