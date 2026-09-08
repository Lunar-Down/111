/**
 * 排序算法可视化工具
 * 支持冒泡排序、快速排序和选择排序的实时可视化演示
 */

class SortingVisualizer {
    constructor() {
        // 初始化状态
        this.array = [];
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 50;
        this.arraySize = 30;
        this.abortController = null;

        // DOM 元素引用
        this.container = null;
        this.status = null;
        this.progressBar = null;
        this.progressFill = null;
        this.progressText = null;
        this.stopBtn = null;

        // 初始化
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        try {
            // 获取 DOM 元素
            this.container = document.getElementById('array-container');
            this.status = document.getElementById('status');
            this.progressBar = document.getElementById('progress');
            this.progressFill = document.getElementById('progressFill');
            this.progressText = document.getElementById('progressText');
            this.stopBtn = document.getElementById('stopBtn');

            // 检查必要的 DOM 元素
            if (!this.container || !this.status) {
                throw new Error('必要的 DOM 元素未找到');
            }

            // 绑定事件
            this.initEventListeners();

            // 生成初始数组
            this.generateArray();

            console.log('排序算法可视化工具初始化成功');
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }

    /**
     * 绑定事件监听器
     */
    initEventListeners() {
        // 数组大小控制
        const arraySizeInput = document.getElementById('arraySize');
        const arraySizeValue = document.getElementById('arraySizeValue');
        if (arraySizeInput) {
            arraySizeInput.addEventListener('input', (e) => {
                this.arraySize = parseInt(e.target.value);
                if (arraySizeValue) arraySizeValue.textContent = this.arraySize;
                if (!this.isRunning) this.generateArray();
            });
        }

        // 动画速度控制
        const speedInput = document.getElementById('speed');
        const speedValue = document.getElementById('speedValue');
        if (speedInput) {
            speedInput.addEventListener('input', (e) => {
                this.animationSpeed = parseInt(e.target.value);
                if (speedValue) speedValue.textContent = this.animationSpeed;
            });
        }

        // 按钮事件
        this.addClickListener('generateBtn', () => this.generateArray());
        this.addClickListener('copyArrayBtn', () => this.copyArray());
        this.addClickListener('bubbleSortBtn', () => this.bubbleSort());
        this.addClickListener('quickSortBtn', () => this.quickSort());
        this.addClickListener('selectionSortBtn', () => this.selectionSort());
        this.addClickListener('stopBtn', () => this.stopSort());
        this.addClickListener('resetBtn', () => this.reset());

        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * 安全添加点击事件
     * @param {string} id - 元素ID
     * @param {Function} callback - 回调函数
     */
    addClickListener(id, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', callback);
        }
    }

    /**
     * 处理键盘快捷键
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyboard(e) {
        // 如果正在输入，不处理快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.generateArray();
                break;
            case 'Digit1':
                this.bubbleSort();
                break;
            case 'Digit2':
                this.quickSort();
                break;
            case 'Digit3':
                this.selectionSort();
                break;
            case 'Escape':
                this.stopSort();
                break;
        }
    }

    /**
     * 生成随机数组
     */
    generateArray() {
        if (this.isRunning) return;

        this.array = [];
        const maxValue = 350;

        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * maxValue) + 50);
        }

        this.renderArray();
        this.updateStatus('数组已生成，选择排序算法开始');
        this.updateProgress(0);
    }

    /**
     * 渲染数组可视化
     * @param {number[]} comparing - 正在比较的索引
     * @param {number[]} sorted - 已排序的索引
     * @param {number[]} active - 活动中的索引
     */
    renderArray(comparing = [], sorted = [], active = []) {
        if (!this.container) return;

        // 使用 DocumentFragment 优化性能
        const fragment = document.createDocumentFragment();

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}px`;
            bar.setAttribute('data-index', index);

            if (comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
            }
            if (active.includes(index)) {
                bar.classList.add('active');
            }

            fragment.appendChild(bar);
        });

        // 批量更新 DOM
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }

    /**
     * 异步休眠
     * @param {number} ms - 毫秒数
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise((resolve, reject) => {
            if (this.isPaused) {
                reject(new Error('排序已暂停'));
                return;
            }
            setTimeout(resolve, ms);
        });
    }

    /**
     * 检查是否应该继续执行
     */
    checkAbort() {
        if (!this.isRunning) {
            throw new Error('排序已停止');
        }
    }

    /**
     * 更新状态文本
     * @param {string} message - 状态消息
     */
    updateStatus(message) {
        if (this.status) {
            this.status.textContent = message;
        }
    }

    /**
     * 更新进度条
     * @param {number} percent - 进度百分比
     */
    updateProgress(percent) {
        if (this.progressFill) {
            this.progressFill.style.width = `${percent}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(percent)}%`;
        }
        if (this.progressBar) {
            this.progressBar.style.display = percent > 0 ? 'flex' : 'none';
        }
    }

    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    showError(message) {
        this.updateStatus(`❌ ${message}`);
        console.error(message);
    }

    /**
     * 复制数组到剪贴板
     */
    async copyArray() {
        try {
            const arrayStr = JSON.stringify(this.array);
            await navigator.clipboard.writeText(arrayStr);
            this.updateStatus('✅ 数组已复制到剪贴板');
            setTimeout(() => {
                this.updateStatus('点击"生成随机数组"开始');
            }, 2000);
        } catch (error) {
            console.error('复制失败:', error);
            this.updateStatus('❌ 复制失败，请手动复制');
        }
    }

    /**
     * 开始排序
     */
    startSort() {
        this.isRunning = true;
        if (this.stopBtn) {
            this.stopBtn.disabled = false;
        }
        this.abortController = new AbortController();
    }

    /**
     * 停止排序
     */
    stopSort() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.stopBtn) {
            this.stopBtn.disabled = true;
        }
        if (this.abortController) {
            this.abortController.abort();
        }
        this.updateStatus('排序已停止');
        this.updateProgress(0);
    }

    /**
     * 排序完成
     */
    finishSort(algorithmName) {
        this.isRunning = false;
        if (this.stopBtn) {
            this.stopBtn.disabled = true;
        }
        const sorted = Array.from({ length: this.array.length }, (_, i) => i);
        this.renderArray([], sorted);
        this.updateStatus(`✅ ${algorithmName}完成！`);
        this.updateProgress(100);
    }

    // ==================== 冒泡排序 ====================

    /**
     * 冒泡排序
     * 时间复杂度: O(n²)
     * 空间复杂度: O(1)
     */
    async bubbleSort() {
        if (this.isRunning) return;

        try {
            this.startSort();
            this.updateStatus('正在执行冒泡排序...');

            const arr = [...this.array];
            const n = arr.length;
            const sorted = [];
            let comparisons = 0;
            let swaps = 0;

            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    this.checkAbort();

                    // 显示比较过程
                    this.array = [...arr];
                    this.renderArray([j, j + 1], sorted);
                    comparisons++;
                    this.updateProgress((i * n + j) / (n * n) * 100);
                    await this.sleep(this.animationSpeed);

                    if (arr[j] > arr[j + 1]) {
                        // 交换
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        swaps++;
                        this.array = [...arr];
                        this.renderArray([j, j + 1], sorted);
                        await this.sleep(this.animationSpeed);
                    }
                }
                sorted.push(n - i - 1);
            }

            sorted.push(0);
            this.array = [...arr];
            this.finishSort('冒泡排序');
            console.log(`冒泡排序完成: ${comparisons} 次比较, ${swaps} 次交换`);
        } catch (error) {
            if (error.message !== '排序已停止') {
                console.error('冒泡排序出错:', error);
                this.showError('冒泡排序执行出错');
            }
        } finally {
            this.isRunning = false;
            if (this.stopBtn) this.stopBtn.disabled = true;
        }
    }

    // ==================== 快速排序 ====================

    /**
     * 快速排序
     * 时间复杂度: O(n log n) 平均, O(n²) 最坏
     * 空间复杂度: O(log n)
     */
    async quickSort() {
        if (this.isRunning) return;

        try {
            this.startSort();
            this.updateStatus('正在执行快速排序...');

            await this.quickSortHelper(0, this.array.length - 1);
            this.finishSort('快速排序');
        } catch (error) {
            if (error.message !== '排序已停止') {
                console.error('快速排序出错:', error);
                this.showError('快速排序执行出错');
            }
        } finally {
            this.isRunning = false;
            if (this.stopBtn) this.stopBtn.disabled = true;
        }
    }

    /**
     * 快速排序递归辅助函数
     * @param {number} low - 起始索引
     * @param {number} high - 结束索引
     */
    async quickSortHelper(low, high) {
        if (low < high && this.isRunning) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSortHelper(low, pivotIndex - 1);
            await this.quickSortHelper(pivotIndex + 1, high);
        }
    }

    /**
     * 快速排序分区函数
     * @param {number} low - 起始索引
     * @param {number} high - 结束索引
     * @returns {number} 分区点索引
     */
    async partition(low, high) {
        this.checkAbort();

        const pivot = this.array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.checkAbort();

            this.renderArray([j, high], [], [i]);
            this.updateProgress((j / this.array.length) * 100);
            await this.sleep(this.animationSpeed);

            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.renderArray([i, j], [], [high]);
                await this.sleep(this.animationSpeed);
            }
        }

        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.renderArray([i + 1, high]);
        await this.sleep(this.animationSpeed);

        return i + 1;
    }

    // ==================== 选择排序 ====================

    /**
     * 选择排序
     * 时间复杂度: O(n²)
     * 空间复杂度: O(1)
     */
    async selectionSort() {
        if (this.isRunning) return;

        try {
            this.startSort();
            this.updateStatus('正在执行选择排序...');

            const arr = [...this.array];
            const n = arr.length;
            const sorted = [];
            let comparisons = 0;
            let swaps = 0;

            for (let i = 0; i < n - 1; i++) {
                this.checkAbort();

                let minIdx = i;

                for (let j = i + 1; j < n; j++) {
                    this.checkAbort();

                    this.array = [...arr];
                    this.renderArray([minIdx, j], sorted, [i]);
                    comparisons++;
                    this.updateProgress((i * n + j) / (n * n) * 100);
                    await this.sleep(this.animationSpeed);

                    if (arr[j] < arr[minIdx]) {
                        minIdx = j;
                    }
                }

                if (minIdx !== i) {
                    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                    swaps++;
                    this.array = [...arr];
                    this.renderArray([i, minIdx], sorted);
                    await this.sleep(this.animationSpeed);
                }

                sorted.push(i);
            }

            sorted.push(n - 1);
            this.array = [...arr];
            this.finishSort('选择排序');
            console.log(`选择排序完成: ${comparisons} 次比较, ${swaps} 次交换`);
        } catch (error) {
            if (error.message !== '排序已停止') {
                console.error('选择排序出错:', error);
                this.showError('选择排序执行出错');
            }
        } finally {
            this.isRunning = false;
            if (this.stopBtn) this.stopBtn.disabled = true;
        }
    }

    /**
     * 重置
     */
    reset() {
        if (this.isRunning) {
            this.stopSort();
        }
        this.generateArray();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.sortingApp = new SortingVisualizer();
});
