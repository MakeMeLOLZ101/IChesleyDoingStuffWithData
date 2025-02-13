export class SortableTable {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        
        this.init();
    }

    init() {
        this.createTableStructure();
        this.createPaginationControls();
        this.addEventListeners();
        this.renderTable();
    }

    createTableStructure() {
        const tableHTML = `
            <div class="table-controls">
                <div class="items-per-page">
                    <label>Items per page:</label>
                    <select id="itemsPerPage">
                        ${[10, 20, 30, 40, 50].map(num => 
                            `<option value="${num}">${num}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <table id="dataTable">
                <thead>
                    <tr>
                        <th data-sort="id">ID ▼</th>
                        <th data-sort="firstName">First Name</th>
                        <th data-sort="lastName">Last Name</th>
                        <th data-sort="height">Height</th>
                        <th data-sort="age">Age</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="pagination"></div>
        `;
        this.container.innerHTML = tableHTML;
    }

    createPaginationControls() {
        const totalPages = Math.ceil(this.data.length / this.itemsPerPage);
        const paginationHTML = `
            <button id="prevPage" ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${this.currentPage} of ${totalPages}</span>
            <button id="nextPage" ${this.currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
        document.getElementById('pagination').innerHTML = paginationHTML;
    }

    addEventListeners() {
        document.querySelectorAll('#dataTable th').forEach(th => {
            th.addEventListener('click', () => this.handleSort(th.dataset.sort));
        });

        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));

        document.getElementById('itemsPerPage').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
        });
    }

    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.renderTable();
    }

    sortData() {
        return [...this.data].sort((a, b) => {
            let compareA = a[this.sortColumn];
            let compareB = b[this.sortColumn];

            if (this.sortColumn === 'height') {
                compareA = parseInt(compareA.replace(/\D/g, ''));
                compareB = parseInt(compareB.replace(/\D/g, ''));
            }

            if (compareA < compareB) return this.sortDirection === 'asc' ? -1 : 1;
            if (compareA > compareB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    changePage(delta) {
        const newPage = this.currentPage + delta;
        const maxPage = Math.ceil(this.data.length / this.itemsPerPage);
        
        if (newPage >= 1 && newPage <= maxPage) {
            this.currentPage = newPage;
            this.renderTable();
        }
    }

    renderTable() {
        const sortedData = this.sortData();
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedData = sortedData.slice(start, start + this.itemsPerPage);

        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = paginatedData.map(row => `
            <tr>
                <td>${row.id}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.height}</td>
                <td>${row.age}</td>
            </tr>
        `).join('');

        document.querySelectorAll('#dataTable th').forEach(th => {
            const column = th.dataset.sort;
            th.textContent = th.textContent.replace(/[▼▲]/, '');
            if (column === this.sortColumn) {
                th.textContent += this.sortDirection === 'asc' ? ' ▲' : ' ▼';
            }
        });

        this.createPaginationControls();
    }
}
