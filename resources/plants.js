var curDay = 1;
var plantArr = [];
var activePlant = 0;
var activeTab;
var actionPoints = 3;

var waterShortage = false;
var timesWatered = 0;

var waterEvent = false;
var sunEvent = false;

const soilType = ["Loam", "Sand", "Silt", "Peat"];
const plantType = ["Basil", "Cactus", "Succulent", "Pothos"]; //Basil matches with loam, cactus matches with sand, succulent matches with silt, pothos matches with peat

class Plant
{
    water = 100;
    soil = "Error";
    plantKind = "Error";
    sun = 100;
    name = "[unnamed]";
    living = true;
    inSun = false;
    waterToday = false;
    exempt = false;

    constructor()
    {
        var soilNum = randomInRange(0,4);
        this.soil = soilType[soilNum];
        var plantNum = randomInRange(0,4);
        this.plantKind = plantType[plantNum];
    }
}

window.onload = createPlants();

function randomInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function createPlants()
{
    for(var i = 0; i < 4; i++)
    {
        plantArr.push(new Plant());
    }
}

function advanceDay()
{
    if(Math.random() < 0.1) // 10% chance of any random event occurring
    {
        actionPoints = 3;
        switch(randomInRange(1, 8))
        {
            case 1:
                alert("Oh no, there's a water shortage! You can only water one plant today!");
                waterShortage = true;
                break;
            case 2:
                sunEvent = true;
                alert("Oh no, it's a cloudy day! All of your plants lose sunlight!");
                for (const p of plantArr)
                {
                    p.sun -= randomInRange(9, 18);
                    if(p.sun <= 0) // Insta-game-over prevention
                    {
                        p.sun = 1;
                    }
                }
                break;
            case 3:
                var sick = randomInRange(0, 4);
                var sickPlant = plantArr[sick];
                if(sickPlant.name != "[unnamed]")
                {
                    alert(`Oh no, ${sickPlant.name} became sick and lost half its health!`);
                }
                else
                {
                    alert(`Oh no, plant #${sick + 1} became sick and lost half its health!`);
                }
                plantArr[sick].water = Math.round(plantArr[sick].water / 2)
                plantArr[sick].sun = Math.round(plantArr[sick].sun / 2);
                break;
            case 4:
                alert("Oh no, you're feeling sick today! You only get one action point!");
                actionPoints = 1;
                break;
            case 5:
                waterEvent = true;
                alert("Good news, it's a rainy day! All of your plants regain water!");
                for (const p of plantArr)
                {
                    p.water += randomInRange(25, 40);
                    if(p.water > 100) // Overflow prevention
                    {
                        p.water = 100;
                    }
                }
                break;
            case 6:
                sunEvent = true;
                alert("Good news, the sun is strong today! All of your plants regain sunlight!");
                for (const p of plantArr)
                {
                    p.sun += randomInRange(25, 40);
                    if(p.sun > 100) // Insta-game-over prevention
                    {
                        p.sun = 100;
                    }
                }
                break;
            case 7:
                var lucky = randomInRange(0, 4);
                var luckyPlant = plantArr[lucky];
                alert(`Good news, plant #${lucky + 1} has not lost any health today!`);
                luckyPlant.exempt = true;
                break;
            default:
                alert("Error, if you're reading this, I messed up somehow.");
                break;
        }
    }
    else
    {
        actionPoints = 3;
    }

    curDay++;
    document.getElementById("dayCounter").innerHTML = curDay; // Update the current day counter on the page.
    document.getElementById("actpt").innerHTML = actionPoints; // Update the current action point counter on the page.
    for (const p of plantArr)
    {
        p.waterToday = false;
        if(!p.exempt)
        {
            if(p.inSun && !sunEvent)
            {
                p.water -= (randomInRange(1, 4)); // Plants will lose water at a slightly faster rate in the sun.
                p.sun += (randomInRange(5, 10)); // If the plant is in the sun, increase its sun amount
            }
            else if (!sunEvent)
            {
                p.sun -= (randomInRange(5, 13)); // If the plant is not, decrease it
            }
    
            if((p.plantNum == p.soilNum) && !waterEvent)
            {
                p.water -= (randomInRange(3, 14)); // Plants will always lose water
            }
            else if (!waterEvent)
            {
                p.water -= (randomInRange(8,19)); //If the soil is not correct, the plant will lose water at a faster rate
            }
        }

        if(p.water <= 25)
        {
            alert("Be careful! One of your plants is dangerously low on water!");
        }

        if(p.sun <= 10)
        {
            alert("Be careful! One of your plants isn't getting enough sunlight!");
        }

        if(p.sun > 100)
        {
            alert("Be careful! One of your plants is getting too much sunlight!");
        }

        if(p.water <= 0)
        {
            alert("You neglected one of your plants and it ran out of water. You lose!");
            window.location.reload();
        }

        if(p.sun <= 0)
        {
            alert("One of your plants got no sunlight and withered away. You lose!");
            window.location.reload();
        }

        if(p.sun >= 110)
        {
            alert("You let one of your plants cook in the sun and it died. You lose!");
            window.location.reload();
        }

        else if(curDay == 40)
        {
            if (confirm("Congratulations, you've gotten to day 40, and all your friend's plants are alive! You win! Press OK to play infinitely and take care of the plants, or cancel to quit now."))
            {
                alert("Alright, have fun!");
            }
            else
            {
                curDay++; // Avoiding an infinite loop bug.
                alert("Thanks for playing!");
                window.location.reload();
            }
        }
        p.exempt = false;
    }
    waterShortage, waterEvent, sunEvent = false;
    updateInfo(activeTab);
}

