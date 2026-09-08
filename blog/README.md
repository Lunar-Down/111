# 个人技术博客

一个简洁的个人技术博客项目，使用纯 HTML5 + CSS3 + JavaScript 构建，无任何外部依赖。

## 项目结构

```
demo/
├── index.html      # 主页面（HTML 结构）
├── style.css       # 样式文件（CSS 样式）
├── script.js       # 交互脚本（JavaScript 功能）
└── README.md       # 项目说明文档
```

## 功能特性

### 布局结构

| 区域 | 说明 |
|------|------|
| Header | 固定顶部导航栏，包含 Logo 和导航链接 |
| Hero | 首页横幅区域，展示博客标语 |
| Articles | 文章列表，以卡片形式展示 |
| About | 关于我页面，个人介绍和社交链接 |
| Footer | 页脚版权信息 |

### 交互功能

- **移动端菜单** - 小屏幕下点击汉堡按钮展开/收起导航
- **平滑滚动** - 点击导航链接平滑滚动到对应区域
- **滚动高亮** - 滚动页面时自动高亮当前所在区域的导航
- **卡片动画** - 文章卡片进入视口时触发淡入动画
- **悬停效果** - 卡片悬停时上浮并显示阴影

### 技术特点

- ✅ 纯原生开发，无框架依赖
- ✅ 响应式设计，适配各种屏幕尺寸
- ✅ CSS 变量统一管理主题色
- ✅ 语义化 HTML 标签
- ✅ 无障碍访问支持（aria-label）

## 使用方法

### 本地预览

直接在浏览器中打开 `index.html` 文件：

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### 添加新文章

在 `index.html` 中找到 `articles-grid` 区域，复制一个 article-card 模板：

```html
<article class="article-card">
    <div class="article-tag">标签名称</div>
    <h3>文章标题</h3>
    <p>文章摘要描述...</p>
    <div class="article-meta">
        <span class="date">2024-01-20</span>
        <a href="#" class="read-more">阅读全文 →</a>
    </div>
</article>
```

### 自定义样式

修改 `style.css` 中的 CSS 变量即可快速更换主题：

```css
:root {
    --primary: #2563eb;        /* 主题色 */
    --primary-dark: #1d4ed8;   /* 主题深色 */
    --text: #1f2937;           /* 文字颜色 */
    --text-light: #6b7280;     /* 浅色文字 */
    --bg: #ffffff;             /* 背景色 */
    --bg-secondary: #f9fafb;   /* 次要背景色 */
}
```

### 部署上线

由于是纯静态文件，可部署到任意静态托管服务：

- **GitHub Pages** - 推送到仓库，Settings 中启用 Pages
- **Netlify** - 拖拽文件夹即可部署
- **Vercel** - 导入项目自动部署

## 浏览器支持

支持所有现代浏览器：

- Chrome / Edge
- Firefox
- Safari

## 许可

MIT License
