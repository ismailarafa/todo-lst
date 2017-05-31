var viewState = 'All';
var itemList = {
  items: [],
  addItem: function (itemText, date) {
    this.items.push({
      itemText: itemText,
      completed: false,
      itemDate: date
    });
  },
  changeItem: function (position, itemText, itemDate) {
    this.items[position].itemText = itemText;
    this.items[position].itemDate = itemDate;
  },
  deleteItem: function (position) {
    this.items.splice(position, 1);
  },
  toggleComplete: function (position) {
    this.items[position].completed = !this.items[position].completed;
  },
  toggleAll: function () {
    var totalItems = this.items.length;
    var completedItems = 0;
    this.items.forEach(function (item) {
      if (item.completed === true) {
        completedItems += 1;
      }
    });
    this.items.forEach(function (item) {
      if (completedItems === totalItems) {
        item.completed = false;
      } else {
        item.completed = true;
      }
    });
  }
};

var dateObj = {
  todayDate: new Date().getDate(),
  todayMonth: new Date().getMonth() + 1,
  todayYear: new Date().getYear() + 1900
};

var dateUtils = {
  isValidDate: function (dateVal) {
    var isValid = (dateVal.length === '' || dateVal.indexOf(' ') !== -1 || dateVal.indexOf('/') !== 2 || dateVal.lastIndexOf('/') !== 5 || parseInt(dateVal.slice(0, 2)) > 31 || parseInt(dateVal.slice(3, 5)) > 12 || parseInt(dateVal.slice(6, 10)) < 2015);
    return isValid;
  },
  isItemActive: function (dateVal) {
    var isActive = !(this.isItemExpired(dateVal));
    return isActive;
  },
  isItemUrgent: function (dateVal) {
    var isUrgent = (parseInt(dateVal.slice(0, 2)) === dateObj.todayDate && parseInt(dateVal.slice(3, 5)) === dateObj.todayMonth && parseInt(dateVal.slice(6, 10)) === dateObj.todayYear);
    return isUrgent;
  },
  isItemExpired: function (dateVal) {
    var isExpired = (parseInt(dateVal.slice(6, 10)) < dateObj.todayYear || (parseInt(dateVal.slice(6, 10)) <= dateObj.todayYear && parseInt(dateVal.slice(3, 5)) <= dateObj.todayMonth && parseInt(dateVal.slice(0, 2)) < dateObj.todayDate) || (parseInt(dateVal.slice(6, 10)) <= dateObj.todayYear && parseInt(dateVal.slice(3, 5)) < dateObj.todayMonth));
    return isExpired;
  }
};

