import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { _ } from '@/utils/i18n'
interface SaveSearchDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (saveName: string) => void;
}

export default function SaveSearchDialog({ open, onClose, onSave }: SaveSearchDialogProps) {
    const [searchName, setSearchName] = useState("");
    const [error, setError] = useState(""); 

    const handleSaveSearch = () => {
        if (searchName.length > 255) {
            const messageError:  string = _("Le nom de la recherche ne doit pas dépasser 255 caractères");
            setError(messageError);
        } else {
            onSave(searchName);
            setSearchName("");
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{_("Saisir le nom de la recherche")}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nom de la recherche"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    error={error !== ""}
                    helperText={error} 
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{_("Annuler")}</Button>
                <Button onClick={handleSaveSearch}>{_("Sauvegarder")}</Button>
            </DialogActions>
        </Dialog>
    );
}
