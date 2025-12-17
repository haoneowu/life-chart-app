Goal: 以 MVP 快速启动 + Product as Media 为核心，构建一个可 viral 传播的 Life Chart 产品，验证需求并形成早期流量与付费路径。

---
1. 产品定位（Positioning）
一句话定义
This is not astrology.
It’s a chart for your life momentum.
- 面向对象：
  - 非专业占星用户
  - 对“人生趋势 / 走势 / 阶段性感受”有兴趣的普通用户
- 核心隐喻：
  - 人生 ≈ 市场
  - 运势 ≈ Momentum
  - 时间 ≈ Candlestick

---
2. 经典 UJ（User Journey · MVP）
Step 1｜信息录入（Input）
用户首次进入，完成最小必要输入。
字段定义
- 出生日期（Required）
- 出生时间（Optional）
  - 默认：12:00（Local Time）
  - 若填写：默认使用设备当前时区
- 出生地（Required）
  - 国家 / 城市
  - 默认：设备当前定位
  - 支持手动搜索与修改
设计原则
- 不因“时间不确定”阻断转化
- 出生地为硬性字段（占星计算必需）
- 精度作为未来 Pro 升级点
CTA：Generate My Life Chart

---
Step 2｜核心输出：Life Candles Chart（Day / Month / Year）
默认视图（First Impression）
- X 轴：时间
  - 支持颗粒度：Day（默认）/ Month / Year
  - Day 默认窗口：最近 90 天
  - 默认选中：Today
- Y 轴：Momentum Score（0–100）
  - 定义：Relative Momentum
  - 不暴露算法细节
视觉要点
- Today 高亮（存在感 / 当下感）
- Candlestick 表达波动与情绪

---
Step 3｜交互核心：单根 Candle 解读
交互行为
- 点击任意一根 Candle → 弹出解读面板
解读内容结构（运营级，不是教材）
- Title：Today’s Signal / Selected Day
- Momentum：↑ / → / ↓
- Volatility：High / Medium / Low
- Focus：1–2 个关键词（Communication / Finance / Rest 等）
- One-line Advice（一句话行动建议）

---
3. Responsive 交互规范
Desktop
- Left-hand slide-in panel
- 不遮挡主 chart
- 支持 carousel（前一天 / 后一天）
Mobile
- Bottom slide-in panel
- 高度：50–70% 屏幕
- 手势支持：
  - Swipe up/down 切换 candle
  - Swipe down 收起面板
设计对齐参考：
- TradingView
- Apple Stocks
- 主流 Crypto Trading App

---
4. 时间颗粒度（Time Granularity · 占星视角）
占星是连续时间系统，而非八字式离散分段。
MVP 支持的颗粒度
Day（默认）
- 基于：Daily Transits
- 单位：1 天 = 1 根 Candle
- 用途：核心互动与传播单元
Month
- 基于：Lunar Cycle + 日信号聚合
- 单位：30 天窗口
- 用途：月度情绪 / 波动感知
Year
- 基于：Solar Return + 月度聚合
- 单位：12 个月
- 用途：年度主题趋势
非 MVP（Future / Pro）
- 十年 / 长周期叙事（暂不进入产品主流程）
  - 作为后续内容型/报告型扩展（Narrative-driven），不做即时图表。

---
5. 技术与实现边界（MVP Reality Check）
明确不做
- 不做完整 Natal Chart UI
- 不做 Aspect 教学
- 不做长文本命理解读
- 不做“星座性格判断”

---
实际 MVP 架构
底层（Computation）
- 使用现有占星计算库（Ephemeris 级别）
- 只输出：
  - Daily Signal Strength
  - 少量标签（Emotion / Finance / Action）
Repo 只负责：Time → Signal

---
中层（Abstraction）
- 将占星信息压缩为：
  - Momentum（↑ / → / ↓）
  - Volatility（High / Medium / Low）
原则：
- 不追求“解释正确”
- 追求“走势可感知”

---
前端（Expression）
- Candlestick = 情绪与波动的视觉隐喻
- 不解释算法 → 保留神秘感 + 降低质疑

---
6. Product as Media（Viral 设计）
核心传播单元
Today’s Candle
- 一根 Candle
- 一句话解读
- 一个 emoji / icon
- 一个日期
→ 天然适合截图与分享

---
Viral Hooks（示例）
- “I didn’t believe astrology. Then I saw my life as a chart.”
- “Stocks have charts. Why don’t lives?”
- “Today looks bullish for my life.”
全部使用 Market / Trading 语言，而非占星语言

