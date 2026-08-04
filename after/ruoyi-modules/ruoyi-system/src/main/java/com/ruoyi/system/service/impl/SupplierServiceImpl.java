package com.ruoyi.system.service.impl;

import com.ruoyi.common.core.utils.uuid.IdUtils;
import com.ruoyi.system.domain.Supplier;
import com.ruoyi.system.mapper.SupplierMapper;
import com.ruoyi.system.service.ISupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierServiceImpl implements ISupplierService {

    @Autowired
    private SupplierMapper supplierMapper;

    @Override
    public List<Supplier> selectSupplierList(Supplier supplier) {
        return supplierMapper.selectSupplierList(supplier);
    }

    @Override
    public Supplier selectSupplierById(String id) {
        return supplierMapper.selectSupplierById(id);
    }

    @Override
    public int insertSupplier(Supplier supplier) {
        supplier.setId(IdUtils.fastSimpleUUID());
        if (supplier.getStatus() == null) supplier.setStatus("active");
        return supplierMapper.insertSupplier(supplier);
    }

    @Override
    public int updateSupplier(Supplier supplier) {
        return supplierMapper.updateSupplier(supplier);
    }

    @Override
    public int deleteSupplierByIds(String[] ids) {
        return supplierMapper.deleteSupplierByIds(ids);
    }
}