function gameHandler()
{
    document.getElementById("ingame").removeAttribute("hidden"); // Start the game by unhiding the entire game panel.
    document.getElementById("gamepanel").removeAttribute("hidden");
    document.getElementById("dayCounter").innerHTML = curDay;
    document.getElementById("actpt").innerHTML = actionPoints;
    alert(`Here's the deal: your friend has taken off on a 40-day study abroad program, and they want you to take care of their houseplants while they're gone.\n
           They're counting on you to keep their plants alive and well! Click on the buttons representing the plants to check each plant's status.\n
           You may only complete a certain number of actions per day. Every action consumes 1 point. Check the "Action Points" section beneath the plants to see how many you have.`);
}

function waterPlant()
{
    var watered = plantArr[activePlant];
    if(actionPoints == 0)
    {
        alert("Error: You don't have an action point to spend on this!");
    }
    else if(waterShortage && timesWatered >= 1)
    {
        alert("Error: No can do, you're in a water shortage!");
    }
    else
    {
        timesWatered++;
        actionPoints--;
        watered.water += (randomInRange(16, 28));
        if(watered.water >= 100) // Unlike sun, water can't go over 100%.
        {
            watered.water = 100;
        }
        updateInfo(activeTab);
    }
}

function setSunPlant()
{
    var curPlant = plantArr[activePlant];
    if(actionPoints == 0)
    {
        alert("Error: You don't have an action point to spend on this!");
    }
    else if(curPlant.inSun)
    {
        alert("Error: That plant is already in the sun!");
    }
    else
    {
        curPlant.inSun = true; // Will cause the plant to gain sun over the days instead of losing it.
        actionPoints--;
        alert(`You've set plant #${activePlant + 1} in the sun. It will now replenish its sun over the days. Be careful that it does not get too much!`)
        updateInfo(activeTab);
    }
}

function removeSunPlant()
{
    var curPlant = plantArr[activePlant];
    if(actionPoints == 0)
    {
        alert("Error: You don't have an action point to spend on this!");
    }
    else if(!curPlant.inSun)
    {
        alert("Error: That plant is not in the sun!");
    }
    else
    {
        curPlant.inSun = false;
        actionPoints--;
        alert(`You've removed plant #${activePlant + 1} from the sunlight.`)
        updateInfo(activeTab);
    }
}

function renamePlant()
{
    var curPlant = plantArr[activePlant];
    var newName = prompt(`What do you want to rename plant #${activePlant + 1}? (min: 1, max: 20)`, curPlant.name);
    if(newName.length <= 20 && newName.length >= 1) // We don't want people to name their plants a whole novel
    {
        curPlant.name = newName;
        updateInfo(activeTab);
    }
    else
    {
        alert("Invalid name. Try again?");
    }
}

function updateInfo(tab)
{
    var plant = plantArr[activePlant];
    document.getElementById("actpt").innerHTML = actionPoints;
    tab.innerHTML = `<b><u>Plant #${(activePlant + 1)}</b></u><br>
                     <b>Plant Type:</b> ${plant.plantKind}<br>
                     <b>Plant Name:</b> ${plant.name}<br>
                     <b>Plant Soil:</b> ${plant.soil}<br>
                     <b>Plant Water:</b> ${plant.water}%<br>
                     <b>Plant Sunlight:</b> ${plant.sun}%<br>`;
}

function asTabs(node) // Appropriated from very old project of Drew's.
{
    // builds array containing node's child elements
    var childElements = document.querySelectorAll('[data-tabname]');
    var tabs = [];
    for (var i = 0; i < childElements.length; i++)
    {
        tabs.push(childElements[i]);
    }

    // builds and appends list of <button> elements
    var buttonList = document.createElement('div');
    tabs.forEach(function(tab, index)
    {
        var button = document.createElement('button');
        var plantDesc = plantArr[index];
        if(plantDesc.plantKind == "Basil")
        {
            button.id = 'plant1';
        }
        else if(plantDesc.plantKind == "Cactus")
        {
            button.id = 'plant2';
        }
        else if(plantDesc.plantKind == "Succulent")
        {
            button.id = 'plant3';
        }
        else if(plantDesc.plantKind == "Pothos")
        {
            button.id = 'plant4';
        }

        buttonList.appendChild(button);
        button.addEventListener('click', function()
        {
            selectTab(index);
        });
    });
    node.insertBefore(buttonList, node.firstChild);

    // function that event listener will call
    function selectTab(index)
    {
        tabs.forEach(function(tab, i)
        {
            if (index == i)
            {
                var number = parseInt(tab.getAttribute('data-tabname'));
                var plant = plantArr[number];
                activePlant = number;
                activeTab = tab;
                tab.innerHTML = `<b><u>Plant #${(activePlant + 1)}</b></u><br>
                                 <b>Plant Type:</b> ${plant.plantKind}<br>
                                 <b>Plant Name:</b> ${plant.name}<br>
                                 <b>Plant Soil:</b> ${plant.soil}<br>
                                 <b>Plant Water:</b> ${plant.water}%<br>
                                 <b>Plant Sunlight:</b> ${plant.sun}%<br>`;
                tab.style.display = '';
            }
            else
            {
                tab.style.display = 'none';
            }
        });
    }
    selectTab(0); // to initially show first tab
}asTabs(document.querySelector("plant-panel"));

