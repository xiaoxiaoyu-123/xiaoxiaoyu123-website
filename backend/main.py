"""
后端服务 — 为 xiaoxiaoyu123 个人网站提供 API
启动：uvicorn main:app --reload --port 8080
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os, uuid, json, pymysql, requests
from user_agents import parse as parse_ua

# ========== 应用初始化 ==========
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    """应用启动时自动建表"""
    init_db()
    yield

app = FastAPI(title="xiaoxiaoyu123 API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== MySQL 数据库配置（由你自己填写） ==========
DB_CONFIG = {
    "host": "172.18.0.3",
    "port": 3306,
    "user": "xiaoxiaoyu123",
    "password": "h8ezXeZyhPpiRKXY",
    "database": "xiaoxiaoyu123",
    "charset": "utf8mb4"
}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ========== 数据库连接工具 ==========

def get_db():
    """获取数据库连接（每次调用自动断开重连）"""
    try:
        conn = pymysql.connect(**DB_CONFIG)
        return conn
    except pymysql.Error as e:
        print(f"[数据库连接失败] {e}")
        raise


def init_db():
    """创建数据表（首次运行自动建表，重复运行不报错）"""
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            # 留言表
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) DEFAULT '',
                    email VARCHAR(200) DEFAULT '',
                    content TEXT NOT NULL,
                    is_anonymous TINYINT(1) DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            # 足迹表
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS footprints (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    lat DECIMAL(10,6) NOT NULL,
                    lng DECIMAL(10,6) NOT NULL,
                    visitor_id VARCHAR(100) DEFAULT 'anonymous',
                    nickname VARCHAR(100) DEFAULT '匿名探险家',
                    avatar VARCHAR(500) DEFAULT '',
                    location_name VARCHAR(200) DEFAULT '未知地点',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            # 评论表
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    photo_id VARCHAR(100) NOT NULL,
                    content TEXT NOT NULL,
                    nickname VARCHAR(100) DEFAULT '匿名用户',
                    avatar VARCHAR(500) DEFAULT '',
                    location VARCHAR(200) DEFAULT '未知坐标',
                    device_info VARCHAR(500) DEFAULT '',
                    media_url VARCHAR(500) DEFAULT '',
                    media_type VARCHAR(20) DEFAULT '',
                    status TINYINT DEFAULT 0 COMMENT '0=待审核 1=已发布 -1=已屏蔽',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            conn.commit()
            print("[数据库] 表结构初始化完成")
    except pymysql.Error as e:
        print(f"[数据库] 建表失败: {e}")
        raise
    finally:
        conn.close()


# ========== 数据模型 ==========

class MessageForm(BaseModel):
    name: str = ""
    email: str = ""
    content: str
    is_anonymous: bool = False


class ChatRequest(BaseModel):
    messages: List[dict]


class VisitorIdentity(BaseModel):
    nickname: str = "未同步"
    avatar: str = ""


class CheckinData(BaseModel):
    lat: float
    lng: float
    visitor_id: Optional[str] = "anonymous"
    nickname: Optional[str] = "匿名探险家"
    avatar: Optional[str] = ""
    location_name: Optional[str] = "未知地点"


class CommentCreate(BaseModel):
    photo_id: str
    content: str
    nickname: str = "匿名用户"
    avatar: str = ""
    location: str = "未知坐标"
    device_info: str = ""
    media_url: str = ""
    media_type: str = ""


class CommentReview(BaseModel):
    status: int  # 1=通过, -1=屏蔽


# 敏感词列表（命中自动设为屏蔽）
BAD_WORDS = ["政治", "违规词", "刷屏"]

# 首页文章数
ARTICLE_COUNT = 170


# ========== 公开接口 ==========

@app.get("/api/public_stats")
async def public_stats():
    """获取首页统计数据"""
    return {
        "status": "success",
        "data": {"article_count": ARTICLE_COUNT}
    }


@app.get("/api/track")
async def track_visitor():
    """访客追踪（返回 1x1 透明 GIF）"""
    return JSONResponse(
        content={},
        headers={"Content-Type": "image/gif"},
        status_code=200
    )


@app.post("/api/track_identity")
async def track_identity(data: VisitorIdentity):
    """记录访客身份"""
    # 访客信息写入日志，不存数据库
    print(f"[访客] {data.nickname}")
    return {"status": "success"}


# ========== 留言 ==========

@app.post("/api/message")
async def submit_message(form: MessageForm):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            sql = """INSERT INTO messages (name, email, content, is_anonymous)
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (form.name, form.email, form.content, 1 if form.is_anonymous else 0))
            conn.commit()
        return {"status": "success", "message": "留言已发送"}
    except pymysql.Error as e:
        print(f"[数据库错误] submit_message: {e}")
        raise HTTPException(status_code=500, detail="留言发送失败")
    finally:
        conn.close()


