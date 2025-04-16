// 记录上次滚动位置，用于判断是向下还是向上滚动
let lastScrollPosition = 0;

// 获取回到顶部按钮元素
const backToTopButton = document.getElementById("back-to-top");

// 当 DOM 内容加载完成时执行以下逻辑
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header"); // 获取页面的导航栏（header）
    const hero = document.querySelector("#hero"); // 获取页面的 hero 区域
    const currentPage = getPageFromURL(); // 获取当前页面的名称，用于判断是哪一页

    // 初始时隐藏回到顶部按钮
    backToTopButton.style.display = "none"; // 隐藏回到顶部按钮

    // 如果当前页面是首页（main），执行动画
    if (currentPage === "main") {
        // 初次进入页面时，等待 Hero 动画完成后显示导航栏
        setTimeout(() => {
            header.classList.add("visible"); // 添加 "visible" 类来显示导航栏
        }, 2000); // 等待 Hero 动画的 2 秒
    } else {
        // 如果是其他页面，直接显示导航栏
        header.classList.add("visible");
    }

    // 滚动事件监听
    window.addEventListener("scroll", function () {
        const currentScrollPosition = window.pageYOffset; // 获取当前滚动位置

        // 根据滚动方向隐藏或显示导航栏
        if (currentScrollPosition > lastScrollPosition) {
            // 如果当前滚动位置比上次大，说明是向下滚动，隐藏导航栏
            header.classList.add("hidden");
        } else {
            // 如果当前滚动位置比上次小，说明是向上滚动，显示导航栏
            header.classList.remove("hidden");
        }

        // 更新上次滚动位置
        lastScrollPosition = currentScrollPosition;

        // 处理 Hero 区域的视差和字体缩放效果
        const scrollPercentage = currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight); // 计算滚动百分比
        handleHeroScrollAndFontSize(scrollPercentage); // 处理 Hero 区域的滚动效果

        // 显示或隐藏回到顶部按钮
        toggleBackToTopButton(currentScrollPosition);
    });

    // 使用 setTimeout 等待元素加载完成后再执行
    setTimeout(function() {
        const scrollArrow = document.querySelector("#scroll-arrow"); // 获取 V 形箭头
        if (scrollArrow) {
            // 如果箭头存在，添加点击事件，点击时滚动到下一页
            scrollArrow.addEventListener("click", function () {
                console.log("Allow");
                scrollToNextPage(); // 执行滚动到下一页的函数
            });
        } else {
            console.log("Scroll arrow not found");
        }
    }, 1000); // 延时 1 秒检查是否加载完成
});

// 处理页面加载逻辑
const path = getPageFromURL(); // 获取当前页面路径
const validPages = ['main', 'articles', 'achievements', 'discussion', 'about']; // 有效的页面列表

// 判断当前页面是否为有效页面，如果是有效页面则加载对应页面，否则加载首页
if (validPages.includes(path)) {
    loadPage(path); // 加载指定页面
} else {
    loadPage('main'); // 默认加载首页
}

// 加载指定页面内容
function loadPage(page) {
    const contentSection = document.getElementById('content'); // 获取页面内容容器

    // 使用 fetch 获取指定页面的 HTML 内容
    fetch(`/${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`无法加载页面: ${page}`); // 如果响应不成功，抛出错误
            return response.text(); // 返回页面的 HTML 文本
        })
        .then(data => {
            contentSection.innerHTML = data; // 将获取到的页面 HTML 内容插入到页面中

            // 等待加载完成后再绑定滚动和字体控制事件
            bindScrollEventAfterPageLoad();
            
            // 更新浏览历史记录
            updateHistoryState(page);
        })
        .catch(error => {
            contentSection.innerHTML = '<p>加载内容失败。</p >'; // 如果加载失败，显示错误信息
            console.error(error); // 在控制台输出错误信息
        });
}

// 在页面加载完成后绑定滚动事件
function bindScrollEventAfterPageLoad() {
    const hero = document.querySelector('#hero'); // 获取 hero 区域
    const heroText = document.querySelectorAll('#hero h1, #hero p'); // 获取 hero 区域的标题和段落

    // 如果 hero 区域存在并且包含文本内容，则绑定滚动事件
    if (hero && heroText.length > 0) {
        window.addEventListener('scroll', function() {
            const currentScrollPosition = window.pageYOffset; // 获取当前滚动位置
            const scrollPercentage = currentScrollPosition / (document.documentElement.scrollHeight - window.innerHeight); // 计算滚动百分比

            // 调用处理视差效果和字体大小调整的函数
            handleHeroScrollAndFontSize(scrollPercentage);
        });
    }
}

// 处理 hero 区域的滚动和字体大小变化
function handleHeroScrollAndFontSize(scrollPercentage) {
    const hero = document.querySelector('#hero');
    const heroText1 = document.querySelectorAll('#hero h1'); 
    const heroTextp = document.querySelectorAll('#hero p'); 

    if (hero && heroText1.length > 0) {
        // 增强视差效果：让 hero 区域滚动的速度慢于页面内容
        const heroOffset = scrollPercentage * window.innerHeight; // 通过调整滚动比例，使 hero 区域滚动速度慢
        hero.style.transform = `translateY(-${heroOffset}px)`;  // hero 区域向上移动的幅度增大

        // 增强字体缩小效果
        const heroFontSize1 = 4 - scrollPercentage * 3; // 初始字体 4rem，滚动时更加快速缩小
        heroText1.forEach(text => {
            text.style.fontSize = `${Math.max(heroFontSize1, 1)}rem`; // 防止字体过小，最小为 1rem
        });
    }
    if (hero && heroTextp.length > 0) {
        // 增强视差效果：让 hero 区域滚动的速度慢于页面内容
        const heroOffset = scrollPercentage * window.innerHeight; // 通过调整滚动比例，使 hero 区域滚动速度慢
        hero.style.transform = `translateY(-${heroOffset}px)`;  // hero 区域向上移动的幅度增大

        // 增强字体缩小效果
        const heroFontSizep = 2 - scrollPercentage * 1.5; // 初始字体 4rem，滚动时更加快速缩小
        heroTextp.forEach(text => {
            text.style.fontSize = `${Math.max(heroFontSizep, 0.5)}rem`; // 防止字体过小，最小为 0.5rem
        });
    }
}

// 获取当前页面路径并返回页面名称
function getPageFromURL() {
    return window.location.pathname.replace(/^\//, '') || 'main'; // 获取 URL 中的页面名称，如果为空则返回 'main'
}

// 更新浏览器历史记录
function updateHistoryState(page) {
    if (window.location.pathname !== `/${page}`) {
        // 如果当前路径与页面不一致，则更新浏览器历史记录
        history.pushState({ page: page }, page, `/${page}`);
    }
}

// 监听浏览器历史状态变化，加载相应页面
window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page); // 根据浏览器的历史记录加载页面
        loadArticleContent(event.state.page); // 加载浏览器历史中的页面内容
    }
});

// 滚动页面一页
function scrollToNextPage() {
    window.scrollBy({
        top: window.innerHeight,  // 向下滚动 1 视口高度
        behavior: 'smooth'        // 平滑滚动
    });
}

// 显示或隐藏回到顶部按钮
function toggleBackToTopButton(scrollPosition) {
    if (scrollPosition > window.innerHeight) {
        // 如果滚动位置大于 1 视口高度，显示回到顶部按钮
        backToTopButton.style.display = "block";
    } else {
        // 如果滚动位置小于 1 视口高度，隐藏回到顶部按钮
        backToTopButton.style.display = "none";
    }
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
