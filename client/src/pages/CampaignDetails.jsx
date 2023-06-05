import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { fairfund, backIcon } from "../assets";

import "../index.css";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    donate,
    getDonations,
    contract,
    address,
    refundRequest,
    getRefundRequests,
    processRefund,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [refundLists, setRefundLists] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  };

  const fetchRefundRequest = async () => {
    const data = await getRefundRequests(state.pId);

    setRefundLists(data);
  };

  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchRefundRequest();
    }
  }, [contract, address]);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (amount === "" || parseFloat(amount) <= 0) {
      if (amount === "") alert("Please enter amount");
      else alert("Invalid amount");
      return;
    }

    setIsLoading(true);

    try {
      await donate(state.pId, amount);

      navigate("/");
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("Transaction rejected by the user");
      } else {
        console.error(error);
        alert(
          "An error occurred during the transaction. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundRequest = async (e) => {
    setIsLoading(true);
    try {
      await refundRequest(state.pId);
      console.log(`Refund requested successfully id = ${state.pId}`);
      alert("Refund requested successfully");
    } catch (error) {
      if (error.message.includes("user rejected transaction")) {
        alert("Transaction rejected by the user");
      } else {
        console.error(error);
        alert(
          "An error occurred during the transaction. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (id, donor) => {
    // console.log("id", id);
    // console.log("donor", donor);
    try {
      await processRefund(id, donor);
    } catch (error) {}
  };

  return (
    <div className="mt-[90px] ">
      {isLoading && <Loader />}
      <div className="flex items-baseline ">
        <Link
          to="/"
          className={`btn-glow w-[36px] h-[36px] rounded-[10px] flex justify-center items-center bg-[#2c2f32] cursor-pointer mr-2 `}>
          <img src={backIcon} alt="" className="w-[16px] h-[16px] " />
        </Link>
        <span className="font-epilogue font-semibold text-[20px] text-white uppercase ">
          CAMPAIGN : {state.title}
        </span>
      </div>

      <div className="w-full flex md:flex-row flex-col mt-5 gap-[30px] ">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="font-epilogue font-semibold relative w-full h-[20px] bg-[#3a3a43] mt-3 rounded-full text-center text-white text-[14px]">
            <div
              className="absolute h-full bg-[#6645f7] rounded-full"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}>
              <span className={`${state.amountCollected ? "ml-2" : ""}`}>
                {Math.round((state.amountCollected / state.target) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px] ">
          {remainingDays > 0 ? (
            <CountBox
              title="Days Left"
              value={remainingDays > 0 ? remainingDays : "Null"}
            />
          ) : (
            <CountBox title="Days Ago" value={Math.abs(remainingDays)} />
          )}

          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>
      <div className="mt-[20px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={fairfund}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
                {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  10 Campaigns
                </p> */}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Donators
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : remainingDays > 0 ? (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No Donators Yet. Be the first one!
                </p>
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No Donators.
                </p>
              )}
            </div>
          </div>

          {/* Refund Lists */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Refund Lists
            </h4>

            <div className="mt-2 flex flex-col gap-4">
              {refundLists.length > 0 ? (
                refundLists.map((item, index) => (
                  <div
                    key={`${item.requester}-${index}`}
                    className="flex justify-between items-center gap-4 bg-gray-600 p-1 rounded-lg bg-opacity-30">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.requester.slice(0, 5)}...
                      {item.requester.slice(-4)}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item.amount}
                    </p>
                    {state.owner === address ? (
                      <div className="flex flex-row gap-[5px]">
                        <button
                          type="button"
                          className="font-epilogue font-normal text-[10px] text-white bg-green-600 p-1 rounded-lg"
                          onClick={() =>
                            handleApproval(state.pId, item.requester)
                          }>
                          Approved
                        </button>
                        <button
                          type="button"
                          className="font-epilogue font-normal text-[10px] text-white bg-red-600 p-1 rounded-lg"
                          onClick={handleApproval}>
                          Reject
                        </button>
                      </div>
                    ) : item.processed ? (
                      <p className="font-epilogue font-normal text-[14px] text-green-600 leading-[26px] break-ll">
                        Refunded
                      </p>
                    ) : (
                      <p className="font-epilogue font-normal text-[14px] text-red-600 leading-[26px] break-ll">
                        Pending...
                      </p>
                    )}
                  </div>
                ))
              ) : remainingDays > 0 ? (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No Refund Request.
                </p>
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  Can not refund this time.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] ">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191] ">
              Fund the campaign
            </p>
            <div className="mt-[10px] ">
              <input
                type="number"
                disabled={remainingDays <= 0}
                placeholder={remainingDays > 0 ? "ETH 0.1" : "Can't Fund"}
                step="0.01"
                className={`w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]
                ${remainingDays > 0 ? "" : "cursor-not-allowed"}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              {remainingDays > 0 ? (
                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleDonate}
                />
              ) : (
                <CustomButton
                  btnType="button"
                  title="OUT OF DATE"
                  styles={` ${
                    remainingDays > 0
                      ? "w-full bg-[#8c6dfd]"
                      : "w-full pointer-events-none bg-gray-300 text-gray-500"
                  }`}
                />
              )}
            </div>
            <CustomButton
              btnType="button"
              title="Request Refund"
              styles={`mt-3 ${
                remainingDays > 0
                  ? "w-full bg-[#8c6dfd]"
                  : "w-full pointer-events-none bg-gray-300 text-gray-500"
              }`}
              handleClick={handleRefundRequest}
            />
            {/* <CustomButton
              btnType="button"
              title="Request Refund"
              styles="w-full bg-[#8c6dfd]"
              handleClick={handleRefundRequest(state.id)}
            /> */}
            {/* <button
              className="mt-3 mb-2 px-4 py-2 rounded-full font-epilogue font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              onClick={() => handleRefundRequest(state.id)}>
              Request Refund
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
