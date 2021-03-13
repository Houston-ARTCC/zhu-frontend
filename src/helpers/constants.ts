import moment from 'moment'

export const tuiCalendars = [
    {
        id: '0',
        name: 'Events',
        bgColor: '#334d6e',
        borderColor: '#233b56'
    },
    {
        id: '1',
        name: 'Training Sessions',
        bgColor: '#f7685b',
        borderColor: '#F7685B'
    },
    {
        id: '2',
        name: 'Training Requests',
        bgColor: '#949494',
        borderColor: '#7e7e7e'
    },
]

export const tuiTimezones = [
    {
        timezoneName: moment.tz.guess(),
        displayLabel: moment.tz.zone(moment.tz.guess())?.abbr(moment().valueOf()),
        tooltip: 'Local',
    }, {
        timezoneName: 'UTC',
        displayLabel: 'UTC',
        tooltip: 'UTC'
    }
]

export const tuiTemplates = {
    'popupDetailDate': (isAllDay, start, end) => {
        let tz = moment.tz.guess()
        // @ts-ignore
        let momentStart = moment(start.toDate()).tz(tz)
        // @ts-ignore
        let momentEnd = moment(end.toDate()).tz(tz)
        // @ts-ignore
        let isSameDate = momentStart.date() === momentEnd.date()

        return moment(momentStart).format('MMM. DD, YYYY, HH:mm z') + ' → ' +
            moment(momentEnd).format((isSameDate ? '' : 'MMM DD, YYYY, ') + 'HH:mm z')
    },
}

export const tuiTheme = {
    'common.backgroundColor': 'transparent',
    'common.todayColor': 'black'
}

export const dataTableStyle = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    rows: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headRow: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'transparent'
        }
    },
}
