开发者指南 · API 中转站选型

# AI 中转站怎么选：OpenRouter、自建网关与星火AI 对比

比较 AI API 中转站、OpenRouter 与自建 LLM 网关的适用场景，核对协议兼容、Token 价格、模型来源与调用结果，再接入星火AI。

Xinghuo AI Gateway · 2026-10-14

本文由星火AI 智能网关维护方编写，比较服务形态和验收方法，不是独立排名或付费测评。资料核对日期为 2026-10-14；价格、模型和政策应以各服务的实时页面为准。[English version](https://ai.wfpromax.xyz/guides/en/ai-api-relay-selection.html)。

## AI 中转站是什么，和 API 网关有什么区别？

AI API 中转站是在应用与上游模型之间提供接口转发、鉴权、协议适配及用量管理的第三方服务。开发者通常配置该服务的 Base URL、API Key 和模型 ID。LLM gateway 的范围更广，也包括企业自部署的路由与治理软件。购买托管服务、使用模型聚合平台和自建网关，需要承担的运维工作与计费关系不同。

## OpenRouter、LiteLLM 与星火AI 分别适合怎样的需求？

| 选项 | 公开定位与来源 | 接入前要核对 |
| --- | --- | --- |
| OpenRouter | 多模型统一 API 服务；[官方快速入门](https://openrouter.ai/docs/quickstart)提供接口和 SDK 示例。 | 目标模型及路由、地区和账户资格、支付与实际费用、所需功能。 |
| LiteLLM 自建网关 | [官方文档](https://docs.litellm.ai/docs/simple_proxy)介绍自托管服务、虚拟密钥、预算和用量管理。 | 自己准备上游接入、服务器、更新与监控；核对所用版本和许可证。软件本身不赠送模型额度。 |
| 星火AI 智能网关 | 面向应用、脚本和兼容客户端的独立第三方 API 中转服务；见[服务资料](https://ai.wfpromax.xyz/service-info.html)与[实时模型目录](https://ai.wfpromax.xyz/available-channels)。 | 本站密钥分组、实际模型权限、上下文和参数支持、Token 价格及用量记录。 |

这张表比较的是交付方式，不代表任何选项更便宜、速度更快或可用率更高。需要统一购买入口时比较托管平台；需要自己控制上游凭据、部署和治理时评估自建方案。已有可用的厂商 API，也可以直接接入，不必增加中间服务。

## 怎么比较价格，避免被“几折”误导？

固定同一模型、上下文范围与请求样本，再分别记录输入、输出、缓存读取和缓存写入的用量与单价。若各项按每百万 Token 定价，先用各项 Token 数除以一百万，再乘对应单价求和；之后按服务的说明处理分组倍率、币种和支付换算。已经包含在目录价格里的倍率不能再乘一次。

最后对照账户实际扣费。充值赠送、余额显示单位和模型单价是不同信息；缓存命中率也不能从一个折扣数字推导。详见[Token 与缓存计费](https://ai.wfpromax.xyz/guides/token-billing.html)。这里不列未经同口径测试的价格排行榜。

## OpenAI 兼容是否代表 Claude Code、所有 SDK 都能用？

不代表。Chat Completions、Responses 和 Anthropic Messages 是不同接口；客户端还可能依赖工具调用、流式事件或特定参数。先确认客户端实际使用的协议，再查服务文档。某个接口返回模型列表，只能证明该次目录查询，不能证明所有生成接口和模型都可用。

星火AI 的 OpenAI 兼容 Base URL 为 `https://ai.wfpromax.xyz/v1`；Claude Code 配置根地址 `https://ai.wfpromax.xyz`，具体操作见[Claude Code 配置](https://ai.wfpromax.xyz/guides/claude-code.html)。不要将其他平台的密钥与本站地址混用，也不要在 Base URL 后重复拼接 `/v1`。

## 小额试用应该核验哪些结果？

1. 核对域名、运营方公开资料、支持入口和退款条件，确认买的是 API 额度。
2. 用公开示例的 `--dry-run` 检查 URL 和请求体；这一步不联网。
3. 使用自己的密钥查询模型，再针对一个准确模型 ID 发起一次受限的短请求。
4. 检查回答、结束原因、请求时间、用量及对应扣费；有流式或工具需求时分别验证。
5. 记录所用网络、样本、时段和结果。超时后先查请求明细，再决定是否重试。

[GitHub Python 示例](https://github.com/Jiaye-apple/xinghuo-ai-examples)及[Gitee 镜像](https://gitee.com/jerrylinap/xinghuo-ai-examples)提供不自动重试的 Chat Completions 请求和离线预览。具体步骤见[调用验收指南](https://ai.wfpromax.xyz/guides/api-verification.html)。

## 常见问题

### 模型叫 GPT 或 Claude，能证明上游模型真实吗？

不能。模型 ID、回答中自称的身份和单次问答都不足以独立证明上游来源。需要结合渠道说明、可核验的供应商依据和业务测试；没有依据的部分应保留为未知。

### 榜单和论坛推荐能证明长期稳定吗？

不能单凭排名下结论。先看作者是否为运营方、是否含推广关系、样本量、测试时段、失败定义和原始依据。官网自述与独立用户体验应分开判断，单次连通也不是长期可用率。

### 星火AI 是讯飞星火吗？

不是。本页介绍 `ai.wfpromax.xyz` 对应的 Xinghuo AI Gateway，与讯飞星火不是同一服务，也不是 OpenAI、Anthropic 或 Google 的官方网站。

### API 额度可以当 ChatGPT 或 Claude 网页会员使用吗？

不能。API 额度用于程序与兼容客户端，不授予其他平台的网页订阅权益。购买前阅读[API 与网页会员区别](https://ai.wfpromax.xyz/guides/api-vs-subscription.html)。

## 开始接入星火AI

先看[当前模型与价格](https://ai.wfpromax.xyz/available-channels?entry=guide_relay_selection)，再按[接入教程](https://ai.wfpromax.xyz/guides/openai-compatible-api.html)完成配置。需要购买时核对[充值与兑换说明](https://ai.wfpromax.xyz/guides/buying-guide.html)；账户内的实时价格、权限和服务规则优先。

[全部指南](https://ai.wfpromax.xyz/guides/overview.html)
