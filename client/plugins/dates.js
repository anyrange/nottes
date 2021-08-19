import { formatDistanceToNowStrict, format } from 'date-fns'

export default ({ app }, inject) => {
  inject('formatDistanceToNow', (date) => {
    return formatDistanceToNowStrict(Date.parse(date), { addSuffix: true })
  })
  inject('defaultDate', (date) => {
    return format(Date.parse(date), 'Mo MMMM yyyy')
  })
  inject('defaultDateTime', (date) => {
    return format(Date.parse(date), 'yyyy/MM/dd hh:mm:ss')
  })
}
