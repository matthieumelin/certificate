import { type FC } from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout: FC = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout