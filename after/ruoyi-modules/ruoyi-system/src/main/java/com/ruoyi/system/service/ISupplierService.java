package com.ruoyi.system.service;

import com.ruoyi.system.domain.Supplier;
import java.util.List;

public interface ISupplierService {
    List<Supplier> selectSupplierList(Supplier supplier);
    Supplier selectSupplierById(String id);
    int insertSupplier(Supplier supplier);
    int updateSupplier(Supplier supplier);
    int deleteSupplierByIds(String[] ids);
}
