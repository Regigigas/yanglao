package com.ruoyi.system.domain;

import com.ruoyi.common.core.annotation.Excel;
import java.math.BigDecimal;

/**
 * 采购单明细 purchase_order_item
 */
public class PurchaseOrderItem {
    private static final long serialVersionUID = 1L;

    private String id;
    private String orderId;

    @Excel(name = "物品名称")
    private String itemName;

    @Excel(name = "类别")
    private String category;

    private String specification;

    @Excel(name = "单位")
    private String unit;

    @Excel(name = "数量")
    private BigDecimal quantity;

    @Excel(name = "单价")
    private BigDecimal unitPrice;

    @Excel(name = "金额")
    private BigDecimal amount;

    private BigDecimal receivedQty;
    private String remark;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSpecification() { return specification; }
    public void setSpecification(String specification) { this.specification = specification; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getReceivedQty() { return receivedQty; }
    public void setReceivedQty(BigDecimal receivedQty) { this.receivedQty = receivedQty; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
