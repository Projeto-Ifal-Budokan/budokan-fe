'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useManageUsers } from '@/lib/api/queries/use-manage-users';
import { User } from '@/types/user';
import { Camera, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess?: () => void;
}

export function AvatarUploadModal({
  isOpen,
  onOpenChange,
  user,
  onSuccess,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatar } = useManageUsers();

  const getInitials = (firstName: string, surname: string) => {
    if (!firstName || !surname) return '';
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  // Clean up preview URL when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, previewUrl]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Tipo de arquivo inválido', {
        description: 'Por favor, selecione apenas arquivos de imagem.',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: 'Por favor, selecione uma imagem menor que 5MB.',
      });
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await updateAvatar.mutateAsync({
        id: user.id.toString(),
        profileImage: selectedFile,
      });

      toast.success('Avatar atualizado', {
        description: 'Sua foto de perfil foi atualizada com sucesso.',
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar avatar', {
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onOpenChange(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Camera className='h-5 w-5' />
            Atualizar Foto de Perfil
          </DialogTitle>
          <DialogDescription>
            Escolha uma nova foto para o seu perfil. Tamanho máximo: 5MB
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Current/Preview Avatar */}
          <div className='flex justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage
                src={previewUrl || user?.profileImageUrl || ''}
                alt={`${user?.firstName} ${user?.surname}`}
              />
              <AvatarFallback className='bg-blue-900 text-2xl text-white'>
                {getInitials(user?.firstName, user?.surname)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* File Upload Area */}
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {selectedFile ? (
              <div className='space-y-2'>
                <ImageIcon className='mx-auto h-12 w-12 text-green-500' />
                <p className='text-sm font-medium text-green-700'>
                  {selectedFile.name}
                </p>
                <p className='text-xs text-gray-500'>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                >
                  <X className='mr-1 h-4 w-4' />
                  Remover
                </Button>
              </div>
            ) : (
              <div className='space-y-2'>
                <Upload className='mx-auto h-12 w-12 text-gray-400' />
                <p className='text-sm font-medium'>
                  Clique aqui ou arraste uma imagem
                </p>
                <p className='text-xs text-gray-500'>PNG, JPG, JPEG até 5MB</p>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || updateAvatar.isPending}
          >
            {updateAvatar.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Enviando...
              </>
            ) : (
              <>
                <Upload className='mr-2 h-4 w-4' />
                Atualizar Avatar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
