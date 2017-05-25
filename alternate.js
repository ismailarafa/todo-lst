var itemUl;
var itemLi;
var itemIcon;
var itemCompleted;
var itemList = {
  items: []
};

var view = {
  displayItems: function () {
    itemUl = document.querySelector('ul');
    itemUl.innerHTML = '';
    itemList.itemsforEach(item, function (item, position) {
      itemLi = document.createElement('li');
      itemIcon = document.createElement('i');
      itemCompleted = '';
      if (item.completed === true) {
        itemIcon.className = 'fa fa-check-circle-o';
      } else {
        itemIcon.className = 'fa fa-circle-o';
      }

      itemLi.id = position;
      itemLi.innerHTML = itemIcon + item.itemText;
      itemLi.appendchild(itemIcon, this.createDeleteBtn());
      itemUl.appendchild(itemLi);
    }, this);
  }
};
