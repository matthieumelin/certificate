import StatCard from '@/components/Dashboard/Cards/Stat';
import CertificatesChart from '@/components/Dashboard/Charts/Certificates';
import RevenueChart from '@/components/Dashboard/Charts/Revenue';
import useAuth from '@/contexts/AuthContext';
import type { MonthlyData } from '@/types/stat';
import routes from '@/utils/routes';
import { useState, type FC } from 'react'
import { Navigate } from 'react-router-dom';

interface Payment {
    id: string;
    amount: number;
    client_name: string;
    created_at: string;
    status: string;
}

interface DashboardStats {
    totalCertificates: number;
    activeClients: number;
    activePartners: number;
    recentPayments: Payment[];
    monthlyData: MonthlyData[];
}

const AdminDashboardPage: FC = () => {
    const { user } = useAuth();
    const [stats] = useState<DashboardStats>({
        totalCertificates: 0,
        activeClients: 0,
        activePartners: 0,
        recentPayments: [],
        monthlyData: [],
    });

    if (!user) {
        return <Navigate to={routes.Login} replace />
    }

    return (
        <div>
            <div className='p-5'>
                <h1 className='text-white text-2xl font-bold mb-6'>Administration</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    <StatCard
                        title="Certificats totaux"
                        value={stats.totalCertificates}
                        icon="📄"
                    />
                    <StatCard
                        title="Clients actifs"
                        value={stats.activeClients}
                        icon="👥"
                    />
                    <StatCard
                        title="Partenaires actifs"
                        value={stats.activePartners}
                        icon="🤝"
                    />
                    <StatCard
                        title="Revenus du mois"
                        value={`${stats.monthlyData[stats.monthlyData.length - 1]?.revenue || 0}€`}
                        icon="💰"
                    />
                    <StatCard
                        title="À reverser"
                        value={`${0}€`}
                        icon="💰"
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className='bg-dark p-5 rounded-xl border border-white/10'>
                        <h2 className='text-white text-xl font-semibold mb-4'>Volume mensuel de certificats</h2>
                        <CertificatesChart data={stats.monthlyData} />
                    </div>

                    <div className='bg-dark p-5 rounded-xl border border-white/10'>
                        <h2 className='text-white text-xl font-semibold mb-4'>Revenus mensuels</h2>
                        <RevenueChart data={stats.monthlyData} />
                    </div>
                </div>

                <div className='mt-6 bg-dark p-5 rounded-xl border border-white/10'>
                    <h2 className='text-white text-xl font-semibold mb-4'>Derniers paiements</h2>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b border-white/10'>
                                    <th className='text-left text-gray py-3'>Client</th>
                                    <th className='text-left text-gray py-3'>Montant</th>
                                    <th className='text-left text-gray py-3'>Date</th>
                                    <th className='text-left text-gray py-3'>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className='text-center text-gray py-4'>
                                            Aucun paiement récent
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recentPayments.map((payment) => (
                                        <tr key={payment.id} className='border-b border-white/10'>
                                            <td className='text-white py-3'>{payment.client_name}</td>
                                            <td className='text-white py-3'>{payment.amount}€</td>
                                            <td className='text-gray py-3'>
                                                {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className='py-3'>
                                                <span className={`px-2 py-1 rounded text-xs ${payment.status === 'completed'
                                                    ? 'bg-green/20 text-green'
                                                    : 'bg-yellow-500/20 text-yellow-500'
                                                    }`}>
                                                    {payment.status === 'completed' ? 'Complété' : 'En attente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage