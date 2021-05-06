import { format } from 'date-fns-tz'
import { RiArrowRightCircleFill, RiCheckboxCircleFill, RiCloseCircleFill, RiIndeterminateCircleFill } from 'react-icons/all'

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
        timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
        displayLabel: format(new Date(), 'zzz'),
        tooltip: 'Local',
    }, {
        timezoneName: 'UTC',
        displayLabel: 'UTC',
        tooltip: 'UTC'
    }
]

export const tuiTemplates = {
    'popupDetailDate': (isAllDay, start, end) => {
        let isSameDate = start.toDate().getTime() === end.toDate().getTime()
        return `${format(start.toDate(), 'MMM d, Y, kk:mm zzz')} → ${format(end.toDate(), (isSameDate ? '' : 'MMM d, Y, ') + 'kk:mm zzz')}`
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

export const trainingTypeOptions = [
    { value: 0, label: 'Classroom' },
    { value: 1, label: 'Sweatbox' },
    { value: 2, label: 'Online' },
    { value: 3, label: 'OTS' },
]

export const trainingLevelOptions = [
    { value: 0, label: 'Minor Ground' },
    { value: 1, label: 'Major Ground' },
    { value: 2, label: 'Minor Tower' },
    { value: 3, label: 'Major Tower' },
    { value: 4, label: 'Minor Approach' },
    { value: 5, label: 'Major Approach' },
    { value: 6, label: 'Center' },
    { value: 7, label: 'Oceanic' },
]

export const trainingOTSStatusOptions = [
    { value: 0, label: <><RiIndeterminateCircleFill size={20}/> Non-OTS</> },
    { value: 1, label: <><RiCheckboxCircleFill size={20}/> Passed</> },
    { value: 2, label: <><RiCloseCircleFill size={20}/> Failed</> },
    { value: 3, label: <><RiArrowRightCircleFill size={20}/> Recommended</> },
]

export const roleOptions = [
    { "value": "ATM", "label": "Air Traffic Manager" },
    { "value": "DATM", "label": "Deputy Air Traffic Manager" },
    { "value": "TA", "label": "Training Administrator" },
    { "value": "ATA", "label": "Assistant Training Administrator" },
    { "value": "FE", "label": "Facility Engineer" },
    { "value": "AFE", "label": "Assistant Facility Engineer" },
    { "value": "EC", "label": "Events Coordinator" },
    { "value": "AEC", "label": "Assistant Events Coordinator" },
    { "value": "WM", "label": "Webmaster" },
    { "value": "AWM", "label": "Assistant Webmaster" },
    { "value": "INS", "label": "Instructor" },
    { "value": "MTR", "label": "Mentor" },
    { "value": "WEB", "label": "Web Team" },
    { "value": "HC", "label": "Home Controller" },
    { "value": "VC", "label": "Visiting Controller" },
    { "value": "MC", "label": "MAVP Controller" },
]