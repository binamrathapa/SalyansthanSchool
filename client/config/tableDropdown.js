import { FiFilter } from "react-icons/fi";

import { leaf, herb, spices, beans, bowl } from "../assets/icons";

export const filterItems = [
  { id: "68cd699d88324b5a03fd62fa", name: "Chino" },
  { id: "68cd401f88324b5a03fd621e", name: "grass" },
  { id: "68cd3ff888324b5a03fd6213", name: "tree" },
  { id: "68ca869c11775ce8040ea730", name: "Spices" },
  { id: "1", name: "Grain, Flour & Grits", icon: leaf },
  { id: "2", name: "Herbs & Superfood", icon: herb },
  { id: "3", name: "Spicy & Seeds", icon: spices },
  { id: "4", name: "Tradition Fermented", icon: bowl },
  { id: "5", name: "Pulses & Lentils", icon: beans },
];

export const sortItems = [
  { id: "recent", name: "Recent Product" },
  { id: "popular", name: "Popular Teas (most loved product)" },
  { id: "high-low", name: "High to Low Price (rice in Nepal)" },
];
