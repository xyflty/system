#!/bin/bash
# 用于阿里Flow的自动化部署脚本

# 旧代码路径
oldPath="/www/wwwroot/zwcrm.iewaygroup.com/dist"
# 备份路径
backupPath="/www/wwwroot/zwcrm.iewaygroup.com/backup"
# 新版代码路径
releasePath="/www/wwwroot/zwcrm.iewaygroup.com/release"

# 是否测试环境
if [ -d "$oldPath" ]; then
    echo "正式环境"
else
    echo "测试环境"
    oldPath="/www/wwwroot/zwcrmtest.iewaygroup.com/dist"
    backupPath="/www/wwwroot/zwcrmtest.iewaygroup.com/backup"
    releasePath="/www/wwwroot/zwcrmtest.iewaygroup.com/release"
fi

# 备份旧版代码
mv -f ${oldPath}/ ${backupPath}/$(date +"%Y-%m-%d-%H-%M") 2>/dev/null || :
# 复制新版代码
mv -f ${releasePath}/dist/ ${oldPath}/
# 清空部署目录
rm -rf ${releasePath}/*