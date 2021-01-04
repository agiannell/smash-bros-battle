import {Component} from 'react';

class Queue extends Component {
    handleClick = () => {
        const {fighter, chooseFn} = this.props;
        let contender = {
            name: fighter.name,
            image: fighter.image,
            hp: fighter.hp
        }

        chooseFn(contender);
    }
    
    render() {
        const {fighter} = this.props;
        const {handleClick} = this;
        return (
            <section onClick={handleClick}>
                <img src={fighter.image} alt={fighter.name} />
                <p>{fighter.name}</p>
            </section>
        )
    }
}

export default Queue;