var view = {
  displayItems: function () {
    var itemUl = document.querySelector('ul');
    var counter = 0;
    var counterCompleted = 0;
    itemUl.innerHTML = '';
    itemList.items.forEach(function (item, position) {
      if (!item.completed) {
        counter += 1;
      } else {
        counterCompleted += 1;
      }
      if (viewState === 'All' || viewState === undefined) {
        this.createItem(item, position);
      } else if (viewState === 'Completed' && item.completed) {
        this.createItem(item, position);
      } else if (viewState === 'Active' && !item.completed && (dateUtils.isItemActive(itemList.items[position].itemDate))) {
        this.createItem(item, position);
      } else if (viewState === 'Urgent' && (dateUtils.isItemUrgent(itemList.items[position].itemDate)) && !item.completed) {
        this.createItem(item, position);
      } else if (viewState === 'Expired' && (dateUtils.isItemExpired(itemList.items[position].itemDate)) && !item.completed) {
        this.createItem(item, position);
      }
    }, this);
    document.getElementById('all').innerHTML = itemList.items.length + ' All';
    document.getElementById('active').innerHTML = counter + ' Active';
    document.getElementById('completed').innerHTML = counterCompleted + ' Completed';

    if (itemList.items.length === 0) {
      document.getElementById('all').innerHTML = 'All';
    }

    if (counter === 0) {
      document.getElementById('active').innerHTML = 'Active';
    }
    if (counterCompleted === 0) {
      document.getElementById('completed').innerHTML = 'Completed';
    }
  },
  createInputField: function (position) {
    var inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.id = 'edit-txt';
    if (itemList.items[position].itemText === '' || itemList.items[position].itemText === undefined) {
      inputField.value = '';
    } else {
      inputField.value = itemList.items[position].itemText;
    }
    return inputField;
  },
  createDateField: function (position) {
    var dateField = document.createElement('input');
    dateField.setAttribute('type', 'date');
    dateField.id = 'edit-date';
    if (itemList.items[position].itemDate === '') {
      dateField.placeholder = 'DD/MM/YYYY';
    } else {
      dateField.value = itemList.items[position].itemDate;
    }
    return dateField;
  },
  createSaveBtn: function (position) {
    var saveBtn = document.createElement('i');
    saveBtn.className = 'fa fa-floppy-o';
    return saveBtn;
  },
  createItem: function (item, position) {
    var listUl = document.querySelector('ul');
    var itemLi = document.createElement('li');
    var editBtn = document.createElement('i');
    var smol = document.createElement('small');
    var text = document.createElement('span');
    var createItemIcon = document.createElement('i');
    editBtn.className = 'fa fa-pencil-square-o';
    if (item.completed) {
      createItemIcon.className = 'fa fa-check-circle-o';
      text.className = ' strike';
      smol.className = ' strike';
    } else {
      createItemIcon.className = 'fa fa-circle-o';
    }

    if (viewState === 'Urgent') {
      createItemIcon.className = 'fa fa-exclamation-triangle';
    } else if (viewState === 'Expired') {
      text.className = ' strike';
      smol.className = ' strike';
      createItemIcon.className = 'fa fa-exclamation';
    }
    itemLi.id = position;
    text.innerHTML = item.itemText;
    smol.innerHTML = item.itemDate;
    listUl.appendChild(itemLi);
    itemLi.insertBefore(createItemIcon, itemLi.firstChild);
    itemLi.appendChild(text);
    itemLi.appendChild(smol);
    itemLi.appendChild(editBtn);
    itemLi.appendChild(this.createDeleteBtn());
  },
  createDeleteBtn: function () {
    var deleteBtn = document.createElement('i');
    deleteBtn.className = 'fa fa-window-close';
    return deleteBtn;
  },
  enterListener: function () {
    var itemInput = document.getElementById('item-txt');
    var dateInput = document.getElementById('date-txt');
    itemInput.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.keyCode === 13) {
        if (itemInput.value === '') {
          alert('Please enter a 2-do item');
        } else {
          handlers.addItem();
        }
      }
    });
    dateInput.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.keyCode === 13) {
        if (dateUtils.isValidDate(dateInput.value)) {
          alert('Please enter a date in DD/MM/YYYY format');
        } else if (itemInput.value === '') {
          alert('Please enter a 2-do item');
        } else {
          handlers.addItem();
        }
      }
    });
  },
  toggleStates: function () {
    var btmNav = document.getElementById('nav');
    btmNav.addEventListener('click', function (event) {
      var i;
      var elementClicked = event.target;
      var navChildren = btmNav.children;
      if (elementClicked.id === 'all') {
        viewState = 'All';
      } else if (elementClicked.id === 'active') {
        viewState = 'Active';
      } else if (elementClicked.id === 'completed') {
        viewState = 'Completed';
      } else if (elementClicked.id === 'urgent') {
        viewState = 'Urgent';
      } else if (elementClicked.id === 'expired') {
        viewState = 'Expired';
      }
      for (i = 0; i < navChildren.length; i += 1) {
        navChildren[i].style.backgroundColor = '#def2e9';
        navChildren[i].style.color = '#3d9970';
      }
      elementClicked.style.backgroundColor = '#f7f7fd';
      elementClicked.style.color = '#85144b';
      view.displayItems();
    });
  },
  setUpEvents: function () {
    var eventList = document.querySelector('ul');
    eventList.addEventListener('click', function (event) {
      var elementClicked = event.target;
      if (elementClicked.className === 'fa fa-window-close') {
        handlers.deleteItem(elementClicked.parentNode.id);
      } else if (elementClicked.className === 'fa fa-circle-o') {
        handlers.toggleComplete(elementClicked.parentNode.id);
      } else if (elementClicked.className === 'fa fa-check-circle-o') {
        handlers.toggleComplete(elementClicked.parentNode.id);
      } else if (elementClicked.className === 'fa fa-pencil-square-o') {
        handlers.changeItem(elementClicked.parentNode.id);
      } else if (elementClicked.className === 'fa fa-floppy-o') {
        handlers.saveItem(elementClicked.parentNode.id);
        if (itemList.items[elementClicked.parentNode.id].completed) {
          handlers.toggleComplete(elementClicked.parentNode.id);
        }
      }
    });
  }
};

var handlers = {
  addItem: function () {
    var itemInput = document.getElementById('item-txt');
    var dateFieldInput = document.getElementById('date-txt');
    itemList.addItem(itemInput.value, dateFieldInput.value);
    itemInput.value = '';
    dateFieldInput.value = '';
    view.displayItems();
  },
  changeItem: function (position) {
    var listItem = document.getElementById(position.toString());
    listItem.textContent = '';
    listItem.appendChild(view.createInputField(position));
    listItem.appendChild(view.createDateField(position));
    listItem.appendChild(view.createSaveBtn(position));
    listItem.appendChild(view.createDeleteBtn());
  },
  saveItem: function (position) {
    var savedItem = document.getElementById(position.toString());
    var textInput = savedItem.querySelector('input').value;
    var savedDateInput = savedItem.querySelector('input[type="date"]').value;
    itemList.changeItem(position, textInput, savedDateInput);
    view.displayItems();
  },
  deleteItem: function (position) {
    itemList.deleteItem(position);
    view.displayItems();
  },
  toggleComplete: function (position) {
    itemList.toggleComplete(position);
    view.displayItems();
  },
  toggleAll: function () {
    itemList.toggleAll();
    if (document.getElementById('toggle').className === 'fa fa-toggle-off') {
      document.getElementById('toggle').className = 'fa fa-toggle-on';
    } else {
      document.getElementById('toggle').className = 'fa fa-toggle-off';
    }
    view.displayItems();
  }
};

view.setUpEvents();
view.enterListener();
view.toggleStates();
