import { renderLayout } from '../components/layout.js';

export function renderInventoryPage() {
  const app = document.getElementById('app');

  async function loadInventory() {
    try {
      const response = await fetch('http://localhost:3000/api/inventory');
      const items = await response.json();

      const tableRows = items.map((item, index) => `
        <tr data-id="${item.id}">
          <td class="px-4 py-2 border">${item.id}</td>
          <td class="px-4 py-2 border">${item.name}</td>
          <td class="px-4 py-2 border">${item.stock}</td>
          <td class="px-4 py-2 border">${item.alert}</td>
          <td class="px-4 py-2 border">${item.status}</td>
          <td class="px-4 py-2 border">
            <button data-id="${item.id}" data-index="${index}" class="edit-btn text-blue-600 hover:underline mr-2">Edit</button>
            <button data-id="${item.id}" class="delete-btn text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      `).join('');

      const content = `
        <h1 class="text-3xl font-semibold mb-4">Inventory</h1>
        <form id="addForm" class="grid grid-cols-2 gap-4 mb-6">
          <input type="text" name="name" placeholder="Item Name" required class="border p-2 rounded"/>
          <input type="number" name="stock" placeholder="Stock Qty" required class="border p-2 rounded"/>
          <input type="number" name="alert" placeholder="Alert Level" required class="border p-2 rounded"/>
          <button type="submit" class="col-span-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500">Add Item</button>
        </form>

        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border rounded-lg">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-2 border">ID</th>
                <th class="px-4 py-2 border">Name</th>
                <th class="px-4 py-2 border">Stock</th>
                <th class="px-4 py-2 border">Alert</th>
                <th class="px-4 py-2 border">Status</th>
                <th class="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody id="inventoryTable">
              ${tableRows}
            </tbody>
          </table>
        </div>

        <!-- Modal -->
        <div id="editModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
          <div class="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 class="text-xl font-semibold mb-4">Edit Item</h2>
            <form id="editForm" class="space-y-4">
              <input type="hidden" name="id">
              <input type="text" name="name" placeholder="Item Name" required class="w-full border p-2 rounded" />
              <input type="number" name="stock" placeholder="Stock Qty" required class="w-full border p-2 rounded" />
              <input type="number" name="alert" placeholder="Alert Level" required class="w-full border p-2 rounded" />
              <div class="flex justify-end gap-2">
                <button type="button" id="cancelEdit" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      `;

      app.innerHTML = renderLayout(content);

      // ADD
      const addForm = document.getElementById('addForm');
      addForm.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(addForm);
        const newItem = {
          name: formData.get('name'),
          stock: Number(formData.get('stock')),
          alert: Number(formData.get('alert')),
        };

        await fetch('http://localhost:3000/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });

        loadInventory();
      });

      // DELETE
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
          const id = e.target.dataset.id;
          const confirmDel = confirm(`Delete item ID ${id}?`);
          if (confirmDel) {
            await fetch(`http://localhost:3000/api/inventory/${id}`, { method: 'DELETE' });
            loadInventory();
          }
        });
      });

      // EDIT
      const modal = document.getElementById('editModal');
      const editForm = document.getElementById('editForm');
      const cancelEdit = document.getElementById('cancelEdit');

      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = items.find(i => i.id === btn.dataset.id);
          if (item) {
            editForm.id.value = item.id;
            editForm.name.value = item.name;
            editForm.stock.value = item.stock;
            editForm.alert.value = item.alert;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
          }
        });
      });

      editForm.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const updatedItem = {
          name: formData.get('name'),
          stock: Number(formData.get('stock')),
          alert: Number(formData.get('alert')),
        };

        const id = formData.get('id');
        await fetch(`http://localhost:3000/api/inventory/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        });

        modal.classList.add('hidden');
        modal.classList.remove('flex');
        loadInventory();
      });

      cancelEdit.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });

    } catch (error) {
      app.innerHTML = renderLayout(`
        <h1 class="text-3xl font-semibold mb-4">Inventory</h1>
        <p class="text-red-500">Failed to load inventory data.</p>
        <pre class="bg-gray-100 p-2 mt-4 text-sm">${error}</pre>
      `);
    }
  }

  loadInventory();
}
