var itemUl;
var itemLi;
var savedItem;
var listUl;
var listItem;
var createItemIcon;
var deleteBtn;
var editBtn;
var itemInput;
var textInput;
var dateInput;
var btmNav;
var input;
var today = new Date().getDate();
var createSaveBtn;
var elementClicked;
var viewState;
var itemList = {
  items: [],
  addItem: function (itemText, date) {
    this.items.push({
      itemText: itemText,
      completed: false,
      date: date
    });
  },
  changeItem: function (position, itemText, date) {
    this.items[position].itemText = itemText;
    this.items[position].date = date;
    return itemText + date;
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

var view = {
  displayItems: function () {
    itemUl = document.querySelector('ul');
    itemUl.innerHTML = '';
    itemList.items.forEach(function (item, position) {
      if (viewState === 'All' || viewState === undefined) {
        this.createItem(item, position);
      } else if (viewState === 'Completed' && item.completed === true) {
        this.createItem(item, position);
      } else if (viewState === 'Active' && item.completed === false) {
        this.createItem(item, position);
      } else if (viewState === 'Urgent' && parseInt(item.date.slice(0, 2)) === today) {
        this.createItem(item, position);
      } else if (viewState === 'Expired' && item.completed === false && parseInt(item.date.slice(0, 2)) < today) {
        this.createItem(item, position);
      }
    }, this);
  },
  createItem: function (item, position) {
    itemLi = document.createElement('li');
    editBtn = document.createElement('i');
    editBtn.className = 'fa fa-pencil-square-o';
    createItemIcon = document.createElement('i');
    if (item.completed === true) {
      createItemIcon.className = 'fa fa-check-circle-o';
    } else {
      createItemIcon.className = 'fa fa-circle-o';
    }
    if (viewState === 'Urgent' && parseInt(item.date.value.slice(0, 2)) === today) {
      createItemIcon.className = 'fa fa-exclamation-triangle';
    } else if (viewState === 'Expired' && parseInt(item.date.value.slice(0, 2)) > today) {
      createItemIcon.className = 'fa fa-exclamation';
    }
    itemLi.id = position;
    itemLi.innerHTML = item.itemText + item.date;
    itemLi.insertBefore(createItemIcon, itemLi.firstChild);
    itemLi.appendChild(this.createDeleteBtn());
    itemLi.insertBefore(editBtn, itemLi.lastChild);
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
        if (dateInput.value === '' || dateInput.value.length < 10 || dateInput.value.indexOf(' ') !== -1 || dateInput.value.indexOf('/') !== 2 || dateInput.value.lastIndexOf('/') !== 5 || parseInt(dateInput.value.slice(0, 3)) > 31 || parseInt(dateInput.value.slice(3, 6)) > 12 || parseInt(dateInput.value.slice(6, 10)) < 2015) {
          alert('Please enter a date in the DD/MM/YYYY format');
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
    dateInput = document.getElementById('date-txt');
    itemList.addItem(itemInput.value, dateInput.value);
    itemInput.value = '';
    dateInput.value = '';
    view.displayItems();
  },
  changeItem: function (position) {
    editBtn.className = '';
    input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'input-txt';
    dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.id = 'input-date';
    dateInput.value = itemList.items[position].date;
    if (dateInput.value === '') {
      dateInput.placeholder = 'DD/MM/YYYY (Optional)';
    }
    listItem = document.getElementById(position.toString());
    input.value = itemList.items[position].itemText;
    listItem.textContent = '';
    createSaveBtn = document.createElement('i');
    createSaveBtn.className = 'fa fa-floppy-o';
    listItem.appendChild(input);
    listItem.appendChild(dateInput);
    view.createDeleteBtn();
    listItem.appendChild(createSaveBtn);
    listItem.appendChild(deleteBtn);
  },
  saveItem: function (position) {
    savedItem = document.getElementById(position.toString());
    textInput = savedItem.querySelector('input').value;
    dateInput = savedItem.querySelector('input[type="date"]').value;
    itemList.changeItem(position, textInput, dateInput);
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
