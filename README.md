# 星火AI 智能网关 / Xinghuo AI Gateway：OpenAI 兼容 API 接入示例

通过 Python 标准库查询模型、发送第一条 Chat Completions 请求，并核对返回内容和用量。示例不依赖第三方 Python 包，适合脚本、服务端应用和自定义客户端接入前验证配置。

本仓库由星火AI 智能网关维护，介绍的是我们自己的服务。星火AI 是独立第三方 AI API 网关；不是 OpenAI、Anthropic、Google 或其他模型厂商的官方网站，不表示官方授权或合作。本仓库公开接入示例，不包含网关服务端源码。

## 服务入口

| 内容 | 地址 |
| --- | --- |
| 网站 | [星火AI 智能网关](https://ai.wfpromax.xyz/?utm_source=github&utm_medium=referral&utm_campaign=public_examples) |
| 当前模型、分组与价格 | [模型目录](https://ai.wfpromax.xyz/available-channels?utm_source=github&utm_medium=referral&utm_campaign=public_examples) |
| 服务说明 | [服务定位与适用范围](https://ai.wfpromax.xyz/guides/service.html) |
| 服务身份 | [品牌、域名与站点关系](https://ai.wfpromax.xyz/service-info.html) |
| 调用验收 | [模型、响应、用量与扣费](https://ai.wfpromax.xyz/guides/api-verification.html) · [English](https://ai.wfpromax.xyz/guides/en/api-verification.html) |
| 接入文档 | [OpenAI 兼容接口](https://ai.wfpromax.xyz/guides/openai-compatible-api.html) · [Claude Code 配置](https://ai.wfpromax.xyz/guides/claude-code.html) |
| 费用核对 | [Token 计费说明](https://ai.wfpromax.xyz/guides/token-billing.html) · [用量查询](https://ai.wfpromax.xyz/key-usage) |
| 购买前阅读 | [购买与兑换指南](https://ai.wfpromax.xyz/guides/buying-guide.html) |

官网目录提供 GPT、Claude、Gemini、Kimi 等模型选型入口；实际可调用的模型、价格、上下文和功能取决于所用密钥、账户分组及当前配置。请以账户实时信息为准。

## 品牌与站点关系

星火AI 智能网关的英文名为 **Xinghuo AI Gateway**，网站为 `ai.wfpromax.xyz`。它与科大讯飞的“讯飞星火”及其 Token Factory 不是同一个服务。搜索名称相似时，请先核对域名与 Base URL。

`xh8.net` 商城的相关商品页面提供本网关入口；`shop.wfpromax.xyz` 也提供商城页面。这是商城与网关之间的业务关联，不能据此推断账号、余额或商品权益通用。购买时分别确认具体商品和 API 额度的使用范围。可核对的入口集中在[服务资料页](https://ai.wfpromax.xyz/service-info.html)。

本仓库由服务维护方发布，不能作为独立第三方测评。判断接入是否适合自己的业务，可按[调用验收文章](https://ai.wfpromax.xyz/guides/api-verification.html)分别检查请求结构、模型目录、实际回答、Token 用量和账户扣费。模型名、HTTP 200 或一次调用成功都不能单独证明长期可靠性。

## 快速开始

需要 Python 3.9 或更新版本，以及在本站创建的 API Key。密钥只放在本机或服务端环境变量中，不要写入前端页面、公开仓库、Issue 或截图。

```bash
export XINGHUO_API_KEY='替换为本站API密钥'
export XINGHUO_BASE_URL='https://ai.wfpromax.xyz/v1'
python3 example.py models
```

从返回结果选择自己的密钥有权使用的准确模型 ID，再发起短请求。**生成请求可能产生费用**；示例只请求一次，不自动重试。

```bash
export XINGHUO_MODEL='替换为上一步返回的模型ID'
python3 example.py chat --prompt '只回复你好' --max-tokens 32
```

响应中的回答与 `usage` 会显示在终端。随后到控制台或用量查询页核对该次请求的实际扣费。HTTP 200、模型目录可见和实际生成成功是不同的检查步骤。

不填密钥、只查看示例请求结构：

```bash
python3 example.py chat --model YOUR_MODEL_ID --dry-run
```

`--dry-run` 不发送网络请求，也不会打印真实密钥。运行时网络超时上限为 60 秒。`--max-tokens` 是否适用取决于具体模型；参数不兼容时请按文档调整，不要通过无限重试解决。

## cURL 查询模型

```bash
curl --fail-with-body --max-time 30 \
  'https://ai.wfpromax.xyz/v1/models' \
  -H "Authorization: Bearer $XINGHUO_API_KEY"
```

客户端填写 Base URL 时使用 `https://ai.wfpromax.xyz/v1`；填写完整对话接口时使用 `https://ai.wfpromax.xyz/v1/chat/completions`，避免重复拼接 `/v1`。

## 常见报错

| 状态 | 优先检查 |
| --- | --- |
| 401 | 是否使用本站密钥，是否复制完整，密钥是否有效 |
| 403 | 密钥、分组和目标模型的权限 |
| 404 | 接口路径是否正确、是否重复 `/v1`、模型 ID 是否准确 |
| 429 | 频率、并发、配额限制；降低请求频率并检查账户状态 |
| 502 / 503 | 当前模型或上游是否暂时不可用；保存时间、状态码与请求标识，联系站内支持 |

完整说明见 [API 错误排查](https://ai.wfpromax.xyz/guides/api-errors.html)。公开反馈仅提供脱敏信息，不要附上 API Key、账户隐私或业务原文。

## 接入前需要明确的边界

- API 额度与 ChatGPT、Claude 等网页会员是不同产品，不能互相替代。
- 接口格式兼容不等于支持所有模型参数、流式、工具调用或多模态功能；正式接入前按实际任务验证。
- 费用比较应同时核对模型、输入/输出/缓存单价、计费单位、账户倍率和有效期。
- 本仓库不承诺固定价格、永久模型、无故障运行或固定可用率；示例代码不能替代你所在网络和业务场景下的验证。

## 反馈与许可证

示例代码或说明问题可以在本仓库提交 Issue；账户、订单和额度问题请通过官网支持入口处理。示例代码以 MIT 许可证发布，许可证不授予模型服务额度或第三方品牌权利。
