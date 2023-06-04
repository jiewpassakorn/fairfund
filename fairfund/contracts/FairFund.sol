// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FairFund {
    struct CampaignData {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
    }

    struct Campaign {
        CampaignData data;
        mapping(address => uint256) donatedAmounts; // Track individual donation amounts
        mapping(address => RefundRequest) refundRequests; // Track refund requests
        address[] donators;
        uint256[] donations;
    }

    struct RefundRequest {
        address requester;
        uint256 amount;
        bool processed;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.data.owner = _owner;
        campaign.data.title = _title;
        campaign.data.description = _description;
        campaign.data.target = _target;
        campaign.data.deadline = _deadline;
        campaign.data.amountCollected = 0;
        campaign.data.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(msg.value > 0, "Donation amount should be greater than 0.");
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.donatedAmounts[msg.sender] += amount;

        (bool sent, ) = payable(campaign.data.owner).call{value: amount}("");

        if (sent) {
            campaign.data.amountCollected += amount;
        }
    }

    function requestRefund(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(campaign.data.amountCollected > 0, "No donations to refund.");

        uint256 donationAmount = campaign.donatedAmounts[msg.sender];
        require(donationAmount > 0, "No donation from the sender.");

        if (campaign.refundRequests[msg.sender].processed == true) {
            campaign.refundRequests[msg.sender].processed = false;
        } else {
            campaign.refundRequests[msg.sender] = RefundRequest({
                requester: msg.sender,
                amount: donationAmount,
                processed: false
            });
        }
    }

    function processRefund(uint256 _id, address payable _donor) public payable {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.data.owner == msg.sender,
            "Only the campaign owner can process refunds."
        );
        require(
            campaign.refundRequests[_donor].processed == false,
            "Refund not requested by the donor."
        );

        uint256 donationAmount = campaign.donatedAmounts[_donor];
        require(donationAmount > 0, "No donation from the donor.");

        campaign.data.amountCollected -= donationAmount;
        campaign.donatedAmounts[_donor] = 0;
        campaign.refundRequests[_donor].processed = true;

        (bool sent, ) = _donor.call{value: donationAmount}("");
        require(sent, "Failed to send refund.");

        // Remove the donor from the donators array
        uint256 donorIndex;
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            if (campaign.donators[i] == _donor) {
                donorIndex = i;
                break;
            }
        }
        if (donorIndex < campaign.donators.length - 1) {
            // Move the last element to the position of the removed donor
            campaign.donators[donorIndex] = campaign.donators[campaign.donators.length - 1];
            campaign.donations[donorIndex] = campaign.donations[campaign.donators.length - 1];
        }
        // Remove the last element from the array
        campaign.donators.pop();
        campaign.donations.pop();
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }

    function getCampaigns() public view returns (CampaignData[] memory) {
        CampaignData[] memory allCampaigns = new CampaignData[](
            numberOfCampaigns
        );

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i].data;
        }

        return allCampaigns;
    }

    function getRefundRequests(uint256 _id) public view returns (RefundRequest[] memory) {
        Campaign storage campaign = campaigns[_id];
        RefundRequest[] memory requests = new RefundRequest[](campaign.donators.length);

        for (uint256 i = 0; i < campaign.donators.length; i++) {
            address donator = campaign.donators[i];
            requests[i] = campaign.refundRequests[donator];
        }

        return requests;
    }

    function getDonorCampaigns(address _donor) public view returns (CampaignData[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].donatedAmounts[_donor] > 0) {
                count++;
            }
        }

        CampaignData[] memory donorCampaigns = new CampaignData[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].donatedAmounts[_donor] > 0) {
                donorCampaigns[currentIndex] = campaigns[i].data;
                currentIndex++;
            }
        }

        return donorCampaigns;
    }
}
