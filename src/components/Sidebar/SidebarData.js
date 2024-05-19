import React from "react";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "About",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Mission",
        path: "/why",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Team",
        path: "/team",
        icon: <IoIcons.IoMdPeople />,
      },
      {
        title: "Award",
        path: "/scholarship",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Media",
        path: "/media",
        icon: <IoIcons.IoIosCamera />,
      },
    ],
  },
  {
    title: "Register",
    path: "/register"
  },
  {
    title: "Donate",
    path: "/donate",
  },
  {
    title: "Cart",
    path: "/cart",
  },
];
