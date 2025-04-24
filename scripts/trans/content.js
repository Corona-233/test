chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "showTranslation") {
        let tip = document.getElementById("zhs-translate-tip");

        // 如果没有提示框元素，创建一个
        if (!tip) {
            tip = document.createElement("div");
            tip.id = "zhs-translate-tip";
            Object.assign(tip.style, {
                position: "absolute",
                background: "#333",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                fontSize: "14px",
                lineHeight: "1.5",
                zIndex: 999999,
                opacity: "0",  // 初始设置为不可见
                transition: "opacity 0.3s ease",
                maxWidth: "80%",  // 限制最大宽度为页面的80%
                wordWrap: "break-word",  // 自动换行
            });
            document.body.appendChild(tip);
        }

        // 获取选中文本的位置
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 计算提示框的显示位置
        const tipHeight = tip.offsetHeight;
        const tipWidth = tip.offsetWidth;
        const positionAbove = rect.top > tipHeight + 10;  // 如果选中的区域距离页面顶部足够远，就在上面显示
        const top = positionAbove ? rect.top - tipHeight - 10 : rect.bottom + 10;
        let left = rect.left + (rect.width - tipWidth) / 2; // 让提示框水平居中在选中的文本上方或下方

        // 确保提示框不会超出右边界
        const windowWidth = window.innerWidth;
        if (left + tipWidth > windowWidth) {
            left = windowWidth - tipWidth - 10;  // 让提示框显示在屏幕内
        }

        // 确保提示框不会超出左边界
        if (left < 10) {
            left = 10;  // 让提示框不会超出屏幕左侧
        }

        // 设置提示框的样式和位置
        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;
        tip.style.opacity = "1";
        tip.textContent = msg.text;

        // 监听鼠标点击事件，点击空白区域时关闭提示框
        function closeOnClick(event) {
            const selection = window.getSelection();
            // 如果点击的区域既不是选中的区域，也不是提示框本身，则关闭提示框
            if (!selection.toString().trim() || !tip.contains(event.target)) {
                tip.style.opacity = "0";
            }
        }

        // 添加事件监听
        document.addEventListener('mousedown', closeOnClick);
    }
});