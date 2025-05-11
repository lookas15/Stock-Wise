import db from '../db.js';

export default {
  // GET all inventory items
  getAllItems: async (req, res) => {
    try {
      await db.read();
      res.status(200).json(db.data.inventory || []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory items.' });
    }
  },

  // POST add new item
  addItem: async (req, res) => {
    const { name, stock, alert } = req.body;

    if (!name || stock === undefined || alert === undefined) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    await db.read();

    const newItem = {
      id: Date.now().toString(),
      name,
      stock: Number(stock),
      alert: Number(alert),
    };

    // Auto-calculate status
    newItem.status =
      newItem.stock <= newItem.alert
        ? 'Critical'
        : newItem.stock <= newItem.alert + 10
        ? 'Warning'
        : 'OK';

    db.data.inventory ||= [];
    db.data.inventory.push(newItem);
    await db.write();

    res.status(201).json({ message: 'Item added', item: newItem });
  },

  // PUT update existing item
  updateItem: async (req, res) => {
    const { id } = req.params;
    const { name, stock, alert } = req.body;

    if (!name || stock === undefined || alert === undefined) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    await db.read();

    const item = db.data.inventory.find((i) => i.id === id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = name;
    item.stock = Number(stock);
    item.alert = Number(alert);
    item.status =
      item.stock <= item.alert
        ? 'Critical'
        : item.stock <= item.alert + 10
        ? 'Warning'
        : 'OK';

    await db.write();
    res.status(200).json({ message: 'Item updated', item });
  },

  // DELETE item
  deleteItem: async (req, res) => {
    const { id } = req.params;
    await db.read();

    const initialLength = db.data.inventory.length;
    db.data.inventory = db.data.inventory.filter((i) => i.id !== id);

    if (db.data.inventory.length === initialLength) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await db.write();
    res.status(200).json({ message: 'Item deleted' });
  },
};
