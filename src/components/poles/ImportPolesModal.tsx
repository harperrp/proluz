import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Pole, PoleStatus } from '@/types';
import { toast } from 'sonner';

interface CemigRow {
  MUNICIPIO?: string;
  'COD MUNICIPIO'?: string;
  LONGITUDE?: string;
  LATITUDE?: string;
  'ID PIP'?: string;
  LUMINARIA?: string;
  BRACO?: string;
  'TIPO LAMPADA'?: string;
  'POTÊNCIA'?: string;
  POTENCIA?: string;
  'QTD LÂMPADAS'?: string;
  'QTD LAMPADAS'?: string;
  [key: string]: string | undefined;
}

interface ParsedPole {
  idPip: string;
  latitude: number;
  longitude: number;
  status: PoleStatus;
  luminaria: string;
  braco: string;
  tipoLampada: string;
  potencia: string;
  qtdLampadas: string;
  valid: boolean;
  error?: string;
}

interface ImportPolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (poles: Pole[]) => void;
  existingPoleIds: string[];
}

export function ImportPolesModal({ open, onOpenChange, onImport, existingPoleIds }: ImportPolesModalProps) {
  const [parsedPoles, setParsedPoles] = useState<ParsedPole[]>([]);
  const [fileName, setFileName] = useState('');
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setParsedPoles([]);
    setFileName('');
    setStep('upload');
  };

  const handleFile = (file: File) => {
    setFileName(file.name);

    Papa.parse<CemigRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const poles: ParsedPole[] = results.data.map((row) => {
          const lat = parseFloat(String(row.LATITUDE ?? '').replace(',', '.'));
          const lng = parseFloat(String(row.LONGITUDE ?? '').replace(',', '.'));
          const idPip = String(row['ID PIP'] ?? '').trim();
          const luminaria = String(row.LUMINARIA ?? '').trim();
          const status: PoleStatus = luminaria.toLowerCase() === 'aberta' ? 'QUEIMADO' : 'FUNCIONANDO';

          const valid = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
          const error = !valid ? 'Coordenadas inválidas' : existingPoleIds.includes(idPip) ? 'ID já cadastrado' : undefined;

          return {
            idPip,
            latitude: lat,
            longitude: lng,
            status,
            luminaria,
            braco: String(row.BRACO ?? row['BRAÇO'] ?? '').trim(),
            tipoLampada: String(row['TIPO LAMPADA'] ?? row['TIPO LÂMPADA'] ?? '').trim(),
            potencia: String(row['POTÊNCIA'] ?? row.POTENCIA ?? '').trim(),
            qtdLampadas: String(row['QTD LÂMPADAS'] ?? row['QTD LAMPADAS'] ?? '').trim(),
            valid: valid && !existingPoleIds.includes(idPip),
            error,
          };
        });

        setParsedPoles(poles);
        setStep('preview');
      },
      error: () => {
        toast.error('Erro ao ler o arquivo. Verifique se é um CSV válido.');
      },
    });
  };

  const validPoles = parsedPoles.filter((p) => p.valid);
  const invalidPoles = parsedPoles.filter((p) => !p.valid);

  const handleImport = () => {
    const newPoles: Pole[] = validPoles.map((p) => ({
      id: p.idPip || `IMP-${Math.random().toString(36).substr(2, 6)}`,
      latitude: p.latitude,
      longitude: p.longitude,
      status: p.status,
      neighborhood: '',
      address: `${p.tipoLampada} ${p.potencia}W - ${p.braco}`,
      observations: `Luminária: ${p.luminaria} | Braço: ${p.braco} | Tipo: ${p.tipoLampada} | Potência: ${p.potencia}W | Qtd: ${p.qtdLampadas}`,
      cityHallId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    onImport(newPoles);
    toast.success(`${newPoles.length} postes importados com sucesso!`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Postes — Planilha CEMIG
          </DialogTitle>
          <DialogDescription>
            Envie um arquivo CSV com as colunas: LONGITUDE, LATITUDE, ID PIP, LUMINARIA, BRACO, TIPO LAMPADA, POTÊNCIA
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/30 p-12 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">Arraste o arquivo CSV aqui</p>
              <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}

        {step === 'preview' && (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <FileSpreadsheet className="h-3 w-3" /> {fileName}
              </Badge>
              <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] gap-1">
                <CheckCircle2 className="h-3 w-3" /> {validPoles.length} válidos
              </Badge>
              {invalidPoles.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" /> {invalidPoles.length} com erro
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={reset} className="ml-auto">
                <X className="h-4 w-4 mr-1" /> Trocar arquivo
              </Button>
            </div>

            <ScrollArea className="flex-1 max-h-[400px] rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID PIP</TableHead>
                    <TableHead>Lat / Lng</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo Lâmpada</TableHead>
                    <TableHead>Potência</TableHead>
                    <TableHead>Braço</TableHead>
                    <TableHead>Válido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedPoles.slice(0, 100).map((p, i) => (
                    <TableRow key={i} className={!p.valid ? 'opacity-50' : ''}>
                      <TableCell className="font-mono text-xs">{p.idPip || '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}</TableCell>
                      <TableCell>
                        <Badge className={p.status === 'FUNCIONANDO' ? 'status-badge-working' : 'status-badge-broken'}>
                          {p.status === 'FUNCIONANDO' ? 'Funcionando' : 'Queimado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{p.tipoLampada}</TableCell>
                      <TableCell className="text-xs">{p.potencia}W</TableCell>
                      <TableCell className="text-xs">{p.braco}</TableCell>
                      <TableCell>
                        {p.valid ? (
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                        ) : (
                          <span className="text-xs text-destructive">{p.error}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {parsedPoles.length > 100 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Mostrando 100 de {parsedPoles.length} registros
                </p>
              )}
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancelar</Button>
          {step === 'preview' && (
            <Button onClick={handleImport} disabled={validPoles.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Importar {validPoles.length} postes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
