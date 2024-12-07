let lastScrollPosition = 0;

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector('header');
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        handleScroll(header);
    });

    // 动态加载页面
    const path = getPageFromURL();
    const validPages = ['main', 'articles', 'achievements', 'discussion', 'about'];
    
    if (validPages.includes(path)) {
        loadPage(path);
    } else {
        loadPage('main');
    }
});

// 加载指定页面内容
function loadPage(page) {
    const contentSection = document.getElementById('content');

    fetch(`/${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`无法加载页面: ${page}`);
            return response.text();
        })
        .then(data => {
            contentSection.innerHTML = data;

            // 等待加载完成后再绑定滚动和字体控制事件
            bindScrollEventAfterPageLoad();
            
            // 更新浏览历史
            updateHistoryState(page);
        })
        .catch(error => {
            contentSection.innerHTML = '<p>加载内容失败。</p >';
            console.error(error);
        });
}

// 处理滚动事件
function handleScroll(header) {
    const currentScrollPosition = window.pageYOffset;

    // 控制导航栏的隐藏/显示
    toggleHeaderVisibility(currentScrollPosition, header);

    // 更新上次滚动位置
    lastScrollPosition = currentScrollPosition;

    // 计算滚动百分比
    const scrollPercentage = currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight);

    // 处理 hero 区域的滚动和字体大小变化
    handleHeroScrollAndFontSize(scrollPercentage);
}

// 控制导航栏的显示或隐藏
function toggleHeaderVisibility(currentScrollPosition, header) {
    if (currentScrollPosition > lastScrollPosition) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
}

// 处理 hero 区域的视差效果和字体大小
function handleHeroScrollAndFontSize(scrollPercentage) {
    const hero = document.querySelector('#hero');
    const heroText = document.querySelectorAll('#hero h1, #hero p'); 

    if (hero && heroText.length > 0) {
        // 增强视差效果：让 hero 区域滚动的速度慢于页面内容
        const heroOffset = scrollPercentage * (window.innerHeight / 1.5); // 改小 / 1.5，使 hero 滚动得更慢
        hero.style.transform = `translateY(-${heroOffset}px)`;  // hero 区域向上移动的幅度增大

        // 增强字体缩小效果
        const heroFontSize = 4 - scrollPercentage * 3; // 初始字体 4rem，滚动时更加快速缩小
        heroText.forEach(text => {
            text.style.fontSize = `${Math.max(heroFontSize, 1)}rem`; // 防止字体过小
        });
    }
}

// 获取当前页面路径并返回页面名称
function getPageFromURL() {
    return window.location.pathname.replace(/^\//, '') || 'main';
}

// 在页面加载完成后绑定滚动事件
function bindScrollEventAfterPageLoad() {
    const hero = document.querySelector('#hero');
    const heroText = document.querySelectorAll('#hero h1, #hero p'); 

    if (hero && heroText.length > 0) {
        window.addEventListener('scroll', function() {
            const currentScrollPosition = window.pageYOffset;
            const scrollPercentage = currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight);

            // 视差效果和字体大小调整
            handleHeroScrollAndFontSize(scrollPercentage);
        });
    }
}

// 更新浏览器历史记录
function updateHistoryState(page) {
    if (window.location.pathname !== `/${page}`) {
        history.pushState({ page: page }, page, `/${page}`);
    }
}

// 监听浏览器历史状态变化，加载相应页面
window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    }
});