package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.Supplier;
import java.util.List;

/**
 * 供应商 Mapper
 */
public interface SupplierMapper {
    List<Supplier> selectSupplierList(Supplier supplier);
    Supplier selectSupplierById(String id);
    int insertSupplier(Supplier supplier);
    int updateSupplier(Supplier supplier);
    int deleteSupplierById(String id);
    int deleteSupplierByIds(String[] ids);
}
