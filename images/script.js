function bindEvent(selector, event, callback) {
  const _selector = selector;
  const _event = event;
  
  const dom = document.querySelectorAll(_selector);
  console.log(dom);
  if (dom && dom.length > 0) {
    dom.forEach(e => {
      e.addEventListener(_event, callback);
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
      return _category === category && document.querySelector(selector).classList.contains(expanded);
    },
    open: (_category) => {
      category = _category;
      document.querySelector(selector).classList.add(expanded);
    },
    close: () => {
      document.querySelector(selector).classList.remove(expanded);
    },
  }
})();

bindEvent('.category-link', 'click', (e) => {
  const category = e.currentTarget.innerHTML;
  if(SidebarDetail.isOpen(category)) {
    SidebarDetail.close();
  } else {
    SidebarDetail.open(category);
  }
});
