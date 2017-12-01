suite('Navigation', function() {

  let field, fireKeyboardEvent;

  setup(function(done) {
    field = fixture('px_datetime_field');
    fireKeyboardEvent = function(elem, key){
      var evt = new CustomEvent('keydown',{detail:{'key':key,'keyIdentifier':key}});
       elem.dispatchEvent(evt);
    };
    flush(()=>{
      done();
    });
  });

  test('show date and time', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');

    assert.isFalse(field.hideTime);
    assert.isFalse(field.hideDate);
    assert.notEqual(entries[0].style.display, 'none');
    assert.notEqual(entries[1].style.display, 'none');

    //hide time
    field.hideTime = true;
    flush(function() {
      entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
      assert.notEqual(entries[0].style.display, 'none');
      assert.equal(entries[1].style.display, 'none');

      //show time, hide date
      field.hideTime = false;
      field.hideDate = true;
      flush(function() {
        entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
        assert.equal(entries[0].style.display, 'none');
        assert.notEqual(entries[1].style.display, 'none');

        //show date and time again
        field.hideDate = false;
        flush(function() {
          entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
          assert.notEqual(entries[0].style.display, 'none');
          assert.notEqual(entries[1].style.display, 'none');
          done();
        });
      });
    });
  });

  test('navigation from date to time', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell');

    var listener = function() {
      entries[0].removeEventListener('px-next-field', listener);
      done();
    };
    entries[0].addEventListener('px-next-field', listener);

    fireKeyboardEvent(dateCells[dateCells.length - 1], 'ArrowRight');
  });

  test('navigation from date to time doesnt trigger next-field from the outside', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell');

    var listener = function() {
      field.removeEventListener('px-next-field', listener);
      assert.isTrue(false);
      done();
    };
    field.addEventListener('px-next-field', listener);

    fireKeyboardEvent(dateCells[dateCells.length - 1], 'ArrowRight');

    setTimeout(function() {
      field.removeEventListener('px-next-field', listener);
      done();
    }, 200);
  });

  test('navigation from time to date', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

    var listener = function() {
      entries[1].removeEventListener('px-previous-field', listener);
      done();
    };
    entries[1].addEventListener('px-previous-field', listener);

    fireKeyboardEvent(timeCells[0], 'ArrowLeft');
  });

  test('navigation from time to date doesnt trigger previous-field from the outside', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

    var listener = function() {
      field.removeEventListener('px-previous-field', listener);
      assert.isTrue(false);
      done();
    };
    field.addEventListener('px-previous-field', listener);

    fireKeyboardEvent(timeCells[0], 'ArrowLeft');

    setTimeout(function() {
      field.removeEventListener('px-previous-field', listener);
      done();
    }, 200);
  });

  test('navigation from time to date doesnt trigger previous-field from the outside', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

    var listener = function() {
      field.removeEventListener('px-previous-field', listener);
      assert.isTrue(false);
      done();
    };
    field.addEventListener('px-previous-field', listener);

    fireKeyboardEvent(timeCells[0], 'ArrowLeft');

    setTimeout(function() {
      field.removeEventListener('px-previous-field', listener);
      done();
    }, 200);
  });

  test('hide time + right arrow on last date cell', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

    field.hideTime = true;
    flush(function() {

      var listener = function() {
        field.removeEventListener('px-next-field', listener);
        field.hideTime = false;
        done();
      };
      field.addEventListener('px-next-field', listener);

      fireKeyboardEvent(dateCells[dateCells.length-1], 'ArrowRight');
    });
  });

  test('hide date + left arrow on first time cell', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

    field.hideDate = true;
    flush(function() {

      var listener = function() {
        field.removeEventListener('px-previous-field', listener);
        field.hideDate = false;
        done();
      };
      field.addEventListener('px-previous-field', listener);

      fireKeyboardEvent(timeCells[0], 'ArrowLeft');
    });
  });
});

suite('submit without buttons', function() {

  let field;

  setup(function(done) {
    field = fixture('px_datetime_field');
    field.momentObj = Px.moment();
    flush(()=>{
      done();
    });
  });

  test('event is not fired when changing invalid value', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        dateInput = Polymer.dom(dateCells[1].root).querySelector('input'),
        i = 0,
        e = document.createEvent('Event');

    var listener = function(evt) {
      i++;
    };

    field.addEventListener('px-moment-changed', listener);

    //invalid month, should not trigger event
    dateInput.value = '99';
    e.initEvent("blur", true, true);
    dateInput.dispatchEvent(e);

    flush(function() {
      assert.equal(i, 0);
      var wrapper = Polymer.dom(field.root).querySelector('#fieldWrapper');
      assert.isTrue(wrapper.classList.contains('validation-failed'));
      field.removeEventListener('px-moment-changed', listener);
      done();
    });
  });

  test('event is fired when changing valid value', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        wrapper = Polymer.dom(field.root).querySelector('#fieldWrapper'),
        dateInput = Polymer.dom(dateCells[1].root).querySelector('input'),
        i = 0,
        e = document.createEvent('Event');

    var listener = function(evt) {
      i++;
    };

    field.addEventListener('px-moment-changed', listener);

    //valid month, should trigger event
    dateInput.value = '03';
    e.initEvent("blur", true, true);
    dateInput.dispatchEvent(e);

    flush(function() {
      //validation failed should not have been added
      assert.isFalse(wrapper.classList.contains('validation-failed'));
      field.removeEventListener('px-moment-changed', listener);
      done();
    });
  });
});

suite('submit with buttons', function() {

  let field, fireKeyboardEvent;

  setup(function(done) {
    field = fixture('px_datetime_field');
    field.showButtons = true;
    field.momentObj = Px.moment();
    fireKeyboardEvent = function(elem, key){
      var evt = new CustomEvent('keydown',{detail:{'key':key,'keyIdentifier':key}});
        elem.dispatchEvent(evt);
    };
    flush(()=>{
      done();
    });
  });

  test('event is not fired when changing valid value + buttons', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        i = 0;

    var listener = function(evt) {
      i++;
    };

    field.addEventListener('px-moment-changed', listener);

    //do a change
    field.momentObj = field.momentObj.clone().subtract(1, 'month');

    flush(function() {
      assert.equal(i, 0);
      field.removeEventListener('px-moment-changed', listener);
      done();
    });
  });

  test('event is fired when pressing enter', function(done) {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        i = 0;

    var listener = function(evt) {
      i++;
    };

    field.addEventListener('px-moment-changed', listener);

    //do a change
    field.momentObj = field.momentObj.clone().subtract(1, 'month');

    fireKeyboardEvent(field, 'Enter');

    flush(function() {
      assert.equal(i, 1);
      field.removeEventListener('px-moment-changed', listener);
      done();
    });
  });

  test('event is fired when clicking apply', function() {
    var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
        dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
        datetimeButtons = Polymer.dom(field.root).querySelector('px-datetime-buttons'),
        buttons = Polymer.dom(datetimeButtons.root).querySelectorAll('button'),
        i = 0;

    var listener = function(evt) {
      i++;
    };

    field.addEventListener('px-moment-changed', listener);

    //do a change
    field.momentObj = field.momentObj.clone().subtract(1, 'month');
    buttons[1].click();
    assert.equal(i, 1);
    field.removeEventListener('px-moment-changed', listener);
  });
});
