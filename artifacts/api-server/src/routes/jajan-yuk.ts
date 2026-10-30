import { Router } from "express";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import pool from "../lib/db";
import { requireAuth } from "../middlewares/auth";
import { logger } from "../lib/logger";
import { snap } from "../lib/midtrans";

const router = Router();
const JAJAN_YUK_DELIVERY_AREA = "Garut Kota";
const JAJAN_YUK_DELIVERY_FEE = 9000;
const JAJAN_YUK_SERVICE_FEE_DEFAULT_PERCENT = 2;
const JAJAN_YUK_PAYMENT_SETTING_KEYS = [
  "jajan_yuk_delivery_discount",
  "jajan_yuk_service_fee_percent",
  "jajan_yuk_manual_whatsapp",
  "jajan_yuk_manual_bank_name",
  "jajan_yuk_manual_bank_account_no",
  "jajan_yuk_manual_bank_account_name",
  "jajan_yuk_manual_qris_image",
  "contact_phone",
];

const ORDER_STATUSES = new Set([
  "pending_confirmation",
  "confirmed",
  "preparing",
  "driver_assigned",
  "picked_up",
  "on_the_way",
  "delivered",
  "rejected",
]);

type MenuOptionGroup = {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: Array<{ id: string; name: string; price: number }>;
};

