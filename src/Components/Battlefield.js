import Contenders from './Contenders'

const Battlefield = (props) => {
    const {contenders, editNameFn, replaceFn} = props
    return (
        <section>
            <h1>Battlefield</h1>
            <div className='battlefield'>
                {contenders.map((e, i) => (
                    <Contenders
                        key={i}
                        contender={e}
                        length={contenders.length}
                        editNameFn={editNameFn}
                        replaceFn={replaceFn} />
                ))}
            </div>
        </section>
    )
}

export default Battlefield;