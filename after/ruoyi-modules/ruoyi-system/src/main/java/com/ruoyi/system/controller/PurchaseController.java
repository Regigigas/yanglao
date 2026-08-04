package com.ruoyi.system.controller;

import com.ruoyi.common.core.web.controller.BaseController;
import com.ruoyi.common.core.web.domain.AjaxResult;
import com.ruoyi.common.core.web.page.TableDataInfo;
import com.ruoyi.common.log.annotation.Log;
import com.ruoyi.common.log.enums.BusinessType;
import com.ruoyi.common.security.annotation.RequiresPermissions;
import com.ruoyi.common.security.utils.SecurityUtils;
import com.ruoyi.system.domain.PurchaseOrder;
import com.ruoyi.system.service.IPurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 采购单控制器
 */
@RestController
@RequestMapping("/purchase/order")
public class PurchaseController extends BaseController {

    @Autowired
    private IPurchaseOrderService purchaseOrderService;

    /** 采购单列表 */
    @RequiresPermissions("purchase:order:list")
    @GetMapping("/list")
    public TableDataInfo list(PurchaseOrder order) {
        startPage();
        List<PurchaseOrder> list = purchaseOrderService.selectOrderList(order);
        return getDataTable(list);
    }

    /** 采购单详情 */
    @GetMapping("/{id}")
    public AjaxResult getInfo(@PathVariable String id) {
        return success(purchaseOrderService.selectOrderById(id));
    }

    /** 采购单明细 */
    @GetMapping("/{id}/items")
    public AjaxResult getItems(@PathVariable String id) {
        return success(purchaseOrderService.selectOrderItems(id));
    }

    /** 采购统计 */
    @GetMapping("/stats")
    public AjaxResult stats() {
        return success(purchaseOrderService.getStats());
    }

    /** 新建采购单 */
    @RequiresPermissions("purchase:order:add")
    @Log(title = "采购单", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody PurchaseOrder order) {
        order.setApplicant(SecurityUtils.getUsername());
        order.setCreateBy(SecurityUtils.getUsername());
        return toAjax(purchaseOrderService.insertOrder(order));
    }

    /** 更新采购单状态（审批/入库/取消） */
    @RequiresPermissions("purchase:order:edit")
    @Log(title = "采购单状态", businessType = BusinessType.UPDATE)
    @PutMapping("/{id}/status")
    public AjaxResult updateStatus(@PathVariable String id, @RequestBody PurchaseOrder body) {
        return toAjax(purchaseOrderService.updateOrderStatus(
                id, body.getStatus(), SecurityUtils.getUsername()));
    }

    /** 删除采购单 */
    @RequiresPermissions("purchase:order:remove")
    @Log(title = "采购单", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable String[] ids) {
        return toAjax(purchaseOrderService.deleteOrderByIds(ids));
    }
}