type SelectedOptionGroup = {
  group_id: string;
  group_name: string;
  choices: Array<{ id: string; name: string; price: number }>;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function tokenIsValid(token: unknown, storedHash: string) {
  if (typeof token !== "string" || token.length < 32) return false;
  const actual = Buffer.from(sha256(token), "hex");
  const expected = Buffer.from(storedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function whatsappUrl(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function parseDeliveryDiscount(value: unknown) {
  const discount = Number(value);
  if (!Number.isFinite(discount) || discount < 0) return 0;
  return Math.min(Math.floor(discount), JAJAN_YUK_DELIVERY_FEE);
}

function parseServiceFeePercent(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return JAJAN_YUK_SERVICE_FEE_DEFAULT_PERCENT;
  }
  const percent = Number(value);
  if (!Number.isFinite(percent) || percent < 0) return JAJAN_YUK_SERVICE_FEE_DEFAULT_PERCENT;
  return Math.min(percent, 100);
}

function calculateServiceFee(subtotal: number, percent: number) {
  return Math.max(0, Math.round(subtotal * percent / 100));
}

function calculateVoucherDiscount(
  discountType: unknown,
  discountValue: unknown,
  subtotal: number,
) {
  const value = Number(discountValue);
  if (!Number.isFinite(value) || value <= 0 || subtotal <= 0) return 0;
  const discount = discountType === "persen"
    ? Math.round(subtotal * value / 100)
    : discountType === "nominal"
      ? value
      : 0;
  return Math.min(subtotal, Math.max(0, Math.floor(discount)));
}

async function getJajanYukPaymentMethods() {
  const result = await pool.query(
    `SELECT key, value FROM site_settings WHERE key = ANY($1)`,
    [JAJAN_YUK_PAYMENT_SETTING_KEYS],
  );
  const settings = Object.fromEntries(result.rows.map((row: any) => [row.key, cleanText(row.value, 500)]));
  const whatsapp = settings.jajan_yuk_manual_whatsapp || settings.contact_phone || "";
  return {
    delivery_fee: JAJAN_YUK_DELIVERY_FEE,
    delivery_discount: parseDeliveryDiscount(settings.jajan_yuk_delivery_discount),
    service_fee_percent: parseServiceFeePercent(settings.jajan_yuk_service_fee_percent),
    whatsapp: whatsapp || null,
    whatsapp_url: whatsappUrl(whatsapp),
    bank_name: settings.jajan_yuk_manual_bank_name || null,
    bank_account_no: settings.jajan_yuk_manual_bank_account_no || null,
    bank_account_name: settings.jajan_yuk_manual_bank_account_name || null,
    qris_image: settings.jajan_yuk_manual_qris_image || null,
  };
}

function parseCoordinate(value: unknown, min: number, max: number) {
  if (value === null || value === undefined || value === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max
    ? coordinate
    : undefined;
}

function normalizeOptionGroups(value: unknown): MenuOptionGroup[] | null {
  let groups = value;
  if (typeof groups === "string") {
    try {
      groups = JSON.parse(groups);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(groups) || groups.length > 8) return null;

  const groupIds = new Set<string>();
  const normalized: MenuOptionGroup[] = [];
  for (const rawGroup of groups) {
    if (!rawGroup || typeof rawGroup !== "object" || Array.isArray(rawGroup)) return null;
    const group = rawGroup as Record<string, unknown>;
    const id = cleanText(group.id, 80);
    const name = cleanText(group.name, 80);
    if (
      !id ||
      !name ||
      groupIds.has(id) ||
      typeof group.required !== "boolean" ||
      typeof group.multiple !== "boolean" ||
      !Array.isArray(group.options) ||
      group.options.length < 1 ||
      group.options.length > 30
    ) return null;
    groupIds.add(id);

    const optionIds = new Set<string>();
    const options: MenuOptionGroup["options"] = [];
    for (const rawOption of group.options) {
      if (!rawOption || typeof rawOption !== "object" || Array.isArray(rawOption)) return null;
      const option = rawOption as Record<string, unknown>;
      const optionId = cleanText(option.id, 80);
      const optionName = cleanText(option.name, 80);
      const price = Number(option.price);
      if (
        !optionId ||
        !optionName ||
        optionIds.has(optionId) ||
        !Number.isInteger(price) ||
        price < 0 ||
        price > 10000000
      ) return null;
      optionIds.add(optionId);
      options.push({ id: optionId, name: optionName, price });
    }
    normalized.push({
      id,
      name,
      required: group.required,
      multiple: group.multiple,
      options,
    });
  }
  return normalized;
}

function resolveSelectedOptions(
  groups: MenuOptionGroup[],
  rawSelection: unknown,
): SelectedOptionGroup[] | null {
  if (rawSelection != null && (typeof rawSelection !== "object" || Array.isArray(rawSelection))) {
    return null;
  }
  const selection = (rawSelection || {}) as Record<string, unknown>;
  const groupsById = new Map(groups.map((group) => [group.id, group]));
  if (Object.keys(selection).some((groupId) => !groupsById.has(groupId))) return null;

  const resolved: SelectedOptionGroup[] = [];
  for (const group of groups) {
    const rawIds = selection[group.id] ?? [];
    if (!Array.isArray(rawIds) || rawIds.some((id) => typeof id !== "string")) return null;
    const selectedIds = rawIds as string[];
    if (
      new Set(selectedIds).size !== selectedIds.length ||
      (group.required && selectedIds.length === 0) ||
      (!group.multiple && selectedIds.length > 1)
    ) return null;
    const optionsById = new Map(group.options.map((option) => [option.id, option]));
    const choices = selectedIds.map((id) => optionsById.get(id));
    if (choices.some((choice) => !choice)) return null;
    if (choices.length > 0) {
      resolved.push({
        group_id: group.id,
        group_name: group.name,
        choices: choices.map((choice) => ({
          id: choice!.id,
          name: choice!.name,
          price: choice!.price,
        })),
      });
    }
  }
  return resolved;
}

function toPublicOrder(order: any, items: any[]) {
  return {
    order_code: order.order_code,
    merchant_name: order.merchant_name_snapshot,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    delivery_area: order.delivery_area,
    delivery_address: order.delivery_address,
    delivery_latitude: order.delivery_latitude == null ? null : Number(order.delivery_latitude),
    delivery_longitude: order.delivery_longitude == null ? null : Number(order.delivery_longitude),
    customer_note: order.customer_note,
    subtotal: Number(order.subtotal),
    delivery_fee: order.delivery_fee == null ? null : Number(order.delivery_fee),
    delivery_discount: Number(order.delivery_discount) || 0,
    service_fee: Number(order.service_fee) || 0,
    voucher_code: order.voucher_code || null,
    voucher_discount: Number(order.voucher_discount) || 0,
    total_amount: order.total_amount == null ? null : Number(order.total_amount),
    delivery_eta: order.delivery_eta,
    order_status: order.order_status,
    payment_status: order.payment_status,
    payment_type: order.payment_type,
    driver_name: order.driver_name,
    driver_phone: order.driver_phone,
    driver_vehicle: order.driver_vehicle,
    driver_plate: order.driver_plate,
    created_at: order.created_at,
    confirmed_at: order.confirmed_at,
    paid_at: order.paid_at,
    delivered_at: order.delivered_at,
    items: items.map((item) => ({
      id: item.id,
      item_name: item.item_name,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      line_total: Number(item.line_total),
      selected_options: item.selected_options || [],
    })),
  };
}

async function getPublicOrder(orderCode: string, token: unknown) {
  const result = await pool.query(
    `SELECT * FROM jajan_yuk_orders WHERE order_code = $1`,
    [orderCode.toUpperCase()],
  );
  const order = result.rows[0];
  if (!order || !tokenIsValid(token, order.tracking_token_hash)) return null;

  const items = await pool.query(
    `SELECT id, item_name, unit_price, quantity, line_total, selected_options
     FROM jajan_yuk_order_items WHERE order_id = $1 ORDER BY id`,
    [order.id],
  );
  return { order, items: items.rows };
}

function validPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 16;
}

router.get("/jajan-yuk/geocode", async (req, res) => {
  const query = cleanText(req.query.q, 160);
  if (query.length < 3) return res.json([]);

  try {
    const searchQuery = `${query}, Garut Kota, Garut, Indonesia`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=id&q=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "id",
          "User-Agent": "Nempo.id Jajan YUK address search/1.0",
        },
      },
    );
    if (!response.ok) {
      logger.warn({ status: response.status }, "Jajan YUK address search provider failed");
      return res.json([]);
    }

    const results = await response.json() as Array<{
      place_id?: number;
      display_name?: string;
      lat?: string;
      lon?: string;
      type?: string;
    }>;
    res.json(
      results
        .map((result) => ({
          id: String(result.place_id ?? `${result.lat}-${result.lon}`),
          display_name: cleanText(result.display_name, 300),
          latitude: Number(result.lat),
          longitude: Number(result.lon),
          type: cleanText(result.type, 40),
        }))
        .filter((result) =>
          result.display_name &&
          Number.isFinite(result.latitude) &&
          Number.isFinite(result.longitude),
        ),
    );
  } catch (err: any) {
    logger.warn({ err: err?.message }, "Failed to search Jajan YUK delivery address");
    res.json([]);
  }
});

export async function handleJajanYukPaymentNotification(body: any) {
  const midtransOrderId = String(body?.order_id ?? "");
  const transactionStatus = String(body?.transaction_status ?? "");
  const paymentType = cleanText(body?.payment_type, 60) || null;
  const transactionId = cleanText(body?.transaction_id, 100) || null;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT id, order_status, payment_status, total_amount
       FROM jajan_yuk_orders WHERE midtrans_order_id = $1 FOR UPDATE`,
      [midtransOrderId],
    );
    const order = result.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      logger.warn({ midtransOrderId }, "Jajan YUK Midtrans order not found");
      return;
    }
    if (Number(body?.gross_amount) !== Number(order.total_amount)) {
      await client.query("ROLLBACK");
      logger.error({ midtransOrderId }, "Jajan YUK Midtrans amount mismatch");
      return;
    }
    if (order.payment_status === "paid" || order.order_status === "rejected") {
      await client.query("COMMIT");
      return;
    }

    let nextPaymentStatus: string | null = null;
    if (transactionStatus === "settlement" || (transactionStatus === "capture" && body?.fraud_status === "accept")) {
      nextPaymentStatus = "paid";
    } else if (transactionStatus === "pending" || transactionStatus === "capture") {
      nextPaymentStatus = "pending";
    } else if (transactionStatus === "expire") {
      nextPaymentStatus = "expired";
    } else if (["deny", "cancel", "failure"].includes(transactionStatus)) {
      nextPaymentStatus = "failed";
    }
    if (!nextPaymentStatus) {
      await client.query("COMMIT");
      return;
    }

    await client.query(
      `UPDATE jajan_yuk_orders
       SET payment_status = $2,
           payment_type = COALESCE($3, payment_type),
           midtrans_transaction_id = COALESCE($4, midtrans_transaction_id),
           snap_token = CASE WHEN $2 IN ('paid', 'expired', 'failed') THEN NULL ELSE snap_token END,
           paid_at = CASE WHEN $2 = 'paid' AND paid_at IS NULL THEN NOW() ELSE paid_at END,
           updated_at = NOW()
       WHERE id = $1`,
      [order.id, nextPaymentStatus, paymentType, transactionId],
    );
    await client.query("COMMIT");
    logger.info({ midtransOrderId, paymentStatus: nextPaymentStatus }, "Jajan YUK payment status updated");
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message, midtransOrderId }, "Failed to apply Jajan YUK payment notification");
    throw err;
  } finally {
    client.release();
  }
}

/* Public merchant/menu data. Merchants appear only after an active menu is added in CMS. */
router.get("/jajan-yuk/merchants", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        k.id, k.slug, k.name, k.category, k.image, k.location, k.description,
        k.featured, k.hours, k.price_range, k.rating,
        k.rating AS computed_rating,
        COUNT(m.id)::int AS menu_count,
        MIN(m.price)::int AS min_price
      FROM kuliner k
      JOIN jajan_yuk_menu_items m ON m.kuliner_id = k.id AND m.active = TRUE
      WHERE k.active = TRUE
      GROUP BY k.id
      ORDER BY k.featured DESC, k.name ASC
    `);
    res.json(result.rows);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK merchants");
    res.status(500).json({ error: "Gagal memuat merchant Jajan YUK" });
  }
});

