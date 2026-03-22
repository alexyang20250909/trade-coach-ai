import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Lock, User, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [notifDiscipline, setNotifDiscipline] = useState(true);
  const [notifAI, setNotifAI] = useState(true);
  const [notifReview, setNotifReview] = useState(true);

  const handleChangePassword = async () => {
    if (newPw.length < 6) {
      toast({ title: "密码过短", description: "密码至少 6 位", variant: "destructive" });
      return;
    }
    if (newPw !== confirmPw) {
      toast({ title: "密码不一致", description: "两次输入的密码不相同", variant: "destructive" });
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) {
      toast({ title: "修改失败", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "密码已更新", description: "新密码已生效" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="max-w-[700px] space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" /> 系统设置
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">管理账户、安全和通知偏好</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-muted w-full justify-start">
          <TabsTrigger value="account" className="gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> 账户</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs"><Lock className="w-3.5 h-3.5" /> 安全</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs"><Bell className="w-3.5 h-3.5" /> 通知</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">账户信息</h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">邮箱</Label>
                  <Input value={user?.email || ""} disabled className="mt-1 bg-muted" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">注册时间</Label>
                  <Input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString("zh-CN") : ""}
                    disabled
                    className="mt-1 bg-muted"
                  />
                </div>
              </div>
            </div>
            <Button variant="destructive" className="gap-2" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" /> 退出登录
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">修改密码</h2>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">当前密码</Label>
                  <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">新密码</Label>
                  <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">确认新密码</Label>
                  <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="mt-1" />
                </div>
              </div>
              <Button onClick={handleChangePassword} disabled={pwLoading || !newPw}>
                {pwLoading ? "保存中..." : "保存密码"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">通知偏好</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">纪律违规提醒</p>
                    <p className="text-xs text-muted-foreground">冲动开仓、偏离计划时提醒</p>
                  </div>
                  <Switch checked={notifDiscipline} onCheckedChange={setNotifDiscipline} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">AI 教练建议</p>
                    <p className="text-xs text-muted-foreground">定期推送复盘分析和策略建议</p>
                  </div>
                  <Switch checked={notifAI} onCheckedChange={setNotifAI} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">周期复盘提醒</p>
                    <p className="text-xs text-muted-foreground">每周/每月复盘日自动提醒</p>
                  </div>
                  <Switch checked={notifReview} onCheckedChange={setNotifReview} />
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
