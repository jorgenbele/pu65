export const FETCH_ALL = 'FETCH_ALL'
export const FETCH_NONE = null
export const FETCH_NEVER = 'FETCH_NEVER'

export const fetchItems = (items) => {
  const itemsDict = {}
  for (const item in items) {
    itemsDict[item] = true
  }
  return itemsDict
}
