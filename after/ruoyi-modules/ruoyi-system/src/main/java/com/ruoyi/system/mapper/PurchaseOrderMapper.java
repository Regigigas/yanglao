package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.PurchaseOrder;
import com.ruoyi.system.domain.PurchaseOrderItem;
import java.util.List;
import java.util.Map;

/**
 * 采购单 Mapper
 */
public interface PurchaseOrderMapper {
    List<PurchaseOrder> selectOrderList(PurchaseOrder order);
    PurchaseOrder selectOrderById(String id);
    int insertOrder(PurchaseOrder order);
    int updateOrder(PurchaseOrder order);
    int deleteOrderById(String id);
    int deleteOrderByIds(String[] ids);

    // ── 明细 ──
    List<PurchaseOrderItem> selectItemsByOrderId(String orderId);
    int insertItem(PurchaseOrderItem item);
    int deleteItemsByOrderId(String orderId);

    // ── 统计 ──
    Map<String, Object> selectStats();
}
