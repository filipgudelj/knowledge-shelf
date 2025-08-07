export function useFavouritesCookie() {
  const cookie = useCookie<number[]>('anonymous_favourites', {
    default: () => [],
    watch: true,
  })

  const getAllFavouritesFromCookie = () => {
    return cookie.value
  }

  const addFavouriteToCookie = (bookId: number) => {
    if (!cookie.value.includes(bookId)) {
      cookie.value = [...cookie.value, bookId]
    }
  }

  const removeFavouriteFromCookie = (bookId: number) => {
    cookie.value = cookie.value.filter((id) => id !== bookId)
  }

  const isBookFavouriteInCookie = (bookId: number) => {
    return cookie.value.includes(bookId)
  }

  const clearAllFavouritesFromCookie = () => {
    cookie.value = []
  }

  return {
    getAllFavouritesFromCookie,
    addFavouriteToCookie,
    removeFavouriteFromCookie,
    isBookFavouriteInCookie,
    clearAllFavouritesFromCookie,
  }
}
