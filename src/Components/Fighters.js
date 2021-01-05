import Queue from './Queue'

const Fighters = (props) => {
    const {allFighters, chooseFn, length, clearFn} = props;
    // console.log(allFighters);
    return (
        <section>
            {length !== 2
                ? (<h1 className='choose'>Choose Your Character!</h1>)
                : (<button className='reset' onClick={clearFn}>Reset Battlefield</button>)
            }
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

export default Fighters;