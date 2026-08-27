//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  const searchTerm = document.getElementById("search").value.toLowerCase();
  const episodes = episodeList.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm));
  const cards = episodes.map(makeCardForEpisode);
  const sectionElem = document.querySelector("section"); 
  while (sectionElem.firstChild) { 
    sectionElem.firstChild.remove(); 
  }
  document.querySelector("section").append(...cards);
  document.getElementById("found").innerHTML = `Displaying ${episodes.length}/${episodeList.length} episodes`;
}

function makeCardForEpisode(episode) {
    const card = document.getElementById("template-episode").content.cloneNode(true);

    card.querySelector("article").id = episode.id;
    card.querySelector("h3").textContent = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    card.querySelector("img").src = episode.image.medium;
    //card.querySelector("img").alt = "Game of Thrones 1x01";
    card.querySelector("p").outerHTML = episode.summary;

    return card;
}

/*function searchInputHandler(event) {
  const searchTerm = event.target.value.toLowerCase();
  console.log(searchTerm);
  setup();
}*/

window.addEventListener("load", () => {
  document.getElementById("search").addEventListener("input", setup);
});

window.onload = setup;
