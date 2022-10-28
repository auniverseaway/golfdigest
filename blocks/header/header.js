import { readBlockConfig, loadCSS, decorateIcons } from '../../scripts/scripts.js';
import { leaderboardTemplate, headerTemplate } from '../templates.js';
import { loadJsonData } from '../../utils/utils.js';

const LEADERBOARD_URL = '/bin/leaderboard/leaders.json';

let loadBehaviors = [];
let roots = Array.from(document.querySelectorAll('li.nav-level-0'));
let menuState = false;
const openClass = 'is-Open';
const activeClass = 'is-Active';

function handleExpand(expandButton) {
  const item = expandButton.closest('.o-NavMenu__a-NavListItem');
  const expanded = item.parentNode.querySelector('.expanded');

  if(expanded === item) {
    item.classList.toggle('expanded');
  }
  else {
    item.classList.toggle('expanded');
    if(!item.classList.contains('nav-level-0')) expanded?.classList.remove('expanded');
  }

  handleRootExpand();
}

function handleRootExpand() {
  const anyExpanded = roots.reduce( (expanded, current) => expanded || current.classList.contains('expanded'), false )
  for(const root of roots) {
    if(!anyExpanded) {
      root.style.display = 'block'
    }
    else  {
      root.style.display = null;
    }
  }
}

function toggleNav(state) {
  menuState = state = (typeof state === 'undefined') ? !menuState : state;
  // toggleSearch(false);
  // setNavTop();
  let menuBtn = document.querySelector('.o-Header__a-MenuButton');
  let menuEl = document.querySelector('.o-Header__m-NavMenu');
  menuBtn.classList.toggle(activeClass);
  menuEl.classList.toggle(openClass);
  document.querySelector('.o-Header__m-Overlay').style = `display: ${state ? 'block' : 'none'}`;
}

function registerMenuEvents() {
  roots = Array.from(document.querySelectorAll('li.nav-level-0'));
  let menuBtn = document.querySelector('.o-Header__a-MenuButton');
  let menuCloseBtn = document.querySelector('.o-Header__a-Close');
  menuBtn.onclick = function(event) {
    toggleNav();
  };
  menuCloseBtn.onclick = function(event) {
    toggleNav(false);
  }
}

function createLeaderboardPlayerHTML(data) {
  let html = `
  <div class="o-Leaderboard__m-Players__m-Player">
      <div class="o-Leaderboard__m-Players__m-PlayerMain">
          <h4 class="o-Leaderboard__m-Players__m-PlayerMain__a-Place">${data.Position}</h4>
          <div class="o-Leaderboard__m-Players__m-PlayerMain__a-Name">
            <i style="background-image:url(${data.CountryFlag}});"></i><h5>${data.FirstName} ${data.LatsName}</h5>
          </div>
          <p class="o-Leaderboard__m-Players__m-PlayerMain__a-Record">${data.Rounds.length} ${data.TotalScoreToPar}</p>
      </div>
      <div class="o-Leaderboard__m-Players__m-Player__a-PlayerScore">
          <p>${data.TotalScoreToPar}</p>
      </div>
  </div>
  `;
  return html.trim();
}

function createLeaderBoard(block) {
  const leaderboard = leaderboardTemplate({});
  block.insertAdjacentHTML('beforebegin', leaderboard);
  const playersEl = document.body.querySelector('.o-Leaderboard__m-Players');
  loadJsonData(LEADERBOARD_URL).then(json => {
    const data = json.data;
    if (data) {
      for (let player of data) {
        let playerHTML = createLeaderboardPlayerHTML(player);
        let div = document.createElement('div');
        div.innerHTML = playerHTML;
        playersEl.append(div.firstChild);
      }
    }
  });
}

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

function buildHeader(block) {
  block.innerHTML = headerTemplate({});
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // insert leaderboard
  createLeaderBoard(block);

  // build header
  buildHeader(block);

  registerMenuEvents();

  // fetch nav content
  /*
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);
  }
  */
}
