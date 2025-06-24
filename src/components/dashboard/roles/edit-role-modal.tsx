import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Role } from '@/types/user';
import { EditRoleForm } from './edit-role-form';

interface EditRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function EditRoleModal({
  isOpen,
  onOpenChange,
  role,
}: EditRoleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar Papel</DialogTitle>
          <DialogDescription>
            Atualize as informações do papel
          </DialogDescription>
        </DialogHeader>
        {role && (
          <EditRoleForm role={role} onSuccess={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
