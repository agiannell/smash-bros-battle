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
        const {fighter, length} = this.props;
        const {handleClick} = this;
        console.log(length)
        return (
            <section>
                {length !== 2
                ? (
                    <div onClick={handleClick}>
                        <img src={fighter.image} alt={fighter.name} />
                        <p>{fighter.name}</p>
                    </div>
                )
                : (
                    <div>
                        <img src={fighter.image} alt={fighter.name} />
                        <p>{fighter.name}</p>
                    </div>
                )}
            </section>
        )
    }
}

export default Queue;