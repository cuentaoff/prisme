import { BackwardItem, Chart, Document, User } from "iconsax-react";
import {
  Activity,
  Dribbble,
  Layers,
  Box,
  BarChart2,
  Folder,
  ChevronDown,
  ChevronUp,
} from "react-feather";

export const sidebarData = [
  {
    icon: BackwardItem,
    title: "Tableau de bord",
    link: "",
    isPrivate: false,
  },

  {
    icon: User,
    title: "Utilisateurs",
    link: "users",
    isPrivate: true,
  },
  {
    icon: Activity,
    title: "Analyse",
    link: null,
    isPrivate: false,
    iconClosed: ChevronDown,
    iconOpened: ChevronUp,
    subMenu: [
      {
        title: "Sectorielle",
        link: "sectorial",
        icon: Layers,
      },
      {
        title: "Chartiste",
        link: "analyses",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "Création de portefeuille",
    icon: Layers,
    link: null,
    iconClosed: ChevronDown,
    iconOpened: ChevronUp,
    subMenu: [
      {
        title: "Actions BVC",
        link: "markowitz",
        icon: Dribbble,
      },
      {
        title: "Fonds de fonds",
        link: "opcvm",
        icon: Box,
      },
    ],
  },

  // {
  //   icon: Dribbble,
  //   title: "Markowitz",
  //   link: "markowitz",
  //   isPrivate: false,
  // },
  // {
  //   icon: Activity,
  //   title: "Analyses",
  //   link: "analyses",
  //   isPrivate: false,
  // },
  // {
  //   icon: Box,
  //   title: "OPCVM",
  //   link: "opcvm",
  //   isPrivate: false,
  // },
  {
    icon: BarChart2,
    title: "Backtest",
    link: "backtest",
    isPrivate: false,
  },
  {
    icon: Folder,
    title: "Consultation",
    link: "portefeuilles",
    isPrivate: false,
  },
];
