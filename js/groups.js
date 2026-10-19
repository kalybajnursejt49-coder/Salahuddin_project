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
  const cell = element('td');
  const link = element('a','btn btn-sm btn-outline-primary','Choose');
  link.href = `services.html?group=${group.id}#enrollment-section`;
  cell.append(link);
  row.append(cell);
  return row;
}

function createCard(group) {
  const card = element('article','col-12 col-md-6 col-lg-4');
  const body = element('div','card h-100');
  const inner = element('div','card-body');
  inner.append(element('h3','h5 card-title',sportNames[group.sport]));
  inner.append(element('p','card-text',groupLabel(group)));
  const button = element('button','btn btn-outline-primary','Choose this group');
  button.type = 'button';
  button.addEventListener('click',() => {
    document.querySelectorAll('.is-selected').forEach(item => item.classList.remove('is-selected','is-active'));
    card.classList.add('is-selected','is-active');
    const sport = document.querySelector(`[name="sport_direction"][value="${group.sport}"]`);
    sport.checked = true;
    document.dispatchEvent(new CustomEvent('group-chosen',{detail:group.id}));
    servicePage.scrollIntoView();
  });
  inner.append(button);
  body.append(inner);
  card.append(body);
  return card;
}

let list;
if (servicePage) {
  list = element('div','row g-3');
  finder.append(list);
}

if (schedulePage) {
  document.querySelectorAll('#uly-dala, #turan-19').forEach(section => {
    const heading = element('th','', 'Next step');
    heading.scope = 'col';
    section.querySelector('thead tr').append(heading);
  });
}

function updateGroups() {
  const found = groups.filter(matches);
  count.textContent = `${found.length} of ${groups.length} published groups match.`;
  if (servicePage) {
    renderList(list,found,createCard);
    if (found.length === 0) list.append(element('p','col-12 form-note','No matching groups. Change the filters or contact the academy.'));
  }
  if (schedulePage) {
    Object.keys(branchNames).forEach(branch => {
      const section = document.getElementById(branch === 'uly-dala-55' ? 'uly-dala' : 'turan-19');
      const body = section.querySelector('tbody');
      const branchGroups = found.filter(group => group.branch === branch);
      renderList(body,branchGroups,createRow);
      if (branchGroups.length === 0) {
        const row = element('tr');
        const cell = element('td','', 'No matching groups at this location.');
        cell.colSpan = 5;
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
