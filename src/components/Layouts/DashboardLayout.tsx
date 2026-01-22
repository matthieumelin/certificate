import Sidebar from '@/components/Dashboard/Sidebar'
import { type FC } from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout: FC = () => {
    return (
        <div className='min-h-screen bg-[#050a08] lg:grid grid-cols-[280px_1fr]'>
            <Sidebar />

            <main className='lg:overflow-y-auto lg:h-screen'>
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout