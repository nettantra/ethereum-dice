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
            }
        });
    }         //end of render
};            //end of app

$(function () {
    $(window).load(function () {
        App.init();
        $("#name").html("Name : " + name);
    });
});
var name;
$("#submit").click(function () {                  //For login Page user name submit
    {
        name = $("#name").val();
        App.contracts.Dice.deployed().then(function (instance) {
            console.log(instance, App.account);
            console.log(name);
            instance.setplayerDetails({from: App.account}, name)
            // return window.location.replace("roll.html");

            // nm = name;
        });
    }
});
var toke;
$("#token").click(function () {
    document.getElementById('tokens').innerHTML = toke;
    App.contracts.Dice.deployed().then(function (instance) {
        diceInstance = instance;
        return diceInstance.tokenfetch();
    }).then(function (tokenfetch) {
        toke = tokensale.buyTokens;
    }).catch(function (error) {
        console.warn(error);
    });
});

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
        c++;
    } else {
        console.log("you losse");
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
        diceInstance.addGameEvent(setvalue, random_num_by_dice, result_flag, toke)
    });
    reset();
}

function exit() {
    reset();
    return window.location.replace("index.html");
}

function reset() {
    $('#betvalue').val('');
    $(".disable_cls").attr("disabled", false);
    $('.showResult').hide();
}

function validatelogin() {
    var user_add = $('#name').val();
    App.contracts.Dice.deployed().then(function (instance) {
        return instance.login(user_add)
            .then(function (res) {
                console.log(res);
                return window.location.replace("roll.html");
            })
    });
}
