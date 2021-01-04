import {Component} from 'react';
import Queue from './Queue'
import axios from 'axios';

class Fighters extends Component {
    constructor() {
        super();
        this.state = {
            allFighters: []
        }
    }

    componentDidMount() {
        this.getFighters()
    }

    getFighters = () => {
        axios.get('/api/fighters')
            .then(res => {
                this.setState({allFighters: res.data})
            })
            .catch(err => console.log(err));
    }

    render() {
        console.log(this.state.allFighters);
        const {allFighters} = this.state;
        const {chooseFn, length} = this.props;
        return (
            <section>
                <h1>Choose Your Character!</h1>
                <div className='queue'>
                    {allFighters.map((e, i) => (
                        <Queue
                            key={i}
                            fighter={e}
                            chooseFn={chooseFn}
                            length={length} />
                    ))}
                </div>    
            </section>
        )
    }
}

export default Fighters;