var curDay = 1;
var plantArr = [];
var activePlant = 0;
var activeTab;

class Plant
{
    water = 100;
    soil = "Loess";
    sun = 100;
    name = "Phyllis";
    living = true;
    inSun = false;
    waterToday = false;

    constructor()
    {

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
    for(var i = 0; i < 4; i++) // Only four plants for now.
    {
        plantArr.push(new Plant());
    }
}

function advanceDay()
{
    curDay++;
    document.getElementById("dayCounter").innerHTML = curDay; // Update the current day counter on the page.
    for (const p of plantArr)
    {
        p.waterToday = false;
        if(p.inSun)
        {
            p.sun += (randomInRange(5, 10)); // If the plant is in the sun, increase its sun amount
        }
        else
        {
            p.sun -= (randomInRange(5, 13)); // If the plant is not, decrease it
        }

        p.water -= (randomInRange(3, 14)); // Plants will always lose water

        if(p.water <= 10)
        {
            alert("Be careful! One of your plants is dangerously low on water!");
        }

        if(p.sun <= 10)
        {
            alert("Be careful! One of your plants isn't getting enough sunlight!");
        }

        if(p.sun >= 100)
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
    }
    updateInfo(activeTab);
}

function gameHandler()
{
    document.getElementById("ingame").removeAttribute("hidden"); // Start the game by unhiding the entire game panel.
    document.getElementById("gamepanel").removeAttribute("hidden");
    document.getElementById("dayCounter").innerHTML = curDay;
}

function waterPlant()
{
    var watered = plantArr[activePlant];
    if(watered.waterToday)
    {
        alert("Error: You've already watered that plant today!");
    }
    else
    {
        watered.waterToday = true;
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
    if(curPlant.inSun)
    {
        alert("Error: That plant is already in the sun!");
    }
    else
    {
        curPlant.inSun = true; // Will cause the plant to gain sun over the days instead of losing it.
        alert(`You've set plant #${activePlant + 1} in the sun. It will now replenish its sun over the days. Be careful that it does not get too much!`)
        updateInfo(activeTab);
    }
}

function removeSunPlant()
{
    var curPlant = plantArr[activePlant];
    if(!curPlant.inSun)
    {
        alert("Error: That plant is not in the sun!");
    }
    else
    {
        curPlant.inSun = false;
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
    tab.innerHTML = `Plant #${(activePlant + 1)}<br>
                     Plant Name: ${plant.name}<br>
                     Plant Soil: ${plant.soil}<br>
                     Plant Water: ${plant.water}%<br>
                     Plant Sunlight: ${plant.sun}%<br>`;
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
        button.id = 'plant1';
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
                tab.innerHTML = `Plant #${(number + 1)}<br>
                                Plant Name: ${plant.name}<br>
                                Plant Soil: ${plant.soil}<br>
                                Plant Water: ${plant.water}%<br>
                                Plant Sunlight: ${plant.sun}%<br>`;
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