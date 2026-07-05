import sqlite3
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from user_agents import parse
import requests

# 敏感词机制（若包含这些词，自动变更为拒绝状态 -1）
BAD_WORDS = ["政治", "违规词", "刷屏"]

# 接收前端评论数据的结构
class CommentCreate(BaseModel):
    media_id: str
    content: str

DB_FILE = "comments.db"

# 初始化数据库结构
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # 创建 comments 表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            media_id TEXT NOT NULL,  -- 【新增字段】你的相册图片或视频的唯一标识（比如 "pic_01"），用来区分这是给谁的评论
            content TEXT NOT NULL,
            ip_address TEXT,
            location TEXT,
            device_info TEXT,
            status INTEGER DEFAULT 0, -- 0: 待审, 1: 通过, -1: 拒绝
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# FastAPI 生命周期管理 (在项目启动时自动建表)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 正在初始化 SQLite 数据库...")
    init_db()
    print("✅ 数据库 comments.db 表结构建立完成！")
    yield
    print("🛑 后端服务已关闭。")

# 创建 FastAPI 实例
app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "欢迎使用独立的评论后端系统"}

# ==================== 第三阶段核心接口 ====================

@app.post("/api/comments")
def submit_comment(comment_data: CommentCreate, request: Request):
    # 1. 提取真实 IP (处理 Nginx 代理的情况)
    ip_address = request.headers.get("X-Forwarded-For", request.client.host)
    if not ip_address or ip_address == "127.0.0.1":
        ip_address = "[本地调试IP]" # 方便你在本地看效果
    
    # 2. 调用 ip-api 获取省市地理位置
    location = "未知地域"
    try:
        # 如果是本地或局域网IP，直接跳过请求
        if ip_address != "[本地调试IP]":
            geo_resp = requests.get(f"http://ip-api.com/json/{ip_address}?lang=zh-CN", timeout=3).json()
            if geo_resp.get("status") == "success":
                location = f"{geo_resp.get('regionName', '')} {geo_resp.get('city', '')}".strip()
    except Exception as e:
        print(f"IP 解析失败: {e}")

    # 3. 解析浏览器 Header 中的 User-Agent 生成设备信息
    user_agent_str = request.headers.get("User-Agent", "")
    user_agent = parse(user_agent_str)
    # 取出类似: "Windows / Chrome"
    device_info = f"{user_agent.os.family} / {user_agent.browser.family}"

    # 4. 判断敏感词
    status = 0 # 默认待审核状态
    for bad_word in BAD_WORDS:
        if bad_word in comment_data.content:
            status = -1 # 触发敏感词，直接干掉
            break
            
    # 5. 存入数据库
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO comments (media_id, content, ip_address, location, device_info, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (comment_data.media_id, comment_data.content, ip_address, location, device_info, status))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()

    return {
        "success": True, 
        "message": "评论提交成功，正在等待管理员审核无违规后公开。" if status == 0 else "评论提交成功，涉嫌违规转入人工队列。",
        "data": {"id": inserted_id, "status": status}
    }

@app.get("/api/comments")
def get_comments(media_id: str):
    """
    前端获取某一张图片/视频的有效评论
    必须传入 media_id，且只会返回 status = 1 (审核通过) 的数据
    """
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # 加上 ORDER BY id DESC 实现倒序排列（最新的在越上面）
    cursor.execute('''
        SELECT id, content, location, device_info, created_at 
        FROM comments 
        WHERE media_id = ? AND status = 1
        ORDER BY id DESC
    ''', (media_id,))
    
    rows = cursor.fetchall()
    conn.close()

    # 组装返回给前端的 JSON 数据
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "content": row[1],
            "location": row[2],
            "device_info": row[3],
            "created_at": row[4]
        })
        
    return {"success": True, "data": results}
