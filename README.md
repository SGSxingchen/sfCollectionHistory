# SFACG Data Analysis Project

本项目用于爬取并分析 [菠萝包轻小说](https://book.sfacg.com/) 网站数据，为作者提供实时的数据上涨情况以及与同行作品的对比分析。

## 生产环境地址

[SF数据网](http://sfacg.cloud/ranks)

## 目录结构

- `clinet/` — Next.js SSG 客户端（TailwindCSS + Ant Design）
- `server/` — Rust Actix-Web 后端（SQLx + MySQL + Cron 定时任务）
- `script/` — Node.js 爬虫脚本
- `mysql/init/` — 数据库初始化 SQL

## 部署教程

### 前置要求

- 本地安装 [Docker](https://docs.docker.com/get-docker/) 和 Docker Compose
- 拥有 [Docker Hub](https://hub.docker.com/) 账号（用于推送镜像）

### 1. 本地构建镜像

```bash
git clone <仓库地址>
cd sfCollectionHistory

# 如需修改前端 API 地址（默认 http://127.0.0.1:8080）
# 编辑 docker-compose.yml 中 client.build.args.NEXT_PUBLIC_API_URL

# 构建
docker compose build
```

### 2. 推送镜像到 Docker Hub

```bash
docker login
docker compose push
```

镜像地址：
- `lanstard/sf-server:latest`
- `lanstard/sf-client:latest`

### 3. 服务器部署

服务器上只需两个文件：

```
├── docker-compose.yml
└── mysql/
    └── init/
        └── init.sql
```

执行：

```bash
docker compose pull
docker compose up -d
```

### 4. 验证

```bash
# 检查服务状态
docker compose ps

# 测试后端接口
curl http://localhost:8080/api/books/all/bid

# 访问前端页面
# 浏览器打开 http://localhost:3000
```

### 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| MySQL | 3306 | 数据库，数据持久化到 `mysql_data` 卷 |
| Server | 8080 | Rust 后端 API |
| Client | 3000 | Nginx 托管的静态前端 |

### 环境变量

在 `docker-compose.yml` 中可配置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MYSQL_ROOT_PASSWORD` | root | MySQL root 密码 |
| `MYSQL_USER` | sf_root | 应用数据库用户名 |
| `MYSQL_PASSWORD` | lijiaxinga1. | 应用数据库密码 |
| `DATABASE_URL` | mysql://sf_root:...@mysql:3306/sf_selectrion | 后端数据库连接串 |
| `NEXT_PUBLIC_API_URL` | http://127.0.0.1:8080 | 前端 API 地址（构建时设置） |

### MySQL 数据持久化

MySQL 数据存储在 Docker 命名卷 `mysql_data` 中（非项目目录内），查看实际存储路径：

```bash
docker volume inspect sfcollectionhistory_mysql_data
```

返回的 `Mountpoint` 即为宿主机上的数据目录，通常为：

```
/var/lib/docker/volumes/sfcollectionhistory_mysql_data/_data
```

> **注意：** `docker compose down` 不会删除数据，但 `docker compose down -v` 会**永久删除**数据卷。

如需备份数据库：

```bash
docker exec sf-mysql mysqldump -usf_root -plijiaxinga1. sf_selectrion > backup.sql --no-tablespaces
```

如需恢复：

```bash
docker exec -i sf-mysql mysql -usf_root -plijiaxinga1. sf_selectrion < backup.sql
```

### 常用命令

```bash
# 查看日志
docker compose logs -f

# 重启服务
docker compose restart

# 停止并清理
docker compose down

# 停止并清理（含数据库数据）
docker compose down -v
```
