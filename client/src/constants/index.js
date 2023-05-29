import {
  ownCampaign,
  dashboard,
  logout,
  newCampaign,
  payment,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Campaign",
    imgUrl: newCampaign,
    link: "/create-campaign",
  },
  {
    name: "Profile",
    imgUrl: ownCampaign,
    link: "/profile",
  },
];
