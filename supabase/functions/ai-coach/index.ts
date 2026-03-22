import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      review: `你是一位专业的交易心理教练和复盘分析师。你的职责是：
1. 帮助交易者分析亏损交易的心理原因（FOMO、恐惧、贪婪等）
2. 识别交易者的情绪模式和行为偏差
3. 提供具体可执行的改进建议
4. 用数据和逻辑引导交易者建立纪律性
5. 鼓励交易者坚持盘前推演和计划执行
回答要简洁专业，使用中文，适当使用 emoji 增强可读性。`,
      strategy: `你是一位量化策略分析师。帮助交易者：
1. 分析策略的期望值和风险收益比
2. 识别高胜率的交易模式
3. 建议仓位管理和风险控制方法
4. 评估不同市场环境下的策略适用性
回答要数据驱动，使用中文。`,
      emotion: `你是一位交易心理辅导师。帮助交易者：
1. 识别和管理交易中的情绪波动
2. 建立健康的交易心态
3. 处理连续亏损带来的心理压力
4. 培养耐心和纪律性
回答要温和且有洞察力，使用中文。`,
    };

    const systemPrompt = systemPrompts[sessionType] || systemPrompts.review;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "请求过于频繁，请稍后再试" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 额度已用尽，请充值" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 服务暂时不可用" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
