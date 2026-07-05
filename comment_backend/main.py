import sqlite3
import os
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uuid
from contextlib import asynccontextmanager

DB_FILE = "comments.db"
UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def init_db():
    """初始化数据库并创建表"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 核心升级：增加 photo_id 以绑定具体某张图片或视频
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo_id TEXT NOT NULL,
            content TEXT NOT NULL,
            ip_address TEXT,
            location TEXT,
            device_info TEXT,
            status INTEGER DEFAULT 0,  -- 0:待审, 1:通过, -1:拒绝
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 增加足迹表 (打卡地图使用)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS footprints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            title TEXT,
            description TEXT,
            visitor_id TEXT, -- [新增] 访客唯一标识
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # 动态为足迹表增加访客字段 (处理已存在表的情况)
    try:
        cursor.execute("ALTER TABLE footprints ADD COLUMN visitor_id TEXT")
    except sqlite3.OperationalError:
        pass
    # 动态为老表增加媒体字段
    try:
        cursor.execute("ALTER TABLE comments ADD COLUMN media_url TEXT")
        cursor.execute("ALTER TABLE comments ADD COLUMN media_type TEXT")
    except sqlite3.OperationalError:
        pass # 列已存在

    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 服务启动时执行建表逻辑
    init_db()
    yield

app = FastAPI(title="独立图库评论系统", lifespan=lifespan)

# 挂载 uploads 目录，使前端可以通过 URL 访问静态文件
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# 配置 CORS 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "独立图库评论后端已启动 (带先审后发机制)"}

# =========== 阶段 3: 核心评论业务接口 ===========
from pydantic import BaseModel
from fastapi import Request
import requests
from user_agents import parse

BAD_WORDS = ["政治", "违规词", "刷屏", "发票", "广告"]

class CommentCreate(BaseModel):
    photo_id: str
    content: str
    media_url: str | None = None
    media_type: str | None = None

def get_location_by_ip(ip: str):
    """调用外部接口解析IP地理位置与运营商"""
    if ip == "127.0.0.1" or ip.startswith("192.168."):
        return "本地测试网络"
    try:
        # 即使无法获取高阶运营商信息，依然保证定位
        res = requests.get(f"http://ip-api.com/json/{ip}?lang=zh-CN", timeout=3)
        data = res.json()
        if data.get("status") == "success":
            region = data.get('regionName', '')
            city = data.get('city', '')
            isp = data.get('isp', '')
            
            # 如果城市和省份一样，去重（例如北京市 北京市）
            loc_str = city if region == city else f"{region} {city}".strip()
            
            # 如果有运营商，就拼接到后面
            if isp:
                return f"{loc_str} ({isp})"
            return loc_str
            
        return "未知地域"
    except:
        return "未知地域"

def check_content(content: str) -> int:
    """简单的敏感词检测: 0为待审, -1为拒绝"""
    for bw in BAD_WORDS:
        if bw in content:
            return -1
    return 0

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """接收前端上传的文件，保存到 uploads 并返回可访问的 URL"""
    ext = file.filename.split('.')[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # 简单限制体积，前端已经卡了20MB，这里做二次保存
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    return {"status": "success", "url": f"http://localhost:8080/uploads/{filename}"}

@app.post("/api/comments")
def create_comment(comment: CommentCreate, request: Request):
    """提交评论，带设备、IP解析与先审后发"""
    # 1. 提取真实IP (处理代理头)
    ip_address = request.headers.get("X-Forwarded-For")
    if not ip_address:
        ip_address = request.client.host
    
    # 2. 解析地理位置
    location = get_location_by_ip(ip_address)
    
    # 3. 解析设备指纹
    user_agent_str = request.headers.get("User-Agent", "")
    ua = parse(user_agent_str)
    device_info = f"{ua.os.family} / {ua.browser.family}"
    
    # 4. 判断敏感词状态
    status = check_content(comment.content)
    
    # 5. 写入数据库
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO comments (photo_id, content, ip_address, location, device_info, status, media_url, media_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (comment.photo_id, comment.content, ip_address, location, device_info, status, comment.media_url, comment.media_type))
    conn.commit()
    comment_id = cursor.lastrowid
    conn.close()
    
    # 统一回复，不让用户察觉被系统标记（最高控制权策略）
    msg = "评论已提交，等待博主审核后展示"
    return {"status": "success", "message": msg, "id": comment_id, "review_status": status}

@app.get("/api/comments/{photo_id}")
def get_comments(photo_id: str):
    """获拿某个图片/视频下所有已经审核通过(status=1)的评论"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, content, location, device_info, created_at, media_url, media_type
        FROM comments 
        WHERE photo_id = ? AND status = 1
        ORDER BY created_at DESC
    ''', (photo_id,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "content": r[1],
            "location": r[2],
            "device_info": r[3],
            "created_at": r[4],
            "media_url": r[5],
            "media_type": r[6]
        })
    return {"status": "success", "data": results}

# =========== 阶段 4: 管理后台审核接口 ===========
class StatusUpdate(BaseModel):
    status: int

@app.get("/api/admin/comments")
def get_pending_comments():
    """获取所有待审核 (status=0) 的评论"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, photo_id, content, ip_address, location, device_info, created_at, status, media_url, media_type
        FROM comments 
        WHERE status <= 0
        ORDER BY created_at ASC
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "photo_id": r[1],
            "content": r[2],
            "ip_address": r[3],
            "location": r[4],
            "device_info": r[5],
            "created_at": r[6],
            "status": r[7], # 返回给后台，如果是 -1 你就知道这是系统帮你标记的敏感词
            "media_url": r[8],
            "media_type": r[9]
        })
    return {"status": "success", "data": results}

@app.put("/api/admin/comments/{comment_id}")
def update_comment_status(comment_id: int, update_data: StatusUpdate):
    """审核更新评论状态: 1为通过，-1为拒绝"""
    if update_data.status not in [1, -1]:
        return {"status": "error", "message": "无效的状态值"}
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE comments SET status = ? WHERE id = ?
    ''', (update_data.status, comment_id))
    conn.commit()
    conn.close()
    
    return {"status": "success", "message": f"评论 {comment_id} 状态已更新为 {update_data.status}"}

