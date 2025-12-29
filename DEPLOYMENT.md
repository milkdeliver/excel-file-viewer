# SAP Cloud Foundry 部署指南

本文档说明如何将 Excel File Viewer 应用部署到 SAP Cloud Foundry 平台。

## 前置要求

1. 安装 Cloud Foundry CLI
   ```bash
   # macOS
   brew install cloudfoundry/tap/cf-cli
   
   # 或从官方下载
   # https://github.com/cloudfoundry/cli/releases
   ```

2. 安装 Node.js 18+ 和 npm 9+
   ```bash
   node --version  # 应该 >= 18.0.0
   npm --version   # 应该 >= 9.0.0
   ```

## 重要说明

本应用已配置为在 Cloud Foundry 上正确构建和运行：
- TypeScript 和类型定义已移至 dependencies（Cloud Foundry 生产构建需要）
- 构建命令会在启动前自动执行
- 无需在本地预构建

## 部署步骤

### 1. 登录到 SAP Cloud Foundry

```bash
# 登录到 Cloud Foundry
cf login -a <API_ENDPOINT>

# 示例:
# cf login -a https://api.cf.us10.hana.ondemand.com

# 输入邮箱和密码
# 选择组织 (org) 和空间 (space)
```

### 2. 部署到 Cloud Foundry

```bash
# 使用 manifest.yml 部署（会自动安装依赖和构建）
cf push

# 或使用自定义名称
cf push excel-viewer
```

**注意**: 应用会在 Cloud Foundry 上自动执行以下步骤：
1. 安装 npm 依赖
2. 构建 Next.js 应用 (`npm run build`)
3. 启动生产服务器 (`npm start`)

### 4. 查看部署状态

```bash
# 查看应用状态
cf apps

# 查看应用详情
cf app excel-file-viewer

# 查看日志
cf logs excel-file-viewer --recent
```

## 配置说明

### manifest.yml 配置

```yaml
applications:
- name: excel-file-viewer           # 应用名称
  memory: 1G                         # 内存限制（Next.js 构建需要至少 1G）
  disk_quota: 1024M                  # 磁盘限制
  instances: 1                       # 实例数量
  buildpacks:
    - nodejs_buildpack               # 使用 Node.js buildpack
  command: npm run build && npm start  # 构建并启动命令
  env:
    NODE_ENV: production             # 环境变量
```

**⚠️ 重要提示**: Next.js 构建过程需要较多内存，建议至少使用 1G 内存，否则会出现 "Exit status 137 (out of memory)" 错误。

**命令说明:**
- `npm run build`: 构建 Next.js 生产版本
- `npm start`: 启动生产服务器（使用 Cloud Foundry 的 $PORT）

### 环境变量配置

如需添加环境变量，可以通过以下方式:

1. 在 manifest.yml 中添加:
```yaml
env:
  NODE_ENV: production
  CUSTOM_VAR: value
```

2. 或使用 CF CLI:
```bash
cf set-env excel-file-viewer CUSTOM_VAR value
cf restage excel-file-viewer
```

## 扩展和管理

### 扩展实例数量

```bash
# 增加实例到 3 个
cf scale excel-file-viewer -i 3
```

### 调整内存和磁盘

```bash
# 调整内存到 1GB
cf scale excel-file-viewer -m 1G

# 调整磁盘到 2GB
cf scale excel-file-viewer -k 2G
```

### 重启应用

```bash
# 重启应用
cf restart excel-file-viewer

# 重新部署（会重新下载依赖）
cf restage excel-file-viewer
```

### 查看日志

```bash
# 查看最近日志
cf logs excel-file-viewer --recent

# 实时查看日志
cf logs excel-file-viewer
```

### 删除应用

```bash
cf delete excel-file-viewer
```

## 自定义域名

如需使用自定义域名:

```bash
# 映射自定义域名
cf map-route excel-file-viewer <domain> --hostname <hostname>

# 示例:
# cf map-route excel-file-viewer mydomain.com --hostname excel-viewer
```

## 多环境部署

可以为不同环境创建不同的 manifest 文件:

- `manifest-dev.yml` - 开发环境
- `manifest-qa.yml` - 测试环境
- `manifest-prod.yml` - 生产环境

部署时指定文件:
```bash
cf push -f manifest-prod.yml
```

## 故障排查

### 应用无法启动

1. 查看日志:
```bash
cf logs excel-file-viewer --recent
```

2. 检查构建过程:
```bash
cf logs excel-file-viewer --recent | grep -i error
```

3. 验证 Node.js 版本:
```bash
cf ssh excel-file-viewer
node --version
```

### 内存不足

如果遇到内存不足错误:
```bash
cf scale excel-file-viewer -m 1G
cf restart excel-file-viewer
```

### 构建失败

1. 检查 Node.js 版本是否符合要求（>= 18.0.0）
2. 确保本地可以成功构建:
```bash
npm install
npm run build
npm start
```

3. 检查 manifest.yml 中的 command 是否正确:
```yaml
command: npm run build && npm start
```

4. 如果内存不足导致构建失败，增加内存:
```yaml
memory: 1G  # 在 manifest.yml 中修改
```

5. 查看构建日志:
```bash
cf logs excel-file-viewer --recent | grep -i build
```

## 性能优化建议

1. **启用 Gzip 压缩**: Next.js 默认已启用

2. **调整实例数量**: 根据流量调整
   ```bash
   cf scale excel-file-viewer -i 2
   ```

3. **增加内存**: 如果应用较大
   ```bash
   cf scale excel-file-viewer -m 1G
   ```

4. **使用 CDN**: 对于静态资源使用 CDN

## 安全建议

1. 定期更新依赖包
   ```bash
   npm audit
   npm audit fix
   ```

2. 设置环境变量而不是硬编码敏感信息

3. 使用 HTTPS（Cloud Foundry 默认提供）

## 监控和日志

建议配置:
- Application Logging Service
- Application Autoscaler
- SAP Cloud ALM (Application Lifecycle Management)

## 支持

如遇到问题:
1. 查看 CF 文档: https://docs.cloudfoundry.org/
2. 查看 SAP BTP 文档: https://help.sap.com/docs/btp
3. 检查应用日志: `cf logs excel-file-viewer --recent`

## 快速命令参考

```bash
# 部署
npm run cf:push

# 查看状态
cf apps

# 查看日志
cf logs excel-file-viewer --recent

# 重启
cf restart excel-file-viewer

# 扩展
cf scale excel-file-viewer -i 2 -m 1G

# 删除
cf delete excel-file-viewer
