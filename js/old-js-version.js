// Assignment 6 comparison copy. This file is intentionally not loaded by any page.

// Previous plain JavaScript: groups.js
'use strict';

const schedulePage = document.querySelector('#uly-dala');
const servicePage = document.querySelector('#enrollment-section');
const parent = schedulePage ? schedulePage.parentElement : servicePage.parentElement;
const finder = element('section','col-12 bg-white border rounded-3 shadow-sm p-4');
finder.append(element('h2','', 'Find a suitable group'));
finder.append(element('p','', 'Published September 2025 times. Confirm current availability with the academy.'));
const controls = element('div','row g-2 mb-3');

function selectControl(labelText, choices) {
  const box = element('div','col-12 col-sm-6 col-lg-3');
  const label = element('label','form-label',labelText);
  const select = element('select','form-select');
  const first = element('option','',`All ${labelText.toLowerCase()}`);
  first.value = '';
  select.append(first);
  Object.keys(choices).forEach(key => {
    const option = element('option','',choices[key]);
    option.value = key;
    select.append(option);
  });
  label.append(select);
  box.append(label);
  controls.append(box);
  return select;
}

const sportFilter = selectControl('Sports',sportNames);
const branchFilter = selectControl('Branches',branchNames);
const ageBox = element('div','col-12 col-sm-6 col-lg-3');
const ageLabel = element('label','form-label','Student age');
const ageFilter = element('input','form-control');
ageFilter.type = 'number';
ageFilter.min = '4';
ageFilter.max = '100';
ageLabel.append(ageFilter);
ageBox.append(ageLabel);
const resetBox = element('div','col-12 col-sm-6 col-lg-3 d-flex align-items-end');
const reset = element('button','btn btn-outline-secondary','Reset filters');
reset.type = 'button';
resetBox.append(reset);
controls.append(ageBox,resetBox);
finder.append(controls);
const count = element('p','form-message');
count.setAttribute('aria-live','polite');
finder.append(count);
parent.insertBefore(finder,parent.firstElementChild);

function matches(group) {
  const sportOK = sportFilter.value === '' || sportFilter.value === group.sport;
  const branchOK = branchFilter.value === '' || branchFilter.value === group.branch;
  const ageOK = ageFilter.value === '' || suitable(group,Number(ageFilter.value));
  return sportOK && branchOK && ageOK;
}

function createRow(group) {
  const row = element('tr');
  const values = [sportNames[group.sport],group.days.map(day => dayNames[day]).join(' / '),group.time,`${group.min}–${group.max === 100 ? 'adult' : group.max}`];
  values.forEach((value,index) => {
    const cell = element(index === 0 ? 'th' : 'td','',value);
    if (index === 0) cell.scope = 'row';
    row.append(cell);
  });
  return row;
}

function createCard(group) {
  const card = element('article','col-12 col-md-6 col-lg-4');
  const body = element('div','card h-100');
  const inner = element('div','card-body');
  inner.append(element('h3','h5 card-title',sportNames[group.sport]));
  inner.append(element('p','card-text',groupLabel(group)));
  const call = element('a','btn btn-outline-primary','Call about this group');
  call.href = 'tel:+77780486000';
  inner.append(call);
  body.append(inner);
  card.append(body);
  return card;
}

let list;
if (servicePage) {
  list = element('div','row g-3');
  finder.append(list);
}

function updateGroups() {
  const found = groups.filter(matches);
  count.textContent = `${found.length} of ${groups.length} published groups match.`;
  if (servicePage) {
    renderList(list,found,createCard);
    if (found.length === 0) {
      const message = element('p','col-12 form-note','No matching groups. Change the filters or ');
      const link = element('a','','contact the academy');
      link.href = 'contact.html#contacts';
      message.append(link,'.');
      list.append(message);
    }
  }
  if (schedulePage) {
    Object.keys(branchNames).forEach(branch => {
      const section = document.getElementById(branch === 'uly-dala-55' ? 'uly-dala' : 'turan-19');
      const body = section.querySelector('tbody');
      const branchGroups = found.filter(group => group.branch === branch);
      renderList(body,branchGroups,createRow);
      if (branchGroups.length === 0) {
        const row = element('tr');
        const cell = element('td','', 'No matching groups here. Change the filters or ');
        const link = element('a','','contact the academy');
        link.href = 'contact.html#contacts';
        cell.append(link,'.');
        cell.colSpan = 4;
        row.append(cell);
        body.append(row);
      }
    });
  }
}

sportFilter.addEventListener('change',updateGroups);
branchFilter.addEventListener('change',updateGroups);
ageFilter.addEventListener('input',updateGroups);
reset.addEventListener('click',() => {
  sportFilter.value = '';
  branchFilter.value = '';
  ageFilter.value = '';
  updateGroups();
  sportFilter.focus();
});
updateGroups();


