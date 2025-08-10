"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { NetworkSelect, type Network } from "@/components/ui/network-select";
import { MediaUploader } from "@/components/ui/media-uploader";
import { SchedulePicker } from "@/components/ui/schedule-picker";

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
  const form = useForm<ComposerForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      networks: [],
      mediaUrls: [],
      scheduledAt: undefined,
    },
  });

  const text = form.watch("text") || "";
  const networks = form.watch("networks") || [];

  async function onSubmit(values: ComposerForm) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Redes</label>
            <NetworkSelect value={networks} onChange={(v: Network[]) => form.setValue("networks", v, { shouldValidate: true })} />
            {form.formState.errors.networks && (
              <p className="text-sm text-red-500">{String(form.formState.errors.networks.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm">Texto</label>
            <Textarea rows={6} placeholder="O que você quer publicar?" {...form.register("text")} />
            <div className="text-xs opacity-70 flex items-center gap-2">
              <span>Tamanho: {text.length}</span>
              {twitterSelected && (
                <span className={remaining < 0 ? "text-red-500" : ""}>Twitter restante: {remaining}</span>
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
            </TabsContent>
            <TabsContent value="schedule" className="space-y-2">
              <SchedulePicker value={form.watch("scheduledAt")} onChange={(d?: Date) => form.setValue("scheduledAt", d)} />
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting}>Salvar e agendar</Button>
            <Button type="button" variant="outline" disabled={submitting}
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
