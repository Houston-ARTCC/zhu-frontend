import React from 'react'
import moment from 'moment'
import { ResponsiveCalendar } from '@nivo/calendar'

export default function StatisticCalendar({data, height}) {
    return (
        <div className="nivo-calendar" style={{height: height}}>
            <ResponsiveCalendar
                data={data}
                from={moment().startOf('year').toDate()}
                to={moment().toDate()}
                emptyColor="#f0f0f0"
                colors={['#daebec', '#c4dee1', '#aed0d7', '#98c0cc', '#82b0c2', '#6c9eb8', '#558bad', '#497599', '#3e6184', '#334d6e']}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                monthBorderColor="#F9F9F9"
                dayBorderWidth={3}
                dayBorderColor="#F9F9F9"
                theme={{
                    'fontSize': 14
                }}
                tooltip={(obj) =>
                    <div className="nivo-tooltip"><b>{obj.day} :</b> {obj.value ? Math.floor(obj.value * 100) / 100 : 0} hours</div>
                }
            />
        </div>
    )
}
