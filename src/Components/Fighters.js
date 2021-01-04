import Queue from './Queue'

const Fighters = (props) => {
    const {allFighters, chooseFn, length} = props;
    // console.log(allFighters);
    return (
        <section>
            {length !== 2
                ? (<h1 className='choose'>Choose Your Character!</h1>)
                : (null)
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