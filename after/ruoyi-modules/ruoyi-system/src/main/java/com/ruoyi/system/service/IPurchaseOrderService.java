package com.ruoyi.system.service;

import com.ruoyi.system.domain.PurchaseOrder;
import com.ruoyi.system.domain.PurchaseOrderItem;
import java.util.List;
import java.util.Map;

public interface IPurchaseOrderService {
    List<PurchaseOrder> selectOrderList(PurchaseOrder order);
    PurchaseOrder selectOrderById(String id);
    List<PurchaseOrderItem> selectOrderItems(String orderId);
    int insertOrder(PurchaseOrder order);
    int updateOrderStatus(String id, String status, String operatorName);
    int deleteOrderByIds(String[] ids);
    Map<String, Object> getStats();
}
