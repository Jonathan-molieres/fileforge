import dayjs, { Dayjs } from 'dayjs'

const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto',
})

const DIVISIONS: any = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

export default function humanDateDiff(date: Date | Dayjs) {
    let duration = dayjs(date).diff() / 1000

    if (Math.abs(duration) > 86400) {
        return dayjs(date).format('DD/MM/YYYY')
    }
    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }
}
