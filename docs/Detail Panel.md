========================================
 Dec 18, 2025更新 by Hao
========================================

Detail Panel：必须按 segment（含 overview + relationship 等）提供更丰富文本
E1) Panel 内容结构要求（按 Pillar/Segment 变化）

当前 panel 需要：

Overview（总述）

Why（Key drivers / events）

What（Themes / keywords）

How（Advice：按 Work/Money/Relationship/Health 分类）

重点：切换 segment（Career/Money/Relationships/Energy/Overall）后：

文案主题必须明显变化

“Why”必须引用该 segment 的关键事件/驱动（不能只换标签）

E2) 给出 JSON 示例（请按此实现接口返回与缓存键）
Response JSON 示例（Month 粒度，Relationships segment）
{
  "user_id": "u_123",
  "algo_version": "v0.9.7",
  "timeframe": "month",
  "pillar": "relationships",
  "anchor": {
    "type": "month",
    "id": "2026-03",
    "start": "2026-03-01",
    "end": "2026-03-31",
    "score": 74.2,
    "score_label": "Momentum Score (0–100)"
  },
  "panel": {
    "overview": {
      "title": "Relationships trend upward this month",
      "summary": "This month supports deeper connection and clearer boundaries. You’re more likely to resolve lingering tension through honest conversations and consistent follow-through. Expect a few moments of intensity, but overall the arc favors trust-building and commitment."
    },
    "why": [
      {
        "driver": "Venus emphasis",
        "evidence": "Venus + Moon harmony",
        "impact": "Easier emotional attunement and mutual understanding",
        "confidence": 0.72
      },
      {
        "driver": "Boundary pressure",
        "evidence": "Saturn contact to relationship axis",
        "impact": "Commitment requires practical decisions and time investment",
        "confidence": 0.64
      }
    ],
    "what": {
      "themes": ["clarity", "repair", "commitment"],
      "keywords": ["honest talk", "trust", "boundaries"]
    },
    "how": {
      "do": [
        {"domain": "relationship", "text": "Have one direct conversation to clear expectations."},
        {"domain": "relationship", "text": "Plan a shared routine that reduces uncertainty."}
      ],
      "avoid": [
        {"domain": "relationship", "text": "Avoid testing people with silence or mixed signals."}
      ]
    }
  },
  "meta": {
    "generated_at": "2025-12-18T12:34:56Z",
    "cache_ttl_seconds": 86400
  }
}


说明：

anchor.score 负责图表数值

panel.* 负责解释与行动建议

algo_version 用于缓存失效

confidence 是可选但有利于后期做“可信度提示”

E3) Panel 请求与缓存策略（必须写成契约）
1) 请求策略

Panel 内容按需请求（点击柱子/默认选中柱子时触发）

endpoint 示例：

GET /api/panel?tf=month&pillar=relationships&id=2026-03

GET /api/panel?tf=day&pillar=career&id=2026-03-12

2) 缓存策略（强制）

Cache Key：

${user_id}:${algo_version}:${timeframe}:${pillar}:${anchor_id}

缓存位置：

前端：内存 Map +（可选）IndexedDB 持久化

后端：可选加一层（例如 Supabase table panel_cache）

失效策略：

algo_version 变更 → 全部失效

TTL：Month/Year 24h；Day 6h（可调整）

3) 预取策略（提升体验）

Landing（Month）时：

预取 Overall + 当前月 的 panel

切 pillar 时：

预取该 pillar 的当前 anchor panel（只取一个，别一次全拉 5 个）