#!/usr/bin/env python3
"""星火AI 的模型查询与最小对话示例，仅使用 Python 标准库。"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        # 避免把携带密钥的请求重定向到其他地址。
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("models", "chat"))
    parser.add_argument("--model", default=os.getenv("XINGHUO_MODEL", ""))
    parser.add_argument("--prompt", default="只回复你好")
    parser.add_argument("--max-tokens", type=int, default=32)
    parser.add_argument("--dry-run", action="store_true", help="只显示脱敏请求，不访问网络")
    args = parser.parse_args()
    base = os.getenv("XINGHUO_BASE_URL", "https://ai.wfpromax.xyz/v1").rstrip("/")
    parsed = urllib.parse.urlsplit(base)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
        parser.error("Base URL 必须是无凭据、查询参数及片段的 HTTPS 地址")
    if args.max_tokens < 1:
        parser.error("--max-tokens 必须大于 0")
    if args.action == "chat" and not args.model.strip():
        parser.error("请通过 --model 或 XINGHUO_MODEL 指定准确模型 ID")

    payload = None
    if args.action == "chat":
        payload = {"model": args.model, "messages": [{"role": "user", "content": args.prompt}],
                   "max_tokens": args.max_tokens, "stream": False}
    url = base + ("/models" if args.action == "models" else "/chat/completions")
    if args.dry_run:
        print(json.dumps({"method": "GET" if payload is None else "POST", "url": url,
                          "headers": {"Authorization": "Bearer <已隐藏>"}, "body": payload},
                         ensure_ascii=False, indent=2))
        return 0

    key = os.getenv("XINGHUO_API_KEY", "").strip()
    if not key or key == "替换为本站API密钥":
        parser.error("请先设置 XINGHUO_API_KEY；仅预览请使用 --dry-run")
    request = urllib.request.Request(url, data=None if payload is None else json.dumps(payload).encode("utf-8"),
                                     headers={"Authorization": "Bearer " + key,
                                              "Content-Type": "application/json", "Accept": "application/json"})
    try:
        # 示例只请求一次；失败后先核对原因，避免重复计费。
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=60) as response:
            result = json.load(response)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except urllib.error.HTTPError as error:
        print(f"HTTP {error.code}：请按 README 核对权限、路径、配额和模型状态。", file=sys.stderr)
    except (urllib.error.URLError, TimeoutError, OSError):
        print("网络连接失败或超时，请检查地址和网络后再决定是否重试。", file=sys.stderr)
    except (ValueError, UnicodeError):
        print("响应不是有效 JSON，请核对接口地址与服务状态。", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
