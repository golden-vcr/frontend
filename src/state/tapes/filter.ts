import { type Tape } from './types'

export type TapeFilterParams = {
  showScreeningStatus: TapeScreeningStatus
  showFavoriteStatus: TapeFavoriteStatus
  searchText: string
  sortBy: TapeSortCriteria
  sortDescending: boolean
}

export type TapeScreeningStatus = 'all' | 'unscreened' | 'screened'
export const TAPE_SCREENING_STATUS_VALUES = ['all', 'unscreened', 'screened'] as TapeScreeningStatus[]

export type TapeFavoriteStatus = 'all' | 'favorited' | 'unfavorited'
export const TAPE_FAVORITE_STATUS_VALUES = ['all', 'favorited', 'unfavorited'] as TapeFavoriteStatus[]

export type TapeSortCriteria = 'id' | 'favorites' | 'image' | 'title' | 'year' | 'runtime' | 'broadcasts' | 'contributor' | 'favorite'
export const TAPE_SORT_CRITERIA_VALUES = ['id', 'favorites', 'image', 'title', 'year', 'runtime', 'broadcasts', 'contributor', 'favorite'] as TapeSortCriteria[]

export function getFilteredTapeIds(tapes: Tape[], params: TapeFilterParams): number[] {
  if (tapes.length === 0) {
    return [...Array(101).keys()].slice(1)
  }
  let filtered = filterTapesByScreeningStatus(tapes, params.showScreeningStatus)
  filtered = filterTapesByFavoriteStatus(filtered, params.showFavoriteStatus)
  if (params.searchText) {
    filtered = filterTapesBySearchText(filtered, params.searchText)
  }
  const sorted = sortTapes(filtered, params.sortBy)
  if (params.sortDescending) {
    sorted.reverse()
  }
  return sorted.map((x) => x.id)
}

function filterTapesByScreeningStatus(tapes: Tape[], status: TapeScreeningStatus): Tape[] {
  switch (status) {
    case 'all':
      return tapes
    case 'unscreened':
      return tapes.filter((x) => x.broadcastIds.length === 0)
    case 'screened':
      return tapes.filter((x) => x.broadcastIds.length > 0)
  }
}

function filterTapesByFavoriteStatus(tapes: Tape[], status: TapeFavoriteStatus): Tape[] {
  switch (status) {
    case 'all':
      return tapes
    case 'favorited':
      return tapes.filter((x) => x.isFavorite)
    case 'unfavorited':
      return tapes.filter((x) => !x.isFavorite)
  }
}

function filterTapesBySearchText(tapes: Tape[], searchText: string): Tape[] {
  if (!searchText) {
    return tapes
  }
  const searchTextLower = searchText.toLowerCase()
  return tapes.filter((x) => {
    if (x.title.toLowerCase().includes(searchTextLower)) return true
    if (x.contributor && x.contributor.toLowerCase().includes(searchTextLower)) return true
    for (const tag of x.tags) {
      if (tag.includes(searchTextLower)) return true
    }
    return false
  })
}

function sortTapes(tapes: Tape[], criteria: TapeSortCriteria): Tape[] {
  switch (criteria) {
    case 'id':
      // Simple ascending sort on numeric ID
      return tapes.sort((a, b) => a.id - b.id)
    case 'favorites':
      // Ascending sort on number of users that have marked each tape as a favorite,
      // falling back to ID sort for tapes with the same number of favorites
      return tapes.sort((a, b) => {
        if (a.numFavorites === b.numFavorites) {
          return a.id - b.id
        }
        return a.numFavorites - b.numFavorites
      })
    case 'image':
      // Sort by hue, red -> orange -> yellow -> green -> blue -> purple
      return tapes.sort((a, b) => {
        const hsvA = hexColorToHSV(a.color)
        const hsvB = hexColorToHSV(b.color)
        if (hsvA.h === hsvB.h) {
          return a.id - b.id
        }
        return hsvA.h - hsvB.h
      })
    case 'title':
      // Simple lexical sort on title, falling back to ID sort for identical titles
      return tapes.sort((a, b) => {
        if (a.title === b.title) {
          return a.id - b.id
        }
        return a.title.localeCompare(b.title)
      })
    case 'year':
      // Ascending sort on year, with unknown years appearing first; sort on ID for
      // tapes with identical years
      return tapes.sort((a, b) => {
        if (!a.year || !b.year) {
          if (a.year) return 1
          if (b.year) return -1
          return a.id - b.id
        }
        if (a.year === b.year) {
          return a.id - b.id
        }
        return a.year - b.year
      })
    case 'runtime':
      // Ascending sort on runtime, with unknown runtimes appearing first; sort on ID
      // for tapes with identical runtimes
      return tapes.sort((a, b) => {
        if (!a.runtime || !b.runtime) {
          if (a.runtime) return 1
          if (b.runtime) return -1
          return a.id - b.id
        }
        if (a.runtime === b.runtime) {
          return a.id - b.id
        }
        return a.runtime - b.runtime
      })
    case 'broadcasts':
      // Ascending sort on the broadcast in which the tape was first screened, with
      // never-screened tapes appearing first; sort on ID for tapes with the same first
      // broadcast
      return tapes.sort((a, b) => {
        const minA = a.broadcastIds.length > 0 ? a.broadcastIds[0] : -1
        const minB = b.broadcastIds.length > 0 ? b.broadcastIds[0] : -1
        if (minA === minB) {
          return a.id - b.id
        }
        return minA - minB
      })
    case 'contributor':
      // Ascending sort on Twitch username of contributor, with unattributed tapes
      // appearing first; sort on ID for tapes with the same contributor
      return tapes.sort((a, b) => {
        if (!a.contributor || !b.contributor) {
          if (a.contributor) return 1
          if (b.contributor) return -1
          return a.id - b.id
        }
        if (a.contributor === b.contributor) {
          return a.id - b.id
        }
        return a.contributor.localeCompare(b.contributor)
      })
    case 'favorite':
      // For ascending sort, put tapes that aren't favorited before tapes that are;
      // sorting on ID within the two sets
      return tapes.sort((a, b) => {
        if (!a.isFavorite || !b.isFavorite) {
          if (a.isFavorite) return 1
          if (b.isFavorite) return -1
        }
        return a.id - b.id
      })
    default:
      return []
  }
}

function hexColorToHSV(color: string): {h: number, s: number, v: number} {
  if (!color.startsWith('#') || (color.length !== 4 && color.length !== 7)) {
    return {h: 0, s: 0, v: 0}
  }
  let rStr = ''
  let gStr = ''
  let bStr = ''
  if (color.length === 4) {
    rStr = color[1] + color[1]
    gStr = color[2] + color[2]
    bStr = color[3] + color[3]
  } else {
    rStr = color.slice(1, 3)
    gStr = color.slice(3, 5)
    bStr = color.slice(5)
  }
  const r = parseInt(rStr, 16) / 255
  const g = parseInt(gStr, 16) / 255
  const b = parseInt(bStr, 16) / 255
  return rgbToHsv(r, g, b)
}

function rgbToHsv(r: number, g: number, b: number): {h: number, s: number, v: number} {
  const v = Math.max(r, g, b)
  const c = v - Math.min(r, g, b)
  const h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c))
  return {
    h: 60 * (h < 0 ? h + 6 : h),
    s: v && c / v,
    v: v,
  }
}
