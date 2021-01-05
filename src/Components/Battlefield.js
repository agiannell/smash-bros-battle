import Contenders from './Contenders'

const Battlefield = (props) => {
    const {contenders, editNameFn, replaceFn, battleFn} = props
    return (
        <section className='battlefield'>
            <div className='battlefield-div'>
                {contenders.map((e, i) => (
                    <Contenders
                        key={i}
                        contender={e}
                        length={contenders.length}
                        editNameFn={editNameFn}
                        replaceFn={replaceFn} />
                ))}
            </div>
            {contenders.length === 2
                ? (
                    <div 
                        className='battle-button fadeInDelay'
                        onClick={battleFn}></div>
                )
                : (null)}
            {/* <div className='feather'></div> */}
        </section>
    )
}

export default Battlefield;