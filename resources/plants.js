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

    constructor(name)
    {
        //this.name = name; // Unused right now. Maybe in the future you can name your plants.
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
    document.getElementById("dayCounter").innerHTML = curDay;
    for (const p of plantArr)
    {
        p.water -= (randomInRange(3, 14));
        if(p.water <= 0)
        {
            alert("You let one of your plants die. You lose!");
        }
    }
    updateInfo(activeTab);
}

function gameHandler()
{
    document.getElementById("ingame").removeAttribute("hidden");
    document.getElementById("gamepanel").removeAttribute("hidden");
    document.getElementById("dayCounter").innerHTML = curDay;
}

function waterPlant()
{
    var watered = plantArr[activePlant];
    watered.water += (randomInRange(16, 28));
    if(watered.water >= 100)
    {
        watered.water = 100;
    }
    updateInfo(activeTab);
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

function asTabs(node)
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