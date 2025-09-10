"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NetworkSelect } from "@/components/ui/network-select";
import { MediaUploader } from "@/components/ui/media-uploader";
import { SchedulePicker } from "@/components/ui/schedule-picker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Image, 
  Send, 
  Save, 
  Eye, 
  Hash,
  AtSign,
  Link2,
  AlertCircle,
  Zap,
  Timer,
  Globe
} from "lucide-react";

import { toast } from "sonner";
import { postsApi } from "@/lib/posts-api";

const formSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório").max(2200, "Conteúdo muito longo"),
  networks: z.array(z.string()).min(1, "Selecione pelo menos uma rede social"),
  media: z.array(z.string()).optional(),
  scheduledFor: z.string().optional(),
  hashtags: z.string().optional(),
  mentions: z.string().optional(),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface PostStats {
  characterCount: number;
  wordCount: number;
  hashtagCount: number;
  mentionCount: number;
  linkCount: number;
}

interface NetworkLimits {
  [key: string]: {
    maxLength: number;
    supportsMedia: boolean;
    maxMedia: number;
    supportsScheduling: boolean;
  };
}

const networkLimits: NetworkLimits = {
  twitter: { maxLength: 280, supportsMedia: true, maxMedia: 4, supportsScheduling: true },
  facebook: { maxLength: 63206, supportsMedia: true, maxMedia: 10, supportsScheduling: true },
  instagram: { maxLength: 2200, supportsMedia: true, maxMedia: 10, supportsScheduling: true },
  linkedin: { maxLength: 3000, supportsMedia: true, maxMedia: 9, supportsScheduling: true },
  tiktok: { maxLength: 2200, supportsMedia: true, maxMedia: 1, supportsScheduling: false },
};

