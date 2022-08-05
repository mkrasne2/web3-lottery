// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./VRFCoordinatorV2Interface.sol";
import "./VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Testrandom is VRFConsumerBaseV2 {
  using SafeMath for uint256;
  uint256 private constant ROLL_IN_PROGRESS = 500000;
  VRFCoordinatorV2Interface COORDINATOR;
  
  uint256 public lotteryNumber;
  uint64 s_subscriptionId;
  address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
  bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
  uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;
  uint32 numWords =  1;
  address public s_owner;
  uint256 public ownerFees;
  uint256 public rollsSinceLastClaim;
 

  // map rollers to requestIds
    mapping(uint256 => address) private s_rollers;
    // map vrf results to rollers
    mapping(address => uint256) private s_results;

    event DiceRolled(uint256 indexed requestId, address indexed roller);
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);
    

  constructor(uint64 subscriptionId, uint256 lotteryNum) VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_subscriptionId = subscriptionId;
    lotteryNumber = lotteryNum;
    s_owner = msg.sender;
  }


  function rollDice() public payable returns (uint256 requestId) {
        //require lottery buy-in to be .3 MATIC
        require(msg.value >= (3 * 10**17));
        // Set owner fee collection to .01 MATIC
        ownerFees += (1 * 10**16);

        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_rollers[requestId] = msg.sender;
        s_results[msg.sender] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, msg.sender);
    }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 d20Value = (randomWords[0] % 10) + 1;
        s_results[s_rollers[requestId]] = d20Value;
        rollsSinceLastClaim += 1;
        emit DiceLanded(requestId, d20Value);
    }

  function claimPrize() public {
    require(s_results[msg.sender] == lotteryNumber);
    uint amount = (address(this).balance).sub(ownerFees);
    //reset player number to default value
    delete s_results[msg.sender];
   (bool success, ) = msg.sender.call{value: amount}("");
   require(success, "Failed to withdraw Matic");
    rollsSinceLastClaim = 0;
  }

  function claimOwnerFees() public onlyOwner {
    require(ownerFees > 0);
    uint amount = ownerFees;
    ownerFees = 0;
   (bool success, ) = msg.sender.call{value: amount}("");
   require(success, "Failed to withdraw Matic ownerfees");
  }

  function viewCurrentStats() public view returns (uint256 payout, uint256 rollsincelastpayout, uint256 ownerfees) {
    ownerfees = ownerFees;
    rollsincelastpayout = rollsSinceLastClaim;
    payout = (address(this).balance).sub(ownerFees);
  }

  function assignedNumber(address player) public view returns (uint256) {
        require(s_results[player] != 0, 'Dice not rolled');
        require(s_results[player] != ROLL_IN_PROGRESS, 'Roll in progress');
        return getNumber(s_results[player]);
    }

    function getNumber(uint256 id) private pure returns (uint256) {
        return id;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

  
}