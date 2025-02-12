// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);

    function getNFTsByOwner(address owner)
        external
        view
        returns (uint256[] memory);
}

contract ZeroRoyalty is AccessControl {
    using EnumerableSet for EnumerableSet.UintSet;
    bytes32 public constant EVENT_OPERATOR_ROLE =
        keccak256("EVENT_OPERATOR_ROLE");

    address public wethToken;
    address public nftContract;

    uint256 public rewardPercent;
    uint256 public constant rewardBase = 100;

    uint256 public ethTotalRewards;
    uint256 public wethTotalRewards;
    uint256 public ethLastBalance;
    uint256 public wethLastBalance;

    uint256 public membershipFee = 0.003 ether;
    uint256 public maxWinners = 2;

    struct EventRecord {
        uint8 status; // 0: pending, 1: submitted
        EnumerableSet.UintSet memberships; // event memberships
        uint256[] winners; // winner tokenids
        uint256 createdTime;
        uint256 finishedTime;
        uint256 ethRewardAmount;
        uint256 wethRewardAmount;
    }

    mapping(uint256 => bool) public eventIsSubmited;
    mapping(uint256 => uint256) public ethTokenRewards;
    mapping(uint256 => uint256) public wethTokenRewards;
    mapping(bytes32 => EventRecord) private eventRecords; // ipfs cid => bytes32

    event EventRewardSubmitted(
        bytes32 indexed eventId,
        uint256 ethIncrement,
        uint256 wethIncrement
    );

    event RewardClaimed(
        uint256 tokenId,
        address claimant,
        uint256 ethReward,
        uint256 wethReward
    );

    event RemainderWithdrawn(
        address owner,
        uint256 ethRemainder,
        uint256 wethRemainder
    );

    event MembershipFeeUpdated(uint256 oldFee, uint256 newFee);
    event MaxWinnersUpdated(uint256 oldMaxWinners, uint256 newMaxWinners);
    event EventCreated(bytes32 indexed eventKey, string cid);
    event MembershipAdded(bytes32 indexed eventKey, uint256[] tokenIds);

    constructor(
        address _wethToken,
        address _nftContract,
        uint256 _rewardPercent
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(EVENT_OPERATOR_ROLE, msg.sender);
        wethToken = _wethToken;
        nftContract = _nftContract;
        require(
            _rewardPercent <= rewardBase,
            "ZeroRoyalty: reward percent must less than 100."
        );
        rewardPercent = _rewardPercent;
    }

    receive() external payable {}

    function eventStatus(string calldata cid) public view returns (uint256) {
        bytes32 eventKey = calcEventId(cid);
        return eventRecords[eventKey].status;
    }

    function eventCreatedTime(string calldata cid)
        public
        view
        returns (uint256)
    {
        bytes32 eventKey = calcEventId(cid);
        return eventRecords[eventKey].createdTime;
    }

    function eventFinishedTime(string calldata cid)
        public
        view
        returns (uint256)
    {
        bytes32 eventKey = calcEventId(cid);
        return eventRecords[eventKey].finishedTime;
    }

    function eventWinners(string calldata cid)
        public
        view
        returns (uint256[] memory)
    {
        bytes32 eventKey = calcEventId(cid);
        return eventRecords[eventKey].winners;
    }

    function eventRewards(string calldata cid)
        public
        view
        returns (uint256, uint256)
    {
        bytes32 eventKey = calcEventId(cid);
        return (
            eventRecords[eventKey].ethRewardAmount,
            eventRecords[eventKey].wethRewardAmount
        );
    }

    function eventMemberships(string calldata cid)
        public
        view
        returns (uint256[] memory)
    {
        bytes32 eventKey = calcEventId(cid);
        return eventRecords[eventKey].memberships.values();
    }

    function setRewardPercent(uint256 _rewardPercent)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardPercent = _rewardPercent;
    }

    function setMembershipFee(uint256 _membershipFee)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit MembershipFeeUpdated(membershipFee, _membershipFee);
        membershipFee = _membershipFee;
    }

    function setMaxWinners(uint256 _maxWinners)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        emit MaxWinnersUpdated(maxWinners, _maxWinners);
        maxWinners = _maxWinners;
    }

    function calcEventId(string calldata cid) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(cid));
    }

    function createEvent(string calldata cid)
        external
        onlyRole(EVENT_OPERATOR_ROLE)
    {
        bytes32 eventKey = calcEventId(cid);
        require(
            eventRecords[eventKey].createdTime == 0,
            "ZeroRoyalty: event already exists"
        );
        eventRecords[eventKey].status = 0; // Initialize event as pending
        eventRecords[eventKey].createdTime = block.timestamp;
        emit EventCreated(eventKey, cid);
    }

    function addEventMemberships(
        string calldata cid,
        uint256[] calldata tokenIds
    ) external payable {
        bytes32 eventKey = calcEventId(cid);
        EventRecord storage eventRecord = eventRecords[eventKey];
        require(eventRecord.status == 0, "ZeroRoyalty: event not active");
        require(
            msg.value >= membershipFee * tokenIds.length,
            "ZeroRoyalty: insufficient membership fee"
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                !eventRecord.memberships.contains(tokenIds[i]),
                "ZeroRoyalty: token already added"
            );
            eventRecord.memberships.add(tokenIds[i]);
        }
        emit MembershipAdded(eventKey, tokenIds);
    }

    function submitEventReward(string calldata cid, uint256[] calldata tokenIds)
        external
        onlyRole(EVENT_OPERATOR_ROLE)
    {
        uint256 rewardCount = tokenIds.length;
        require(
            rewardCount <= maxWinners,
            "ZeroRoyalty: the maximum number of winners is exceeded"
        );

        bytes32 eventKey = calcEventId(cid);
        EventRecord storage eventRecord = eventRecords[eventKey];
        require(
            eventRecord.status == 0,
            "ZeroRoyalty: event already submitted or invalid"
        );
        eventRecord.status = 1; // Mark event as submitted
        eventRecord.finishedTime = block.timestamp;
        eventRecord.winners = tokenIds;

        uint256 currentEthBalance = address(this).balance;
        uint256 currentWethBalance = IERC20(wethToken).balanceOf(address(this));

        uint256 ethIncrement = ((currentEthBalance - ethLastBalance) *
            rewardPercent) / rewardBase;
        uint256 wethIncrement = ((currentWethBalance - wethLastBalance) *
            rewardPercent) / rewardBase;

        eventRecord.ethRewardAmount = ethIncrement;
        eventRecord.wethRewardAmount = wethIncrement;

        ethLastBalance = currentEthBalance; // update last balance
        wethLastBalance = currentWethBalance; // update last balance

        if (ethIncrement > 0 || wethIncrement > 0) {
            uint256 ethRewardPerToken = ethIncrement / rewardCount;
            uint256 wethRewardPerToken = wethIncrement / rewardCount;

            for (uint256 i = 0; i < rewardCount; i++) {
                ethTokenRewards[tokenIds[i]] += ethRewardPerToken;
                wethTokenRewards[tokenIds[i]] += wethRewardPerToken;
            }

            ethTotalRewards += ethIncrement;
            wethTotalRewards += wethIncrement;

            emit EventRewardSubmitted(eventKey, ethIncrement, wethIncrement);
        }
    }

    function claimRewardBatch(uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            claimReward(tokenIds[i]);
        }
    }

    function claimReward(uint256 tokenId) public {
        require(
            msg.sender == IERC721(nftContract).ownerOf(tokenId),
            "ZeroRoyalty: not nft owner"
        );

        uint256 ethReward = ethTokenRewards[tokenId];
        uint256 wethReward = wethTokenRewards[tokenId];

        require(ethReward > 0 || wethReward > 0, "ZeroRoyalty: no rewards");

        ethTokenRewards[tokenId] = 0;
        wethTokenRewards[tokenId] = 0;

        if (ethReward > 0) {
            payable(msg.sender).transfer(ethReward);
        }

        if (wethReward > 0) {
            IERC20(wethToken).transfer(msg.sender, wethReward);
        }

        emit RewardClaimed(tokenId, msg.sender, ethReward, wethReward);
    }

    function withdrawRemainder() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 ethRemainder = ethLastBalance - ethTotalRewards;
        uint256 wethRemainder = wethLastBalance - wethTotalRewards;

        require(
            ethRemainder > 0 || wethRemainder > 0,
            "ZeroRoyalty: no remainder to withdraw"
        );

        if (ethRemainder > 0) {
            payable(msg.sender).transfer(ethRemainder);
        }

        if (wethRemainder > 0) {
            IERC20(wethToken).transfer(msg.sender, wethRemainder);
        }
        emit RemainderWithdrawn(msg.sender, ethRemainder, wethRemainder);
    }

    function withdrawOthers(address[] calldata tokens)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        for (uint256 i = 0; i < tokens.length; i++) {
            require(
                tokens[i] != wethToken,
                "ZeroRoyalty: can withdraw weth from this function"
            );

            uint256 tokenBalance = IERC20(tokens[i]).balanceOf(address(this));

            if (tokenBalance > 0) {
                IERC20(tokens[i]).transfer(msg.sender, tokenBalance);
            }
        }
    }

    /**
     * @dev Returns the total ETH and WETH rewards for all NFTs owned by the specified address.
     * @param owner The address of the NFT owner.
     * @return totalEthRewards Total ETH rewards.
     * @return totalWethRewards Total WETH rewards.
     */
    function getTotalRewardsByOwner(address owner)
        external
        view
        returns (uint256 totalEthRewards, uint256 totalWethRewards)
    {
        uint256[] memory tokenIds = IERC721(nftContract).getNFTsByOwner(owner);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            totalEthRewards += ethTokenRewards[tokenIds[i]];
            totalWethRewards += wethTokenRewards[tokenIds[i]];
        }
    }
}
