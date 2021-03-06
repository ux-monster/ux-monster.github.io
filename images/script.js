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
  const isHome = window.location.pathname === '/';
  if(isHome) {
    document.querySelector('#subpage').style.display = 'none';
    document.querySelector('#app').classList.remove('expanded-post');
  } else {
    document.querySelector('#app').classList.add('expanded-post');
  }

  document.querySelector('#expand-post-button').addEventListener('click', () => {
    document.querySelector('#app').classList.toggle('expanded-post');
  })

  // ???????????? ?????? ????????? ?????????
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
        // ????????? ????????????
        const posts = await Posts.getPosts(_category);
        const groupByPosts = _.groupBy(posts, function(post) { return post.subCategory})
        console.log(groupByPosts);
        console.log(Object.keys(groupByPosts));
        
        // ????????? ??? ????????????
        const postsDom = Object.keys(groupByPosts).map(subCategory => {
          const posts = groupByPosts[subCategory];
          console.log(posts);
          return `
            <a class="group-name" href="#">${subCategory}</a>
            <ul class="posts">
            ${posts.map(post => `
              <li class="post">
                <a class="post-link" href="${post.link}">${post.title}</a>
              </li>`
            ).join('')}
            </ul>
          `;
        }).join('')

        document.querySelector('#sidebar-detail').innerHTML = `
          <div class="background" data-category="${_category}"></div>
          <div class="group" data-category="${_category}">
            ${postsDom}
          </div>
        `;;

        // ?????? ??? ??????
        category = _category;
        addClass(selector, expanded);
        removeClassAll('.background', 'show');
        removeClassAll('.group', 'show');
        addClass('.background[data-category="'+_category+'"]', 'show');
        addClass('.group[data-category="'+_category+'"]', 'show');
        // ?????? ??? ?????? ???, ?????? ??????
        document.querySelector('#app').classList.remove('expanded-post');
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
        const endY = document.querySelectorAll('[data-top]')[indexList.length-1].dataset.top * 1;
        
        let indexPercent = y / (contentHeight - window.innerHeight - endY) * 100;
        indexPercent = indexPercent >= 100 ? 100 : indexPercent;
        document.querySelector('.index-group-wrapper .background').style.transform = 'translateY('+(percent)+'%)'
      })
    }
  })();

  const Toggle = (function() {
    const selector = '#mode input';
    bindEvent(selector, 'change', (e) => {
      const checked = e.target.checked;
      if (checked) {
        // ??????????????? ??????
        removeClass('#admin', 'hide');
        addClass('#admin', 'show');
      } else {
        // ??????????????? ??????
        removeClass('#admin', 'show');
        addClass('#admin', 'hide');
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
          case 'Agile': name = 'agile'; break;
          default:
            break;
        }
        let baseUrl = './images/posts_';
        const tistoryBase = 'https://tistory1.daumcdn.net/tistory/5388634/skin/images/posts_';
        if(window.location.hostname === 'uxwiki.tistory.com') {
          baseUrl = tistoryBase;
        }
        return fetch(baseUrl + name + '.json').then(e => e.json());
      }
    }
  })();
});
