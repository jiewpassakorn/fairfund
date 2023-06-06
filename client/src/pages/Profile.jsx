import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { daysLeft } from "../utils";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [donorCampaigns, setDonorCampaigns] = useState([]);
  const [donatedHistory, setDonatedHistory] = useState([]);

  const {
    address,
    contract,
    getUserCampaigns,
    getDonorCampaigns,
    getDonatedHistory,
  } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  const availableCampaigns = campaigns.filter(
    (campaign) => daysLeft(campaign.deadline) > 0
  );
  const unavailableCampaigns = campaigns.filter(
    (campaign) => daysLeft(campaign.deadline) <= 0
  );
  const historyCampaigns = campaigns.filter(
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
    {
      label: "History",
      value: "history",
      filteredcampaigns: historyCampaigns,
    },
  ];

  const fetchDonorCampaigns = async () => {
    try {
      setIsLoading(true);
      const result = await getDonorCampaigns(address);
      setDonorCampaigns(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDonatedHistory = async () => {
    try {
      setIsLoading(true);
      const result = await getDonatedHistory();
      setDonatedHistory(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
      fetchDonorCampaigns();
      fetchDonatedHistory();
    }
  }, [address, contract]);

  return (
    <>
      <Helmet>
        <title>FairFund | My Campaign</title>
      </Helmet>
      <DisplayCampaigns
        title="Your Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
        data={data}
        donorCampaigns={donorCampaigns}
        donatedHistory={donatedHistory}
      />
    </>
  );
};

export default Profile;
