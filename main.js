var itemCompleted;
var itemUl;
var itemLi;
var createItemIcon;
var deleteBtn;
var elementClicked;
var completedUl = [];
var incompleteUl = [];
var itemList = {
  items: [],
  addItem: function (itemText, date) {
    date = document.getElementById('date-txt');
    this.items.push({
      itemText: itemText,
      completed: false,
      date: date
    });
  },
  changeItem: function (position, itemText) {
    this.items[position].itemText = itemText;
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
      itemLi = document.createElement('li');
      createItemIcon = document.createElement('i');
      itemCompleted = '';
      if (item.completed === true) {
        createItemIcon.className = 'fa fa-check-circle-o';
      } else {
        createItemIcon.className = 'fa fa-circle-o';
      }

      itemLi.id = position;
      itemLi.innerHTML = item.itemText;
      itemLi.insertBefore(createItemIcon, itemLi.firstChild);
      itemLi.appendChild(this.createDeleteBtn());
      itemUl.appendChild(itemLi);
    }, this);
  },
  createDeleteBtn: function () {
    deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'deleteBtn';
    return deleteBtn;
  },
  setUpEvents: function () {
    itemUl = document.querySelector('ul');
    itemUl.addEventListener('click', function (event) {
      elementClicked = event.target;
      if (elementClicked.className === 'deleteBtn') {
        handlers.deleteItem(parseInt(elementClicked.parentNode.id));
      }
    });
  }
};

var handlers = {
  addItem: function () {
    var itemInput = document.getElementById('item-txt');
    itemList.addItem(itemInput.value);
    itemInput.value = '';
    view.displayItems();
  },
  changeItem: function () {
    var changePosition = document.getElementById('change-position');
    var changeText = document.getElementById('change-txt');
    itemList.changeItem(changePosition.valueAsNumber, changeText.value);
    changePosition.value = '';
    changeText.value = '';
    view.displayItems();
  },
  deleteItem: function (position) {
    itemList.deleteItem(position);
    view.displayItems();
  },
  toggleComplete: function () {
    var togglePosition = document.getElementById('toggle-position');
    itemList.toggleComplete(togglePosition.valueAsNumber);
    togglePosition.value = '';
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
