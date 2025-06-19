'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface CreateModalidadeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateModalidadeDialog({
  open,
  onOpenChange,
}: CreateModalidadeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the modalidade
    console.log('Creating modalidade:', formData);
    onOpenChange(false);
    // Reset form
    setFormData({ name: '', description: '', status: 'active' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-blue-900'>Nova Modalidade</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome da Modalidade</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Ex: Karate-Do, Kendo, Arqueria...'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Descreva a modalidade...'
              rows={3}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Ativa</SelectItem>
                <SelectItem value='inactive'>Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' className='bg-primary hover:bg-primary/90'>
              Criar Modalidade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
