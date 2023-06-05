import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";
import { CountBox, CustomButton, Loader } from "../components";
import { fairfund, backIcon, dashboard } from "../assets";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const DisplayCampaigns = ({
  title,
  isLoading,
  campaigns,
  data,
  donorCampaigns,
}) => {
  const [selectedTab, setSelectedTab] = useState("available");
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };
  // console.log("Test ", donorCampaigns[0].title);

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
          {!isLoading &&
            campaigns.length === 0 &&
            (selectedTab !== "history" ? (
              <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                You have not created any campaigns yet
              </p>
            ) : (
              <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                You never donate any campaigns
              </p>
            ))}
          {data.map(({ value, filteredcampaigns }) => (
            <TabPanel
              key={value}
              value={value}
              className={
                selectedTab !== "history"
                  ? "flex flex-wrap gap-[20px]"
                  : "mt-[20px] flex flex-col gap-4"
              }>
              {selectedTab !== "history"
                ? filteredcampaigns.map((campaign) => (
                    <FundCard
                      key={campaign.pId}
                      {...campaign}
                      handleClick={() => handleNavigate(campaign)}
                    />
                  ))
                : selectedTab === "history" &&
                  donorCampaigns.map((campaign, index) => (
                    <div
                      key={`${campaign.title}-${index}`}
                      className="flex justify-normal items-center gap-4">
                      <div className="flex items-center gap-4">
                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll w-[10rem]">
                          {index + 1}. {campaign.title}
                        </p>
                      </div>
                      <div>
                        {/* <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                          Donated amount : {campaign.amountCollected}
                        </p> */}
                        <CustomButton
                          btnType="button"
                          title={`Donated ${campaign.amountCollected}`}
                          styles="w-full bg-[#8c6dfd]"
                        />
                      </div>
                    </div>
                  ))}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default DisplayCampaigns;
