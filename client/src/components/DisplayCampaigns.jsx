import React from "react";
import { useNavigate, Link } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";
import { fairfund, backIcon, dashboard } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };
  // console.log("DISPLAY => ",campaigns);

  return (
    <div className="mt-[90px]">
      <div className="flex items-baseline ">
        <Link
          style={{ pointerEvents: "none" }}
          className={`w-[36px] h-[36px] rounded-[10px] flex justify-center items-center bg-[#2c2f32] cursor-pointer mr-2 `}>
          <img src={dashboard} alt="" className="w-[16px] h-[16px] " />
        </Link>
        <span className="font-epilogue font-semibold text-[20px] text-white uppercase ">
          {title} ({campaigns.length})
        </span>
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
