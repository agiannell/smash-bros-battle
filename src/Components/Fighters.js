import Queue from './Queue'

const Fighters = (props) => {
    const {randFighters, chooseFn, length, clearFn} = props;

    let title;

    if (length === 0) {
        title = <h2 className='choose hidden'>Choose Your Character!</h2>;
    }else if (length === 1) {
        title = <h2 className='choose fadeIn'>Choose Your Character!</h2>
    }else {
        title = <button className='reset fadeInDelay' onClick={clearFn}>Reset Battlefield</button>
    }
    return (
        <section>
            { title }
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