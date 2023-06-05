import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CountBox, CustomButton, Loader } from "../components";
import FundCard from "./FundCard";
import { loader } from "../assets";
import { dashboard } from "../assets";
import { daysLeft } from "../utils";
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
  donatedHistory,
}) => {
  const [selectedTab, setSelectedTab] = useState("available");
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const sumAmount = new Map();
  if (Array.isArray(donatedHistory)) {
    donatedHistory.forEach((item) => {
      const { pId, amount } = item;
      if (sumAmount.has(pId)) {
        sumAmount.set(pId, parseFloat(sumAmount.get(pId)) + parseFloat(amount));
      } else {
        sumAmount.set(pId, parseFloat(amount));
      }
    });
  }
  console.log(donatedHistory);

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
                : selectedTab === "history" && (
                    <div className="font-epilogue font-semibold text-[16px] leading-[30px] text-white flex flex-col p-4">
                      <h1>Your Donated</h1> {/* Add the heading here */}
                      {donorCampaigns.map((campaign, index) => (
                        <div
                          key={`${index}`}
                          className="flex justify-between items-left gap-4 bg-gray-600 rounded-lg bg-opacity-30 mt-2 flex-col p-4">
                          <div className="flex justify-between">
                            <div className="flex flex-row gap-4 items-center">
                              <h1 className="font-epilogue font-normal text-[16px] text-white leading-[26px] break-ll ">
                                {index + 1}. Campaign Title :
                              </h1>
                              <h1 className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll w-[10rem]">
                                {campaign.title}
                              </h1>
                            </div>

                            <div>
                              <span
                                className={`inline-flex items-center ${
                                  daysLeft(campaign.deadline) > 0
                                    ? "text-green-100 bg-green-800"
                                    : "text-red-100 bg-red-800"
                                }  text-xs font-epilogue px-2.5 py-0.5 rounded-full`}>
                                <span
                                  className={`w-2 h-2 mr-1 ${
                                    daysLeft(campaign.deadline) > 0
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }  rounded-full`}></span>
                                {daysLeft(campaign.deadline) > 0
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex flex-row gap-4 items-center ">
                              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                                Owner : {campaign.owner}
                              </p>
                            </div>

                            <div>
                              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                                Your Total Donated :{" "}
                                {Array.from(sumAmount.entries())[index]
                                  ? Array.from(sumAmount.entries())[index][1]
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              className={`bg-gray-600 font-epilogue font-normal text-xs  text-white p-2 rounded-full `}
                              // onClick={handleClick}
                            >
                              Request Refund
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default DisplayCampaigns;