# =========== 阶段 5: 星空打卡地图接口 ===========

class CheckinCreate(BaseModel):
    lat: float
    lng: float
    title: str | None = "星空足迹"
    description: str | None = "前端打卡点亮"
    visitor_id: str | None = None # [新增] 访客 ID
    timestamp: str | None = None

@app.post("/api/checkin")
def create_checkin(checkin: CheckinCreate):
    """前端点亮星星，存入经纬度"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO footprints (lat, lng, title, description, visitor_id)
        VALUES (?, ?, ?, ?, ?)
    ''', (checkin.lat, checkin.lng, checkin.title, checkin.description, checkin.visitor_id))
    conn.commit()
    inserted_id = cursor.lastrowid # 获取自增 ID
    conn.close()
    return {"status": "success", "message": "打卡点亮成功", "id": inserted_id}

@app.get("/api/footprints")
def get_footprints():
    """获取所有已打卡的星星经纬度"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT id, lat, lng, title, description, visitor_id FROM footprints')
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "lat": r[1],
            "lng": r[2],
            "title": r[3],
            "description": r[4],
            "visitor_id": r[5]
        })
    return results

@app.delete("/api/footprints/{footprint_id}")
def delete_checkin(footprint_id: int, visitor_id: str):
    """撤销点亮，需要校验 visitor_id"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # 查找此 ID 的星星是否属于此 visitor
    cursor.execute('SELECT visitor_id FROM footprints WHERE id = ?', (footprint_id,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return {"status": "error", "message": "未找到对应的打卡记录"}
        
    if row[0] != visitor_id:
        conn.close()
        return {"status": "error", "message": "您无权撤销他人的打卡记录"}
        
    cursor.execute('DELETE FROM footprints WHERE id = ?', (footprint_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "撤销点亮成功"}
