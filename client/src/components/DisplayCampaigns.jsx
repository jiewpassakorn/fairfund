import React from "react";
import { useNavigate, Link } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";
import { daysLeft } from "../utils";
import { fairfund, backIcon, dashboard } from "../assets";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const availableCampaigns = campaigns.filter(
    (campaign) => daysLeft(campaign.deadline) > 0
  );
  const unavailableCampaigns = campaigns.filter(
    (campaign) => daysLeft(campaign.deadline) <= 0
  );

  const data = [
    {
      label: "Available",
      value: "available",
      filteredcampaigns: availableCampaigns,
    },
    {
      label: "Unavailable",
      value: "unavailable",
      filteredcampaigns: unavailableCampaigns,
    },
  ];

  return (
    <div className="mt-[90px]">
      <div className="flex items-baseline">
        <Link
          style={{ pointerEvents: "none" }}
          className={`w-[36px] h-[36px] rounded-[10px] flex justify-center items-center bg-[#2c2f32] cursor-pointer mr-2 `}>
          <img src={dashboard} alt="" className="w-[16px] h-[16px] " />
        </Link>
        <span className="font-epilogue font-semibold text-[20px] text-white uppercase ">
          {title} ({campaigns.length})
        </span>
      </div>

      <div className="flex mt-[20px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}
      </div>
      <Tabs value="available">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {!isLoading && campaigns.length === 0 && (
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              You have not created any campaigns yet
            </p>
          )}
          {data.map(({ value, filteredcampaigns }) => (
            <TabPanel
              key={value}
              value={value}
              className="flex flex-wrap gap-[26px]">
              {console.log(value, filteredcampaigns.length)}
              {/* {filteredcampaigns.length < 0 ? (
                <div>
                  <p>There are no campaign</p>
                </div>
              ) : (
                filteredcampaigns.map((campaign) => (
                  <FundCard
                    key={campaign.pId}
                    {...campaign}
                    handleClick={() => handleNavigate(campaign)}
                  />
                ))
              )} */}
              {filteredcampaigns.map((campaign) => (
                <FundCard
                  key={campaign.pId}
                  {...campaign}
                  handleClick={() => handleNavigate(campaign)}
                />
              ))}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default DisplayCampaigns;
