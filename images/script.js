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

window.addEventListener('DOMContentLoaded', (event) => {
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
      open: async (_category) => {
        // 데이터 불러오기
        const posts = await Posts.getPosts(_category);
        const groupByPosts = _.groupBy(posts, function(post) { return post.subCategory})
        console.log(groupByPosts);

        // 데이터 돔 추가하기
        const postsDom = Object.keys(groupByPosts).map(subCategory => {
          const posts = groupByPosts[subCategory];
          return `
            <div class="background" data-category="${_category}"></div>
            <div class="group" data-category="${_category}">
              <a class="group-name" href="#">개발환경 만들기</a>
              <ul class="posts">
                ${posts.map(post => {
                  return `<li class="post"><a class="post-link" href="${post.link}">${post.title}</a></li>`
                })}
              </ul>
            </div>
          `;
        })
        document.querySelector('#sidebar-detail').innerHTML = postsDom;

        // 확장 탭 열기
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
    const selectorTistory = '.page-content .contents_style';
    const dom = document.querySelector(selectorTistory);
    if(dom) {
      const indexWrapperDom = document.querySelector('.index-group');
      const children = Array.from(dom.children).filter(c => ['H2','H3','H4','H5'].includes(c.tagName));
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
        const contentHeight = document.querySelector('.page-content').scrollHeight;
        const y = e.target.scrollTop;
        const percent = y / (contentHeight - window.innerHeight) * 100;
        document.querySelector('#scrollbar .background').style.transform = 'translateX('+(-100+percent)+'%)'
        
        const indexList = document.querySelectorAll('[data-top]');
        const endY = document.querySelectorAll('[data-top]')[indexList.length-1].dataset.top;
        
        let indexPercent = y / (contentHeight - window.innerHeight - endY) * 100;
        indexPercent = indexPercent >= 100 ? 100 : indexPercent;
        document.querySelector('.index-group-wrapper .background').style.transform = 'translateY('+(indexPercent)+'%)'
      })
    }
  })();

  const Toggle = (function() {
    const selector = '#mode input';
    bindEvent(selector, 'change', (e) => {
      const checked = e.target.checked;
      if (checked) {
        // 관리자모드 켜기
      } else {
        // 관리자모드 끄기
      }
    })
  })();

  const Posts = (function() {
    return {
      getPosts: (category) => {
        let name = 'react';
        switch (category) {
          case 'React': name = 'react'; break;
          case 'React Native': name = 'react_native'; break;
          case 'Android': name = 'android'; break;
          case 'iOS': name = 'ios'; break;
          default:
            break;
        }
        return fetch('./images/posts_'+ name + '.json').then(e => e.json());
      }
    }
  })();
});
