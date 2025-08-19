export function formatNumberToEuro(value: number, locale: string = 'en') {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
}
