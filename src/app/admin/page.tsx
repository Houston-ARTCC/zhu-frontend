import { type NextPage } from 'next';
import { format } from 'date-fns-tz';
import { Card } from '@/components/Card';
import { fetchApi } from '@/utils/fetch';
import { type AdminStatistics } from '@/types/connections';

async function getAggregateStatistics(): Promise<AdminStatistics> {
    return fetchApi(
        '/connections/statistics/admin/',
        { next: { revalidate: 3600 } },
    );
}

const AdminHome: NextPage = async () => {
    const statistics = await getAggregateStatistics();

    return (
        <div className="grid grid-cols-2 gap-5">
            <Card>
                <h4 className="text-xl font-bold">{format(new Date(), 'MMMM')} Total</h4>
                <p>{statistics.month}</p>
            </Card>
            <Card>
                <h4 className="text-xl font-bold">{format(new Date(), 'y')} Total</h4>
                <p>{statistics.year}</p>
            </Card>
        </div>
    );
};

export default AdminHome;
