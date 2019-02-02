pragma solidity ^0.5.0;

import "./CustomToken.sol";

contract Dice {
    CustomToken public customtoken;

    struct player_details {
        address pAddress;
        string pName;
        uint intial_player_token;
    }

    struct gameRecords {
        address playerAddress;
        uint selected_num;
        uint rolled_num;
        bool result;
        uint ptoken;
        uint timestamp;
    }

    mapping(uint => gameRecords) public outcome;
    mapping(uint => player_details) public details;

    uint public playerid = 0;
    uint played = 0;
    uint playercount = 0;

    constructor (address _token_add) public {
        customtoken = CustomToken(_token_add);
        details[0].pAddress = 0xdc27f1dAB1Af1aE97d31D1183C743EF7C24bb504;
        details[1].pAddress = 0xA93B6b6B074F6e593dec790B2BA310aE81049983;
        details[2].pAddress = 0xd1DBae8f1924cA2F5f4e6b274A47e35Be66F47bB;
        details[3].pAddress = 0x848B9D7878bF73c5eBA86ad4266835d8155e483C;
        details[4].pAddress = 0x7F88C4Fea4d5018db4D9149eDa71714DaE51f794;
    }

    /* all the getter functions from Custome Token Contract*/
    function getTokenNow() public view returns (uint){
        return customtoken.getterToken();
    }

    //     to fetch individual tokens as per the address
    function tokenfetch(address _player_address) public view returns (uint){
        for (uint i = 0; i <= playerid; i++)
        {
            if (details[i].pAddress == _player_address)
                return details[i].intial_player_token;
        }
    }

    // to fetch individual player name as per the address
    function namefetch(address _player_address) public view returns (string memory){
        for (uint i = 0; i <= playerid; i++)
        {
            if (details[i].pAddress == _player_address)
                return details[i].pName;
        }
    }

    //For New Player Details Saving
    //    function setplayerDetails(string memory _pName, uint _intial_player_token) public {
    //        details[playerid] = player_details(msg.sender,_pName,_intial_player_token);
    //        playerid++;
    //        playercount++;
    //        return customtoken.buyTokens(_intial_player_token);
    //    }

    function updateTokenOfUserAfterGamePlay(uint _remaining_token) public {
        for (uint i = 0; i <= playerid; i++)
        {
            if (details[i].pAddress == msg.sender)
                details[i].intial_player_token = _remaining_token;
        }
    }

    function add_player(string memory _pName) public {
        details[playerid].pName = _pName;
        playerid++;
        playercount++;
    }

    //    /* all the setter functions from Custome Token Contract*/
    //    function doTransaction(uint _numberOfTokens) public {
    //        return customtoken.buyTokens(_numberOfTokens);
    //    }

    //For game record saving
    function addGameEvent(uint _betplaced, uint _rollresult, bool _result, uint _ptoken) public {
        require(playercount >= 1);
        outcome[played] = gameRecords(msg.sender, _betplaced, _rollresult, _result, _ptoken, now);
        played++;
    }

    //For login validation
    function login(address log_address) public view returns (bool)
    {
        for (uint i = 0; i <= playerid; i++)
        {
            if (details[i].pAddress == log_address) return true;
        }
        return false;
    }
}
