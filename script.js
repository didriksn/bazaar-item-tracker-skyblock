
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

					container.innerHTML = `
				  <h1>Economic Information About ${item}</h1>
				  <h2>Prices</h2>
				  <p>Buy Price: <span class="moni">${buyPrice.toLocaleString()} coins</span> (${data["buy_summary"][0]["amount"]} ${buyOrSellSummaryWord} bought in last buy order)</p>
				  <p>Sell Price: <span class="moni">${sellPrice.toLocaleString()} coins</span> (${data["sell_summary"][0]["amount"]} ${sellSummaryWord} sold in last sell offer)</p>
				  
          <button id="moreInfo" class="moreInfo">More info</button>
				`;

        etEllerAnnet.innerHTML = `
        <div class="popup"> 
          <div class="popup-content">
            <h2>This week</h3>
            <p class="${wtfJegGirOppHvaSkalJegEngangKalleDette}"><i class="fa fa-arrow-circle-${wtfJegGirOppHvaSkalJegEngangKalleDette}"></i> ${stringThatIsCorrect}</p>
            <p>${movingWeek}</p>
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

