//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = `${rootElem.textContent}<span class="credit"><span class="creative-commons">CC</span> Data source at <a href="https://tvmaze.com/">TVmaze API</a> under <a href="http://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> license.</span>`;

  for (const i of episodeList) {
    const card = document.getElementById("template-episode").content.cloneNode(true);
    card.querySelector("section").id = i.id;
    card.querySelector("h3").textContent = `${i.name} - S${i.season.toString().padStart(2, "0")}E${i.number.toString().padStart(2, "0")}`;
    card.querySelector("img").src = i.image.medium;
    //card.querySelector("img").alt = "Game of Thrones 1x01";
    card.querySelector("p").outerHTML = i.summary;
    document.body.append(card);
  }
}

window.onload = setup;
