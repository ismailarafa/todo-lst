var itemUl;
var itemLi;
var savedItem;
var listUl;
var listItem;
var smol;
var createItemIcon;
var deleteBtn;
var editTxt;
var editDate;
var editBtn;
var savedDateInput;
var createInputField;
var text;
var dateFieldInput;
var itemInput;
var textInput;
var dateInput;
var btmNav;
var input;
var createSaveBtn;
var elementClicked;
var viewState;
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
    return itemText + itemDate;
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

var view = {
  displayItems: function () {
    itemUl = document.querySelector('ul');
    itemUl.innerHTML = '';
    itemList.items.forEach(function (item, position) {
      if (viewState === 'All' || viewState === undefined) {
        this.createItem(item, position);
      } else if (viewState === 'Completed' && item.completed === true) {
        this.createItem(item, position);
      } else if (viewState === 'Active' && item.completed === false && !(parseInt(itemList.items[position].itemDate.slice(0, 2)) < dateObj.todayDate || parseInt(itemList.items[position].itemDate.slice(3, 5)) <= dateObj.todayMonth || parseInt(itemList.items[position].itemDate.slice(6, 10)) <= dateObj.todayYear) && item.completed === false) {
        this.createItem(item, position);
      } else if (viewState === 'Urgent' && (parseInt(itemList.items[position].itemDate.slice(0, 2)) === dateObj.todayDate && parseInt(itemList.items[position].itemDate.slice(3, 5)) === dateObj.todayMonth && parseInt(itemList.items[position].itemDate.slice(6, 10)) === dateObj.todayYear) && item.completed === false) {
        this.createItem(item, position);
      } else if (viewState === 'Expired' && (parseInt(itemList.items[position].itemDate.slice(0, 2)) < dateObj.todayDate || parseInt(itemList.items[position].itemDate.slice(3, 5)) <= dateObj.todayMonth || parseInt(itemList.items[position].itemDate.slice(6, 10)) <= dateObj.todayYear) && item.completed === false) {
        this.createItem(item, position);
      }
    }, this);
  },
  createItem: function (item, position) {
    itemLi = document.createElement('li');
    editBtn = document.createElement('i');
    smol = document.createElement('small');
    text = document.createElement('span');
    editBtn.className = 'fa fa-pencil-square-o';
    createItemIcon = document.createElement('i');
    if (item.completed === true) {
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
    itemLi.insertBefore(text, itemLi.firstChild);
    itemLi.insertBefore(createItemIcon, itemLi.firstChild);
    itemLi.insertBefore(editBtn, itemLi.lastChild);
    itemLi.appendChild(smol);
    itemLi.insertBefore(this.createDeleteBtn(), itemLi.lastChild.nextSibling);
    itemUl.appendChild(itemLi);
  },
  createDeleteBtn: function () {
    deleteBtn = document.createElement('i');
    deleteBtn.className = 'fa fa-window-close';
    return deleteBtn;
  },
  enterListener: function () {
    itemInput = document.getElementById('item-txt');
    itemInput.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.keyCode === 13) {
        if (itemInput.value === '') {
          alert('Please enter a 2-do item');
        } else {
          handlers.addItem();
        }
      }
    });
    dateInput = document.getElementById('date-txt');
    dateInput.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.keyCode === 13) {
        if (dateInput.value === '' || dateInput.value.length !== 10 || dateInput.value.indexOf(' ') !== -1 || dateInput.value.indexOf('/') !== 2 || dateInput.value.lastIndexOf('/') !== 5 || parseInt(dateInput.value.slice(0, 2)) > 31 || parseInt(dateInput.value.slice(3, 5)) > 12 || parseInt(dateInput.value.slice(6, 10)) < 2015) {
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
    btmNav = document.getElementById('nav');
    btmNav.addEventListener('click', function (event) {
      elementClicked = event.target;
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
      view.displayItems();
    });
  },
  setUpEvents: function () {
    listUl = document.querySelector('ul');
    listUl.addEventListener('click', function (event) {
      elementClicked = event.target;
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
        if (itemList.items[elementClicked.parentNode.id].completed === true) {
          handlers.toggleComplete(elementClicked.parentNode.id);
        }
      }
    });
  }
};

var handlers = {
  addItem: function () {
    itemInput = document.getElementById('item-txt');
    dateFieldInput = document.getElementById('date-txt');
    itemList.addItem(itemInput.value, dateFieldInput.value);
    itemInput.value = '';
    dateFieldInput.value = '';
    view.displayItems();
  },
  changeItem: function (position) {
    editBtn.className = '';
    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'edit-txt';
    createInputField = document.createElement('input');
    createInputField.setAttribute('type', 'date');
    createInputField.id = 'edit-date';
    createInputField.value = itemList.items[position].itemDate;
    if (createInputField.value === '') {
      createInputField.placeholder = 'DD/MM/YYYY (Optional)';
    }
    listItem = document.getElementById(position.toString());
    input.value = itemList.items[position].itemText;
    listItem.textContent = '';
    createSaveBtn = document.createElement('i');
    createSaveBtn.className = 'fa fa-floppy-o';
    listItem.appendChild(input);
    listItem.appendChild(createInputField);
    view.createDeleteBtn();
    listItem.appendChild(createSaveBtn);
    listItem.appendChild(deleteBtn);
  },
  saveItem: function (position) {
    savedItem = document.getElementById(position.toString());
    textInput = savedItem.querySelector('input').value;
    savedDateInput = savedItem.querySelector('input[type="date"]').value;
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
