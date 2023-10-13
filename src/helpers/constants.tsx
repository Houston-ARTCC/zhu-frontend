import { format } from 'date-fns-tz'
import { RiArrowRightCircleFill, RiCheckboxCircleFill, RiCloseCircleFill, RiIndeterminateCircleFill } from 'react-icons/all'

export const tuiCalendars = [
    {
        id: '0',
        name: 'Events',
        bgColor: '#109CF1',
        borderColor: '#50b7ff',
    },
    {
        id: '1',
        name: 'Training Sessions',
        bgColor: '#F7685B',
        borderColor: '#ff6b5f',
    },
    {
        id: '2',
        name: 'Training Requests',
        bgColor: '#b0b0b0',
        borderColor: '#949494',
    },
    {
        id: '3',
        name: 'Controller Bookings',
        bgColor: '#2ED47A',
        borderColor: '#40e98d',
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
        return `${format(start.toDate(), 'MMM d, y, HH:mm zzz')} → ${format(end.toDate(), (isSameDate ? '' : 'MMM d, y, ') + 'HH:mm zzz')}`
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

export const selectStyles = {
    multiValue: (base, state) => state.data.isFixed ? { ...base, backgroundColor: '#b4b4bf80' } : base,
    multiValueRemove: (base, state) => state.data.isFixed ? { ...base, display: 'none' } : base,
    multiValueLabel: (base, state) => state.data.isFixed
        ? { ...base, color: 'white', paddingLeft: 10, paddingRight: 10 }
        : base,
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
]

export const trainingOTSStatusOptions = [
    { value: 0, label: <><RiIndeterminateCircleFill size={20}/> Non-OTS</> },
    { value: 1, label: <><RiCheckboxCircleFill size={20}/> Passed</> },
    { value: 2, label: <><RiCloseCircleFill size={20}/> Failed</> },
    { value: 3, label: <><RiArrowRightCircleFill size={20}/> Recommended</> },
]

export const roleOptions = [
    { id: 1, value: "ATM", label: "Air Traffic Manager" },
    { id: 2, value: "DATM", label: "Deputy Air Traffic Manager" },
    { id: 3, value: "TA", label: "Training Administrator" },
    { id: 4, value: "ATA", label: "Assistant Training Administrator" },
    { id: 5, value: "FE", label: "Facility Engineer" },
    { id: 6, value: "AFE", label: "Assistant Facility Engineer" },
    { id: 7, value: "EC", label: "Events Coordinator" },
    { id: 8, value: "AEC", label: "Assistant Events Coordinator" },
    { id: 9, value: "WM", label: "Webmaster" },
    { id: 10, value: "AWM", label: "Assistant Webmaster" },
    { id: 11, value: "INS", label: "Instructor" },
    { id: 12, value: "MTR", label: "Mentor" },
    { id: 13, value: "WEB", label: "Web Team" },
    { id: 14, value: "HC", label: "Home Controller", isFixed: true, isDisabled: true },
    { id: 15, value: "VC", label: "Visiting Controller", isFixed: true, isDisabled: true },
    { id: 16, value: "MC", label: "MAVP Controller", isFixed: true, isDisabled: true },
]
