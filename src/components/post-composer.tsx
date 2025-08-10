"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { NetworkSelect, type Network } from "@/components/ui/network-select";
import { MediaUploader } from "@/components/ui/media-uploader";
import { SchedulePicker } from "@/components/ui/schedule-picker";
import { Twitter, Linkedin, Instagram } from "lucide-react";

const schema = z.object({
  text: z.string().min(1, "Digite o texto do post").max(1000, "Máx 1000 caracteres"),
  networks: z.array(z.enum(["twitter", "linkedin", "instagram"]))
    .min(1, "Selecione ao menos uma rede"),
  mediaUrls: z.array(z.string().url()).default([]),
  scheduledAt: z.date().optional(),
});

export type ComposerForm = z.infer<typeof schema>;

export function PostComposer() {
  const [submitting, setSubmitting] = useState(false);
  const resolver = zodResolver(schema) as unknown as Resolver<ComposerForm>;
  const form = useForm<ComposerForm>({
    resolver,
    defaultValues: {
      text: "",
      networks: [],
      mediaUrls: [],
      scheduledAt: undefined,
    },
  });

  const text = form.watch("text") || "";
  const networks = form.watch("networks") || [];

  const onSubmit: SubmitHandler<ComposerForm> = async (values) => {
    setSubmitting(true);
    try {
      // Placeholder: depois integraremos com POST /posts
      console.log("compose:", values);
      toast.success("Post preparado (simulação)");
      form.reset();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao preparar post");
    } finally {
      setSubmitting(false);
    }
  }

  const twitterSelected = networks.includes("twitter");
  const twitterLimit = 280;
  const remaining = twitterLimit - text.length;
  const overLimit = twitterSelected && remaining < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Redes</label>
            <NetworkSelect value={networks} onChange={(v: Network[]) => form.setValue("networks", v, { shouldValidate: true })} />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Twitter className="h-3 w-3" /> Twitter/X</span>
              <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> LinkedIn</span>
              <span className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</span>
            </div>
            {form.formState.errors.networks && (
              <p className="text-sm text-red-500">{String(form.formState.errors.networks.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Texto</label>
            <Textarea rows={6} placeholder="O que você quer publicar?" {...form.register("text")} />
            <div className="space-y-1">
              <div className="text-xs opacity-70 flex items-center gap-2">
                <span>Tamanho: {text.length}</span>
                {twitterSelected && (
                  <span className={overLimit ? "text-red-500" : ""}>Twitter restante: {remaining}</span>
                )}
              </div>
              {twitterSelected && (
                <div className="h-1 w-full rounded bg-black/10">
                  <div className="h-1 rounded bg-blue-500" style={{ width: `${Math.min(100, Math.max(0, (text.length / twitterLimit) * 100))}%` }} />
                </div>
              )}
              {overLimit && (
                <p className="text-xs text-red-500">Seu texto excede o limite do Twitter. Ajuste para continuar.</p>
              )}
            </div>
            {form.formState.errors.text && (
              <p className="text-sm text-red-500">{String(form.formState.errors.text.message)}</p>
            )}
          </div>

          <Tabs defaultValue="media">
            <TabsList>
              <TabsTrigger value="media">Mídia</TabsTrigger>
              <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            </TabsList>
            <TabsContent value="media" className="space-y-2">
              <MediaUploader onUploaded={(urls: string[]) => form.setValue("mediaUrls", urls)} />
              <p className="text-xs text-muted-foreground">Dica: até 4 imagens no Twitter. Vídeos podem ter restrições por rede.</p>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-3">
              <SchedulePicker value={form.watch("scheduledAt")} onChange={(d?: Date) => form.setValue("scheduledAt", d)} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const d = new Date(); d.setHours(d.getHours() + 1); form.setValue("scheduledAt", d);
                }}>+1 hora</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9,0,0,0); form.setValue("scheduledAt", d);
                }}>Amanhã 09:00</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("scheduledAt", undefined)}>Limpar</Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting || overLimit}>{submitting ? "Salvando..." : "Salvar e agendar"}</Button>
            <Button type="button" variant="outline" disabled={submitting || overLimit}
              onClick={form.handleSubmit((v: ComposerForm) => onSubmit({ ...v, scheduledAt: undefined }))}
            >
              Publicar agora
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
