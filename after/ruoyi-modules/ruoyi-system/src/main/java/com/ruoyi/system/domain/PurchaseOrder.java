package com.ruoyi.system.domain;

import com.ruoyi.common.core.annotation.Excel;
import com.ruoyi.common.core.web.domain.BaseEntity;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 采购单 purchase_order
 */
public class PurchaseOrder extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private String id;

    @Excel(name = "采购单号")
    private String orderNo;

    private String supplierId;

    @Excel(name = "供应商")
    private String supplierName;

    @Excel(name = "采购日期")
    private String orderDate;

    private String expectDate;

    @Excel(name = "总金额")
    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    /** draft/pending/approved/received/cancelled */
    @Excel(name = "状态")
    private String status;

    @Excel(name = "申请人")
    private String applicant;

    private String approver;
    private Date approvedAt;
    private Date receivedAt;
    private String delFlag;

    /** 关联明细（非数据库字段，接口传输用） */
    private List<PurchaseOrderItem> items;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
    public String getExpectDate() { return expectDate; }
    public void setExpectDate(String expectDate) { this.expectDate = expectDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getApplicant() { return applicant; }
    public void setApplicant(String applicant) { this.applicant = applicant; }
    public String getApprover() { return approver; }
    public void setApprover(String approver) { this.approver = approver; }
    public Date getApprovedAt() { return approvedAt; }
    public void setApprovedAt(Date approvedAt) { this.approvedAt = approvedAt; }
    public Date getReceivedAt() { return receivedAt; }
    public void setReceivedAt(Date receivedAt) { this.receivedAt = receivedAt; }
    public String getDelFlag() { return delFlag; }
    public void setDelFlag(String delFlag) { this.delFlag = delFlag; }
    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) { this.items = items; }
}