router.get("/jajan-yuk/merchants/:slug", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT k.id, k.slug, k.name, k.category, k.image, k.location,
              k.description, k.featured, k.hours, k.price_range, k.rating
       FROM kuliner k
       WHERE k.active = TRUE AND (k.slug = $1 OR k.id::text = $1)
       LIMIT 1`,
      [req.params.slug],
    );
    const merchant = result.rows[0];
    if (!merchant) return res.status(404).json({ error: "Merchant tidak ditemukan" });

    const menu = await pool.query(
      `SELECT id, name, description, price, image, option_groups
       FROM jajan_yuk_menu_items
       WHERE kuliner_id = $1 AND active = TRUE
       ORDER BY name`,
      [merchant.id],
    );
    if (menu.rows.length === 0) {
      return res.status(404).json({ error: "Menu merchant belum tersedia" });
    }
    res.json({ ...merchant, menu: menu.rows });
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK merchant menu");
    res.status(500).json({ error: "Gagal memuat menu merchant" });
  }
});

router.get("/jajan-yuk/payment-methods", async (_req, res) => {
  try {
    res.json(await getJajanYukPaymentMethods());
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK payment methods");
    res.status(500).json({ error: "Metode pembayaran belum dapat dimuat." });
  }
});

/* Guest checkout. Prices and merchant identity are always loaded from the database. */
router.post("/jajan-yuk/orders", async (req, res) => {
  const customerName = cleanText(req.body?.customer_name, 120);
  const customerPhone = cleanText(req.body?.customer_phone, 32);
  const deliveryArea = JAJAN_YUK_DELIVERY_AREA;
  const deliveryAddress = cleanText(req.body?.delivery_address, 1200);
  const deliveryLatitude = parseCoordinate(req.body?.delivery_latitude, -90, 90);
  const deliveryLongitude = parseCoordinate(req.body?.delivery_longitude, -180, 180);
  const customerNote = cleanText(req.body?.customer_note, 1000);
  const merchantId = Number(req.body?.merchant_id);
  const rawItems = req.body?.items;

  if (
    !Number.isInteger(merchantId) ||
    !customerName ||
    !validPhone(customerPhone) ||
    !deliveryArea ||
    !deliveryAddress ||
    deliveryLatitude === undefined ||
    deliveryLongitude === undefined ||
    (deliveryLatitude === null) !== (deliveryLongitude === null) ||
    !Array.isArray(rawItems) ||
    rawItems.length < 1 ||
    rawItems.length > 30
  ) {
    return res.status(400).json({ error: "Periksa kembali data dan menu pesanan." });
  }

  const quantities = new Map<number, number>();
  const cartLines: Array<{ id: number; quantity: number; selectedOptionIds: unknown }> = [];
  for (const item of rawItems) {
    const id = Number(item?.id);
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(id) || id < 1 || !Number.isInteger(quantity) || quantity < 1 || quantity > 30) {
      return res.status(400).json({ error: "Jumlah menu tidak valid." });
    }
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
    cartLines.push({ id, quantity, selectedOptionIds: item?.selected_option_ids });
  }
  if ([...quantities.values()].some((quantity) => quantity > 30)) {
    return res.status(400).json({ error: "Jumlah menu melebihi batas." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const merchantResult = await client.query(
      `SELECT id, name FROM kuliner WHERE id = $1 AND active = TRUE FOR SHARE`,
      [merchantId],
    );
    const merchant = merchantResult.rows[0];
    if (!merchant) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Merchant sedang tidak menerima pesanan." });
    }

    const menuResult = await client.query(
      `SELECT id, name, price, option_groups FROM jajan_yuk_menu_items
       WHERE kuliner_id = $1 AND active = TRUE AND id = ANY($2::int[])
       FOR SHARE`,
      [merchantId, [...quantities.keys()]],
    );
    if (menuResult.rows.length !== quantities.size) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Ada menu yang sudah tidak tersedia. Muat ulang menu." });
    }

    const menuById = new Map(menuResult.rows.map((item: any) => [Number(item.id), item]));
    const resolvedLines: Array<{
      menuItem: any;
      quantity: number;
      unitPrice: number;
      selectedOptions: SelectedOptionGroup[];
    }> = [];
    for (const line of cartLines) {
      const menuItem = menuById.get(line.id);
      const optionGroups = normalizeOptionGroups(menuItem.option_groups);
      if (!optionGroups) {
        throw new Error(`Invalid option groups configured for menu ${line.id}`);
      }
      const selectedOptions = resolveSelectedOptions(optionGroups, line.selectedOptionIds);
      if (!selectedOptions) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "Pilihan menu berubah atau belum lengkap. Periksa kembali pilihanmu.",
        });
      }
      const optionPrice = selectedOptions.reduce(
        (sum, group) => sum + group.choices.reduce((groupSum, choice) => groupSum + choice.price, 0),
        0,
      );
      resolvedLines.push({
        menuItem,
        quantity: line.quantity,
        unitPrice: Number(menuItem.price) + optionPrice,
        selectedOptions,
      });
    }

    const orderCode = `JY${randomBytes(12).toString("hex").toUpperCase()}`;
    const trackingToken = randomBytes(32).toString("base64url");
    const subtotal = resolvedLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const settingResult = await client.query(
      `SELECT key, value FROM site_settings WHERE key = ANY($1)`,
      [["jajan_yuk_delivery_discount", "jajan_yuk_service_fee_percent"]],
    );
    const settings = Object.fromEntries(
      settingResult.rows.map((row: any) => [row.key, cleanText(row.value, 100)]),
    );
    const deliveryDiscount = parseDeliveryDiscount(settings.jajan_yuk_delivery_discount);
    const serviceFeePercent = parseServiceFeePercent(settings.jajan_yuk_service_fee_percent);
    const serviceFee = calculateServiceFee(subtotal, serviceFeePercent);
    const requestedVoucherCode = cleanText(req.body?.voucher_code, 100).toUpperCase();
    let appliedVoucherCode: string | null = null;
    let voucherDiscount = 0;

    if (requestedVoucherCode) {
      const voucherResult = await client.query(
        `SELECT code, discount_type, discount_value, min_purchase, applicable_type, kuliner_id
         FROM vouchers
         WHERE code = $1
           AND active = TRUE
           AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
         LIMIT 1`,
        [requestedVoucherCode],
      );
      const voucher = voucherResult.rows[0];
      if (!voucher) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Kode voucher tidak ditemukan atau sudah tidak berlaku." });
      }

      const applicableType = cleanText(voucher.applicable_type, 50);
      if (applicableType && !["kuliner", "jajan-yuk", "umum", "all"].includes(applicableType)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Voucher ini tidak berlaku untuk Jajan YUK." });
      }
      if (voucher.kuliner_id != null && Number(voucher.kuliner_id) !== merchantId) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Voucher ini hanya berlaku untuk merchant tertentu." });
      }
      if (!["persen", "nominal"].includes(voucher.discount_type)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Voucher ini tidak dapat digunakan untuk pesanan Jajan YUK." });
      }
      if (Number(voucher.min_purchase) > 0 && subtotal < Number(voucher.min_purchase)) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Minimum pembelian Rp ${Number(voucher.min_purchase).toLocaleString("id-ID")} untuk voucher ini.`,
        });
      }

      appliedVoucherCode = String(voucher.code);
      voucherDiscount = calculateVoucherDiscount(voucher.discount_type, voucher.discount_value, subtotal);
    }

    const totalAmount = Math.max(
      0,
      subtotal + serviceFee + JAJAN_YUK_DELIVERY_FEE - deliveryDiscount - voucherDiscount,
    );

    const inserted = await client.query(
      `INSERT INTO jajan_yuk_orders
         (order_code, tracking_token_hash, kuliner_id, merchant_name_snapshot,
           customer_name, customer_phone, delivery_area, delivery_address,
           delivery_latitude, delivery_longitude, customer_note,
           subtotal, delivery_fee, delivery_discount, service_fee, voucher_code, voucher_discount, total_amount)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING id, order_code`,
      [
        orderCode,
        sha256(trackingToken),
        merchant.id,
        merchant.name,
        customerName,
        customerPhone,
        deliveryArea,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        customerNote || null,
        subtotal,
        JAJAN_YUK_DELIVERY_FEE,
        deliveryDiscount,
        serviceFee,
        appliedVoucherCode,
        voucherDiscount,
        totalAmount,
      ],
    );
    const orderId = inserted.rows[0].id;

    for (const line of resolvedLines) {
      await client.query(
        `INSERT INTO jajan_yuk_order_items
           (order_id, menu_item_id, item_name, unit_price, quantity, line_total, selected_options)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)`,
        [
          orderId,
          line.menuItem.id,
          line.menuItem.name,
          line.unitPrice,
          line.quantity,
          line.unitPrice * line.quantity,
          JSON.stringify(line.selectedOptions),
        ],
      );
    }

    await client.query("COMMIT");
    logger.info({ orderCode, merchantId, subtotal, serviceFee, deliveryDiscount, voucherDiscount }, "Jajan YUK order created");
    res.status(201).json({
      order_code: orderCode,
      tracking_token: trackingToken,
      subtotal,
      delivery_area: JAJAN_YUK_DELIVERY_AREA,
      delivery_fee: JAJAN_YUK_DELIVERY_FEE,
      delivery_discount: deliveryDiscount,
      service_fee: serviceFee,
      voucher_code: appliedVoucherCode,
      voucher_discount: voucherDiscount,
      total_amount: totalAmount,
      delivery_latitude: deliveryLatitude,
      delivery_longitude: deliveryLongitude,
      order_status: "pending_confirmation",
      payment_status: "unpaid",
    });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message }, "Failed to create Jajan YUK order");
    res.status(500).json({ error: "Pesanan gagal disimpan. Silakan coba lagi." });
  } finally {
    client.release();
  }
});

