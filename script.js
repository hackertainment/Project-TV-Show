//You can edit ALL of the code here
//function setup() {
//  const allEpisodes = getAllEpisodes();
//  makePageForEpisodes(allEpisodes);
//}

const showList = [];
const episodeLists = [];

async function requestShow() {
  //const showUrl = "https://simulatehttpcode.vercel.app/statuscode?q=404";
  const showUrl = "https://api.tvmaze.com/shows";
  const showResponse = await fetch(showUrl);
  const showJson = showResponse.json();
  //const showJson = await showResponse.json();

  return showJson;
}

async function requestEpisode(showId) {
  //const episodeUrl = "https://simulatehttpcode.vercel.app/statuscode?q=404";
  const episodeUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;
  const episodeResponse = await fetch(episodeUrl);
  const episodeJson = await episodeResponse.json();

  return episodeJson;
};

function setup() {
  document.getElementById("root").textContent = `LOADING...`;
  // when website loaded, fetch TV shows (and cache shows and render show selector)
  const promise = requestShow()
    .then((json) => {
      const shows = json.sort((a, b) => a.name.localeCompare(b.name));
      const optionElems = shows.map(makeOptionForShow);
      const selectElem = document.getElementById("select-show");
      for (let i=selectElem.options.length-1; i>=1; i--) {
        selectElem.remove(i);
      }
      selectElem.append(...optionElems);
      showList.push(...shows);
      document.querySelector("main").classList.remove("invisible");
    })
    .catch((error) => {
      console.error(error.message);
      document.getElementById("root").textContent = `ERROR: ${error.message}!`;
    });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  const searchTerm = document.getElementById("input-search").value.toLowerCase();
  const episodes = episodeList.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm));
  const optionElems = episodes.map(makeOptionForEpisode);
  const articleElems = episodes.map(makeArticleForEpisode);
  const selectElem = document.getElementById("select-episode");
  const sectionElem = document.querySelector("section");

  // when display cards, render episode selector and the cards
  for (let i=selectElem.options.length-1; i>=1; i--) {
    selectElem.remove(i);
  }
  while (sectionElem.firstChild) { 
    sectionElem.firstChild.remove(); 
  }
  selectElem.append(...optionElems);
  sectionElem.append(...articleElems);
  document.getElementById("status-message").innerHTML = `Displaying ${episodes.length}/${episodeList.length} episodes`;
}

function makeOptionForShow(show) {
  const optionElem = document.createElement('option');

  optionElem.value = show.id;
  optionElem.textContent = show.name;

  return optionElem;
}

function makeOptionForEpisode(episode) {
  const optionElem = document.createElement('option');

  optionElem.value = episode.id;
  optionElem.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;

  return optionElem;
}

function makeArticleForEpisode(episode) {
    const card = document.getElementById("template-episode").content.cloneNode(true);
    const selectElem = document.getElementById("select-show");

    card.querySelector("article").id = episode.id;
    card.querySelector("h3").textContent = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    card.querySelector("img").src = episode.image.medium;
    card.querySelector("img").alt = selectElem.options[selectElem.selectedIndex].text;
    card.querySelector("p").outerHTML = episode.summary;

    return card;
}

function showChangeHandler(event) {
  const showId = event.target.value;

  if (!episodeLists[showId]) {  // if new show is chosen, then fetch its episodes (and cache episodes and display cards)
    const promise = requestEpisode(showId)
      .then((json) => {
        episodeLists[showId] = (showId=="0" ? [json] : json);
        makePageForEpisodes(showId=="0" ? [] : json);
      })
      .catch((error) => {
        console.error(error.message);
        document.getElementById("root").textContent = `ERROR: ${error.message}!`;
        document.querySelector("main").classList.add("invisible");
      });
  }
  else if (showId=="0") {  // if no show is chosen, then clear screen
    makePageForEpisodes([]);
  }
  else {  // if old show is chosen, then display cards (from cache episodes)
    makePageForEpisodes(episodeLists[showId]);
  }
}

function episodeChangeHandler(event) {
  const episodeId = event.target.value;
  const articleElem = (episodeId=="0" ? null : document.getElementById(episodeId));
  const articleOffset = (episodeId=="0" ? 0 : window.pageYOffset+articleElem.getBoundingClientRect().top-document.querySelector('header').offsetHeight-5-5);  // - section padding top px - section margin top px

  // when episode is chosen, hightlight its card and jump to the card
  for (const child of document.querySelector("section").children) {
    child.classList.remove("highlight");
  }
  if (articleElem!=null) {
    articleElem.classList.add("highlight");
  }
  window.scrollTo({top: articleOffset, behavior: "smooth"});
}

function searchInputHandler(event) {
  const showId = document.getElementById("select-show").value;

  // when typing in search box, live update display cards
  makePageForEpisodes(showId=="0" ? [] : episodeLists[showId]);
}

window.addEventListener("load", () => {
  document.getElementById("select-show").addEventListener("change", showChangeHandler);
  document.getElementById("select-episode").addEventListener("change", episodeChangeHandler);
  document.getElementById("input-search").addEventListener("input", searchInputHandler);
});

window.onload = setup;
