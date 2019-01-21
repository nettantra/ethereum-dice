pragma solidity ^0.5.0;

import "./CustomToken.sol";

contract Dice {

    CustomToken public customtoken;

    struct player_details {
        address pAddress;
        string pName;

    }

    struct gameRecords {
        address playerAddress;
        uint selected_num;
        uint rolled_num;
        bool result;
        uint ptoken;
        uint timestamp;
    }

    constructor (address _token_add) public {
        // customtoken = _customtoken;
        customtoken = CustomToken(_token_add);
    }

    /* all the getter functions from Custome Token Contract*/
    function getTokenNow() public view returns (uint){
        return customtoken.getterToken();
    }


    /* all the setter functions from Custome Token Contract*/
    function doTransaction(address _user_add, uint _numberOfTokens) public {
        return customtoken.buyTokens(_user_add,_numberOfTokens);
    }


    mapping(uint => gameRecords) public outcome;
    mapping(uint => player_details) public details;

    uint public playerid = 0;
    uint played = 1;
    uint playercount = 0;

    function setplayerDetails(string memory _pName) public {
        details[playerid] = player_details(msg.sender, _pName);
        playerid++;
        playercount++;
    }

    function addGameEvent(uint _betplaced, uint _rollresult, bool _result, uint _ptoken) public {
        require(playercount >= 1);
        outcome[played] = gameRecords(msg.sender, _betplaced, _rollresult, _result, _ptoken, now);
        played++;
    }

    function tokenfetch() public {
        // customtoken.approve(msg.sender,100);
        customtoken.transfer(msg.sender, 100);
    }


    function login(address log_address) public view returns (bool)
    {
        for (uint i = 0; i <= playerid; i++)
        {
            if (details[i].pAddress == log_address) return true;
        }
        return false;
    }
}
