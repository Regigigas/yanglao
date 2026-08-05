package com.ruoyi.system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.web.domain.AjaxResult;

@RestController
@RequestMapping("/app-update")
public class AppUpdateController
{
    @GetMapping("/latest")
    public AjaxResult latest(@RequestParam(required = false) String platform,
            @RequestParam(required = false, defaultValue = "0") Integer versionCode,
            @RequestParam(required = false, defaultValue = "0") String wgtVersion)
    {
        String normalizedPlatform = value(platform).toLowerCase(Locale.ROOT);
        String prefix = "ios".equals(normalizedPlatform) ? "APP_UPDATE_IOS_"
                : "android".equals(normalizedPlatform) ? "APP_UPDATE_ANDROID_" : "APP_UPDATE_";
        String versionName = environment(prefix, "VERSION_NAME");
        int latestVersionCode = positiveInteger(environment(prefix, "VERSION_CODE"));
        String configuredType = environment(prefix, "TYPE").toLowerCase(Locale.ROOT);
        String type = "wgt".equals(configuredType) ? "wgt"
                : "store".equals(configuredType) ? "store" : "apk";
        String packageUrl = environment(prefix, "PACKAGE_URL");
        String storeUrl = environment(prefix, "STORE_URL");
        if (packageUrl.isEmpty() && "store".equals(type))
        {
            packageUrl = storeUrl;
        }
        String sha256 = environment(prefix, "SHA256").toLowerCase(Locale.ROOT);

        boolean packageHashValid = "store".equals(type) || sha256.matches("[a-f0-9]{64}");
        boolean versionCodeValid = "wgt".equals(type) || latestVersionCode > 0;
        boolean configured = !versionName.isEmpty() && versionCodeValid && !packageUrl.isEmpty()
                && packageHashValid;
        boolean available = "wgt".equals(type)
                ? compareVersions(versionName, value(wgtVersion)) > 0
                : latestVersionCode > Math.max(0, versionCode == null ? 0 : versionCode);
        if (!configured || !available)
        {
            return AjaxResult.success(Map.of("available", false, "message",
                    configured ? "当前已是最新版本" : "当前暂无可用更新"));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("available", true);
        data.put("type", type);
        data.put("versionName", versionName);
        data.put("versionCode", latestVersionCode);
        data.put("title", fallback(environment(prefix, "TITLE"), "养老护理终端 " + versionName));
        data.put("description", environment(prefix, "DESCRIPTION").replace("\\n", "\n"));
        data.put("downloadUrl", packageUrl);
        data.put("storeUrl", storeUrl);
        data.put("size", positiveInteger(environment(prefix, "SIZE")));
        data.put("sha256", sha256);
        data.put("mandatory", enabled(environment(prefix, "MANDATORY")));
        data.put("publishedAt", environment(prefix, "PUBLISHED_AT"));
        return AjaxResult.success(data);
    }

    private String environment(String prefix, String name)
    {
        String platformValue = value(System.getenv(prefix + name));
        return platformValue.isEmpty() && !"APP_UPDATE_".equals(prefix)
                ? value(System.getenv("APP_UPDATE_" + name)) : platformValue;
    }

    private String value(String value)
    {
        return value == null ? "" : value.trim();
    }

    private String fallback(String value, String fallback)
    {
        return value.isEmpty() ? fallback : value;
    }

    private int positiveInteger(String value)
    {
        try
        {
            return Math.max(0, Integer.parseInt(value));
        }
        catch (NumberFormatException exception)
        {
            return 0;
        }
    }

    private boolean enabled(String value)
    {
        return List.of("1", "true", "yes", "on").contains(value.toLowerCase(Locale.ROOT));
    }

    private int compareVersions(String left, String right)
    {
        String[] leftParts = left.split("[.-]");
        String[] rightParts = right.split("[.-]");
        int length = Math.max(leftParts.length, rightParts.length);
        for (int index = 0; index < length; index++)
        {
            String leftPart = index < leftParts.length ? leftParts[index] : "0";
            String rightPart = index < rightParts.length ? rightParts[index] : "0";
            int result;
            boolean leftNumeric = leftPart.matches("\\d+");
            boolean rightNumeric = rightPart.matches("\\d+");
            if (leftNumeric && rightNumeric)
            {
                result = Integer.compare(Integer.parseInt(leftPart), Integer.parseInt(rightPart));
            }
            else if (leftNumeric != rightNumeric)
            {
                result = leftNumeric ? 1 : -1;
            }
            else
            {
                result = leftPart.compareToIgnoreCase(rightPart);
            }
            if (result != 0)
            {
                return result;
            }
        }
        return 0;
    }
}