/* Private customer tracking endpoint: the random token is never stored in plaintext. */
router.get("/jajan-yuk/orders/:code", async (req, res) => {
  try {
    const result = await getPublicOrder(req.params.code, req.query.token);
    if (!result) return res.status(404).json({ error: "Pesanan tidak ditemukan." });
    res.json(toPublicOrder(result.order, result.items));
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK order");
    res.status(500).json({ error: "Gagal memuat pelacakan pesanan." });
  }
});

/* Payment can start after checkout. Merchant confirmation is still required before preparation. */
router.post("/jajan-yuk/orders/:code/payment", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT * FROM jajan_yuk_orders WHERE order_code = $1 FOR UPDATE`,
      [req.params.code.toUpperCase()],
    );
    const order = result.rows[0];
    if (!order || !tokenIsValid(req.body?.tracking_token, order.tracking_token_hash)) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pesanan tidak ditemukan." });
    }
    if (!["pending_confirmation", "confirmed"].includes(order.order_status) || order.total_amount == null) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pembayaran tidak tersedia untuk status pesanan ini." });
    }
    if (order.payment_status === "paid") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pesanan ini sudah dibayar." });
    }
    if (order.payment_status === "pending" && order.snap_token) {
      await client.query("COMMIT");
      return res.json({ snap_token: order.snap_token });
    }
    if (order.order_status === "rejected" || order.total_amount <= 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pembayaran tidak tersedia untuk pesanan ini." });
    }

    const nextAttempt = Number(order.payment_attempt) + 1;
    const midtransOrderId = `${order.order_code}-P${nextAttempt}`;
    const customerItems = await client.query(
      `SELECT item_name, unit_price, quantity
       FROM jajan_yuk_order_items WHERE order_id = $1`,
      [order.id],
    );
    const snapResponse = await snap.createTransaction({
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Number(order.total_amount),
      },
      customer_details: {
        first_name: order.customer_name,
        phone: order.customer_phone,
      },
      item_details: [
        ...customerItems.rows.map((item: any) => ({
          id: `${order.order_code}-${item.item_name}`.slice(0, 50),
          price: Number(item.unit_price),
          quantity: Number(item.quantity),
          name: String(item.item_name).slice(0, 50),
        })),
        ...(Number(order.delivery_fee) - Number(order.delivery_discount || 0) > 0
          ? [{
              id: `${order.order_code}-DELIVERY`,
              price: Math.max(0, Number(order.delivery_fee) - Number(order.delivery_discount || 0)),
              quantity: 1,
              name: "Ongkos kirim",
            }]
          : []),
        ...(Number(order.service_fee || 0) > 0
          ? [{
              id: `${order.order_code}-SERVICE-FEE`,
              price: Number(order.service_fee),
              quantity: 1,
              name: "Biaya layanan",
            }]
          : []),
        ...(Number(order.voucher_discount) > 0
          ? [{
              id: `${order.order_code}-VOUCHER`,
              price: -Number(order.voucher_discount),
              quantity: 1,
              name: `Voucher ${String(order.voucher_code || "").slice(0, 30)}`,
            }]
          : []),
      ],
    });

    await client.query(
      `UPDATE jajan_yuk_orders
       SET payment_status = 'pending', payment_attempt = $2,
           midtrans_order_id = $3, snap_token = $4, updated_at = NOW()
       WHERE id = $1`,
      [order.id, nextAttempt, midtransOrderId, snapResponse.token],
    );
    await client.query("COMMIT");
    res.json({ snap_token: snapResponse.token });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message, code: req.params.code }, "Failed to start Jajan YUK payment");
    res.status(502).json({ error: "Pembayaran belum dapat dimulai. Coba lagi." });
  } finally {
    client.release();
  }
});

/* Manual payment never becomes paid from this request. Admin must verify the transfer. */
router.post("/jajan-yuk/orders/:code/manual-payment", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT * FROM jajan_yuk_orders WHERE order_code = $1 FOR UPDATE`,
      [req.params.code.toUpperCase()],
    );
    const order = result.rows[0];
    if (!order || !tokenIsValid(req.body?.tracking_token, order.tracking_token_hash)) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pesanan tidak ditemukan." });
    }
    if (!["pending_confirmation", "confirmed"].includes(order.order_status) || order.total_amount == null || order.total_amount <= 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pembayaran tidak tersedia untuk status pesanan ini." });
    }
    if (order.payment_status === "paid") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pesanan ini sudah dibayar." });
    }
    if (order.payment_status === "pending" && order.payment_type && order.payment_type !== "manual_transfer") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pembayaran Midtrans sedang berjalan. Selesaikan atau tunggu statusnya terlebih dahulu." });
    }

    await client.query(
      `UPDATE jajan_yuk_orders
       SET payment_status = 'pending',
           payment_type = 'manual_transfer',
           snap_token = NULL,
           midtrans_order_id = NULL,
           midtrans_transaction_id = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [order.id],
    );
    await client.query("COMMIT");
    res.json({
      payment_status: "pending",
      payment_type: "manual_transfer",
      methods: await getJajanYukPaymentMethods(),
    });
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message, code: req.params.code }, "Failed to request manual Jajan YUK payment");
    res.status(500).json({ error: "Permintaan pembayaran manual belum dapat disimpan." });
  } finally {
    client.release();
  }
});

/* Admin menu maintenance. */
router.get("/admin/jajan-yuk/merchants", requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, location, active
       FROM kuliner ORDER BY name`,
    );
    res.json(result.rows);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK CMS merchants");
    res.status(500).json({ error: "Gagal memuat daftar merchant." });
  }
});

