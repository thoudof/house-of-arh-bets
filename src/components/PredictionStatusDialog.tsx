import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUpdatePredictionStatus } from '@/hooks/api/useUpdatePredictionStatus';
import type { Prediction } from '@/types';

interface PredictionStatusDialogProps {
  prediction: Prediction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PredictionStatusDialog = ({ prediction, open, onOpenChange }: PredictionStatusDialogProps) => {
  const [status, setStatus] = useState<'win' | 'loss' | 'cancelled'>('win');
  const [profit, setProfit] = useState<string>('');
  const updateStatus = useUpdatePredictionStatus();

  const handleSubmit = () => {
    const profitValue = status === 'win' 
      ? Number(profit) || (prediction.stake ? prediction.stake * (prediction.coefficient - 1) : 0)
      : status === 'loss' 
      ? -(prediction.stake || 0)
      : 0;

    updateStatus.mutate({
      id: prediction.id,
      status,
      profit: profitValue
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setProfit('');
        setStatus('win');
      }
    });
  };

  const calculateExpectedProfit = () => {
    if (!prediction.stake) return 0;
    return status === 'win' 
      ? prediction.stake * (prediction.coefficient - 1)
      : status === 'loss' 
      ? -prediction.stake
      : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Проставить результат</DialogTitle>
          <DialogDescription>
            Установите результат для прогноза "{prediction.event}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label>Результат</Label>
            <RadioGroup value={status} onValueChange={(value: 'win' | 'loss' | 'cancelled') => setStatus(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="win" id="win" />
                <Label htmlFor="win" className="text-success">Выигрыш</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loss" id="loss" />
                <Label htmlFor="loss" className="text-destructive">Проигрыш</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <Label htmlFor="cancelled" className="text-muted-foreground">Возврат</Label>
              </div>
            </RadioGroup>
          </div>

          {status === 'win' && (
            <div className="space-y-2">
              <Label htmlFor="profit">Прибыль (₽)</Label>
              <Input
                id="profit"
                type="number"
                placeholder={`Ожидаемая: ${calculateExpectedProfit()}`}
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Ставка: {prediction.stake || 0} ₽ × Коэф: {prediction.coefficient} = {calculateExpectedProfit()} ₽
              </p>
            </div>
          )}

          {status !== 'cancelled' && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm">
                <span className="text-muted-foreground">Изменение баланса: </span>
                <span className={status === 'win' ? 'text-success' : 'text-destructive'}>
                  {status === 'win' ? '+' : ''}{calculateExpectedProfit()} ₽
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={updateStatus.isPending}>
            {updateStatus.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};