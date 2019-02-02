App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function () {
        $.getJSON("Dice.json", function (Dice) {
            App.contracts.Dice = TruffleContract(Dice);
            App.contracts.Dice.setProvider(App.web3Provider);
            return App.render();
        });
    },

    render: function (event) {

        var gameInstance;
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Id : " + account);
                return App.getInitialTOkens(), App.getplayername();

            }
        });
    },  //end of render

    getInitialTOkens: function () {
        App.contracts.Dice.deployed().then(function (instance) {
            diceInstance = instance
            return diceInstance.tokenfetch(App.account);
        }).then(function (tokenfetch) {
            console.log(tokenfetch);
            toke = tokenfetch;
            document.getElementById('tokens').innerHTML = toke;
        }).catch(function (error) {
            console.warn(error);
        });
    },

    getplayername: function () {
        App.contracts.Dice.deployed().then(function (instance) {
            diceInstance = instance
            return diceInstance.namefetch(App.account);
        }).then(function (namefetch) {
            console.log(namefetch);
            document.getElementById('name').innerHTML = namefetch;
            name = namefetch;
        }).catch(function (error) {
            console.warn(error);
        });
    }


};            //end of app

$(function () {
    $(window).load(function () {
        App.init();
        $("#accountAddress").html("Id : " + App.account);

    });
});
var name, toke, intial_player_token, returned_name;

// $("#submit").click(function () {
//     {
//         add = $("#add").val();
//         // intial_player_token = $("#initialtoken").val();
//         // App.contracts.Dice.deployed().then(function (instance) {
//         //     console.log(instance, App.account);
//         //     console.log(name);
//         //     instance.setplayerDetails(name, intial_player_token)
//         //     $("#showaccount").html("Id : " + App.account);
//         //     $("#tokens").html(+intial_player_token);
//         //     toke = intial_player_token;
//         //
//         // });
//         App.contracts.Dice.deployed().then(function (instance) {
//             diceInstance = instance;
//             diceInstance.add_player(add);
//             console.log(add);
//         }).catch(function (error) {
//             console.warn(error);
//         });
//
//         return window.location.replace("index.html");
//     }
// });

function submit(){
    playername = $("#playername").val();
    App.contracts.Dice.deployed().then(function (instance) {
        instance.add_player(playername)
    });
}

reset();
var bets;

var valu, count = 0, c = 0, b = 0, random_num_by_dice, setvalue, timestamp, result_flag;

function roll() {

    setvalue = $('#betvalue').val();
    random_num_by_dice = Math.floor(1 + Math.random() * 6);
    $(".disable_cls").attr("disabled", "disabled");
    $('.showResult').show();
    timestamp = Math.floor(Date.now() / 1000);
    if (setvalue == random_num_by_dice) {
        console.log("you won");
        result_flag = true;
        toke += 5;
        console.log(toke);
        c++;
    } else {
        console.log("you losse");
        console.log(toke);
        result_flag = false;
        toke -= 5;
        b++;
    }

    document.getElementById('tokens').innerHTML = toke;
    document.getElementById('dice').innerHTML = random_num_by_dice;
    $("#wins").text("   Wins: " + c);
    $("#lose").text("   Loss: " + b);

    if (setvalue == random_num_by_dice) {
        document.getElementById("result").innerHTML = "Win <br>";
    }
    else {
        document.getElementById("result").innerHTML = "Lost <br>";
    }
    alert("Press Play Again To Save Your Result And Try Your Luck Again");
}

function again() {
    App.contracts.Dice.deployed().then(function (instance) {
        diceInstance = instance;
        diceInstance.addGameEvent(setvalue, random_num_by_dice, result_flag, toke);
        diceInstance.updateTokenOfUserAfterGamePlay(toke, {from: App.account});
    });


    reset();
}

function exit() {

    var r = confirm("Are You Sure To Exit? Your Data Will be Saved For Future Use");
    if (r == true) {
        App.contracts.Dice.deployed().then(function (instance) {
            diceInstance = instance;
            diceInstance.addGameEvent(setvalue, random_num_by_dice, result_flag, toke)
            diceInstance.updateTokenOfUserAfterGamePlay(toke, {from: App.account});
        });
        reset();
        return window.location.replace("index.html");
    }
    else {
        reset();
        App.contracts.Dice.deployed().then(function (instance) {
            diceInstance = instance;
            diceInstance.addGameEvent(setvalue, random_num_by_dice, result_flag, toke)
            diceInstance.updateTokenOfUserAfterGamePlay(toke, {from: App.account});
        });
    }

}

function reset() {
    $('#betvalue').val('');
    $(".disable_cls").attr("disabled", false);
    $('.showResult').hide();

}

function validatelogin() {
    var user_add = $('#add').val();
    //For login Validation
    App.contracts.Dice.deployed().then(function (instance) {
        return instance.login(user_add)
            .then(function (res) {
                console.log(res);
                if (res == true)
                    return window.location.replace("roll.html");
                else
                    alert("Sorry Wrong Credentials");
            })
    });
}