router.get("/admin/jajan-yuk/menu-items", requireAuth, async (req, res) => {
  try {
    const merchantId = req.query.merchant_id ? Number(req.query.merchant_id) : null;
    if (merchantId != null && !Number.isInteger(merchantId)) {
      return res.status(400).json({ error: "Merchant tidak valid." });
    }
    const result = await pool.query(
      `SELECT m.*, k.name AS merchant_name
       FROM jajan_yuk_menu_items m
       JOIN kuliner k ON k.id = m.kuliner_id
       WHERE ($1::int IS NULL OR m.kuliner_id = $1)
       ORDER BY k.name, m.name`,
      [merchantId],
    );
    res.json(result.rows);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK menu items");
    res.status(500).json({ error: "Gagal memuat menu." });
  }
});

router.post("/admin/jajan-yuk/menu-items", requireAuth, async (req, res) => {
  const merchantId = Number(req.body?.kuliner_id);
  const name = cleanText(req.body?.name, 120);
  const description = cleanText(req.body?.description, 1000);
  const price = Number(req.body?.price);
  const optionGroups = normalizeOptionGroups(req.body?.option_groups ?? []);
  if (!Number.isInteger(merchantId) || !name || !Number.isInteger(price) || price < 1) {
    return res.status(400).json({ error: "Merchant, nama menu, dan harga wajib diisi." });
  }
  if (!optionGroups) {
    return res.status(400).json({ error: "Pilihan menu tidak valid. Periksa nama grup, pilihan, dan harga tambahannya." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO jajan_yuk_menu_items (kuliner_id, name, description, price, image, active, option_groups)
       SELECT id, $2, $3, $4, NULLIF($5, ''), COALESCE($6, TRUE), $7::jsonb
       FROM kuliner WHERE id = $1
       RETURNING *`,
      [
        merchantId,
        name,
        description,
        price,
        cleanText(req.body?.image, 1000),
        req.body?.active,
        JSON.stringify(optionGroups),
      ],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Merchant tidak ditemukan." });
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to create Jajan YUK menu item");
    res.status(500).json({ error: "Gagal menyimpan menu." });
  }
});

router.put("/admin/jajan-yuk/menu-items/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const name = cleanText(req.body?.name, 120);
  const description = cleanText(req.body?.description, 1000);
  const price = Number(req.body?.price);
  const optionGroups =
    req.body?.option_groups === undefined ? undefined : normalizeOptionGroups(req.body.option_groups);
  if (!Number.isInteger(id) || !name || !Number.isInteger(price) || price < 1) {
    return res.status(400).json({ error: "Nama menu dan harga wajib diisi." });
  }
  if (optionGroups === null) {
    return res.status(400).json({ error: "Pilihan menu tidak valid. Periksa nama grup, pilihan, dan harga tambahannya." });
  }
  try {
    const result = await pool.query(
      `UPDATE jajan_yuk_menu_items
       SET name = $2, description = $3, price = $4,
            image = NULLIF($5, ''), active = $6,
            option_groups = COALESCE($7::jsonb, option_groups), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [
        id,
        name,
        description,
        price,
        cleanText(req.body?.image, 1000),
        req.body?.active === true,
        optionGroups === undefined ? null : JSON.stringify(optionGroups),
      ],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Menu tidak ditemukan." });
    res.json(result.rows[0]);
  } catch (err: any) {
    logger.error({ err: err?.message, id }, "Failed to update Jajan YUK menu item");
    res.status(500).json({ error: "Gagal memperbarui menu." });
  }
});

router.delete("/admin/jajan-yuk/menu-items/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Menu tidak valid." });
  try {
    const result = await pool.query(`DELETE FROM jajan_yuk_menu_items WHERE id = $1 RETURNING id`, [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Menu tidak ditemukan." });
    res.json({ ok: true });
  } catch (err: any) {
    logger.error({ err: err?.message, id }, "Failed to delete Jajan YUK menu item");
    res.status(500).json({ error: "Gagal menghapus menu." });
  }
});

/* Admin order queue and delivery management. */
router.get("/admin/jajan-yuk/orders", requireAuth, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id, o.order_code, o.merchant_name_snapshot AS merchant_name,
        o.customer_name, o.customer_phone, o.delivery_area, o.delivery_address,
        o.delivery_latitude, o.delivery_longitude,
        o.customer_note, o.admin_note, o.subtotal, o.delivery_fee, o.delivery_discount,
        o.service_fee, o.voucher_code, o.voucher_discount, o.total_amount,
        o.delivery_eta, o.order_status, o.payment_status, o.payment_type,
        o.driver_name, o.driver_phone, o.driver_vehicle, o.driver_plate,
        o.created_at, o.updated_at, o.confirmed_at, o.paid_at, o.delivered_at,
        COALESCE((
          SELECT json_agg(json_build_object(
            'item_name', i.item_name, 'unit_price', i.unit_price,
            'quantity', i.quantity, 'line_total', i.line_total,
            'selected_options', i.selected_options
          ) ORDER BY i.id)
          FROM jajan_yuk_order_items i WHERE i.order_id = o.id
        ), '[]'::json) AS items
      FROM jajan_yuk_orders o
      ORDER BY
        CASE WHEN o.order_status = 'pending_confirmation' THEN 0 ELSE 1 END,
        o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Failed to load Jajan YUK orders for CMS");
    res.status(500).json({ error: "Gagal memuat pesanan." });
  }
});

