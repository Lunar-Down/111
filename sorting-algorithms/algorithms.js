// 排序算法可视化

class SortingVisualizer {
    constructor() {
        this.array = [];
        this.container = document.getElementById('array-container');
        this.status = document.getElementById('status');
        this.isRunning = false;

        this.initEventListeners();
        this.generateArray();
    }

    initEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateArray());
        document.getElementById('bubbleSortBtn').addEventListener('click', () => this.bubbleSort());
        document.getElementById('quickSortBtn').addEventListener('click', () => this.quickSort());
        document.getElementById('selectionSortBtn').addEventListener('click', () => this.selectionSort());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    generateArray() {
        if (this.isRunning) return;

        this.array = [];
        const size = 30;

        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 350) + 50);
        }

        this.renderArray();
        this.status.textContent = '数组已生成，选择排序算法开始';
    }

    renderArray(comparing = [], sorted = [], active = []) {
        this.container.innerHTML = '';

        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}px`;

            if (comparing.includes(index)) {
                bar.classList.add('comparing');
            }
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
            }
            if (active.includes(index)) {
                bar.classList.add('active');
            }

            this.container.appendChild(bar);
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 冒泡排序
    async bubbleSort() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.status.textContent = '正在执行冒泡排序...';

        const arr = [...this.array];
        const n = arr.length;
        const sorted = [];

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // 显示比较过程
                this.array = [...arr];
                this.renderArray([j, j + 1], sorted);
                await this.sleep(50);

                if (arr[j] > arr[j + 1]) {
                    // 交换
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.array = [...arr];
                    this.renderArray([j, j + 1], sorted);
                    await this.sleep(50);
                }
            }
            sorted.push(n - i - 1);
        }

        sorted.push(0);
        this.array = [...arr];
        this.renderArray([], sorted);
        this.status.textContent = '冒泡排序完成！';
        this.isRunning = false;
    }

    // 快速排序
    async quickSort() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.status.textContent = '正在执行快速排序...';

        await this.quickSortHelper(0, this.array.length - 1);

        const sorted = Array.from({ length: this.array.length }, (_, i) => i);
        this.renderArray([], sorted);
        this.status.textContent = '快速排序完成！';
        this.isRunning = false;
    }

    async quickSortHelper(low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSortHelper(low, pivotIndex - 1);
            await this.quickSortHelper(pivotIndex + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.renderArray([j, high], [], [i]);
            await this.sleep(50);

            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.renderArray([i, j], [], [high]);
                await this.sleep(50);
            }
        }

        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.renderArray([i + 1, high]);
        await this.sleep(50);

        return i + 1;
    }

    // 选择排序
    async selectionSort() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.status.textContent = '正在执行选择排序...';

        const arr = [...this.array];
        const n = arr.length;
        const sorted = [];

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;

            for (let j = i + 1; j < n; j++) {
                this.array = [...arr];
                this.renderArray([minIdx, j], sorted, [i]);
                await this.sleep(50);

                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                this.array = [...arr];
                this.renderArray([i, minIdx], sorted);
                await this.sleep(50);
            }

            sorted.push(i);
        }

        sorted.push(n - 1);
        this.array = [...arr];
        this.renderArray([], sorted);
        this.status.textContent = '选择排序完成！';
        this.isRunning = false;
    }

    reset() {
        if (this.isRunning) return;
        this.generateArray();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});
