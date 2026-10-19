'use strict';

const reviewsSection = element('section','col-12 bg-white border rounded-3 shadow-sm p-4');
reviewsSection.append(element('h2','', 'Demonstration reviews'));
reviewsSection.append(element('p','form-note','These practice reviews are saved only in this browser and are not sent to the academy.'));
const reviewCount = element('p','form-message');
reviewCount.setAttribute('aria-live','polite');
const reviewList = element('div','row g-3 mb-4');
reviewsSection.append(reviewCount,reviewList);
const reviewForm = element('form','');
reviewForm.noValidate = true;

function reviewField(labelText,tag,id) {
  const box = element('p');
  const label = element('label','form-label',labelText);
  label.htmlFor = id;
  const field = element(tag,tag === 'select' ? 'form-select' : 'form-control');
  field.id = id;
  const error = element('span','text-danger small d-block');
  error.id = `${id}-error`;
  field.setAttribute('aria-describedby',error.id);
  box.append(label,field,error);
  reviewForm.append(box);
  field.addEventListener('input',() => {
    error.textContent = '';
    field.classList.remove('is-error');
    field.removeAttribute('aria-invalid');
  });
  return {field,error};
}

const reviewName = reviewField('Your name','input','review-name');
reviewName.field.maxLength = 50;
const reviewRating = reviewField('Rating','select','review-rating');
const ratingPrompt = element('option','', 'Choose 1 to 5');
ratingPrompt.value = '';
reviewRating.field.append(ratingPrompt);
for (let score = 1; score <= 5; score += 1) {
  const option = element('option','',`${score} of 5`);
  option.value = String(score);
  reviewRating.field.append(option);
}
const reviewText = reviewField('Your review','textarea','review-text');
reviewText.field.maxLength = 300;
reviewText.field.rows = 4;
const counter = element('span','small text-muted','0/300 characters');
counter.setAttribute('aria-live','polite');
reviewText.field.after(counter);
reviewText.field.addEventListener('input',() => {
  counter.textContent = `${reviewText.field.value.length}/300 characters`;
});
const submit = element('button','btn btn-primary','Add demonstration review');
submit.type = 'submit';
const status = element('p','form-message mt-3 is-hidden');
status.setAttribute('aria-live','polite');
reviewForm.append(submit,status);
reviewsSection.append(reviewForm);
document.querySelector('main .row').append(reviewsSection);

let reviews = [];
try {
  const saved = JSON.parse(localStorage.getItem('salahuddin-demo-reviews') || '[]');
  if (Array.isArray(saved)) reviews = saved.filter(item => item && typeof item.name === 'string' && typeof item.text === 'string' && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5);
} catch (problem) {
  reviews = [];
}

function saveReviews() {
  try {
    localStorage.setItem('salahuddin-demo-reviews',JSON.stringify(reviews));
  } catch (problem) {
    status.classList.remove('is-hidden');
    status.textContent = 'Review shown for this visit, but browser storage is unavailable.';
  }
}

function createReview(item) {
  const card = element('article','col-12 col-md-6');
  const body = element('div','card h-100 p-3');
  body.append(element('h3','h5',item.name));
  body.append(element('p','small text-muted',`${item.rating}/5 · ${new Date(item.date).toLocaleString()}`));
  body.append(element('p','',item.text));
  const remove = element('button','btn btn-sm btn-outline-danger','Remove');
  remove.type = 'button';
  remove.addEventListener('click',() => {
    reviews = reviews.filter(review => review.id !== item.id);
    saveReviews();
    showReviews();
    status.classList.remove('is-hidden');
    status.textContent = 'Review removed from this browser.';
  });
  body.append(remove);
  card.append(body);
  return card;
}

function showReviews() {
  renderList(reviewList,reviews,createReview);
  reviewCount.textContent = `${reviews.length} demonstration reviews.`;
  if (reviews.length === 0) reviewList.append(element('p','col-12','No reviews yet. Add the first demonstration review below.'));
}

function showError(part,message) {
  part.error.textContent = message;
  part.field.classList.add('is-error');
  part.field.setAttribute('aria-invalid','true');
}

reviewForm.addEventListener('submit',event => {
  event.preventDefault();
  [reviewName,reviewRating,reviewText].forEach(part => {
    part.error.textContent = '';
    part.field.classList.remove('is-error');
  });
  let first = null;
  if (reviewName.field.value.trim().length < 2) {
    showError(reviewName,'Enter at least 2 characters.');
    first = reviewName.field;
  }
  if (reviewRating.field.value === '') {
    showError(reviewRating,'Choose a rating.');
    if (!first) first = reviewRating.field;
  }
  const text = reviewText.field.value.trim();
  if (text.length < 15 || text.length > 300) {
    showError(reviewText,'Write 15 to 300 characters.');
    if (!first) first = reviewText.field;
  }
  status.classList.remove('is-hidden');
  if (first) {
    first.focus();
    status.classList.add('is-error');
    status.textContent = 'Please correct the review fields.';
    return;
  }
  reviews.unshift({id:Date.now(),name:reviewName.field.value.trim(),rating:Number(reviewRating.field.value),text,date:new Date().toISOString()});
  saveReviews();
  showReviews();
  reviewForm.reset();
  counter.textContent = '0/300 characters';
  status.classList.remove('is-error');
  status.classList.add('is-success');
  status.textContent = 'Demonstration review added in this browser. Nothing was sent to the academy.';
});

showReviews();
