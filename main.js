var itemUl;
var itemLi;
var createItemIcon;
var deleteBtn;
var elementClicked;
var itemList = {
  items: [],
  addItem: function (itemText, date) {
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
    var completedItems = [];
    this.items.forEach(function (item) {
      if (item.completed === true) {
        completedItems.push(item);
      }
    });
    this.items.forEach(function (item) {
      if (completedItems.length === totalItems) {
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
      if (item.completed === true) {
        createItemIcon.className = 'fa fa-check-circle-o';
      } else {
        createItemIcon.className = 'fa fa-circle-o';
      }

      itemLi.id = position + 'li';
      createItemIcon.id = position;
      itemLi.innerHTML = item.itemText;
      itemLi.insertBefore(createItemIcon, itemLi.firstChild);
      itemLi.appendChild(this.createDeleteBtn());
      itemUl.appendChild(itemLi);
    }, this);
  },
  createDeleteBtn: function () {
    deleteBtn = document.createElement('i');
    deleteBtn.className = 'fa fa-window-close';
    return deleteBtn;
  },
  setUpEvents: function () {
    itemUl = document.querySelector('ul');
    itemUl.addEventListener('click', function (event) {
      elementClicked = event.target;
      if (elementClicked.className === 'fa fa-window-close') {
        handlers.deleteItem(elementClicked.parentNode.id + 'li');
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
    var togglePosition = document.getElementsByTagName('i');
    togglePosition.addEventListener('click', function () {
      itemList.toggleComplete(togglePosition);
    });
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
