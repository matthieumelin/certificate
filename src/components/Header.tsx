import { type FC } from 'react'

const Header: FC = () => {
    return (
        <header>
            <nav className='p-5'>
                <img className='block max-w-[60px]' src="./logo.png" alt="Certificate" />
            </nav>
        </header>
    )
}

export default Header