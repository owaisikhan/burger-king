export type MenuItem = {
  id: string;
  name: string;
  tag: string;
  price: number;
  img: string;
  desc: string;
  badges: string[];
};

export const MENU: MenuItem[] = [
  {
    id: "smoke",
    name: "THE SMOKE",
    tag: "01 / SIGNATURE",
    price: 13,
    img: "/menu/smoke.webp",
    desc: "Thick-cut applewood smoked bacon. Melted American. Toasted brioche bun. Smoke still rising when it hits the table.",
    badges: ["SMOKED BACON", "TOASTED BRIOCHE", "MELTED AMERICAN"],
  },
  {
    id: "double",
    name: "THE DOUBLE",
    tag: "02 / PREMIUM",
    price: 16,
    img: "/menu/truffle.webp",
    desc: "Two smashed patties, two crispy-edge crusts. Smash sauce, house pickles, on a bun that can barely hold it together.",
    badges: ["DOUBLE SMASH", "MELTED AMERICAN", "SMASH SAUCE"],
  },
  {
    id: "smash",
    name: "THE SMASH",
    tag: "03 / ICON",
    price: 18,
    img: "/menu/gold-pedestal.webp",
    desc: "Our icon. Double smash. Double American. Smashed onions. Smash sauce. Built the way it should be. The full expression.",
    badges: ["DOUBLE SMASH", "SMASHED ONION", "GOLD STANDARD"],
  },
];

/** Custom event fired when a menu card's "ADD TO ORDER" hands a build to the configurator. */
export const SELECT_BUILD_EVENT = "smash:selectBuild";
