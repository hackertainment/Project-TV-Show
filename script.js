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
  const options = episodes.map(makeOptionForEpisode);
  const cards = episodes.map(makeCardForEpisode);
  const selectElem = document.querySelector("select");
  const sectionElem = document.querySelector("section"); 
  while (selectElem.firstChild) { 
    selectElem.firstChild.remove(); 
  }
  while (sectionElem.firstChild) { 
    sectionElem.firstChild.remove(); 
  }
  selectElem.append(...options);
  sectionElem.append(...cards);
  document.getElementById("found").innerHTML = `Displaying ${episodes.length}/${episodeList.length} episodes`;
}

function makeOptionForEpisode(episode) {
  const option = document.createElement('option');

  option.value = episode.id;
  option.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;

  return option;
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

function dropdownChangeHandler(event) {
  const episodeId = event.target.value;
  const cardElem = document.getElementById(episodeId);
  const cardOffset = window.pageYOffset+cardElem.getBoundingClientRect().top-document.querySelector('header').offsetHeight-5-5;  //- section padding top px - section margin top px

  for (const child of document.querySelector("section").children) {
    child.classList.remove("highlight");
  }
  cardElem.classList.add("highlight");
  window.scrollTo({top: cardOffset, behavior: "smooth"});
}

window.addEventListener("load", () => {
  document.getElementById("dropdown").addEventListener("change", dropdownChangeHandler);
  document.getElementById("search").addEventListener("input", setup);
});

window.onload = setup;