router.patch("/admin/jajan-yuk/orders/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const status = cleanText(req.body?.order_status, 32);
  const deliveryEta = cleanText(req.body?.delivery_eta, 120);
  const driverName = cleanText(req.body?.driver_name, 120);
  const driverPhone = cleanText(req.body?.driver_phone, 32);
  const driverVehicle = cleanText(req.body?.driver_vehicle, 120);
  const driverPlate = cleanText(req.body?.driver_plate, 32);
  const adminNote = cleanText(req.body?.admin_note, 1000);

  if (
    !Number.isInteger(id) ||
    !ORDER_STATUSES.has(status)
  ) {
    return res.status(400).json({ error: "Status tidak valid." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const found = await client.query(
      `SELECT * FROM jajan_yuk_orders WHERE id = $1 FOR UPDATE`,
      [id],
    );
    const order = found.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pesanan tidak ditemukan." });
    }
    if (status === "rejected" && ["pending", "paid"].includes(order.payment_status)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Batalkan transaksi pembayaran terlebih dahulu sebelum menolak pesanan." });
    }
    if (
      ["preparing", "driver_assigned", "picked_up", "on_the_way", "delivered"].includes(status) &&
      order.payment_status !== "paid"
    ) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pesanan baru dapat diproses setelah pembayaran diterima." });
    }
    if (["driver_assigned", "picked_up", "on_the_way", "delivered"].includes(status) && !driverName) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Isi nama driver sebelum memperbarui status pengantaran." });
    }
    if (["picked_up", "on_the_way", "delivered"].includes(status) && !driverVehicle) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Isi kendaraan driver sebelum memperbarui status pengantaran." });
    }

    const updated = await client.query(
      `UPDATE jajan_yuk_orders
       SET order_status = $2,
           delivery_fee = COALESCE(delivery_fee, $3),
           total_amount = GREATEST(0, subtotal + COALESCE(delivery_fee, $3)
             + COALESCE(service_fee, 0) - COALESCE(delivery_discount, 0) - COALESCE(voucher_discount, 0)),
           delivery_eta = NULLIF($4, ''),
           driver_name = NULLIF($5, ''),
           driver_phone = NULLIF($6, ''),
           driver_vehicle = NULLIF($7, ''),
           driver_plate = NULLIF($8, ''),
           admin_note = NULLIF($9, ''),
           confirmed_at = CASE WHEN $2 = 'confirmed' AND confirmed_at IS NULL THEN NOW() ELSE confirmed_at END,
           delivered_at = CASE WHEN $2 = 'delivered' AND delivered_at IS NULL THEN NOW() ELSE delivered_at END,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, order_code, order_status, payment_status, delivery_fee,
                 delivery_discount, service_fee, voucher_code, voucher_discount, total_amount,
                 delivery_eta, driver_name, driver_phone,
                 driver_vehicle, driver_plate, admin_note, updated_at`,
       [id, status, JAJAN_YUK_DELIVERY_FEE, deliveryEta, driverName, driverPhone, driverVehicle, driverPlate, adminNote],
    );
    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message, id }, "Failed to update Jajan YUK order");
    res.status(500).json({ error: "Gagal memperbarui pesanan." });
  } finally {
    client.release();
  }
});

