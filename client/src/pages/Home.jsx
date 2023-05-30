import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { daysLeft } from "../utils";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
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

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
      <Helmet>
        <title>FairFund | All Campaigns</title>
      </Helmet>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
        data={data}
      />
    </>
  );
};

export default Home;
