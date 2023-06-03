import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";
import { fairfund, backIcon, dashboard } from "../assets";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const DisplayCampaigns = ({ title, isLoading, campaigns, data }) => {
  const [selectedTab, setSelectedTab] = useState("available");
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

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
      <Tabs value={selectedTab}>
        <TabsHeader
          className={
            data.length === 2
              ? "max-w-[20rem] rounded-full bg-[#3a3a43]"
              : "max-w-[30rem] rounded-full bg-[#3a3a43]"
          }
          indicatorProps={{
            className: `rounded-full ${
              selectedTab === "available"
                ? "bg-green-500"
                : selectedTab === "unavailable"
                ? "bg-red-500"
                : selectedTab === "history"
                ? "bg-blue-500"
                : "bg-[#3a3a43]"
            }`,
          }}>
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              className="font-epilogue text-white max-w-[10rem]"
              onClick={() => setSelectedTab(value)}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}>
          {!isLoading && campaigns.length === 0 && (
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              You have not created any campaigns yet
            </p>
          )}
          {data.map(({ value, filteredcampaigns }) => (
            <TabPanel
              key={value}
              value={value}
              className="flex flex-wrap gap-[26px] ">
              {/* {console.log(value, filteredcampaigns.length)} */}
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
