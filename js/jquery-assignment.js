/* jQuery 3.7.1 is loaded first so $ is available when this deferred file runs. */
$(function () {
  'use strict';

  const $form = $('#trial-form, #group-form');
  const $service = $('#enrollment-section');
  const $schedule = $('#uly-dala');

  // .val(), .on() and .each() replace value reads, addEventListener and forEach.
  // The filter is shorter; building the controls still takes about the same space.
  if ($service.length || $schedule.length) {
    const $anchor = $service.length ? $service : $schedule;
    const $finder = $('<section>').addClass('col-12 bg-white border rounded-3 shadow-sm p-4');
    $finder.append($('<h2>').text('Find a suitable group'));
    $finder.append($('<p>').text('Published September 2025 times. Confirm current availability with the academy.'));
    const $controls = $('<div>').addClass('row g-2 mb-3').appendTo($finder);
    function selectControl(label, values) {
      const $box = $('<div>').addClass('col-12 col-sm-6 col-lg-3').appendTo($controls);
      const $label = $('<label>').addClass('form-label').text(label).appendTo($box);
      const $select = $('<select>').addClass('form-select').appendTo($label);
      $('<option>').val('').text('All ' + label.toLowerCase()).appendTo($select);
      $.each(values, function (key, value) { $('<option>').val(key).text(value).appendTo($select); });
      return $select;
    }
    const $sport = selectControl('Sports', sportNames);
    const $branch = selectControl('Branches', branchNames);
    const $age = $('<input>').attr({type:'number', min:4, max:100}).addClass('form-control');
    $('<div>').addClass('col-12 col-sm-6 col-lg-3').append($('<label>').addClass('form-label').text('Student age').append($age)).appendTo($controls);
    const $reset = $('<button>').attr('type','button').addClass('btn btn-outline-secondary').text('Reset filters');
    $('<div>').addClass('col-12 col-sm-6 col-lg-3 d-flex align-items-end').append($reset).appendTo($controls);
    const $count = $('<p>').addClass('form-message').attr('aria-live','polite').appendTo($finder);
    const $list = $service.length ? $('<div>').addClass('row g-3').appendTo($finder) : $();
    $anchor.parent().prepend($finder);

    function matches(group) {
      const sameSport = !$sport.val() || $sport.val() === group.sport;
      const sameBranch = !$branch.val() || $branch.val() === group.branch;
      const ageFits = !$age.val() || suitable(group, Number($age.val()));
      return sameSport && sameBranch && ageFits;
    }
    function renderGroups() {
      const found = groups.filter(matches);
      $count.text(found.length + ' of ' + groups.length + ' published groups match.');
      if ($service.length) {
        $list.empty();
        $.each(found, function (_, group) {
          const $card = $('<article>').attr('data-group-id', group.id).addClass('col-12 col-md-6 col-lg-4');
          const $body = $('<div>').addClass('card h-100').appendTo($card);
          const $inner = $('<div>').addClass('card-body').appendTo($body);
          const days = group.days.map(day => dayNames[day]).join(' / ');
          const maximumAge = group.max === 100 ? 'adult' : group.max;
          $('<h3>').addClass('h5 card-title').text(sportNames[group.sport]).appendTo($inner);
          $('<p>').addClass('card-text').text(days + ' · ' + group.time).appendTo($inner);
          $('<p>').addClass('card-text small text-muted').text(branchNames[group.branch] + ' · ages ' + group.min + '–' + maximumAge).appendTo($inner);
          $('<button>').attr('type','button').addClass('btn btn-outline-primary choose-group').text('Select this group').appendTo($inner);
          $list.append($card);
        });
        if (!found.length) $list.append($('<p>').addClass('col-12 form-note').html('No matching groups. Change the filters or <a href="contact.html#contacts">contact the academy</a>.'));
      }
      if ($schedule.length) {
        $.each(branchNames, function (branch) {
          const $body = $(branch === 'uly-dala-55' ? '#uly-dala' : '#turan-19').find('tbody').empty();
          $.each(found.filter(group => group.branch === branch), function (_, group) {
            const $row = $('<tr>');
            $('<th>').attr('scope','row').text(sportNames[group.sport]).appendTo($row);
            $('<td>').text(group.days.map(day => dayNames[day]).join(' / ')).appendTo($row);
            $('<td>').text(group.time).appendTo($row);
            $('<td>').text(group.min + '–' + (group.max === 100 ? 'adult' : group.max)).appendTo($row);
            $body.append($row);
          });
          if (!$body.children().length) $body.append($('<tr>').append($('<td>').attr('colspan',4).text('No matching groups here. Change the filters.')));
        });
      }
    }
    $controls.on('change input', 'select, input', renderGroups);
    $reset.on('click', function () { $sport.val(''); $branch.val(''); $age.val(''); renderGroups(); $sport.trigger('focus'); });
    // Delegation is needed because renderGroups creates the buttons after this handler is bound.
    $list.on('click', '.choose-group', function () {
      const groupId = Number($(this).closest('article').attr('data-group-id'));
      const group = groups.find(item => item.id === groupId);
      if (!group) return;

      if ($age.val()) {
        $form.find('#applicant-age').val($age.val()).trigger('input');
      }
      $form.find('[name="sport_direction"][value="' + group.sport + '"]').prop('checked', true).trigger('change');
      $form.find('#branch-location').val(group.branch).trigger('change');

      const $choice = $form.find('#chosen-group');
      const available = $choice.find('option[value="' + group.id + '"]').length > 0;
      if (available) {
        $choice.val(String(group.id)).trigger('change');
      } else {
        $form.find('#chosen-group-error').text('This group does not match the age in the form. Update the age to choose it.');
      }
      // Scrolling to the relevant form field makes the chosen card useful immediately.
      $('html, body').animate({scrollTop: Math.max(0, $form.offset().top - 20)}, 300, function () {
        if (available) $choice.trigger('focus');
        else $form.find('#applicant-age').trigger('focus');
      });
    });
    renderGroups();
  }

  // .on(), .val(), .each() and .toggleClass() replace the old coach search's
  // addEventListener, value, forEach and hidden assignment. This reads more clearly.
  if ($('main article.content-panel').length) {
    const $cards = $('main article.content-panel');
    const $searchBox = $('<section>').addClass('col-12 bg-white border rounded-3 shadow-sm p-4');
    const $search = $('<input>').attr({id:'coach-search',type:'search'}).addClass('form-control');
    $('<label>').attr('for','coach-search').addClass('form-label').text('Find a coach by name or sport').appendTo($searchBox);
    $searchBox.append($search);
    const $status = $('<p>').addClass('form-message mt-2').attr('aria-live','polite').appendTo($searchBox);
    const $clear = $('<button>').attr('type','button').addClass('btn btn-outline-secondary').text('Clear search').appendTo($searchBox);
    $('main .row').first().prepend($searchBox);
    function searchCoaches() {
      const term = $.trim($search.val()).toLowerCase();
      let count = 0;
      $cards.each(function () {
        const match = $(this).text().toLowerCase().includes(term);
        $(this).toggleClass('is-hidden', !match);
        if (match) count += 1;
      });
      $status.text(count ? count + ' of ' + $cards.length + ' coaches match.' : 'No coaches match. Try another word.');
    }
    $search.on('input', searchCoaches);
    $clear.on('click', function () { $search.val('').trigger('input').trigger('focus'); });
    searchCoaches();
  }

  // .find(), .val(), .on() and class methods replace querySelector, value,
  // addEventListener and classList in the old form. Validation is similarly sized.
  if ($form.length) {
    const $result = $form.find('.form-message').first();
    $form.find('.form-note').first().text('Front-end demonstration only. No details are sent or saved. Contact the academy to confirm.');
    $form.find('[id^="submit-"]').prop('type','submit');
    $form.prop('noValidate', true);
    let $branch = $form.find('#branch-location');
    if (!$branch.length) {
      $branch = $('<select>').attr({id:'branch-location',name:'branch',required:true}).addClass('form-select');
      $('<option>').val('').text('Choose a branch').appendTo($branch);
      $.each(branchNames, function (key, name) { $('<option>').val(key).text(name).appendTo($branch); });
      $('<p>').append($('<label>').attr('for','branch-location').text('Branch: '), $branch).insertBefore($form.find('#experience-level').parent());
    }
    const $group = $('<select>').attr({id:'chosen-group',required:true}).addClass('form-select');
    const $groupBox = $('<p>').append($('<label>').attr('for','chosen-group').text('Published group: '), $group);
    $groupBox.insertAfter($form.find('#preferred-date').parent());
    const $summary = $('<p>').addClass('form-message').attr('aria-live','polite').insertAfter($groupBox);
    const $fields = $form.find('#applicant-name, #applicant-email, #applicant-phone, #applicant-age, #preferred-date, #branch-location, #experience-level, #safety-rules').add($group);
    $fields.each(function () {
      const $field = $(this);
      const id = $field.attr('id') + '-error';
      $('<span>').attr({id:id,'aria-live':'polite'}).addClass('text-danger small d-block').insertAfter($field);
      $field.attr('aria-describedby',id);
    });
    function clearError($field) {
      $field.removeClass('is-error').removeAttr('aria-invalid').siblings('#' + $field.attr('id') + '-error').text('');
    }
    // This chain removes the error class and ARIA flag, finds the sibling message,
    // then clears its text.
    $form.on('input change', 'input, select, textarea', function () {
      const $field = $(this);
      clearError($field);
      if ($field.is('#applicant-age')) $form.find('#chosen-group-error').text('');
      if ($result.hasClass('is-error')) $result.fadeOut(150, function () { $result.addClass('is-hidden').removeClass('is-error').show(); });
    });
    function chosenSport() { return $form.find('[name="sport_direction"]:checked').val(); }
    function chosenGroup() { return groups.find(group => group.id === Number($group.val())); }
    function updateSummary() {
      const group = chosenGroup();
      $groupBox.toggleClass('is-selected', !!group).toggleClass('is-active', !!group);
      $summary.text(group ? groupLabel(group) + ' · No place is reserved.' : 'Choose a published group to see the request summary.');
    }
    function updateChoices() {
      const previous = $group.val();
      const enteredAge = $form.find('#applicant-age').val();
      const choices = groups.filter(function (group) {
        const ageFits = !enteredAge || suitable(group, Number(enteredAge));
        const sameSport = group.sport === chosenSport();
        const sameBranch = !$branch.val() || group.branch === $branch.val();
        return ageFits && sameSport && sameBranch;
      });
      $group.empty().append($('<option>').val('').text(choices.length ? 'Choose a group' : 'No matching groups'));
      $.each(choices, function (_, group) { $('<option>').val(group.id).text(group.id + '. ' + branchNames[group.branch] + ' · ' + group.time).appendTo($group); });
      const previousStillAvailable = choices.some(group => String(group.id) === previous);
      $group.val(previousStillAvailable ? previous : '');
      updateSummary();
    }
    $form.on('input change', '#applicant-age, #branch-location, [name="sport_direction"]', updateChoices);
    $form.on('change', '#chosen-group, #preferred-date', updateSummary);
    function iso(date) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return date.getFullYear() + '-' + month + '-' + day;
    }
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const latest = new Date(tomorrow);
    latest.setDate(latest.getDate() + 89);
    $form.find('#preferred-date').attr({min:iso(tomorrow),max:iso(latest)});
    updateChoices();
    $form.on('submit', function (event) {
      // Without preventDefault the browser reloads this demonstration page.
      event.preventDefault();
      $fields.each(function () { clearError($(this)); });
      let $first = $();
      function check(selector, valid, message) {
        const $field = $form.find(selector);
        // The existing required, type and range attributes are checked first.
        if (valid && $field[0].checkValidity()) return;
        $field.addClass('is-error').attr('aria-invalid','true');
        $field.siblings('#' + $field.attr('id') + '-error').text(message);
        if (!$first.length) $first = $field;
      }
      const name = $.trim($form.find('#applicant-name').val());
      const email = $.trim($form.find('#applicant-email').val());
      const phone = $.trim($form.find('#applicant-phone').val());
      const age = Number($form.find('#applicant-age').val());
      const group = chosenGroup();
      const dateText = $form.find('#preferred-date').val();
      const date = dateText ? new Date(dateText + 'T12:00:00') : null;
      check('#applicant-name', name.length >= 2, 'Enter at least 2 characters.');
      check('#applicant-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address.');
      check('#applicant-phone', /^\+?[\d\s()-]{10,20}$/.test(phone) && phone.replace(/\D/g,'').length >= 10, 'Enter a phone number with at least 10 digits.');
      check('#applicant-age', Number.isInteger(age) && age >= 4 && age <= 100, 'Enter an age from 4 to 100.');
      check('#branch-location', !!$branch.val(), 'Choose a branch.');
      if ($form.find('#experience-level').length) check('#experience-level', !!$form.find('#experience-level').val(), 'Choose an experience level.');
      check('#chosen-group', !!group && suitable(group,age) && group.sport === chosenSport() && group.branch === $branch.val(), 'Choose a matching published group.');
      check('#preferred-date', !!date && !Number.isNaN(date.getTime()) && date >= tomorrow && date <= latest && (!group || group.days.includes(date.getDay())), 'Choose a group day within the next 90 days.');
      check('#safety-rules', $form.find('#safety-rules').prop('checked'), 'Confirm this is a demonstration.');
      $result.stop(true,true).removeClass('is-hidden is-success is-error').hide();
      if ($first.length) {
        $result.addClass('is-error').text('Please correct the marked fields.').fadeIn(200);
        $first.trigger('focus');
        return;
      }
      $result.addClass('is-success').text('Demo request for ' + name + ': ' + groupLabel(group) + ', ' + dateText + '. No data was sent or booking created.').fadeIn(200);
      $form.trigger('reset');
    });
    $form.on('reset', function () {
      setTimeout(function () {
        $fields.each(function () { clearError($(this)); });
        updateChoices();
      }, 0);
    });
    // Browser checks improve usability; only server checks can protect submitted data.
  }
});
