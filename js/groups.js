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
