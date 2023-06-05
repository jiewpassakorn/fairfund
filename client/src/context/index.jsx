import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x38f2872f323ba5D5d706535c98F592E93851564c"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const { mutateAsync: requestRefund } = useContractWrite(
    contract,
    "requestRefund"
  );

  const { mutateAsync: processRefund } = useContractWrite(
    contract,
    "processRefund"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("Contract call successful");
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("Transaction rejected by the user");
      } else {
        console.error(error);
        alert(
          "An error occurred during the transaction. Please try again later."
        );
      }
    }
  };

  const refundRequest = async (pId) => {
    try {
      const data = await requestRefund({
        args: [pId],
      });
      console.log("Contract call successful");
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("Transaction rejected by the user");
      } else {
        console.error(error);
        alert(
          "An error occurred during the transaction. Please try again later."
        );
      }
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
    // console.log("CAMPAIGNS => ",campaigns);

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    // console.log(pId);
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const getDonorCampaigns = async (donorAddress) => {
    const donorCampaigns = await contract.call("getDonorCampaigns", [
      donorAddress,
    ]);

    const parsedCampaigns = donorCampaigns.map((campaign) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: campaign.pId,
    }));

    return parsedCampaigns;
  };

  const getRefundRequests = async (pId) => {
    const data = await contract.call("getRefundRequests", [pId]);
    console.log("refund list:", data);
    const parsedRequests = [];
    for (let i = 0; i < data.length; i++) {
      if (
        data[i]["requester"] !== "0x0000000000000000000000000000000000000000"
      ) {
        parsedRequests.push({
          requester: data[i]["requester"],
          amount: ethers.utils.formatEther(data[i]["amount"].toString()),
          processed: data[i]["processed"],
        });
      }
    }
    return parsedRequests;
  };

  const processApprovalRefund = async (pId, donor, amount) => {
    console.log(pId, donor, amount);
    try {
      const data = await processRefund({
        args: [pId, donor],
        value: ethers.utils.parseEther(amount),
      });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }

    return data;
  };
  const getDonatedHistory = async () => {
    const result = [];
    try {
      const campaign = await getCampaigns();
      for (let i = 0; i < campaign.length; i++) {
        const data = await contract.call("getDonators", [i]);
        for (let j = 0; j < data[0].length; j++) {
          if (data[0][j] === address)
            result.push({
              pId: i,
              donater: data[0][j],
              amount: ethers.utils.formatEther(data[1][j].toString()),
            });
        }
      }
    } catch (error) {}
    return result;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        refundRequest,
        getDonorCampaigns,
        getRefundRequests,
        processRefund,
        getDonatedHistory,
        processApprovalRefund,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
