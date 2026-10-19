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
    const option = element('option','',`${sportNames[group.sport]} · ${group.days.map(day => dayNames[day]).join('/')} ${group.time} · ${group.min}–${group.max === 100 ? 'adult' : group.max}`);
    option.value = String(group.id);
    return option;
  });
  const first = element('option','',choices.length ? 'Choose a group' : 'No matching groups');
  first.value = '';
  groupInput.prepend(first);
  groupInput.value = choices.some(group => String(group.id) === previous) ? previous : '';
  updateSummary();
}

function chooseGroup(id) {
  const group = groups.find(item => item.id === id);
  if (!group) return;
  requestForm.querySelector(`[name="sport_direction"][value="${group.sport}"]`).checked = true;
  branchInput.value = group.branch;
  updateChoices();
  groupInput.value = String(group.id);
  updateSummary();
}

document.addEventListener('group-chosen',event => chooseGroup(event.detail));
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
  check(phoneInput,/^\+?[\d\s()-]{10,20}$/.test(phoneInput.value.trim()),'Enter a valid phone number.');
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
const requestedGroup = Number(new URLSearchParams(location.search).get('group'));
if (requestedGroup) chooseGroup(requestedGroup);
