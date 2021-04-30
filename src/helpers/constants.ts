import moment from 'moment'

export const tuiCalendars = [
    {
        id: '0',
        name: 'Events',
        bgColor: '#109CF1',
        borderColor: '#157fbe'
    },
    {
        id: '1',
        name: 'Training Sessions',
        bgColor: '#f7685b',
        borderColor: '#cb4f40'
    },
    {
        id: '2',
        name: 'Training Requests',
        bgColor: '#b0b0b0',
        borderColor: '#9f9f9f'
    },
    {
        id: '3',
        name: 'Controller Bookings',
        bgColor: '#75d65a',
        borderColor: '#59ba3c'
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
    'week.today.backgroundColor': 'rgba(16, 156, 241, 0.1)',
    'week.currentTime.color': '#109CF1',
    'week.currentTimeLinePast.border': '1px dashed #109CF1',
    'week.currentTimeLineBullet.backgroundColor': '#109CF1',
    'week.currentTimeLineToday.border': '1px solid #109CF1',
    'week.creationGuide.color': '#109CF1',
    'common.backgroundColor': 'transparent',
    'common.todayColor': 'black',
    'common.creationGuide.backgroundColor': 'rgba(16, 156, 241, 0.1)',
    'common.creationGuide.border': '1px solid #109CF1',
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
            borderBottomColor: '#e5e5e5!important',
            '&:hover': {
                backgroundColor: '#e5e5e5!important',
                outline: 'none!important'
            },
        },
    },
    headRow: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    pagination: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    header: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    noData: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    expanderRow: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    progress: {
        style: {
            backgroundColor: 'transparent',
        },
    }
}

export const roleOptions = [
    {
        "value": "ATM",
        "label": "Air Traffic Manager"
    },
    {
        "value": "DATM",
        "label": "Deputy Air Traffic Manager"
    },
    {
        "value": "TA",
        "label": "Training Administrator"
    },
    {
        "value": "ATA",
        "label": "Assistant Training Administrator"
    },
    {
        "value": "FE",
        "label": "Facility Engineer"
    },
    {
        "value": "AFE",
        "label": "Assistant Facility Engineer"
    },
    {
        "value": "EC",
        "label": "Events Coordinator"
    },
    {
        "value": "AEC",
        "label": "Assistant Events Coordinator"
    },
    {
        "value": "WM",
        "label": "Webmaster"
    },
    {
        "value": "AWM",
        "label": "Assistant Webmaster"
    },
    {
        "value": "INS",
        "label": "Instructor"
    },
    {
        "value": "MTR",
        "label": "Mentor"
    },
    {
        "value": "WEB",
        "label": "Web Team"
    },
    {
        "value": "HC",
        "label": "Home Controller"
    },
    {
        "value": "VC",
        "label": "Visiting Controller"
    },
    {
        "value": "MC",
        "label": "MAVP Controller"
    }
]
