import orderModel from "../../models/orders/orders.js";
import customerModel from "../../models/customers/customer.js";
import inventoryModel from "../../models/inventory/inventory.js";
import vinylModel from "../../models/vinyls/vinyl.js";
import cdsModel from "../../models/cds/cds.js";
import turntablesModel from "../../models/turntables/turntables.js";
import accessoriesModel from "../../models/accessories/accessories.js";

const dashboardController = {};

const CANCELLED_STATUS = /^cancelad[oa]$/i;

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// productType en inventory se guarda en minúscula (vinyl/cd/turntable/accessory),
// cada uno resuelto contra su propia colección para obtener el título a mostrar.
const TITLE_LOOKUPS = {
  vinyl: { model: vinylModel, field: "tittle" },
  cd: { model: cdsModel, field: "title" },
  turntable: { model: turntablesModel, field: null },
  accessory: { model: accessoriesModel, field: "name" },
};

const pctChange = (current, previous) => {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const dayKey = (date) => date.toISOString().slice(0, 10);

dashboardController.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const startOf7DaysAgo = new Date(now);
    startOf7DaysAgo.setHours(0, 0, 0, 0);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

    const startOf6MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      allOrders,
      customersTotal,
      customersThisMonth,
      customersLastMonth,
      recentOrdersRaw,
      lowStockRaw,
    ] = await Promise.all([
      orderModel.find({}, "status total createdAt items").lean(),
      customerModel.countDocuments(),
      customerModel.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      customerModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
      }),
      orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("customerId", "name last_name"),
      inventoryModel.find({ stock: { $ne: null } }).sort({ stock: 1 }).limit(5).lean(),
    ]);

    const validOrders = allOrders.filter((o) => !CANCELLED_STATUS.test(o.status || ""));

    const totalEarnings = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const thisMonthOrders = validOrders.filter((o) => o.createdAt >= startOfThisMonth);
    const lastMonthOrders = validOrders.filter(
      (o) => o.createdAt >= startOfLastMonth && o.createdAt < startOfThisMonth
    );

    const monthlyRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const ordersThisMonth = thisMonthOrders.length;
    const ordersLastMonth = lastMonthOrders.length;

    // Ventas por día (últimos 7 días)
    const dayBuckets = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOf7DaysAgo);
      d.setDate(d.getDate() + i);
      dayBuckets.set(dayKey(d), { label: WEEKDAY_LABELS[d.getDay()], total: 0 });
    }
    validOrders.forEach((o) => {
      const created = new Date(o.createdAt);
      if (created >= startOf7DaysAgo) {
        const key = dayKey(created);
        if (dayBuckets.has(key)) dayBuckets.get(key).total += o.total || 0;
      }
    });
    const salesByDay = Array.from(dayBuckets.values());

    // Ventas por mes (últimos 6 meses)
    const monthBuckets = new Map();
    for (let i = 0; i < 6; i++) {
      const d = new Date(startOf6MonthsAgo.getFullYear(), startOf6MonthsAgo.getMonth() + i, 1);
      monthBuckets.set(`${d.getFullYear()}-${d.getMonth()}`, {
        label: MONTH_LABELS[d.getMonth()],
        total: 0,
      });
    }
    validOrders.forEach((o) => {
      const created = new Date(o.createdAt);
      if (created >= startOf6MonthsAgo) {
        const key = `${created.getFullYear()}-${created.getMonth()}`;
        if (monthBuckets.has(key)) monthBuckets.get(key).total += o.total || 0;
      }
    });
    const salesByMonth = Array.from(monthBuckets.values());

    // Producto más vendido (por cantidad, usando el título guardado en cada item)
    const salesByProduct = new Map();
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const key = item.title || "Producto";
        salesByProduct.set(key, (salesByProduct.get(key) || 0) + (item.quantity || 0));
      });
    });
    let topSeller = null;
    salesByProduct.forEach((totalSold, title) => {
      if (!topSeller || totalSold > topSeller.totalSold) topSeller = { title, totalSold };
    });

    // Órdenes recientes
    const recentOrders = recentOrdersRaw.map((o) => ({
      id: o._id,
      customerName: o.customerId
        ? `${o.customerId.name || ""} ${o.customerId.last_name || ""}`.trim()
        : "Cliente eliminado",
      total: o.total || 0,
      status: o.status,
      date: o.createdAt,
    }));

    // Alertas de stock: resolver título del producto según su tipo
    const idsByType = {};
    lowStockRaw.forEach((item) => {
      if (!item.productId) return;
      if (!idsByType[item.productType]) idsByType[item.productType] = [];
      idsByType[item.productType].push(item.productId);
    });

    const titleMapEntries = await Promise.all(
      Object.entries(idsByType).map(async ([type, ids]) => {
        const lookup = TITLE_LOOKUPS[type];
        if (!lookup) return [type, new Map()];

        const docs = await lookup.model.find({ _id: { $in: ids } }).lean();
        const map = new Map();
        docs.forEach((doc) => {
          const title = lookup.field
            ? doc[lookup.field]
            : `${doc.brand || ""} ${doc.model || ""}`.trim();
          map.set(String(doc._id), title || "Producto");
        });
        return [type, map];
      })
    );
    const titleMapsByType = Object.fromEntries(titleMapEntries);

    const lowStock = lowStockRaw.map((item) => ({
      id: item._id,
      title: titleMapsByType[item.productType]?.get(String(item.productId)) || "Producto",
      stock: item.stock ?? 0,
    }));

    return res.status(200).json({
      totalEarnings,
      monthlyRevenue,
      monthlyRevenueChangePct: pctChange(monthlyRevenue, lastMonthRevenue),
      ordersThisMonth,
      ordersChangePct: pctChange(ordersThisMonth, ordersLastMonth),
      customersTotal,
      customersChangePct: pctChange(customersThisMonth, customersLastMonth),
      topSeller,
      salesByDay,
      salesByMonth,
      recentOrders,
      lowStock,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default dashboardController;
