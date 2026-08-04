package com.ruoyi.system.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.web.domain.AjaxResult;
import com.ruoyi.common.security.annotation.RequiresPermissions;
import com.ruoyi.common.security.utils.SecurityUtils;
import com.ruoyi.system.domain.sync.SyncDownloadRequest;
import com.ruoyi.system.domain.sync.SyncUploadRequest;
import com.ruoyi.system.service.sync.SyncChangeService;

@RestController
@RequestMapping("/sync")
public class SyncController
{
    private final SyncChangeService syncChangeService;

    public SyncController(SyncChangeService syncChangeService)
    {
        this.syncChangeService = syncChangeService;
    }

    @PostMapping("/upload")
    @RequiresPermissions("system:sync:upload")
    public AjaxResult upload(@RequestBody SyncUploadRequest request)
    {
        try
        {
            return AjaxResult.success(syncChangeService.upload(request, SecurityUtils.getUserId()));
        }
        catch (IllegalArgumentException exception)
        {
            return AjaxResult.error(exception.getMessage());
        }
    }

    @PostMapping("/download")
    @RequiresPermissions("system:sync:download")
    public AjaxResult download(@RequestBody SyncDownloadRequest request)
    {
        try
        {
            return AjaxResult.success(syncChangeService.download(request, SecurityUtils.getUserId()));
        }
        catch (IllegalArgumentException exception)
        {
            return AjaxResult.error(exception.getMessage());
        }
    }
}
