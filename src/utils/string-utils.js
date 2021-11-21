export const quoteShortener = (quote, maxLength, withDots = true) => {
  if (maxLength > quote.length) {
    return quote
  }

  const shortQuote = quote.slice(0, maxLength)
  const finalQuote = `${shortQuote}${withDots ? "..." : ""}`

  return finalQuote
}

export const numberParsed = (value) => {
  const valueLength = String(value).length
  var suffixes = ["", "K", "M", "B", "T"]
  var suffixNum =
    valueLength > 6
      ? Math.floor(("" + value).length / 3)
      : Math.floor(("" + value).length / 4)
  var shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  )
  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1)
  }
  return shortValue + suffixes[suffixNum]
}

export const smartFilter = (input, properties, data, maxResults) => {
  const results = properties.map((singleProperty) => {
    return data.filter(
      (item) =>
        item[singleProperty].slice(0, input.length).toLowerCase() ===
        input.toLowerCase()
    )
  })[0]

  if (maxResults) {
    return results.slice(0, maxResults)
  }

  return results
}
