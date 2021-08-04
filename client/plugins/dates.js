import { formatDistanceToNowStrict, format } from 'date-fns'

export default ({ app }, inject) => {
  inject('timePassedFrom', (date) => {
    return formatDistanceToNowStrict(Date.parse(date), {
      addSuffix: true,
    })
  })
  inject('formattedDate', (date) => {
    return format(Date.parse(date), 'Mo MMMM yyyy')
  })
  inject('defaultDateTime', (date) => {
    return format(Date.parse(date), 'yyyy/MM/dd hh:mm:ss')
  })
}
