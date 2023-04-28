
    // Translates variations of ItemIDs
    fetch(`https://api.slothpixel.me/api/skyblock/items`)
    .then(response => response.json())
    .then(data => {
        var searchQuery = new URLSearchParams(window.location.search).get("query");
        var word = searchQuery;
        let words = searchQuery.toLowerCase().split(" ");
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        var item = words.join(" ");
        const itemsByName = {};
        for (let key in data) {
            let itemob = data[key];
            itemsByName[itemob.name] = itemob;
        }
        const itemo = itemsByName[item];
        if (!itemo) {
          word = word.toUpperCase();

          
          const romanToArabicMap = {
            "X": 10,
            "IX": 9,
            "VIII": 8,
            "VII": 7,
            "VI": 6,
            "V": 5,
            "IV": 4,
            "III": 3,
            "II": 2,
            "I": 1
          };
          
          const regex = new RegExp(Object.keys(romanToArabicMap).join("|") + "(?![A-Za-z])", "g");

          word = word.replace(regex, match => romanToArabicMap[match] || match);

          console.log(word);

          if (/[0-9]+/g.test(word) && !word.includes("ENCHANTMENT") && !word.endsWith("0")) {
            word = "enchantment" + " " + word;
          }

          if (word && !word.includes("_")) {
                word = word.replace(/ /g, "_")
            }

            word = word.toUpperCase();


            

            

            if (word.includes("ESSENCE")) {
                const wordss = word.split("_");
                [wordss[0], wordss[1]] = [wordss[1], wordss[0]];
                word = wordss.join(" ");
                word = word.replace(/ /g, "_")
            }
            var temId = word;
            console.log(temId)


            let words = word.toLowerCase().split("_");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            var item = words.join(" ");

            if (item.includes("Essence")) {
                const wordss = item.split(" ");
                [wordss[0], wordss[1]] = [wordss[1], wordss[0]];
                item = wordss.join(" ");
            }

            if (item.includes("Enchantment")) {
                item = item.replace("Enchantment", "");
            }
            word = item;
        } else {
          word = itemo.id;
            var temId = word;
            var item = itemo.name;
            console.log(`The ID of ${searchQuery} is ${word}`);
        }
        fetch(`https://api.slothpixel.me/api/skyblock/bazaar/${temId}`)
            .then(response => response.json())
            .then(data => {

				let sellMovingWeek = data["quick_status"]["sellMovingWeek"];
				let buyMovingWeek = data["quick_status"]["buyMovingWeek"];
         
				

				console.log(sellMovingWeek)


                document.title = `${item} prices`
                let buyOrSellSummaryWord = item;
                if (data["buy_summary"][0]["amount"] > 1) {
                    buyOrSellSummaryWord += "s"
                }
		
		let sellSummaryWord = item;
                if (data["sell_summary"][0]["amount"] > 1) {
                    sellSummaryWord += "s"
                }
                
                let buyPrice = data["buy_summary"][0]["pricePerUnit"];
                let sellPrice = data["sell_summary"][0]["pricePerUnit"];

                const container = document.getElementById('prices');
                const etEllerAnnet = document.getElementById("etellerannet");


                if (sellMovingWeek < buyMovingWeek) {
                  // Price go up
                  var percent = Math.ceil(((buyMovingWeek - sellMovingWeek) / buyMovingWeek) * 100);
                  var stringThatIsCorrect = percent + "% more bought than sold";
                  var wtfJegGirOppHvaSkalJegEngangKalleDette = "up";

                  var movingWeek = data["quick_status"]["buyMovingWeek"].toLocaleString() + " bought vs " + data["quick_status"]["sellMovingWeek"].toLocaleString() + " sold";
                } else {
                  // Price go down
                  var percent = Math.ceil(((sellMovingWeek - buyMovingWeek) / sellMovingWeek) * 100);
                  var stringThatIsCorrect = percent + "% more sold than bought";
                  var wtfJegGirOppHvaSkalJegEngangKalleDette = "down";    

                  var movingWeek = data["quick_status"]["sellMovingWeek"].toLocaleString() + " sold vs " + data["quick_status"]["buyMovingWeek"].toLocaleString() + " bought";
                }
                let arr = data["sell_summary"].map(a=>a["pricePerUnit"]);
                let sellSumLength = arr.length;

                if (sellSumLength.toString().at(-1) == 1) {
                  var numberEnding = "st";
                } else if (sellSumLength.toString().at(-1) == 2) {
                  var numberEnding = "nd";
                } else if (sellSumLength.toString().at(-1) == 3) {
                  var numberEnding = "rd";
                } else {
                  var numberEnding = "th";
                }



                sellSumLength -= 1;
                let currentPrice = arr[0]
                let otherPriceToCompare = arr[sellSumLength];

                if (currentPrice < otherPriceToCompare) {
                  var gain = Math.ceil(((otherPriceToCompare - currentPrice) / otherPriceToCompare) * 100);
                  var eo = "down";
                  var increaseDecrease = "decrease";
                } else {
                  var gain = Math.ceil(((currentPrice - otherPriceToCompare) / currentPrice) * 100);
                  var eo = "up";
                  var increaseDecrease = "increase";
                }

					container.innerHTML = `

          <i class="reload fa fa-refresh"></i>

          <div>
				  <h1>Economic Information About ${item}</h1>
				  <h2>Prices</h2>
				  <p>Buy Price: <span class="moni">${buyPrice.toLocaleString()} coins</span> (${data["buy_summary"][0]["amount"]} ${buyOrSellSummaryWord} bought in last buy order)</p>
				  <p>Sell Price: <span class="moni">${sellPrice.toLocaleString()} coins</span> (${data["sell_summary"][0]["amount"]} ${sellSummaryWord} sold in last sell offer)</p>
				  
          <button id="moreInfo" class="moreInfo">More info</button>

          </div>
				`;

        etEllerAnnet.innerHTML = `
        <div class="popup"> 
          <div class="popup-content">
          <h1 class="priceChanges">Price changes</h1>
            <div class="bottom">
            <div>
              <h2>This week</h2>
              <p class="${wtfJegGirOppHvaSkalJegEngangKalleDette}"><i class="fa fa-arrow-circle-${wtfJegGirOppHvaSkalJegEngangKalleDette}"></i> ${stringThatIsCorrect}</p>
              <p>${movingWeek}</p>
              
            </div>

            <div class="lastThirty">
              <h2>Compared to ${sellSumLength + 1}${numberEnding} sell offer</h2>
              <p class="${eo}"><i class="fa fa-arrow-circle-${eo}"></i> ${gain}% ${increaseDecrease}</p>
              <p><span class="moni">${currentPrice.toLocaleString()}</span> coins &#40;current&#41; vs <span class="moni">${otherPriceToCompare.toLocaleString()}</span> coins &#40;${sellSumLength + 1}${numberEnding}&#41;</p>
              
            </div>
            </div>
          </div>
        </div>
        `
                const goback = document.getElementById("goback");
                goback.innerHTML = `<i class="fa fa-long-arrow-left"></i> Home (Esc)`

                document.querySelector('.moreInfo').addEventListener('click', () => {
                  document.querySelector('.popup').style.display = 'flex';
                });

                document.querySelector('.popup').addEventListener('click', (e) => {
                  if (!document.querySelector('.popup-content').contains(e.target)) {
                    document.querySelector('.popup').style.display = 'none';
                  }
                });

                document.querySelector('.reload').addEventListener('click', function() {
                  window.location.reload();
                })

            })
            .catch(error => {
                console.error(error);
                const container = document.getElementById('prices');
                container.innerHTML = '<h1>invalid item</h1>';

                const goback = document.getElementById("goback");
                goback.innerHTML = `<i class="fa fa-long-arrow-left"></i> Home (Esc)`
            });
            
    })
    .catch(error => {
        console.error(error);
    }); 

function clicked() {
    window.location.href = "index.html";
    document.title = "Bazaar Price Tracker";
}

function querySwap() {
  var newQuery = document.getElementById("searchInput").value;
  searchQuery = newQuery;
  window.location.href = "item.html?query=" + searchQuery;
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    clicked();
  }

  if (event.key === "Enter" && document.activeElement === document.getElementById("searchInput")) {
    querySwap();
  }
});

