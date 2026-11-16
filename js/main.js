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
const branchNames = {'uly-dala-55':'Uly Dala branch','turan-19':'Turan branch'};
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
  const start = guidePanel('Start here',[
    '1. Choose a group on Schedule. Favourites are optional: they keep classes for later.',
    '2. Select Sign up for this class, complete Registration and check your request.',
    '3. Review the result, then contact the academy to confirm a real visit.'
  ]);
  start.querySelector('ol').classList.add('list-unstyled');
  home.parentElement.prepend(start);
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
  if (!document.querySelector('#contacts')) pageHeader.append(visitorLink('Call academy','tel:+77780486000'));
  function iconButton(label, drawing) {
    const button = element('button','btn btn-outline-light rounded-3 p-2 d-inline-flex align-items-center justify-content-center position-relative');
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
  const profileButton = iconButton('Registration','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>');
  const savedButton = iconButton('Open favourite classes','<path d="M12 21s-9-5.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 11-9 11Z"/>');
  const savedCount = element('span','position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark');
  savedCount.setAttribute('aria-hidden','true');
  savedButton.append(savedCount);
  actions.append(profileButton,savedButton);
  document.querySelector('#academyNavbar').append(actions);
  actions.classList.add('ms-lg-3','py-2','flex-wrap');
  profileButton.append(element('span','ms-2','Register'));
  savedButton.append(element('span','ms-2','Favourites'));

  const profileDialog = element('dialog','border rounded-3 shadow p-4 col-11 col-md-6');
  profileDialog.id = 'local-profile-dialog';
  profileDialog.setAttribute('aria-labelledby','local-profile-title');
  const profileHeading = element('div','d-flex justify-content-between align-items-start gap-3 mb-3');
  const profileTitle = element('h2','h4 mb-0','Registration');
  profileTitle.id = 'local-profile-title';
  profileHeading.append(profileTitle,closeButton(profileDialog));
  profileDialog.append(profileHeading,element('p','small text-muted','Demo registration: your details stay on this device. No online account is created. For a child, ask a parent or guardian to help.'));
  const profileForm = element('form');
  profileForm.noValidate = true;
  const nameLabel = element('label','form-label','Student name');
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
  const emailLabel = element('label','form-label','Email address');
  emailLabel.htmlFor = 'local-profile-email';
  const emailInput = element('input','form-control mb-2');
  emailInput.id = 'local-profile-email';
  emailInput.type = 'email';
  emailInput.autocomplete = 'email';
  emailInput.maxLength = 254;
  const emailError = element('span','text-danger small d-block mb-3');
  emailError.id = 'local-profile-email-error';
  emailError.setAttribute('aria-live','polite');
  emailInput.setAttribute('aria-describedby',emailError.id);
  emailInput.addEventListener('input',()=>{emailError.textContent='';emailInput.removeAttribute('aria-invalid');});
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
  const saveProfile = element('button','btn btn-dark','Save my details');
  saveProfile.type = 'submit';
  const clearProfile = element('button','btn btn-outline-secondary ms-2','Clear');
  clearProfile.type = 'button';
  const profileStatus = element('p','small mt-3 mb-0');
  profileStatus.setAttribute('aria-live','polite');
  profileForm.append(nameLabel,nameInput,nameError,emailLabel,emailInput,emailError,phoneLabel,phoneInput,phoneError,ageLabel,ageInput,ageError,sportLabel,sportInput,saveProfile,clearProfile,profileStatus);
  profileDialog.append(profileForm);
  document.body.append(profileDialog);

  function showProfile() {
    nameInput.value = typeof localProfile.name === 'string' ? localProfile.name : '';
    emailInput.value = typeof localProfile.email === 'string' ? localProfile.email : '';
    phoneInput.value = typeof localProfile.phone === 'string' ? localProfile.phone : '';
    ageInput.value = Number.isInteger(localProfile.age) ? String(localProfile.age) : '';
    sportInput.value = Object.hasOwn(sportNames,localProfile.sport) ? localProfile.sport : '';
    for (const [field,error] of [[nameInput,nameError],[emailInput,emailError],[phoneInput,phoneError],[ageInput,ageError]]) {
      error.textContent = '';
      field.removeAttribute('aria-invalid');
    }
    profileStatus.textContent = nameInput.value ? 'Saved in this browser as ' + nameInput.value + '.' : 'Enter your details below.';
    profileDialog.showModal();
  }
  window.salahuddinProfile = {
    get: () => ({...localProfile}),
    open: showProfile,
    valid: () => typeof localProfile.name === 'string' && validPersonName(localProfile.name)
      && typeof localProfile.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localProfile.email)
      && typeof localProfile.phone === 'string' && validPhone(localProfile.phone)
      && Number.isInteger(localProfile.age) && localProfile.age >= 4 && localProfile.age <= 99
  };
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
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const age = Number(ageInput.value);
    const checks = [
      [emailInput,emailError,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && emailInput.checkValidity(),'Enter a valid email address.'],
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
    localProfile = {name,email,phone,age,sport:sportInput.value};
    profileStatus.textContent = writeLocal(profileKey,localProfile)
      ? 'Your details are saved on this device. You can change or clear them here.'
      : 'Profile kept for this visit only. Browser storage is unavailable.';
    window.dispatchEvent(new Event('salahuddin:profile-change'));
    profileDialog.close();
  });
  clearProfile.addEventListener('click',() => {
    localProfile = {};
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    ageInput.value = '';
    sportInput.value = '';
    for (const [field,error] of [[nameInput,nameError],[emailInput,emailError],[phoneInput,phoneError],[ageInput,ageError]]) {
      field.removeAttribute('aria-invalid');
      error.textContent = '';
    }
    try { localStorage.removeItem(profileKey); } catch (error) { /* The in-memory profile is still cleared. */ }
    profileStatus.textContent = 'Your saved details have been cleared.';
    window.dispatchEvent(new Event('salahuddin:profile-change'));
  });

  const savedDialog = element('dialog','border rounded-3 shadow p-4 col-11 col-md-6');
  savedDialog.id = 'saved-groups-dialog';
  savedDialog.setAttribute('aria-labelledby','saved-groups-title');
  const savedHeading = element('div','d-flex justify-content-between align-items-start gap-3 mb-3');
  const savedTitle = element('h2','h4 mb-0','Favourite classes');
  savedTitle.id = 'saved-groups-title';
  savedHeading.append(savedTitle,closeButton(savedDialog));
  const savedList = element('ul','list-group mb-3');
  const savedStatus = element('p','small text-muted mb-0','Favourites help you compare classes later. Adding a favourite does not send a request or reserve a place.');
  savedDialog.append(savedHeading,savedList,savedStatus);
  document.body.append(savedDialog);

  function renderSavedGroups() {
    savedCount.textContent = String(savedGroupIds.length);
    savedButton.setAttribute('aria-label',`Open favourite classes (${savedGroupIds.length})`);
    savedList.replaceChildren();
    if (!savedGroupIds.length) {
      savedList.append(element('li','list-group-item','No favourite classes yet. Use Add to favourites on Schedule to keep a class for later.'));
      return;
    }
    for (const id of savedGroupIds) {
      const group = groups.find(item => item.id === id);
      const item = element('li','list-group-item d-flex justify-content-between align-items-start gap-3');
      const description = element('span','small',groupLabel(group));
      const remove = element('button','btn btn-outline-danger','Remove');
      remove.type = 'button';
      remove.setAttribute('aria-label',`Remove ${sportNames[group.sport]} at ${branchNames[group.branch]} ${group.time}`);
      remove.addEventListener('click',() => {
        savedGroupIds = savedGroupIds.filter(savedId => savedId !== id);
        writeLocal(savedGroupsKey,savedGroupIds);
        renderSavedGroups();
        window.dispatchEvent(new Event('salahuddin:saved-groups-change'));
      });
      const signup = visitorLink('Sign up','services.html?group=' + group.id + '#enrollment-section');
      item.append(description,signup,remove);
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

// Simple visitor guides use the existing Bootstrap classes.
function visitorLink(text, href) {
  const link = element('a','btn btn-outline-dark me-2 mb-2',text);
  link.href = href;
  return link;
}
function guidePanel(title, lines) {
  const panel = element('section','col-12 bg-white border rounded-3 shadow-sm p-4');
  panel.append(element('h2','h3',title));
  const list = element('ol','mb-3');
  for (const line of lines) list.append(element('li','mb-2',line));
  panel.append(list);
  return panel;
}
const servicesPanel = document.querySelector('#enrollment-section');
if (servicesPanel) {
  document.querySelector('header h1').textContent = 'Services';
  servicesPanel.querySelector('h2').textContent = 'Class registration form';
  const intro = servicesPanel.previousElementSibling;
  intro.replaceChildren(element('h2','h3','Choose your sport'));
  const descriptions = {
    karate:'Practise punches, kicks and controlled movements.',
    taekwondo:'Practise kicking techniques, balance and coordination.',
    judo:'Learn throws and grappling techniques on a mat.',
    'muay-thai':'Practise striking techniques using punches, kicks, knees and elbows.'
  };
  for (const [sport, description] of Object.entries(descriptions)) {
    const card = element('div','border rounded-3 p-3 mb-3');
    card.append(element('h3','h5',sportNames[sport]),element('p','mb-2',description));
    intro.append(card);
  }

}
const pricePanel = document.querySelector('#prices');
if (pricePanel) {
  const select = pricePanel.querySelector('#budget-plan');
  const count = pricePanel.querySelector('#budget-people');
  const total = pricePanel.querySelector('#budget-total');
  function updateBudget() {
    const people = Number(count.value);
    total.textContent = Number.isInteger(people) && people >= 1 && people <= 10
      ? 'Estimated total: ' + (Number(select.value) * people).toLocaleString('ru-RU').replace(/\u00a0/g,' ') + ' ₸.'
      : 'Enter a whole number from 1 to 10.';
  }
  select.addEventListener('change', updateBudget);
  count.addEventListener('input', updateBudget);
  updateBudget();
}
const nextSteps = {
  'index.html':['Next: Schedule','schedule.html'],
  'schedule.html':['Next: Services','services.html'],
  'services.html':['Next: Contact','contact.html'],
  'coaches.html':['Next: Schedule','schedule.html'],
  'contact.html':['Next: Home','index.html']
};
const nextStep = nextSteps[location.pathname.split('/').pop() || 'index.html'];
if (nextStep) {
  const main = document.querySelector('main');
  const wrap = element('p','mt-4 text-end');
  wrap.append(visitorLink(nextStep[0],nextStep[1]));
  main.append(wrap);
}
