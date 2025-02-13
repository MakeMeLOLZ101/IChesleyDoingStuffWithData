import { tableData } from './data.js';
import { SortableTable } from './Table.js';

document.addEventListener('DOMContentLoaded', () => {
    const table = new SortableTable('tableContainer', tableData);
});