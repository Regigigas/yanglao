package com.ruoyi.system.controller;

import com.ruoyi.common.core.web.controller.BaseController;
import com.ruoyi.common.core.web.domain.AjaxResult;
import com.ruoyi.common.core.web.page.TableDataInfo;
import com.ruoyi.common.log.annotation.Log;
import com.ruoyi.common.log.enums.BusinessType;
import com.ruoyi.common.security.annotation.RequiresPermissions;
import com.ruoyi.common.security.utils.SecurityUtils;
import com.ruoyi.system.domain.Supplier;
import com.ruoyi.system.service.ISupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 供应商控制器
 */
@RestController
@RequestMapping("/purchase/supplier")
public class SupplierController extends BaseController {

    @Autowired
    private ISupplierService supplierService;

    /** 供应商列表 */
    @RequiresPermissions("purchase:supplier:list")
    @GetMapping("/list")
    public TableDataInfo list(Supplier supplier) {
        startPage();
        List<Supplier> list = supplierService.selectSupplierList(supplier);
        return getDataTable(list);
    }

    /** 供应商详情 */
    @GetMapping("/{id}")
    public AjaxResult getInfo(@PathVariable String id) {
        return success(supplierService.selectSupplierById(id));
    }

    /** 新增供应商 */
    @RequiresPermissions("purchase:supplier:add")
    @Log(title = "供应商", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody Supplier supplier) {
        supplier.setCreateBy(SecurityUtils.getUsername());
        return toAjax(supplierService.insertSupplier(supplier));
    }

    /** 修改供应商 */
    @RequiresPermissions("purchase:supplier:edit")
    @Log(title = "供应商", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody Supplier supplier) {
        supplier.setUpdateBy(SecurityUtils.getUsername());
        return toAjax(supplierService.updateSupplier(supplier));
    }

    /** 删除供应商 */
    @RequiresPermissions("purchase:supplier:remove")
    @Log(title = "供应商", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable String[] ids) {
        return toAjax(supplierService.deleteSupplierByIds(ids));
    }
}