// Previous plain JavaScript: forms.js
'use strict';

const requestForm = document.querySelector('#trial-form, #group-form');
const nameInput = requestForm.querySelector('#applicant-name');
const emailInput = requestForm.querySelector('#applicant-email');
const phoneInput = requestForm.querySelector('#applicant-phone');
const ageInput = requestForm.querySelector('#applicant-age');
const dateInput = requestForm.querySelector('#preferred-date');
const branchInput = requestForm.querySelector('#branch-location') || element('select','form-select');
const experienceInput = requestForm.querySelector('#experience-level');
const consentInput = requestForm.querySelector('#safety-rules');
const result = requestForm.querySelector('.form-message');
const submitButton = requestForm.querySelector('[id^="submit-"]');
const notes = requestForm.querySelector('.form-note');
notes.textContent = 'This is a front-end demonstration. Your details are not sent or saved, and no place is booked. Contact the academy to confirm.';
submitButton.type = 'submit';
requestForm.noValidate = true;

if (!branchInput.id) {
  branchInput.id = 'branch-location';
  const box = element('p');
  const label = element('label','', 'Branch:');
  label.htmlFor = branchInput.id;
  const first = element('option','', 'Choose a branch');
  first.value = '';
  branchInput.append(first);
  Object.keys(branchNames).forEach(key => {
    const option = element('option','',branchNames[key]);
    option.value = key;
    branchInput.append(option);
  });
  box.append(label,branchInput);
  experienceInput.closest('p').before(box);
}

const groupBox = element('p');
const groupLabelNode = element('label','', 'Published group:');
groupLabelNode.htmlFor = 'chosen-group';
const groupInput = element('select','form-select');
groupInput.id = 'chosen-group';
groupBox.append(groupLabelNode,groupInput);
dateInput.closest('p').after(groupBox);
const summary = element('p','form-message');
summary.setAttribute('aria-live','polite');
groupBox.after(summary);
const errorNodes = new Map();

function clearError(field) {
  const error = errorNodes.get(field);
  if (error) error.textContent = '';
  field.classList.remove('is-error');
  field.removeAttribute('aria-invalid');
  result.classList.add('is-hidden');
  result.classList.remove('is-success','is-error');
}

function register(field) {
  const error = element('span','text-danger small d-block');
  error.id = `${field.id}-error`;
  error.setAttribute('aria-live','polite');
  field.after(error);
  field.setAttribute('aria-describedby',error.id);
  errorNodes.set(field,error);
  field.addEventListener('input',() => clearError(field));
  field.addEventListener('change',() => clearError(field));
}

const fields = [nameInput,emailInput,phoneInput,ageInput,dateInput,branchInput,groupInput,consentInput];
if (experienceInput) fields.push(experienceInput);
fields.forEach(register);

function selectedSport() {
  return requestForm.querySelector('[name="sport_direction"]:checked').value;
}

function selectedGroup() {
  return groups.find(group => group.id === Number(groupInput.value));
}

function updateSummary() {
  const group = selectedGroup();
  groupBox.classList.toggle('is-selected',Boolean(group));
  groupBox.classList.toggle('is-active',Boolean(group));
  summary.textContent = group ? `${groupLabel(group)}${dateInput.value ? ` · preferred date ${dateInput.value}` : ''}. No place is reserved.` : 'Choose a published group to see the request summary.';
}

function updateChoices() {
  const previous = groupInput.value;
  const age = Number(ageInput.value);
  const choices = groups.filter(group => {
    const ageOK = ageInput.value === '' || suitable(group,age);
    const sportOK = group.sport === selectedSport();
    const branchOK = branchInput.value === '' || group.branch === branchInput.value;
    return ageOK && sportOK && branchOK;
  });
  renderList(groupInput,choices,group => {
    const option = element('option','',`${group.id}. ${branchNames[group.branch]} · ${group.time}`);
    option.value = String(group.id);
    return option;
  });
  const first = element('option','',choices.length ? 'Choose a group' : 'No matching groups');
  first.value = '';
  groupInput.prepend(first);
  groupInput.value = choices.some(group => String(group.id) === previous) ? previous : '';
  updateSummary();
}

ageInput.addEventListener('input',updateChoices);
branchInput.addEventListener('change',updateChoices);
requestForm.querySelectorAll('[name="sport_direction"]').forEach(radio => radio.addEventListener('change',updateChoices));
groupInput.addEventListener('change',updateSummary);
dateInput.addEventListener('change',updateSummary);