# ========== AI 聊天 ==========

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """AI 聊天助手（通过 DeepSeek API，使用 requests 直接调用）"""
    user_msg = req.messages[-1]["content"] if req.messages else ""

    try:
        headers = {
            "Authorization": "Bearer sk-faf9aaf3b7034b23af680ce372e272a3",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "system", "content": "你是xiaoxiaoyu个人网站的AI助手闲鱼，你的性格是活泼可爱俏皮的，偶尔还爱捉弄人，你会用中文回答问题。"}]
                      + [{"role": m["role"], "content": m["content"]} for m in req.messages]
        }
        resp = requests.post("https://api.deepseek.com/chat/completions", headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        reply = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[AI接口错误] {e}")
        reply = f"你好！我是xiaoxiaoyu的AI助手闲鱼。你说的是「{user_msg[:30]}」吗？"

    return {
        "status": "success",
        "reply": reply
    }


# ========== 足迹地图 ==========

@app.get("/api/footprints")
async def get_footprints():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, lat, lng, visitor_id, nickname, avatar, location_name, created_at FROM footprints ORDER BY created_at DESC")
            rows = cursor.fetchall()
            data = []
            for row in rows:
                data.append({
                    "id": str(row[0]),
                    "lat": float(row[1]),
                    "lng": float(row[2]),
                    "visitor_id": row[3],
                    "nickname": row[4],
                    "avatar": row[5],
                    "location_name": row[6],
                    "created_at": row[7].strftime("%Y-%m-%d %H:%M:%S") if row[7] else ""
                })
            return {"status": "success", "data": data}
    except pymysql.Error as e:
        print(f"[数据库错误] get_footprints: {e}")
        return {"status": "success", "data": []}
    finally:
        conn.close()


@app.post("/api/checkin")
async def checkin(data: CheckinData):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            sql = """INSERT INTO footprints (lat, lng, visitor_id, nickname, avatar, location_name)
                     VALUES (%s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (data.lat, data.lng, data.visitor_id, data.nickname, data.avatar, data.location_name))
            conn.commit()
            new_id = cursor.lastrowid
        return {"status": "success", "data": {"id": str(new_id)}}
    except pymysql.Error as e:
        print(f"[数据库错误] checkin: {e}")
        raise HTTPException(status_code=500, detail="签到失败")
    finally:
        conn.close()


@app.delete("/api/footprints/{footprint_id}")
async def delete_footprint(footprint_id: str, visitor_id: str = Query("anonymous")):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM footprints WHERE id = %s", (footprint_id,))
            conn.commit()
        return {"status": "success"}
    except pymysql.Error as e:
        print(f"[数据库错误] delete_footprint: {e}")
        return {"status": "success"}
    finally:
        conn.close()


# ========== 评论系统 ==========

@app.get("/api/comments/{photo_id}")
async def get_comments(photo_id: str):
    """
    获取某张照片的评论
    ⚠️ 仅返回 status=1（已审核通过）的评论
    """
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            sql = """SELECT id, photo_id, content, nickname, avatar, location, device_info,
                            media_url, media_type, created_at
                     FROM comments
                     WHERE photo_id = %s AND status = 1
                     ORDER BY created_at ASC"""
            cursor.execute(sql, (photo_id,))
            rows = cursor.fetchall()
            data = []
            for row in rows:
                data.append({
                    "id": row[0],
                    "photo_id": row[1],
                    "content": row[2],
                    "nickname": row[3],
                    "avatar": row[4],
                    "location": row[5],
                    "device_info": row[6],
                    "media_url": row[7],
                    "media_type": row[8],
                    "created_at": row[9].strftime("%Y-%m-%d %H:%M:%S") if row[9] else ""
                })
            return {"status": "success", "data": data}
    except pymysql.Error as e:
        print(f"[数据库错误] get_comments: {e}")
        return {"status": "success", "data": []}
    finally:
        conn.close()


@app.post("/api/comments")
async def create_comment(comment: CommentCreate, request: Request):
    """用户提交新评论（自动识别IP归属地、设备信息、敏感词过滤）"""
    conn = get_db()
    try:
        # 1. 提取真实 IP
        ip_address = request.headers.get("X-Forwarded-For", request.client.host)
        if not ip_address or ip_address == "127.0.0.1":
            ip_address = "[本地IP]"

        # 2. 自动获取 IP 归属地（如果前端没传 location）
        location = comment.location if comment.location != "未知坐标" else "未知地域"
        if location == "未知地域" and ip_address != "[本地IP]":
            try:
                geo_resp = requests.get(f"http://ip-api.com/json/{ip_address}?lang=zh-CN", timeout=3).json()
                if geo_resp.get("status") == "success":
                    location = f"{geo_resp.get('regionName', '')} {geo_resp.get('city', '')}".strip()
            except Exception as e:
                print(f"[IP解析失败] {e}")

        # 3. 自动识别设备信息（如果前端没传）
        device_info = comment.device_info if comment.device_info else ""
        if not device_info:
            user_agent_str = request.headers.get("User-Agent", "")
            ua = parse_ua(user_agent_str)
            device_info = f"{ua.os.family} / {ua.browser.family}"

        # 4. 敏感词检查
        status = 0
        for bad_word in BAD_WORDS:
            if bad_word in comment.content:
                status = -1
                break

        # 5. 存入数据库
        with conn.cursor() as cursor:
            sql = """INSERT INTO comments (photo_id, content, nickname, avatar, location, device_info, media_url, media_type, status)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (
                comment.photo_id, comment.content, comment.nickname, comment.avatar,
                location, device_info, comment.media_url, comment.media_type, status
            ))
            conn.commit()
            new_id = cursor.lastrowid

        msg = "评论已提交，审核后可见"
        if status == -1:
            msg = "评论提交成功，涉嫌违规已转入人工队列"

        return {"status": "success", "data": {"id": new_id}, "message": msg}
    except pymysql.Error as e:
        print(f"[数据库错误] create_comment: {e}")
        raise HTTPException(status_code=500, detail="评论提交失败")
    finally:
        conn.close()


