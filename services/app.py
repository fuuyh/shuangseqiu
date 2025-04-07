from flask import Flask, request, Response, stream_with_context, jsonify
import requests
import xml.etree.ElementTree as ET
from flask_cors import CORS  # 新增导入
from datetime import datetime
import re
import json

app = Flask(__name__)
CORS(app)  # 全局启用跨域支持（允许所有来源）

# 如果需要细粒度控制，可以替换为以下配置：
# CORS(app, resources={r"/generate-with-search": {"origins": "http://your-frontend-domain.com"}})

# 配置搜索 API 密钥（以博查 API 为例）
BOCHA_API_KEY = '你的博查API密钥'

@app.route('/generate-with-search', methods=['POST'])
def generate_with_search():
    user_prompt = request.json.get('prompt')
    if not user_prompt:
        return jsonify({'error': '请输入提示词'}), 400

    try:
        # 第一步：调用网页搜索 API（如果需要）
        # search_results = perform_search(user_prompt)
        # print("搜索结果:", search_results)

        # 第二步：组合提示词
        combined_prompt = f"用户问题：{user_prompt}"

        # 第三步：调用 Ollama 模型并流式返回响应
        return Response(
            stream_with_context(call_ollama_stream(combined_prompt)),
            content_type='text/event-stream'  # 使用 SSE 格式
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 辅助函数（搜索功能）
def perform_search(query):
    headers = {
        'Authorization': f'Bearer {BOCHA_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {'query': query}
    response = requests.post('https://api.bochaai.com/search', headers=headers, json=data)
    results = response.json()['results']
    return '\n'.join([f"{item['title']} - {item['snippet']}" for item in results])

# 调用 Ollama 的流式响应函数
def call_ollama_stream(prompt):
    payload = {
        'model': 'deepseek-r1:7b',
        'prompt': prompt,
        'stream': True,
        'option': {
            'temperature': 0.9,
        }
    }
    
    with requests.post(
        'http://localhost:11434/api/generate',
        json=payload,
        stream=True,
        timeout=30
    ) as response:
        response.encoding = 'utf-8'
        response.raise_for_status()
        
        for line in response.iter_lines(decode_unicode=True):
            if line:
                try:
                    data = line.strip()
                    # 直接包装为 SSE 格式，无需判断 data: 前缀
                    yield f"data: {data}\n\n"  # 添加 data: 前缀
                except Exception as e:
                    yield f"data: [解析错误]: {str(e)}\n\n"

@app.route('/get-ssq-list', methods=['GET'])
def get_ssq_list():
    try:
        # 1. 获取 XML 数据
        xml_content = fetch_ssq_data()
        if not xml_content:
            return jsonify({"error": "无法获取 XML 数据"}), 500

        # 2. 解析 XML 数据
        data = parse_xml(xml_content)
        if not data:
            return jsonify({"error": "解析数据失败"}), 500

        # 3. 返回 JSON 格式数据
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_ssq_data():
    url = "https://kaijiang.500.com/static/info/kaijiang/xml/ssq/list.xml"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://kaijiang.500.com/ssq/"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"请求失败: {e}")
        return None

# 根据日期获取星期几

def get_weekday(date_str):
    # 将日期字符串转换为 datetime 对象
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    
    # 获取星期几的数字（0-6，对应周一到周日）
    weekday_num = date_obj.weekday()  # 0（周一）到 6（周日）
    
    # 映射数字到中文星期表示（"一"到"日"）
    weekdays = ["一", "二", "三", "四", "五", "六", "日"]
    
    return weekdays[weekday_num]

def parse_xml(xml_content):
    root = ET.fromstring(xml_content)
    rows = root.findall("row")  # 假设根元素直接包含所有 <row> 标签
    
    if not rows:
        return []
    
    data = []
    for row in rows:
        expect = row.get("expect")  # 期号
        opencode = row.get("opencode")  # 红球和蓝球
        opentime = row.get("opentime")  # 开奖时间
        
        # 拆分红球和蓝球
        if "|" in opencode:
            red_str, blue_str = opencode.split("|")
            red_balls = red_str.split(",")
            blue_ball = blue_str
        else:
            red_balls = []
            blue_ball = ""
        
        data.append({
            "qh": '20' + expect,
            "kjrq": opentime.split()[0],  # 只取日期部分
            "hq": red_balls,
            "lq": blue_ball,
            "day": get_weekday(opentime.split()[0]),  # 获取星期几
        })
    
    # 按开奖时间排序（最新在前）
    data_sorted = sorted(data, key=lambda x: x["kjrq"], reverse=True)
    
    # 返回最新 30 条
    return data_sorted[:100]

@app.route('/gen-num', methods=['POST'])
def gen_num():
    user_type = request.json.get('type')
    user_qh = request.json.get('qh')
    print("用户期号:", user_qh)
    print("用户生成机制:", user_type)
    if not user_type:
        return jsonify({'error': '请选择生成机制'}), 400

    if not user_qh:
        return jsonify({'error': '请输入期号'}), 400
    
    try:
        # 根据用户选择生成提示
        if user_type not in ('0', '1', '2', '3'):
            return jsonify({'error': '无效的生成机制'}), 400

        type_map = {'0': '大数据分析，通过近100期数据分析，找出最有概率获奖的号码', '1': '随机生成', '2': '中国传统周易六十四卦，使用今天的日期当前的时间起卦，注意需要使用中国传统农历日期和时间','3': '中国传统六爻卦，使用今天的日期当前的时间起卦，注意需要使用中国传统农历日期和时间'}
        global_prompt = gen_prompt(type=type_map[user_type],user_qh=user_qh)

        # 获取完整的模型响应
        full_response = ""
        for chunk in call_ollama_stream(global_prompt):
            if chunk.startswith('data: '):
                try:
                    data = json.loads(chunk[6:])  # 去掉 data: 前缀
                    # 过滤掉 <think> 标签内容
                    response = data.get('response', '')
                    if '<think>' in response:
                        response = response.split('</think>')[-1].strip()  # 提取有效部分
                    full_response += response
                except json.JSONDecodeError:
                    continue

        # 解析最终结果
        parsed = parse_result(full_response)

        return jsonify({
            "success": True,
            "result": {
                "red": parsed["red_balls"],
                "blue": parsed["blue_balls"]
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def parse_result(raw_text):
    print("原始文本:", raw_text)

    # 匹配包含方括号的数字列表（兼容中英文符号）
    red_pattern = r'红球\s*[：:]\s*\[([\d\s,]+)\]'
    blue_pattern = r'蓝球\s*[：:]\s*\[([\d\s,]+)\]'

    red_match = re.search(red_pattern, raw_text)
    blue_match = re.search(blue_pattern, raw_text)

    if not red_match or not blue_match:
        raise ValueError("解析失败，请检查模型输出格式")

    # 清洗数据并转为数字列表
    red_balls = [num.strip() for num in red_match.group(1).split(',')]
    blue_balls = [num.strip() for num in blue_match.group(1).split(',')]

    # 验证数据有效性
    if len(red_balls) != 6 or any(not num.isdigit() for num in red_balls):
        raise ValueError("红球格式错误")
    if len(blue_balls) != 1 or not blue_balls[0].isdigit():
        raise ValueError("蓝球格式错误")

    return {
        "red_balls": red_balls,  # 直接返回列表，如 ["16", "22", ...]
        "blue_balls": blue_balls # 直接返回列表，如 ["9"]
    }
def gen_prompt(type,user_qh):
    return f"""严格按以下规则生成双色球号码：最新期号{user_qh}
    1. 使用{type}方式生成
    2. 仅返回最终结果，禁止包含任何思考过程或额外文本
    3. 红球必须为6个号码，蓝球必须为1个号码
    4. 格式必须为（示例）：
        红球：[1,5,13,22,28,33]
        蓝球：[7]
    5. 数字范围：红球1-33，蓝球1-16"""


# 启动 Flask 应用
if __name__ == '__main__':
    app.run(port=3000, debug=True)