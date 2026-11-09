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

function cleanPersonName(value) {
  return value.replace(/[^\p{L}\s'-]/gu,'').replace(/\s{2,}/g,' ');
}

function validPersonName(value) {
  const name = value.trim();
  return name.length >= 2 && /^\p{L}+(?:[ '-]\p{L}+)*$/u.test(name);
}

function cleanPhone(value) {
  const allowed = value.replace(/[^\d+()\s-]/g,'');
  const plus = allowed.trimStart().startsWith('+');
  const normalized = (plus ? '+' : '') + allowed.replace(/\+/g,'').trimStart();
  const maximumDigits = /^\+?7/.test(normalized) ? 11 : 10;
  let digits = 0;
  return [...normalized].filter(character => {
    if (!/\d/.test(character)) return true;
    digits += 1;
    return digits <= maximumDigits;
  }).join('');
}

function validPhone(value) {
  const phone = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g,'');
  return phone.startsWith('+')
    ? digits.length === 11 && digits.startsWith('7')
    : digits.length === 10 || (digits.length === 11 && digits.startsWith('7'));
}

const home = document.querySelector('#about-club');
if (home) {
  const questions = [
    {
      question:'Where do classes take place?',
      answer:'The published groups meet at Uly Dala 55 or Turan 19. Check the branch listed for your group before visiting.'
    },
    {
      question:'Does the trial form book a place?',
      answer:'No. The form is a front-end demonstration. It does not send your details or reserve a place.'
    },
    {
      question:'Is the timetable current?',
      answer:'The group times come from academy posts published in September 2025. They may have changed, so confirm the current timetable with the academy.'
    }
  ];
  const faq = element('section','content-panel col-12 bg-white border rounded-3 shadow-sm p-4');
  faq.append(element('h2','', 'Questions before your first class'));
  for (const item of questions) {
    const details = element('details','border rounded-3 p-3 mb-2');
    details.append(element('summary','fw-semibold',item.question));
    details.append(element('p','mb-0 mt-2',item.answer));
    faq.append(details);
  }
  home.parentElement.append(faq);
}

const profileKey = 'salahuddin-local-profile';
const savedGroupsKey = 'salahuddin-selected-groups';

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

let localProfile = readLocal(profileKey, {});
if (!localProfile || typeof localProfile !== 'object' || Array.isArray(localProfile)) localProfile = {};
let savedGroupIds = readLocal(savedGroupsKey, []);
savedGroupIds = Array.isArray(savedGroupIds)
  ? [...new Set(savedGroupIds.filter(id => groups.some(group => group.id === id)))]
  : [];

const pageHeader = document.querySelector('header#top');
if (pageHeader) {
  const titleBlock = element('div','flex-grow-1');
  titleBlock.append(pageHeader.querySelector('p'), pageHeader.querySelector('h1'));
  pageHeader.classList.add('d-flex','align-items-center','justify-content-between','flex-wrap','gap-3');
  pageHeader.append(titleBlock);

  function iconButton(label, drawing) {
    const button = element('button','btn btn-outline-dark rounded-circle p-2 d-inline-flex align-items-center justify-content-center position-relative');
    button.type = 'button';
    button.title = label;
    button.setAttribute('aria-label',label);
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawing}</svg>`;
    return button;
  }

  function closeButton(dialog) {
    const button = element('button','btn-close');
    button.type = 'button';
    button.setAttribute('aria-label','Close');
    button.addEventListener('click',() => dialog.close());
    return button;
  }

  const actions = element('div','d-flex align-items-center gap-3 ms-auto');
  const profileButton = iconButton('Open local profile','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>');
  const savedButton = iconButton('Open selected classes','<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M7 2v4M17 2v4M3 9h18M8 14h3M8 17h7"/>');
  const savedCount = element('span','position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark');
  savedCount.setAttribute('aria-hidden','true');
  savedButton.append(savedCount);
  actions.append(profileButton,savedButton);
  pageHeader.append(actions);

  const profileDialog = element('dialog','border rounded-3 shadow p-4 col-11 col-md-6');
  profileDialog.id = 'local-profile-dialog';
  profileDialog.setAttribute('aria-labelledby','local-profile-title');
  const profileHeading = element('div','d-flex justify-content-between align-items-start gap-3 mb-3');
  const profileTitle = element('h2','h4 mb-0','Local profile');
  profileTitle.id = 'local-profile-title';
  profileHeading.append(profileTitle,closeButton(profileDialog));
  profileDialog.append(profileHeading,element('p','small text-muted','This is a profile saved in this browser only. It does not create an account or send your details to the academy.'));
  const profileForm = element('form');
  profileForm.noValidate = true;
  const nameLabel = element('label','form-label','Your name');
  nameLabel.htmlFor = 'local-profile-name';
  const nameInput = element('input','form-control mb-2');
  nameInput.id = 'local-profile-name';
  nameInput.type = 'text';
  nameInput.maxLength = 50;
  nameInput.autocomplete = 'off';
  const nameError = element('span','text-danger small d-block mb-3');
  nameError.id = 'local-profile-name-error';
  nameError.setAttribute('aria-live','polite');
  nameInput.setAttribute('aria-describedby',nameError.id);
  const phoneLabel = element('label','form-label','Mobile phone number');
  phoneLabel.htmlFor = 'local-profile-phone';
  const phoneInput = element('input','form-control mb-2');
  phoneInput.id = 'local-profile-phone';
  phoneInput.type = 'tel';
  phoneInput.inputMode = 'tel';
  phoneInput.maxLength = 20;
  phoneInput.placeholder = '+7 701 000 00 00';
  const phoneError = element('span','text-danger small d-block mb-3');
  phoneError.id = 'local-profile-phone-error';
  phoneError.setAttribute('aria-live','polite');
  phoneInput.setAttribute('aria-describedby',phoneError.id);
  const ageLabel = element('label','form-label','Age');
  ageLabel.htmlFor = 'local-profile-age';
  const ageInput = element('input','form-control mb-2');
  ageInput.id = 'local-profile-age';
  ageInput.type = 'number';
  ageInput.min = '4';
  ageInput.max = '99';
  ageInput.placeholder = '19';
  const ageError = element('span','text-danger small d-block mb-3');
  ageError.id = 'local-profile-age-error';
  ageError.setAttribute('aria-live','polite');
  ageInput.setAttribute('aria-describedby',ageError.id);
  const sportLabel = element('label','form-label','Preferred sport (optional)');
  sportLabel.htmlFor = 'local-profile-sport';
  const sportInput = element('select','form-select mb-3');
  sportInput.id = 'local-profile-sport';
  const noSport = element('option','', 'No preference');
  noSport.value = '';
  sportInput.append(noSport);
  for (const [key, label] of Object.entries(sportNames)) {
    const option = element('option','',label);
    option.value = key;
    sportInput.append(option);
  }
  const saveProfile = element('button','btn btn-primary','Save local profile');
  saveProfile.type = 'submit';
  const clearProfile = element('button','btn btn-outline-secondary ms-2','Clear');
  clearProfile.type = 'button';
  const profileStatus = element('p','small mt-3 mb-0');
  profileStatus.setAttribute('aria-live','polite');
  profileForm.append(nameLabel,nameInput,nameError,phoneLabel,phoneInput,phoneError,ageLabel,ageInput,ageError,sportLabel,sportInput,saveProfile,clearProfile,profileStatus);
  profileDialog.append(profileForm);
  document.body.append(profileDialog);

  function showProfile() {
    nameInput.value = typeof localProfile.name === 'string' ? localProfile.name : '';
    phoneInput.value = typeof localProfile.phone === 'string' ? localProfile.phone : '';
    ageInput.value = Number.isInteger(localProfile.age) ? String(localProfile.age) : '';
    sportInput.value = Object.hasOwn(sportNames,localProfile.sport) ? localProfile.sport : '';
    for (const [field,error] of [[nameInput,nameError],[phoneInput,phoneError],[ageInput,ageError]]) {
      error.textContent = '';
      field.removeAttribute('aria-invalid');
    }
    profileStatus.textContent = nameInput.value ? 'Saved in this browser as ' + nameInput.value + '.' : 'No local profile saved yet.';
    profileDialog.showModal();
  }
  profileButton.addEventListener('click',showProfile);
  nameInput.addEventListener('input',() => {
    nameInput.value = cleanPersonName(nameInput.value);
    nameError.textContent = '';
    nameInput.removeAttribute('aria-invalid');
  });
  phoneInput.addEventListener('input',() => {
    phoneInput.value = cleanPhone(phoneInput.value);
    phoneError.textContent = '';
    phoneInput.removeAttribute('aria-invalid');
  });
  ageInput.addEventListener('input',() => { ageError.textContent = ''; ageInput.removeAttribute('aria-invalid'); });
  profileForm.addEventListener('submit',event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const age = Number(ageInput.value);
    const checks = [
      [nameInput,nameError,validPersonName(name),'Use letters only, with spaces, hyphens or apostrophes.'],
      [phoneInput,phoneError,validPhone(phone),'Enter +7 and exactly 10 more digits, or 10 digits without +7.'],
      [ageInput,ageError,Number.isInteger(age) && age >= 4 && age <= 99,'Enter an age from 4 to 99.']
    ];
    let firstInvalid = null;
    for (const [field,error,valid,message] of checks) {
      error.textContent = valid ? '' : message;
      if (!valid) {
        field.setAttribute('aria-invalid','true');
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.removeAttribute('aria-invalid');
      }
    }
    if (firstInvalid) { firstInvalid.focus(); return; }
    localProfile = {name,phone,age,sport:sportInput.value};
    profileStatus.textContent = writeLocal(profileKey,localProfile)
      ? 'Local profile saved in this browser. No account was created.'
      : 'Profile kept for this visit only. Browser storage is unavailable.';
  });
  clearProfile.addEventListener('click',() => {
    localProfile = {};
    nameInput.value = '';
    phoneInput.value = '';
    ageInput.value = '';
    sportInput.value = '';
    for (const [field,error] of [[nameInput,nameError],[phoneInput,phoneError],[ageInput,ageError]]) {
      field.removeAttribute('aria-invalid');
      error.textContent = '';
    }
    try { localStorage.removeItem(profileKey); } catch (error) { /* The in-memory profile is still cleared. */ }
    profileStatus.textContent = 'Local profile cleared.';
  });

  const savedDialog = element('dialog','border rounded-3 shadow p-4 col-11 col-md-6');
  savedDialog.id = 'saved-groups-dialog';
  savedDialog.setAttribute('aria-labelledby','saved-groups-title');
  const savedHeading = element('div','d-flex justify-content-between align-items-start gap-3 mb-3');
  const savedTitle = element('h2','h4 mb-0','Selected classes');
  savedTitle.id = 'saved-groups-title';
  savedHeading.append(savedTitle,closeButton(savedDialog));
  const savedList = element('ul','list-group mb-3');
  const savedStatus = element('p','small text-muted mb-0','Saved only in this browser. Published times may have changed; selecting a class does not reserve a place.');
  savedDialog.append(savedHeading,savedList,savedStatus);
  document.body.append(savedDialog);

  function renderSavedGroups() {
    savedCount.textContent = String(savedGroupIds.length);
    savedButton.setAttribute('aria-label',`Open selected classes (${savedGroupIds.length})`);
    savedList.replaceChildren();
    if (!savedGroupIds.length) {
      savedList.append(element('li','list-group-item','No classes selected yet. Choose a group on the Services or Schedule page.'));
      return;
    }
    for (const id of savedGroupIds) {
      const group = groups.find(item => item.id === id);
      const item = element('li','list-group-item d-flex justify-content-between align-items-start gap-3');
      const description = element('span','small',groupLabel(group));
      const remove = element('button','btn btn-sm btn-outline-danger','Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label',`Remove ${sportNames[group.sport]} at ${branchNames[group.branch]} ${group.time}`);
      remove.addEventListener('click',() => {
        savedGroupIds = savedGroupIds.filter(savedId => savedId !== id);
        writeLocal(savedGroupsKey,savedGroupIds);
        renderSavedGroups();
        window.dispatchEvent(new Event('salahuddin:saved-groups-change'));
      });
      item.append(description,remove);
      savedList.append(item);
    }
  }

  function addSavedGroup(id) {
    const number = Number(id);
    if (!groups.some(group => group.id === number) || savedGroupIds.includes(number)) return false;
    savedGroupIds.push(number);
    savedStatus.textContent = writeLocal(savedGroupsKey,savedGroupIds)
      ? 'Saved only in this browser. This is not a booking.'
      : 'Selected for this visit only. Browser storage is unavailable.';
    renderSavedGroups();
    window.dispatchEvent(new Event('salahuddin:saved-groups-change'));
    return true;
  }

  window.salahuddinSavedGroups = {add:addSavedGroup,has:id => savedGroupIds.includes(Number(id))};
  savedButton.addEventListener('click',() => { renderSavedGroups(); savedDialog.showModal(); });
  renderSavedGroups();
}
