import {Component} from 'react';

class Queue extends Component {
    handleClick = () => {
        const {fighter, chooseFn} = this.props,
            hp = Math.ceil(Math.random() * 49 + 50);

        let contender = {
            name: fighter.name,
            image: fighter.image,
            hp: hp
        }

        chooseFn(contender);
    }
    
    render() {
        const {fighter, length} = this.props;
        const {handleClick} = this;
        // console.log(length)
        return (
            <section>
                {length < 2
                    ? (
                        <section>
                            <div onClick={handleClick}>
                                <img src={fighter.image} alt={fighter.name} />
                                <p>{fighter.name}</p>
                            </div>
                        </section>
                    )
                    : (null)}
            </section>
        )
    }
}

export default Queue;