function error(field,message) {
  errorNodes.get(field).textContent = message;
  field.classList.add('is-error');
  field.setAttribute('aria-invalid','true');
}

function validRequest() {
  fields.forEach(clearError);
  let firstInvalid = null;
  function check(field,valid,message) {
    if (!valid) {
      error(field,message);
      if (!firstInvalid) firstInvalid = field;
    }
  }
  const age = Number(ageInput.value);
  const group = selectedGroup();
  const date = dateInput.value ? new Date(`${dateInput.value}T12:00:00`) : null;
  const tomorrow = new Date();
  tomorrow.setHours(0,0,0,0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const latest = new Date(tomorrow);
  latest.setDate(latest.getDate() + 89);
  check(nameInput,nameInput.value.trim().length >= 2,'Enter at least 2 characters.');
  check(emailInput,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()),'Enter a valid email address.');
  const phone = phoneInput.value.trim();
  const digitCount = phone.replace(/\D/g,'').length;
  check(phoneInput,/^\+?[\d\s()-]{10,20}$/.test(phone) && digitCount >= 10,'Enter a phone number with at least 10 digits.');
  check(ageInput,Number.isInteger(age) && age >= 4 && age <= 100,'Enter an age from 4 to 100.');
  check(branchInput,branchInput.value !== '', 'Choose a branch.');
  if (experienceInput) check(experienceInput,experienceInput.value !== '', 'Choose an experience level.');
  check(groupInput,Boolean(group),'Choose a published group.');
  if (group) check(groupInput,suitable(group,age) && group.sport === selectedSport() && group.branch === branchInput.value,'The group must match age, sport and branch.');
  check(dateInput,Boolean(date) && !Number.isNaN(date.getTime()) && date >= tomorrow && date <= latest,'Choose a future date within 90 days.');
  if (group && date && !Number.isNaN(date.getTime())) check(dateInput,group.days.includes(date.getDay()),`This group meets on ${group.days.map(day => dayNames[day]).join(', ')}.`);
  check(consentInput,consentInput.checked,'Please confirm that this is only a demonstration.');
  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

requestForm.addEventListener('submit',event => {
  event.preventDefault();
  if (!validRequest()) {
    result.classList.remove('is-hidden');
    result.classList.add('is-error');
    result.textContent = 'Please correct the marked fields.';
    return;
  }
  const reference = Math.floor(100000 + Math.random() * 900000);
  result.classList.remove('is-hidden','is-error');
  result.classList.add('is-success');
  result.textContent = `Demo request ${reference}: ${nameInput.value.trim()}, ${groupLabel(selectedGroup())}, ${dateInput.value}. No data was sent to a server and no real booking was created. Contact the academy to confirm.`;
});

requestForm.addEventListener('reset',() => {
  setTimeout(() => {
    fields.forEach(clearError);
    updateChoices();
    result.classList.add('is-hidden');
  },0);
});

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

const minimumDate = new Date();
minimumDate.setDate(minimumDate.getDate() + 1);
const maximumDate = new Date();
maximumDate.setDate(maximumDate.getDate() + 90);
dateInput.min = localDate(minimumDate);
dateInput.max = localDate(maximumDate);
updateChoices();


// Previous plain JavaScript: reviews.js
'use strict';

const coachCards = document.querySelectorAll('main article.content-panel');
const coachSearchBox = element('section','col-12 bg-white border rounded-3 shadow-sm p-4');
const coachSearchLabel = element('label','form-label','Find a coach by name or sport');
const coachSearch = element('input','form-control');
coachSearch.type = 'search';
coachSearch.id = 'coach-search';
coachSearchLabel.htmlFor = coachSearch.id;
const coachSearchCount = element('p','form-message mt-2');
coachSearchCount.setAttribute('aria-live','polite');
const clearCoachSearch = element('button','btn btn-outline-secondary','Clear search');
clearCoachSearch.type = 'button';
coachSearchBox.append(coachSearchLabel,coachSearch,coachSearchCount,clearCoachSearch);
document.querySelector('main .row').prepend(coachSearchBox);

function searchCoaches() {
  const searchText = coachSearch.value.trim().toLowerCase();
  let count = 0;
  coachCards.forEach(card => {
    const matches = card.textContent.toLowerCase().includes(searchText);
    card.classList.toggle('is-hidden',!matches);
    if (matches) count += 1;
  });
  coachSearchCount.textContent = count === 0 ? 'No coaches match. Try another word.' : `${count} of ${coachCards.length} coaches match.`;
}

coachSearch.addEventListener('input',searchCoaches);
clearCoachSearch.addEventListener('click',() => {
  coachSearch.value = '';
  searchCoaches();
  coachSearch.focus();
});
searchCoaches();
