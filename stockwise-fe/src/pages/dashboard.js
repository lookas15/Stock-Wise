import { renderLayout } from '../components/layout.js';

export async function renderDashboardPage() {
  const app = document.getElementById('app');

  let inventoryData = [];
  try {
    const res = await fetch('/dummy-items.json'); // ✅ Correct path
    inventoryData = await res.json();
  } catch (error) {
    console.error("Failed to load inventory data:", error);
  }

  const stockAlertRows = inventoryData
    .filter(item => item.stock < item.alert)
    .map(item => `
      <tr class="border-t">
        <td class="py-2">${item.id}</td>
        <td class="py-2">-</td>
        <td class="py-2">${item.stock}</td>
        <td class="py-2">${item.alert}</td>
        <td class="py-2 text-yellow-600">${item.status}</td>
      </tr>
    `).join('');

  const totalStockRows = inventoryData.map(item => `
    <tr class="border-t">
      <td class="py-2">${item.id}</td>
      <td class="py-2">${item.stock}</td>
      <td class="py-2">${item.alert}</td>
    </tr>
  `).join('');

  const dashboardContent = `
    <div class="min-h-screen bg-gray-100 text-gray-800 p-6">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <div class="flex items-center gap-4">
          <button class="text-gray-600 hover:text-gray-800">🔔</button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-400 rounded-full"></div>
            <span class="text-sm text-gray-700">Placeholder Profile</span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white shadow rounded-lg p-4 h-48 flex items-center justify-center text-gray-400 text-sm">
          [ Chart Placeholder ]
        </div>
        <div class="bg-white shadow rounded-lg p-4 h-48 flex items-center justify-center text-gray-400 text-sm">
          [ Pie Chart Placeholder ]
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Stock Alert</h2>
          <table class="w-full text-sm text-left">
            <thead class="border-b text-gray-600">
              <tr>
                <th class="py-2">Order ID</th>
                <th class="py-2">Date</th>
                <th class="py-2">Quantity</th>
                <th class="py-2">Alert amt.</th>
                <th class="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              ${stockAlertRows || `<tr><td colspan="5" class="py-2 text-center text-gray-500">No alerts.</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="bg-white shadow rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Total Stocks</h2>
          <table class="w-full text-sm text-left">
            <thead class="border-b text-gray-600">
              <tr>
                <th class="py-2">Order ID</th>
                <th class="py-2">Quantity</th>
                <th class="py-2">Alert amt.</th>
              </tr>
            </thead>
            <tbody>
              ${totalStockRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  app.innerHTML = renderLayout(dashboardContent);
}