export function PostComposer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [postStats, setPostStats] = useState<PostStats>({
    characterCount: 0,
    wordCount: 0,
    hashtagCount: 0,
    mentionCount: 0,
    linkCount: 0,
  });
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      networks: [],
      media: [],
      scheduledFor: "",
      hashtags: "",
      mentions: "",
      link: "",
    },
  });

  const watchContent = form.watch("content");
  const watchNetworks = form.watch("networks");
  const watchMedia = form.watch("media");
  const watchScheduled = form.watch("scheduledFor");

  // Calcular estatísticas do post
  const calculateStats = useCallback((content: string) => {
    const hashtags = content.match(/#\w+/g) || [];
    const mentions = content.match(/@\w+/g) || [];
    const links = content.match(/https?:\/\/[^\s]+/g) || [];
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);

    setPostStats({
      characterCount: content.length,
      wordCount: words.length,
      hashtagCount: hashtags.length,
      mentionCount: mentions.length,
      linkCount: links.length,
    });
  }, []);

  useEffect(() => {
    calculateStats(watchContent || "");
  }, [watchContent, calculateStats]);

  // Auto-save como rascunho
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchContent && watchContent.length > 10) {
        setIsDraft(true);
        // Aqui você salvaria no localStorage ou API
        localStorage.setItem('post-draft', JSON.stringify(form.getValues()));
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [watchContent, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const postData = {
        content: data.content,
        networks: data.networks,
        mediaUrls: data.media || [],
        scheduledAt: data.scheduledFor ? new Date(data.scheduledFor).toISOString() : undefined,
      };

      await postsApi.create(postData);
      
      if (data.scheduledFor) {
        toast.success("Post agendado com sucesso!");
      } else {
        toast.success("Post publicado com sucesso!");
      }
      
      // Limpar rascunho
      localStorage.removeItem('post-draft');
      setIsDraft(false);
      
      form.reset();
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (error as { message?: string })?.message || "Erro ao criar post";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    const draftData = form.getValues();
    localStorage.setItem('post-draft', JSON.stringify(draftData));
    setIsDraft(true);
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('post-draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      form.reset(draftData);
    }
  };

  // Verificar limites por rede social
  const getNetworkWarnings = () => {
    const warnings: string[] = [];
    const selectedNetworks = watchNetworks || [];
    const mediaCount = (watchMedia || []).length;

    selectedNetworks.forEach(network => {
      const limits = networkLimits[network];
      if (limits) {
        if (postStats.characterCount > limits.maxLength) {
          warnings.push(`${network}: Excede limite de ${limits.maxLength} caracteres`);
        }
        if (mediaCount > limits.maxMedia) {
          warnings.push(`${network}: Excede limite de ${limits.maxMedia} mídias`);
        }
        if (watchScheduled && !limits.supportsScheduling) {
          warnings.push(`${network}: Não suporta agendamento`);
        }
      }
    });

    return warnings;
  };

  const warnings = getNetworkWarnings();
  const hasWarnings = warnings.length > 0;

  // Calcular progresso de preenchimento
  const getCompletionProgress = () => {
    let completed = 0;
    const total = 4;

    if (watchContent && watchContent.length > 0) completed++;
    if (watchNetworks && watchNetworks.length > 0) completed++;
    if (watchMedia && watchMedia.length > 0) completed++;
    if (watchScheduled) completed++;

    return (completed / total) * 100;
  };

  const completionProgress = getCompletionProgress();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Criar Post
            {isDraft && (
              <Badge variant="secondary" className="ml-2">
                <Save className="h-3 w-3 mr-1" />
                Rascunho salvo
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={loadDraft}
            >
              Carregar Rascunho
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso do post</span>
            <span className="font-medium">{Math.round(completionProgress)}%</span>
          </div>
          <Progress value={completionProgress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        {previewMode ? (
          // Preview Mode
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Visualização do Post</h3>
              <div className="whitespace-pre-wrap text-sm">
                {watchContent || "Nenhum conteúdo ainda..."}
              </div>
              {watchMedia && watchMedia.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {watchMedia.map((media, index) => (
                    <div key={index} className="w-16 h-16 bg-muted rounded border flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Network Previews */}
            {watchNetworks && watchNetworks.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Como aparecerá em cada rede:</h4>
                {watchNetworks.map(network => {
                  const limits = networkLimits[network];
                  const truncated = limits && watchContent && watchContent.length > limits.maxLength;
                  const displayContent = truncated 
                    ? watchContent.substring(0, limits.maxLength) + "..."
                    : watchContent;
                  
                  return (
                    <div key={network} className="border rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{network}</span>
                        {truncated && (
                          <Badge variant="destructive" className="text-xs">
                            Truncado
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground">{displayContent}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Edit Mode
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="O que você quer compartilhar?"
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center text-sm">
                          <FormMessage />
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className={postStats.characterCount > 2000 ? "text-destructive" : ""}>
                              {postStats.characterCount}/2200
                            </span>
                            <span>{postStats.wordCount} palavras</span>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hashtags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Hashtags
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="#marketing #social"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mentions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <AtSign className="h-4 w-4" />
                            Menções
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@usuario @empresa"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Link2 className="h-4 w-4" />
                          Link
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://exemplo.com"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Mídia
                        </FormLabel>
                        <FormControl>
                          <MediaUploader
                            value={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="networks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Redes Sociais
                        </FormLabel>
                        <FormControl>
                          <NetworkSelect
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheduledFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Agendamento
                        </FormLabel>
                        <FormControl>
                          <SchedulePicker
                            value={field.value ? new Date(field.value) : undefined}
                            onChange={(date) => field.onChange(date?.toISOString())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Post Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Caracteres:</span>
                        <span>{postStats.characterCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Palavras:</span>
                        <span>{postStats.wordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hashtags:</span>
                        <span>{postStats.hashtagCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Menções:</span>
                        <span>{postStats.mentionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Links:</span>
                        <span>{postStats.linkCount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Warnings */}
                  {hasWarnings && (
                    <Card className="border-destructive">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          Avisos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {warnings.map((warning, index) => (
                          <div key={index} className="text-sm text-destructive">
                            {warning}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Rascunho
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || hasWarnings}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {watchScheduled ? "Agendando..." : "Publicando..."}
                    </>
                  ) : (
                    <>
                      {watchScheduled ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Agendar Post
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Publicar Agora
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
