const DrawHeader = (props) => {
    const {clearFn} = props
    return (
        <header className='draw fadeIn'>
            <button className='close' onClick={clearFn}>x</button>
            <h1>Draw!</h1>
        </header>
    )
}

export default DrawHeader