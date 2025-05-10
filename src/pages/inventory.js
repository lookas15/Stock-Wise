import { renderLayout } from '../components/layout.js';

export function renderInventoryPage() {
  const app = document.getElementById('app');

  fetch('/dummy-items.json')
    .then(response => response.json())
    .then(items => {
      const tableRows = items.map(item => `
        <tr>
          <td class="px-4 py-2 border">${item.id}</td>
          <td class="px-4 py-2 border">${item.name}</td>
          <td class="px-4 py-2 border">${item.stock}</td>
          <td class="px-4 py-2 border">${item.alert}</td>
          <td class="px-4 py-2 border">${item.status}</td>
        </tr>
      `).join('');

      const content = `
        <h1 class="text-3xl font-semibold mb-4">Inventory</h1>
        <p class="text-gray-600 mb-4">Below is the current stock list:</p>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border rounded-lg">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-2 border">ID</th>
                <th class="px-4 py-2 border">Name</th>
                <th class="px-4 py-2 border">Stock</th>
                <th class="px-4 py-2 border">Alert</th>
                <th class="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;

      app.innerHTML = renderLayout(content);
    })
    .catch(error => {
      app.innerHTML = renderLayout(`
        <h1 class="text-3xl font-semibold mb-4">Inventory</h1>
        <p class="text-red-500">Failed to load inventory data.</p>
        <pre class="bg-gray-100 p-2 mt-4 text-sm">${error}</pre>
      `);
    });
}