router.post("/admin/jajan-yuk/orders/:id/manual-payment", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const action = cleanText(req.body?.action, 20);
  if (!Number.isInteger(id) || !["verify", "reject"].includes(action)) {
    return res.status(400).json({ error: "Aksi pembayaran manual tidak valid." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const found = await client.query(
      `SELECT id, order_code, order_status, payment_status, payment_type
       FROM jajan_yuk_orders WHERE id = $1 FOR UPDATE`,
      [id],
    );
    const order = found.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pesanan tidak ditemukan." });
    }
    if (order.payment_type !== "manual_transfer" || order.payment_status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Pesanan ini tidak sedang menunggu verifikasi pembayaran manual." });
    }

    const updated = await client.query(
      `UPDATE jajan_yuk_orders
       SET payment_status = $2,
           paid_at = CASE WHEN $2 = 'paid' THEN COALESCE(paid_at, NOW()) ELSE NULL END,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, order_code, order_status, payment_status, payment_type, paid_at`,
      [id, action === "verify" ? "paid" : "failed"],
    );
    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    logger.error({ err: err?.message, id }, "Failed to verify manual Jajan YUK payment");
    res.status(500).json({ error: "Gagal memperbarui verifikasi pembayaran manual." });
  } finally {
    client.release();
  }
});

export default router;