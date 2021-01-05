import Queue from './Queue'

const Fighters = (props) => {
    const {randFighters, chooseFn, length, clearFn} = props;
    // console.log(randFighters);
    return (
        <section>
            {length !== 2
                ? (<h2 className='choose'>Choose Your Character!</h2>)
                : (<button className='reset' onClick={clearFn}>Reset Battlefield</button>)
            }
            <div className='queue flyUp'>
                {randFighters.map((e, i) => (
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

export default Fighters;