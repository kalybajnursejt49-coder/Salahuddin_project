'use strict';

const groups = [
  {id:1,sport:'karate',branch:'uly-dala-55',days:[1,3,5],time:'09:30–10:30',min:8,max:13},
  {id:2,sport:'karate',branch:'uly-dala-55',days:[1,3,5],time:'16:30–18:00',min:13,max:100},
  {id:3,sport:'karate',branch:'uly-dala-55',days:[1,3,5],time:'18:00–19:00',min:4,max:6},
  {id:4,sport:'karate',branch:'uly-dala-55',days:[1,3,5],time:'18:45–20:00',min:7,max:9},
  {id:5,sport:'karate',branch:'uly-dala-55',days:[1,3,5],time:'19:45–21:15',min:10,max:17},
  {id:6,sport:'muay-thai',branch:'uly-dala-55',days:[1,3,5],time:'21:15–22:30',min:18,max:100},
  {id:7,sport:'muay-thai',branch:'uly-dala-55',days:[2,4],time:'20:00–21:15',min:8,max:16},
  {id:8,sport:'muay-thai',branch:'uly-dala-55',days:[6],time:'11:15–12:30',min:8,max:16},
  {id:9,sport:'judo',branch:'uly-dala-55',days:[2,4],time:'18:30–19:45',min:7,max:16},
  {id:10,sport:'judo',branch:'uly-dala-55',days:[6],time:'12:30–14:00',min:7,max:16},
  {id:11,sport:'taekwondo',branch:'uly-dala-55',days:[2,4],time:'09:00–10:15',min:6,max:16},
  {id:12,sport:'taekwondo',branch:'uly-dala-55',days:[2,4],time:'17:00–18:15',min:6,max:16},
  {id:13,sport:'taekwondo',branch:'uly-dala-55',days:[6],time:'10:00–11:15',min:6,max:16},
  {id:14,sport:'karate',branch:'turan-19',days:[2,4],time:'09:00–10:00',min:5,max:16},
  {id:15,sport:'karate',branch:'turan-19',days:[2,4],time:'18:30–19:30',min:5,max:16},
  {id:16,sport:'karate',branch:'turan-19',days:[6],time:'10:00–11:00',min:5,max:16}
];

const sportNames = {karate:'Kyokushin Karate',taekwondo:'Taekwondo',judo:'Judo','muay-thai':'Muay Thai'};
const branchNames = {'uly-dala-55':'Uly Dala 55','turan-19':'Turan 19'};
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function element(tag, classes, text) {
  const node = document.createElement(tag);
  if (classes) node.className = classes;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderList(container, items, createItem) {
  container.replaceChildren();
  for (const item of items) container.append(createItem(item));
  return items.length;
}

function suitable(group, age) {
  return Number.isInteger(age) && age >= group.min && age <= group.max;
}

function groupLabel(group) {
  return `${sportNames[group.sport]} · ${branchNames[group.branch]} · ${group.days.map(day => dayNames[day]).join('/')} ${group.time} · ages ${group.min}–${group.max === 100 ? 'adult' : group.max}`;
}

const home = document.querySelector('#about-club');
if (home) {
  const sports = Object.keys(sportNames);
  const sport = sports[Math.floor(Math.random() * sports.length)];
  home.append(element('p','form-note',`Explore ${sportNames[sport]} and check the published schedule before visiting.`));
}
