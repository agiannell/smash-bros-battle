const WinHeader = (props) => {
    const {name, clearFn} = props
    return (
        <header className='winner fadeIn'>
            <button className='close' onClick={clearFn}></button>
            <h1>{name} wins!</h1>
        </header>
    )
}

export default WinHeader