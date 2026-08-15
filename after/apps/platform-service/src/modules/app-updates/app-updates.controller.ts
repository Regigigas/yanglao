import { Controller, Get, Query } from '@nestjs/common';
import { success, type DataRecord, type PageQuery } from '@app/common';
import { compareVersions } from '../../shared/http.helpers';

@Controller('app-update')
export class AppUpdatesController {
  @Get('latest')
  appUpdate(@Query() query: PageQuery): DataRecord {
    const platform = String(query.platform ?? '').toLowerCase();
    const prefix = platform === 'ios' ? 'APP_UPDATE_IOS_' : platform === 'android' ? 'APP_UPDATE_ANDROID_' : 'APP_UPDATE_';
    const env = (name: string): string => String(process.env[`${prefix}${name}`] ?? process.env[`APP_UPDATE_${name}`] ?? '').trim();
    const type = ['wgt', 'store'].includes(env('TYPE')) ? env('TYPE') : 'apk';
    const versionName = env('VERSION_NAME');
    const versionCode = Math.max(0, Number(env('VERSION_CODE')) || 0);
    const downloadUrl = env('PACKAGE_URL') || (type === 'store' ? env('STORE_URL') : '');
    const sha256 = env('SHA256').toLowerCase();
    const configured = Boolean(versionName && downloadUrl && (type === 'store' || /^[a-f0-9]{64}$/.test(sha256)) && (type === 'wgt' || versionCode > 0));
    const available = type === 'wgt' ? compareVersions(versionName, String(query.wgtVersion ?? '0')) > 0 : versionCode > Math.max(0, Number(query.versionCode ?? 0));
    if (!configured || !available) return success({ available: false, message: configured ? '当前已经是最新版本' : '当前暂无可用更新' });
    return success({ available: true, type, versionName, versionCode, title: env('TITLE') || `养老护理终端 ${versionName}`, description: env('DESCRIPTION').replaceAll('\\n', '\n'), downloadUrl, storeUrl: env('STORE_URL'), size: Number(env('SIZE')) || 0, sha256, mandatory: ['1', 'true', 'yes', 'on'].includes(env('MANDATORY').toLowerCase()), publishedAt: env('PUBLISHED_AT') });
  }
}
