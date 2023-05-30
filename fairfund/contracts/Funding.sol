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
        mapping(address => bool) refundRequested; // Track refund requests
        address[] donators;
        uint256[] donations;
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

    function requestRefund(uint256 _id) public {
    Campaign storage campaign = campaigns[_id];
    require(campaign.data.amountCollected > 0, "No donations to refund.");
    require(campaign.refundRequested[msg.sender] == false, "Refund already requested.");
    
    uint256 donationAmount = campaign.donatedAmounts[msg.sender];
    require(donationAmount > 0, "No donation from the sender.");
    
    campaign.refundRequested[msg.sender] = true;
    
    (bool sent, ) = payable(msg.sender).call{value: donationAmount}("");
    require(sent, "Failed to send refund.");
}

    function processRefund(uint256 _id, address _donor) public {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.data.owner == msg.sender,
            "Only the campaign owner can process refunds."
        );
        require(
            campaign.refundRequested[_donor],
            "Refund not requested by the donor."
        );

        uint256 donationAmount = campaign.donatedAmounts[_donor];
        require(donationAmount > 0, "No donation from the donor.");

        campaign.data.amountCollected -= donationAmount;
        campaign.donatedAmounts[_donor] = 0;
        campaign.refundRequested[_donor] = false;

        (bool sent, ) = payable(_donor).call{value: donationAmount}("");
        require(sent, "Failed to send refund.");
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
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
}
