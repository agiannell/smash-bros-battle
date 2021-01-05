import AllFighters from './AllFighters'

const Menu = (props) => {
    const {showFighters, toggleFn, allFighters} = props
    return (
        <nav className='growIn'>
            <button onClick={toggleFn}>See All Characters</button>
            {showFighters === true
                ? (
                    <AllFighters
                        allFighters={allFighters} />
                )
                : (null)}
        </nav>
    )
}

export default Menu