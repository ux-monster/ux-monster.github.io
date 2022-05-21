function bindEvent(selector, event, callback) {
  const dom = document.querySelectorAll(selector);
  if (dom && dom.length > 0) {
    dom.forEach(e => {
      e.addEventListener(event, callback);
    });
  }
}
function hasClass(target, className) {
  const type = typeof target;
  const isSelector = type === 'string';
  if (isSelector) {
    const selector = target;
    const dom = document.querySelector(selector);
    if (dom) {
      return dom.classList.contains(className);
    }
  } else {
    const dom = target;
    if (dom) {
      return dom.currentTarget.classList.contains(className);
    }
  }
  return false;
}
function addClass(target, className) {
  const type = typeof target;
  const isSelector = type === 'string';
  if (isSelector) {
    const selector = target;
    const dom = document.querySelector(selector);
    if (dom) {
      dom.classList.add(className);
    }
  } else {
    const dom = target;
    if (dom) {
      dom.currentTarget.classList.add(className);
    }
  }
}
function removeClass(target, className) {
  const type = typeof target;
  const isSelector = type === 'string';
  if (isSelector) {
    const selector = target;
    const dom = document.querySelector(selector);
    if (dom) {
      dom.classList.remove(className);
    }
  } else {
    const dom = target;
    if (dom) {
      dom.currentTarget.classList.remove(className);
    }
  }
}
function addClassAll(selector, className) {
  const dom = document.querySelectorAll(selector);
  if (dom && dom.length > 0) {
    dom.forEach(e => {
      e.classList.add(className);
    });
  }
}
function removeClassAll(selector, className) {
  const dom = document.querySelectorAll(selector);
  if (dom && dom.length > 0) {
    dom.forEach(e => {
      e.classList.remove(className);
    });
  }
}

// 카테고리 상세 페이지 다루기
const SidebarDetail = (function() {
  const selector = '#sidebar-detail';
  const expanded = 'expanded';
  let category = '';
  return {
    isOpen: (_category) => {
      return _category === category && 
      hasClass(selector, expanded);
    },
    open: (_category) => {
      category = _category;
      addClass(selector, expanded);
    },
    close: () => {
      removeClass(selector, expanded);
    },
  }
})();

bindEvent('.category-link', 'click', (e) => {
  const category = e.currentTarget.innerHTML;
  if(SidebarDetail.isOpen(category)) {
    removeClass(e, 'selected');
    SidebarDetail.close();
  } else {
    removeClassAll('.category-link', 'selected');
    addClass(e, 'selected');
    SidebarDetail.open(category);
  }
});