---
分享机制（MVP 必做）
- Share Today’s Candle
- 自动生成：
  - 可截图卡片
  - 日期 + 解读 + Link
  - Referral 参数

---
7. 盈利路径（不影响冷启动）
Phase 1｜Free
- Today
- 最近 7 天
Phase 2｜Light Pay
- 解锁 Past / Future
- Month / Year 视图
（MVP 暂不提供 Love/Wealth/Health 等分支面板，先把“单主线 Momentum”跑通。）
Phase 3｜Narrative Products
- 年度 / 阶段性报告
- Career / Relationship Seasons
- 内容即商品

---
8. MVP 成功标准（Success Metrics）
- 首次生成转化率
- Today Candle 分享率
- 回访率（D1 / D7）
- Free → Paid 解锁率

---
9. Technical Notes (MVP Implementation Appendix)
9.1 Ephemeris & Astronomy Engine Choice (MVP)
Decision: Use a permissive-license astronomy engine to avoid GPL/AGPL constraints and enable closed-source backend + future commercialization.
Selected Core Library:
- astronomy-engine (MIT License)
  - npm: astronomy-engine
  - License: MIT (commercial-friendly, no copyleft)
  - Role: Planetary position calculation (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn)
  - Precision: Sufficient for daily-level momentum signals (MVP)
Explicitly NOT used in MVP:
- Swiss Ephemeris / swisseph (GPL/AGPL)
- Any GPL-based Moshier JS forks
Rationale:
- Zero licensing risk for MVP
- No ephemeris data files required
- Easy deployment on Railway / container-based infra

---
9.2 Supported Astrology Model (MVP Constraints)
To ensure interpretability, consistency, and engineering simplicity, the MVP fixes the following parameters:
- Zodiac system: Western Tropical
- House system: Whole Sign
- Birth time: Optional
  - If missing, default to 12:00 local time
- Birth location: Required (city-level)
  - Used to infer IANA timezone
No alternative systems (sidereal, Placidus, etc.) are exposed in MVP.

---
9.3 Core Data Pipeline
Step A — Natal Snapshot (One-time)
Input:
- birth_date (YYYY-MM-DD)
- birth_time (HH:mm | null)
- birth_city → lat/lon + timezone
Process:
- Convert local datetime → UTC
- Compute planetary longitudes via astronomy-engine
Output (stored):
- natal_planets: [{ planet, longitude }]
- metadata: { timezone, coordinates, model_version }

---
Step B — Daily Transit Calculation
For each calendar day:
- Compute transit longitudes for selected planets
- Cache results by date
This layer is deterministic and does NOT involve LLMs.

---
Step C — Momentum Signal Generation
For each day:
- Compare natal vs transit angular distances
- Apply fixed orb thresholds
Orb Rules (MVP):
- ≤ 2° → strong signal
- 2–4° → moderate signal
- 4° → ignored
Momentum Score:
- Base range: 0–100
- strong: +5
- moderate: +3
- capped at 100
Volatility:
- Calculated from day-to-day delta of Momentum Score
- Buckets: calm / dynamic / intense
Output:
- momentum_score
- volatility
- signal_tags

---
9.4 LLM Usage Policy (Strict)
LLM is used ONLY for language rendering, never for calculation.
Trigger:
- User clicks a specific candle (day / month / year)
Input to LLM:
- Structured JSON signal data
Output:
- Strict JSON (length-limited)
- Non-predictive language
- Uses terms: signals / themes / reflection
All outputs are cached by:
user_id + date + granularity + algo_version

---
9.5 Frontend & Deployment Stack (MVP)
Frontend (Web):
- Next.js (App Router)(Vercel)
- Tailwind CSS + shadcn/ui (Linear-style UI)
- Framer Motion (cinematic transitions)
- Charting: lightweight-charts
Backend:
- Node.js service (Railway)
- astronomy-engine for computation
- Supabase (Postgres) for persistence
This architecture is API-first and directly reusable by a future iOS client.

---
9.6 iOS Compatibility (Future)
- Shared compute API
- Shared scoring logic
- SwiftUI frontend consumes identical endpoints
No astrology logic duplicated client-side.

---
9.7 Engineering Principles (Non-negotiable)
- Deterministic core → explainable → cacheable
- No hidden astrology jargon exposed to users
- Market / trading language only
- Product behaves as daily content feed, not a static report