# ========== 文件上传 ==========

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1] if file.filename else ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    with open(filepath, "wb") as f:
        f.write(content)

    url = f"/uploads/{filename}"
    return {"status": "success", "url": url}


# ========== 管理后台 ==========

@app.get("/api/admin/comments")
async def admin_get_comments(tab: str = "pending"):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            if tab == "pending":
                cursor.execute("SELECT * FROM comments WHERE status = 0 ORDER BY created_at DESC")
            elif tab == "published":
                cursor.execute("SELECT * FROM comments WHERE status = 1 ORDER BY created_at DESC")
            else:
                cursor.execute("SELECT * FROM comments ORDER BY created_at DESC")

            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in rows]

            # 将 datetime 转字符串
            for item in data:
                if isinstance(item.get("created_at"), datetime):
                    item["created_at"] = item["created_at"].strftime("%Y-%m-%d %H:%M:%S")

            return {"status": "success", "data": data}
    except pymysql.Error as e:
        print(f"[数据库错误] admin_get_comments: {e}")
        return {"status": "success", "data": []}
    finally:
        conn.close()


@app.put("/api/admin/comments/{comment_id}")
async def admin_review_comment(comment_id: int, review: CommentReview):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE comments SET status = %s WHERE id = %s", (review.status, comment_id))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="评论不存在")
        return {"status": "success"}
    except pymysql.Error as e:
        print(f"[数据库错误] admin_review_comment: {e}")
        raise HTTPException(status_code=500, detail="操作失败")
    finally:
        conn.close()


@app.delete("/api/admin/comments/{comment_id}")
async def admin_delete_comment(comment_id: int):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM comments WHERE id = %s", (comment_id,))
            conn.commit()
        return {"status": "success"}
    except pymysql.Error as e:
        print(f"[数据库错误] admin_delete_comment: {e}")
        return {"status": "success"}
    finally:
        conn.close()


# ========== 静态文件托管 ==========
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ========== 启动入口 ==========
if __name__ == "__main__":
    import uvicorn
    init_db()  # 启动时自动建表
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
