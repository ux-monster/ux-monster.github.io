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

  // Initialize - create background components
  document.querySelectorAll('.category-link').forEach(link => {
    const background = document.createElement('div');
    background.className = 'background';
    background.setAttribute('data-category', link.innerHTML);
    document.querySelector(selector).appendChild(background);
  })

  return {
    isOpen: (_category) => {
      return _category === category && 
      hasClass(selector, expanded);
    },
    open: (_category) => {
      category = _category;
      addClass(selector, expanded);
      removeClassAll('.background', 'show');
      removeClassAll('.group', 'show');
      addClass('.background[data-category="'+_category+'"]', 'show');
      addClass('.group[data-category="'+_category+'"]', 'show');
    },
    close: () => {
      removeClassAll('.background', 'show');
      removeClassAll('.group', 'show');
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

const HeaderIndex = (function() {
  const selector = '.page-content';
  const dom = document.querySelector(selector);
  if(dom) {
    const indexWrapperDom = document.querySelector('.index-group');
    const children = Array.from(dom.children).filter(c => ['H1','H2','H3','H4','H5','H6'].includes(c.tagName));
    children.forEach((c, i) => {
      const title = c.innerHTML;
      const depth = c.tagName.substr(1, 1);
      const top = c.getBoundingClientRect().top;
      const indexDom = document.createElement('a');
      const marker = 'data-header-index-' + i;
      c.id = marker;
      indexDom.innerHTML = title;
      indexDom.className = 'header-index';
      indexDom.setAttribute('href', '#' + marker);
      indexDom.setAttribute('data-depth', depth);
      indexDom.setAttribute('data-top', top);
      indexWrapperDom.append(indexDom);
    });
  }
})();

const ScrollView = (function() {
  const selector = '.page-content';
  const dom = document.querySelector(selector);
  if(dom) {
    dom.addEventListener('scroll', (e) => {
      const y = e.target.scrollTop;
      const headerIndexList = Array.from(document.querySelectorAll('[data-top]'));
      headerIndexList.some((headerIndex, i) => {
        const top = headerIndex.dataset.top;
        const nextTop = headerIndexList[i+1]?.dataset.top || top + 2000;
        if(y >= top - 10 && y < nextTop) {
          removeClassAll('.header-index', 'active');
          document.querySelectorAll('.header-index')[i].classList.add('active');
        }
      })
    })
  }
})();
