# Xinghuo AI Gateway: OpenAI-compatible API relay examples

[中文说明](README.md) · [English integration guide](https://ai.wfpromax.xyz/guides/en/openai-compatible-api.html)

Xinghuo AI Gateway (星火AI 智能网关) is an independent third-party AI API relay at **ai.wfpromax.xyz**, for applications, scripts and compatible clients. This repository is maintained by the service operator and contains public integration examples, not the gateway server source or an independent review.

It is distinct from iFlytek Spark and is not the official service of OpenAI, Anthropic or Google. Model availability, capabilities, pricing and limits depend on your site-issued key, account group and current configuration. API credits do not grant ChatGPT or Claude web subscriptions.

## Service and documentation

| Resource | Link |
| --- | --- |
| Website | [Xinghuo AI Gateway](https://ai.wfpromax.xyz/?utm_source=github&utm_medium=referral&utm_campaign=relay_selection) |
| OpenAI-compatible base URL | `https://ai.wfpromax.xyz/v1` |
| Clients and extensions | [Downloads and setup](https://ai.wfpromax.xyz/downloads?utm_source=github&utm_medium=referral&utm_campaign=public_examples) |
| Models, groups and prices | [Current catalog](https://ai.wfpromax.xyz/available-channels) |
| Identity and related sites | [Service information](https://ai.wfpromax.xyz/service-info.html) |
| Integration | [OpenAI-compatible API](https://ai.wfpromax.xyz/guides/en/openai-compatible-api.html) · [Claude Code](https://ai.wfpromax.xyz/guides/en/claude-code.html) |
| Choosing a service | [Hosted API relays, OpenRouter and self-hosted gateways](docs/ai-api-relay-selection.en.md) |
| Request acceptance | [API verification](https://ai.wfpromax.xyz/guides/en/api-verification.html) |
| Billing and troubleshooting | [Token costs](https://ai.wfpromax.xyz/guides/en/token-billing.html) · [API errors](https://ai.wfpromax.xyz/guides/en/api-errors.html) |
| Purchasing | [Credits and redemption guide](https://ai.wfpromax.xyz/guides/en/buying-guide.html) |

## Run the example

Requires Python 3.9 or newer. The example uses only the Python standard library. Download and inspect `example.py` from this repository before running it.

First inspect the request without a key or network access:

```bash
python3 example.py chat --model YOUR_MODEL_ID --dry-run
```

For live requests, put your own site-issued key in a local or server-side environment variable. Never put keys in browser code, public issues or screenshots.

```bash
export XINGHUO_API_KEY='YOUR_SITE_ISSUED_KEY'
export XINGHUO_BASE_URL='https://ai.wfpromax.xyz/v1'
python3 example.py models
```

Choose an exact model ID returned for your key, then make one bounded request. **Generation may incur charges.**

```bash
python3 example.py chat --model YOUR_MODEL_ID --prompt 'Reply with hello' --max-tokens 32
```

The example does not automatically retry and uses a network timeout of at most 60 seconds. Model-specific acceptance of `max_tokens` must be checked. A timeout does not establish that no upstream work or charge occurred; check account usage before trying again.

Inspect the answer, finish reason and usage, then reconcile the request with its account charge. A model list, HTTP 200 and a usable generation result establish different facts. A single successful request does not establish long-term uptime or upstream model identity.

## Base URL and protocol checks

Use `https://ai.wfpromax.xyz/v1` in an OpenAI-compatible client's base-URL field. The full Chat Completions URL is `https://ai.wfpromax.xyz/v1/chat/completions`; avoid repeating `/v1`.

Claude Code uses the root URL `https://ai.wfpromax.xyz`; read the linked configuration guide. Chat Completions, Responses and Anthropic Messages are different protocols. Verify the features your client actually needs, including streaming, tool calls and model-specific parameters.

## Troubleshooting

| Status | First checks |
| --- | --- |
| 401 | Site-issued key, copied value, validity |
| 403 | Key group and model permissions |
| 404 | Path, duplicated `/v1`, exact model ID |
| 429 | Rate, concurrency and quota limits |
| 502 / 503 | Current service availability; preserve time, status and a non-sensitive request identifier |

Compare costs using input, output and cache categories, billing units and documented group or currency conversions. Do not infer effective cost from a discount label alone. Current catalog and account records take precedence over examples.

## Feedback and license

Use repository issues for example-code or documentation problems. Use the website's support entry for private account or payment questions. Do not include API keys, private prompts or personal order information.

The example code is MIT licensed. The license does not provide model credits or rights to third-party brands. We publish no unverified uptime, latency or model-authenticity guarantees.
