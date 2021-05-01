import { ResponsiveCalendar } from '@nivo/calendar'
import { getTheme } from '../helpers/themeManager'

export default function StatisticCalendar({ data, height, vertical }) {
    return (
        <div className="nivo-calendar" style={{ height: height }}>
            <ResponsiveCalendar
                data={data}
                direction={vertical ? 'vertical' : 'horizontal'}
                from={new Date(new Date().getFullYear(), 0, 1)}
                to={new Date()}
                emptyColor={getTheme() === 'dark' ? '#2f2f32' : '#f0f0f0'}
                colors={getTheme() === 'dark'
                    ? ['#393c4f', '#3c445f', '#3e4d71', '#3e5884', '#3e6598', '#3c76ad', '#388ac4', '#3f9fd2', '#47b4dc', '#51c8e6']
                    : ['#daebec', '#c4dee1', '#aed0d7', '#98c0cc', '#82b0c2', '#6c9eb8', '#558bad', '#497599', '#3e6184', '#334d6e']
                }
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                monthBorderColor={getTheme() === 'dark' ? '#212124' : '#F9F9F9'}
                dayBorderWidth={3}
                dayBorderColor={getTheme() === 'dark' ? '#212124' : '#F9F9F9'}
                theme={{ 'fontSize': 14 }}
                tooltip={(obj) => <div className="nivo-tooltip"><b>{obj.day} :</b> {obj.value ? Math.floor(obj.value * 100) / 100 : 0} hours</div>}
            />
        </div>
    )
}
