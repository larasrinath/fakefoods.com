import type { Dish, Restaurant } from "./types";

export const appLogoSrc = "/assets/logos/fakefoods-logo.webp";
export const appLogoMarkSrc = "/assets/logos/fakefoods-mark.webp";

export function restaurantImageSrc(restaurant: Restaurant) {
  return `/assets/restaurants/${restaurant.slug}.webp`;
}

export function dishImageSrc(dish: Dish) {
  return `/assets/foods/${dish.id}.webp`;
}
