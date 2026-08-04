package com.ruoyi.system.service.impl;

import com.ruoyi.common.core.utils.uuid.IdUtils;
import com.ruoyi.system.domain.PurchaseOrder;
import com.ruoyi.system.domain.PurchaseOrderItem;
import com.ruoyi.system.mapper.PurchaseOrderMapper;
import com.ruoyi.system.service.IPurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseOrderServiceImpl implements IPurchaseOrderService {

    @Autowired
    private PurchaseOrderMapper orderMapper;

    @Override
    public List<PurchaseOrder> selectOrderList(PurchaseOrder order) {
        return orderMapper.selectOrderList(order);
    }

    @Override
    public PurchaseOrder selectOrderById(String id) {
        PurchaseOrder order = orderMapper.selectOrderById(id);
        if (order != null) {
            order.setItems(orderMapper.selectItemsByOrderId(id));
        }
        return order;
    }

    @Override
    public List<PurchaseOrderItem> selectOrderItems(String orderId) {
        return orderMapper.selectItemsByOrderId(orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int insertOrder(PurchaseOrder order) {
        order.setId(IdUtils.fastSimpleUUID());
        // 生成单号：PO + yyyyMMddHHmmss + 4位随机
        order.setOrderNo("PO" + System.currentTimeMillis());
        if (order.getStatus() == null) order.setStatus("draft");
        if (order.getTotalAmount() == null) order.setTotalAmount(BigDecimal.ZERO);
        if (order.getPaidAmount() == null) order.setPaidAmount(BigDecimal.ZERO);

        int result = orderMapper.insertOrder(order);

        // 插入明细
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            BigDecimal total = BigDecimal.ZERO;
            for (PurchaseOrderItem item : order.getItems()) {
                item.setId(IdUtils.fastSimpleUUID());
                item.setOrderId(order.getId());
                if (item.getReceivedQty() == null) item.setReceivedQty(BigDecimal.ZERO);
                // 计算金额
                if (item.getQuantity() != null && item.getUnitPrice() != null) {
                    item.setAmount(item.getQuantity().multiply(item.getUnitPrice()));
                } else {
                    item.setAmount(BigDecimal.ZERO);
                }
                total = total.add(item.getAmount());
                orderMapper.insertItem(item);
            }
            // 更新总金额
            order.setTotalAmount(total);
            orderMapper.updateOrder(order);
        }
        return result;
    }

    @Override
    public int updateOrderStatus(String id, String status, String operatorName) {
        PurchaseOrder order = new PurchaseOrder();
        order.setId(id);
        order.setStatus(status);
        if ("approved".equals(status)) {
            order.setApprover(operatorName);
            order.setApprovedAt(new Date());
        } else if ("received".equals(status)) {
            order.setReceivedAt(new Date());
        }
        return orderMapper.updateOrder(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deleteOrderByIds(String[] ids) {
        for (String id : ids) {
            orderMapper.deleteItemsByOrderId(id);
        }
        return orderMapper.deleteOrderByIds(ids);
    }

    @Override
    public Map<String, Object> getStats() {
        return orderMapper.selectStats();
    }
}
