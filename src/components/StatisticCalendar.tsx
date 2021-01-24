import moment from 'moment'
import { ResponsiveCalendar } from '@nivo/calendar'
import React from 'react'

export default function StatisticCalendar({data}) {
    return (
        <ResponsiveCalendar
            data={data}
            from={moment().startOf('year').toDate()}
            to={moment().toDate()}
            emptyColor="#eeeeee"
            colors={[ '#c5dcdd', '#a1b8c1', '#7c95a6', '#58718a', '#334d6e' ]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            monthBorderColor="#F9F9F9"
            dayBorderWidth={2}
            dayBorderColor="#F9F9F9"
            theme={{
                'fontSize': 14
            }}
            tooltip={(obj) =>
                <div className="nivo-tooltip"><b>{obj.day} :</b> {obj.value ? Math.floor(obj.value * 100) / 100 : 0} hours</div>
            }
        />
    )
}